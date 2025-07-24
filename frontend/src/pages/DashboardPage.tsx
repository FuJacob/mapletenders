import { useState, useEffect } from "react";
import WelcomeSection from "../components/dashboard/WelcomeSection";
import DashboardStatsGrid from "../components/dashboard/DashboardStatsGrid";
import RecentActivity from "../components/dashboard/RecentActivity";
import BreezeChat from "../components/dashboard/BreezeChat";
import QuickActionsSidebar from "../components/search/QuickActionsSidebar";
import UrgentDeadlines from "../components/search/UrgentDeadlines";
import type { Activity } from "../components/dashboard/types";

// Mock data for the dashboard
const mockStats = {
  newTenders: 12,
  bookmarks: 8,
  activeAlerts: 5,
  deadlinesThisWeek: 3,
};

const mockActivities: Activity[] = [
  {
    id: 1,
    action: "New Match",
    title: "IT Infrastructure Modernization - Health Canada",
    time: "2024-01-15T10:30:00Z",
    description: "Comprehensive IT infrastructure upgrade including cloud migration, security enhancements, and legacy system replacement for Health Canada's digital transformation initiative.",
    location: "Ottawa, ON",
    publishDate: "2024-01-15",
    closingDate: "2024-02-15"
  },
  {
    id: 2,
    action: "Saved",
    title: "Software Development Services - CBSA",
    time: "2024-01-14T15:45:00Z",
    description: "Development of custom border management software solutions with AI-powered risk assessment capabilities for the Canada Border Services Agency.",
    location: "Toronto, ON",
    publishDate: "2024-01-10",
    closingDate: "2024-02-20"
  },
  {
    id: 3,
    action: "Viewed",
    title: "Cybersecurity Consulting - DND",
    time: "2024-01-14T09:15:00Z",
    description: "Advanced cybersecurity consulting services for critical defense infrastructure, including threat assessment and security architecture design.",
    location: "Kingston, ON",
    publishDate: "2024-01-12",
    closingDate: "2024-01-28"
  },
  {
    id: 4,
    action: "Alert Triggered",
    title: "Cloud Services Framework - Public Works",
    time: "2024-01-13T16:20:00Z",
    description: "Multi-year cloud services framework agreement covering IaaS, PaaS, and SaaS solutions for federal government departments.",
    location: "Nationwide",
    publishDate: "2024-01-13",
    closingDate: "2024-03-15"
  },
  {
    id: 5,
    action: "New Match",
    title: "Data Analytics Platform - Statistics Canada",
    time: "2024-01-13T11:00:00Z",
    description: "Advanced analytics platform for processing and analyzing large datasets with machine learning capabilities for statistical analysis.",
    location: "Ottawa, ON",
    publishDate: "2024-01-11",
    closingDate: "2024-02-28"
  }
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
  const [companyName, setCompanyName] = useState("TechFlow Solutions");
  const [userName, setUserName] = useState("Sarah");

  // In a real app, this would fetch user data from your auth system
  useEffect(() => {
    // Mock user data - replace with actual user data fetching
    // const fetchUserData = async () => {
    //   const user = await getCurrentUser();
    //   setCompanyName(user.company?.name || "Your Company");
    //   setUserName(user.firstName || "there");
    // };
    // fetchUserData();
  }, []);

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-7xl mx-auto p-6">
        {/* Welcome Message */}
        <WelcomeSection companyName={companyName} userName={userName} />
        
        {/* Stats Grid */}
        <DashboardStatsGrid stats={mockStats} />
        
        {/* Main Content Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Content Area (2/3 width on large screens) */}
          <div className="xl:col-span-3 space-y-6">
            {/* Recent Activity */}
            <div className="bg-surface border border-border rounded-xl p-6">
              <h2 className="text-xl font-semibold text-text mb-6">Recent Activity</h2>
              <div className="max-h-96 overflow-y-auto space-y-4">
                {mockActivities.map((activity) => (
                  <div key={activity.id} className="border border-border rounded-lg p-4 hover:border-primary transition-colors cursor-pointer">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-text mb-2 hover:text-primary transition-colors">
                          <span className="text-primary font-medium">{activity.action}:</span> {activity.title}
                        </h3>
                        {activity.description && (
                          <p className="text-sm text-text-muted mb-2 line-clamp-2">
                            {activity.description}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-4 text-xs text-text-light">
                          {activity.location && (
                            <span className="flex items-center gap-1">
                              📍 {activity.location}
                            </span>
                          )}
                          {activity.closingDate && (
                            <span className="flex items-center gap-1">
                              ⏰ Due {new Date(activity.closingDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text-light">
                        {new Date(activity.time).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                      <button className="text-primary hover:text-primary-dark text-sm font-medium">
                        View Details →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Breeze Chat */}
            <div className="bg-surface border border-border rounded-xl p-6 h-96 flex flex-col">
              <BreezeChat />
            </div>
          </div>
          
          {/* Sidebar (1/3 width on large screens) */}
          <div className="xl:col-span-1 space-y-6">
            {/* Quick Actions */}
            <div className="bg-surface border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-text mb-4">Quick Actions</h3>
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
                Based on your activity, you might be interested in upcoming IT and cybersecurity opportunities.
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
    </div>
  );
}