import * as path from "path";
import express from "express";
import cors from "cors";

// Import route modules
import aiRoutes from "./routes/ai";
import tendersRoutes from "./routes/tenders";
import tenderNoticeRoutes from "./routes/tender-notice";

const app = express();
app.use(cors({ origin: "*" })); // Allow all origins
app.use(express.json({ limit: "10mb" })); // Limit is 1mb so can parse more tenders

/**
 * Root endpoint
 * @route GET /
 * @returns {Object} Welcome message
 */
app.get("/", (req, res) => {
  res.send({ message: "Welcome to TDP BACKEND." });
});

// Use route modules
app.use("/ai", aiRoutes);
app.use("/tenders", tendersRoutes);
app.use("/tender-notice", tenderNoticeRoutes);

// Serve static files from the 'assets' folder
app.use("/assets", express.static(path.join(__dirname, "assets")));

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
server.on("error", console.error);
