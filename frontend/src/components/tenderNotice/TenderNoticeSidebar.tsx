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
  compact?: boolean;
}

export function TenderNoticeSidebar({
  tender,
  isBookmarked,
  isUrgent,
  onBookmark,
  formatDate,
  formatDateTime,
  compact = false,
}: TenderNoticeSidebarProps) {
  if (compact) {
    return (
      <div className="flex w-full bg-surface border border-border rounded-lg p-4 gap-4 text-sm">
        {/* Dates */}
        <div className="flex-1 space-y-1">
          <h3 className="font-semibold text-text flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4" /> Dates
          </h3>
          <p>
            <span className="font-medium">Pub:</span>{" "}
            {formatDate(tender.published_date)}
          </p>
          <p className={isUrgent ? "text-error font-medium" : ""}>
            <span className="font-medium">Close:</span>{" "}
            {formatDateTime(tender.closing_date)}
          </p>
          {tender.contract_start_date && (
            <p>
              <span className="font-medium">Start:</span>{" "}
              {formatDate(tender.contract_start_date)}
            </p>
          )}
        </div>

        {/* Contact */}
        {(tender.contact_name ||
          tender.contact_email ||
          tender.contact_phone) && (
          <div className="flex-1 space-y-1">
            <h3 className="font-semibold text-text flex items-center gap-2 mb-1">
              <User className="w-4 h-4" /> Contact
            </h3>
            {tender.contact_name && (
              <p>
                <span className="font-medium">Name:</span> {tender.contact_name}
              </p>
            )}
            {tender.contact_email && (
              <p className="flex items-center gap-1">
                <Envelope className="w-4 h-4" />
                <a
                  href={`mailto:${tender.contact_email}`}
                  className="text-primary hover:underline"
                >
                  {tender.contact_email}
                </a>
              </p>
            )}
            {tender.contact_phone && (
              <p className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                <a
                  href={`tel:${tender.contact_phone}`}
                  className="text-primary hover:underline"
                >
                  {tender.contact_phone}
                </a>
              </p>
            )}
          </div>
        )}

        {/* Entity */}
        <div className="flex-1 space-y-1">
          <h3 className="font-semibold text-text flex items-center gap-2 mb-1">
            <Building className="w-4 h-4" /> Entity
          </h3>
          <p>
            <span className="font-medium">Org:</span>{" "}
            {tender.contracting_entity_name || "Not specified"}
          </p>
          {(tender.contracting_entity_city ||
            tender.contracting_entity_province ||
            tender.contracting_entity_country) && (
            <p>
              <span className="font-medium">Loc:</span>{" "}
              {[
                tender.contracting_entity_city,
                tender.contracting_entity_province,
                tender.contracting_entity_country,
              ]
                .filter(Boolean)
                .join(", ")}
            </p>
          )}
        </div>
      </div>
    );
  }
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
                isUrgent ? "text-error font-medium" : "text-text-light"
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
