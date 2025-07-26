import { useState } from "react";
import { MagnifyingGlass, X } from "@phosphor-icons/react";

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
  const [history, setHistory] = useState(mockSearchHistory);

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
        {history.length === 0 ? (
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

              <button
                onClick={(e) => removeItem(index, e)}
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-text-muted hover:text-error transition-all p-1 rounded"
              >
                <X className="w-3 h-3" />
              </button>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
