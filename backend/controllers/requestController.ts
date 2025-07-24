import { Request, Response } from "express";
import { DatabaseService } from "../services";
export class LiveDemoRequestController {
  constructor(private databaseService: DatabaseService) {}

  requestLiveDemo = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      await this.databaseService.requestLiveDemo(email);
      res.status(200).json({ message: "Live demo request sent" });
    } catch (error) {
      res.status(500).json({ error: "Failed to send live demo request" });
    }
  };
}
