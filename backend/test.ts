import express from "express";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

const app = express();
const PORT = 3000;

puppeteer.use(StealthPlugin());

function isSearchRequest(url: string) {
  return url.includes("/Module/Tenders/en/Tender/Search/");
}

app.get("/api/scrape-mississauga-tenders", async (req, res) => {
  // Try headless mode with stealth
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--window-size=1920,1080",
    ],
  });
  const page = await browser.newPage();

  // Spoof browser fingerprint
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
  );
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setExtraHTTPHeaders({
    "Accept-Language": "en-US,en;q=0.9",
  });

  let tenderData: any = null;

  page.on("response", async (response) => {
    try {
      const req = response.request();
      if (
        req.method() === "POST" &&
        isSearchRequest(response.url()) &&
        response.headers()["content-type"]?.includes("application/json")
      ) {
        tenderData = await response.json();
      }
    } catch (err) {}
  });

  try {
    await page.goto("https://mississauga.bidsandtenders.ca/Module/Tenders/en", {
      waitUntil: "networkidle2",
      timeout: 45000,
    });

    let maxTries = 25,
      interval = 500,
      tries = 0;
    while (!tenderData && tries < maxTries) {
      await new Promise((r) => setTimeout(r, interval));
      tries++;
    }

    await browser.close();

    if (!tenderData) {
      res
        .status(504)
        .json({ error: "Tenders data not found in network requests." });
      return;
    }

    res.json(tenderData);
  } catch (error) {
    await browser.close();
    res
      .status(500)
      .json({ error: "Scraping error", details: (error as Error).message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
