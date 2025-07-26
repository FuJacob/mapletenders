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
  createColumnHelper,
} from "@tanstack/react-table";
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
import type { Tender } from "../../api/types";
import { Link } from "react-router-dom";

interface TenderTableProps {
  isLoading?: boolean;
  tenders?: Tender[];
}

const NUMBER_OF_TENDERS_PER_PAGE = 10;

// Create column helper
const columnHelper = createColumnHelper<Tender>();

// Define table columns
const tenderColumns = [
  columnHelper.accessor("title", {
    header: "Tender",
    size: 300,
    cell: (info) => (
      <Link
        to={`/tender-notice/${info.row.original.id}`}
        className="text-primary hover:text-primary-dark font-medium"
      >
        {info.getValue() || "Untitled"}
      </Link>
    ),
  }),
  columnHelper.display({
    id: "entity_info",
    header: "Entity Info",
    size: 220,
    cell: (info) => {
      const tender = info.row.original;
      const parts = [
        tender.contracting_entity_name || "Unknown",
        tender.contracting_entity_city,
        tender.contracting_entity_province,
        tender.contracting_entity_country,
      ].filter(Boolean);
      return parts.join(" — ");
    },
  }),
  columnHelper.accessor("category_primary", {
    header: "Category",
    size: 130,
    cell: (info) => info.getValue() || "N/A",
  }),
  // Combined Date Range column instead of separate closing_date
  columnHelper.display({
    id: "date_range",
    header: "Date Range",
    size: 180,
    cell: (info) => {
      const tender = info.row.original;
      const published = tender.published_date
        ? new Date(tender.published_date).toLocaleDateString()
        : "N/A";
      const closing = tender.closing_date
        ? new Date(tender.closing_date).toLocaleDateString()
        : "N/A";
      return `Published: ${published} — Closes: ${closing}`;
    },
  }),
  columnHelper.accessor("status", {
    header: "Status",
    size: 100,
    cell: (info) => {
      const status = info.getValue() || "Unknown";
      const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
          case "open":
          case "active":
            return "bg-success/10 text-success border-success/20";
          case "closed":
            return "bg-error/10 text-error border-error/20";
          case "cancelled":
            return "bg-text-muted/10 text-text-muted border-text-muted/20";
          case "awarded":
            return "bg-info/10 text-info border-info/20";
          default:
            return "bg-warning/10 text-warning border-warning/20";
        }
      };
      return (
        <span
          className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(
            status
          )}`}
        >
          {status}
        </span>
      );
    },
  }),
  columnHelper.accessor("estimated_value_min", {
    header: "Est. Value",
    size: 120,
    cell: (info) =>
      info.getValue() !== null
        ? `$${info.getValue()?.toLocaleString()}`
        : "N/A",
  }),
];
export default function TenderTable({
  isLoading = false,
  tenders = [],
}: TenderTableProps) {
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

  // Handle filtered data from QuickFilters
  const handleFilteredDataChange = useCallback((filtered: Tender[]) => {
    setFilteredTenders(filtered);
    setPagination((prev) => ({ ...prev, pageIndex: 0 })); // Reset to first page when filters change
  }, []);

  // Use filtered data if available, otherwise use all tenders
  const tableData = useMemo(() => {
    const dataToUse = filteredTenders.length > 0 ? filteredTenders : [];
    return dataToUse;
  }, [filteredTenders]);

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
      <div className="h-full flex flex-col bg-surface rounded-lg border border-border">
        <div className="flex-1 overflow-auto">
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
                      cell.column.id !== "closing_date";

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
        </div>
        <div className="flex-shrink-0 border-t border-border">
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
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 mb-4">
        <QuickFilters
          setGlobalFilter={setGlobalFilter}
          tenders={tenders || []}
          rowCount={filteredTenders.length}
          onFilteredDataChange={handleFilteredDataChange}
        />
      </div>
      <div className="flex-1 min-h-0">
        <TenderTableInner />
      </div>
    </div>
  );
}
