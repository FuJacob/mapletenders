import { TenderTable } from "../components";
import { Table } from "@phosphor-icons/react";
import { PageHeader } from "../components/ui";
import { useState, useCallback, useEffect } from "react";
import type {
  PaginatedTendersResponse,
  TenderStatistics,
} from "../api/tenders";
import { getTenderStatistics } from "../api/tenders";
import TableStatsGrid from "../components/dashboard/TableStatsGrid";

export default function TablePage() {
  const [, setPaginationData] = useState<PaginatedTendersResponse | null>(null);
  const [statistics, setStatistics] = useState<TenderStatistics[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);

  // Fetch real statistics from the backend
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setStatsLoading(true);
        const stats = await getTenderStatistics();
        setStatistics(stats);
      } catch (error) {
        console.error("Failed to fetch tender statistics:", error);
        // Fallback to default stats
        setStatistics([
          {
            source: "Government of Canada",
            numberOfTendersAddedDaily: 0,
            numberOfTendersAvailable: 0,
          },
          {
            source: "Ontario Province",
            numberOfTendersAddedDaily: 0,
            numberOfTendersAvailable: 0,
          },
          {
            source: "BC Government",
            numberOfTendersAddedDaily: 0,
            numberOfTendersAvailable: 0,
          },
          {
            source: "Municipalities",
            numberOfTendersAddedDaily: 0,
            numberOfTendersAvailable: 0,
          },
        ]);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const handleDataChange = useCallback((data: PaginatedTendersResponse) => {
    setPaginationData(data);
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="flex w-full justify-between items-start gap-6">
        <PageHeader
          icon={<Table className="w-10 h-10 text-primary" />}
          title="Tender Table"
          description="Browse all procurement opportunities in a comprehensive table view"
        />
        <TableStatsGrid stats={statistics} loading={statsLoading} />
      </div>

      <div className="flex-1 min-h-0">
        <TenderTable
          usePagination={true}
          onDataChange={handleDataChange}
          initialLimit={25}
        />
      </div>
    </div>
  );
}
