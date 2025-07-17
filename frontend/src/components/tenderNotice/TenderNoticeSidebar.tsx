import {
  Calendar,
  User,
  Phone,
  Envelope,
  Building,
  Globe,
  Bookmark,
} from "@phosphor-icons/react";

interface TenderNoticeSidebarProps {
  tender: {
    published_date: string | null;
    closing_date: string | null;
    contract_start_date: string | null;
    contact_name: string | null;
    contact_email: string | null;
    contact_phone: string | null;
    contracting_entity_name: string | null;
    contracting_entity_city: string | null;
    contracting_entity_province: string | null;
    contracting_entity_country: string | null;
    source_url: string | null;
  };
  isBookmarked: boolean;
  isUrgent: boolean;
  onBookmark: () => void;
  formatDate: (dateString: string | null) => string;
  formatDateTime: (dateString: string | null) => string;
}

export function TenderNoticeSidebar({
  tender,
  isBookmarked,
  isUrgent,
  onBookmark,
  formatDate,
  formatDateTime,
}: TenderNoticeSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Important Dates */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Important Dates
        </h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-text">
              Publication Date
            </label>
            <p className="text-text-light">
              {formatDate(tender.published_date)}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-text">
              Closing Date
            </label>
            <p
              className={
                isUrgent ? "text-red-600 font-medium" : "text-text-light"
              }
            >
              {formatDateTime(tender.closing_date)}
            </p>
          </div>
          {tender.contract_start_date && (
            <div>
              <label className="text-sm font-medium text-text">
                Expected Start Date
              </label>
              <p className="text-text-light">
                {formatDate(tender.contract_start_date)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
          <User className="w-5 h-5" />
          Contact Information
        </h3>
        <div className="space-y-3">
          {tender.contact_name && (
            <div>
              <label className="text-sm font-medium text-text">
                Contact Name
              </label>
              <p className="text-text-light">{tender.contact_name}</p>
            </div>
          )}
          {tender.contact_email && (
            <div>
              <label className="text-sm font-medium text-text">Email</label>
              <a
                href={`mailto:${tender.contact_email}`}
                className="text-primary hover:text-primary-dark flex items-center gap-1"
              >
                <Envelope className="w-4 h-4" />
                {tender.contact_email}
              </a>
            </div>
          )}
          {tender.contact_phone && (
            <div>
              <label className="text-sm font-medium text-text">Phone</label>
              <a
                href={`tel:${tender.contact_phone}`}
                className="text-primary hover:text-primary-dark flex items-center gap-1"
              >
                <Phone className="w-4 h-4" />
                {tender.contact_phone}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Contracting Entity */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
          <Building className="w-5 h-5" />
          Contracting Entity
        </h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-text">
              Organization
            </label>
            <p className="text-text-light">
              {tender.contracting_entity_name || "Not specified"}
            </p>
          </div>
          {(tender.contracting_entity_city ||
            tender.contracting_entity_province ||
            tender.contracting_entity_country) && (
            <div>
              <label className="text-sm font-medium text-text">Location</label>
              <p className="text-text-light">
                {[
                  tender.contracting_entity_city,
                  tender.contracting_entity_province,
                  tender.contracting_entity_country,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-text mb-4">Actions</h3>
        <div className="space-y-3">
          {tender.source_url && (
            <a
              href={tender.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
            >
              <Globe className="w-4 h-4" />
              View Official Notice
            </a>
          )}
          <button
            onClick={onBookmark}
            className={`w-full py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 ${
              isBookmarked
                ? "bg-accent text-white"
                : "border border-border text-text hover:bg-border"
            }`}
          >
            <Bookmark className="w-4 h-4" />
            {isBookmarked ? "Bookmarked" : "Bookmark Tender"}
          </button>
        </div>
      </div>
    </div>
  );
}
