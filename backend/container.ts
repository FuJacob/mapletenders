import dotenv from "dotenv";

dotenv.config();
import {
  DatabaseService,
  CsvService,
  MlService,
  AiService,
  TenderService,
  RfpService,
  SubscriptionService,
  ScrapingService,
} from "./services";

import {
  AiController,
  TenderController,
  TenderNoticeController,
  AuthController,
  ProfileController,
  ChatController,
  BookmarkController,
  SubscriptionController,
  ScrapingController,
} from "./controllers";

// Initialize services
const databaseService = new DatabaseService();
const csvService = new CsvService();
const mlService = new MlService();
const aiService = new AiService();
const scrapingService = new ScrapingService(
  databaseService,
  csvService,
  mlService,
  aiService
);

const tenderService = new TenderService(
  databaseService,
  csvService,
  mlService,
  aiService,
  scrapingService
);

const rfpService = new RfpService(databaseService, aiService);
const subscriptionService = new SubscriptionService(databaseService);

// Initialize controllers
export const aiController = new AiController(
  rfpService,
  tenderService,
  databaseService,
  aiService
);
export const tenderController = new TenderController(
  tenderService,
  mlService,
  databaseService
);
export const tenderNoticeController = new TenderNoticeController(tenderService);
export const authController = new AuthController(databaseService);
export const profileController = new ProfileController(databaseService);
export const chatController = new ChatController(aiService);
export const bookmarkController = new BookmarkController(databaseService);
export const subscriptionController = new SubscriptionController(
  subscriptionService
);
export const scrapingController = new ScrapingController(scrapingService);
