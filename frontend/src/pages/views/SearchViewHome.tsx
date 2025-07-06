import { useState } from "react";

import { useAppSelector } from "../../app/hooks";
import { selectAuthProfile } from "../../features/auth/authSelectors";
import { Link, useNavigate } from "react-router-dom";
import {
  MagnifyingGlass,
  Bell,
  Bookmark,
  Calendar,
  MapPin,
  CurrencyDollar,
  Clock,
  Star,
  Plus,
  Lightning,
  Eye,
  Gear,
} from "@phosphor-icons/react";

export default function Home() {
  const navigate = useNavigate();

  const profile = useAppSelector(selectAuthProfile);
  const [searchQuery, setSearchQuery] = useState("");

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
  ];

  const exampleSearches = [
    "IT services contracts in Ontario under $100K",
    "Construction projects in Alberta over $500K",
    "Consulting opportunities closing this month",
    "Software development with government agencies",
  ];

  return (
    <div className="max-w-7xl mx-auto text-center">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text mb-2">
          Welcome back {profile?.company_name}!
        </h1>
        <p className="text-lg text-text-light">
          Here's what's happening with your tender opportunities
        </p>
      </div>

      <div className="flex flex-row">
        <div className="flex flex-col items-center gap-5">
          <div className="bg-surface border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Lightning className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-success font-medium">
                +{mockStats.newTenders}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-text">
              {mockStats.newTenders}
            </h3>
            <p className="text-sm text-text-light">New tenders this week</p>
          </div>
          <div className="bg-surface border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Lightning className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-success font-medium">
                +{mockStats.newTenders}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-text">
              {mockStats.newTenders}
            </h3>
            <p className="text-sm text-text-light">New tenders this week</p>
          </div>
        </div>

        {/* Search Section */}
        <div className="flex-1 bg-surface max-w-3xl mx-auto border border-border rounded-xl p-6 mb-8 text-center">
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
        {/* Stats Section */}
        <div className="flex flex-col items-center gap-5">
          <div className="bg-surface border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Lightning className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-success font-medium">
                +{mockStats.newTenders}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-text">
              {mockStats.newTenders}
            </h3>
            <p className="text-sm text-text-light">New tenders this week</p>
          </div>
          <div className="bg-surface border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Lightning className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-success font-medium">
                +{mockStats.newTenders}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-text">
              {mockStats.newTenders}
            </h3>
            <p className="text-sm text-text-light">New tenders this week</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-surface border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Lightning className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm text-success font-medium">
                  +{mockStats.newTenders}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-text">
                {mockStats.newTenders}
              </h3>
              <p className="text-sm text-text-light">New tenders this week</p>
            </div>

            <div className="bg-surface border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Bookmark className="w-5 h-5 text-accent" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-text">
                {mockStats.savedTenders}
              </h3>
              <p className="text-sm text-text-light">Saved opportunities</p>
            </div>

            <div className="bg-surface border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <Bell className="w-5 h-5 text-secondary" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-text">
                {mockStats.activeAlerts}
              </h3>
              <p className="text-sm text-text-light">Active alerts</p>
            </div>

            <div className="bg-surface border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Clock className="w-5 h-5 text-red-500" />
                </div>
                <span className="text-sm text-red-500 font-medium">Urgent</span>
              </div>
              <h3 className="text-2xl font-bold text-text">
                {mockStats.deadlinesThisWeek}
              </h3>
              <p className="text-sm text-text-light">Deadlines this week</p>
            </div>
          </div>

          {/* Recommended Tenders */}
          <div className="bg-surface border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-text">
                Recommended for You
              </h2>
              <Link
                to="/tenders"
                className="text-primary hover:text-primary-dark text-sm font-medium"
              >
                View all →
              </Link>
            </div>
            <div className="space-y-4">
              {mockRecommendedTenders.map((tender) => (
                <div
                  key={tender.id}
                  className="border border-border rounded-lg p-4 hover:border-primary transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-text mb-2 hover:text-primary transition-colors">
                        {tender.title}
                      </h3>
                      <p className="text-sm text-text-light mb-2">
                        {tender.organization}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-text-light">
                        <span className="flex items-center gap-1">
                          <CurrencyDollar className="w-4 h-4" />
                          {tender.value}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {tender.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Due {tender.deadline}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
                        <Star className="w-3 h-3" />
                        {tender.relevanceScore}%
                      </div>
                      <button className="p-2 text-text-light hover:text-accent transition-colors">
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="bg-border text-text-light px-2 py-1 rounded text-xs">
                        {tender.type}
                      </span>
                      <span className="bg-success/10 text-success px-2 py-1 rounded text-xs">
                        {tender.status}
                      </span>
                    </div>
                    <button className="text-primary hover:text-primary-dark text-sm font-medium">
                      View Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-surface border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-text mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left">
                <Plus className="w-5 h-5 text-primary" />
                <span className="text-text">Set up Alert</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left">
                <Bookmark className="w-5 h-5 text-accent" />
                <span className="text-text">View Saved</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left">
                <Gear className="w-5 h-5 text-text-light" />
                <span className="text-text">Update Profile</span>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-surface border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-text mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3">
              {mockRecentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="p-1 bg-border rounded">
                    <Eye className="w-3 h-3 text-text-light" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-text">
                      <span className="font-medium">{activity.action}</span>{" "}
                      {activity.title}
                    </p>
                    <p className="text-xs text-text-light">{activity.time}</p>
                  </div>
                </div>
              ))}
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
