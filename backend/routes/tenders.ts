import { Router } from "express";
import { tenderController } from "../container";
import { authenticateUser } from "../middleware/authenticateUser";

const router = Router();
router.use(authenticateUser);
/**
 * Get recommended tenders based on user profile
 * @route GET /recommended
 * @returns {Object} Recommended tenders for the authenticated user
 */
router.get("/recommended", (req, res) =>
  tenderController.getRecommendedTenders(req, res)
);

/**
 * Get all bookmarks
 * @route GET /bookmarks
 * @returns {Object} All bookmarks
 */
router.get("/bookmarks", (req, res) =>
  tenderController.getAllBookmarks(req, res)
);

/**
 * Refresh tender data (rate limited to once per 24 hours)
 * @route POST /refreshTenders
 * @returns {Object} Refresh operation result
 */
router.post("/refreshTenders", (req, res) =>
  tenderController.refreshTenders(req, res)
);

router.get("/getTenderById/:id", (req, res) =>
  tenderController.getTenderById(req, res)
);

router.post("/getTendersFromBookmarkIds", (req, res) =>
  tenderController.getTendersFromBookmarkIds(req, res)
);

/**
 * Search tenders using AI-powered Elasticsearch with vector similarity
 * @route POST /searchTenders
 * @param {string} req.body.q - The search query (required)
 * @param {string[]} req.body.regions - Optional array of regions to filter by
 * @param {string} req.body.procurement_method - Optional procurement method filter
 * @param {string} req.body.closing_date_after - Optional date filter (YYYY-MM-DD format)
 * @param {number} req.body.limit - Optional limit for results (default: 20)
 * @returns {SearchTendersResponse} Object containing results array, total_results, query, and search_metadata
 * @description Each result includes search_score (relevance ranking) and match_explanation (why it matched)
 */
router.post("/searchTenders", (req, res) =>
  tenderController.searchTenders(req, res)
);

/**
 * Manually sync all tenders to Elasticsearch
 * @route POST /syncToElasticsearch
 * @returns {Object} Sync operation result
 */
router.post("/syncToElasticsearch", (req, res) =>
  tenderController.syncToElasticsearch(req, res)
);

/**
 * Manually sync a single tender to Elasticsearch
 * @route POST /syncTender/:tenderId
 * @param {string} tenderId - The ID of the tender to sync
 * @returns {Object} Sync operation result
 */
router.post("/syncTender/:tenderId", (req, res) =>
  tenderController.syncSingleTenderToElasticsearch(req, res)
);

export default router;
