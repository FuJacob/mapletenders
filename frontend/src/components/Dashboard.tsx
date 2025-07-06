import {
  Lightning,
  Bookmark,
  Bell,
  Clock,
  Star,
  Eye,
} from "@phosphor-icons/react";

export default function Dashboard() {
  const mockStats = {
    newTenders: 12,
    savedTenders: 8,
    activeAlerts: 3,
    deadlinesThisWeek: 5,
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

  return (
    <div className=" mx-auto p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-text mb-2">Your Dashboard</h2>
        <p className="text-lg text-text-light">
          Here's what's happening with your tender opportunities
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-surface border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Lightning className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-green-600 font-medium">
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
            <div className="p-2 bg-blue-50 rounded-lg">
              <Bookmark className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-text">
            {mockStats.savedTenders}
          </h3>
          <p className="text-sm text-text-light">Saved opportunities</p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Bell className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-text">
            {mockStats.activeAlerts}
          </h3>
          <p className="text-sm text-text-light">Active alerts</p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-red-50 rounded-lg">
              <Clock className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-text">
            {mockStats.deadlinesThisWeek}
          </h3>
          <p className="text-sm text-text-light">Deadlines this week</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recommended Tenders */}
        <div className="lg:col-span-2">
          <div className="bg-surface border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-text">
                Recommended for You
              </h3>
              <button className="text-primary hover:text-primary/80 font-medium">
                View All
              </button>
            </div>

            <div className="space-y-4">
              {mockRecommendedTenders.map((tender) => (
                <div
                  key={tender.id}
                  className="p-4 border border-border rounded-lg hover:bg-background transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-text mb-2 line-clamp-1">
                        {tender.title}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-text-light">
                        <span>{tender.organization}</span>
                        <span>•</span>
                        <span>{tender.value}</span>
                        <span>•</span>
                        <span>{tender.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium">
                          {tender.relevanceScore}%
                        </span>
                      </div>
                      <button className="p-1 text-text-light hover:text-text">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {tender.type}
                    </span>
                    <span className="text-sm text-text-light">
                      Due: {tender.deadline}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="bg-surface border border-border rounded-xl p-6">
            <h3 className="text-xl font-semibold text-text mb-6">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {mockRecentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-text">
                      <span className="font-medium">{activity.action}</span>{" "}
                      {activity.title}
                    </p>
                    <p className="text-xs text-text-light mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
