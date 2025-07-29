import { useState, useEffect } from "react";

import { DashboardStatsGrid } from "../components/dashboard";
import ActivityAndRecommendations from "../components/dashboard/ActivityAndRecommendations";
import ROICalculator from "../components/dashboard/ROICalculator";
import OpportunityTimeline from "../components/dashboard/OpportunityTimeline";
import QuickActions from "../components/dashboard/QuickActions";
// import QuickActionsSidebar from "../components/search/QuickActionsSidebar";
// import UrgentDeadlines from "../components/search/UrgentDeadlines";
import { getRecommendedTenders } from "../api/tenders";
// import { getNumberOfBookmarks } from "../api/bookmarks";
import { analyticsAPI, type DashboardData } from "../api/analytics";
import type { Activity } from "../components/dashboard/types";
import type { TenderSearchResult } from "../api/types";
import { useAuth } from "../hooks/auth";
import { HouseIcon } from "@phosphor-icons/react";
import { PageHeader } from "../components/ui";

// Removed mockActivities - now using real API data from analyticsAPI.getUserActivities()
/*
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
*/

export default function HomePage() {
  const { profile } = useAuth();  
  const [recommendedTenders, setRecommendedTenders] = useState<
    TenderSearchResult[]
  >([]);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch analytics dashboard data
        const analytics = await analyticsAPI.getDashboard();
        setDashboardData(analytics);

        // Load user activities
        try {
          const userActivities = await analyticsAPI.getUserActivities(10);
          setActivities(userActivities);
        } catch (activityError) {
          console.error("Failed to fetch user activities:", activityError);
          setActivities([]); // No fallback data - show empty state
        }

        // Track page view
        await analyticsAPI.trackActivity({
          actionType: 'page_view',
          resourceType: 'dashboard',
          pageUrl: '/home',
          sessionId: Date.now().toString(),
        });
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
        
        // Load user activities
        let activities: Activity[] = [];
        try {
          activities = await analyticsAPI.getUserActivities(10);
        } catch (activityError) {
          console.error("Failed to fetch user activities:", activityError);
          activities = []; // No fallback data - show empty state
        }
        setActivities(activities);

        // Set default dashboard data when API fails
        setDashboardData({
          tenderStats: {
            totalMatches: 0,
            newToday: 0,
            expiringSoon: 0,
            bookmarked: 0,
            applied: 0,
            won: 0,
          },
          financialMetrics: {
            totalOpportunityValue: 0,
            averageContractSize: 0,
            estimatedROI: 0,
            contractsWonValue: 0,
            subscriptionCost: 99,
          },
          performanceMetrics: {
            winRate: 0,
            responseTime: 0,
            timesSaved: 0,
            opportunitiesPerDay: 0,
          },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
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

  if (error && !dashboardData) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        <div className="text-center">
          <HouseIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-text mb-2">Dashboard Unavailable</h2>
          <p className="text-error text-sm mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header Section */}
      <div className="space-y-4">
        <PageHeader
          icon={<HouseIcon className="w-10 h-10 text-primary" />}
          title="Dashboard"
          description={`Welcome back, ${profile?.company_name || 'User'}`}
        />
        
        {/* Stats Grid */}
        {dashboardData ? (
          <DashboardStatsGrid data={dashboardData} loading={loading} />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-surface border border-border rounded-lg p-4 animate-pulse">
                <div className="h-8 w-8 bg-gray-300 rounded-lg mb-3"></div>
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <QuickActions
        newTodayCount={dashboardData?.tenderStats.newToday}
        bookmarkedCount={dashboardData?.tenderStats.bookmarked}
        urgentDeadlines={dashboardData?.tenderStats.expiringSoon}
      />

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* ROI Calculator - Takes 2 columns on large screens */}
        <div className="lg:col-span-2">
          <ROICalculator />
        </div>

        {/* Opportunity Timeline - Takes 1 column */}
        <div className="lg:col-span-1">
          <OpportunityTimeline />
        </div>
      </div>

      {/* Legacy Activity Section - Kept for compatibility */}
      <div className="hidden lg:block">
        <ActivityAndRecommendations
          activities={activities}
          tenders={recommendedTenders}
        />
      </div>
    </div>
  );
}
