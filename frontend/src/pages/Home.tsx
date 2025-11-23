import { useState, useEffect } from "react";
import { HouseIcon } from "@phosphor-icons/react";
import { PageHeader } from "../components/ui";
import ActivityAndRecommendations from "../components/dashboard/ActivityAndRecommendations";
import { getRecommendedTenders } from "../api/tenders";
import type { TenderSearchResult } from "../api/types";
import { useAuth } from "../hooks/auth";

// Mock activities since we removed analytics
const mockActivities = [
  {
    id: 1,
    action: "New Match" as const,
    title: "IT Infrastructure Modernization - Health Canada",
    time: new Date().toISOString(),
    description:
      "Comprehensive IT infrastructure upgrade including cloud migration and security enhancements.",
    location: "Ottawa, ON",
    publishDate: new Date().toISOString().split("T")[0],
    closingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  },
  {
    id: 2,
    action: "Saved" as const,
    title: "Software Development Services - CBSA",
    time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    description:
      "Development of custom border management software solutions with AI-powered risk assessment.",
    location: "Toronto, ON",
    publishDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    closingDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  },
  {
    id: 3,
    action: "Viewed" as const,
    title: "Cybersecurity Consulting - DND",
    time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    description:
      "Advanced cybersecurity consulting services for critical defense infrastructure.",
    location: "Kingston, ON",
    publishDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    closingDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  },
];

export default function Home() {
  const { profile } = useAuth();
  const [recommendedTenders, setRecommendedTenders] = useState<
    TenderSearchResult[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendedTenders = async () => {
      try {
        setLoading(true);
        const response = await getRecommendedTenders();
        setRecommendedTenders(response.results || []);
      } catch (error) {
        console.error("Failed to fetch recommended tenders:", error);
        setRecommendedTenders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendedTenders();
  }, []);

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <PageHeader
        icon={<HouseIcon className="w-10 h-10 text-primary" />}
        title="Dashboard"
        description={`Welcome back, ${profile?.company_name || "User"}`}
      />

      {/* Main Content - Activity and Recommendations */}
      <div className="flex-1 min-h-0">
        <ActivityAndRecommendations
          activities={mockActivities}
          tenders={recommendedTenders}
        />
      </div>

      {loading && recommendedTenders.length === 0 && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-text-muted mt-2">Loading recommendations...</p>
        </div>
      )}
    </div>
  );
}
