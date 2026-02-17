import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createServerSupabaseAdmin } from "@/lib/supabase/admin";
import { DashboardHeader } from "./components/header";
import { StatsCards } from "./components/stats";
import { UsageChart } from "./components/chart";
import { SubscriptionCard } from "./components/subscription";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();
  const admin = createServerSupabaseAdmin();

  let dbUser: { id: string } | null = null;
  let subscription: {
    id: string;
    status: string;
    current_period_end?: string | null;
    cancel_at_period_end?: boolean | null;
  } | null = null;
  let usage: { feature: string; count: number; created_at?: string }[] | null = null;

  if (admin) {
    const userRes = await admin
      .from("users")
      .select("*")
      .eq("clerk_id", userId)
      .single();
    dbUser = userRes.data;

    if (!dbUser && user) {
      const email = user.emailAddresses?.[0]?.emailAddress;
      const name = [user.firstName, user.lastName].filter(Boolean).join(" ").trim() || null;
      if (email) {
        const { data: inserted } = await admin
          .from("users")
          .upsert(
            {
              clerk_id: userId,
              email,
              name: name || null,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "clerk_id" }
          )
          .select("id")
          .single();
        if (inserted) {
          const refetch = await admin
            .from("users")
            .select("*")
            .eq("id", inserted.id)
            .single();
          dbUser = refetch.data;
        }
      }
    }

    if (dbUser?.id) {
      const [subRes, usageRes] = await Promise.all([
        admin
          .from("subscriptions")
          .select("*")
          .eq("user_id", dbUser.id)
          .maybeSingle(),
        admin
          .from("usage_logs")
          .select("*")
          .eq("user_id", dbUser.id)
          .order("created_at", { ascending: false })
          .limit(30),
      ]);
      subscription = subRes.data;
      usage = usageRes.data;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      <DashboardHeader user={user} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {!admin && (
          <div className="mb-6 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/50 px-4 py-3 text-amber-800 dark:text-amber-200 text-sm">
            Add <code className="font-mono">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code className="font-mono">SUPABASE_SERVICE_ROLE_KEY</code> to your{" "}
            <code className="font-mono">.env</code> or <code className="font-mono">.env.local</code> to
            enable dashboard data and user sync.
          </div>
        )}
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Dashboard
        </h1>

        <div className="grid gap-8">
          <StatsCards usage={usage} />

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <UsageChart data={usage} />
            </div>
            <div>
              <SubscriptionCard subscription={subscription} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
