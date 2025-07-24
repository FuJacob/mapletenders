import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SearchSection, SearchResultsList } from "../components/search";
import { searchTenders } from "../api";
import { createBookmark } from "../api/bookmarks";
import { useAuth } from "../hooks/auth";
import type { TenderSearchResult, SearchTendersResponse } from "../api/types";
import { TenderNoticeFullContent } from "../components/tenderNotice/TenderNoticeFullContent";
export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const userId = user?.id;

  // Search query state
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [initialQuery] = useState(searchParams.get("q") || "");

  // Search results state
  const [searchResults, setSearchResults] = useState<TenderSearchResult[]>([]);
  const [searchResponse, setSearchResponse] =
    useState<SearchTendersResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTender, setSelectedTender] = useState<string | null>(" ");
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

  const exampleSearches = [
    "IT services contracts in Ontario under $100K",
    "Construction projects in Alberta over $500K",
    "Consulting opportunities closing this month",
    "Software development with government agencies",
    "Cybersecurity services for government",
    "Cloud infrastructure modernization",
  ];

  // Perform search function
  const performSearch = async (searchQueryParam?: string) => {
    const queryToSearch = searchQueryParam || searchQuery;
    if (!queryToSearch.trim()) return;

    setIsLoading(true);
    try {
      const response = await searchTenders({
        q: queryToSearch,
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

      // Update URL with search query
      if (queryToSearch !== searchParams.get("q")) {
        setSearchParams({ q: queryToSearch });
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial search effect
  useEffect(() => {
    if (initialQuery.trim()) {
      performSearch(initialQuery);
    }
  }, [initialQuery, performSearch]);

  // Handle search submission
  const handleSubmitSearch = () => {
    performSearch();
  };

  // Handle bookmark toggle
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
      // Revert on error
      setSearchResults(
        searchResults.map((result) =>
          result.id === tenderId
            ? { ...result, is_bookmarked: !result.is_bookmarked }
            : result
        )
      );
    }
  };

  // Reset filters
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

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Search Section - Full Width */}
      <SearchSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSubmitSearch={handleSubmitSearch}
        exampleSearches={exampleSearches}
      />

      {/* Main Content: 1/3 and 2/3 Layout */}
      <div className="flex-1 flex gap-6 min-h-0">
        {/* Left Side - Filters (1/3) */}
        <div className="w-2/5 flex flex-col">
          <TenderNoticeFullContent tenderId={selectedTender} />
        </div>

        {/* Right Side - Search Results (2/3) */}
        <div className="w-3/5">
          <SearchResultsList
            setSelectedTender={setSelectedTender}
            searchResults={searchResults}
            searchResponse={searchResponse}
            isLoading={isLoading}
            onBookmarkToggle={handleBookmarkToggle}
            onResetFilters={resetFilters}
            selectedRegions={selectedRegions}
            selectedProcurementMethod={selectedProcurementMethod}
            closingDateAfter={closingDateAfter}
          />
        </div>
      </div>
    </div>
  );
}
