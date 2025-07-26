import { useState, useEffect } from "react";

import DashboardStatsGrid from "../components/dashboard/DashboardStatsGrid";
import RecentActivity from "../components/dashboard/RecentActivity";
import RecommendedTenders from "../components/dashboard/RecommendedTenders";
import QuickActionsSidebar from "../components/search/QuickActionsSidebar";
import UrgentDeadlines from "../components/search/UrgentDeadlines";
import { getRecommendedTenders } from "../api/tenders";
import { getNumberOfBookmarks } from "../api/bookmarks";
import type { Activity } from "../components/dashboard/types";
import type { TenderSearchResult } from "../api/types";
import { useAuth } from "../hooks/auth";
import { HouseIcon } from "@phosphor-icons/react";
import { PageHeader } from "../components/ui";

// Dashboard view modes
type DashboardViewMode = "recent" | "recommended";

const mockActivities: Activity[] = [
  {
    id: 1,
    action: "New Match",
    title: "IT Infrastructure Modernization - Health Canada",
    time: "2024-01-15T10:30:00Z",
    description:
      "Comprehensive IT infrastructure upgrade including cloud migration, security enhancements, and legacy system replacement for Health Canada's digital transformation initiative.",
    location: "Ottawa, ON",
    publishDate: "2024-01-15",
    closingDate: "2024-02-15",
  },
  {
    id: 2,
    action: "Saved",
    title: "Software Development Services - CBSA",
    time: "2024-01-14T15:45:00Z",
    description:
      "Development of custom border management software solutions with AI-powered risk assessment capabilities for the Canada Border Services Agency.",
    location: "Toronto, ON",
    publishDate: "2024-01-10",
    closingDate: "2024-02-20",
  },
  {
    id: 3,
    action: "Viewed",
    title: "Cybersecurity Consulting - DND",
    time: "2024-01-14T09:15:00Z",
    description:
      "Advanced cybersecurity consulting services for critical defense infrastructure, including threat assessment and security architecture design.",
    location: "Kingston, ON",
    publishDate: "2024-01-12",
    closingDate: "2024-01-28",
  },
  {
    id: 4,
    action: "Alert",
    title: "Cloud Infrastructure - Transport Canada",
    time: "2024-01-13T14:22:00Z",
    description:
      "Multi-cloud infrastructure setup and management services for transportation data systems with focus on reliability and scalability.",
    location: "Vancouver, BC",
    publishDate: "2024-01-13",
    closingDate: "2024-02-10",
  },
  {
    id: 5,
    action: "New Match",
    title: "Data Analytics Platform - Statistics Canada",
    time: "2024-01-13T11:00:00Z",
    description:
      "Advanced analytics platform for processing and analyzing large datasets with machine learning capabilities for statistical analysis.",
    location: "Ottawa, ON",
    publishDate: "2024-01-11",
    closingDate: "2024-02-28",
  },
];

const mockDeadlines = [
  {
    title: "Cybersecurity Consulting - DND",
    daysRemaining: 2,
    urgencyLevel: "urgent" as const,
  },
  {
    title: "Software Development - CRA",
    daysRemaining: 5,
    urgencyLevel: "warning" as const,
  },
  {
    title: "Cloud Infrastructure - Transport Canada",
    daysRemaining: 7,
    urgencyLevel: "warning" as const,
  },
];

export default function HomePage() {
  const { profile } = useAuth();
  const [viewMode, setViewMode] = useState<DashboardViewMode>("recent");
  const [recommendedTenders, setRecommendedTenders] = useState<
    TenderSearchResult[]
  >([]);
  const [stats, setStats] = useState({
    newTenders: 12,
    bookmarks: 8,
    activeAlerts: 5,
    deadlinesThisWeek: 3,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const bookmarksResponse = await getNumberOfBookmarks();
        setStats((prevStats) => ({
          ...prevStats,
          bookmarks: bookmarksResponse,
        }));
      } catch (error) {
        console.error("Failed to fetch bookmarks:", error);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchRecommendedTenders = async () => {
      try {
        const recommendedTenders = await getRecommendedTenders();
        setRecommendedTenders(recommendedTenders.results || []);
        console.log("recommendedTenders", recommendedTenders);
      } catch (error) {
        console.error("Failed to fetch recommended tenders:", error);
      }
    };
    fetchRecommendedTenders();
  }, []);

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Header Section - Fixed Height */}
      <div className="flex w-full justify-between items-start gap-6">
        <PageHeader
          icon={<HouseIcon className="w-10 h-10 text-primary" />}
          title="Home"
          description={`Welcome home, ${profile?.company_name}`}
        />
        <DashboardStatsGrid stats={stats} />
      </div>

      {/* Main Content Layout - Flexible Height */}
      <div className="flex gap-6 flex-1 min-h-0">
        {/* Main Content Area - 2/3 width */}
        <div className="flex-1 bg-surface border border-border rounded-lg flex flex-col min-h-0">
          {/* Tab Navigation */}
          <div className="flex border-b border-border flex-shrink-0">
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
          </div>
          {/* Tab Content - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            {viewMode === "recent" ? (
              <RecentActivity activities={mockActivities} />
            ) : (
              <RecommendedTenders tenders={recommendedTenders} />
            )}
          </div>
        </div>

        {/* Sidebar - 1/3 width */}
        <div className="w-1/3 flex flex-col gap-4 min-h-0">
          <div className="bg-surface border border-border rounded-lg p-6 flex-shrink-0">
            <h3 className="text-lg font-semibold text-text mb-4">
              Quick Actions
            </h3>
            <QuickActionsSidebar />
          </div>
          <div className="flex-1">
            <UrgentDeadlines deadlines={mockDeadlines} />
          </div>
        </div>
      </div>
    </div>
  );
}
