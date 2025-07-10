import axios from "axios";
import { handleApiError } from "./config";

export interface ProfileData {
  id: string;
  company_name?: string;
  company_size?: string;
  industry?: string;
  primary_services?: string[];
  service_regions?: string[];
  government_experience?: string;
  typical_contract_size?: string;
  onboarding_completed?: boolean;
  updated_at?: string;
}

export interface ProfileResponse {
  profile?: ProfileData;
  error?: string;
}

/**
 * Create or update user profile
 * @param {ProfileData} profileData - Profile information
 * @returns {Promise<ProfileResponse>} Profile response
 */
export const createOrUpdateProfile = async (profileData: ProfileData): Promise<ProfileResponse> => {
  try {
    const response = await axios.post("/profile", profileData);
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
    const response = await axios.get(`/profile/${userId}`);
    return { profile: response.data };
  } catch (error) {
    return handleApiError(error, "Get profile");
  }
};
