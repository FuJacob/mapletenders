import { Request, Response } from "express";
import { ScrapingService } from "../services/scrapingService";

export class ScrapingController {
  constructor(private scrapingService: ScrapingService) {}

  /**
   * Import Canadian government tenders from CSV
   * @route POST /scraping/canadian
   */
  importCanadianTenders = async (req: Request, res: Response) => {
    try {
      console.log("Starting Canadian tender import...");

      const result = await this.scrapingService.importCanadianTenders();
      res.json(result);
    } catch (error: any) {
      console.error("Error importing Canadian tenders:", error);
      res.status(500).json({
        error: "Failed to import Canadian tenders",
        details: error.message,
      });
    }
  };

  /**
   * Import Quebec tenders from SEAO API
   * @route POST /scraping/quebec
   */
  importQuebecTenders = async (req: Request, res: Response) => {
    try {
      console.log("Starting Quebec tender import...");

      const result = await this.scrapingService.importQuebecTenders();

      console.log("Quebec tenders imported successfully:", result);
      res.json(result);
    } catch (error: any) {
      console.error("Error importing Quebec tenders:", error);
      res.status(500).json({
        error: "Failed to import Quebec tenders",
        details: error.message,
      });
    }
  };
  /**
   * Import Toronto tenders from City API
   * @route POST /scraping/toronto
   */
  importTorontoTenders = async (req: Request, res: Response) => {
    try {
      console.log("Starting Toronto tender import...");

      const result = await this.scrapingService.importTorontoTenders();

      console.log("Toronto tenders imported successfully:", result);
      res.json(result);
    } catch (error: any) {
      console.error("Error importing Toronto tenders:", error);
      res.status(500).json({
        error: "Failed to import Toronto tenders",
        details: error.message,
      });
    }
  };

  /**
   * Get Canadian tender import status
   * @route GET /scraping/canadian/status
   */
  getCanadianImportStatus = async (req: Request, res: Response) => {
    try {
      const status = await this.scrapingService.getCanadianImportStatus();
      res.json(status);
    } catch (error: any) {
      console.error("Error getting Canadian import status:", error);
      res.status(500).json({
        error: "Failed to get import status",
        details: error.message,
      });
    }
  };

  /**
   * Get Toronto tender import status
   * @route GET /scraping/toronto/status
   */
  getTorontoImportStatus = async (req: Request, res: Response) => {
    try {
      const status = await this.scrapingService.getTorontoImportStatus();
      res.json(status);
    } catch (error: any) {
      console.error("Error getting Toronto import status:", error);
      res.status(500).json({
        error: "Failed to get import status",
        details: error.message,
      });
    }
  };

  /**
   * Scrape Toronto tenders without importing (for testing)
   * @route GET /scraping/toronto/scrape
   */
  scrapeTorontoTenders = async (req: Request, res: Response) => {
    try {
      console.log("Scraping Toronto tenders (test mode)...");

      const tenders = await this.scrapingService.scrapeTorontoTenders();

      res.json({
        message: "Toronto tenders scraped successfully",
        count: tenders.length,
        data: tenders,
      });
    } catch (error: any) {
      console.error("Error scraping Toronto tenders:", error);
      res.status(500).json({
        error: "Failed to scrape Toronto tenders",
        details: error.message,
      });
    }
  };

  /**
   * Import Ontario tenders from Jaggaer Excel export
   * @route POST /scraping/ontario
   */
  importOntarioTenders = async (req: Request, res: Response) => {
    try {
      console.log("Starting Ontario tender import...");

      const result = await this.scrapingService.importOntarioTenders();

      console.log("Ontario tenders imported successfully:", result);
      res.json(result);
    } catch (error: any) {
      console.error("Error importing Ontario tenders:", error);
      res.status(500).json({
        error: "Failed to import Ontario tenders",
        details: error.message,
      });
    }
  };

