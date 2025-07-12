import { Router } from "express";
import { tenderController } from "../container";

const router = Router();

/**
 * Refresh tender data (rate limited to once per 24 hours)
 * @route POST /refreshTenders
 * @returns {Object} Refresh operation result
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

/**
 * Downloads open tender notices as CSV
 * @route GET /getOpenTenderNotices
 * @returns {File} CSV file containing tender notices
 */
router.get("/getOpenTenderNotices", (req, res) =>
  tenderController.getOpenTenderNotices(req, res)
);

/**
 * Downloads and imports tender notices CSV into database
 * @route POST /getOpenTenderNoticesToDB
 * @returns {string} Success message
 */
router.post("/getOpenTenderNoticesToDB", (req, res) =>
  tenderController.getOpenTenderNoticesToDB(req, res)
);

/**
 * Fetches all open tender notices from database
 * @route GET /getOpenTenderNoticesFromDB
 * @returns {Object[]} Array of all tender notices
 */
router.get("/getOpenTenderNoticesFromDB", (req, res) =>
  tenderController.getOpenTenderNoticesFromDB(req, res)
);

/**
 * Search tenders using vector similarity
 * @route POST /filterByVector
 * @param {string} req.body.query - The search query
 * @returns {Object[]} Array of matching tender notices
 */
router.post("/filterByVector", (req, res) =>
  tenderController.filterByVector(req, res)
);

export default router;
