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
      
      console.log("Canadian tenders imported successfully:", result);
      res.json(result);
    } catch (error: any) {
      console.error("Error importing Canadian tenders:", error);
      res.status(500).json({ 
        error: "Failed to import Canadian tenders",
        details: error.message 
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
        details: error.message 
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
        details: error.message 
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
        details: error.message 
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
        details: error.message 
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
        details: error.message 
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
        details: error.message 
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
        details: error.message 
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
        details: error.message 
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
        details: error.message 
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
        details: error.message 
      });
    }
  };
}