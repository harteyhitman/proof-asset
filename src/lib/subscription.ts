
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { auth, clerkClient } from "@clerk/nextjs/server";

const DAY_IN_MS = 86_400_000;

export async function getUserSubscriptionStatus(userId: string) {
  const { sessionClaims } = await auth();

  if (sessionClaims?.subscription_status) {
    return {
      isSubscribed: true,
      isPro: sessionClaims.subscription_status === "pro",
      subscription: null, // Not fetching from DB, so this is null
    };
  }

  const supabase = await createServerSupabaseClient();

  const { data: subscription, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .in("status", ["active", "trialing", "free"])
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching subscription:", error);
    return {
      isSubscribed: false,
      isPro: false,
      subscription: null,
    };
  }

  if (!subscription) {
    return {
      isSubscribed: false,
      isPro: false,
      subscription: null,
    };
  }

  const isPro =
    (subscription.status === "active" || subscription.status === "trialing") &&
    !!subscription.stripe_price_id &&
    subscription.current_period_end &&
    new Date(subscription.current_period_end).getTime() + DAY_IN_MS > Date.now();

  const subscriptionStatus = isPro ? "pro" : "free";
  const clerk = await clerkClient();
  await clerk.users.updateUserMetadata(userId, {
    publicMetadata: {
      subscription_status: subscriptionStatus,
    },
  });

  return {
    isSubscribed: !!subscription,
    isPro: isPro,
    subscription,
  };
}
