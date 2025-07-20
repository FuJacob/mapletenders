import { Router } from "express";
import { tenderNoticeController } from "../container";
import { authenticateUser } from "../middleware/authenticateUser";

const router = Router();
router.use(authenticateUser);
/**
 * Fetches a specific tender notice by ID
 * @route GET /:id
 * @param {string} req.params.id - The ID of the tender notice
 * @returns {Object} Tender notice data
 */
router.get("/:id", (req, res) =>
  tenderNoticeController.getTenderNoticeById(req, res)
);

export default router;
