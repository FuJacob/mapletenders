import { memo, useState, useEffect } from "react";
import { Clock, TrendUp, Target, Bell, Calendar } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { analyticsAPI } from "../../api/analytics";

interface TimelineEvent {
  id: string;
  type: 'opportunity' | 'deadline' | 'win' | 'milestone';
  title: string;
  description: string;
  date: Date;
  value?: number;
  status: 'pending' | 'completed' | 'urgent';
  link?: string;
}

interface OpportunityTimelineProps {
  className?: string;
}

const OpportunityTimeline = memo(function OpportunityTimeline({ className = "" }: OpportunityTimelineProps) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeFrame, setTimeFrame] = useState<'weekly' | 'monthly'>('weekly');

  const fetchTimelineData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get performance report for timeline data
      const performanceData = await analyticsAPI.getPerformanceReport(timeFrame);
      
      // Generate mock timeline events based on performance data
      // In a real implementation, this would come from the activity log
      const mockEvents: TimelineEvent[] = [
        {
          id: '1',
          type: 'opportunity',
          title: 'New IT Services Tender',
          description: `${performanceData.metrics.opportunitiesViewed} new opportunities matched your profile`,
          date: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          status: 'pending',
          link: '/search?sort=newest'
        },
        {
          id: '2',
          type: 'deadline',
          title: 'Application Deadline Approaching',
          description: 'Government Software Development RFP closes in 2 days',
          date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
          value: 250000,
          status: 'urgent',
          link: '/bookmarks'
        },
        {
          id: '3',
          type: 'win',
          title: 'Contract Award Notification',
          description: 'Congratulations! You won the Municipal IT Consulting contract',
          date: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          value: 150000,
          status: 'completed',
          link: '/analytics'
        },
        {
          id: '4',
          type: 'milestone',
          title: 'ROI Milestone Achieved',
          description: `Reached ${performanceData.metrics.winRate.toFixed(0)}% win rate target`,
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          status: 'completed',
          link: '/analytics'
        },
        {
          id: '5',
          type: 'opportunity',
          title: 'High-Value Tender Alert',
          description: 'New tender matching your criteria: Infrastructure Development',
          date: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
          value: 500000,
          status: 'pending',
          link: '/search'
        }
      ];

      // Sort events by date (newest first)
      mockEvents.sort((a, b) => b.date.getTime() - a.date.getTime());
      
      setEvents(mockEvents);
    } catch (err) {
      console.error('Error fetching timeline data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load timeline data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimelineData();
  }, [timeFrame]);

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMs < 0) {
      // Future date
      const futureDays = Math.ceil(-diffMs / 86400000);
      const futureHours = Math.ceil(-diffMs / 3600000);
      
      if (futureDays > 1) {
        return `in ${futureDays} days`;
      } else if (futureHours > 1) {
        return `in ${futureHours} hours`;
      } else {
        return 'soon';
      }
    }

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffMins > 0) {
      return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    } else {
      return 'just now';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getEventIcon = (type: string, status: string) => {
    const iconClass = "w-4 h-4";
    
    switch (type) {
      case 'opportunity':
        return <Target className={`${iconClass} text-primary`} />;
      case 'deadline':
        return <Clock className={`${iconClass} ${status === 'urgent' ? 'text-error' : 'text-warning'}`} />;
      case 'win':
        return <TrendUp className={`${iconClass} text-success`} />;
      case 'milestone':
        return <Bell className={`${iconClass} text-info`} />;
      default:
        return <Calendar className={`${iconClass} text-text-light`} />;
    }
  };

  const getEventBgColor = (type: string, status: string) => {
    if (status === 'urgent') return 'bg-error/10 border-error/20';
    if (status === 'completed') return 'bg-success/10 border-success/20';
    
    switch (type) {
      case 'opportunity':
        return 'bg-primary/10 border-primary/20';
      case 'deadline':
        return 'bg-warning/10 border-warning/20';
      case 'win':
        return 'bg-success/10 border-success/20';
      case 'milestone':
        return 'bg-info/10 border-info/20';
      default:
        return 'bg-surface-muted border-border';
    }
  };

  if (loading) {
    return (
      <div className={`bg-surface border border-border rounded-lg p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-surface border border-border rounded-lg p-6 ${className}`}>
        <div className="text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-text mb-2">Opportunity Timeline</h3>
          <p className="text-error text-sm">{error}</p>
          <button
            onClick={fetchTimelineData}
            className="mt-3 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-surface border border-border rounded-lg ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text">Recent Activity</h3>
              <p className="text-sm text-text-light">Opportunities and milestones</p>
            </div>
          </div>
          
          {/* Time Frame Selector */}
          <div className="flex bg-surface-muted rounded-lg p-1">
            {(['weekly', 'monthly'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setTimeFrame(period)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  timeFrame === period
                    ? 'bg-primary text-white'
                    : 'text-text-light hover:text-text'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="p-6">
        {events.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h4 className="text-lg font-semibold text-text mb-2">No Recent Activity</h4>
            <p className="text-text-light text-sm">Start exploring tenders to see your activity timeline</p>
            <Link
              to="/search"
              className="inline-block mt-3 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Browse Tenders
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event, index) => (
              <div key={event.id} className="relative">
                {/* Timeline line */}
                {index < events.length - 1 && (
                  <div className="absolute left-4 top-8 w-0.5 h-12 bg-border"></div>
                )}
                
                {/* Event */}
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center ${getEventBgColor(event.type, event.status)}`}>
                    {getEventIcon(event.type, event.status)}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-text truncate">
                          {event.link ? (
                            <Link to={event.link} className="hover:text-primary transition-colors">
                              {event.title}
                            </Link>
                          ) : (
                            event.title
                          )}
                        </h4>
                        <p className="text-sm text-text-light mt-1">
                          {event.description}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-text-light">
                            {formatRelativeTime(event.date)}
                          </span>
                          {event.value && (
                            <span className="text-xs font-medium text-success">
                              {formatCurrency(event.value)}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Status indicator */}
                      {event.status === 'urgent' && (
                        <span className="bg-error text-white text-xs px-2 py-1 rounded-full">
                          Urgent
                        </span>
                      )}
                      {event.status === 'completed' && (
                        <span className="bg-success text-white text-xs px-2 py-1 rounded-full">
                          Done
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Link */}
        {events.length > 0 && (
          <div className="mt-6 pt-4 border-t border-border text-center">
            <Link
              to="/analytics"
              className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
            >
              View Full Analytics →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
});

export default OpportunityTimeline;