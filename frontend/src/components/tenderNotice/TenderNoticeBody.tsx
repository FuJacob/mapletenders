import { FileText, Tag, CheckCircle } from "@phosphor-icons/react";

interface TenderNoticeBodyProps {
  tender: {
    tender_description: string | null;
    procurement_method: string | null;
    procurement_category: string | null;
    gsin: string | null;
    gsin_description: string | null;
    unspsc: string | null;
    unspsc_description: string | null;
    regions_of_delivery: string | null;
    regions_of_opportunity: string | null;
    selection_criteria: string | null;
    trade_agreements: string | null;
  };
}

export default function TenderNoticeBody({ tender }: TenderNoticeBodyProps) {
  return (
    <div className="space-y-6">
      {/* Description */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <h2 className="text-xl font-semibold text-text mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Tender Description
        </h2>
        <div className="prose prose-sm max-w-none text-text-light">
          {tender.tender_description ? (
            <p className="whitespace-pre-wrap">{tender.tender_description}</p>
          ) : (
            <p className="italic">No description provided</p>
          )}
        </div>
      </div>

      {/* Procurement Details */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <h2 className="text-xl font-semibold text-text mb-4 flex items-center gap-2">
          <Tag className="w-5 h-5" />
          Procurement Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-text">
              Procurement Method
            </label>
            <p className="text-text-light">
              {tender.procurement_method || "Not specified"}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-text">
              Procurement Category
            </label>
            <p className="text-text-light">
              {tender.procurement_category || "Not specified"}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-text">GSIN</label>
            <p className="text-text-light">{tender.gsin || "Not specified"}</p>
            {tender.gsin_description && (
              <p className="text-xs text-text-light mt-1">
                {tender.gsin_description}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-text">UNSPSC</label>
            <p className="text-text-light">
              {tender.unspsc || "Not specified"}
            </p>
            {tender.unspsc_description && (
              <p className="text-xs text-text-light mt-1">
                {tender.unspsc_description}
              </p>
            )}
          </div>
          {tender.regions_of_delivery && (
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-text">
                Regions of Delivery
              </label>
              <p className="text-text-light">{tender.regions_of_delivery}</p>
            </div>
          )}
          {tender.regions_of_opportunity && (
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-text">
                Regions of Opportunity
              </label>
              <p className="text-text-light">{tender.regions_of_opportunity}</p>
            </div>
          )}
        </div>
      </div>

      {/* Selection Criteria */}
      {tender.selection_criteria && (
        <div className="bg-surface border border-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-text mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Selection Criteria
          </h2>
          <div className="prose prose-sm max-w-none text-text-light">
            <p className="whitespace-pre-wrap">{tender.selection_criteria}</p>
          </div>
        </div>
      )}

      {/* Trade Agreements */}
      {tender.trade_agreements && (
        <div className="bg-surface border border-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-text mb-4">
            Trade Agreements
          </h2>
          <p className="text-text-light">{tender.trade_agreements}</p>
        </div>
      )}
    </div>
  );
}
