import { TenderTable } from "../../components";
import { useAppSelector } from "../../app/hooks";
import { useAuth } from "../../hooks/auth";
import { selectTenders } from "../../features/tenders/tendersSelectors";

export default function Home() {
  const { profile } = useAuth();
  const tenders = useAppSelector(selectTenders);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-text mb-4">
          Welcome back, {profile?.company_name || "User"}!
        </h1>
        <p className="text-lg text-text-muted mb-4">
          Browse and filter through all available government tenders in a
          detailed table view
        </p>
        <div className="flex items-center justify-center gap-6 text-sm text-text-muted">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span>{tenders?.length || 0} Active Tenders</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span>Real-time Updates</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-warning rounded-full"></div>
            <span>Advanced Filtering</span>
          </div>
        </div>
      </div>

      <div className="px-6">
        <TenderTable />
      </div>
    </div>
  );
}
