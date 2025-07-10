import { Router } from "express";
import { profileController } from "../container";

const router = Router();

/**
 * Create or update user profile
 * @route POST /profile
 * @param {Object} req.body - Profile data including user ID
 * @returns {Object} Updated profile data
 */
router.post("/", (req, res) => {
  profileController.createOrUpdateProfile(req, res);
});

/**
 * Get user profile by ID
 * @route GET /profile/:userId
 * @param {string} req.params.userId - User ID
 * @returns {Object} Profile data
 */
router.get("/:userId", (req, res) => {
  profileController.getProfile(req, res);
});

export default router;
