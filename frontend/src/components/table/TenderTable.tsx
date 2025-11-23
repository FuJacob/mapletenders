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
  getSortedRowModel,
  type SortingState,
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
import { useState, useMemo, useCallback, useEffect } from "react";
import TablePaginationControls from "./TablePaginationControls";
import "./tableStyles.css";
import type { Tender } from "../../api/types";
import { Link } from "react-router-dom";
import {
  getTendersPaginated,
  type PaginatedTendersResponse,
  type PaginatedTendersParams,
} from "../../api/tenders";

interface TenderTableProps {
  // Legacy props for backward compatibility
  isLoading?: boolean;
  tenders?: Tender[];
  // New pagination props
  usePagination?: boolean;
  initialPage?: number;
  initialLimit?: number;
  initialSearch?: string;
  initialFilters?: {
    status?: string;
    category?: string;
    region?: string;
    entity?: string;
  };
  onDataChange?: (data: PaginatedTendersResponse) => void;
  // Expose filter controls
  renderFilters?: (props: {
    setGlobalFilter: (filter: string) => void;
    tenders: Tender[];
    rowCount: number;
    onFilteredDataChange?: (filteredData: Tender[]) => void;
    usePagination: boolean;
    onSearchChange?: (search: string) => void;
    onFilterChange?: (filters: Record<string, string>) => void;
  }) => React.ReactNode;
}

const NUMBER_OF_TENDERS_PER_PAGE = 25;

// Create column helper
const columnHelper = createColumnHelper<Tender>();

