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
    tender_status: string | null;
    notice_type: string | null;
    contracting_entity_name: string | null;
    contracting_entity_city: string | null;
    contracting_entity_province: string | null;
    publication_date: string | null;
    tender_closing_date: string | null;
    reference_number: string | null;
    solicitation_number: string | null;
    amendment_number: string | null;
    notice_url: string | null;
  };
  isBookmarked: boolean;
  isUrgent: boolean;
  closingDays: string;
  onBookmark: () => void;
  onShare: () => void;
  formatDate: (dateString: string | null) => string;
  formatDateTime: (dateString: string | null) => string;
  getStatusColor: (status: string | null) => string;
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
}: TenderNoticeHeaderProps) {
  const navigate = useNavigate();

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
                    tender.tender_status
                  )}`}
                >
                  {tender.tender_status || "Status Unknown"}
                </span>
                {tender.notice_type && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {tender.notice_type}
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
                <span>Published: {formatDate(tender.publication_date)}</span>
              </div>
              <div
                className={`flex items-center gap-2 ${
                  isUrgent ? "text-red-600" : "text-text-light"
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>
                  Closes: {formatDateTime(tender.tender_closing_date)}
                </span>
                {closingDays && (
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      isUrgent
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
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
            {tender.notice_url && (
              <a
                href={tender.notice_url}
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
          {tender.reference_number && (
            <span>
              Reference: <strong>{tender.reference_number}</strong>
            </span>
          )}
          {tender.solicitation_number && (
            <span>
              Solicitation: <strong>{tender.solicitation_number}</strong>
            </span>
          )}
          {tender.amendment_number && (
            <span>
              Amendment: <strong>{tender.amendment_number}</strong>
            </span>
          )}
        </div>
      </div>
    </>
  );
}
