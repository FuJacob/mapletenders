import { Request, Response } from 'express';
import { searchService } from '../services/searchService';
import type { SearchFilters, SavedSearch } from '../services/searchService';

/**
 * Advanced Search Controller
 * Handles advanced search with comprehensive filtering
 */
export class SearchController {
  /**
   * Perform advanced tender search
   */
  async searchTenders(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { 
        limit = 50, 
        offset = 0,
        ...filters 
      } = req.query;

      // Convert query parameters to SearchFilters format
      const searchFilters: SearchFilters = {
        query: filters.q as string || '',
        location: {
          provinces: Array.isArray(filters.provinces) ? filters.provinces as string[] : 
                    filters.provinces ? [filters.provinces as string] : [],
          cities: Array.isArray(filters.cities) ? filters.cities as string[] : 
                 filters.cities ? [filters.cities as string] : [],
          regions: Array.isArray(filters.regions) ? filters.regions as string[] : 
                  filters.regions ? [filters.regions as string] : [],
        },
        financial: {
          minValue: filters.minValue ? Number(filters.minValue) : null,
          maxValue: filters.maxValue ? Number(filters.maxValue) : null,
          currency: filters.currency as string || 'CAD',
        },
        timeline: {
          publishedAfter: filters.publishedAfter ? new Date(filters.publishedAfter as string) : null,
          closingBefore: filters.closingBefore ? new Date(filters.closingBefore as string) : null,
          contractStart: filters.contractStart ? new Date(filters.contractStart as string) : null,
        },
        categories: {
          industries: Array.isArray(filters.industries) ? filters.industries as string[] : 
                     filters.industries ? [filters.industries as string] : [],
          procurementTypes: Array.isArray(filters.procurementTypes) ? filters.procurementTypes as string[] : 
                           filters.procurementTypes ? [filters.procurementTypes as string] : [],
          methods: Array.isArray(filters.methods) ? filters.methods as string[] : 
                  filters.methods ? [filters.methods as string] : [],
        },
        advanced: {
          keywords: Array.isArray(filters.keywords) ? filters.keywords as string[] : 
                   filters.keywords ? [filters.keywords as string] : [],
          excludeKeywords: Array.isArray(filters.excludeKeywords) ? filters.excludeKeywords as string[] : 
                          filters.excludeKeywords ? [filters.excludeKeywords as string] : [],
          minimumMatchScore: filters.minimumMatchScore ? Number(filters.minimumMatchScore) : 0.7,
          onlyRecommended: filters.onlyRecommended === 'true',
        },
      };

      const startTime = Date.now();
      const results = await searchService.searchTenders(
        searchFilters,
        userId,
        Number(limit),
        Number(offset)
      );
      const searchTime = Date.now() - startTime;

      // Track search performance
      if (userId) {
        await searchService.trackSearchPerformance(
          'advanced_search',
          userId,
          results.total,
          searchTime
        );
      }

      res.json({
        success: true,
        data: results,
        searchTime,
      });
    } catch (error) {
      console.error('Error in searchTenders:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to search tenders',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get search aggregations for faceted navigation
   */
  async getSearchAggregations(req: Request, res: Response): Promise<void> {
    try {
      const filters = req.query as Partial<SearchFilters>;
      const aggregations = await searchService.getSearchAggregations(filters as SearchFilters);

      res.json({
        success: true,
        data: aggregations,
      });
    } catch (error) {
      console.error('Error getting search aggregations:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get search aggregations',
      });
    }
  }

  /**
   * Save a search for the user
   */
  async saveSearch(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const searchData: Omit<SavedSearch, 'userId'> = req.body;

      if (!searchData.name || !searchData.query) {
        res.status(400).json({
          success: false,
          error: 'Search name and query are required',
        });
        return;
      }

      const savedSearch = await searchService.saveSearch({
        ...searchData,
        userId,
      });

      res.json({
        success: true,
        data: savedSearch,
      });
    } catch (error) {
      console.error('Error saving search:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to save search',
      });
    }
  }

  /**
   * Get saved searches for the user
   */
  async getSavedSearches(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const savedSearches = await searchService.getSavedSearches(userId);

      res.json({
        success: true,
        data: savedSearches,
      });
    } catch (error) {
      console.error('Error getting saved searches:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get saved searches',
      });
    }
  }

  /**
   * Update a saved search
   */
  async updateSavedSearch(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { searchId } = req.params;
      const updates = req.body;

      const updatedSearch = await searchService.updateSavedSearch(
        searchId,
        userId,
        updates
      );

      res.json({
        success: true,
        data: updatedSearch,
      });
    } catch (error) {
      console.error('Error updating saved search:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update saved search',
      });
    }
  }

  /**
   * Delete a saved search
   */
  async deleteSavedSearch(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { searchId } = req.params;

      await searchService.deleteSavedSearch(searchId, userId);

      res.json({
        success: true,
        message: 'Search deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting saved search:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete saved search',
      });
    }
  }

  /**
   * Run a saved search
   */
  async runSavedSearch(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { searchId } = req.params;

      const results = await searchService.runSavedSearch(searchId, userId);

      res.json({
        success: true,
        data: results,
      });
    } catch (error) {
      console.error('Error running saved search:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to run saved search',
      });
    }
  }

  /**
   * Get search suggestions based on user history
   */
  async getSearchSuggestions(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { query } = req.query;

      if (!query || typeof query !== 'string') {
        res.status(400).json({
          success: false,
          error: 'Query parameter is required',
        });
        return;
      }

      const suggestions = await searchService.getSearchSuggestions(userId, query);

      res.json({
        success: true,
        data: suggestions,
      });
    } catch (error) {
      console.error('Error getting search suggestions:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get search suggestions',
      });
    }
  }
}

export const searchController = new SearchController();