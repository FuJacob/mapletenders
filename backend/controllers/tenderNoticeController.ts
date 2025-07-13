import { Request, Response } from "express";
import { TenderService } from "../services";

export class TenderNoticeController {
  constructor(private tenderService: TenderService) {}

  getTenderNoticeById = async (req: Request, res: Response) => {
    try {
      console.log("Fetching tender notice:", req.params);
      const { id } = req.params;
      const result = await this.tenderService.getTenderById(id);
      res.json(result);
    } catch (error: any) {
      console.error("Error fetching tender notice:", error);
      res.status(500).json({ error: "Failed to fetch tender notice" });
    }
  };
}
