import React, { useMemo, useCallback } from "react";
import {
  Calendar,
  MapPin,
  CurrencyDollar,
  Star,
  Bookmark,
  ArrowSquareOut,
} from "@phosphor-icons/react";
import type { TenderSummary } from "./types.tsx";

interface TenderCardProps {
  tender: TenderSummary;
  onBookmark?: (tenderId: string) => void;
  onViewDetails?: (tenderId: string) => void;
}

function TenderCard({ tender, onBookmark, onViewDetails }: TenderCardProps) {
  // Memoize formatted date to prevent recalculation
  const formattedDate = useMemo(() => {
    return tender.closing_date
      ? new Date(tender.closing_date).toLocaleDateString()
      : "TBD";
  }, [tender.closing_date]);

  // Memoize click handlers
  const handleBookmark = useCallback(() => {
    if (tender.id) onBookmark?.(tender.id);
  }, [onBookmark, tender.id]);

  const handleViewDetails = useCallback(() => {
    if (tender.id) onViewDetails?.(tender.id);
  }, [onViewDetails, tender.id]);
  return (
    <div className="border border-border rounded-lg p-4 hover:border-primary transition-colors cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-text mb-2 hover:text-primary transition-colors flex items-center gap-2">
            {tender.title}
            <ArrowSquareOut className="w-4 h-4 text-text-light" />
          </h3>
          <p className="text-sm text-text-light mb-2">
            {tender.contracting_entity_name || "Unknown Organization"}
          </p>
          <div className="flex items-center gap-4 text-sm text-text-light">
            <span className="flex items-center gap-1">
              <CurrencyDollar className="w-4 h-4" />
              Value TBD
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {tender.delivery_location}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Due {formattedDate}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
            <Star className="w-3 h-3" />
            {tender.relevanceScore}%
          </div>
          <button
            onClick={handleBookmark}
            className="p-2 text-text-light hover:text-accent transition-colors"
          >
            <Bookmark className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="bg-border text-text-light px-2 py-1 rounded text-xs">
            {tender.procurement_type || "RFP"}
          </span>
          <span className="bg-success/10 text-success px-2 py-1 rounded text-xs">
            {tender.status || "Open"}
          </span>
        </div>
        <button
          onClick={handleViewDetails}
          className="text-primary hover:text-primary-dark text-sm font-medium"
        >
          View Details →
        </button>
      </div>
    </div>
  );
}

export default React.memo(TenderCard);
