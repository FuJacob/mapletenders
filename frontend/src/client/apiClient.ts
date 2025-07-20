import axios from "axios";
import { supabaseClient } from "./supabaseClient";
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
});

apiClient.interceptors.request.use(
  async (config) => {
    const {
      data: { session },
    } = await supabaseClient.auth.getSession();

    console.log("ASIOJDIOASDIOSDIOAJIOD", session);
    if (session && session.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
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

export default apiClient;