  /**
   * Get Ontario tender import status
   * @route GET /scraping/ontario/status
   */
  getOntarioImportStatus = async (req: Request, res: Response) => {
    try {
      const status = await this.scrapingService.getOntarioImportStatus();
      res.json(status);
    } catch (error: any) {
      console.error("Error getting Ontario import status:", error);
      res.status(500).json({
        error: "Failed to get import status",
        details: error.message,
      });
    }
  };

  /**
   * Scrape Ontario tenders without importing (for testing)
   * @route GET /scraping/ontario/scrape
   */
  scrapeOntarioTenders = async (req: Request, res: Response) => {
    try {
      console.log("Scraping Ontario tenders (test mode)...");

      const tenders = await this.scrapingService.scrapeOntarioTenders();

      res.json({
        message: "Ontario tenders scraped successfully",
        count: tenders.length,
        data: tenders,
      });
    } catch (error: any) {
      console.error("Error scraping Ontario tenders:", error);
      res.status(500).json({
        error: "Failed to scrape Ontario tenders",
        details: error.message,
      });
    }
  };

  /**
   * Import Mississauga tenders from bidsandtenders.ca
   * @route POST /scraping/mississauga
   */
  importMississaugaTenders = async (req: Request, res: Response) => {
    try {
      console.log("Starting Mississauga tender import...");

      const result = await this.scrapingService.importMississaugaTenders();

      console.log("Mississauga tenders imported successfully:", result);
      res.json(result);
    } catch (error: any) {
      console.error("Error importing Mississauga tenders:", error);
      res.status(500).json({
        error: "Failed to import Mississauga tenders",
        details: error.message,
      });
    }
  };

  /**
   * Get Mississauga tender import status
   * @route GET /scraping/mississauga/status
   */
  getMississaugaImportStatus = async (req: Request, res: Response) => {
    try {
      const status = await this.scrapingService.getMississaugaImportStatus();
      res.json(status);
    } catch (error: any) {
      console.error("Error getting Mississauga import status:", error);
      res.status(500).json({
        error: "Failed to get import status",
        details: error.message,
      });
    }
  };

  /**
   * Get Quebec tender import status
   * @route GET /scraping/quebec/status
   */
  getQuebecImportStatus = async (req: Request, res: Response) => {
    try {
      const status = await this.scrapingService.getQuebecImportStatus();
      res.json(status);
    } catch (error: any) {
      console.error("Error getting Quebec import status:", error);
      res.status(500).json({
        error: "Failed to get import status",
        details: error.message,
      });
    }
  };

  /**
   * Scrape Quebec tenders without importing (for testing)
   * @route GET /scraping/quebec/scrape
   */
  scrapeQuebecTenders = async (req: Request, res: Response) => {
    try {
      console.log("Scraping Quebec tenders (test mode)...");

      const tenders = await this.scrapingService.scrapeQuebecTenders();

      res.json({
        message: "Quebec tenders scraped successfully",
        count: tenders.length,
        data: tenders,
      });
    } catch (error: any) {
      console.error("Error scraping Quebec tenders:", error);
      res.status(500).json({
        error: "Failed to scrape Quebec tenders",
        details: error.message,
      });
    }
  };

  /**
   * Scrape Mississauga tenders without importing (for testing)
   * @route GET /scraping/mississauga/scrape
   */
  scrapeMississaugaTenders = async (req: Request, res: Response) => {
    try {
      console.log("Scraping Mississauga tenders (test mode)...");

      const tenders = await this.scrapingService.scrapeMississaugaTenders();

      res.json({
        message: "Mississauga tenders scraped successfully",
        count: tenders.length,
        data: tenders,
      });
    } catch (error: any) {
      console.error("Error scraping Mississauga tenders:", error);
      res.status(500).json({
        error: "Failed to scrape Mississauga tenders",
        details: error.message,
      });
    }
  };

  /**
   * Import Brampton tenders from bidsandtenders.ca
   * @route POST /scraping/brampton
   */
  importBramptonTenders = async (req: Request, res: Response) => {
    try {
      console.log("Starting Brampton tender import...");

      const result = await this.scrapingService.importBramptonTenders();

      console.log("Brampton tenders imported successfully:", result);
      res.json(result);
    } catch (error: any) {
      console.error("Error importing Brampton tenders:", error);
      res.status(500).json({
        error: "Failed to import Brampton tenders",
        details: error.message,
      });
    }
  };

