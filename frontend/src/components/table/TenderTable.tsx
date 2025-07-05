import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useAppSelector } from "../../app/hooks";
import { tenderColumns } from "../../features/tenders/tenderColumns";
import { selectTenders } from "../../features/tenders/tendersSelectors";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableCell, 
  TableEmptyState,
  TableLoadingState 
} from "./";

interface TenderTableProps {
  isLoading?: boolean;
}

export default function TenderTable({ isLoading = false }: TenderTableProps) {
  const tenders = useAppSelector(selectTenders);
  
  const table = useReactTable({
    data: tenders || [],
    columns: tenderColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full bg-surface rounded-lg border border-border">
        <TableLoadingState message="Finding relevant tenders..." />
      </div>
    );
  }

  // Show empty state if no data
  if (!tenders || tenders.length === 0) {
    return (
      <div className="w-full bg-surface rounded-lg border border-border">
        <TableEmptyState 
          message="No tenders found" 
          description="Try adjusting your search criteria or check back later for new opportunities." 
        />
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} isHeader>
            {headerGroup.headers.map((header) => (
              <TableCell key={header.id} isHeader>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(
                  cell.column.columnDef.cell,
                  cell.getContext()
                )}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
