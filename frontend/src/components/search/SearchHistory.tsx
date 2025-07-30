import { useState, useEffect } from "react";
import { MagnifyingGlass, X } from "@phosphor-icons/react";
import { analyticsAPI } from "../../api/analytics";

interface SearchHistoryProps {
  onSearchSelect: (query: string) => void;
  className?: string;
}

const mockSearchHistory = [
  "Construction projects in Alberta over $500K",
  "IT services contracts in Ontario under $100K",
  "Consulting opportunities closing this month",
  "Software development with government agencies",
];

export default function SearchHistory({
  onSearchSelect,
  className = "",
}: SearchHistoryProps) {
  const [history, setHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Load search history from backend
  useEffect(() => {
    const loadSearchHistory = async () => {
      try {
        setLoading(true);
        // Get recent user activities that are searches
        const activities = await analyticsAPI.getUserActivities(20);
        const searchActivities = activities
          .filter(
            (activity) =>
              activity.action === "Searched" && activity.metadata?.query
          )
          .map((activity) => activity.metadata.query)
          .filter((query, index, arr) => arr.indexOf(query) === index) // Remove duplicates
          .slice(0, 10); // Limit to 10 recent searches

        setHistory(
          searchActivities.length > 0 ? searchActivities : mockSearchHistory
        );
      } catch (error) {
        console.error("Error loading search history:", error);
        // Fallback to mock data
        setHistory(mockSearchHistory);
      } finally {
        setLoading(false);
      }
    };

    loadSearchHistory();
  }, []);

  const removeItem = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory(history.filter((_, i) => i !== index));
  };

  const handleSearchSelect = (query: string) => {
    onSearchSelect(query);
  };

  return (
    <div className={`${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-3">
        {loading ? (
          <div className="col-span-full text-center py-4">
            <p className="text-xs text-text-muted italic">
              Loading search history...
            </p>
          </div>
        ) : history.length === 0 ? (
          <div className="col-span-full text-center py-4">
            <p className="text-xs text-text-muted italic">No recent searches</p>
          </div>
        ) : (
          history.map((query, index) => (
            <button
              key={index}
              onClick={() => handleSearchSelect(query)}
              className="bg-surface border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all group relative"
            >
              <div className="bg-primary/10 flex items-center justify-center h-12 w-full rounded-lg">
                <MagnifyingGlass className="w-4 h-4 text-primary" />
              </div>

              <div className="p-3 text-left">
                <p className="text-xs font-medium text-text group-hover:text-primary transition-colors line-clamp-2 leading-tight mb-1">
                  {query}
                </p>
              </div>

              <div
                onClick={(e) => removeItem(index, e)}
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-text-muted hover:text-error transition-all p-1 rounded cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label={`Remove search: ${query}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    removeItem(index, e);
                  }
                }}
              >
                <X className="w-3 h-3" />
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
