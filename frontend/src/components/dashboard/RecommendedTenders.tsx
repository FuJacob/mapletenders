import { TenderCard } from "../tenders";
import type { TenderSearchResult } from "../../api/types";

interface RecommendedTendersProps {
  tenders: TenderSearchResult[];
}

export default function RecommendedTenders({
  tenders,
}: RecommendedTendersProps) {
  console.log("tenders", tenders);
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-text mb-6">
        Recommended for You
      </h2>
      <div className="space-y-4">
        {tenders.length > 0 ? (
          tenders.map((tender) => (
            <TenderCard key={tender.id} tender={tender} />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="text-text-muted mb-2">
              No recommendations available
            </div>
            <div className="text-sm text-text-light">
              Check back later for personalized tender recommendations
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
