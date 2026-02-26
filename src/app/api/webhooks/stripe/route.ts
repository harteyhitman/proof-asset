import { NextResponse } from "next/server";
import { headers } from "next/headers";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe/server";
import { createServerSupabaseAdmin } from "@/lib/supabase/admin";
import { sendWelcomeEmail } from "@/lib/email/service";
import { sendPaymentReceipt } from "@/lib/email/service";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");
  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature" },
      { status: 400 }
    );
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  const stripe = getStripe();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch (err) {
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  const supabase = createServerSupabaseAdmin();
  if (!supabase) {
    console.error("Supabase not configured");
    return NextResponse.json(
      { error: "Server misconfigured. Add Supabase credentials." },
      { status: 503 }
    );
  }

  try {
    console.log(`Received Stripe event: ${event.type} (ID: ${event.id})`);
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session, supabase);
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionChange(subscription, supabase);
        break;
      }
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(invoice, supabase);
        break;
      }
      default:
        console.warn(`Unhandled Stripe event type: ${event.type} (ID: ${event.id})`);
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(`Error handling Stripe event ${event.type} (ID: ${event.id}):`, error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session,
  supabase: NonNullable<ReturnType<typeof createServerSupabaseAdmin>>
) {
  const userId = session.client_reference_id as string | undefined;
  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id;

  if (!userId) {
    console.error("User ID not found in checkout session");
    return;
  }

  const stripe = getStripe();
  const subscription = subscriptionId
    ? await stripe.subscriptions.retrieve(subscriptionId)
    : null;
  const firstItem = subscription?.items?.data?.[0];
  const priceId = firstItem?.price?.id ?? null;
  const periodStart = firstItem?.current_period_start;
  const periodEnd = firstItem?.current_period_end;

  await supabase.from("subscriptions").upsert(
    {
      user_id: userId,
      stripe_subscription_id: subscriptionId ?? null,
      stripe_customer_id:
        typeof session.customer === "string"
          ? session.customer
          : session.customer?.id ?? null,
      stripe_price_id: priceId,
      status: subscription?.status ?? "active",
      current_period_start: periodStart
        ? new Date(periodStart * 1000).toISOString()
        : null,
      current_period_end: periodEnd
        ? new Date(periodEnd * 1000).toISOString()
        : null,
      cancel_at_period_end: subscription?.cancel_at_period_end ?? false,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "stripe_subscription_id" }
  );

  const role = priceId ? "pro" : "free";
  await supabase.from("users").update({ role }).eq("id", userId);

  if (session.customer_email) {
    await sendWelcomeEmail(session.customer_email);
  }
}

async function handleSubscriptionChange(
  subscription: Stripe.Subscription,
  supabase: NonNullable<ReturnType<typeof createServerSupabaseAdmin>>
) {
  const firstItem = subscription?.items?.data?.[0];
  const periodStart = firstItem?.current_period_start;
  const periodEnd = firstItem?.current_period_end;
  const priceId = firstItem?.price?.id ?? null;

  const { data: subscriptionData, error } = await supabase
    .from("subscriptions")
    .upsert(
      {
        status: subscription.status,
        current_period_start: periodStart
          ? new Date(periodStart * 1000).toISOString()
          : undefined,
        current_period_end: periodEnd
          ? new Date(periodEnd * 1000).toISOString()
          : undefined,
        cancel_at_period_end: subscription.cancel_at_period_end,
        updated_at: new Date().toISOString(),
        stripe_subscription_id: subscription.id,
      },
      { onConflict: "stripe_subscription_id" }
    )
    .select("user_id")
    .single();

  if (error) {
    console.error("Error upserting subscription:", error);
    return;
  }

  if (subscriptionData) {
    const role = priceId ? "pro" : "free";
    await supabase
      .from("users")
      .update({ role })
      .eq("id", subscriptionData.user_id);
  }
}

async function handlePaymentSucceeded(
  invoice: Stripe.Invoice,
  supabase: NonNullable<ReturnType<typeof createServerSupabaseAdmin>>
) {
  const amount = invoice.amount_paid ? invoice.amount_paid / 100 : 0;
  const date = invoice.created
    ? new Date(invoice.created * 1000).toISOString()
    : new Date().toISOString();
  const email =
    typeof invoice.customer_email === "string"
      ? invoice.customer_email
      : null;
  if (email) {
    await sendPaymentReceipt(email, amount, date);
  }
}
