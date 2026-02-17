"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export function PricingCheckoutButton({
  priceId,
  disabled,
  tier,
}: {
  priceId: string;
  disabled: boolean;
  tier: string;
}) {
  const [loading, setLoading] = useState(false);
  const { isSignedIn } = useAuth();
  const router = useRouter();

  async function handleCheckout() {
    if (!priceId) {
      toast.error("Price not configured. Add STRIPE_BASIC_PRICE_ID / STRIPE_PRO_PRICE_ID to env.");
      return;
    }
    if (!isSignedIn) {
      router.push("/sign-up?redirect_url=/pricing");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Checkout failed");
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("No checkout URL returned");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      className="w-full"
      onClick={handleCheckout}
      disabled={disabled || loading}
    >
      {loading ? "Redirecting…" : `Get ${tier}`}
    </Button>
  );
}
