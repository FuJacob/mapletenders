import axios from "axios";

export class MlService {
  private baseUrl = "http://127.0.0.1:8000";

  async generateEmbeddings(data: any[]) {
    const response = await axios.post(
      `${this.baseUrl}/embeddings/generate/data`,
      data
    );

    if (response.status !== 200) {
      throw new Error(`Failed to generate embeddings: ${response.statusText}`);
    }

    return response.data;
  }

  async generateQueryEmbedding(query: string) {
    const response = await axios.post(
      `${this.baseUrl}/embeddings/generate/query`,
      { q: query }
    );

    return response.data;
  }

  validateEmbeddingVector(vector: any): boolean {
    return Array.isArray(vector) && vector.length > 0;
  }
}
