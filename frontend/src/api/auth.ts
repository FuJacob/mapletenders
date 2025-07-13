import axios from "axios";
import { handleApiError } from "./config";
import type { User, Session } from "@supabase/supabase-js";

export interface AuthResponse {
  user: User;
  session: Session;
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
export const getUser = async (): Promise<AuthResponse> => {
  try {
    const response = await axios.get("/auth/user");
    return response.data;
  } catch (error) {
    return handleApiError(error, "Get user");
  }
};

/**
 * Send password reset email
 * @param {string} email - User email
 * @returns {Promise<{message?: string, error?: string}>} Reset response
 */
export const resetPassword = async (
  email: string
): Promise<{ message?: string; error?: string }> => {
  try {
    const response = await axios.post("/auth/reset-password", { email });
    return response.data;
  } catch (error) {
    return handleApiError(error, "Reset password");
  }
};

/**
 * Update user pa,sword
 * @param {string} password - New password
 * @param {string} accessToken - Access token from reset link
 * @returns {Promise<{message?: string, error?: string}>} Update response
 */
export const updatePassword = async (
  password: string,
  accessToken: string
): Promise<{ message?: string; error?: string }> => {
  try {
    const response = await axios.post("/auth/update-password", {
      password,
      accessToken,
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, "Update password");
  }
};
