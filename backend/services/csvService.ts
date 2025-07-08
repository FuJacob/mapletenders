import axios from "axios";
import Papa from "papaparse";

export class CsvService {
  async downloadTendersCsvStream() {
    const openTenderNoticesURL = process.env.OPEN_TENDER_NOTICES_URL || "";
    return await axios.get(openTenderNoticesURL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
      responseType: "stream",
    });
  }

  async downloadTendersCsvData() {
    const openTenderNoticesURL = process.env.OPEN_TENDER_NOTICES_URL || "";
    return await axios.get(openTenderNoticesURL, {
      headers: {
        "User-Agent": process.env.USER_AGENT || "",
      },
    });
  }

  async parseCsvData(csvData: string) {
    return Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
    });
  }
}
