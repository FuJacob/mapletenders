import {
  Calendar,
  MapPin,
  CurrencyDollar,
  Star,
  Bookmark,
  ArrowSquareOut,
} from "@phosphor-icons/react";
import type { Tender } from "./types.tsx";

interface TenderCardProps {
  tender: Tender;
}

export default function TenderCard({ tender }: TenderCardProps) {
  return (
    <div className="border border-border rounded-lg p-4 hover:border-primary transition-colors cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-text mb-2 hover:text-primary transition-colors flex items-center gap-2">
            {tender.title}
            <ArrowSquareOut className="w-4 h-4 text-text-light" />
          </h3>
          <p className="text-sm text-text-light mb-2">
            {tender.contracting_entity_name}
          </p>
          <div className="flex items-center gap-4 text-sm text-text-light">
            <span className="flex items-center gap-1">
              <CurrencyDollar className="w-4 h-4" />
              Value TBD
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {tender.regions_of_delivery}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Due{" "}
              {tender.tender_closing_date
                ? new Date(tender.tender_closing_date).toLocaleDateString()
                : "TBD"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
            <Star className="w-3 h-3" />
            {tender.relevanceScore}%
          </div>
          <button className="p-2 text-text-light hover:text-accent transition-colors">
            <Bookmark className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="bg-border text-text-light px-2 py-1 rounded text-xs">
            {tender.notice_type || "RFP"}
          </span>
          <span className="bg-success/10 text-success px-2 py-1 rounded text-xs">
            {tender.tender_status || "Open"}
          </span>
        </div>
        <button className="text-primary hover:text-primary-dark text-sm font-medium">
          View Details →
        </button>
      </div>
    </div>
  );
}
