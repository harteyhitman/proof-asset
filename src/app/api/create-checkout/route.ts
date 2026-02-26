import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getStripe } from "@/lib/stripe/server";
import { createServerSupabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { priceId, successUrl, cancelUrl } = (await req.json()) as {
      priceId?: string;
      successUrl?: string;
      cancelUrl?: string;
    };

    if (!priceId) {
      return NextResponse.json(
        { error: "priceId is required" },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json(
        { error: "Server misconfigured. Add Supabase credentials to .env." },
        { status: 503 }
      );
    }
    let { data: user } = await supabase
      .from("users")
      .select("id, email")
      .eq("clerk_id", userId)
      .single();

    if (!user) {
      return NextResponse.json(
        { error: "User not found. Please complete sign up first." },
        { status: 404 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url:
        successUrl ?? `${baseUrl}/dashboard?success=true`,
      cancel_url: cancelUrl ?? `${baseUrl}/pricing?canceled=true`,
      customer_email: user.email ?? undefined,
      client_reference_id: user.id,
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
