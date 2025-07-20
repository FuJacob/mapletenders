import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import {
  MagnifyingGlass,
  ArrowLeft,
  Star,
  Sliders,
  Lightning,
  Trophy,
  GridFour,
  ListBullets,
} from "@phosphor-icons/react";
import { searchTenders } from "../api";
import { TenderCard } from "../components";
import type { TenderSearchResult, SearchTendersResponse } from "../api/types";
import { createBookmark } from "../api/bookmarks";
import { useAuth } from "../hooks/auth";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const [firstQuery] = useState(searchParams.get("q") || "");
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [sortBy, setSortBy] = useState<"relevance" | "deadline" | "published">(
    "relevance"
  );
  const [searchResults, setSearchResults] = useState<TenderSearchResult[]>([]);
  const [searchResponse, setSearchResponse] =
    useState<SearchTendersResponse | null>(null);

  const handleBookmarkToggle = async (tenderId: string) => {
    if (!userId) {
      console.error("User ID is not set");
      return;
    }
    setSearchResults(
      searchResults.map((result) =>
        result.id === tenderId
          ? { ...result, is_bookmarked: !result.is_bookmarked }
          : result
      )
    );
    try {
      const response = await createBookmark({
        userId,
        tenderNoticeId: tenderId,
      });
      console.log(response);
    } catch (error) {
      console.error("Error bookmarking tender:", error);
      setSearchResults(
        searchResults.map((result) =>
          result.id === tenderId
            ? { ...result, is_bookmarked: !result.is_bookmarked }
            : result
        )
      );
    }
    return;
  };

  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const userId = user?.id;

  // Filter states
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedProcurementMethod, setSelectedProcurementMethod] =
    useState<string>("");
  const [selectedProcurementCategories, setSelectedProcurementCategories] =
    useState<string[]>([]);
  const [selectedNoticeTypes, setSelectedNoticeTypes] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedContractingEntities, setSelectedContractingEntities] =
    useState<string[]>([]);
  const [closingDateAfter, setClosingDateAfter] = useState<string>("");
  const [closingDateBefore, setClosingDateBefore] = useState<string>("");
  const [publicationDateAfter, setPublicationDateAfter] = useState<string>("");
  const [publicationDateBefore, setPublicationDateBefore] =
    useState<string>("");

  useEffect(() => {
    const performInitialSearch = async () => {
      if (!firstQuery.trim()) return;

      setIsLoading(true);
      try {
        const response = await searchTenders({
          q: firstQuery,
        });

        setSearchResponse(response);
        setSearchResults(response.results);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    performInitialSearch();
  }, [firstQuery]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const response = await searchTenders({
        q: searchQuery,
        regions: selectedRegions.length > 0 ? selectedRegions : undefined,
        procurement_method: selectedProcurementMethod || undefined,
        procurement_category:
          selectedProcurementCategories.length > 0
            ? selectedProcurementCategories
            : undefined,
        notice_type:
          selectedNoticeTypes.length > 0 ? selectedNoticeTypes : undefined,
        status: selectedStatus.length > 0 ? selectedStatus : undefined,
        contracting_entity_name:
          selectedContractingEntities.length > 0
            ? selectedContractingEntities
            : undefined,
        closing_date_after: closingDateAfter || undefined,
        closing_date_before: closingDateBefore || undefined,
        publication_date_after: publicationDateAfter || undefined,
        publication_date_before: publicationDateBefore || undefined,
        limit: undefined,
      });

      setSearchResponse(response);
      setSearchResults(response.results);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewSearch = () => {
    if (query !== firstQuery) {
      performSearch(query);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleNewSearch();
    }
  };

  const applyFilters = () => {
    performSearch(query || firstQuery);
    setShowFilters(false);
  };

  const resetFilters = () => {
    setSelectedRegions([]);
    setSelectedProcurementMethod("");
    setSelectedProcurementCategories([]);
    setSelectedNoticeTypes([]);
    setSelectedStatus([]);
    setSelectedContractingEntities([]);
    setClosingDateAfter("");
    setClosingDateBefore("");
    setPublicationDateAfter("");
    setPublicationDateBefore("");
  };

  const regions = [
    "Ontario",
    "British Columbia",
    "Alberta",
    "Quebec",
    "Manitoba",
    "Saskatchewan",
    "Nova Scotia",
    "New Brunswick",
    "Newfoundland and Labrador",
    "Prince Edward Island",
  ];

  const procurementMethods = [
    "Request for Proposal",
    "Request for Quotation",
    "Invitation to Qualify",
    "Standing Offer",
  ];

  return (
    <div className="min-h-screen bg-bg py-4">
      <div className="max-w-7xl mx-auto px-6">
        {/* Compact Header with Back Button, Title, and Key Metrics */}
        <div className="mb-6">
          {/* Back Button Row */}
          <div className="mb-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-text-muted hover:text-text transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Search</span>
            </Link>
          </div>

          {/* Consolidated Title and Stats Row */}
          <div className="flex items-start justify-between gap-6 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <MagnifyingGlass className="w-6 h-6 text-primary" />
                <h1 className="text-2xl font-bold text-text line-clamp-2">
                  Search Results for "{firstQuery}"
                </h1>
              </div>
              <p className="text-text-muted">
                Found{" "}
                <strong className="text-primary">
                  {searchResponse?.total_results || 0}
                </strong>{" "}
                relevant Canadian government contracts
              </p>
            </div>

            {/* Performance Stats - Right Side */}
            {searchResponse?.search_metadata && (
              <div className="flex items-center gap-4 bg-surface-warm border border-border-warm rounded-lg px-4 py-3">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold text-primary">
                    {searchResponse.search_metadata.max_score
                      ? `${(
                          searchResponse.search_metadata.max_score * 10
                        ).toFixed(1)}%`
                      : "95%"}{" "}
                    match
                  </span>
                </div>
                <div className="h-4 w-px bg-border"></div>
                <div className="flex items-center gap-2">
                  <Lightning className="w-4 h-4 text-maple" />
                  <span className="text-sm font-medium text-text-warm">
                    {searchResponse.search_metadata.elasticsearch_took_ms
                      ? `${searchResponse.search_metadata.elasticsearch_took_ms}ms`
                      : "<50ms"}
                  </span>
                </div>
                <div className="h-4 w-px bg-border"></div>
                <div className="text-xs text-text-muted flex items-center gap-1">
                  🍁 <span>Canadian AI</span>
                </div>
              </div>
            )}
          </div>

          {/* Compact Search Refinement */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-muted" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-10 pr-4 py-2.5 border border-border focus:border-primary focus:ring-0 focus:outline-none bg-surface text-sm font-medium placeholder:text-text-muted rounded-lg"
                placeholder="Refine search..."
              />
            </div>
            <button
              onClick={handleNewSearch}
              className="bg-primary text-white px-4 py-2.5 rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm flex items-center gap-2"
            >
              <Lightning className="w-4 h-4" />
              Search
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div
            className={`${
              showFilters ? "block" : "hidden"
            } lg:block lg:col-span-1`}
          >
            <div className="bg-surface border border-border rounded-xl p-4 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-text">Filters</h3>
                <button
                  onClick={resetFilters}
                  className="text-xs text-text-muted hover:text-text transition-colors"
                >
                  Reset
                </button>
              </div>

              {/* Regions Filter */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-text mb-2">Regions</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {regions.map((region) => (
                    <label
                      key={region}
                      className="flex items-center gap-3 text-sm cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedRegions.includes(region)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRegions([...selectedRegions, region]);
                          } else {
                            setSelectedRegions(
                              selectedRegions.filter((r) => r !== region)
                            );
                          }
                        }}
                        className="rounded border-border text-primary focus:ring-primary"
                      />
                      <span className="text-text-muted">{region}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Procurement Method Filter */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-text mb-2">
                  Procurement Method
                </h4>
                <div className="space-y-2">
                  {procurementMethods.map((method) => (
                    <label
                      key={method}
                      className="flex items-center gap-3 text-sm cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="procurement_method"
                        value={method}
                        checked={selectedProcurementMethod === method}
                        onChange={(e) =>
                          setSelectedProcurementMethod(e.target.value)
                        }
                        className="border-border text-primary focus:ring-primary"
                      />
                      <span className="text-text-muted">{method}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Closing Date Filter */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-text mb-2">
                  Closing Date After
                </h4>
                <input
                  type="date"
                  value={closingDateAfter}
                  onChange={(e) => setClosingDateAfter(e.target.value)}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>

              <button
                onClick={applyFilters}
                className="w-full bg-primary text-white py-2.5 rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm"
              >
                Apply Filters
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-3">
            {/* Compact Results Header */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-bold text-text">
                    {searchResults.length} Contract
                    {searchResults.length !== 1 ? "s" : ""}
                  </h2>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-text-muted">Sort:</span>
                    <select
                      value={sortBy}
                      onChange={(e) =>
                        setSortBy(
                          e.target.value as
                            | "relevance"
                            | "deadline"
                            | "published"
                        )
                      }
                      className="text-primary font-medium bg-transparent border-none focus:outline-none cursor-pointer text-sm"
                    >
                      <option value="relevance">Relevance</option>
                      <option value="deadline">Deadline</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                  {searchResponse?.search_metadata?.max_score && (
                    <div className="flex items-center gap-1 text-sm text-text-muted">
                      <Star className="w-4 h-4 text-primary" />
                      <span>
                        Best:{" "}
                        {(
                          searchResponse.search_metadata.max_score * 10
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* Compact View Toggle */}
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

                  {/* Compact Filters Toggle */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded text-sm hover:bg-primary/90 transition-colors"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    Filters
                  </button>
                </div>
              </div>

              {/* Compact Active Filters */}
              {(selectedRegions.length > 0 ||
                selectedProcurementMethod ||
                closingDateAfter) && (
                <div className="flex items-center gap-2 p-2 bg-surface-muted rounded text-xs">
                  <span className="text-text-muted font-medium">Filters:</span>
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
                    onClick={resetFilters}
                    className="text-accent hover:text-accent/80 ml-1 underline"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>

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
            {!isLoading && (
              <div className="space-y-3">
                {searchResults.map((result) => (
                  <TenderCard
                    key={result.id}
                    tender={result}
                    onBookmarkToggle={handleBookmarkToggle}
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
                  onClick={resetFilters}
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
      </div>
    </div>
  );
}
