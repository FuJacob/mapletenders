import { TenderTable } from "../components";
import { Table } from "@phosphor-icons/react";
import { PageHeader } from "../components/ui";
import { useEffect, useState } from "react";
import { getAllTenders } from "../api/tenders";
import type { Tender } from "../api/types";

export default function TablePage() {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTenders = async () => {
      try {
        setIsLoading(true);
        const data = await getAllTenders();
        setTenders(data);
      } catch (error) {
        console.error("Error fetching tenders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTenders();
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0">
        <PageHeader
          icon={<Table className="w-10 h-10 text-primary" />}
          title="Tender Table"
          description="Browse all procurement opportunities in a comprehensive table view"
        />
      </div>

      <div className="flex-1 min-h-0">
        <TenderTable isLoading={isLoading} tenders={tenders} />
      </div>
    </div>
  );
}
