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
import { useAuth } from "../hooks/auth";
import { getNumberOfBookmarks } from "../api/bookmarks";

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
  const { user } = useAuth();
  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) return;
      const bookmarksResponse = await getNumberOfBookmarks(user.id);
      setStats({ ...stats, bookmarks: bookmarksResponse.count });
    };
    fetchStats();
  }, [user?.id]);

  // Mock data for demonstration - replace with real data later
  const handleSubmitSearch = () => {
    console.log("Searching for:", searchQuery);
    navigate(`/search-results?q=${encodeURIComponent(searchQuery)}`);
  };

  const mockRecommendedTenders = [
    {
      id: "1",
      title: "Software Development Services for Digital Transformation",
      contracting_entity_name: "Government of Ontario",
      closing_date: "2025-07-25",
      delivery_location: "Toronto, ON",
      relevanceScore: 95,
      procurement_type: "rfp",
      status: "open",
      published_date: "2025-06-25",
      category_primary: "Information Technology",
      source_url: "#",
    },
    {
      id: "2",
      title: "IT Infrastructure Consulting Services",
      contracting_entity_name: "City of Vancouver",
      closing_date: "2025-07-30",
      delivery_location: "Vancouver, BC",
      relevanceScore: 88,
      procurement_type: "rfq",
      status: "open",
      published_date: "2025-06-30",
      category_primary: "Consulting Services",
      source_url: "#",
    },
    {
      id: "3",
      title: "Cybersecurity Assessment and Implementation",
      contracting_entity_name: "Government of Canada",
      closing_date: "2025-08-05",
      delivery_location: "Ottawa, ON",
      relevanceScore: 92,
      procurement_type: "rfp",
      status: "open",
      published_date: "2025-07-05",
      category_primary: "Security Services",
      source_url: "#",
    },
    {
      id: "4",
      title: "Cloud Migration and DevOps Services",
      contracting_entity_name: "City of Calgary",
      closing_date: "2025-08-15",
      delivery_location: "Calgary, AB",
      relevanceScore: 89,
      procurement_type: "rfp",
      status: "open",
      published_date: "2025-07-15",
      category_primary: "Information Technology",
      source_url: "#",
    },
    {
      id: "5",
      title: "Database Modernization Project",
      contracting_entity_name: "Province of British Columbia",
      closing_date: "2025-08-20",
      delivery_location: "Victoria, BC",
      relevanceScore: 91,
      procurement_type: "rfq",
      status: "open",
      published_date: "2025-07-20",
      category_primary: "Data Management",
      source_url: "#",
    },
    {
      id: "6",
      title: "Mobile Application Development",
      contracting_entity_name: "City of Montreal",
      closing_date: "2025-09-01",
      delivery_location: "Montreal, QC",
      relevanceScore: 86,
      procurement_type: "rfp",
      status: "open",
      published_date: "2025-08-01",
      category_primary: "Software Development",
      source_url: "#",
    },
  ];

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <SearchSection
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSubmitSearch={handleSubmitSearch}
              exampleSearches={exampleSearches}
            />

            <ViewModeToggle
              viewMode={mainViewMode}
              onViewModeChange={setMainViewMode}
            />

            {/* Dynamic Content Based on Toggle */}
            {mainViewMode === "recommended" ? (
              <RecommendedTenders tenders={mockRecommendedTenders} />
            ) : mainViewMode === "chat" ? (
              <BreezeChat />
            ) : (
              <RecentActivity activities={mockRecentActivity} />
            )}
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
