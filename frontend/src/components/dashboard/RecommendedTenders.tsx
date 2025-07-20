import { Link } from "react-router-dom";
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
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text">Recommended for You</h2>
        <Link
          to="/tenders"
          className="text-primary hover:text-primary-dark text-sm font-medium"
        >
          View all →
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto space-y-4">
        {tenders.map((tender) => (
          <TenderCard key={tender.id} tender={tender} compact={true} />
        ))}
      </div>
    </>
  );
}
