import { DatabaseService } from './databaseService';

const databaseService = new DatabaseService();
const supabase = (databaseService as any).supabase;

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

export class SearchService {
  /**
   * Perform advanced search with comprehensive filtering
   */
  async searchTenders(
    filters: SearchFilters,
    userId?: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<SearchResults> {
    try {
      let query = supabase
        .from('tenders_enhanced')
        .select('*', { count: 'exact' });

      // Apply text search
      if (filters.query) {
        query = query.or(
          `title.ilike.%${filters.query}%,description.ilike.%${filters.query}%,contracting_entity_name.ilike.%${filters.query}%`
        );
      }

      // Apply location filters
      if (filters.location?.provinces?.length) {
        query = query.in('contracting_entity_province', filters.location.provinces);
      }

      if (filters.location?.cities?.length) {
        query = query.in('contracting_entity_city', filters.location.cities);
      }

      // Apply financial filters
      if (filters.financial?.minValue) {
        query = query.gte('estimated_value_min', filters.financial.minValue);
      }

      if (filters.financial?.maxValue) {
        query = query.lte('estimated_value_min', filters.financial.maxValue);
      }

      // Apply timeline filters
      if (filters.timeline?.publishedAfter) {
        query = query.gte('published_date', filters.timeline.publishedAfter.toISOString());
      }

      if (filters.timeline?.closingBefore) {
        query = query.lte('closing_date', filters.timeline.closingBefore.toISOString());
      }

      // Apply category filters
      if (filters.categories?.industries?.length) {
        query = query.in('category_primary', filters.categories.industries);
      }

      if (filters.categories?.procurementTypes?.length) {
        query = query.in('procurement_type', filters.categories.procurementTypes);
      }

      if (filters.categories?.methods?.length) {
        query = query.in('procurement_method', filters.categories.methods);
      }

      // Apply advanced filters
      if (filters.advanced?.keywords?.length) {
        const keywordFilters = filters.advanced.keywords.map(keyword => 
          `title.ilike.%${keyword}%,description.ilike.%${keyword}%`
        ).join(',');
        query = query.or(keywordFilters);
      }

      if (filters.advanced?.excludeKeywords?.length) {
        filters.advanced.excludeKeywords.forEach(keyword => {
          query = query.not('title', 'ilike', `%${keyword}%`)
                      .not('description', 'ilike', `%${keyword}%`);
        });
      }

      // Only show open tenders by default
      query = query.eq('status', 'open');

      // Apply pagination
      query = query.range(offset, offset + limit - 1);

      // Order by relevance/date
      query = query.order('published_date', { ascending: false });

      const { data, error, count } = await query;

      if (error) {
        console.error('Error searching tenders:', error);
        throw error;
      }

      // Get aggregations for faceted search
      const aggregations = await this.getSearchAggregations(filters);

      return {
        results: data || [],
        total: count || 0,
        hasMore: (count || 0) > offset + limit,
        aggregations,
      };
    } catch (error) {
      console.error('Error in searchTenders:', error);
      throw new Error('Failed to search tenders');
    }
  }

  /**
   * Get search aggregations for faceted search
   */
  async getSearchAggregations(filters: SearchFilters): Promise<any> {
    try {
      // Get category counts
      const { data: categoryData } = await supabase
        .from('tenders_enhanced')
        .select('category_primary')
        .eq('status', 'open');

      // Get location counts
      const { data: locationData } = await supabase
        .from('tenders_enhanced')
        .select('contracting_entity_province')
        .eq('status', 'open');

      // Get source counts
      const { data: sourceData } = await supabase
        .from('tenders_enhanced')
        .select('source')
        .eq('status', 'open');

      // Aggregate the data
      const categories = this.aggregateField(categoryData, 'category_primary');
      const locations = this.aggregateField(locationData, 'contracting_entity_province');
      const sources = this.aggregateField(sourceData, 'source');

      // Value ranges (simplified)
      const valueRanges = {
        'under-50k': 0,
        '50k-100k': 0,
        '100k-500k': 0,
        '500k-1m': 0,
        '1m-5m': 0,
        'over-5m': 0,
      };

      return {
        categories,
        locations,
        valueRanges,
        sources,
      };
    } catch (error) {
      console.error('Error getting search aggregations:', error);
      return {
        categories: {},
        locations: {},
        valueRanges: {},
        sources: {},
      };
    }
  }

  /**
   * Helper to aggregate field values
   */
  private aggregateField(data: any[], field: string): { [key: string]: number } {
    const counts: { [key: string]: number } = {};
    
    data?.forEach(item => {
      const value = item[field];
      if (value) {
        counts[value] = (counts[value] || 0) + 1;
      }
    });

    // Sort by count and return top 20
    return Object.fromEntries(
      Object.entries(counts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 20)
    );
  }

  /**
   * Save a search for a user
   */
  async saveSearch(searchData: SavedSearch): Promise<SavedSearch> {
    try {
      const { data, error } = await supabase
        .from('saved_searches')
        .insert([
          {
            user_id: searchData.userId,
            name: searchData.name,
            query: searchData.query,
            filters: searchData.filters,
            is_alert: searchData.isAlert,
            alert_frequency: searchData.alertFrequency,
            tags: searchData.tags,
            favorite: searchData.favorite,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error saving search:', error);
        throw error;
      }

      return this.mapDatabaseToSavedSearch(data);
    } catch (error) {
      console.error('Error in saveSearch:', error);
      throw new Error('Failed to save search');
    }
  }

  /**
   * Get saved searches for a user
   */
  async getSavedSearches(userId: string): Promise<SavedSearch[]> {
    try {
      const { data, error } = await supabase
        .from('saved_searches')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error getting saved searches:', error);
        throw error;
      }

      return (data || []).map(this.mapDatabaseToSavedSearch);
    } catch (error) {
      console.error('Error in getSavedSearches:', error);
      throw new Error('Failed to get saved searches');
    }
  }

  /**
   * Update a saved search
   */
  async updateSavedSearch(
    searchId: string, 
    userId: string, 
    updates: Partial<SavedSearch>
  ): Promise<SavedSearch> {
    try {
      const { data, error } = await supabase
        .from('saved_searches')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', searchId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating saved search:', error);
        throw error;
      }

      return this.mapDatabaseToSavedSearch(data);
    } catch (error) {
      console.error('Error in updateSavedSearch:', error);
      throw new Error('Failed to update saved search');
    }
  }

