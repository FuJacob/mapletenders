import { api } from './index';

// Types for advanced search
export interface SearchFilters {
  query?: string;
  location?: {
    provinces?: string[];
    cities?: string[];
    regions?: string[];
  };
  financial?: {
    minValue?: number | null;
    maxValue?: number | null;
    currency?: string;
  };
  timeline?: {
    publishedAfter?: Date | null;
    closingBefore?: Date | null;
    contractStart?: Date | null;
  };
  categories?: {
    industries?: string[];
    procurementTypes?: string[];
    methods?: string[];
  };
  advanced?: {
    keywords?: string[];
    excludeKeywords?: string[];
    minimumMatchScore?: number;
    onlyRecommended?: boolean;
  };
}

export interface SavedSearch {
  id?: string;
  userId: string;
  name: string;
  query: string;
  filters: SearchFilters;
  isAlert: boolean;
  alertFrequency?: 'instant' | 'daily' | 'weekly';
  tags: string[];
  favorite: boolean;
  resultCount?: number;
  lastRun?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SearchResults {
  results: any[];
  total: number;
  hasMore: boolean;
  aggregations?: {
    categories: { [key: string]: number };
    locations: { [key: string]: number };
    valueRanges: { [key: string]: number };
    sources: { [key: string]: number };
  };
}

export interface SearchResponse {
  success: boolean;
  data: SearchResults;
  searchTime?: number;
}

/**
 * Advanced Search API
 */
export const searchAPI = {
  /**
   * Perform advanced tender search
   */
  async searchTenders(filters: SearchFilters, limit = 50, offset = 0): Promise<SearchResponse> {
    const params = new URLSearchParams();
    
    // Add basic parameters
    if (filters.query) params.append('q', filters.query);
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());

    // Add location filters
    if (filters.location?.provinces?.length) {
      filters.location.provinces.forEach(province => 
        params.append('provinces', province)
      );
    }
    if (filters.location?.cities?.length) {
      filters.location.cities.forEach(city => 
        params.append('cities', city)
      );
    }
    if (filters.location?.regions?.length) {
      filters.location.regions.forEach(region => 
        params.append('regions', region)
      );
    }

    // Add financial filters
    if (filters.financial?.minValue) {
      params.append('minValue', filters.financial.minValue.toString());
    }
    if (filters.financial?.maxValue) {
      params.append('maxValue', filters.financial.maxValue.toString());
    }
    if (filters.financial?.currency) {
      params.append('currency', filters.financial.currency);
    }

    // Add timeline filters
    if (filters.timeline?.publishedAfter) {
      params.append('publishedAfter', filters.timeline.publishedAfter.toISOString());
    }
    if (filters.timeline?.closingBefore) {
      params.append('closingBefore', filters.timeline.closingBefore.toISOString());
    }
    if (filters.timeline?.contractStart) {
      params.append('contractStart', filters.timeline.contractStart.toISOString());
    }

    // Add category filters
    if (filters.categories?.industries?.length) {
      filters.categories.industries.forEach(industry => 
        params.append('industries', industry)
      );
    }
    if (filters.categories?.procurementTypes?.length) {
      filters.categories.procurementTypes.forEach(type => 
        params.append('procurementTypes', type)
      );
    }
    if (filters.categories?.methods?.length) {
      filters.categories.methods.forEach(method => 
        params.append('methods', method)
      );
    }

    // Add advanced filters
    if (filters.advanced?.keywords?.length) {
      filters.advanced.keywords.forEach(keyword => 
        params.append('keywords', keyword)
      );
    }
    if (filters.advanced?.excludeKeywords?.length) {
      filters.advanced.excludeKeywords.forEach(keyword => 
        params.append('excludeKeywords', keyword)
      );
    }
    if (filters.advanced?.minimumMatchScore && filters.advanced.minimumMatchScore > 0.7) {
      params.append('minimumMatchScore', filters.advanced.minimumMatchScore.toString());
    }
    if (filters.advanced?.onlyRecommended) {
      params.append('onlyRecommended', 'true');
    }

    const response = await api.get(`/search?${params.toString()}`);
    return response.data;
  },

  /**
   * Get search aggregations for faceted navigation
   */
  async getSearchAggregations(filters?: SearchFilters): Promise<any> {
    const params = new URLSearchParams();
    
    if (filters?.query) params.append('q', filters.query);
    
    const response = await api.get(`/search/aggregations?${params.toString()}`);
    return response.data;
  },

  /**
   * Get search suggestions based on user history
   */
  async getSearchSuggestions(query: string): Promise<string[]> {
    const response = await api.get(`/search/suggestions?query=${encodeURIComponent(query)}`);
    return response.data.data;
  },

  /**
   * Save a search for the user
   */
  async saveSearch(searchData: Omit<SavedSearch, 'userId'>): Promise<SavedSearch> {
    const response = await api.post('/search/saved', searchData);
    return response.data.data;
  },

  /**
   * Get user's saved searches
   */
  async getSavedSearches(): Promise<SavedSearch[]> {
    const response = await api.get('/search/saved');
    return response.data.data;
  },

  /**
   * Update a saved search
   */
  async updateSavedSearch(searchId: string, updates: Partial<SavedSearch>): Promise<SavedSearch> {
    const response = await api.put(`/search/saved/${searchId}`, updates);
    return response.data.data;
  },

  /**
   * Delete a saved search
   */
  async deleteSavedSearch(searchId: string): Promise<void> {
    await api.delete(`/search/saved/${searchId}`);
  },

  /**
   * Run a saved search
   */
  async runSavedSearch(searchId: string): Promise<SearchResults> {
    const response = await api.post(`/search/saved/${searchId}/run`);
    return response.data.data;
  },
};

export default searchAPI;