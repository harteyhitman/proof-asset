'use client'

import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-zinc-950">
      <div className="max-w-md text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Something went wrong</h1>
        <p className="text-gray-600 dark:text-zinc-400 mb-8">{error.message}</p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  );
}