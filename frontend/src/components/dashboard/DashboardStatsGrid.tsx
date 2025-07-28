import { memo } from "react";
import { Lightning, Bookmark, Clock, TrendUp, Target } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import type { DashboardData } from "../../api/analytics";

interface DashboardStatsGridProps {
  data: DashboardData;
  loading?: boolean;
}

const DashboardStatsGrid = memo(function DashboardStatsGrid({ data, loading }: DashboardStatsGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-surface border border-border rounded-lg p-4 animate-pulse">
            <div className="h-8 w-8 bg-gray-300 rounded-lg mb-3"></div>
            <div className="h-6 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-CA').format(value);
  };

  const statItems = [
    {
      value: data.tenderStats.newToday,
      label: "New Today",
      icon: <Lightning className="w-5 h-5 text-primary" />,
      iconBg: "bg-primary/10",
      badge: data.tenderStats.newToday > 0 ? `+${data.tenderStats.newToday}` : null,
      badgeColor: "text-success",
      to: "/search?sort=newest",
      description: "Fresh opportunities",
      formatter: formatNumber,
    },
    {
      value: data.tenderStats.bookmarked,
      label: "Bookmarked",
      icon: <Bookmark className="w-5 h-5 text-accent" />,
      iconBg: "bg-accent/10",
      to: "/bookmarks",
      description: "Saved tenders",
      formatter: formatNumber,
    },
    {
      value: data.tenderStats.expiringSoon,
      label: "Expiring Soon",
      icon: <Clock className="w-5 h-5 text-error" />,
      iconBg: "bg-error/10",
      badge: data.tenderStats.expiringSoon > 5 ? "URGENT" : null,
      badgeColor: "text-error",
      to: "/search?deadline=week",
      description: "Within 7 days",
      formatter: formatNumber,
    },
    {
      value: data.financialMetrics.totalOpportunityValue,
      label: "Total Value",
      icon: <TrendUp className="w-5 h-5 text-success" />,
      iconBg: "bg-success/10",
      to: "/analytics",
      description: "Opportunity value",
      formatter: formatCurrency,
    },
    {
      value: data.performanceMetrics.winRate,
      label: "Win Rate",
      icon: <Target className="w-5 h-5 text-info" />,
      iconBg: "bg-info/10",
      to: "/analytics",
      description: "Success percentage",
      formatter: (value: number) => `${value.toFixed(1)}%`,
    },
    {
      value: data.financialMetrics.estimatedROI,
      label: "ROI",
      icon: <TrendUp className="w-5 h-5 text-success" />,
      iconBg: "bg-success/10",
      badge: data.financialMetrics.estimatedROI > 1000 ? "EXCELLENT" : null,
      badgeColor: "text-success",
      to: "/analytics",
      description: "Return on investment",
      formatter: (value: number) => `${value.toFixed(0)}%`,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
      {statItems.map((item, index) => (
        <Link
          key={index}
          to={item.to}
          className="bg-surface border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all group p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`${item.iconBg} p-2 rounded-lg`}>
              {item.icon}
            </div>
            {item.badge && (
              <span
                className={`text-xs ${item.badgeColor} font-medium px-2 py-1 bg-surface-muted rounded-lg`}
              >
                {item.badge}
              </span>
            )}
          </div>
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-bold text-text group-hover:text-primary transition-colors">
              {item.formatter(item.value)}
            </h3>
            <p className="text-sm font-medium text-text">{item.label}</p>
            <p className="text-xs text-text-light">{item.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
});

export default DashboardStatsGrid;
