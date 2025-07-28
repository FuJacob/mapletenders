import express from 'express';
import { searchController } from '../controllers/searchController';
import { authenticateUser } from '../middleware/authenticateUser';

const router = express.Router();

// Apply authentication middleware to all search routes
router.use(authenticateUser);

/**
 * Advanced Search Routes
 */

// GET /api/search - Perform advanced tender search
router.get('/', searchController.searchTenders.bind(searchController));

// GET /api/search/aggregations - Get search aggregations for faceted navigation
router.get('/aggregations', searchController.getSearchAggregations.bind(searchController));

// GET /api/search/suggestions - Get search suggestions based on user history
router.get('/suggestions', searchController.getSearchSuggestions.bind(searchController));

/**
 * Saved Search Routes
 */

// GET /api/search/saved - Get user's saved searches
router.get('/saved', searchController.getSavedSearches.bind(searchController));

// POST /api/search/saved - Save a new search
router.post('/saved', searchController.saveSearch.bind(searchController));

// PUT /api/search/saved/:searchId - Update a saved search
router.put('/saved/:searchId', searchController.updateSavedSearch.bind(searchController));

// DELETE /api/search/saved/:searchId - Delete a saved search
router.delete('/saved/:searchId', searchController.deleteSavedSearch.bind(searchController));

// POST /api/search/saved/:searchId/run - Run a saved search
router.post('/saved/:searchId/run', searchController.runSavedSearch.bind(searchController));

export default router;