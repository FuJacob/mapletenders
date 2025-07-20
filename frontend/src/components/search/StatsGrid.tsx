import { Lightning, Bookmark, Bell, Clock } from "@phosphor-icons/react";

interface StatsData {
  newTenders: number;
  bookmarks: number;
  activeAlerts: number;
  deadlinesThisWeek: number;
}

interface StatsGridProps {
  stats: StatsData;
}

export default function StatsGrid({ stats }: StatsGridProps) {
  const statItems = [
    {
      value: stats.newTenders,
      label: "New tenders",
      icon: <Lightning className="w-4 h-4 text-primary" />,
      iconBg: "bg-primary/10",
      badge: `+${stats.newTenders}`,
      badgeColor: "text-success",
    },
    {
      value: stats.bookmarks,
      label: "Bookmarks",
      icon: <Bookmark className="w-4 h-4 text-accent" />,
      iconBg: "bg-accent/10",
    },
    {
      value: stats.activeAlerts,
      label: "Active alerts",
      icon: <Bell className="w-4 h-4 text-secondary" />,
      iconBg: "bg-secondary/10",
    },
    {
      value: stats.deadlinesThisWeek,
      label: "Deadlines",
      icon: <Clock className="w-4 h-4 text-red-500" />,
      iconBg: "bg-red-100",
      badge: "Urgent",
      badgeColor: "text-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {statItems.map((item, index) => (
        <div
          key={index}
          className="bg-surface border border-border rounded-xl p-3 text-left"
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 ${item.iconBg} rounded-lg`}>{item.icon}</div>
            {item.badge && (
              <span className={`text-xs ${item.badgeColor} font-medium`}>
                {item.badge}
              </span>
            )}
          </div>
          <h3 className="text-3xl font-bold text-text mb-1">{item.value}</h3>
          <p className="text-xs text-text-light">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
