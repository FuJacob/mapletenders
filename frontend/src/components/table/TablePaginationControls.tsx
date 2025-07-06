import { CaretRight, CaretLeft } from "@phosphor-icons/react";
export default function TablePaginationControls({
  getCanNextPage,
  getCanPreviousPage,
  nextPage,
  previousPage,
  pageIndex,
  pageSize,
  pageCount,
  rowCount,
}: {
  getCanNextPage: () => boolean;
  getCanPreviousPage: () => boolean;
  nextPage: () => void;
  previousPage: () => void;
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  rowCount: number;
  setPageIndex: (updater: (prev: number) => number) => void;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-4 border-t border-border">
      <div className="flex-1 text-sm text-text-light">
        Showing <span className="font-medium">{pageIndex * pageSize + 1}</span>{" "}
        to{" "}
        <span className="font-medium">
          {Math.min((pageIndex + 1) * pageSize, pageSize * pageCount)}
        </span>{" "}
        of <span className="font-medium">{rowCount}</span> tenders
      </div>
      <div className="flex items-center space-x-2">
        <button
          className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={previousPage}
          disabled={!getCanPreviousPage()}
        >
          <CaretLeft className="w-4 h-4" />
        </button>
        <span className="text-sm">
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageCount}
          </strong>
        </span>
        <button
          className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => nextPage()}
          disabled={!getCanNextPage()}
        >
          <CaretRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
