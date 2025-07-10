import { Request, Response } from "express";
import { AiService } from "../services";
import { v4 as uuidv4 } from "uuid";

export class ChatController {
  constructor(private aiService: AiService) {}

  createChatSession = async (req: Request, res: Response) => {
    try {
      const sessionId = uuidv4();
      await this.aiService.createChatSession(sessionId);
      
      res.json({
        sessionId,
        message: "Chat session created successfully"
      });
    } catch (error: any) {
      console.error("Error creating chat session:", error);
      res.status(500).json({ error: error.message || "Failed to create chat session" });
    }
  };

  sendMessage = async (req: Request, res: Response) => {
    try {
      const { sessionId } = req.params;
      const { message } = req.body;

      if (!message) {
        return res.status(400).json({
          error: "Message is required"
        });
      }

      const response = await this.aiService.sendChatMessage(sessionId, message);
      res.json(response);
    } catch (error: any) {
      console.error("Error sending chat message:", error);
      res.status(500).json({ error: error.message || "Failed to send message" });
    }
  };

  deleteChatSession = async (req: Request, res: Response) => {
    try {
      const { sessionId } = req.params;
      const deleted = this.aiService.deleteChatSession(sessionId);
      
      res.json({
        success: deleted,
        message: deleted ? "Chat session deleted" : "Chat session not found"
      });
    } catch (error: any) {
      console.error("Error deleting chat session:", error);
      res.status(500).json({ error: error.message || "Failed to delete chat session" });
    }
  };
}
