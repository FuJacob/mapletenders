import { Router } from "express";
import { tenderController } from "../container";

const router = Router();

/**
 * Downloads open tender notices as CSV
 * @route GET /getOpenTenderNotices
 * @returns {File} CSV file containing tender notices
 */
router.get("/getOpenTenderNotices", tenderController.getOpenTenderNotices);

/**
 * Filters open tender notices and saves to database
 * @route GET /filterOpenTenderNotices
 * @param {string} req.query.search - The filtering criteria
 * @returns {Object[]} Filtered tender notices
 */
router.get("/filterOpenTenderNotices", tenderController.filterOpenTenderNotices);

/**
 * Fetches filtered tender notices from the database
 * @route GET /getFilteredTenderNoticesFromDB
 * @returns {Object[]} Array of filtered tender notices
 */
router.get("/getFilteredTenderNoticesFromDB", tenderController.getFilteredTenderNoticesFromDB);

/**
 * Downloads and imports tender notices CSV into database
 * @route POST /getOpenTenderNoticesToDB
 * @returns {string} Success message
 */
router.post("/getOpenTenderNoticesToDB", tenderController.getOpenTenderNoticesToDB);

/**
 * Fetches all open tender notices from database
 * @route GET /getOpenTenderNoticesFromDB
 * @returns {Object[]} Array of all tender notices
 */
router.get("/getOpenTenderNoticesFromDB", tenderController.getOpenTenderNoticesFromDB);

/**
 * Search tenders using vector similarity
 * @route POST /filterByVector
 * @param {string} req.body.query - The search query
 * @returns {Object[]} Array of matching tender notices
 */
router.post("/filterByVector", tenderController.filterByVector);

export default router;
