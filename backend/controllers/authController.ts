import { Request, Response } from "express";
import { DatabaseService } from "../services";

export class AuthController {
  constructor(private databaseService: DatabaseService) {}

  signUp = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          error: "Email and password are required",
        });
      }

      const data = await this.databaseService.signUpUser(email, password);
      res.json(data);
    } catch (error: any) {
      console.error("Error in signUp:", error);
      res.status(400).json({ error: error.message || "Failed to sign up" });
    }
  };

  signIn = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          error: "Email and password are required",
        });
      }

      const data = await this.databaseService.signInUser(email, password);
      res.json(data);
    } catch (error: any) {
      console.error("Error in signIn:", error);
      res.status(400).json({ error: error.message || "Failed to sign in" });
    }
  };

  signOut = async (req: Request, res: Response) => {
    try {
      const result = await this.databaseService.signOutUser();
      res.json(result);
    } catch (error: any) {
      console.error("Error in signOut:", error);
      res.status(500).json({ error: error.message || "Failed to sign out" });
    }
  };

  getSession = async (req: Request, res: Response) => {
    try {
      const session = await this.databaseService.getSession();
      res.json(session);
    } catch (error: any) {
      console.error("Error in getSession:", error);
      res.status(500).json({ error: error.message || "Failed to get session" });
    }
  };
}
