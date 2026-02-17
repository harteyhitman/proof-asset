import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Check } from "lucide-react";
import { PRODUCTS } from "@/lib/stripe/products";
import { PricingCheckoutButton } from "./pricing-checkout-button";

export default async function PricingPage() {
  const { userId } = await auth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-zinc-950 dark:to-zinc-900">
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto border-b border-gray-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-10">
        <Link
          href="/"
          className="text-2xl font-bold text-gray-900 dark:text-white"
        >
          ProofAsset
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {userId ? (
            <Link href="/dashboard">
              <Button>Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link href="/sign-in">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button>Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </nav>

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white">
            Simple, Transparent Pricing
          </h1>
          <p className="text-center text-gray-600 dark:text-zinc-400 mb-12">
            Choose the plan that fits your needs.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-xl bg-gray-50 dark:bg-zinc-900/80 border border-gray-200 dark:border-zinc-800">
              <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                {PRODUCTS.basic.name}
              </h2>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                  $29
                </span>
                <span className="text-gray-500 dark:text-zinc-500">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {PRODUCTS.basic.features.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-gray-700 dark:text-zinc-300"
                  >
                    <Check className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <PricingCheckoutButton
                priceId={PRODUCTS.basic.priceId}
                disabled={!PRODUCTS.basic.priceId}
                tier="basic"
              />
            </div>
            <div className="p-8 rounded-xl bg-gray-900 dark:bg-zinc-800 text-white ring-2 ring-blue-500 dark:ring-blue-400 shadow-lg shadow-blue-500/10">
              <h2 className="text-2xl font-bold mb-2">
                {PRODUCTS.pro.name}
              </h2>
              <div className="mb-6">
                <span className="text-4xl font-bold">$79</span>
                <span className="text-gray-400 dark:text-zinc-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {PRODUCTS.pro.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <PricingCheckoutButton
                priceId={PRODUCTS.pro.priceId}
                disabled={!PRODUCTS.pro.priceId}
                tier="pro"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
