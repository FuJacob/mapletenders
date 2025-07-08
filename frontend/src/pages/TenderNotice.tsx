import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Warning, FileText } from "@phosphor-icons/react";
import { getTenderNotice } from "../api";
import LoadingSpinner from "../components/common/LoadingSpinner";
import {
  TenderNoticeHeader,
  TenderNoticeBody,
  TenderNoticeSidebar,
} from "../components/tenderNotice";

interface TenderData {
  id: string;
  title: string | null;
  tender_description: string | null;
  contracting_entity_name: string | null;
  contracting_entity_address_line: string | null;
  contracting_entity_city: string | null;
  contracting_entity_province: string | null;
  contracting_entity_country: string | null;
  contracting_entity_postal_code: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  contact_fax: string | null;
  contact_address_line: string | null;
  contact_city: string | null;
  contact_province: string | null;
  contact_country: string | null;
  contact_postal_code: string | null;
  publication_date: string | null;
  tender_closing_date: string | null;
  expected_contract_start_date: string | null;
  expected_contract_end_date: string | null;
  notice_type: string | null;
  procurement_method: string | null;
  procurement_category: string | null;
  tender_status: string | null;
  reference_number: string | null;
  solicitation_number: string | null;
  gsin: string | null;
  gsin_description: string | null;
  unspsc: string | null;
  unspsc_description: string | null;
  regions_of_delivery: string | null;
  regions_of_opportunity: string | null;
  selection_criteria: string | null;
  trade_agreements: string | null;
  limited_tendering_reason: string | null;
  end_user_entities_name: string | null;
  end_user_entities_address: string | null;
  notice_url: string | null;
  attachments: string | null;
  amendment_number: string | null;
  amendment_date: string | null;
}

export default function TenderNotice() {
  const { tenderId } = useParams<{ tenderId: string }>();
  const navigate = useNavigate();
  const [tender, setTender] = useState<TenderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const fetchTender = async () => {
      if (!tenderId) {
        setError("No tender ID provided");
        setLoading(false);
        return;
      }

      try {
        const data = await getTenderNotice(tenderId);
        if (error) {
          console.error("Error fetching tender:", error);
          setError("Failed to load tender details");
        } else if (data) {
          setTender(data);
        } else {
          setError("Tender not found");
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchTender();
  }, [tenderId]);

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";
    return date.toLocaleDateString("en-CA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string | null): string => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";
    return date.toLocaleString("en-CA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case "open":
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "closed":
        return "bg-red-100 text-red-800 border-red-200";
      case "cancelled":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "awarded":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  const getDaysUntilClosing = (closingDate: string | null): string => {
    if (!closingDate) return "";
    const closing = new Date(closingDate);
    const now = new Date();
    const diffTime = closing.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Closed";
    if (diffDays === 0) return "Closes today";
    if (diffDays === 1) return "Closes tomorrow";
    return `${diffDays} days remaining`;
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // TODO: Implement bookmark functionality with backend
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: tender?.title || "Government Tender",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // TODO: Show toast notification
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading tender details..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto p-8">
          <div className="text-center">
            <Warning className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-text mb-2">
              Error Loading Tender
            </h1>
            <p className="text-text-light mb-6">{error}</p>
            <button
              onClick={() => navigate("/search")}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
            >
              Back to Search
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!tender) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto p-8">
          <div className="text-center">
            <FileText className="w-16 h-16 text-text-light mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-text mb-2">
              Tender Not Found
            </h1>
            <p className="text-text-light mb-6">
              The requested tender could not be found.
            </p>
            <button
              onClick={() => navigate("/search")}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
            >
              Back to Search
            </button>
          </div>
        </div>
      </div>
    );
  }

  const closingDays = getDaysUntilClosing(tender.tender_closing_date);
  const isUrgent =
    closingDays.includes("today") ||
    closingDays.includes("tomorrow") ||
    (closingDays.includes("days") && parseInt(closingDays) <= 7);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6">
        <TenderNoticeHeader
          tender={tender}
          isBookmarked={isBookmarked}
          isUrgent={isUrgent}
          closingDays={closingDays}
          onBookmark={handleBookmark}
          onShare={handleShare}
          formatDate={formatDate}
          formatDateTime={formatDateTime}
          getStatusColor={getStatusColor}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <TenderNoticeBody tender={tender} />
          </div>

          {/* Sidebar */}
          <div>
            <TenderNoticeSidebar
              tender={tender}
              isBookmarked={isBookmarked}
              isUrgent={isUrgent}
              onBookmark={handleBookmark}
              formatDate={formatDate}
              formatDateTime={formatDateTime}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
