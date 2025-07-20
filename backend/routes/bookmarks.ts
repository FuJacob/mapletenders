import { Router } from "express";
import { bookmarkController } from "../container";

const router = Router();

router.get("/:userId/count", (req, res) => {
  bookmarkController.getNumberOfBookmarks(req, res);
});

/**
 * @route POST /bookmarks
 * @desc Create or update a bookmark for a tender notice
 * @access Public
 * @param {Object} req.body - The bookmark data
 * @param {string} req.body.userId - User ID creating the bookmark
 * @param {string} req.body.tenderNoticeId - Tender notice ID to bookmark
 * @param {string} [req.body.notes] - Optional notes for the bookmark
 * @param {string} [req.body.status] - Bookmark status (default: "active")
 * @returns {Object} res.json - Success message and bookmark data
 * @example
 * POST /bookmarks
 * {
 *   "userId": "uuid-123",
 *   "tenderNoticeId": "tender-456",
 *   "notes": "Interesting opportunity"
 * }
 */
router.post("/", (req, res) => {
  bookmarkController.createBookmark(req, res);
});

/**
 * @route DELETE /bookmarks/:userId/:tenderNoticeId
 * @desc Remove a bookmark for a specific user and tender notice
 * @access Public
 * @param {string} req.params.userId - User ID who owns the bookmark
 * @param {string} req.params.tenderNoticeId - Tender notice ID to remove bookmark from
 * @returns {Object} res.json - Success message confirming bookmark removal
 * @example
 * DELETE /bookmarks/uuid-123/tender-456
 */
router.delete("/:userId/:tenderNoticeId", (req, res) => {
  bookmarkController.removeBookmark(req, res);
});

/**
 * @route GET /bookmarks/user/:userId
 * @desc Get all bookmarks for a specific user
 * @access Public
 * @param {string} req.params.userId - User ID to fetch bookmarks for
 * @returns {Array} res.json - Array of bookmark objects with tender details
 * @example
 * GET /bookmarks/user/uuid-123
 * Response: [
 *   {
 *     "id": "bookmark-1",
 *     "userId": "uuid-123",
 *     "tenderNoticeId": "tender-456",
 *     "notes": "Good opportunity",
 *     "status": "active",
 *     "createdAt": "2024-01-15T10:00:00Z"
 *   }
 * ]
 */
router.get("/user/:userId", (req, res) => {
  bookmarkController.getUserBookmarks(req, res);
});

/**
 * @route PUT /bookmarks/:userId/:tenderNoticeId/notes
 * @desc Update notes for an existing bookmark
 * @access Public
 * @param {string} req.params.userId - User ID who owns the bookmark
 * @param {string} req.params.tenderNoticeId - Tender notice ID of the bookmark
 * @param {Object} req.body - The updated notes data
 * @param {string} req.body.notes - New notes content for the bookmark
 * @returns {Object} res.json - Success message and updated bookmark data
 * @example
 * PUT /bookmarks/uuid-123/tender-456/notes
 * {
 *   "notes": "Updated notes about this tender"
 * }
 */
router.put("/:userId/:tenderNoticeId/notes", (req, res) => {
  bookmarkController.updateBookmarkNotes(req, res);
});

/**
 * @route GET /bookmarks/:userId/:tenderNoticeId/status
 * @desc Check if a tender notice is bookmarked by a specific user
 * @access Public
 * @param {string} req.params.userId - User ID to check bookmarks for
 * @param {string} req.params.tenderNoticeId - Tender notice ID to check
 * @returns {Object} res.json - Bookmark status and data if exists
 * @example
 * GET /bookmarks/uuid-123/tender-456/status
 * Response: {
 *   "isBookmarked": true,
 *   "bookmark": {
 *     "id": "bookmark-1",
 *     "notes": "Good opportunity",
 *     "status": "active"
 *   }
 * }
 */
router.get("/:userId/:tenderNoticeId/status", (req, res) => {
  bookmarkController.checkBookmarkStatus(req, res);
});

export default router;
