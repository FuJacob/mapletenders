import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Warning, FileText } from "@phosphor-icons/react";
import { getTenderNotice } from "../api";
import LoadingSpinner from "../components/common/LoadingSpinner";
import {
  TenderNoticeHeader,
  TenderNoticeBody,
  TenderNoticeSidebar,
  TenderNoticeSummary,
} from "../components/tenderNotice";
import { type Tender as TenderData } from "../features/tenders/types";
import { useAppDispatch } from "../app/hooks";
import { getTenderById } from "../api";
import { setTender } from "../features/tenders/tendersSlice";

// Pure utility functions moved outside component
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
      return "bg-success/10 text-success border-success/20";
    case "closed":
      return "bg-error/10 text-error border-error/20";
    case "cancelled":
      return "bg-text-muted/10 text-text-muted border-text-muted/20";
    case "awarded":
      return "bg-info/10 text-info border-info/20";
    default:
      return "bg-warning/10 text-warning border-warning/20";
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

export default function TenderNotice() {
  const { tenderId } = useParams<{ tenderId: string }>();
  const navigate = useNavigate();
  const [selectedTender, setSelectedTender] = useState<TenderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const fetchTender = async () => {
      if (!tenderId) {
        setError("No tender ID provided");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching tender:", tenderId);
        const data = await getTenderNotice(tenderId);
        if (data === null) {
          const data = await getTenderById(tenderId);
          if (data) {
            dispatch(setTender(data));
            setSelectedTender(data);
          }
        }
        console.log(data);
        if (error) {
          console.error("Error fetching tender:", error);
          setError("Failed to load tender details");
        } else if (data) {
          setSelectedTender(data);
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
  }, [tenderId, error, dispatch]);

  const handleBookmark = useCallback(() => {
    setIsBookmarked(!isBookmarked);
    // TODO: Implement bookmark functionality with backend
  }, [isBookmarked]);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: selectedTender?.title || "Government Tender",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // TODO: Show toast notification
    }
  }, [selectedTender?.title]);

  // Calculate values before early returns to comply with rules of hooks
  const closingDays = useMemo(
    () => getDaysUntilClosing(selectedTender?.closing_date || null),
    [selectedTender?.closing_date]
  );
  const isUrgent = useMemo(
    () =>
      closingDays.includes("today") ||
      closingDays.includes("tomorrow") ||
      (closingDays.includes("days") && parseInt(closingDays) <= 7),
    [closingDays]
  );

  if (loading) {
    return <LoadingSpinner message="Loading tender details..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto p-8">
          <div className="text-center">
            <Warning className="w-16 h-16 text-error mx-auto mb-4" />
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

  if (!selectedTender) {
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

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6">
        <TenderNoticeHeader
          tender={selectedTender}
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
            <TenderNoticeSummary tender={selectedTender} />
            <TenderNoticeBody tender={selectedTender} />
          </div>

          {/* Sidebar */}
          <div>
            <TenderNoticeSidebar
              tender={selectedTender}
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
