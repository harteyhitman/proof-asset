import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { createServerSupabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    console.error("CLERK_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  const body = await req.text();
  const headersList = await req.headers;
  const svixId = headersList.get("svix-id");
  const svixTimestamp = headersList.get("svix-timestamp");
  const svixSignature = headersList.get("svix-signature");
  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json(
      { error: "Missing svix headers" },
      { status: 400 }
    );
  }

  const wh = new Webhook(secret);
  let msg: { type: string; data: Record<string, unknown> };
  try {
    msg = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as { type: string; data: Record<string, unknown> };
  } catch (err) {
    return NextResponse.json(
      { error: "Webhook verification failed" },
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
  const data = msg.data as {
    id?: string;
    email_addresses?: { email_address: string }[];
    first_name?: string;
    last_name?: string;
  };

  try {
    switch (msg.type) {
      case "user.created":
      case "user.updated": {
        const email = data.email_addresses?.[0]?.email_address;
        const { data: newUser, error } = await supabase
          .from("users")
          .upsert(
            {
              clerk_id: data.id,
              email,
              name:
                [data.first_name, data.last_name]
                  .filter(Boolean)
                  .join(" ")
                  .trim() || null,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "clerk_id" }
          )
          .select("id")
          .single();

        if (error) {
          console.error("Error creating user:", error);
          break;
        }

        if (msg.type === "user.created" && newUser) {
          await supabase.from("subscriptions").insert({
            user_id: newUser.id,
            status: "free", // Or any other status for a free plan
          });
        }

        break;
      }
      case "user.deleted": {
        if (data.id) {
          await supabase.from("users").delete().eq("clerk_id", data.id);
        }
        break;
      }
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Clerk webhook error:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
