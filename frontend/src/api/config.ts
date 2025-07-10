import axios from "axios";

/**
 * Base URL for API endpoints
 * @constant {string}
 */
export const API_BASE_URL = "http://localhost:4000";
export const PDF_ANALYSIS_URL = "http://localhost:4500";

// Configure axios defaults
axios.defaults.baseURL = API_BASE_URL;

// Add response interceptor for global error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const operation = error.config?.url || "Unknown operation";
    console.error(
      `API Error [${operation}]:`,
      error.response?.data || error.message
    );

    // You can add global error notifications here
    // toast.error(`Failed to ${operation}`);

    return Promise.reject(error);
  }
);

/**
 * Generic error handler for API operations
 * @param error - The error object
 * @param operation - Description of the operation that failed
 */
export const handleApiError = (error: unknown, operation: string): never => {
  console.error(`${operation} failed:`, error);
  const errorMessage = error instanceof Error ? error.message : "Unknown error";
  const responseError = (error as { response?: { data?: { error?: string } } })
    ?.response?.data?.error;
  throw new Error(`${operation} failed: ${responseError || errorMessage}`);
};
