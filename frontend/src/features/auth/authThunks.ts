import { getUser, createOrUpdateProfile, getProfile } from "../../api";
import {
  setUser,
  setProfile,
  logout,
  setAuthLoading,
  setAuthError,
} from "./authSlice";
import { type AppDispatch } from "../../app/configureStore";
import type { Database } from "../../../database.types";
import type { ProfileData } from "../../api/profile";
import { supabaseClient } from "../../client/supabaseClient";

// Use database types as source of truth
type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];
type DatabaseProfile = Database["public"]["Tables"]["profiles"]["Row"];
// Helper function to convert database profile to API format
const convertDatabaseProfileToAPI = (
  dbProfile: Partial<DatabaseProfile>
): ProfileData => {
  return {
    id: dbProfile.id!,
    company_name: dbProfile.company_name ?? undefined,
    company_size: dbProfile.company_size ?? undefined,
    industry: dbProfile.industry ?? undefined,
    primary_services: dbProfile.primary_services ?? undefined,
    service_regions: dbProfile.service_regions ?? undefined,
    government_experience: dbProfile.government_experience ?? undefined,
    typical_contract_size: dbProfile.typical_contract_size ?? undefined,
    onboarding_completed: dbProfile.onboarding_completed ?? undefined,
    updated_at: dbProfile.updated_at ?? undefined,
  };
};

// Helper function to convert API profile to database format
const convertAPIProfileToDatabase = (
  apiProfile: ProfileData
): DatabaseProfile => {
  return {
    id: apiProfile.id,
    company_name: apiProfile.company_name ?? null,
    company_size: apiProfile.company_size ?? null,
    created_at: null, // Set by database
    government_experience: apiProfile.government_experience ?? null,
    industry: apiProfile.industry ?? null,
    onboarding_completed: apiProfile.onboarding_completed ?? null,
    primary_services: apiProfile.primary_services ?? null,
    service_regions: apiProfile.service_regions ?? null,
    typical_contract_size: apiProfile.typical_contract_size ?? null,
    updated_at: apiProfile.updated_at ?? null,
  };
};
export const signIn =
  (email: string, password: string) => async (dispatch: AppDispatch) => {
    dispatch(setAuthLoading(true));

    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Error signing in user:", error);
        throw error;
      }
      // Get or create user profile
      const user = data.user;
      if (!user?.id) {
        dispatch(setAuthError("No authenticated user"));
        dispatch(setAuthLoading(false));
        return;
      }

      const profileResponse = await getProfile(user.id);
      let profile = profileResponse.profile;

      // If profile doesn't exist, create it
      if (!profile) {
        const createResponse = await createOrUpdateProfile(
          convertDatabaseProfileToAPI({
            id: user.id,
            onboarding_completed: false,
          })
        );

        if (createResponse.error) {
          console.error("Error creating profile:", createResponse.error);
          dispatch(setAuthError("Failed to create user profile"));
          dispatch(setAuthLoading(false));
          return;
        }
        profile = createResponse.profile;
      }
      // Set combined user and profile data
      dispatch(
        setUser({
          user,
          profile: profile ? convertAPIProfileToDatabase(profile) : null,
        })
      );
      dispatch(setAuthLoading(false));
    } catch (error) {
      console.error("Sign in error:", error);
      dispatch(setAuthError("Failed to sign in"));
      dispatch(setAuthLoading(false));
    }
  };

export const signOut = () => async (dispatch: AppDispatch) => {
  dispatch(setAuthLoading(true));
  try {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
      console.error("Error getting session:", error);
      throw error;
    }
    dispatch(logout());
  } catch (error) {
    console.error("Sign out error:", error);
  }
  dispatch(setAuthLoading(false));
};

export const loadSession = () => async (dispatch: AppDispatch) => {
  dispatch(setAuthLoading(true));

  try {
    const response = await getUser();
    const user = response.user; // Fix: access user directly from response

    if (user?.id) {
      console.log("user", user);
      const profileResponse = await getProfile(user.id);

      if (profileResponse.error) {
        console.error("Error fetching profile:", profileResponse.error);
        dispatch(setAuthError("Failed to load user profile"));
        dispatch(
          setUser({
            user,
            profile: null,
          })
        );
      } else {
        dispatch(
          setUser({
            user,
            profile: profileResponse.profile
              ? convertAPIProfileToDatabase(profileResponse.profile)
              : null,
          })
        );
      }
    }
  } catch (error) {
    console.error("Load session error:", error);
  }

  dispatch(setAuthLoading(false));
};

export const updateProfile =
  (profileData: ProfileUpdate) => async (dispatch: AppDispatch) => {
    dispatch(setAuthLoading(true));
    dispatch(setAuthError(null));

    try {
      const response = await getUser();
      const user = response.user;

      if (!user?.id) {
        dispatch(setAuthError("No authenticated user"));
        dispatch(setAuthLoading(false));
        return { type: "auth/updateProfile/rejected" };
      }

      // Update the profile via API
      const cleanProfileData = convertDatabaseProfileToAPI({
        id: user.id,
        ...profileData,
      });

      const updateResponse = await createOrUpdateProfile(cleanProfileData);

      if (updateResponse.error) {
        console.error("Profile update error:", updateResponse.error);
        dispatch(setAuthError("Failed to update profile"));
        dispatch(setAuthLoading(false));
        return { type: "auth/updateProfile/rejected" };
      }

      // Update Redux state with the new profile data
      if (updateResponse.profile) {
        dispatch(
          setProfile(convertAPIProfileToDatabase(updateResponse.profile))
        );
      }
      dispatch(setAuthLoading(false));

      return {
        type: "auth/updateProfile/fulfilled",
        payload: updateResponse.profile,
      };
    } catch (error) {
      console.error("Unexpected error during profile update:", error);
      dispatch(setAuthError("An unexpected error occurred"));
      dispatch(setAuthLoading(false));
      return { type: "auth/updateProfile/rejected" };
    }
  };
