import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
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
  TableLoadingState,
} from "./";

import { useState } from "react";
import TablePaginationControls from "./TablePaginationControls";
interface TenderTableProps {
  isLoading?: boolean;
}

export default function TenderTable({ isLoading = false }: TenderTableProps) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 50,
  });
  const tenders = useAppSelector(selectTenders);

  const table = useReactTable({
    data: tenders || [],
    columns: tenderColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    rowCount: tenders ? tenders.length : 0,
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
    <>
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
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePaginationControls
        getCanNextPage={table.getCanNextPage}
        getCanPreviousPage={table.getCanPreviousPage}
        nextPage={table.nextPage}
        previousPage={table.previousPage}
        pageIndex={pagination.pageIndex}
        pageSize={pagination.pageSize}
        pageCount={table.getPageCount()}
        setPageIndex={table.setPageIndex}
        rowCount={table.getRowCount()}
      />
    </>
  );
}
