import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  SearchSection,
  SearchResultsList,
  SearchHistory,
} from "../components/search";
import { searchTenders } from "../api";
import { createBookmark } from "../api/bookmarks";
import { useAuth } from "../hooks/auth";
import type { TenderSearchResult, SearchTendersResponse } from "../api/types";
import { TenderNoticeFullContent } from "../components/tenderNotice/TenderNoticeFullContent";
import { PageHeader } from "../components/ui";
import { MagnifyingGlass } from "@phosphor-icons/react";
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

  // Perform search function
  const performSearch = useCallback(
    async (searchQueryParam?: string) => {
      const queryToSearch = searchQueryParam || searchQuery;
      if (!queryToSearch.trim()) return;

      setIsLoading(true);
      try {
        console.log("Searching for:", queryToSearch);
        const response = await searchTenders({
          q: queryToSearch,
          limit: 10,
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
    },
    [searchQuery, searchParams, setSearchParams]
  );

  // Initial search effect
  useEffect(() => {
    if (initialQuery.trim()) {
      performSearch(initialQuery);
    }
  }, [initialQuery, performSearch]);

  // Handle search submission
  const handleSubmitSearch = useCallback(() => {
    performSearch();
  }, [performSearch]);

  // Handle search history selection
  const handleHistorySearchSelect = useCallback(
    (query: string) => {
      setSearchQuery(query);
      performSearch(query);
    },
    [performSearch]
  );

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

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header Section with Search History - Fixed Height */}
      <div className="flex-shrink-0 mb-3">
        <div className="flex items-start justify-between gap-6 mb-3">
          <PageHeader
            icon={<MagnifyingGlass className="w-10 h-10 text-primary" />}
            title="Search"
            description="Discover opportunities using AI"
          />
          {/* Search History - Horizontal beside header */}

          <SearchHistory onSearchSelect={handleHistorySearchSelect} />
        </div>

        {/* Search Section - Full Width */}
        <SearchSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSubmitSearch={handleSubmitSearch}
        />
      </div>

      {/* Main Content: 2/5 and 3/5 Layout - Takes remaining height */}
      <div className="flex gap-4 flex-1 min-h-0 overflow-hidden">
        {/* Left Side - Tender Details (2/5) */}
        <div className="w-2/5 flex flex-col min-h-0">
          <TenderNoticeFullContent tenderId={selectedTender} compact={true} />
        </div>

        {/* Right Side - Search Results (3/5) */}
        <div className="w-3/5 flex flex-col min-h-0">
          <SearchResultsList
            setSelectedTender={setSelectedTender}
            searchResults={searchResults}
            searchResponse={searchResponse}
            isLoading={isLoading}
            onBookmarkToggle={handleBookmarkToggle}
          />
        </div>
      </div>
    </div>
  );
}
