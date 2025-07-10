import { Router } from "express";
import { chatController } from "../container";

const router = Router();

// Create a new chat session
router.post("/session", (req, res) => {
  chatController.createChatSession(req, res);
});

// Send a message to a chat session
router.post("/session/:sessionId/message", (req, res) => {
  chatController.sendMessage(req, res);
});

// Delete a chat session
router.delete("/session/:sessionId", (req, res) => {
  chatController.deleteChatSession(req, res);
});

export default router;
