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
  setPageIndex,
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
  // Calculate starting and ending record numbers
  const start = pageIndex * pageSize + 1;
  const end = Math.min((pageIndex + 1) * pageSize, rowCount);

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxPages = 5; // Maximum number of page buttons to show

    if (pageCount <= maxPages) {
      // Show all pages if there are fewer than maxPages
      for (let i = 0; i < pageCount; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(0);

      // Calculate start and end of middle pages
      let startPage = Math.max(pageIndex - 1, 1);
      let endPage = Math.min(startPage + 2, pageCount - 2);

      // Adjust if we're near the end
      if (pageIndex >= pageCount - 3) {
        startPage = pageCount - 4;
        endPage = pageCount - 2;
      }

      // Add ellipsis after first page if needed
      if (startPage > 1) {
        pages.push(-1); // Use -1 as indicator for ellipsis
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (endPage < pageCount - 2) {
        pages.push(-2); // Use -2 as another indicator for ellipsis
      }

      // Always show last page
      pages.push(pageCount - 1);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between px-6 py-4">
      <div className="flex-1 text-sm text-text mb-4 sm:mb-0">
        {rowCount > 0 ? (
          <>
            Showing <span className="font-semibold text-blue-900">{start}</span>{" "}
            to <span className="font-semibold text-blue-900">{end}</span> of{" "}
            <span className="font-semibold text-blue-900">{rowCount}</span>{" "}
            tenders
          </>
        ) : (
          <span className="font-medium text-text">No results</span>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <button
          className="flex items-center justify-center w-8 h-8 rounded-lg border border-border bg-surface hover:bg-blue-50 hover:border-blue-200 disabled:opacity-40 disabled:hover:bg-surface disabled:hover:border-border disabled:cursor-not-allowed transition-colors"
          onClick={previousPage}
          disabled={!getCanPreviousPage()}
          aria-label="Previous page"
        >
          <CaretLeft className="w-4 h-4 text-text" />
        </button>

        {pageNumbers.map((pageNumber, index) => {
          if (pageNumber < 0) {
            // This is an ellipsis
            return (
              <span key={`ellipsis-${index}`} className="px-2 py-2 text-text">
                …
              </span>
            );
          }

          const isActive = pageNumber === pageIndex;
          return (
            <button
              key={pageNumber}
              className={`flex items-center justify-center w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-600 text-white border border-blue-600 shadow-sm"
                  : "bg-surface text-text border border-border hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700"
              }`}
              onClick={() => setPageIndex(() => pageNumber)}
              disabled={isActive}
            >
              {pageNumber + 1}
            </button>
          );
        })}

        <button
          className="flex items-center justify-center w-8 h-8 rounded-lg border border-border bg-surface hover:bg-blue-50 hover:border-blue-200 disabled:opacity-40 disabled:hover:bg-surface disabled:hover:border-border disabled:cursor-not-allowed transition-colors"
          onClick={nextPage}
          disabled={!getCanNextPage()}
          aria-label="Next page"
        >
          <CaretRight className="w-4 h-4 text-text" />
        </button>
      </div>
    </div>
  );
}
