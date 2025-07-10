import dotenv from "dotenv";

dotenv.config();
import {
  DatabaseService,
  CsvService,
  MlService,
  AiService,
  DataTransformationService,
  TenderService,
  RfpService,
} from "./services";

import {
  AiController,
  TenderController,
  TenderNoticeController,
} from "./controllers";

// Initialize services
const databaseService = new DatabaseService();
const csvService = new CsvService();
const mlService = new MlService();
const aiService = new AiService();
const dataTransformationService = new DataTransformationService();

const tenderService = new TenderService(
  databaseService,
  csvService,
  mlService,
  dataTransformationService,
  aiService
);

const rfpService = new RfpService(databaseService, aiService);

// Initialize controllers
export const aiController = new AiController(
  rfpService,
  tenderService,
  databaseService,
  aiService
);
export const tenderController = new TenderController(tenderService);
export const tenderNoticeController = new TenderNoticeController(tenderService);
