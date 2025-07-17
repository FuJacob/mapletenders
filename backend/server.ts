import * as path from "path";
import express from "express";
import cors from "cors";

// Import route modules
import aiRoutes from "./routes/ai";
import tendersRoutes from "./routes/tenders";
import tenderNoticeRoutes from "./routes/tender-notice";
import authRoutes from "./routes/auth";
import profileRoutes from "./routes/profile";
import chatRoutes from "./routes/chat";
import bookmarkRoutes from "./routes/bookmarks";
import subscriptionRoutes from "./routes/subscriptions";
import scrapingRoutes from "./routes/scraping";

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
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/chat", chatRoutes);
app.use("/bookmarks", bookmarkRoutes);
app.use("/subscriptions", subscriptionRoutes);
app.use("/scraping", scrapingRoutes);

/**
 * Scraping test playground page
 * @route GET /test
 */
app.get("/test", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Scraping Test Playground</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
        .source-card { border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 5px; background: #f9f9f9; }
        .source-card h3 { margin: 0 0 10px 0; color: #007bff; }
        .source-card p { margin: 5px 0; color: #666; }
        button { background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin: 5px; }
        button:hover { background: #0056b3; }
        button:disabled { background: #ccc; cursor: not-allowed; }
        .result-container { margin-top: 20px; }
        .loading { color: #007bff; font-style: italic; }
        .error { color: #dc3545; background: #f8d7da; padding: 10px; border-radius: 5px; margin: 10px 0; }
        .success { color: #155724; background: #d4edda; padding: 10px; border-radius: 5px; margin: 10px 0; }
        pre { background: #f8f9fa; padding: 15px; border-radius: 5px; overflow-x: auto; white-space: pre-wrap; word-wrap: break-word; max-height: 500px; overflow-y: auto; }
        .controls { margin: 20px 0; }
        .controls label { display: inline-block; margin-right: 10px; font-weight: bold; }
        .controls input { padding: 5px; border: 1px solid #ddd; border-radius: 3px; margin-right: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔧 Scraping Test Playground</h1>
        <p>Test the scraping functionality without importing data to the database. This helps verify that data mapping is working correctly.</p>
        
        <div class="controls">
            <label for="limit">Limit:</label>
            <input type="number" id="limit" value="3" min="1" max="20" />
            <small>Number of records to fetch (1-20)</small>
        </div>

        <div id="sources-container">
            <p class="loading">Loading available sources...</p>
        </div>

        <div class="result-container">
            <h2>Test Results</h2>
            <div id="result-display">
                <p>Select a source above to test scraping.</p>
            </div>
        </div>
    </div>

    <script>
        let sources = [];

        // Load available sources
        async function loadSources() {
            try {
                const response = await fetch('/scraping/test/sources');
                const data = await response.json();
                sources = data.sources;
                displaySources();
            } catch (error) {
                document.getElementById('sources-container').innerHTML = 
                    '<div class="error">Failed to load sources: ' + error.message + '</div>';
            }
        }

        // Display source cards
        function displaySources() {
            const container = document.getElementById('sources-container');
            container.innerHTML = sources.map(source => \`
                <div class="source-card">
                    <h3>\${source.name}</h3>
                    <p>\${source.description}</p>
                    <button onclick="testSource('\${source.id}')" id="btn-\${source.id}">
                        Test \${source.name}
                    </button>
                </div>
            \`).join('');
        }

        // Test a specific source
        async function testSource(sourceId) {
            const limit = document.getElementById('limit').value;
            const button = document.getElementById('btn-' + sourceId);
            const resultDisplay = document.getElementById('result-display');
            
            // Disable button and show loading
            button.disabled = true;
            button.textContent = 'Testing...';
            resultDisplay.innerHTML = '<p class="loading">Scraping ' + sourceId + ' tenders...</p>';

            try {
                const response = await fetch(\`/scraping/test/\${sourceId}?limit=\${limit}\`);
                const data = await response.json();

                if (response.ok) {
                    resultDisplay.innerHTML = \`
                        <div class="success">
                            ✅ Successfully scraped \${data.count} \${sourceId} tenders
                        </div>
                        <h3>Sample Data:</h3>
                        <pre>\${JSON.stringify(data.data, null, 2)}</pre>
                    \`;
                } else {
                    resultDisplay.innerHTML = \`
                        <div class="error">
                            ❌ Error: \${data.error}<br>
                            Details: \${data.details || 'No additional details'}
                        </div>
                    \`;
                }
            } catch (error) {
                resultDisplay.innerHTML = \`
                    <div class="error">
                        ❌ Network error: \${error.message}
                    </div>
                \`;
            } finally {
                // Re-enable button
                button.disabled = false;
                button.textContent = 'Test ' + sources.find(s => s.id === sourceId)?.name;
            }
        }

        // Load sources on page load
        loadSources();
    </script>
</body>
</html>
  `);
});

// Serve static files from the 'assets' folder
app.use("/assets", express.static(path.join(__dirname, "assets")));

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
server.on("error", console.error);
