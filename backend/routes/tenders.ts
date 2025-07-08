import { Router } from "express";
import { tenderController } from "../container";

const router = Router();

/**
 * Downloads open tender notices as CSV
 * @route GET /getOpenTenderNotices
 * @returns {File} CSV file containing tender notices
 */
router.get("/getOpenTenderNotices", (req, res) => tenderController.getOpenTenderNotices(req, res));

/**
 * Filters open tender notices and saves to database
 * @route GET /filterOpenTenderNotices
 * @param {string} req.query.search - The filtering criteria
 * @returns {Object[]} Filtered tender notices
 */
router.get("/filterOpenTenderNotices", (req, res) => tenderController.filterOpenTenderNotices(req, res));

/**
 * Fetches filtered tender notices from the database
 * @route GET /getFilteredTenderNoticesFromDB
 * @returns {Object[]} Array of filtered tender notices
 */
router.get("/getFilteredTenderNoticesFromDB", (req, res) => tenderController.getFilteredTenderNoticesFromDB(req, res));

/**
 * Downloads and imports tender notices CSV into database
 * @route POST /getOpenTenderNoticesToDB
 * @returns {string} Success message
 */
router.post("/getOpenTenderNoticesToDB", (req, res) => tenderController.getOpenTenderNoticesToDB(req, res));

/**
 * Fetches all open tender notices from database
 * @route GET /getOpenTenderNoticesFromDB
 * @returns {Object[]} Array of all tender notices
 */
router.get("/getOpenTenderNoticesFromDB", (req, res) => tenderController.getOpenTenderNoticesFromDB(req, res));

/**
 * Search tenders using vector similarity
 * @route POST /filterByVector
 * @param {string} req.body.query - The search query
 * @returns {Object[]} Array of matching tender notices
 */
router.post("/filterByVector", (req, res) => tenderController.filterByVector(req, res));

export default router;
