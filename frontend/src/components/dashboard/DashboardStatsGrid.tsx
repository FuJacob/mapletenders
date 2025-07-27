import { memo } from "react";
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

const DashboardStatsGrid = memo(function DashboardStatsGrid({ stats }: DashboardStatsGridProps) {
  const statItems = [
    {
      value: stats.newTenders,
      label: "New Tenders Today",
      icon: <Lightning className="w-5 h-5 text-primary" />,
      iconBg: "bg-primary/10",
      badge: `+${stats.newTenders}`,
      badgeColor: "text-success",
      to: "/search?sort=newest",
      description: "Fresh opportunities",
    },
    {
      value: stats.bookmarks,
      label: "Saved Tenders",
      icon: <Bookmark className="w-5 h-5 text-accent" />,
      iconBg: "bg-accent/10",
      to: "/bookmarks",
      description: "Your bookmarked items",
    },
    {
      value: stats.activeAlerts,
      label: "Active Alerts",
      icon: <Bell className="w-5 h-5 text-info" />,
      iconBg: "bg-info/10",
      to: "/alerts",
      description: "Monitoring searches",
    },
    {
      value: stats.deadlinesThisWeek,
      label: "Urgent Deadlines",
      icon: <Clock className="w-5 h-5 text-error" />,
      iconBg: "bg-error/10",
      badge: "+3",
      badgeColor: "text-error",
      to: "/search?deadline=week",
      description: "Closing soon",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item, index) => (
        <Link
          key={index}
          to={item.to}
          className="bg-surface border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all group"
        >
          <div
            className={`${item.iconBg} flex items-center justify-center flex-1 h-1/3  w-full rounded-lg`}
          >
            {item.icon}
          </div>
          <div className="space-y-1 p-4 flex items-center gap-6 justify-between h-2/3">
            <h3 className="flex items-center gap-2 text-3xl sm:text-4xl font-bold text-text group-hover:text-primary transition-colors">
              {item.badge && (
                <span
                  className={`text-xs ${item.badgeColor} font-medium px-2 py-1 bg-surface-muted rounded-lg`}
                >
                  {item.badge}
                </span>
              )}{" "}
              {item.value}
            </h3>
            <div className="text-right">
              <p className="text-sm font-medium text-text">{item.label}</p>
              <p className="text-xs text-text-light">{item.description}</p>
            </div>{" "}
          </div>
        </Link>
      ))}
    </div>
  );
});

export default DashboardStatsGrid;
