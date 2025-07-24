import { useState, useEffect } from "react";
import WelcomeSection from "../components/dashboard/WelcomeSection";
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

export default function DashboardPage() {
  const { profile } = useAuth();
  const companyName = profile?.company_name || "TechFlow Solutions";
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
    <div className="h-full flex flex-col space-y-6">
      {/* Welcome Message */}
      <WelcomeSection
        companyName={companyName}
        userName={profile?.company_name || "Sarah"}
      />

      {/* Stats Grid */}
      <DashboardStatsGrid stats={stats} />

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 flex-1 min-h-0">
        {/* Main Content Area (2/3 width on large screens) */}
        <div className="xl:col-span-3 space-y-6">
          {/* Tab Navigation */}
          <div className="bg-surface border border-border rounded-xl h-full flex flex-col">
            <div className="flex border-b border-border">
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

            {/* Tab Content */}
            <div className="p-6 flex-1 overflow-hidden">
              {viewMode === "recent" ? (
                <div className="h-full overflow-y-auto">
                  <RecentActivity activities={mockActivities} />
                </div>
              ) : (
                <div className="h-full overflow-y-auto">
                  <RecommendedTenders tenders={recommendedTenders} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar (1/3 width on large screens) */}
        <div className="xl:col-span-1 space-y-6">
          {/* Quick Actions */}
          <div className="bg-surface border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-text mb-4">
              Quick Actions
            </h3>
            <QuickActionsSidebar />
          </div>

          {/* Urgent Deadlines */}
          <UrgentDeadlines deadlines={mockDeadlines} />

          {/* AI Insights Card */}
          <div className="bg-gradient-to-br from-primary/5 to-maple/5 border border-primary/20 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                🤖
              </div>
              <h3 className="text-lg font-semibold text-text">AI Insights</h3>
            </div>
            <p className="text-sm text-text-muted mb-4">
              Based on your activity, you might be interested in upcoming IT and
              cybersecurity opportunities.
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">Match Score Trend</span>
                <span className="text-success font-medium">↗ +12%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">Weekly Activity</span>
                <span className="text-info font-medium">8 actions</span>
              </div>
            </div>
            <button className="w-full mt-4 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors">
              View Full Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
