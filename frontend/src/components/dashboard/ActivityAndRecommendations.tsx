import { useState } from "react";
import RecentActivity from "./RecentActivity";
import RecommendedTenders from "./RecommendedTenders";
import type { Activity } from "./types";
import type { TenderSearchResult } from "../../api/types";

// Dashboard view modes
type DashboardViewMode = "recent" | "recommended";

interface ActivityAndRecommendationsProps {
  activities: Activity[];
  tenders: TenderSearchResult[];
}

export default function ActivityAndRecommendations({
  activities,
  tenders,
}: ActivityAndRecommendationsProps) {
  const [viewMode, setViewMode] = useState<DashboardViewMode>("recommended");

  return (
    <div className="flex-1 bg-surface border border-border rounded-lg flex flex-col min-h-0">
      {/* Tab Navigation */}
      <div className="flex border-b border-border flex-shrink-0">
        <button
          onClick={() => setViewMode("recommended")}
          className={`px-6 py-3 text-sm font-medium transition-colors ${
            viewMode === "recommended"
              ? "text-primary bg-primary/5 border-b-2 border-primary"
              : "text-text-muted hover:text-text"
          }`}
        >
          Recommended For You
        </button>
        <button
          onClick={() => setViewMode("recent")}
          className={`px-6 py-3 text-sm font-medium transition-colors ${
            viewMode === "recent"
              ? "text-primary bg-primary/5 border-b-2 border-primary"
              : "text-text-muted hover:text-text"
          }`}
        >
          Recent Activity
        </button>
      </div>

      {/* Tab Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        {viewMode === "recent" ? (
          <RecentActivity activities={activities} />
        ) : (
          <RecommendedTenders tenders={tenders} />
        )}
      </div>
    </div>
  );
}
