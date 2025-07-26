interface StatsData {
  source: string;
  numberOfTendersAddedDaily: number;
  numberOfTendersAvailable: number;
  description?: string;
}

interface TableStatsGridProps {
  stats: StatsData[];
}

export default function TableStatsGrid({ stats }: TableStatsGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((item, index) => (
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
            added today
            <span className="text-text-light">
              {item.numberOfTendersAvailable}
            </span>{" "}
            available
          </div>{" "}
        </div>
      ))}
    </div>
  );
}
