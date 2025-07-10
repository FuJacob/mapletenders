import { Request, Response } from "express";
import { DatabaseService } from "../services";
import type { Database } from "../database.types";

export class BookmarkController {
  constructor(private databaseService: DatabaseService) {}

  createBookmark = async (req: Request, res: Response) => {
    try {
      const { userId, tenderNoticeId, notes } = req.body;

      if (!userId || !tenderNoticeId) {
        return res.status(400).json({
          error: "User ID and tender notice ID are required"
        });
      }

      const data = await this.databaseService.createBookmark(userId, tenderNoticeId, notes);
      res.json({ success: true, bookmark: data[0] });
    } catch (error: any) {
      console.error("Error in createBookmark:", error);
      res.status(500).json({ error: error.message || "Failed to create bookmark" });
    }
  };

  removeBookmark = async (req: Request, res: Response) => {
    try {
      const { userId, tenderNoticeId } = req.params;

      if (!userId || !tenderNoticeId) {
        return res.status(400).json({
          error: "User ID and tender notice ID are required"
        });
      }

      const data = await this.databaseService.removeBookmark(userId, tenderNoticeId);
      res.json({ success: true, removed: data.length > 0 });
    } catch (error: any) {
      console.error("Error in removeBookmark:", error);
      res.status(500).json({ error: error.message || "Failed to remove bookmark" });
    }
  };

  getUserBookmarks = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          error: "User ID is required"
        });
      }

      const bookmarks = await this.databaseService.getUserBookmarks(userId);
      res.json({ bookmarks });
    } catch (error: any) {
      console.error("Error in getUserBookmarks:", error);
      res.status(500).json({ error: error.message || "Failed to fetch bookmarks" });
    }
  };

  updateBookmarkNotes = async (req: Request, res: Response) => {
    try {
      const { userId, tenderNoticeId } = req.params;
      const { notes } = req.body;

      if (!userId || !tenderNoticeId) {
        return res.status(400).json({
          error: "User ID and tender notice ID are required"
        });
      }

      const data = await this.databaseService.updateBookmarkNotes(userId, tenderNoticeId, notes);
      res.json({ success: true, bookmark: data[0] });
    } catch (error: any) {
      console.error("Error in updateBookmarkNotes:", error);
      res.status(500).json({ error: error.message || "Failed to update bookmark notes" });
    }
  };

  checkBookmarkStatus = async (req: Request, res: Response) => {
    try {
      const { userId, tenderNoticeId } = req.params;

      if (!userId || !tenderNoticeId) {
        return res.status(400).json({
          error: "User ID and tender notice ID are required"
        });
      }

      const isBookmarked = await this.databaseService.isBookmarked(userId, tenderNoticeId);
      res.json({ isBookmarked });
    } catch (error: any) {
      console.error("Error in checkBookmarkStatus:", error);
      res.status(500).json({ error: error.message || "Failed to check bookmark status" });
    }
  };
}
