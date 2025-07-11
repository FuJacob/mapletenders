import axios from "axios";
import { handleApiError } from "./config";

export interface AuthResponse {
  user?: {
    id: string;
    email: string;
  };
  session?: {
    access_token: string;
    refresh_token: string;
  };
  error?: string;
}

export interface SignUpData {
  email: string;
  password: string;
}

export interface SignInData {
  email: string;
  password: string;
}

/**
 * Sign up a new user
 * @param {SignUpData} signUpData - Email and password
 * @returns {Promise<AuthResponse>} Authentication response
 */
export const signUpUser = async (
  signUpData: SignUpData
): Promise<AuthResponse> => {
  try {
    const response = await axios.post("/auth/signup", signUpData);
    return response.data;
  } catch (error) {
    return handleApiError(error, "Sign up user");
  }
};

/**
 * Sign in an existing user
 * @param {SignInData} signInData - Email and password
 * @returns {Promise<AuthResponse>} Authentication response
 */
export const signInUser = async (
  signInData: SignInData
): Promise<AuthResponse> => {
  try {
    const response = await axios.post("/auth/signin", signInData);
    return response.data;
  } catch (error) {
    return handleApiError(error, "Sign in user");
  }
};

/**
 * Sign out the current user
 * @returns {Promise<{success: boolean}>} Sign out response
 */
export const signOutUser = async (): Promise<{ success: boolean }> => {
  try {
    const response = await axios.post("/auth/signout");
    return response.data;
  } catch (error) {
    return handleApiError(error, "Sign out user");
  }
};

/**
 * Get current session
 * @returns {Promise<AuthResponse>} Session data
 */
export const getSession = async (): Promise<AuthResponse> => {
  try {
    const response = await axios.get("/auth/session");
    return response.data;
  } catch (error) {
    return handleApiError(error, "Get session");
  }
};
