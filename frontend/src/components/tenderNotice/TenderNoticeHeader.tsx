import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building,
  Calendar,
  Clock,
  MapPin,
  Bookmark,
  Share,
  ArrowSquareOut,
} from "@phosphor-icons/react";

interface TenderNoticeHeaderProps {
  tender: {
    id: string;
    title: string | null;
    status: string | null;
    procurement_type: string | null;
    contracting_entity_name: string | null;
    contracting_entity_city: string | null;
    contracting_entity_province: string | null;
    published_date: string | null;
    closing_date: string | null;
    source_reference: string | null;
    source_url: string | null;
  };
  isBookmarked: boolean;
  isUrgent: boolean;
  closingDays: string;
  onBookmark: () => void;
  onShare: () => void;
  formatDate: (dateString: string | null) => string;
  formatDateTime: (dateString: string | null) => string;
  getStatusColor: (status: string | null) => string;
  compact?: boolean;
}

export function TenderNoticeHeader({
  tender,
  isBookmarked,
  isUrgent,
  closingDays,
  onBookmark,
  onShare,
  formatDate,
  formatDateTime,
  getStatusColor,
  compact = false,
}: TenderNoticeHeaderProps) {
  const navigate = useNavigate();
  if (compact) {
    return (
      <div className="bg-surface border border-border rounded-lg p-4 mb-4 text-sm">
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-lg font-semibold text-text">{tender.title}</h1>
          <button
            onClick={onBookmark}
            className={`p-1 rounded-md transition-colors ${
              isBookmarked ? "text-primary" : "text-text-light hover:text-text"
            }`}
            aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            <Bookmark className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-2 mb-2">
          <span
            className={`px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(
              tender.status
            )}`}
          >
            {tender.status || "Status Unknown"}
          </span>
          <span className="px-2 py-0.5 bg-info/10 text-info rounded text-xs font-medium">
            {tender.procurement_type}
          </span>
          {closingDays && (
            <span
              className={`ml-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${
                isUrgent
                  ? "bg-error/10 text-error"
                  : "bg-success/10 text-success"
              }`}
            >
              {closingDays}
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div className="flex items-center gap-1 text-text-light text-xs">
            <Building className="w-3 h-3" />
            <span>{tender.contracting_entity_name}</span>
          </div>
          <div className="flex items-center gap-1 text-text-light text-xs">
            <Building className="w-3 h-3" />
            <span>{formatDate(tender.published_date)}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Back Navigation */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 p-2 text-text-light hover:text-text hover:bg-border rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <div className="flex items-center gap-2 text-sm text-text-light">
          <Link to="/search" className="hover:text-primary">
            Search Results
          </Link>
          <span>/</span>
          <span>Tender Details</span>
        </div>
      </div>

      {/* Header Section */}
      <div className="bg-surface border border-border rounded-xl p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-2xl font-bold text-text">{tender.title}</h1>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                    tender.status
                  )}`}
                >
                  {tender.status || "Status Unknown"}
                </span>
                {tender.procurement_type && (
                  <span className="px-3 py-1 bg-info/10 text-info rounded-full text-sm font-medium">
                    {tender.procurement_type}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2 text-text-light">
                <Building className="w-4 h-4" />
                <span>{tender.contracting_entity_name || "Not specified"}</span>
              </div>
              <div className="flex items-center gap-2 text-text-light">
                <MapPin className="w-4 h-4" />
                <span>
                  {[
                    tender.contracting_entity_city,
                    tender.contracting_entity_province,
                  ]
                    .filter(Boolean)
                    .join(", ") || "Location not specified"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-text-light">
                <Calendar className="w-4 h-4" />
                <span>Published: {formatDate(tender.published_date)}</span>
              </div>
              <div
                className={`flex items-center gap-2 ${
                  isUrgent ? "text-error" : "text-text-light"
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Closes: {formatDateTime(tender.closing_date)}</span>
                {closingDays && (
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      isUrgent
                        ? "bg-error/10 text-error"
                        : "bg-success/10 text-success"
                    }`}
                  >
                    {closingDays}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={onBookmark}
              className={`p-2 rounded-lg transition-colors ${
                isBookmarked
                  ? "bg-accent text-white"
                  : "text-text-light hover:text-accent hover:bg-border"
              }`}
            >
              <Bookmark className="w-5 h-5" />
            </button>
            <button
              onClick={onShare}
              className="p-2 text-text-light hover:text-text hover:bg-border rounded-lg transition-colors"
            >
              <Share className="w-5 h-5" />
            </button>
            {tender.source_url && (
              <a
                href={tender.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-text-light hover:text-primary hover:bg-border rounded-lg transition-colors"
              >
                <ArrowSquareOut className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>

        {/* Reference Numbers */}
        <div className="flex flex-wrap gap-4 text-sm text-text-light">
          {tender.source_reference && (
            <span>
              Reference: <strong>{tender.source_reference}</strong>
            </span>
          )}
        </div>
      </div>
    </>
  );
}
