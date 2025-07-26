import { useState, useEffect } from "react";
import { Clock } from "@phosphor-icons/react";
import { useAuth } from "../../hooks/auth";
import { getUserBookmarks, type BookmarkWithTender } from "../../api/bookmarks";
import LoadingSpinner from "../common/LoadingSpinner";

interface DeadlineItem {
  id: string;
  title: string;
  daysRemaining: number;
  urgencyLevel: "urgent" | "warning";
  closingDate: string;
}

interface UrgentDeadlinesProps {
  limit?: number;
}

export default function UrgentDeadlines({ limit = 5 }: UrgentDeadlinesProps) {
  const { profile } = useAuth();
  const [deadlines, setDeadlines] = useState<DeadlineItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarkDeadlines = async () => {
      if (!profile?.id) {
        setDeadlines([]);
        setLoading(false);
        return;
      }

      try {
        const response = await getUserBookmarks(profile.id);
        
        if (!response.bookmarks || response.bookmarks.length === 0) {
          setDeadlines([]);
          setLoading(false);
          return;
        }

        const now = new Date();
        const deadlineItems: DeadlineItem[] = response.bookmarks
          .filter((bookmark: BookmarkWithTender) => bookmark.tender_notice?.closing_date)
          .map((bookmark: BookmarkWithTender) => {
            const closingDate = new Date(bookmark.tender_notice.closing_date!);
            const diffTime = closingDate.getTime() - now.getTime();
            const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            return {
              id: bookmark.tender_notice.id,
              title: bookmark.tender_notice.title,
              daysRemaining,
              urgencyLevel: (daysRemaining <= 3 ? "urgent" : "warning") as "urgent" | "warning",
              closingDate: bookmark.tender_notice.closing_date!,
            };
          })
          .filter(item => item.daysRemaining > 0 && item.daysRemaining <= 14) // Only show upcoming deadlines within 2 weeks
          .sort((a, b) => a.daysRemaining - b.daysRemaining) // Sort by urgency
          .slice(0, limit);

        setDeadlines(deadlineItems);
      } catch (error) {
        console.error("Error fetching bookmark deadlines:", error);
        setDeadlines([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarkDeadlines();
  }, [profile?.id, limit]);

  const getDeadlineStyles = (urgencyLevel: "urgent" | "warning") => {
    return urgencyLevel === "urgent"
      ? {
          containerClass: "bg-error/10 border-error/20",
          titleClass: "text-error",
          timeClass: "text-error",
        }
      : {
          containerClass: "bg-warning/10 border-warning/20",
          titleClass: "text-warning",
          timeClass: "text-warning",
        };
  };

  if (loading) {
    return (
      <div className="bg-surface border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-error" />
          Bookmark Deadlines
        </h3>
        <LoadingSpinner variant="inline" size="sm" showLogo={false} />
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-error" />
        Bookmark Deadlines
      </h3>
      <div className="space-y-3">
        {deadlines.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-text-light text-sm">No upcoming deadlines</p>
            <p className="text-text-light text-xs mt-1">Bookmark some tenders to see deadlines here</p>
          </div>
        ) : (
          deadlines.map((deadline) => {
            const styles = getDeadlineStyles(deadline.urgencyLevel);
            return (
              <div
                key={deadline.id}
                className={`p-3 border rounded-lg ${styles.containerClass}`}
              >
                <p className={`text-sm font-medium ${styles.titleClass} line-clamp-2`}>
                  {deadline.title}
                </p>
                <p className={`text-xs ${styles.timeClass} mt-1`}>
                  {deadline.daysRemaining === 1 
                    ? "Due tomorrow" 
                    : deadline.daysRemaining === 0 
                    ? "Due today" 
                    : `Due in ${deadline.daysRemaining} days`}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
