import { useState, useCallback, useMemo, useEffect } from "react";
import {
  FileText,
  Building,
  Clock,
  Bookmark,
  Sparkle,
} from "@phosphor-icons/react";
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
  compact = false,
}: {
  tenderId: string | null;
  compact?: boolean;
}) {
  const [tender, setTender] = useState<Tender | null>(null);
  useEffect(() => {
    const fetchTender = async () => {
      try {
        if (!tenderId?.trim()) return;
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
    if (compact) {
      return (
        <div className="h-full flex items-center justify-center p-4">
          <div className="text-center">
            <FileText className="w-12 h-12 text-text-light mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-text mb-1">
              Select a Tender
            </h3>
            <p className="text-sm text-text-light">
              Choose a tender to view details
            </p>
          </div>
        </div>
      );
    }
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center">
          <FileText className="w-16 h-16 text-text-light mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-text mb-2">Select a Tender</h1>
          <p className="text-text-light mb-6">
            You can view the full tender details by selecting a tender from the
            search results.
          </p>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="h-full flex flex-col bg-surface border border-border rounded-lg overflow-hidden">
        {/* Compact Header - Essential Info Only */}
        <div className="flex-shrink-0 p-3 border-b border-border">
          <div className="flex items-start justify-between mb-2">
            <h2 className="text-sm font-semibold text-text line-clamp-2 flex-1 pr-2">
              {tender.title}
            </h2>
            <button
              onClick={handleBookmark}
              className={`p-1 rounded transition-colors flex-shrink-0 ${
                isBookmarked
                  ? "text-primary"
                  : "text-text-light hover:text-text"
              }`}
            >
              <Bookmark className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-center gap-1 mb-2">
            <span
              className={`px-1.5 py-0.5 rounded text-xs font-medium border ${getStatusColor(
                tender.status
              )}`}
            >
              {tender.status || "Unknown"}
            </span>
            {closingDays && (
              <span
                className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                  isUrgent
                    ? "bg-error/10 text-error"
                    : "bg-success/10 text-success"
                }`}
              >
                {closingDays}
              </span>
            )}
          </div>

          <div className="text-xs text-text-light">
            <div className="flex items-center gap-1 mb-1">
              <Building className="w-3 h-3" />
              <span className="truncate">
                {tender.contracting_entity_name || "Unknown"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Closes: {formatDate(tender.closing_date)}</span>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {/* AI Summary - Compact */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-2">
            <h3 className="text-xs font-semibold text-primary mb-1 flex items-center gap-1">
              <Sparkle className="w-3 h-3" />
              AI Summary
            </h3>
            <div className="text-xs text-text-muted">
              {tender?.summary ? (
                <p className="line-clamp-3">{tender.summary}</p>
              ) : (
                <div className="flex items-center gap-1">
                  <div className="animate-spin rounded-lg h-3 w-3 border border-primary border-t-transparent"></div>
                  <span>Analyzing...</span>
                </div>
              )}
            </div>
          </div>

          {/* Key Details */}
          <div className="bg-surface-muted/30 rounded-lg p-2">
            <h3 className="text-xs font-semibold text-text mb-2">
              Key Details
            </h3>
            <div className="grid grid-cols-1 gap-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-text-muted">Method:</span>
                <span className="text-text text-right">
                  {tender.procurement_method || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Category:</span>
                <span className="text-text text-right truncate max-w-20">
                  {tender.category_primary || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Location:</span>
                <span className="text-text text-right">
                  {tender.delivery_location || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          {tender.description && (
            <div className="bg-surface-muted/30 rounded-lg p-2">
              <h3 className="text-xs font-semibold text-text mb-1">
                Description
              </h3>
              <p className="text-xs text-text-muted line-clamp-4 leading-relaxed">
                {tender.description}
              </p>
            </div>
          )}
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
          compact={false}
        />

        <div className="flex flex-col items-center gap-2">
          <TenderNoticeSidebar
            tender={tender}
            isBookmarked={isBookmarked}
            isUrgent={isUrgent}
            onBookmark={handleBookmark}
            formatDate={formatDate}
            formatDateTime={formatDateTime}
            compact={false}
          />

          <TenderNoticeSummary tender={tender} compact={false} />
          <TenderNoticeBody tender={tender} compact={false} />
        </div>
      </div>
    </div>
  );
}
