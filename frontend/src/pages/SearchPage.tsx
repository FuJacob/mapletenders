import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlass } from "@phosphor-icons/react";
import RecommendedTenders from "../components/dashboard/RecommendedTenders";
import RecentActivity from "../components/dashboard/RecentActivity";
import BreezeChat from "../components/dashboard/BreezeChat";
import { PageHeader } from "../components/ui";
import {
  SearchSection,
  ViewModeToggle,
  QuickActionsSidebar,
  StatsGrid,
  UrgentDeadlines,
} from "../components/search";
import type { ViewMode } from "../components/search";
import { getNumberOfBookmarks } from "../api/bookmarks";
import { getRecommendedTenders } from "../api/tenders";
import type { TenderSearchResult } from "../api/types";

interface StatsData {
  newTenders: number;
  bookmarks: number;
  activeAlerts: number;
  deadlinesThisWeek: number;
}

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [mainViewMode, setMainViewMode] = useState<ViewMode>("recommended");
  const [stats, setStats] = useState<StatsData>({
    newTenders: 0,
    bookmarks: 0,
    activeAlerts: 0,
    deadlinesThisWeek: 0,
  });
  const [recommendedTenders, setRecommendedTenders] = useState<
    TenderSearchResult[]
  >([]);
  useEffect(() => {
    const fetchStats = async () => {
      const bookmarksResponse = await getNumberOfBookmarks();
      setStats({ ...stats, bookmarks: bookmarksResponse });
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchRecommendedTenders = async () => {
      const recommendedTenders = await getRecommendedTenders();
      setRecommendedTenders(recommendedTenders.results);
      console.log("recommendedTenders", recommendedTenders);
    };
    fetchRecommendedTenders();
  }, [recommendedTenders]);

  // Mock data for demonstration - replace with real data later
  const handleSubmitSearch = () => {
    console.log("Searching for:", searchQuery);
    navigate(`/search-results?q=${encodeURIComponent(searchQuery)}`);
  };

  const mockRecentActivity = [
    {
      id: 1,
      action: "Viewed",
      title: "Cloud Services RFP",
      time: "2025-07-08T14:00:00Z",
      description:
        "Comprehensive cloud infrastructure migration services for government agencies. This RFP covers multi-cloud strategy implementation and security compliance.",
      location: "Toronto, ON",
      publishDate: "2025-07-01",
      closingDate: "2025-07-25",
    },
    {
      id: 2,
      action: "Alert",
      title: "New IT tender matching your profile",
      time: "2025-07-06T16:45:00Z",
      description:
        "Enterprise software development and system integration services. Focus on agile methodologies and DevOps practices.",
      location: "Ottawa, ON",
      publishDate: "2025-07-05",
      closingDate: "2025-08-05",
    },
  ];

  const exampleSearches = [
    "IT services contracts in Ontario under $100K",
    "Construction projects in Alberta over $500K",
    "Consulting opportunities closing this month",
    "Software development with government agencies",
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-6">
        <PageHeader
          icon={<MagnifyingGlass className="w-10 h-10 text-primary" />}
          title="Search Tenders"
          description="Discover and search through thousands of government contract opportunities"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            <SearchSection
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSubmitSearch={handleSubmitSearch}
              exampleSearches={exampleSearches}
            />

          <div>
              <ViewModeToggle
                viewMode={mainViewMode}
                onViewModeChange={setMainViewMode}
              />
  
              {/* Dynamic Content Based on Toggle */}
              <div className="p-6 bg-surface border-x-1 border-b-1 border-border rounded-b-xl px-6 pb-6 h-[600px] flex flex-col">
                {mainViewMode === "recommended" ? (
                  <RecommendedTenders tenders={recommendedTenders ?? []} />
                ) : mainViewMode === "chat" ? (
                  <BreezeChat />
                ) : (
                  <RecentActivity activities={mockRecentActivity} />
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <StatsGrid stats={stats} />
            <QuickActionsSidebar />

            <UrgentDeadlines />
          </div>
        </div>
      </div>
    </div>
  );
}
