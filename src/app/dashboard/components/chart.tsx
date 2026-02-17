type UsageLog = {
  id?: string;
  feature: string;
  count: number;
  created_at?: string;
}[] | null;

export function UsageChart({ data }: { data: UsageLog }) {
  const list = data ?? [];
  const byFeature = list.reduce<Record<string, number>>((acc, u) => {
    acc[u.feature] = (acc[u.feature] ?? 0) + (u.count ?? 1);
    return acc;
  }, {});
  const entries = Object.entries(byFeature);

  return (
    <div className="bg-white dark:bg-zinc-900/80 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Usage by feature
      </h3>
      {entries.length === 0 ? (
        <p className="text-gray-500 dark:text-zinc-400 text-sm">
          No usage data yet.
        </p>
      ) : (
        <div className="space-y-3">
          {entries.map(([feature, count]) => (
            <div key={feature} className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700 dark:text-zinc-300 w-32 truncate">
                {feature}
              </span>
              <div className="flex-1 h-6 bg-gray-100 dark:bg-zinc-800 rounded overflow-hidden">
                <div
                  className="h-full bg-blue-500 dark:bg-blue-600 rounded"
                  style={{
                    width: `${Math.min(100, (count / Math.max(...Object.values(byFeature), 1)) * 100)}%`,
                  }}
                />
              </div>
              <span className="text-sm text-gray-500 dark:text-zinc-400 w-8">
                {count}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
