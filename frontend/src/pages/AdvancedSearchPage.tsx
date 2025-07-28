import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  AdvancedSearchForm,
  FilterSidebar,
  SavedSearches,
  SearchResultsList,
} from "../components/search";
import { searchTenders } from "../api";
import { createBookmark } from "../api/bookmarks";
import { analyticsAPI } from "../api/analytics";
import { useAuth } from "../hooks/auth";
import type { TenderSearchResult, SearchTendersResponse } from "../api/types";
import type { SearchFilters } from "../components/search/AdvancedSearchForm";
import { TenderNoticeFullContent } from "../components/tenderNotice/TenderNoticeFullContent";
import { PageHeader } from "../components/ui";
import { Funnel, BookmarkSimple, MagnifyingGlass } from "@phosphor-icons/react";

type ViewMode = 'search' | 'saved-searches';

interface SavedSearch {
  id: string;
  name: string;
  query: string;
  filters: Record<string, any>;
  resultCount: number;
  lastRun: Date;
  isAlert: boolean;
  alertFrequency?: 'daily' | 'weekly' | 'instant';
  created: Date;
  tags: string[];
  favorite: boolean;
}

export default function AdvancedSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.id;

  // View state
  const [viewMode, setViewMode] = useState<ViewMode>('search');
  const [showFilters, setShowFilters] = useState(true);

  // Search state
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: searchParams.get("q") || '',
    location: { provinces: [], cities: [], regions: [] },
    financial: { minValue: null, maxValue: null, currency: 'CAD' },
    timeline: { publishedAfter: null, closingBefore: null, contractStart: null },
    categories: { industries: [], procurementTypes: [], methods: [] },
    advanced: { keywords: [], excludeKeywords: [], minimumMatchScore: 0.7, onlyRecommended: false },
  });

  // Results state
  const [searchResults, setSearchResults] = useState<TenderSearchResult[]>([]);
  const [searchResponse, setSearchResponse] = useState<SearchTendersResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTender, setSelectedTender] = useState<string | null>(null);

  // Filter sidebar state
  const [sidebarFilters, setSidebarFilters] = useState<Record<string, any>>({});

  // Initialize from URL parameters
  useEffect(() => {
    const urlQuery = searchParams.get("q");
    if (urlQuery) {
      setSearchFilters(prev => ({ ...prev, query: urlQuery }));
      performSearch({ ...searchFilters, query: urlQuery });
    }
  }, []);

  // Perform search function
  const performSearch = useCallback(
    async (filters: SearchFilters) => {
      setIsLoading(true);
      
      try {
        // Track search activity
        if (userId) {
          await analyticsAPI.trackActivity({
            actionType: 'advanced_search',
            resourceType: 'tender',
            metadata: {
              query: filters.query,
              filterCount: Object.keys(filters).filter(key => {
                const value = filters[key as keyof SearchFilters];
                return value && 
                  ((Array.isArray(value) && value.length > 0) ||
                   (typeof value === 'object' && Object.values(value).some(v => v !== null && v !== '')));
              }).length,
            },
            sessionId: Date.now().toString(),
          });
        }

        // Convert filters to API format
        const searchQuery = buildSearchQuery(filters);
        console.log("Advanced search with filters:", searchQuery);

        const response = await searchTenders(searchQuery);
        setSearchResponse(response);
        setSearchResults(response.results);

        // Update URL
        if (filters.query !== searchParams.get("q")) {
          const newParams = new URLSearchParams(searchParams);
          if (filters.query) {
            newParams.set("q", filters.query);
          } else {
            newParams.delete("q");
          }
          setSearchParams(newParams);
        }
      } catch (error) {
        console.error("Error performing advanced search:", error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [searchParams, setSearchParams, userId]
  );

  // Convert SearchFilters to API query format
  const buildSearchQuery = (filters: SearchFilters) => {
    const query: any = {
      q: filters.query,
      limit: 50, // More results for advanced search
    };

    // Add filters based on SearchFilters structure
    if (filters.location.provinces.length > 0) {
      query.provinces = filters.location.provinces;
    }

    if (filters.categories.industries.length > 0) {
      query.categories = filters.categories.industries;
    }

    if (filters.financial.minValue || filters.financial.maxValue) {
      query.minValue = filters.financial.minValue;
      query.maxValue = filters.financial.maxValue;
    }

    if (filters.timeline.publishedAfter) {
      query.publishedAfter = filters.timeline.publishedAfter.toISOString();
    }

    if (filters.timeline.closingBefore) {
      query.closingBefore = filters.timeline.closingBefore.toISOString();
    }

    if (filters.advanced.keywords.length > 0) {
      query.keywords = filters.advanced.keywords;
    }

    if (filters.advanced.excludeKeywords.length > 0) {
      query.excludeKeywords = filters.advanced.excludeKeywords;
    }

    if (filters.advanced.minimumMatchScore > 0.7) {
      query.minMatchScore = filters.advanced.minimumMatchScore;
    }

    if (filters.advanced.onlyRecommended) {
      query.onlyRecommended = true;
    }

    return query;
  };

  // Handle search form submission
  const handleSearch = useCallback((filters: SearchFilters) => {
    setSearchFilters(filters);
    performSearch(filters);
  }, [performSearch]);

  // Handle sidebar filter changes
  const handleSidebarFiltersChange = useCallback((filters: Record<string, any>) => {
    setSidebarFilters(filters);
    // You could merge these with main search filters if needed
  }, []);

  // Handle save search
  const handleSaveSearch = useCallback(async (filters: SearchFilters, name: string) => {
    try {
      // In a real implementation, this would save to the backend
      console.log("Saving search:", name, filters);
      
      // Track save action
      if (userId) {
        await analyticsAPI.trackActivity({
          actionType: 'save_search',
          resourceType: 'search',
          metadata: { searchName: name, filterCount: Object.keys(filters).length },
          sessionId: Date.now().toString(),
        });
      }

      alert(`Search "${name}" saved successfully!`);
    } catch (error) {
      console.error("Error saving search:", error);
      alert("Failed to save search. Please try again.");
    }
  }, [userId]);

  // Handle saved search actions
  const handleRunSavedSearch = useCallback((search: SavedSearch) => {
    // Convert saved search back to SearchFilters format
    const filters: SearchFilters = {
      query: search.query,
      location: { provinces: search.filters.location || [], cities: [], regions: [] },
      financial: { minValue: null, maxValue: null, currency: 'CAD' },
      timeline: { publishedAfter: null, closingBefore: null, contractStart: null },
      categories: { 
        industries: search.filters.category || [], 
        procurementTypes: search.filters.procurement || [], 
        methods: [] 
      },
      advanced: { keywords: [], excludeKeywords: [], minimumMatchScore: 0.7, onlyRecommended: false },
    };

    setSearchFilters(filters);
    performSearch(filters);
    setViewMode('search');
  }, [performSearch]);

  const handleEditSavedSearch = useCallback((search: SavedSearch) => {
    // Convert to SearchFilters and switch to search view
    handleRunSavedSearch(search);
  }, [handleRunSavedSearch]);

  const handleDeleteSavedSearch = useCallback((searchId: string) => {
    if (confirm("Are you sure you want to delete this saved search?")) {
      console.log("Deleting search:", searchId);
      // Implement delete logic
    }
  }, []);

  const handleToggleAlert = useCallback((searchId: string, enabled: boolean) => {
    console.log("Toggle alert for search:", searchId, enabled);
    // Implement alert toggle logic
  }, []);

  const handleToggleFavorite = useCallback((searchId: string) => {
    console.log("Toggle favorite for search:", searchId);
    // Implement favorite toggle logic
  }, []);

  // Handle bookmark toggle
  const handleBookmarkToggle = useCallback(async (tenderId: string) => {
    if (!userId) {
      console.error("User ID is not set");
      return;
    }

    setSearchResults(prev =>
      prev.map((result) =>
        result.id === tenderId
          ? { ...result, is_bookmarked: !result.is_bookmarked }
          : result
      )
    );

    try {
      await createBookmark({ userId, tenderNoticeId: tenderId });
      
      // Track bookmark action
      await analyticsAPI.trackActivity({
        actionType: 'bookmark',
        resourceType: 'tender',
        resourceId: tenderId,
        sessionId: Date.now().toString(),
      });
    } catch (error) {
      console.error("Error bookmarking tender:", error);
      // Revert on error
      setSearchResults(prev =>
        prev.map((result) =>
          result.id === tenderId
            ? { ...result, is_bookmarked: !result.is_bookmarked }
            : result
        )
      );
    }
  }, [userId]);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 mb-4">
        <div className="flex items-center justify-between">
          <PageHeader
            icon={<Funnel className="w-10 h-10 text-primary" />}
            title="Advanced Search"
            description="Powerful filtering and search tools"
          />
          
          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex bg-surface-muted rounded-lg p-1">
              <button
                onClick={() => setViewMode('search')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'search'
                    ? 'bg-primary text-white'
                    : 'text-text-light hover:text-text'
                }`}
              >
                <MagnifyingGlass className="w-4 h-4 inline-block mr-2" />
                Search
              </button>
              <button
                onClick={() => setViewMode('saved-searches')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'saved-searches'
                    ? 'bg-primary text-white'
                    : 'text-text-light hover:text-text'
                }`}
              >
                <BookmarkSimple className="w-4 h-4 inline-block mr-2" />
                Saved
              </button>
            </div>

            {/* Toggle Filters */}
            {viewMode === 'search' && (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-3 py-2 text-sm font-medium text-text-light hover:text-text border border-border rounded-lg"
              >
                {showFilters ? 'Hide' : 'Show'} Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-6 flex-1 min-h-0 overflow-hidden">
        {/* Left Sidebar - Filters or Saved Searches */}
        <div className={`transition-all duration-300 ${showFilters && viewMode === 'search' ? 'w-1/4' : 'w-0 overflow-hidden'}`}>
          {viewMode === 'search' && showFilters && (
            <FilterSidebar
              onFiltersChange={handleSidebarFiltersChange}
              resultsCount={searchResponse?.total || 0}
              loading={isLoading}
            />
          )}
        </div>

        {/* Main Content Area */}
        <div className={`flex-1 min-w-0 ${viewMode === 'saved-searches' ? 'w-full' : ''}`}>
          {viewMode === 'saved-searches' ? (
            /* Saved Searches View */
            <SavedSearches
              onRunSearch={handleRunSavedSearch}
              onEditSearch={handleEditSavedSearch}
              onDeleteSearch={handleDeleteSavedSearch}
              onToggleAlert={handleToggleAlert}
              onToggleFavorite={handleToggleFavorite}
            />
          ) : (
            /* Search View */
            <div className="flex flex-col h-full gap-6">
              {/* Advanced Search Form */}
              <div className="flex-shrink-0">
                <AdvancedSearchForm
                  initialFilters={searchFilters}
                  onSearch={handleSearch}
                  onSaveSearch={handleSaveSearch}
                  loading={isLoading}
                />
              </div>

              {/* Results Area */}
              <div className="flex gap-6 flex-1 min-h-0">
                {/* Tender Details */}
                <div className="w-2/5 flex flex-col min-h-0">
                  <TenderNoticeFullContent 
                    tenderId={selectedTender} 
                    compact={true} 
                  />
                </div>

                {/* Search Results */}
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
          )}
        </div>
      </div>
    </div>
  );
}