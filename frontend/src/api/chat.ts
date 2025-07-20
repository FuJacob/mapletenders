import apiClient from "./client/apiClient";
import { handleApiError } from "./config";

export interface ChatMessage {
  role: "user" | "model";
  message: string;
  timestamp: Date;
}

export interface ChatSession {
  sessionId: string;
  messages: ChatMessage[];
}

export interface ChatResponse {
  message: string;
  sessionId: string;
}

export interface CreateSessionResponse {
  sessionId: string;
  message: string;
}

/**
 * Create a new chat session
 * @returns {Promise<CreateSessionResponse>} Session response
 */
export const createChatSession = async (): Promise<CreateSessionResponse> => {
  try {
    const response = await apiClient.post("/chat/session");
    return response.data;
  } catch (error) {
    throw handleApiError(error, "Create chat session");
  }
};

/**
 * Send a message to a chat session
 * @param {string} sessionId - The chat session ID
 * @param {string} message - The message to send
 * @returns {Promise<ChatResponse>} Chat response
 */
export const sendChatMessage = async (
  sessionId: string,
  message: string
): Promise<ChatResponse> => {
  try {
    const response = await apiClient.post(`/chat/session/${sessionId}/message`, {
      message,
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error, "Send chat message");
  }
};

/**
 * Delete a chat session
 * @param {string} sessionId - The chat session ID
 * @returns {Promise<{success: boolean, message: string}>} Delete response
 */
export const deleteChatSession = async (
  sessionId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.delete(`/chat/session/${sessionId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error, "Delete chat session");
  }
};
