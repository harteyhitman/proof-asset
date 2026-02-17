import Link from "next/link";
import { Button } from "@/components/ui/button";

type Subscription = {
  id: string;
  status: string;
  current_period_end?: string | null;
  cancel_at_period_end?: boolean | null;
} | null;

export function SubscriptionCard({
  subscription,
}: {
  subscription: Subscription;
}) {
  if (!subscription) {
    return (
      <div className="bg-white dark:bg-zinc-900/80 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Subscription
        </h3>
        <p className="text-gray-600 dark:text-zinc-400 text-sm mb-4">
          You don&apos;t have an active subscription.
        </p>
        <Link href="/pricing">
          <Button className="w-full">View plans</Button>
        </Link>
      </div>
    );
  }

  const endDate = subscription.current_period_end
    ? new Date(subscription.current_period_end).toLocaleDateString()
    : "—";

  return (
    <div className="bg-white dark:bg-zinc-900/80 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Subscription
      </h3>
      <p className="text-sm text-gray-600 dark:text-zinc-400 mb-1">
        Status:{" "}
        <span
          className={
            subscription.status === "active"
              ? "text-emerald-600 dark:text-emerald-400 font-medium"
              : "text-amber-600 dark:text-amber-400 font-medium"
          }
        >
          {subscription.status}
        </span>
      </p>
      <p className="text-sm text-gray-600 dark:text-zinc-400 mb-1">
        Renews: {endDate}
      </p>
      {subscription.cancel_at_period_end && (
        <p className="text-sm text-amber-600 dark:text-amber-400 mb-4">
          Cancels at period end
        </p>
      )}
      <Link href="/pricing">
        <Button variant="outline" className="w-full" size="sm">
          Manage plan
        </Button>
      </Link>
    </div>
  );
}
