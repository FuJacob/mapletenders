import { Router } from "express";
import { bookmarkController } from "../container";

const router = Router();

// Create or update a bookmark
router.post("/", (req, res) => {
  bookmarkController.createBookmark(req, res);
});

// Remove a bookmark
router.delete("/:userId/:tenderNoticeId", (req, res) => {
  bookmarkController.removeBookmark(req, res);
});

// Get user's bookmarks
router.get("/user/:userId", (req, res) => {
  bookmarkController.getUserBookmarks(req, res);
});

// Update bookmark notes
router.put("/:userId/:tenderNoticeId/notes", (req, res) => {
  bookmarkController.updateBookmarkNotes(req, res);
});

// Check if tender is bookmarked by user
router.get("/:userId/:tenderNoticeId/status", (req, res) => {
  bookmarkController.checkBookmarkStatus(req, res);
});

export default router;
