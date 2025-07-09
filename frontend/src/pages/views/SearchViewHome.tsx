import { useState } from "react";

import { useAppSelector } from "../../app/hooks";
import { selectAuthUser } from "../../features/auth/authSelectors";
import { useNavigate } from "react-router-dom";
import {
  MagnifyingGlass,
  Bell,
  Plus,
  Lightning,
  Bookmark,
  Clock,
} from "@phosphor-icons/react";
import RecommendedTenders from "../../components/dashboard/RecommendedTenders";
import RecentActivity from "../../components/dashboard/RecentActivity";

export default function Home() {
  const navigate = useNavigate();

  const user = useAppSelector(selectAuthUser);
  const [searchQuery, setSearchQuery] = useState("");
  const [mainViewMode, setMainViewMode] = useState<"recommended" | "history">("recommended");

  // Mock data for demonstration - replace with real data later
  const mockStats = {
    newTenders: 12,
    savedTenders: 8,
    activeAlerts: 3,
    deadlinesThisWeek: 5,
  };

  const handleSubmitSearch = () => {
    console.log("Searching for:", searchQuery);
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const mockRecommendedTenders = [
    {
      id: 1,
      title: "Software Development Services for Digital Transformation",
      organization: "Government of Ontario",
      value: "$150,000",
      deadline: "2025-07-25",
      location: "Toronto, ON",
      relevanceScore: 95,
      type: "RFP",
      status: "Open",
    },
    {
      id: 2,
      title: "IT Infrastructure Consulting Services",
      organization: "City of Vancouver",
      value: "$75,000",
      deadline: "2025-07-30",
      location: "Vancouver, BC",
      relevanceScore: 88,
      type: "RFQ",
      status: "Open",
    },
    {
      id: 3,
      title: "Cybersecurity Assessment and Implementation",
      organization: "Government of Canada",
      value: "$200,000",
      deadline: "2025-08-05",
      location: "Ottawa, ON",
      relevanceScore: 92,
      type: "RFP",
      status: "Open",
    },
    {
      id: 4,
      title: "Cloud Migration and DevOps Services",
      organization: "City of Calgary",
      value: "$120,000",
      deadline: "2025-08-15",
      location: "Calgary, AB",
      relevanceScore: 89,
      type: "RFP",
      status: "Open",
    },
    {
      id: 5,
      title: "Database Modernization Project",
      organization: "Province of British Columbia",
      value: "$180,000",
      deadline: "2025-08-20",
      location: "Victoria, BC",
      relevanceScore: 91,
      type: "RFQ",
      status: "Open",
    },
    {
      id: 6,
      title: "Mobile Application Development",
      organization: "City of Montreal",
      value: "$95,000",
      deadline: "2025-09-01",
      location: "Montreal, QC",
      relevanceScore: 86,
      type: "RFP",
      status: "Open",
    },
  ];

  const mockRecentActivity = [
    {
      id: 1,
      action: "Viewed",
      title: "Cloud Services RFP",
      time: "2 hours ago",
    },
    {
      id: 2,
      action: "Saved",
      title: "Database Migration Project",
      time: "1 day ago",
    },
    {
      id: 3,
      action: "Alert",
      title: "New IT tender matching your profile",
      time: "2 days ago",
    },
    {
      id: 4,
      action: "Applied",
      title: "Software Development Services RFP",
      time: "3 days ago",
    },
    {
      id: 5,
      action: "Viewed",
      title: "Cybersecurity Assessment Project",
      time: "4 days ago",
    },
    {
      id: 6,
      action: "Bookmarked",
      title: "Mobile App Development Tender",
      time: "5 days ago",
    },
    {
      id: 7,
      action: "Alert",
      title: "Deadline reminder: Infrastructure RFQ",
      time: "1 week ago",
    },
  ];

  const exampleSearches = [
    "IT services contracts in Ontario under $100K",
    "Construction projects in Alberta over $500K",
    "Consulting opportunities closing this month",
    "Software development with government agencies",
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-text mb-2">
          Welcome back {user?.company_name}!
        </h1>
        <p className="text-lg text-text-light">
          Here's what's happening with your tender opportunities
        </p>
      </div>

      <div className="flex flex-row gap-6 mb-8">
        {/* Center - Search Section */}
        <div className="flex-1 bg-surface max-w-5xl mx-auto border border-border rounded-xl p-6 text-center">
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
              disabled={false}
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
            <div className="flex flex-wrap justify-center gap-2">
              {exampleSearches.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setSearchQuery(example)}
                  className="text-xs bg-border text-text-light px-3 py-1 rounded-full hover:bg-primary hover:text-white transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right side - Quick Action Buttons */}
        <div className="w-80 flex flex-col gap-3">
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Toggle Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMainViewMode("recommended")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                mainViewMode === "recommended"
                  ? "bg-primary text-white"
                  : "bg-surface border border-border text-text hover:bg-primary/5"
              }`}
            >
              Recommended for You
            </button>
            <button
              onClick={() => setMainViewMode("history")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                mainViewMode === "history"
                  ? "bg-primary text-white"
                  : "bg-surface border border-border text-text hover:bg-primary/5"
              }`}
            >
              Recent Activity
            </button>
          </div>

          {/* Dynamic Content Based on Toggle */}
          {mainViewMode === "recommended" ? (
            <RecommendedTenders tenders={mockRecommendedTenders} />
          ) : (
            <RecentActivity activities={mockRecentActivity} />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
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
  );
}
