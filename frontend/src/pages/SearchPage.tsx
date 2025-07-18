import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import {
  selectBookmarkedTenders,
  selectBookmarksLoading,
} from "../features/bookmarks/bookmarksSelectors";
import { loadBookmarks } from "../features/bookmarks/bookmarksThunks";
import { useNavigate } from "react-router-dom";
import {
  MagnifyingGlass,
  Bell,
  Plus,
  Lightning,
  Bookmark,
  Clock,
  Star,
  ClockCounterClockwise,
  Robot,
} from "@phosphor-icons/react";
import RecommendedTenders from "../components/dashboard/RecommendedTenders";
import RecentActivity from "../components/dashboard/RecentActivity";
import BreezeChat from "../components/dashboard/BreezeChat";
import BookmarkedTenders from "../components/dashboard/BookmarkedTenders";
import { useAuth } from "../hooks/auth";
import { PageHeader } from "../components/ui";

export default function SearchPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { profile } = useAuth();
  const bookmarkedTenders = useAppSelector(selectBookmarkedTenders);
  const bookmarksLoading = useAppSelector(selectBookmarksLoading);
  const [searchQuery, setSearchQuery] = useState("");
  const [mainViewMode, setMainViewMode] = useState<
    "recommended" | "history" | "chat" | "bookmarks"
  >("recommended");

  // Load bookmarks when component mounts
  useEffect(() => {
    if (profile?.id) {
      dispatch(loadBookmarks(profile.id));
    }
  }, [dispatch, profile?.id]);

  // Mock data for demonstration - replace with real data later
  const mockStats = {
    newTenders: 12,
    savedTenders: 8,
    activeAlerts: 3,
    deadlinesThisWeek: 5,
  };

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
      action: "Saved",
      title: "Database Migration Project",
      time: "2025-07-07T09:30:00Z",
      description:
        "Legacy database modernization and data migration services. Includes performance optimization and backup strategy implementation.",
      location: "Vancouver, BC",
      publishDate: "2025-06-28",
      closingDate: "2025-07-30",
    },
    {
      id: 3,
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
            {/* Search Section */}
            <div className="bg-surface border border-border rounded-xl p-6 text-center">
              <h2 className="text-3xl font-semibold text-text mb-4 p-4 text-center">
                What contracts are you here to win today?
              </h2>
              <div className="relative mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSubmitSearch();
                  }}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Try: 'IT services contracts in Toronto under $100K'"
                  className="w-full p-6 text-lg border-2 border-border rounded-2xl pr-16 focus:outline-none focus:border-primary bg-surface text-text placeholder-text-light"
                />
                <button
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors flex items-center gap-2"
                  onClick={handleSubmitSearch}
                >
                  <MagnifyingGlass className="w-4 h-4" />
                  Search
                </button>
              </div>
              <div>
                <p className="text-sm text-text-light mb-2 text-center">
                  Try these examples:
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  {exampleSearches.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => setSearchQuery(example)}
                      className="text-sm bg-surface border border-border text-text-light px-4 py-2 rounded-xl hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Toggle Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMainViewMode("recommended")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  mainViewMode === "recommended"
                    ? "bg-primary text-white"
                    : "bg-surface border border-border text-text hover:bg-primary/5"
                }`}
              >
                <Star className="w-4 h-4" />
                Recommended for You
              </button>
              <button
                onClick={() => setMainViewMode("bookmarks")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  mainViewMode === "bookmarks"
                    ? "bg-primary text-white"
                    : "bg-surface border border-border text-text hover:bg-primary/5"
                }`}
              >
                <Bookmark className="w-4 h-4" />
                Bookmarks
              </button>
              <button
                onClick={() => setMainViewMode("chat")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  mainViewMode === "chat"
                    ? "bg-primary text-white"
                    : "bg-surface border border-border text-text hover:bg-primary/5"
                }`}
              >
                <Robot className="w-4 h-4" />
                Breeze Chat
              </button>
              <button
                onClick={() => setMainViewMode("history")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  mainViewMode === "history"
                    ? "bg-primary text-white"
                    : "bg-surface border border-border text-text hover:bg-primary/5"
                }`}
              >
                <ClockCounterClockwise className="w-4 h-4" />
                Recent Activity
              </button>
            </div>

            {/* Dynamic Content Based on Toggle */}
            {mainViewMode === "recommended" ? (
              <RecommendedTenders tenders={mockRecommendedTenders} />
            ) : mainViewMode === "bookmarks" ? (
              <BookmarkedTenders
                bookmarks={bookmarkedTenders}
                loading={bookmarksLoading}
              />
            ) : mainViewMode === "chat" ? (
              <BreezeChat />
            ) : (
              <RecentActivity activities={mockRecentActivity} />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Action Buttons */}
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-4 bg-surface border border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-colors text-left">
                <Plus className="w-5 h-5 text-primary" />
                <span className="text-text font-medium">Set up Alert</span>
              </button>
              <button className="w-full flex items-center gap-3 p-4 bg-surface border border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-colors text-left">
                <Bookmark className="w-5 h-5 text-accent" />
                <span className="text-text font-medium">View Saved</span>
              </button>
              <button className="w-full flex items-center gap-3 p-4 bg-surface border border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-colors text-left">
                <MagnifyingGlass className="w-5 h-5 text-blue-500" />
                <span className="text-text font-medium">Advanced Search</span>
              </button>
              <button className="w-full flex items-center gap-3 p-4 bg-surface border border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-colors text-left">
                <Bell className="w-5 h-5 text-orange-500" />
                <span className="text-text font-medium">Manage Alerts</span>
              </button>
              <button className="w-full flex items-center gap-3 p-4 bg-surface border border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-colors text-left">
                <Clock className="w-5 h-5 text-red-500" />
                <span className="text-text font-medium">Track Deadlines</span>
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface border border-border rounded-xl p-3 text-left">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Lightning className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-xs text-success font-medium">
                    +{mockStats.newTenders}
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-text mb-1">
                  {mockStats.newTenders}
                </h3>
                <p className="text-xs text-text-light">New tenders</p>
              </div>

              <div className="bg-surface border border-border rounded-xl p-3 text-left">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Bookmark className="w-4 h-4 text-accent" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-text mb-1">
                  {mockStats.savedTenders}
                </h3>
                <p className="text-xs text-text-light">Saved</p>
              </div>

              <div className="bg-surface border border-border rounded-xl p-3 text-left">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-secondary/10 rounded-lg">
                    <Bell className="w-4 h-4 text-secondary" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-text mb-1">
                  {mockStats.activeAlerts}
                </h3>
                <p className="text-xs text-text-light">Active alerts</p>
              </div>

              <div className="bg-surface border border-border rounded-xl p-3 text-left">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Clock className="w-4 h-4 text-red-500" />
                  </div>
                  <span className="text-xs text-red-500 font-medium">Urgent</span>
                </div>
                <h3 className="text-3xl font-bold text-text mb-1">
                  {mockStats.deadlinesThisWeek}
                </h3>
                <p className="text-xs text-text-light">Deadlines</p>
              </div>
            </div>

            {/* Urgent Deadlines */}
            <div className="bg-surface border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-red-500" />
                Urgent Deadlines
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm font-medium text-red-800">
                    Software Development RFP
                  </p>
                  <p className="text-xs text-red-600">Due in 2 days</p>
                </div>
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm font-medium text-yellow-800">
                    IT Consulting Services
                  </p>
                  <p className="text-xs text-yellow-600">Due in 5 days</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}