import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  type ColumnResizeMode,
  type Updater,
  type PaginationState,
  type Row,
  getFilteredRowModel,
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
import { useState, useMemo, useCallback } from "react";
import TablePaginationControls from "./TablePaginationControls";
import "./tableStyles.css";
import { QuickFilters } from "../search";
import type { Tender } from "../../api/types.ts";
interface TenderTableProps {
  isLoading?: boolean;
}
const NUMBER_OF_TENDERS_PER_PAGE = 8;

export default function TenderTable({ isLoading = false }: TenderTableProps) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [filteredTenders, setFilteredTenders] = useState<Tender[]>([]);

  const globalTenderFilter = useCallback(
    (row: Row<Tender>, _columnId: string, filterValue: string) => {
      const tender = row.original;
      return (
        tender.title
          ?.toString()
          .toLowerCase()
          .includes(filterValue.toLowerCase()) ||
        tender.description
          ?.toString()
          .toLowerCase()
          .includes(filterValue.toLowerCase()) ||
        tender.contracting_entity_name
          ?.toString()
          .toLowerCase()
          .includes(filterValue.toLowerCase()) ||
        false
      );
    },
    []
  );

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: NUMBER_OF_TENDERS_PER_PAGE,
  });
  const [columnResizeMode] = useState<ColumnResizeMode>("onChange");
  const tenders = useAppSelector(selectTenders);

  // Handle filtered data from QuickFilters
  const handleFilteredDataChange = useCallback((filtered: Tender[]) => {
    setFilteredTenders(filtered);
    setPagination((prev) => ({ ...prev, pageIndex: 0 })); // Reset to first page when filters change
  }, []);

  // Use filtered data if available, otherwise use all tenders
  const tableData = useMemo(() => {
    const dataToUse =
      filteredTenders.length > 0 ? filteredTenders : tenders || [];
    return dataToUse;
  }, [filteredTenders, tenders]);

  // Memoize pagination change handler
  const onPaginationChange = useCallback(
    (updater: Updater<PaginationState>) => {
      setPagination(updater);
    },
    []
  );

  const table = useReactTable({
    data: tableData,
    columns: tenderColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    columnResizeMode,
    state: {
      pagination,
      globalFilter,
    },
    onPaginationChange,
    rowCount: tableData.length,
    enableColumnResizing: true,
    globalFilterFn: globalTenderFilter,
    getFilteredRowModel: getFilteredRowModel(),
  });

  const TenderTableInner = () => {
    // Show loading state
    if (isLoading) {
      return (
        <div className="w-full bg-surface rounded-lg border border-border">
          <TableLoadingState message="Finding relevant tenders..." />
        </div>
      );
    }

    // Show empty state if no data
    if (!tableData || tableData.length === 0) {
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
                <TableRow key={row.id} className="hover:bg-surface-muted">
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
                        className={
                          cell.column.id === "title" ? "align-top" : ""
                        }
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
  };
  return (
    <>
      <QuickFilters
        setGlobalFilter={setGlobalFilter}
        tenders={tenders || []}
        onFilteredDataChange={handleFilteredDataChange}
      />
      <TenderTableInner />
    </>
  );
}
