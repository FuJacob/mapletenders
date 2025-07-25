import { useState } from "react";
import {
  MagnifyingGlass,
  Star,
  GridFour,
  ListBullets,
} from "@phosphor-icons/react";
import { TenderCard } from "../";
import type {
  TenderSearchResult,
  SearchTendersResponse,
} from "../../api/types";

interface SearchResultsListProps {
  setSelectedTender: (tenderId: string) => void;
  searchResults: TenderSearchResult[];
  searchResponse: SearchTendersResponse | null;
  isLoading: boolean;
  onBookmarkToggle: (tenderId: string) => Promise<void>;
}

export default function SearchResultsList({
  setSelectedTender,
  searchResults,
  searchResponse,
  isLoading,
  onBookmarkToggle,
}: SearchResultsListProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [sortBy, setSortBy] = useState<"relevance" | "deadline" | "published">(
    "relevance"
  );

  return (
    <div className="bg-surface border border-border rounded-lg flex flex-col h-full">
      {/* Results Header - Compact */}
      <div className="p-4 border-b border-border flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold text-text">
              {isLoading
                ? "Searching..."
                : `${searchResults.length} results`}
            </h2>
            {searchResponse?.search_metadata?.max_score && (
              <div className="flex items-center gap-1 text-xs text-text-muted">
                <Star className="w-3 h-3 text-primary" />
                <span>
                  Best: {(searchResponse.search_metadata.max_score * 10).toFixed(1)}%
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-text-muted">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as "relevance" | "deadline" | "published"
                  )
                }
                className="text-primary font-medium bg-transparent border-none focus:outline-none cursor-pointer text-xs"
              >
                <option value="relevance">Relevance</option>
                <option value="deadline">Deadline</option>
                <option value="published">Published</option>
              </select>
            </div>

            {/* View Toggle */}
            <div className="hidden md:flex items-center bg-surface-muted rounded p-0.5">
              <button
                onClick={() => setViewMode("list")}
                className={`p-1 rounded transition-colors ${
                  viewMode === "list"
                    ? "bg-primary text-white"
                    : "text-text-muted hover:text-text"
                }`}
              >
                <ListBullets className="w-3 h-3" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1 rounded transition-colors ${
                  viewMode === "grid"
                    ? "bg-primary text-white"
                    : "text-text-muted hover:text-text"
                }`}
              >
                <GridFour className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results List */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <p className="mt-3 text-text-muted text-sm">
              Searching contracts...
            </p>
          </div>
        )}

        {/* Search Results */}
        {!isLoading && searchResults.length > 0 && (
          <div className="space-y-3">
            {searchResults.map((result) => (
              <TenderCard
                key={result.id}
                tender={result}
                onBookmarkToggle={onBookmarkToggle}
                setSelectedTender={setSelectedTender}
                compact={true}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && searchResults.length === 0 && (
          <div className="text-center py-8">
            <MagnifyingGlass className="w-12 h-12 text-text-muted mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-text mb-2">
              No results found
            </h3>
            <p className="text-text-muted mb-4 text-sm">
              Try adjusting your search terms or filters to find relevant
              contracts.
            </p>
          </div>
        )}

        {/* Load More */}
        {!isLoading &&
          searchResults.length > 0 &&
          searchResults.length >= 20 && (
            <div className="text-center mt-8">
              <button className="bg-surface border border-border text-text px-6 py-2.5 rounded-lg hover:bg-surface-muted transition-colors font-medium text-sm">
                Load More Results
              </button>
            </div>
          )}
      </div>
    </div>
  );
}
