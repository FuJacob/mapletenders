import { memo } from "react";
import { 
  MagnifyingGlass, 
  Bookmark, 
  Bell, 
  Calendar, 
  ChartBar, 
  Download,
  Plus,
  Lightning,
  Funnel
} from "@phosphor-icons/react";
import { Link } from "react-router-dom";

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  to: string;
  color: string;
  bgColor: string;
  badge?: string | number;
}

interface QuickActionsProps {
  className?: string;
  newTodayCount?: number;
  bookmarkedCount?: number;
  urgentDeadlines?: number;
}

const QuickActions = memo(function QuickActions({ 
  className = "",
  newTodayCount = 0,
  bookmarkedCount = 0,
  urgentDeadlines = 0
}: QuickActionsProps) {
  const actions: QuickAction[] = [
    {
      id: 'search',
      title: 'Smart Search',
      description: 'Find relevant tenders with AI',
      icon: <MagnifyingGlass className="w-5 h-5" />,
      to: '/search',
      color: 'text-primary',
      bgColor: 'bg-primary/10 hover:bg-primary/20',
    },
    {
      id: 'advanced-search',
      title: 'Advanced Search',
      description: 'Powerful filtering tools',
      icon: <Funnel className="w-5 h-5" />,
      to: '/search/advanced',
      color: 'text-primary',
      bgColor: 'bg-primary/10 hover:bg-primary/20',
    },
    {
      id: 'new-today',
      title: 'New Today',
      description: 'Fresh opportunities',
      icon: <Lightning className="w-5 h-5" />,
      to: '/search?sort=newest',
      color: 'text-success',
      bgColor: 'bg-success/10 hover:bg-success/20',
      badge: newTodayCount > 0 ? newTodayCount : undefined,
    },
    {
      id: 'bookmarks',
      title: 'Bookmarks',
      description: 'Your saved tenders',
      icon: <Bookmark className="w-5 h-5" />,
      to: '/bookmarks',
      color: 'text-accent',
      bgColor: 'bg-accent/10 hover:bg-accent/20',
      badge: bookmarkedCount > 0 ? bookmarkedCount : undefined,
    },
    {
      id: 'deadlines',
      title: 'Deadlines',
      description: 'Upcoming closures',
      icon: <Calendar className="w-5 h-5" />,
      to: '/search?deadline=week',
      color: 'text-warning',
      bgColor: 'bg-warning/10 hover:bg-warning/20',
      badge: urgentDeadlines > 0 ? urgentDeadlines : undefined,
    },
    {
      id: 'analytics',
      title: 'Analytics',
      description: 'Performance insights',
      icon: <ChartBar className="w-5 h-5" />,
      to: '/analytics',
      color: 'text-info',
      bgColor: 'bg-info/10 hover:bg-info/20',
    },
    {
      id: 'alerts',
      title: 'Alerts',
      description: 'Manage notifications',
      icon: <Bell className="w-5 h-5" />,
      to: '/alerts',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 hover:bg-purple-200',
    },
    {
      id: 'export',
      title: 'Export Data',
      description: 'Download reports',
      icon: <Download className="w-5 h-5" />,
      to: '/analytics?export=true',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100 hover:bg-gray-200',
    },
    {
      id: 'create-alert',
      title: 'Create Alert',
      description: 'Set up monitoring',
      icon: <Plus className="w-5 h-5" />,
      to: '/alerts/new',
      color: 'text-green-600',
      bgColor: 'bg-green-100 hover:bg-green-200',
    },
  ];

  return (
    <div className={`bg-surface border border-border rounded-lg p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-text">Quick Actions</h3>
        <p className="text-sm text-text-light">Common tasks and shortcuts</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {actions.map((action) => (
          <Link
            key={action.id}
            to={action.to}
            className={`
              relative p-4 rounded-lg border border-border transition-all
              ${action.bgColor}
              hover:border-primary/30 hover:shadow-sm
              group
            `}
          >
            {/* Badge */}
            {action.badge && (
              <div className="absolute -top-2 -right-2 bg-error text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                {action.badge}
              </div>
            )}

            {/* Icon */}
            <div className={`${action.color} mb-3`}>
              {action.icon}
            </div>

            {/* Content */}
            <div>
              <h4 className="font-medium text-text text-sm group-hover:text-primary transition-colors">
                {action.title}
              </h4>
              <p className="text-xs text-text-light mt-1">
                {action.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Help Link */}
      <div className="mt-6 pt-4 border-t border-border text-center">
        <Link
          to="/help"
          className="text-text-light hover:text-primary text-sm transition-colors"
        >
          Need help? View user guide →
        </Link>
      </div>
    </div>
  );
});

export default QuickActions;