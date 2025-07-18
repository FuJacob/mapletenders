import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import {
  MagnifyingGlass,
  Funnel,
  ArrowLeft,
  Star,
  ChartBar,
  Clock,
  Sparkle,
} from "@phosphor-icons/react";
import { searchTenders } from "../api";
import { PageHeader } from "../components/ui";
import { SearchResultCard } from "../components/SearchResultCard";
import type { TenderSearchResult, SearchTendersResponse } from "../api/types";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const [firstQuery] = useState(searchParams.get("q") || "");
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [showFilters, setShowFilters] = useState(false);
  const [searchResults, setSearchResults] = useState<TenderSearchResult[]>([]);
  const [searchResponse, setSearchResponse] =
    useState<SearchTendersResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Filter states
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedProcurementMethod, setSelectedProcurementMethod] =
    useState<string>("");
  const [selectedProcurementCategories, setSelectedProcurementCategories] =
    useState<string[]>([]);
  const [selectedNoticeTypes, setSelectedNoticeTypes] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>(
    []
  );
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
          limit: 20,
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
        status:
          selectedStatus.length > 0 ? selectedStatus : undefined,
        contracting_entity_name:
          selectedContractingEntities.length > 0
            ? selectedContractingEntities
            : undefined,
        closing_date_after: closingDateAfter || undefined,
        closing_date_before: closingDateBefore || undefined,
        publication_date_after: publicationDateAfter || undefined,
        publication_date_before: publicationDateBefore || undefined,
        limit: 20,
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
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-text-muted hover:text-text transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Search</span>
          </Link>
        </div>

        <PageHeader
          icon={<MagnifyingGlass className="w-10 h-10 text-primary" />}
          title={`Search Results for "${firstQuery}"`}
          description={`Found ${
            searchResponse?.total_results || 0
          } relevant government contracts matching your search`}
        />

        {/* Search Performance Stats */}
        {searchResponse?.search_metadata && (
          <div className="mb-8 bg-surface border border-border rounded-xl p-6">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <ChartBar className="w-4 h-4 text-primary" />
                <span className="text-text-muted">Search Quality:</span>
                <span className="font-semibold text-text">
                  {searchResponse.search_metadata.max_score
                    ? `${(
                        searchResponse.search_metadata.max_score * 10
                      ).toFixed(1)}% relevance`
                    : "High"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-text-muted">Response Time:</span>
                <span className="font-semibold text-text">
                  {searchResponse.search_metadata.elasticsearch_took_ms
                    ? `${searchResponse.search_metadata.elasticsearch_took_ms}ms`
                    : "Fast"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkle className="w-4 h-4 text-primary" />
                <span className="text-text-muted">
                  Powered by AI search with semantic understanding
                </span>
              </div>
            </div>
          </div>
        )}

        {/* New Search Bar */}
        <div className="mb-8 bg-surface border border-border rounded-xl p-6">
          <div className="relative max-w-4xl mx-auto">
            <MagnifyingGlass className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full pl-12 pr-24 py-4 border border-border rounded-xl focus:border-primary focus:ring-0 focus:outline-none bg-surface text-lg font-medium placeholder:text-text-muted"
              placeholder="Refine your search or try a new query..."
            />
            <button
              onClick={handleNewSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Search
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div
            className={`${
              showFilters ? "block" : "hidden"
            } lg:block lg:col-span-1`}
          >
            <div className="bg-surface border border-border rounded-xl p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-text">Filters</h3>
                <button
                  onClick={resetFilters}
                  className="text-sm text-text-muted hover:text-text transition-colors"
                >
                  Reset
                </button>
              </div>

              {/* Regions Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-text mb-3">Regions</h4>
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
              <div className="mb-6">
                <h4 className="text-sm font-medium text-text mb-3">
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
              <div className="mb-6">
                <h4 className="text-sm font-medium text-text mb-3">
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
                className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Apply Filters
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-text mb-2">
                  {searchResults.length} Contract
                  {searchResults.length !== 1 ? "s" : ""} Found
                </h2>
                <div className="flex items-center gap-4 text-sm text-text-muted">
                  <span>Sorted by relevance</span>
                  {searchResponse?.search_metadata?.max_score && (
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      Top match:{" "}
                      {(searchResponse.search_metadata.max_score * 10).toFixed(
                        1
                      )}
                      % relevant
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-surface-muted transition-colors"
                >
                  <Funnel className="w-4 h-4" />
                  Filters
                </button>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-4 text-text-muted">Searching contracts...</p>
              </div>
            )}

            {/* Search Results */}
            {!isLoading && (
              <div className="space-y-6">
                {searchResults.map((result) => (
                  <SearchResultCard key={result.id} result={result} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && searchResults.length === 0 && (
              <div className="text-center py-12">
                <MagnifyingGlass className="w-16 h-16 text-text-muted mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-text mb-2">
                  No results found
                </h3>
                <p className="text-text-muted mb-6">
                  Try adjusting your search terms or filters to find relevant
                  contracts.
                </p>
                <button
                  onClick={resetFilters}
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Load More */}
            {!isLoading &&
              searchResults.length > 0 &&
              searchResults.length >= 20 && (
                <div className="text-center mt-12">
                  <button className="bg-surface border border-border text-text px-8 py-3 rounded-lg hover:bg-surface-muted transition-colors font-medium">
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
