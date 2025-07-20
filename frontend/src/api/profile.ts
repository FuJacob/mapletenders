import apiClient from "./client/apiClient";
import { handleApiError } from "./config";
import type { Database } from "../../database.types";

// Use database types as source of truth with proper optional handling
export type ProfileData = Pick<
  Database["public"]["Tables"]["profiles"]["Row"],
  "id"
> & {
  // Convert null database fields to optional undefined fields for API
  company_name?: string;
  company_size?: string;
  industry?: string;
  primary_services?: string[];
  service_regions?: string[];
  government_experience?: string;
  typical_contract_size?: string;
  onboarding_completed?: boolean;
  updated_at?: string;
};

export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export interface ProfileResponse {
  profile?: ProfileData;
  error?: string;
}

/**
 * Create or update user profile
 * @param {ProfileData} profileData - Profile information
 * @returns {Promise<ProfileResponse>} Profile response
 */
export const createOrUpdateProfile = async (
  profileData: ProfileData
): Promise<ProfileResponse> => {
  try {
    const response = await apiClient.post("/profile", profileData);
    return { profile: response.data };
  } catch (error) {
    return handleApiError(error, "Create or update profile");
  }
};

/**
 * Get user profile by ID
 * @param {string} userId - User ID
 * @returns {Promise<ProfileResponse>} Profile data
 */
export const getProfile = async (userId: string): Promise<ProfileResponse> => {
  try {
    const response = await apiClient.get(`/profile/${userId}`);
    return { profile: response.data };
  } catch (error) {
    return handleApiError(error, "Get profile");
  }
};