  /**
   * Delete a saved search
   */
  async deleteSavedSearch(searchId: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('saved_searches')
        .delete()
        .eq('id', searchId)
        .eq('user_id', userId);

      if (error) {
        console.error('Error deleting saved search:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in deleteSavedSearch:', error);
      throw new Error('Failed to delete saved search');
    }
  }

  /**
   * Run a saved search and update last run time
   */
  async runSavedSearch(searchId: string, userId: string): Promise<SearchResults> {
    try {
      // Get the saved search
      const { data: searchData, error: searchError } = await supabase
        .from('saved_searches')
        .select('*')
        .eq('id', searchId)
        .eq('user_id', userId)
        .single();

      if (searchError || !searchData) {
        throw new Error('Saved search not found');
      }

      // Convert to SearchFilters and run search
      const results = await this.searchTenders(searchData.filters, userId);

      // Update last run time and result count
      await supabase
        .from('saved_searches')
        .update({
          last_run: new Date().toISOString(),
          result_count: results.total,
          updated_at: new Date().toISOString(),
        })
        .eq('id', searchId);

      return results;
    } catch (error) {
      console.error('Error running saved search:', error);
      throw new Error('Failed to run saved search');
    }
  }

  /**
   * Get search suggestions based on user history
   */
  async getSearchSuggestions(userId: string, query: string): Promise<string[]> {
    try {
      // Get recent searches from user activity log
      const { data, error } = await supabase
        .from('user_activity_log')
        .select('metadata')
        .eq('user_id', userId)
        .eq('action_type', 'search')
        .order('timestamp', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error getting search suggestions:', error);
        return [];
      }

      // Extract search queries from metadata
      const queries = data
        ?.map((activity: any) => activity.metadata?.query)
        .filter((q: any) => q && q.toLowerCase().includes(query.toLowerCase()))
        .filter((q: any, index: number, arr: any[]) => arr.indexOf(q) === index) // Remove duplicates
        .slice(0, 10) || [];

      return queries;
    } catch (error) {
      console.error('Error in getSearchSuggestions:', error);
      return [];
    }
  }

  /**
   * Track search performance for analytics
   */
  async trackSearchPerformance(
    searchId: string, 
    userId: string, 
    resultCount: number,
    searchTime: number
  ): Promise<void> {
    try {
      await supabase
        .from('search_performance')
        .insert([
          {
            search_id: searchId,
            user_id: userId,
            result_count: resultCount,
            search_time_ms: searchTime,
            timestamp: new Date().toISOString(),
          }
        ]);
    } catch (error) {
      console.error('Error tracking search performance:', error);
      // Don't throw - this is just for analytics
    }
  }

  /**
   * Map database row to SavedSearch object
   */
  private mapDatabaseToSavedSearch(data: any): SavedSearch {
    return {
      id: data.id,
      userId: data.user_id,
      name: data.name,
      query: data.query,
      filters: data.filters || {},
      isAlert: data.is_alert,
      alertFrequency: data.alert_frequency,
      tags: data.tags || [],
      favorite: data.favorite,
      resultCount: data.result_count,
      lastRun: data.last_run ? new Date(data.last_run) : undefined,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }
}

export const searchService = new SearchService();