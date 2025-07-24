import { Lightning, Bookmark, Bell, Clock } from "@phosphor-icons/react";
import { Link } from "react-router-dom";

interface StatsData {
  newTenders: number;
  bookmarks: number;
  activeAlerts: number;
  deadlinesThisWeek: number;
}

interface DashboardStatsGridProps {
  stats: StatsData;
}

export default function DashboardStatsGrid({ stats }: DashboardStatsGridProps) {
  const statItems = [
    {
      value: stats.newTenders,
      label: "New Tenders Today",
      icon: <Lightning className="w-5 h-5 text-primary" />,
      iconBg: "bg-primary/10",
      badge: `+${stats.newTenders}`,
      badgeColor: "text-success",
      to: "/search?sort=newest",
      description: "Fresh opportunities"
    },
    {
      value: stats.bookmarks,
      label: "Saved Tenders",
      icon: <Bookmark className="w-5 h-5 text-accent" />,
      iconBg: "bg-accent/10",
      to: "/bookmarks",
      description: "Your bookmarked items"
    },
    {
      value: stats.activeAlerts,
      label: "Active Alerts",
      icon: <Bell className="w-5 h-5 text-info" />,
      iconBg: "bg-info/10",
      to: "/alerts",
      description: "Monitoring searches"
    },
    {
      value: stats.deadlinesThisWeek,
      label: "Urgent Deadlines",
      icon: <Clock className="w-5 h-5 text-error" />,
      iconBg: "bg-error/10",
      badge: "This Week",
      badgeColor: "text-error",
      to: "/search?deadline=week",
      description: "Closing soon"
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statItems.map((item, index) => (
        <Link
          key={index}
          to={item.to}
          className="bg-surface border border-border rounded-xl p-4 hover:border-primary hover:bg-primary/5 transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2.5 ${item.iconBg} rounded-lg group-hover:scale-110 transition-transform`}>
              {item.icon}
            </div>
            {item.badge && (
              <span className={`text-xs ${item.badgeColor} font-medium px-2 py-1 bg-surface-muted rounded-full`}>
                {item.badge}
              </span>
            )}
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-bold text-text group-hover:text-primary transition-colors">
              {item.value}
            </h3>
            <p className="text-sm font-medium text-text">{item.label}</p>
            <p className="text-xs text-text-light">{item.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}