// Define table columns
const tenderColumns = [
  columnHelper.accessor("title", {
    header: "Tender",
    size: 300,
    enableSorting: true,
    cell: (info) => (
      <Link
        to={`/tender-notice/${info.row.original.id}`}
        className="text-primary hover:text-primary-dark font-medium"
      >
        {info.getValue() || "Untitled"}
      </Link>
    ),
  }),
  columnHelper.accessor("contracting_entity_name", {
    id: "entity_info",
    header: "Entity Info",
    size: 220,
    enableSorting: true,
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
    enableSorting: true,
    cell: (info) => info.getValue() || "N/A",
  }),
  // Combined Date Range column instead of separate closing_date
  columnHelper.accessor("published_date", {
    id: "date_range",
    header: "Date Range",
    size: 180,
    enableSorting: true,
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
    enableSorting: true,
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
    enableSorting: true,
    cell: (info) =>
      info.getValue() !== null
        ? `$${info.getValue()?.toLocaleString()}`
        : "N/A",
  }),
];
export default function TenderTable({
  isLoading = false,
  tenders = [],
  usePagination = false,
  initialPage = 1,
  initialLimit = NUMBER_OF_TENDERS_PER_PAGE,
  initialSearch = "",
  initialFilters = {},
  onDataChange,
  renderFilters,
}: TenderTableProps) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [filteredTenders, setFilteredTenders] = useState<Tender[]>([]);

  // Server-side pagination state
  const [paginatedData, setPaginatedData] =
    useState<PaginatedTendersResponse | null>(null);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [paginationParams, setPaginationParams] =
    useState<PaginatedTendersParams>({
      page: initialPage,
      limit: initialLimit,
      search: initialSearch,
      sortBy: "published_date",
      sortOrder: "desc",
      ...initialFilters,
    });

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
    pageIndex: usePagination ? initialPage - 1 : 0,
    pageSize: usePagination ? initialLimit : NUMBER_OF_TENDERS_PER_PAGE,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnResizeMode] = useState<ColumnResizeMode>("onChange");

  // Handle filtered data from QuickFilters
  const handleFilteredDataChange = useCallback((filtered: Tender[]) => {
    setFilteredTenders(filtered);
    setPagination((prev) => ({ ...prev, pageIndex: 0 })); // Reset to first page when filters change
  }, []);

  // Fetch paginated data when using server-side pagination
  const fetchPaginatedData = useCallback(
    async (params: PaginatedTendersParams) => {
      if (!usePagination) return;

      setPaginationLoading(true);
      try {
        const response = await getTendersPaginated(params);
        setPaginatedData(response);
        onDataChange?.(response);
      } catch (error) {
        console.error("Failed to fetch paginated tenders:", error);
      } finally {
        setPaginationLoading(false);
      }
    },
    [usePagination, onDataChange]
  ); // onDataChange intentionally excluded to prevent infinite loop

  // Effect to fetch data when params change
  useEffect(() => {
    if (usePagination) {
      fetchPaginatedData(paginationParams);
    }
  }, [paginationParams, usePagination, fetchPaginatedData]);

  // Update pagination params
  const updatePaginationParams = useCallback(
    (updates: Partial<PaginatedTendersParams>) => {
      setPaginationParams((prev) => ({
        ...prev,
        ...updates,
        // Reset to page 1 when changing search or filters
        ...(updates.search !== undefined ||
        Object.keys(updates).some((key) =>
          ["status", "category", "region", "entity"].includes(key)
        )
          ? { page: 1 }
          : {}),
      }));
    },
    []
  );

  // Use filtered data if available, otherwise use all tenders
  const tableData = useMemo(() => {
    if (usePagination && paginatedData) {
      return paginatedData.data;
    }
    return filteredTenders.length > 0 ? filteredTenders : [];
  }, [usePagination, paginatedData, filteredTenders]);

  // Memoize pagination change handler
  const onPaginationChange = useCallback(
    (updater: Updater<PaginationState>) => {
      if (usePagination) {
        // For server-side pagination, update the API params
        const newPagination =
          typeof updater === "function" ? updater(pagination) : updater;
        const newPage = newPagination.pageIndex + 1;
        updatePaginationParams({
          page: newPage,
          limit: newPagination.pageSize,
        });
      }
      setPagination(updater);
    },
    [usePagination, pagination, updatePaginationParams]
  );

  const table = useReactTable({
    data: tableData,
    columns: tenderColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: usePagination ? undefined : getPaginationRowModel(),
    getSortedRowModel: usePagination ? undefined : getSortedRowModel(),
    columnResizeMode,
    state: {
      pagination,
      sorting,
      globalFilter,
    },
    onPaginationChange,
    onSortingChange: (updater) => {
      setSorting(updater);
      if (usePagination) {
        const newSorting =
          typeof updater === "function" ? updater(sorting) : updater;
        if (newSorting.length > 0) {
          const sort = newSorting[0];
          updatePaginationParams({
            sortBy: sort.id,
            sortOrder: sort.desc ? "desc" : "asc",
            page: 1, // Reset to first page when sorting changes
          });
        }
      }
    },
    rowCount: usePagination
      ? paginatedData?.pagination.total || 0
      : tableData.length,
    manualPagination: usePagination,
    manualSorting: usePagination,
    pageCount: usePagination ? paginatedData?.pagination.totalPages || 1 : -1,
    enableColumnResizing: true,
    enableSorting: true,
    globalFilterFn: globalTenderFilter,
    getFilteredRowModel: usePagination ? undefined : getFilteredRowModel(),
  });

  const TenderTableInner = () => {
    // Show loading state
    if (isLoading || (usePagination && paginationLoading)) {
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
                          <div
                            className="flex items-center justify-between cursor-pointer hover:bg-surface-muted/50 p-1 rounded"
                            onClick={
                              header.column.getCanSort()
                                ? header.column.getToggleSortingHandler()
                                : undefined
                            }
                          >
                            <div className="flex items-center gap-2">
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {header.column.getCanSort() && (
                                <span className="text-text-light">
                                  {{
                                    asc: "↑",
                                    desc: "↓",
                                  }[header.column.getIsSorted() as string] ??
                                    "↕"}
                                </span>
                              )}
                            </div>
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
            getCanNextPage={
              usePagination
                ? () => paginatedData?.pagination.hasNext || false
                : table.getCanNextPage
            }
            getCanPreviousPage={
              usePagination
                ? () => paginatedData?.pagination.hasPrev || false
                : table.getCanPreviousPage
            }
            nextPage={
              usePagination
                ? () =>
                    updatePaginationParams({
                      page: (paginationParams.page || 1) + 1,
                    })
                : table.nextPage
            }
            previousPage={
              usePagination
                ? () =>
                    updatePaginationParams({
                      page: Math.max(1, (paginationParams.page || 1) - 1),
                    })
                : table.previousPage
            }
            pageIndex={
              usePagination
                ? (paginationParams.page || 1) - 1
                : pagination.pageIndex
            }
            pageSize={
              usePagination
                ? paginationParams.limit || NUMBER_OF_TENDERS_PER_PAGE
                : pagination.pageSize
            }
            pageCount={
              usePagination
                ? paginatedData?.pagination.totalPages || 1
                : table.getPageCount()
            }
            setPageIndex={
              usePagination
                ? (updater: number | ((prev: number) => number)) => {
                    const newIndex =
                      typeof updater === "function"
                        ? updater(pagination.pageIndex)
                        : updater;
                    updatePaginationParams({ page: newIndex + 1 });
                  }
                : table.setPageIndex
            }
            rowCount={
              usePagination
                ? paginatedData?.pagination.total || 0
                : table.getRowCount()
            }
          />
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {renderFilters?.({
        setGlobalFilter,
        tenders: usePagination ? [] : tenders || [],
        rowCount: usePagination
          ? paginatedData?.pagination.total || 0
          : filteredTenders.length,
        onFilteredDataChange: usePagination ? undefined : handleFilteredDataChange,
        usePagination,
        onSearchChange: usePagination
          ? (search: string) => updatePaginationParams({ search })
          : undefined,
        onFilterChange: usePagination
          ? (filters: Record<string, string>) => updatePaginationParams(filters)
          : undefined,
      })}
      <div className="flex-1 min-h-0">
        <TenderTableInner />
      </div>
    </div>
  );
}
