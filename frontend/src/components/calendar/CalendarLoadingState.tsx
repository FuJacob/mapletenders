import { Calendar as CalendarIcon } from "@phosphor-icons/react";

export default function CalendarLoadingState() {
  return (
    <div className="bg-surface rounded-lg border border-border shadow-sm">
      <div className="flex flex-col sm:flex-row items-center justify-between p-6 border-b border-border bg-surface">
        <div className="flex items-center gap-4 mb-4 sm:mb-0">
          <div className="w-20 h-9 bg-surface-muted rounded-lg animate-pulse"></div>
          <div className="w-16 h-9 bg-surface-muted rounded-lg animate-pulse"></div>
          <div className="w-16 h-9 bg-surface-muted rounded-lg animate-pulse"></div>
        </div>

        <div className="w-32 h-8 bg-surface-muted rounded-lg animate-pulse mb-4 sm:mb-0"></div>

        <div className="flex gap-1 bg-background border border-border rounded-lg p-1">
          {["month", "week", "day", "agenda"].map((_, index) => (
            <div
              key={index}
              className="w-16 h-8 bg-surface-muted rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      </div>

      <div className="p-8 text-center" style={{ height: "600px" }}>
        <div className="flex flex-col items-center justify-center h-full">
          <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
            <CalendarIcon className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <h3 className="text-lg font-semibold text-text mb-2">
            Loading Calendar
          </h3>
          <p className="text-text-muted">
            Fetching your bookmarked tender deadlines...
          </p>

          {/* Mock calendar grid */}
          <div className="mt-8 grid grid-cols-7 gap-2 w-full max-w-lg">
            {Array.from({ length: 35 }).map((_, index) => (
              <div
                key={index}
                className="aspect-square bg-surface-muted rounded animate-pulse"
                style={{ animationDelay: `${index * 50}ms` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
