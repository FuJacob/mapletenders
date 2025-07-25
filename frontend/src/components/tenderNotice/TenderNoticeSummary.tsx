import { Sparkle } from "@phosphor-icons/react";
import { useEffect, useState, useMemo, useCallback } from "react";
import { generateTenderSummary, type TenderSummaryData } from "../../api";

interface TenderNoticeBodyProps {
  tender: {
    id: string;
    description: string | null;
    procurement_method: string | null;
    category_primary: string | null;
    gsin: string | null;
    unspsc: string | null;
    delivery_location: string | null;
  };
  compact?: boolean;
}

export function TenderNoticeSummary({ tender, compact = false }: TenderNoticeBodyProps) {
  const [tenderSummary, setTenderSummary] = useState<TenderSummaryData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [lastTenderId, setLastTenderId] = useState<string | null>(null);

  // Memoize the structured data to prevent unnecessary recreations
  const structuredTenderData = useMemo(() => {
    return `
Description: ${tender.description || "Not specified"}
Procurement Method: ${tender.procurement_method || "Not specified"}
Category: ${tender.category_primary || "Not specified"}
GSIN: ${tender.gsin || "Not specified"}
UNSPSC: ${tender.unspsc || "Not specified"}
Delivery Location: ${tender.delivery_location || "Not specified"}
    `.trim();
  }, [
    tender.description,
    tender.procurement_method,
    tender.category_primary,
    tender.gsin,
    tender.unspsc,
    tender.delivery_location,
  ]);
  useEffect(() => {
    console.log("Tender summary:", tenderSummary);
  }, [tenderSummary]);
  const getTenderSummary = useCallback(async () => {
    // Check if this is a new tender or if we're already loading
    if (isLoading || tender.id === lastTenderId) return;

    // Reset state for new tender
    setTenderSummary(null);
    setIsLoading(true);
    setLastTenderId(tender.id);

    try {
      const response = await generateTenderSummary(
        tender.id,
        structuredTenderData
      );
      setTenderSummary(response.summary);
    } catch (error) {
      console.error("Error generating tender summary:", error);
      setTenderSummary(null);
    } finally {
      setIsLoading(false);
    }
  }, [tender.id, structuredTenderData, isLoading, lastTenderId]);

  useEffect(() => {
    getTenderSummary();
  }, [getTenderSummary]);

  if (compact) {
    return (
      <div className="w-full bg-primary border border-primary rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <Sparkle className="w-4 h-4" />
          AI Summary
        </h3>
        <div className="text-white text-sm">
          {tenderSummary &&
          typeof tenderSummary === "object" &&
          Object.keys(tenderSummary).length > 0 ? (
            <div className="space-y-3">
              <p className="text-sm leading-relaxed">
                {tenderSummary.summary || "Generating summary..."}
              </p>
              {tenderSummary.recommendation && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">Priority:</span>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded ${
                      tenderSummary.recommendation.priority === "High"
                        ? "bg-success/20 text-success"
                        : tenderSummary.recommendation.priority === "Medium"
                        ? "bg-warning/20 text-warning"
                        : "bg-error/20 text-error"
                    }`}
                  >
                    {tenderSummary.recommendation.priority || "Medium"}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center py-4">
              <div className="text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto mb-1"></div>
                <p className="text-xs">Analyzing...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-primary border border-primary rounded-xl p-6">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <Sparkle className="w-5 h-5" />
        Tender Notice Summary by BreezeAI
      </h2>
      <div className="text-white">
        {tenderSummary &&
        typeof tenderSummary === "object" &&
        Object.keys(tenderSummary).length > 0 ? (
          <div className="space-y-4">
            {/* Executive Summary */}
            <p className="text-base leading-relaxed">
              {tenderSummary.summary || "Generating summary..."}
            </p>

            {/* Key Details */}
            {tenderSummary.keyDetails && (
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Key Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <span className="font-medium">Objective:</span>
                    <p className="text-white/90">
                      {tenderSummary.keyDetails.objective || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Category:</span>
                    <p className="text-white/90">
                      {tenderSummary.keyDetails.category || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Value:</span>
                    <p className="text-white/90">
                      {tenderSummary.keyDetails.value || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Requirements */}
            {tenderSummary.requirements &&
              tenderSummary.requirements.length > 0 && (
                <div className="bg-white/10 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Key Requirements</h3>
                  <ul className="text-sm space-y-1">
                    {tenderSummary.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-white/60 mt-1">•</span>
                        <span className="text-white/90">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {/* Recommendation */}
            {tenderSummary.recommendation && (
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-semibold mb-2">BreezeAI Recommendation</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium">Priority:</span>
                  <span
                    className={`text-sm px-2 py-1 rounded ${
                      tenderSummary.recommendation.priority === "High"
                        ? "bg-success/20 text-success"
                        : tenderSummary.recommendation.priority === "Medium"
                        ? "bg-warning/20 text-warning"
                        : "bg-error/20 text-error"
                    }`}
                  >
                    {tenderSummary.recommendation.priority || "Medium"}
                  </span>
                </div>
                <p className="text-sm text-white/90">
                  {tenderSummary.recommendation.reason ||
                    "Analysis in progress..."}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
              <p className="text-sm">BreezeAI is analyzing this tender...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
