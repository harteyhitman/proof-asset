import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

type User = {
  firstName?: string | null;
  lastName?: string | null;
  emailAddresses?: { emailAddress?: string }[];
} | null;

export function DashboardHeader({ user }: { user: User }) {
  return (
    <header className="border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="text-xl font-bold text-gray-900 dark:text-white"
        >
          ProofAsset
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/pricing">
            <Button variant="ghost" size="sm">
              Pricing
            </Button>
          </Link>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "w-9 h-9",
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}
