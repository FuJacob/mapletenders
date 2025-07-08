import { Router } from "express";
import { createClient } from "@supabase/supabase-js";

const router = Router();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_KEY || ""
);

/**
 * Fetches a specific tender notice by ID
 * @route GET /:id
 * @param {string} req.params.id - The ID of the tender notice
 * @returns {Object} Tender notice data
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from("tenders")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      console.error("Error fetching tender notice:", error);
      res.status(500).json({ error: "Failed to fetch tender notice" });
      return;
    }
    res.json(data);
  } catch (error) {
    console.error("Error fetching tender notice:", error);
    res.status(500).json({ error: "Failed to fetch tender notice" });
  }
});

export default router;
