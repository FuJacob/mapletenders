import { TenderTable } from "../../components";
import QuickFilters from "../../components/QuickFilters";
import { useAppSelector } from "../../app/hooks";
import { selectAuthUser } from "../../features/auth/authSelectors";

export default function Home() {
  const user = useAppSelector(selectAuthUser);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8 text-center">
        <h1 className="text-5xl font-bold text-text mb-4">
          Welcome back {user?.company_name}!
        </h1>
        <p className="text-2xl text-text-light">
          Browse and filter through all available tenders in a detailed table
          view
        </p>
      </div>

      <div className="p-6">
        <TenderTable />
      </div>
    </div>
  );
}