  /**
   * Get Brampton tender import status
   * @route GET /scraping/brampton/status
   */
  getBramptonImportStatus = async (req: Request, res: Response) => {
    try {
      const status = await this.scrapingService.getBramptonImportStatus();
      res.json(status);
    } catch (error: any) {
      console.error("Error getting Brampton import status:", error);
      res.status(500).json({
        error: "Failed to get import status",
        details: error.message,
      });
    }
  };

  /**
   * Scrape Brampton tenders without importing (for testing)
   * @route GET /scraping/brampton/scrape
   */
  scrapeBramptonTenders = async (req: Request, res: Response) => {
    try {
      console.log("Scraping Brampton tenders (test mode)...");

      const tenders = await this.scrapingService.scrapeBramptonTenders();

      res.json({
        message: "Brampton tenders scraped successfully",
        count: tenders.length,
        data: tenders,
      });
    } catch (error: any) {
      console.error("Error scraping Brampton tenders:", error);
      res.status(500).json({
        error: "Failed to scrape Brampton tenders",
        details: error.message,
      });
    }
  };

  /**
   * Import Hamilton tenders from bidsandtenders.ca
   * @route POST /scraping/hamilton
   */
  importHamiltonTenders = async (_req: Request, res: Response) => {
    try {
      console.log("Starting Hamilton tender import...");

      const result = await this.scrapingService.importHamiltonTenders();

      console.log("Hamilton tenders imported successfully:", result);
      res.json(result);
    } catch (error: any) {
      console.error("Error importing Hamilton tenders:", error);
      res.status(500).json({
        error: "Failed to import Hamilton tenders",
        details: error.message,
      });
    }
  };

  /**
   * Get Hamilton tender import status
   * @route GET /scraping/hamilton/status
   */
  getHamiltonImportStatus = async (_req: Request, res: Response) => {
    try {
      const status = await this.scrapingService.getHamiltonImportStatus();
      res.json(status);
    } catch (error: any) {
      console.error("Error getting Hamilton import status:", error);
      res.status(500).json({
        error: "Failed to get import status",
        details: error.message,
      });
    }
  };

  /**
   * Scrape Hamilton tenders without importing (for testing)
   * @route GET /scraping/hamilton/scrape
   */
  scrapeHamiltonTenders = async (_req: Request, res: Response) => {
    try {
      console.log("Scraping Hamilton tenders (test mode)...");

      const tenders = await this.scrapingService.scrapeHamiltonTenders();

      res.json({
        message: "Hamilton tenders scraped successfully",
        count: tenders.length,
        data: tenders,
      });
    } catch (error: any) {
      console.error("Error scraping Hamilton tenders:", error);
      res.status(500).json({
        error: "Failed to scrape Hamilton tenders",
        details: error.message,
      });
    }
  };

  /**
   * Import London tenders from bidsandtenders.ca
   * @route POST /scraping/london
   */
  importLondonTenders = async (_req: Request, res: Response) => {
    try {
      console.log("Starting London tender import...");

      const result = await this.scrapingService.importLondonTenders();

      console.log("London tenders imported successfully:", result);
      res.json(result);
    } catch (error: any) {
      console.error("Error importing London tenders:", error);
      res.status(500).json({
        error: "Failed to import London tenders",
        details: error.message,
      });
    }
  };

  /**
   * Get London tender import status
   * @route GET /scraping/london/status
   */
  getLondonImportStatus = async (_req: Request, res: Response) => {
    try {
      const status = await this.scrapingService.getLondonImportStatus();
      res.json(status);
    } catch (error: any) {
      console.error("Error getting London import status:", error);
      res.status(500).json({
        error: "Failed to get import status",
        details: error.message,
      });
    }
  };

