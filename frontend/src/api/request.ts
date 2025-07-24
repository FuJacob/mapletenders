import apiClient from "../client/apiClient";
import { handleApiError } from "./config";
export const requestLiveDemo = async (email: string) => {
  try {
    const response = await apiClient.post("/request/live-demo", { email });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    return handleApiError(error, "Request live demo");
  }
};
