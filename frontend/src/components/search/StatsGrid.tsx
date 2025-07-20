import { Lightning, Bookmark, Bell, Clock } from "@phosphor-icons/react";
import { Link } from "react-router-dom";

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
      to: "/search?sort=newest",
    },
    {
      value: stats.bookmarks,
      label: "Bookmarks",
      icon: <Bookmark className="w-4 h-4 text-accent" />,
      iconBg: "bg-accent/10",
      to: "/bookmarks",
    },
    {
      value: stats.activeAlerts,
      label: "Active alerts",
      icon: <Bell className="w-4 h-4 text-secondary" />,
      iconBg: "bg-secondary/10",
      to: "/alerts",
    },
    {
      value: stats.deadlinesThisWeek,
      label: "Deadlines",
      icon: <Clock className="w-4 h-4 text-error" />,
      iconBg: "bg-error/10",
      badge: "Urgent",
      badgeColor: "text-error",
      to: "/search?deadline=week",
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
          <h3 className="text-3xl font-bold text-text mb-1">
            <Link
              to={item.to}
              className="text-primary underline-offset-2 hover:underline focus:underline transition-colors"
              tabIndex={0}
            >
              {item.value}
            </Link>
          </h3>
          <p className="text-xs text-text-light">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
