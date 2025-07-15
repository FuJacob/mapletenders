import { Router } from "express";
import { scrapingController } from "../container";

const router = Router();

/**
 * Import Canadian government tenders from CSV
 * @route POST /scraping/canadian
 */
router.post("/canadian", (req, res) =>
  scrapingController.importCanadianTenders(req, res)
);

/**
 * Import Toronto tenders from City API
 * @route POST /scraping/toronto
 */
router.post("/toronto", (req, res) =>
  scrapingController.importTorontoTenders(req, res)
);

/**
 * Get Canadian tender import status
 * @route GET /scraping/canadian/status
 */
router.get("/canadian/status", (req, res) =>
  scrapingController.getCanadianImportStatus(req, res)
);

/**
 * Get Toronto tender import status
 * @route GET /scraping/toronto/status
 */
router.get("/toronto/status", (req, res) =>
  scrapingController.getTorontoImportStatus(req, res)
);

/**
 * Scrape Toronto tenders without importing (for testing)
 * @route GET /scraping/toronto/scrape
 */
router.get("/toronto/scrape", (req, res) =>
  scrapingController.scrapeTorontoTenders(req, res)
);

/**
 * Import Ontario tenders from Jaggaer Excel export
 * @route POST /scraping/ontario
 */
router.post("/ontario", (req, res) =>
  scrapingController.importOntarioTenders(req, res)
);

/**
 * Get Ontario tender import status
 * @route GET /scraping/ontario/status
 */
router.get("/ontario/status", (req, res) =>
  scrapingController.getOntarioImportStatus(req, res)
);

/**
 * Scrape Ontario tenders without importing (for testing)
 * @route GET /scraping/ontario/scrape
 */
router.get("/ontario/scrape", (req, res) =>
  scrapingController.scrapeOntarioTenders(req, res)
);

/**
 * Import Mississauga tenders from bidsandtenders.ca
 * @route POST /scraping/mississauga
 */
router.post("/mississauga", (req, res) =>
  scrapingController.importMississaugaTenders(req, res)
);

/**
 * Get Mississauga tender import status
 * @route GET /scraping/mississauga/status
 */
router.get("/mississauga/status", (req, res) =>
  scrapingController.getMississaugaImportStatus(req, res)
);

/**
 * Scrape Mississauga tenders without importing (for testing)
 * @route GET /scraping/mississauga/scrape
 */
router.get("/mississauga/scrape", (req, res) =>
  scrapingController.scrapeMississaugaTenders(req, res)
);

export default router;