import axios from "axios";
import { TenderSearchResult } from "../types/search";
import { DatabaseService } from "./databaseService";
import { Database } from "../database.types";

interface ElasticsearchSearchParams {
  query: string;
  regions?: string[];
  procurement_method?: string;
  procurement_category?: string[];
  notice_type?: string[];
  status?: string[];
  contracting_entity_name?: string[];
  closing_date_after?: string;
  closing_date_before?: string;
  publication_date_after?: string;
  publication_date_before?: string;
  limit?: number;
}

export class MlService {
  private baseUrl = process.env.ML_BACKEND_URL || "http://127.0.0.1:8000";

  constructor(private databaseService: DatabaseService) {}

  async generateEmbeddings(data: any[]) {
    try {
      console.log(`🔄 Generating embeddings for ${data.length} tenders...`);
      const response = await axios.post(
        `${this.baseUrl}/embeddings/generate/data`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 60000, // 60 seconds for embedding generation
        }
      );

      if (response.status !== 200) {
        throw new Error(
          `Failed to generate embeddings: ${response.statusText}`
        );
      }

      console.log(
        `✅ Successfully generated ${
          response.data.embeddings?.length || 0
        } embeddings`
      );
      return response.data;
    } catch (error: any) {
      console.error("❌ Embedding generation failed:", error.message);
      if (error.code === "ECONNREFUSED") {
        throw new Error(
          "ML service unavailable: Embedding backend is not running"
        );
      } else if (error.response) {
        throw new Error(
          `Embedding generation failed: ${error.response.status} - ${
            error.response.data?.detail || error.response.data
          }`
        );
      } else {
        throw new Error(`ML service error: ${error.message}`);
      }
    }
  }

  async generateQueryEmbedding(query: string) {
    const response = await axios.post(
      `${this.baseUrl}/embeddings/generate/query`,
      { q: query }
    );

    return response.data;
  }

  async searchTendersWithElasticsearch(
    params: ElasticsearchSearchParams
  ): Promise<TenderSearchResult[]> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/elasticsearch/search`,
        params,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 30000, // 30 second timeout
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.code === "ECONNREFUSED") {
        throw new Error(
          "ML service unavailable: Elasticsearch backend is not running"
        );
      } else if (error.response) {
        throw new Error(
          `Elasticsearch search failed: ${error.response.status} - ${error.response.data}`
        );
      } else {
        throw new Error(`ML service error: ${error.message}`);
      }
    }
  }

  async syncTendersToElasticsearch() {
    try {
      console.log("🔄 Starting Elasticsearch sync...");
      const response = await axios.post(
        `${this.baseUrl}/elasticsearch/sync`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 300000, // 5 minutes for bulk sync
        }
      );

      console.log("✅ Elasticsearch sync completed:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Elasticsearch sync failed:", error.message);
      if (error.code === "ECONNREFUSED") {
        throw new Error(
          "ML service unavailable: Elasticsearch backend is not running"
        );
      } else if (error.response) {
        throw new Error(
          `Elasticsearch sync failed: ${error.response.status} - ${error.response.data}`
        );
      } else {
        throw new Error(`ML service error: ${error.message}`);
      }
    }
  }

  async syncSingleTenderToElasticsearch(tenderId: string) {
    try {
      console.log(`🔄 Syncing tender ${tenderId} to Elasticsearch...`);
      const response = await axios.post(
        `${this.baseUrl}/elasticsearch/sync/${tenderId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 30000, // 30 seconds for single tender
        }
      );

      console.log(
        `✅ Tender ${tenderId} synced to Elasticsearch:`,
        response.data
      );
      return response.data;
    } catch (error: any) {
      console.error(`❌ Failed to sync tender ${tenderId}:`, error.message);
      if (error.code === "ECONNREFUSED") {
        throw new Error(
          "ML service unavailable: Elasticsearch backend is not running"
        );
      } else if (error.response) {
        throw new Error(
          `Elasticsearch sync failed: ${error.response.status} - ${error.response.data}`
        );
      } else {
        throw new Error(`ML service error: ${error.message}`);
      }
    }
  }

  async getUserInfo(
    userId: string
  ): Promise<Database["public"]["Tables"]["profiles"]["Row"] | null> {
    try {
      const profile = await this.databaseService.getProfile(userId);
      return profile;
    } catch (error: any) {
      console.error("Error fetching user info for recommendations:", error);
      throw new Error(`Failed to fetch user information: ${error.message}`);
    }
  }

  validateEmbeddingVector(vector: any): boolean {
    return Array.isArray(vector) && vector.length > 0;
  }
}