  /**
   * Scrape London tenders without importing (for testing)
   * @route GET /scraping/london/scrape
   */
  scrapeLondonTenders = async (_req: Request, res: Response) => {
    try {
      console.log("Scraping London tenders (test mode)...");

      const tenders = await this.scrapingService.scrapeLondonTenders();

      res.json({
        message: "London tenders scraped successfully",
        count: tenders.length,
        data: tenders,
      });
    } catch (error: any) {
      console.error("Error scraping London tenders:", error);
      res.status(500).json({
        error: "Failed to scrape London tenders",
        details: error.message,
      });
    }
  };

  /**
   * Get available scraping sources for testing
   * @route GET /scraping/test/sources
   */
  getTestSources = async (_req: Request, res: Response) => {
    try {
      const sources = [
        {
          id: "canadian",
          name: "Government of Canada",
          description: "Canadian government tenders from CSV data",
          testEndpoint: "/scraping/test/canadian",
        },
        {
          id: "toronto",
          name: "City of Toronto",
          description: "Toronto tenders from City API",
          testEndpoint: "/scraping/test/toronto",
        },
        {
          id: "ontario",
          name: "Government of Ontario",
          description: "Ontario tenders from Jaggaer Excel export",
          testEndpoint: "/scraping/test/ontario",
        },
        {
          id: "mississauga",
          name: "City of Mississauga",
          description: "Mississauga tenders from bidsandtenders.ca",
          testEndpoint: "/scraping/test/mississauga",
        },
        {
          id: "brampton",
          name: "City of Brampton",
          description: "Brampton tenders from bidsandtenders.ca",
          testEndpoint: "/scraping/test/brampton",
        },
        {
          id: "hamilton",
          name: "City of Hamilton",
          description: "Hamilton tenders from bidsandtenders.ca",
          testEndpoint: "/scraping/test/hamilton",
        },
        {
          id: "london",
          name: "City of London",
          description: "London tenders from bidsandtenders.ca",
          testEndpoint: "/scraping/test/london",
        },
        {
          id: "quebec",
          name: "Government of Quebec",
          description: "Quebec tenders from SEAO API",
          testEndpoint: "/scraping/test/quebec",
        },
      ];

      res.json({
        message: "Available scraping sources",
        sources,
      });
    } catch (error: any) {
      console.error("Error getting test sources:", error);
      res.status(500).json({
        error: "Failed to get test sources",
        details: error.message,
      });
    }
  };

  /**
   * Test scrape data from a specific source
   * @route GET /scraping/test/:source
   */
  testScrapeSource = async (req: Request, res: Response) => {
    try {
      const { source } = req.params;
      const limit = parseInt(req.query.limit as string) || 5; // Default to 5 items for testing

      console.log(`Test scraping ${source} (limit: ${limit})...`);

      let result: any;

      switch (source) {
        case "canadian":
          result = await this.scrapingService.testScrapeCanadian(limit);
          break;
        case "toronto":
          result = await this.scrapingService.testScrapeToronto(limit);
          break;
        case "ontario":
          result = await this.scrapingService.testScrapeOntario(limit);
          break;
        case "mississauga":
          result = await this.scrapingService.testScrapeMississauga(limit);
          break;
        case "brampton":
          result = await this.scrapingService.testScrapeBrampton(limit);
          break;
        case "hamilton":
          result = await this.scrapingService.testScrapeHamilton(limit);
          break;
        case "london":
          result = await this.scrapingService.testScrapeLondon(limit);
          break;
        case "quebec":
          result = await this.scrapingService.testScrapeQuebec(limit);
          break;
        default:
          res.status(400).json({
            error: "Invalid source",
            message: `Source '${source}' not supported. Available sources: canadian, toronto, ontario, mississauga, brampton, hamilton, london, quebec`,
          });
      }

      res.json({
        message: `${source} tenders scraped successfully`,
        source,
        count: result.length,
        limit,
        data: result,
      });
    } catch (error: any) {
      console.error(`Error test scraping ${req.params.source}:`, error);
      res.status(500).json({
        error: `Failed to test scrape ${req.params.source}`,
        details: error.message,
      });
    }
  };
}
