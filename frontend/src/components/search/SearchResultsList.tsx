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
  onResetFilters: () => void;
  selectedRegions: string[];
  selectedProcurementMethod: string;
  closingDateAfter: string;
}

export default function SearchResultsList({
  setSelectedTender,
  searchResults,
  searchResponse,
  isLoading,
  onBookmarkToggle,
  onResetFilters,
  selectedRegions,
  selectedProcurementMethod,
  closingDateAfter,
}: SearchResultsListProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [sortBy, setSortBy] = useState<"relevance" | "deadline" | "published">(
    "relevance"
  );

  return (
    <div className="bg-surface border border-border rounded-lg flex flex-col h-full">
      {/* Results Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-text">
              {isLoading
                ? "Searching..."
                : `${searchResults.length} results found`}
            </h2>
            {searchResponse?.search_metadata?.max_score && (
              <div className="flex items-center gap-1 text-sm text-text-muted">
                <Star className="w-4 h-4 text-primary" />
                <span>
                  Best match:{" "}
                  {(searchResponse.search_metadata.max_score * 10).toFixed(1)}%
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-text-muted">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as "relevance" | "deadline" | "published"
                  )
                }
                className="text-primary font-medium bg-transparent border-none focus:outline-none cursor-pointer text-sm"
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
                className={`p-1.5 rounded transition-colors ${
                  viewMode === "list"
                    ? "bg-primary text-white"
                    : "text-text-muted hover:text-text"
                }`}
              >
                <ListBullets className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === "grid"
                    ? "bg-primary text-white"
                    : "text-text-muted hover:text-text"
                }`}
              >
                <GridFour className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {(selectedRegions.length > 0 ||
          selectedProcurementMethod ||
          closingDateAfter) && (
          <div className="flex items-center gap-2 p-2 bg-surface-muted rounded text-xs">
            <span className="text-text-muted font-medium">Active filters:</span>
            {selectedRegions.slice(0, 2).map((region) => (
              <span
                key={region}
                className="bg-primary/10 text-primary px-2 py-0.5 rounded"
              >
                {region}
              </span>
            ))}
            {selectedProcurementMethod && (
              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded">
                {selectedProcurementMethod}
              </span>
            )}
            {closingDateAfter && (
              <span className="bg-accent/10 text-accent px-2 py-0.5 rounded">
                After {closingDateAfter}
              </span>
            )}
            {selectedRegions.length > 2 && (
              <span className="text-text-muted">
                +{selectedRegions.length - 2} more
              </span>
            )}
            <button
              onClick={onResetFilters}
              className="text-accent hover:text-accent/80 ml-1 underline"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Results List */}
      <div className="flex-1 overflow-y-auto p-6">
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
          <div className="space-y-4">
            {searchResults.map((result) => (
              <TenderCard
                key={result.id}
                tender={result}
                onBookmarkToggle={onBookmarkToggle}
                setSelectedTender={setSelectedTender}
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
            <button
              onClick={onResetFilters}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm"
            >
              Clear Filters
            </button>
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
