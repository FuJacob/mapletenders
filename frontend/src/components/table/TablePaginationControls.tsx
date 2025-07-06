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
    <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-4 border-t border-border bg-white rounded-b-lg">
      <div className="flex-1 text-sm text-text-light mb-4 sm:mb-0">
        {rowCount > 0 ? (
          <>
            Showing <span className="font-medium">{start}</span> to{" "}
            <span className="font-medium">{end}</span> of{" "}
            <span className="font-medium">{rowCount}</span> tenders
          </>
        ) : (
          <span className="font-medium">No results</span>
        )}
      </div>

      <div className="flex items-center space-x-1">
        <button
          className="px-2 py-1 border rounded-md text-sm bg-white hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white disabled:cursor-not-allowed"
          onClick={previousPage}
          disabled={!getCanPreviousPage()}
          aria-label="Previous page"
        >
          <CaretLeft className="w-4 h-4" />
        </button>

        {pageNumbers.map((pageNumber, index) => {
          if (pageNumber < 0) {
            // This is an ellipsis
            return (
              <span key={`ellipsis-${index}`} className="px-2 py-1">
                …
              </span>
            );
          }

          const isActive = pageNumber === pageIndex;
          return (
            <button
              key={pageNumber}
              className={`px-3 py-1 border rounded-md text-sm ${
                isActive
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white hover:bg-gray-50"
              }`}
              onClick={() => setPageIndex(() => pageNumber)}
              disabled={isActive}
            >
              {pageNumber + 1}
            </button>
          );
        })}

        <button
          className="px-2 py-1 border rounded-md text-sm bg-white hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white disabled:cursor-not-allowed"
          onClick={nextPage}
          disabled={!getCanNextPage()}
          aria-label="Next page"
        >
          <CaretRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
