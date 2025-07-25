import { FileText, Tag } from "@phosphor-icons/react";

interface TenderNoticeBodyProps {
  tender: {
    description: string | null;
    procurement_method: string | null;
    category_primary: string | null;
    gsin: string | null;
    unspsc: string | null;
    delivery_location: string | null;
  };
  compact?: boolean;
}

export function TenderNoticeBody({ tender, compact = false }: TenderNoticeBodyProps) {
  if (compact) {
    return (
      <div className="w-full bg-surface border border-border rounded-lg p-4">
        <h3 className="text-lg font-semibold text-text mb-3 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Description
        </h3>
        <div className="text-sm text-text-light mb-4">
          {tender.description ? (
            <p className="whitespace-pre-wrap line-clamp-4">
              {tender.description}
            </p>
          ) : (
            <p className="italic">No description provided</p>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="font-medium text-text">Method:</span>
            <p className="text-text-light">
              {tender.procurement_method || "Not specified"}
            </p>
          </div>
          <div>
            <span className="font-medium text-text">Category:</span>
            <p className="text-text-light">
              {tender.category_primary || "Not specified"}
            </p>
          </div>
          <div>
            <span className="font-medium text-text">Location:</span>
            <p className="text-text-light">
              {tender.delivery_location || "Not specified"}
            </p>
          </div>
          <div>
            <span className="font-medium text-text">GSIN:</span>
            <p className="text-text-light">{tender.gsin || "Not specified"}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Description */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <h2 className="text-xl font-semibold text-text mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Tender Description
        </h2>
        <div className="prose prose-sm max-w-none text-text-light">
          {tender.description ? (
            <p className="whitespace-pre-wrap">{tender.description}</p>
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
              {tender.category_primary || "Not specified"}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-text">GSIN</label>
            <p className="text-text-light">{tender.gsin || "Not specified"}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-text">UNSPSC</label>
            <p className="text-text-light">
              {tender.unspsc || "Not specified"}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-text">
              Delivery Location
            </label>
            <p className="text-text-light">
              {tender.delivery_location || "Not specified"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
