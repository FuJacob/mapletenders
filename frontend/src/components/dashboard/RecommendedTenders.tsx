import { Link } from "react-router-dom";
import TenderCard from "./TenderCard.tsx";
import type { TenderSummary } from "./types.tsx";

interface RecommendedTendersProps {
  tenders: TenderSummary[];
}

export default function RecommendedTenders({
  tenders,
}: RecommendedTendersProps) {
  return (
    <div className="bg-surface border border-border rounded-xl p-6 h-[1200px] flex flex-col">
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
          <TenderCard key={tender.id} tender={tender} />
        ))}
      </div>
    </div>
  );
}
