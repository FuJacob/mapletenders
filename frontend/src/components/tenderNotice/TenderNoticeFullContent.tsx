import { useState, useCallback, useMemo, useEffect } from "react";
import { FileText } from "@phosphor-icons/react";
import {
  TenderNoticeHeader,
  TenderNoticeBody,
  TenderNoticeSidebar,
  TenderNoticeSummary,
} from "./";
import { getTenderNotice, type Tender } from "../../api";

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

export function TenderNoticeFullContent({
  tenderId,
}: {
  tenderId: string | null;
}) {
  const [tender, setTender] = useState<Tender | null>(null);
  useEffect(() => {
    const fetchTender = async () => {
      try {
        if (!tenderId) return;
        const tender = await getTenderNotice(tenderId);
        setTender(tender);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTender();
  }, [tenderId]);

  const [isBookmarked, setIsBookmarked] = useState(false);
  const handleBookmark = useCallback(() => {
    setIsBookmarked(!isBookmarked);
    // TODO: Implement bookmark functionality with backend
  }, [isBookmarked]);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: tender?.title || "Government Tender",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // TODO: Show toast notification
    }
  }, [tender?.title]);

  // Calculate values before early returns to comply with rules of hooks
  const closingDays = useMemo(
    () => getDaysUntilClosing(tender?.closing_date || null),
    [tender?.closing_date]
  );
  const isUrgent = useMemo(
    () =>
      closingDays.includes("today") ||
      closingDays.includes("tomorrow") ||
      (closingDays.includes("days") && parseInt(closingDays) <= 7),
    [closingDays]
  );

  if (!tender) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto p-8">
          <div className="text-center">
            <FileText className="w-16 h-16 text-text-light mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-text mb-2">
              Select a Tender
            </h1>
            <p className="text-text-light mb-6">
              You can view the full tender details by selecting a tender from
              the search results.
            </p>
          </div>
        </div>
      </div>
    );
  }

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
          compact={true}
        />

        <div className="flex flex-col items-center gap-2">
          {/* Main Content */}

          <TenderNoticeSidebar
            tender={tender}
            isBookmarked={isBookmarked}
            isUrgent={isUrgent}
            onBookmark={handleBookmark}
            formatDate={formatDate}
            formatDateTime={formatDateTime}
            compact={true}
          />

          <TenderNoticeSummary tender={tender} />
          <TenderNoticeBody tender={tender} />
        </div>
      </div>
    </div>
  );
}
