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
  Star,
  ClockCounterClockwise,
  Robot,
} from "@phosphor-icons/react";
import RecommendedTenders from "../../components/dashboard/RecommendedTenders";
import RecentActivity from "../../components/dashboard/RecentActivity";
import BreezeChat from "../../components/dashboard/BreezeChat";

export default function Home() {
  const navigate = useNavigate();

  const user = useAppSelector(selectAuthUser);
  const [searchQuery, setSearchQuery] = useState("");
  const [mainViewMode, setMainViewMode] = useState<
    "recommended" | "history" | "chat"
  >("recommended");

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
      id: "1",
      title: "Software Development Services for Digital Transformation",
      contracting_entity_name: "Government of Ontario",
      tender_closing_date: "2025-07-25",
      regions_of_delivery: "Toronto, ON",
      relevanceScore: 95,
      notice_type: "RFP",
      tender_status: "Open",
      publication_date: "2025-06-25",
      procurement_category: "Information Technology",
    },
    {
      id: "2",
      title: "IT Infrastructure Consulting Services",
      contracting_entity_name: "City of Vancouver",
      tender_closing_date: "2025-07-30",
      regions_of_delivery: "Vancouver, BC",
      relevanceScore: 88,
      notice_type: "RFQ",
      tender_status: "Open",
      publication_date: "2025-06-30",
      procurement_category: "Consulting Services",
    },
    {
      id: "3",
      title: "Cybersecurity Assessment and Implementation",
      contracting_entity_name: "Government of Canada",
      tender_closing_date: "2025-08-05",
      regions_of_delivery: "Ottawa, ON",
      relevanceScore: 92,
      notice_type: "RFP",
      tender_status: "Open",
      publication_date: "2025-07-05",
      procurement_category: "Security Services",
    },
    {
      id: "4",
      title: "Cloud Migration and DevOps Services",
      contracting_entity_name: "City of Calgary",
      tender_closing_date: "2025-08-15",
      regions_of_delivery: "Calgary, AB",
      relevanceScore: 89,
      notice_type: "RFP",
      tender_status: "Open",
      publication_date: "2025-07-15",
      procurement_category: "Information Technology",
    },
    {
      id: "5",
      title: "Database Modernization Project",
      contracting_entity_name: "Province of British Columbia",
      tender_closing_date: "2025-08-20",
      regions_of_delivery: "Victoria, BC",
      relevanceScore: 91,
      notice_type: "RFQ",
      tender_status: "Open",
      publication_date: "2025-07-20",
      procurement_category: "Data Management",
    },
    {
      id: "6",
      title: "Mobile Application Development",
      contracting_entity_name: "City of Montreal",
      tender_closing_date: "2025-09-01",
      regions_of_delivery: "Montreal, QC",
      relevanceScore: 86,
      notice_type: "RFP",
      tender_status: "Open",
      publication_date: "2025-08-01",
      procurement_category: "Software Development",
    },
    {
      id: "7",
      title: "Data Analytics Platform Implementation",
      contracting_entity_name: "Government of Alberta",
      tender_closing_date: "2025-09-10",
      regions_of_delivery: "Edmonton, AB",
      relevanceScore: 94,
      notice_type: "RFP",
      tender_status: "Open",
      publication_date: "2025-08-10",
      procurement_category: "Analytics Services",
    },
    {
      id: "8",
      title: "Enterprise Software Licensing",
      contracting_entity_name: "City of Winnipeg",
      tender_closing_date: "2025-09-15",
      regions_of_delivery: "Winnipeg, MB",
      relevanceScore: 82,
      notice_type: "RFQ",
      tender_status: "Open",
      publication_date: "2025-08-15",
      procurement_category: "Software Licensing",
    },
    {
      id: "9",
      title: "Network Security Upgrade",
      contracting_entity_name: "Province of Nova Scotia",
      tender_closing_date: "2025-09-20",
      regions_of_delivery: "Halifax, NS",
      relevanceScore: 90,
      notice_type: "RFP",
      tender_status: "Open",
      publication_date: "2025-08-20",
      procurement_category: "Network Security",
    },
    {
      id: "10",
      title: "Digital Workflow Automation",
      contracting_entity_name: "City of Quebec",
      tender_closing_date: "2025-09-25",
      regions_of_delivery: "Quebec City, QC",
      relevanceScore: 87,
      notice_type: "RFP",
      tender_status: "Open",
      publication_date: "2025-08-25",
      procurement_category: "Process Automation",
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
    {
      id: 4,
      action: "Applied",
      title: "Software Development Services RFP",
      time: "2025-07-05T11:20:00Z",
      description:
        "Full-stack web application development with modern frameworks. Includes user experience design and accessibility compliance.",
      location: "Calgary, AB",
      publishDate: "2025-06-25",
      closingDate: "2025-07-20",
    },
    {
      id: 5,
      action: "Viewed",
      title: "Cybersecurity Assessment Project",
      time: "2025-07-04T13:15:00Z",
      description:
        "Comprehensive security audit and penetration testing services. Includes compliance assessment and vulnerability management.",
      location: "Montreal, QC",
      publishDate: "2025-06-30",
      closingDate: "2025-08-10",
    },
    {
      id: 6,
      action: "Bookmarked",
      title: "Mobile App Development Tender",
      time: "2025-07-03T08:30:00Z",
      description:
        "Cross-platform mobile application development for citizen services. Focus on accessibility and offline capabilities.",
      location: "Victoria, BC",
      publishDate: "2025-06-20",
      closingDate: "2025-07-28",
    },
    {
      id: 7,
      action: "Alert",
      title: "Deadline reminder: Infrastructure RFQ",
      time: "2025-07-01T10:00:00Z",
      description:
        "Network infrastructure upgrade and maintenance services. Includes 24/7 support and disaster recovery planning.",
      location: "Edmonton, AB",
      publishDate: "2025-06-15",
      closingDate: "2025-07-15",
    },
    {
      id: 8,
      action: "Downloaded",
      title: "Enterprise Software RFP Documents",
      time: "2025-07-01T15:30:00Z",
      description:
        "Enterprise resource planning system implementation and customization. Includes training and change management services.",
      location: "Winnipeg, MB",
      publishDate: "2025-06-18",
      closingDate: "2025-08-01",
    },
    {
      id: 9,
      action: "Viewed",
      title: "Network Security Tender",
      time: "2025-07-01T12:45:00Z",
      description:
        "Advanced firewall and intrusion detection system deployment. Includes security monitoring and incident response.",
      location: "Halifax, NS",
      publishDate: "2025-06-22",
      closingDate: "2025-08-15",
    },
    {
      id: 10,
      action: "Saved",
      title: "Digital Transformation Project",
      time: "2025-06-24T14:20:00Z",
      description:
        "Government digital services modernization initiative. Covers citizen portal development and process automation.",
      location: "Quebec City, QC",
      publishDate: "2025-06-10",
      closingDate: "2025-07-22",
    },
    {
      id: 11,
      action: "Applied",
      title: "Data Analytics Platform RFP",
      time: "2025-06-24T09:15:00Z",
      description:
        "Business intelligence and data analytics platform implementation. Includes dashboard development and reporting tools.",
      location: "Saskatoon, SK",
      publishDate: "2025-06-12",
      closingDate: "2025-07-30",
    },
    {
      id: 12,
      action: "Alert",
      title: "New tender: Workflow Automation",
      time: "2025-06-24T11:30:00Z",
      description:
        "Business process automation and workflow management system. Focus on efficiency improvements and cost reduction.",
      location: "Regina, SK",
      publishDate: "2025-06-14",
      closingDate: "2025-08-05",
    },
    {
      id: 13,
      action: "Viewed",
      title: "Cloud Infrastructure Services",
      time: "2025-06-17T16:00:00Z",
      description:
        "Hybrid cloud infrastructure design and implementation. Includes migration strategy and performance optimization.",
      location: "St. John's, NL",
      publishDate: "2025-06-08",
      closingDate: "2025-07-18",
    },
    {
      id: 14,
      action: "Bookmarked",
      title: "AI Implementation Consulting",
      time: "2025-06-17T13:45:00Z",
      description:
        "Artificial intelligence and machine learning solution development. Includes model training and deployment strategies.",
      location: "Charlottetown, PE",
      publishDate: "2025-06-05",
      closingDate: "2025-07-25",
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
          ) : mainViewMode === "chat" ? (
            <BreezeChat />
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
