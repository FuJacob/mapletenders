import { Sparkle } from "@phosphor-icons/react";
import { useEffect, useState, useMemo, useRef } from "react";
import { generateTenderSummary, type TenderSummaryData } from "../../api";

interface TenderNoticeBodyProps {
  tender: {
    id: string;
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

export function TenderNoticeSummary({ tender }: TenderNoticeBodyProps) {
  const [tenderSummary, setTenderSummary] =
    useState<TenderSummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastTenderId, setLastTenderId] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Memoize the structured data to prevent unnecessary recreations
  const structuredTenderData = useMemo(() => {
    return `
Title: ${tender.tender_description || "Not specified"}
Procurement Method: ${tender.procurement_method || "Not specified"}
Category: ${tender.procurement_category || "Not specified"}
GSIN: ${tender.gsin || "Not specified"} - ${tender.gsin_description || ""}
UNSPSC: ${tender.unspsc || "Not specified"} - ${tender.unspsc_description || ""}
Delivery Regions: ${tender.regions_of_delivery || "Not specified"}
Opportunity Regions: ${tender.regions_of_opportunity || "Not specified"}
Selection Criteria: ${tender.selection_criteria || "Not specified"}
Trade Agreements: ${tender.trade_agreements || "Not specified"}
    `.trim();
  }, [
    tender.tender_description,
    tender.procurement_method,
    tender.procurement_category,
    tender.gsin,
    tender.gsin_description,
    tender.unspsc,
    tender.unspsc_description,
    tender.regions_of_delivery,
    tender.regions_of_opportunity,
    tender.selection_criteria,
    tender.trade_agreements,
  ]);

  useEffect(() => {
    const getTenderSummary = async () => {
      // Check if this is a new tender or if we're already loading
      if (isLoading || tender.id === lastTenderId) return;
      
      // Cancel any previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();
      
      // Reset state for new tender
      setTenderSummary(null);
      setIsLoading(true);
      setLastTenderId(tender.id);
      
      try {
        const response = await generateTenderSummary(tender.id, structuredTenderData);
        
        // Check if request was aborted
        if (abortControllerRef.current?.signal.aborted) {
          return;
        }
        
        console.log("Raw API response:", response);

        // The backend now returns a parsed summary directly
        const parsedSummary = response.summary;
        console.log("Parsed summary:", parsedSummary);
        setTenderSummary(parsedSummary);
      } catch (error) {
        // Don't log error if request was aborted
        if (abortControllerRef.current?.signal.aborted) {
          return;
        }
        console.error("Error generating tender summary:", error);
        setTenderSummary(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    getTenderSummary();
    
    // Cleanup function to abort request if component unmounts
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [tender.id, structuredTenderData]);

  return (
    <div className="bg-primary border border-primary rounded-xl p-6 mb-8">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <Sparkle className="w-5 h-5" />
        Tender Notice Summary by BreezeAI
      </h2>
      <div className="text-white">
        {tenderSummary ? (
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
                        ? "bg-green-500/20 text-green-200"
                        : tenderSummary.recommendation.priority === "Medium"
                        ? "bg-yellow-500/20 text-yellow-200"
                        : "bg-red-500/20 text-red-200"
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
