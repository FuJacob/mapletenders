import { useState } from "react";
import {
  X,
  ArrowSquareOut,
  MapPin,
  Building,
  Tag,
  Clock,
  BookmarkSimple,
} from "@phosphor-icons/react";
import type { CalendarEvent } from "../../utils/calendarHelpers";
import {
  formatClosingDate,
  formatTenderLocation,
  getUrgencyInfo,
} from "../../utils/calendarHelpers";

interface TenderEventModalProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleBookmark?: (tenderId: string, isBookmarked: boolean) => void;
  isBookmarked?: boolean;
}

export default function TenderEventModal({
  event,
  isOpen,
  onClose,
  onToggleBookmark,
  isBookmarked = true, // Since we're showing bookmarked tenders
}: TenderEventModalProps) {
  const [isTogglingBookmark, setIsTogglingBookmark] = useState(false);

  if (!isOpen || !event) {
    return null;
  }

  const { tender } = event;
  const urgencyInfo = getUrgencyInfo(event.resource);
  const location = formatTenderLocation(tender);
  const closingDateFormatted = formatClosingDate(tender.closing_date);

  const handleToggleBookmark = async () => {
    if (!onToggleBookmark) return;

    setIsTogglingBookmark(true);
    try {
      await onToggleBookmark(tender.id, isBookmarked);
    } finally {
      setIsTogglingBookmark(false);
    }
  };

  const handleOpenTender = () => {
    if (tender.source_url) {
      window.open(tender.source_url, "_blank", "noopener,noreferrer");
    } else {
      // Navigate to internal tender page
      window.open(`/tender/${tender.id}`, "_blank");
    }
  };

  return (
    <div className="fixed inset-0 bg-text/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-border">
          <div className="flex-1 mr-4">
            <div className="flex items-center gap-3 mb-2">
              <span
                className={`px-3 py-1 rounded-lg text-sm font-medium ${urgencyInfo.bg} ${urgencyInfo.color}`}
              >
                {urgencyInfo.label}
              </span>
              {tender.procurement_type && (
                <span className="px-3 py-1 bg-surface-muted text-text-muted rounded-lg text-sm">
                  {tender.procurement_type}
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-text mb-2">{tender.title}</h2>
            {tender.contracting_entity_name && (
              <p className="text-text-muted">
                {tender.contracting_entity_name}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-text-light hover:text-text hover:bg-surface-muted rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Key Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-text-light" />
              <div>
                <p className="text-sm font-medium text-text">Closing Date</p>
                <p
                  className={`text-sm ${
                    event.resource === "urgent"
                      ? "text-error font-medium"
                      : "text-text-muted"
                  }`}
                >
                  {closingDateFormatted}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-text-light" />
              <div>
                <p className="text-sm font-medium text-text">Location</p>
                <p className="text-sm text-text-muted">{location}</p>
              </div>
            </div>

            {tender.category_primary && (
              <div className="flex items-center gap-3">
                <Tag className="w-5 h-5 text-text-light" />
                <div>
                  <p className="text-sm font-medium text-text">Category</p>
                  <p className="text-sm text-text-muted">
                    {tender.category_primary}
                  </p>
                </div>
              </div>
            )}

            {tender.source_reference && (
              <div className="flex items-center gap-3">
                <Building className="w-5 h-5 text-text-light" />
                <div>
                  <p className="text-sm font-medium text-text">Reference</p>
                  <p className="text-sm text-text-muted font-mono">
                    {tender.source_reference}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {tender.description && (
            <div>
              <h3 className="text-lg font-semibold text-text mb-3">
                Description
              </h3>
              <div className="bg-surface-muted rounded-lg p-4">
                <p className="text-sm text-text whitespace-pre-wrap">
                  {tender.description.length > 500
                    ? `${tender.description.substring(0, 500)}...`
                    : tender.description}
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
            <button
              onClick={handleOpenTender}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
            >
              <ArrowSquareOut className="w-5 h-5" />
              View Full Tender
            </button>

            {onToggleBookmark && (
              <button
                onClick={handleToggleBookmark}
                disabled={isTogglingBookmark}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors font-medium border ${
                  isBookmarked
                    ? "bg-surface border-border text-text hover:bg-error/10 hover:text-error hover:border-error/30"
                    : "bg-primary text-white border-primary hover:bg-primary-dark"
                }`}
              >
                <BookmarkSimple
                  className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`}
                />
                {isBookmarked
                  ? isTogglingBookmark
                    ? "Removing..."
                    : "Remove Bookmark"
                  : isTogglingBookmark
                  ? "Adding..."
                  : "Add Bookmark"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
