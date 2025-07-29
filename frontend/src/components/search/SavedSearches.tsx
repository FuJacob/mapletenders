import { memo, useState, useEffect } from "react";
import { 
  BookmarkSimple, 
  Play, 
  PencilSimple, 
  Trash, 
  Plus,
  Clock,
  Bell,
  MagnifyingGlass,
  Star
} from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { searchAPI } from "../../api/search";
import { useAuth } from "../../hooks/auth";

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

interface SavedSearchesProps {
  onRunSearch: (search: SavedSearch) => void;
  onEditSearch: (search: SavedSearch) => void;
  onDeleteSearch: (searchId: string) => void;
  onToggleAlert: (searchId: string, enabled: boolean) => void;
  onToggleFavorite: (searchId: string) => void;
  className?: string;
}

const SavedSearches = memo(function SavedSearches({
  onRunSearch,
  onEditSearch,
  onDeleteSearch,
  onToggleAlert,
  onToggleFavorite,
  className = ""
}: SavedSearchesProps) {
  const { user } = useAuth();
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);

  // Load saved searches from backend
  useEffect(() => {
    const loadSavedSearches = async () => {
      if (!user?.id) {
        return;
      }

      try {
        const apiSearches = await searchAPI.getSavedSearches();
        
        // Convert API format to component format
        const convertedSearches: SavedSearch[] = apiSearches.map(search => ({
          id: search.id!,
          name: search.name,
          query: search.query,
          filters: search.filters as any, // Convert SearchFilters to Record<string, any>
          resultCount: search.resultCount || 0,
          lastRun: search.lastRun || search.createdAt || new Date(),
          isAlert: search.isAlert,
          alertFrequency: search.alertFrequency,
          created: search.createdAt || new Date(),
          tags: search.tags,
          favorite: search.favorite,
        }));
        
        setSavedSearches(convertedSearches);
      } catch (err) {
        console.error('Error loading saved searches:', err);
        // Fallback to mock data for development
        setSavedSearches(getMockSavedSearches());
      }
    };

    loadSavedSearches();
  }, [user?.id]);

  // Handle delete search with backend call
  const handleDelete = async (searchId: string) => {
    try {
      await searchAPI.deleteSavedSearch(searchId);
      setSavedSearches(prev => prev.filter(search => search.id !== searchId));
      onDeleteSearch(searchId);
    } catch (error) {
      console.error('Error deleting search:', error);
      alert('Failed to delete search. Please try again.');
    }
  };

  // Handle toggle alert with backend call
  const handleToggleAlert = async (searchId: string, enabled: boolean) => {
    try {
      await searchAPI.updateSavedSearch(searchId, {
        isAlert: enabled,
        alertFrequency: enabled ? 'daily' : undefined,
      });
      setSavedSearches(prev => 
        prev.map(search => 
          search.id === searchId 
            ? { ...search, isAlert: enabled, alertFrequency: enabled ? 'daily' : undefined }
            : search
        )
      );
      onToggleAlert(searchId, enabled);
    } catch (error) {
      console.error('Error toggling alert:', error);
      alert('Failed to update alert settings. Please try again.');
    }
  };

  // Handle toggle favorite with backend call
  const handleToggleFavorite = async (searchId: string) => {
    try {
      const search = savedSearches.find(s => s.id === searchId);
      if (!search) return;
      
      const newFavoriteStatus = !search.favorite;
      await searchAPI.updateSavedSearch(searchId, { favorite: newFavoriteStatus });
      
      setSavedSearches(prev => 
        prev.map(s => 
          s.id === searchId ? { ...s, favorite: newFavoriteStatus } : s
        )
      );
      onToggleFavorite(searchId);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Failed to update favorite status. Please try again.');
    }
  };

  // Mock data fallback for development
  const getMockSavedSearches = (): SavedSearch[] => [
    {
      id: '1',
      name: 'IT Infrastructure Projects',
      query: 'cloud infrastructure modernization',
      filters: {
        location: ['ON', 'BC'],
        category: ['it'],
        value: ['100k-500k', '500k-1m'],
      },
      resultCount: 42,
      lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      isAlert: true,
      alertFrequency: 'daily',
      created: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      tags: ['high-priority', 'infrastructure'],
      favorite: true,
    },
    {
      id: '2',
      name: 'Healthcare IT Services',
      query: 'healthcare management software',
      filters: {
        location: ['ON'],
        category: ['healthcare', 'it'],
        timeline: ['month'],
      },
      resultCount: 18,
      lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      isAlert: false,
      created: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
      tags: ['healthcare'],
      favorite: false,
    },
    {
      id: '3',
      name: 'Toronto Construction Contracts',
      query: 'construction renovation building',
      filters: {
        location: ['ON'],
        category: ['construction'],
        source: ['toronto'],
        value: ['under-50k', '50k-100k'],
      },
      resultCount: 67,
      lastRun: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      isAlert: true,
      alertFrequency: 'instant',
      created: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      tags: ['construction', 'toronto'],
      favorite: false,
    },
    {
      id: '4',
      name: 'Cybersecurity Consulting',
      query: 'cybersecurity penetration testing security audit',
      filters: {
        category: ['security', 'consulting'],
        procurement: ['rfp'],
        value: ['500k-1m', '1m-5m'],
      },
      resultCount: 23,
      lastRun: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
      isAlert: true,
      alertFrequency: 'weekly',
      created: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), // 3 weeks ago
      tags: ['security', 'high-value'],
      favorite: true,
    }
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'results' | 'created'>('recent');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Get all unique tags
  const allTags = Array.from(
    new Set(savedSearches.flatMap(search => search.tags))
  ).sort();

  // Filter and sort searches
  const filteredSearches = savedSearches
    .filter(search => {
      const matchesSearch = search.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           search.query.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTag = !selectedTag || search.tags.includes(selectedTag);
      const matchesFavorites = !showFavoritesOnly || search.favorite;
      
      return matchesSearch && matchesTag && matchesFavorites;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'results':
          return b.resultCount - a.resultCount;
        case 'created':
          return b.created.getTime() - a.created.getTime();
        case 'recent':
        default:
          return b.lastRun.getTime() - a.lastRun.getTime();
      }
    });

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) {
      return 'Just now';
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-CA');
    }
  };

  const getFiltersPreview = (filters: Record<string, any>) => {
    const parts: string[] = [];
    
    if (filters.location?.length) {
      parts.push(`Location: ${filters.location.join(', ')}`);
    }
    if (filters.category?.length) {
      parts.push(`Category: ${filters.category.join(', ')}`);
    }
    if (filters.value?.length) {
      parts.push(`Value: ${filters.value.join(', ')}`);
    }
    
    return parts.join(' • ');
  };

  const handleRunSearch = (search: SavedSearch) => {
    // Update last run time
    setSavedSearches(prev =>
      prev.map(s =>
        s.id === search.id
          ? { ...s, lastRun: new Date() }
          : s
      )
    );
    onRunSearch(search);
  };


  return (
    <div className={`bg-surface border border-border rounded-lg ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <BookmarkSimple className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text">Saved Searches</h3>
              <p className="text-sm text-text-light">Quickly re-run your favorite searches</p>
            </div>
          </div>
          
          <Link
            to="/search"
            className="flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Search
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="space-y-3">
          {/* Search Input */}
          <div className="relative">
            <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-light" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search saved searches..."
              className="w-full pl-9 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex items-center gap-3 flex-wrap">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="recent">Recently Used</option>
              <option value="name">Name A-Z</option>
              <option value="results">Most Results</option>
              <option value="created">Date Created</option>
            </select>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showFavoritesOnly}
                onChange={(e) => setShowFavoritesOnly(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-sm text-text">Favorites only</span>
            </label>
          </div>

          {/* Tags Filter */}
          {allTags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-text-light">Tags:</span>
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-2 py-1 text-xs rounded-lg transition-colors ${
                  selectedTag === null
                    ? 'bg-primary text-white'
                    : 'bg-surface-muted text-text-light hover:text-text'
                }`}
              >
                All
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                  className={`px-2 py-1 text-xs rounded-lg transition-colors ${
                    selectedTag === tag
                      ? 'bg-primary text-white'
                      : 'bg-surface-muted text-text-light hover:text-text'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Saved Searches List */}
      <div className="divide-y divide-border max-h-[60vh] overflow-y-auto">
        {filteredSearches.length === 0 ? (
          <div className="p-8 text-center">
            <BookmarkSimple className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h4 className="text-lg font-semibold text-text mb-2">
              {searchTerm ? 'No matching searches' : 'No saved searches yet'}
            </h4>
            <p className="text-text-light text-sm mb-4">
              {searchTerm 
                ? 'Try adjusting your search terms or filters'
                : 'Save your frequent searches to quickly access them later'
              }
            </p>
            <Link
              to="/search"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <MagnifyingGlass className="w-4 h-4" />
              Create Search
            </Link>
          </div>
        ) : (
          filteredSearches.map((search) => (
            <div key={search.id} className="p-4 hover:bg-surface-muted transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  {/* Search Name and Favorite */}
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-text truncate">{search.name}</h4>
                    <button
                      onClick={() => handleToggleFavorite(search.id)}
                      className={`transition-colors ${
                        search.favorite 
                          ? 'text-warning' 
                          : 'text-text-light hover:text-warning'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${search.favorite ? 'fill-current' : ''}`} />
                    </button>
                    {search.isAlert && (
                      <Bell className="w-4 h-4 text-info" />
                    )}
                  </div>

                  {/* Query Preview */}
                  <p className="text-sm text-text-light mb-2 truncate">
                    "{search.query}"
                  </p>

                  {/* Filters Preview */}
                  <p className="text-xs text-text-light mb-3 line-clamp-2">
                    {getFiltersPreview(search.filters)}
                  </p>

                  {/* Meta Information */}
                  <div className="flex items-center gap-4 text-xs text-text-light">
                    <span className="flex items-center gap-1">
                      <MagnifyingGlass className="w-3 h-3" />
                      {search.resultCount} results
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatRelativeTime(search.lastRun)}
                    </span>
                    {search.isAlert && (
                      <span className="flex items-center gap-1 text-info">
                        <Bell className="w-3 h-3" />
                        {search.alertFrequency}
                      </span>
                    )}
                  </div>

                  {/* Tags */}
                  {search.tags.length > 0 && (
                    <div className="flex gap-1 mt-2">
                      {search.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-lg"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 ml-4">
                  <button
                    onClick={() => handleRunSearch(search)}
                    className="p-2 text-text-light hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    title="Run search"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => handleToggleAlert(search.id, !search.isAlert)}
                    className={`p-2 rounded-lg transition-colors ${
                      search.isAlert
                        ? 'text-info hover:bg-info/10'
                        : 'text-text-light hover:text-info hover:bg-info/10'
                    }`}
                    title={search.isAlert ? "Disable alerts" : "Enable alerts"}
                  >
                    <Bell className={`w-4 h-4 ${search.isAlert ? 'fill-current' : ''}`} />
                  </button>
                  
                  <button
                    onClick={() => onEditSearch(search)}
                    className="p-2 text-text-light hover:text-warning hover:bg-warning/10 rounded-lg transition-colors"
                    title="Edit search"
                  >
                    <PencilSimple className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDelete(search.id)}
                    className="p-2 text-text-light hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                    title="Delete search"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {filteredSearches.length > 0 && (
        <div className="p-4 border-t border-border bg-surface-muted">
          <div className="flex items-center justify-between text-sm text-text-light">
            <span>
              Showing {filteredSearches.length} of {savedSearches.length} saved searches
            </span>
            <div className="flex items-center gap-2">
              <span>
                {savedSearches.filter(s => s.isAlert).length} alerts active
              </span>
              <span>•</span>
              <span>
                {savedSearches.filter(s => s.favorite).length} favorites
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default SavedSearches;