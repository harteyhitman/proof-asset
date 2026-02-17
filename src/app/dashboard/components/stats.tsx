type UsageLog = {
  id?: string;
  feature: string;
  count: number;
  created_at?: string;
}[] | null;

export function StatsCards({ usage }: { usage: UsageLog }) {
  const total = usage?.reduce((acc, u) => acc + (u.count ?? 1), 0) ?? 0;
  const features = usage?.length ?? 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="bg-white dark:bg-zinc-900/80 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
        <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">
          Total usage
        </p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
          {total}
        </p>
      </div>
      <div className="bg-white dark:bg-zinc-900/80 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
        <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">
          Features used
        </p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
          {features}
        </p>
      </div>
      <div className="bg-white dark:bg-zinc-900/80 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
        <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">
          Status
        </p>
        <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
          Active
        </p>
      </div>
    </div>
  );
}
