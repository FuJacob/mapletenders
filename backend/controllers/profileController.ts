import { Request, Response } from "express";
import { DatabaseService } from "../services";
import type { Database } from "../database.types";

export class ProfileController {
  constructor(private databaseService: DatabaseService) {}

  createOrUpdateProfile = async (req: Request, res: Response) => {
    try {
      const profileData:
        | Database["public"]["Tables"]["profiles"]["Insert"]
        | Database["public"]["Tables"]["profiles"]["Update"] = req.body;

      if (!profileData.id) {
        return res.status(400).json({
          error: "User ID is required",
        });
      }

      // Add timestamp
      profileData.updated_at = new Date().toISOString();

      const data = await this.databaseService.createOrUpdateProfile(
        profileData
      );
      res.json(data);
    } catch (error: any) {
      console.error("Error in createOrUpdateProfile:", error);
      res
        .status(500)
        .json({ error: error.message || "Failed to save profile" });
    }
  };

  getProfile = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          error: "User ID is required",
        });
      }

      const profile = await this.databaseService.getProfile(userId);
      res.json(profile);
    } catch (error: any) {
      console.error("Error in getProfile:", error);
      res.status(500).json({ error: error.message || "Failed to get profile" });
    }
  };
}
