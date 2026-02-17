import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { ArrowRight, Check, Zap, Shield, Rocket } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-zinc-950 dark:to-zinc-900">
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto border-b border-gray-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          ProofAsset
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/sign-in">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link href="/sign-up">
            <Button>Get Started</Button>
          </Link>
        </div>
      </nav>

      <section className="px-6 pt-20 pb-24 max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
          Build Your SaaS in{" "}
          <span className="bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 bg-clip-text text-transparent">
            7 Days
          </span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-zinc-400 mb-10 max-w-2xl mx-auto">
          The complete starter kit for launching your SaaS product with
          authentication, payments, and a beautiful dashboard.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/sign-up">
            <Button size="lg" className="gap-2">
              Start Building <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </Link>
        </div>
      </section>

      <section id="features" className="py-20 bg-gray-50/80 dark:bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Everything You Need to Launch
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div
                key={i}
                className="bg-white dark:bg-zinc-900/80 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 hover:border-gray-200 dark:hover:border-zinc-700 transition-colors"
              >
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 rounded-lg flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-zinc-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Simple, Transparent Pricing
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <PricingCard
              name="Basic"
              price="$29"
              features={[
                "Core features",
                "Basic support",
                "1 project",
                "API access",
              ]}
            />
            <PricingCard
              name="Pro"
              price="$79"
              features={[
                "All Basic features",
                "Priority support",
                "Unlimited projects",
                "Advanced analytics",
                "Team members",
              ]}
              highlighted
            />
          </div>
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    icon: <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
    title: "Lightning Fast",
    description:
      "Built with Next.js and Turbopack for optimal performance",
  },
  {
    icon: <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
    title: "Secure by Default",
    description:
      "Authentication with Clerk and secure payment processing",
  },
  {
    icon: <Rocket className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
    title: "Production Ready",
    description:
      "Full Stripe integration with webhooks and email receipts",
  },
];

function PricingCard({
  name,
  price,
  features,
  highlighted,
}: {
  name: string;
  price: string;
  features: string[];
  highlighted?: boolean;
}) {
  return (
    <div
      className={`p-8 rounded-xl transition-colors ${
        highlighted
          ? "bg-gray-900 dark:bg-zinc-800 text-white ring-2 ring-blue-500 dark:ring-blue-400 shadow-lg shadow-blue-500/10 dark:shadow-blue-400/10"
          : "bg-gray-50 dark:bg-zinc-900/80 border border-gray-200 dark:border-zinc-800"
      }`}
    >
      <h3 className="text-2xl font-bold mb-2">{name}</h3>
      <div className="mb-6">
        <span className="text-4xl font-bold">{price}</span>
        <span
          className={
            highlighted
              ? "text-gray-400 dark:text-zinc-400"
              : "text-gray-500 dark:text-zinc-500"
          }
        >
          /month
        </span>
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature: string, i: number) => (
          <li key={i} className="flex items-center gap-2">
            <Check className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
      <Link href="/pricing">
        <Button
          className="w-full"
          variant={highlighted ? "default" : "outline"}
        >
          Get Started
        </Button>
      </Link>
    </div>
  );
}
