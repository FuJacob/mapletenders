import { Router } from "express";
import { LiveDemoRequestController } from "../controllers/requestController";
import { DatabaseService } from "../services";

const liveDemoRequestController = new LiveDemoRequestController(
  new DatabaseService()
);

const router = Router();

router.post("/live-demo", liveDemoRequestController.requestLiveDemo);

export default router;
