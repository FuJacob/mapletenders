import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  type ColumnResizeMode,
} from "@tanstack/react-table";
import { useAppSelector } from "../../app/hooks";
import { tenderColumns } from "../../features/tenders/tenderColumns.tsx";
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
import "./tableStyles.css";
interface TenderTableProps {
  isLoading?: boolean;
}

export default function TenderTable({ isLoading = false }: TenderTableProps) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 50,
  });
  const [columnResizeMode] = useState<ColumnResizeMode>("onChange");
  const tenders = useAppSelector(selectTenders);

  const table = useReactTable({
    data: tenders || [],
    columns: tenderColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    columnResizeMode,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    rowCount: tenders ? tenders.length : 0,
    enableColumnResizing: true,
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
      <div className="rounded-lg bg-surface">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} isHeader>
                {headerGroup.headers.map((header) => {
                  const column = header.column.columnDef;
                  const width = column.size ? `${column.size}px` : undefined;

                  return (
                    <TableCell
                      key={header.id}
                      isHeader
                      width={width}
                      className="relative select-none"
                    >
                      {header.isPlaceholder ? null : (
                        <div className="flex items-center justify-between">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </div>
                      )}
                      {header.column.getCanResize() && (
                        <div
                          className={`resizer ${
                            header.column.getIsResizing() ? "isResizing" : ""
                          }`}
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                        />
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => {
                  const column = cell.column.columnDef;
                  const width = column.size ? `${column.size}px` : undefined;

                  // Only use truncate for columns that aren't Tender or Dates
                  const useTruncate =
                    cell.column.id !== "title" &&
                    cell.column.id !== "publication_date";

                  return (
                    <TableCell
                      key={cell.id}
                      width={width}
                      truncate={useTruncate}
                      className={cell.column.id === "title" ? "align-top" : ""}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  );
                })}
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
      </div>
    </>
  );
}
