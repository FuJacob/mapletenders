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

export default function TableStatsGrid({ stats, loading = false }: TableStatsGridProps) {
  const predefinedSources = [
    "City of Mississauga",
    "City of Brampton", 
    "City of Hamilton",
    "City of London",
    "City of Toronto",
    "Government of Canada",
    "Quebec Province",
    "Ontario Province"
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {predefinedSources.slice(0, 8).map((_, index) => (
          <div
            key={index}
            className="bg-surface border border-border rounded-lg p-3 animate-pulse"
          >
            <div className="h-3 bg-gray-200 rounded mb-2 w-3/4"></div>
            <div className="flex items-center justify-between">
              <div className="h-6 bg-gray-200 rounded w-8"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Guard against invalid stats data
  if (!Array.isArray(stats)) {
    console.error("TableStatsGrid: stats is not an array", stats);
    return null;
  }

  // Create a map of stats for easy lookup
  const statsMap = new Map(stats.map(stat => [stat.source, stat]));

  // Show all predefined sources with their data or zeros if no data
  const displayStats = predefinedSources.map(source => {
    const statData = statsMap.get(source);
    return {
      source,
      numberOfTendersAddedDaily: statData?.numberOfTendersAddedDaily || 0,
      numberOfTendersAvailable: statData?.numberOfTendersAvailable || 0
    };
  });

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {displayStats.map((item, index) => (
        <div
          key={index}
          className="bg-surface border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all group p-3"
        >
          <div className="text-xs font-semibold text-text mb-2">
            {item.source}
          </div>
          <div className="flex items-center justify-between">
            <span
              className={`text-xl font-bold transition-colors mb-1 ${
                item.numberOfTendersAddedDaily > 0
                  ? "text-primary"
                  : "text-text"
              }`}
            >
              {item.numberOfTendersAddedDaily}
            </span>
            <div className="text-xs text-text-light">
              <div>added today</div>
              <div>
                <span className="font-semibold text-text">
                  {item.numberOfTendersAvailable}
                </span>{" "}
                available
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
