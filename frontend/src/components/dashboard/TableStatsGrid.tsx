interface StatsData {
  source: string;
  numberOfTendersAddedDaily: number;
  numberOfTendersAvailable: number;
  description?: string;
}

interface TableStatsGridProps {
  stats: StatsData[];
  loading?: boolean;
}

export default function TableStatsGrid({
  stats,
  loading = false,
}: TableStatsGridProps) {
  if (loading) {
    return (
      <div className="bg-surface border border-border rounded-lg p-4 min-w-[200px] animate-pulse">
        <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
        <div className="h-8 bg-gray-200 rounded mb-2 w-1/2"></div>
        <div className="h-3 bg-gray-200 rounded w-full"></div>
      </div>
    );
  }

  // Guard against invalid stats data
  if (!Array.isArray(stats)) {
    console.error("TableStatsGrid: stats is not an array", stats);
    return null;
  }

  // Calculate totals
  const totalAddedToday = stats.reduce(
    (sum, stat) => sum + (stat.numberOfTendersAddedDaily || 0),
    0
  );
  const totalAvailable = stats.reduce(
    (sum, stat) => sum + (stat.numberOfTendersAvailable || 0),
    0
  );

  return (
    <div className="bg-surface border border-border rounded-lg p-4 min-w-[200px] hover:border-primary hover:bg-primary/5 transition-all">
      <div className="text-xs font-semibold text-text-muted mb-3">
        Total Tenders
      </div>
      <div className="flex items-baseline gap-2 mb-3">
        <span
          className={`text-3xl font-bold ${
            totalAddedToday > 0 ? "text-primary" : "text-text"
          }`}
        >
          {totalAddedToday}
        </span>
        <span className="text-xs text-text-light">added today</span>
      </div>
      <div className="text-sm">
        <span className="font-semibold text-text">{totalAvailable}</span>
        <span className="text-text-light ml-1">available</span>
      </div>
    </div>
  );
}
