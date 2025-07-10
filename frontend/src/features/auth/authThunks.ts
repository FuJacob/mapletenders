import { signInUser, signOutUser, getSession, createOrUpdateProfile, getProfile } from "../../api";
import {
  setUser,
  logout,
  setAuthLoading,
  setAuthError,
  setOnboardingCompleted,
} from "./authSlice";
import { type AppDispatch } from "../../app/configureStore";
import type { Database } from "../../../database.types";
import type { ProfileData } from "../../api/profile";

type ProfileUpdate = Partial<
  Database["public"]["Tables"]["profiles"]["Update"]
>;

type DatabaseProfile = Database["public"]["Tables"]["profiles"]["Row"];

// Helper function to convert database profile to API format
const convertDatabaseProfileToAPI = (dbProfile: Partial<DatabaseProfile>): ProfileData => {
  const converted: Partial<ProfileData> = {};
  for (const [key, value] of Object.entries(dbProfile)) {
    (converted as Record<string, unknown>)[key] = value === null ? undefined : value;
  }
  return converted as ProfileData;
};

// Helper function to convert API profile to database format
const convertAPIProfileToDatabase = (apiProfile: ProfileData): DatabaseProfile => {
  const converted: Partial<DatabaseProfile> = {};
  for (const [key, value] of Object.entries(apiProfile)) {
    (converted as Record<string, unknown>)[key] = value === undefined ? null : value;
  }
  return converted as DatabaseProfile;
};
export const signIn =
  (email: string, password: string) => async (dispatch: AppDispatch) => {
    dispatch(setAuthLoading(true));

    try {
      const response = await signInUser({ email, password });

      if (response.error) {
        dispatch(setAuthError(response.error));
        dispatch(setAuthLoading(false));
        return;
      }

      // Get or create user profile
      const user = response.user;
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

      // Set user and onboarding status
      if (profile) {
        dispatch(setUser(convertAPIProfileToDatabase(profile)));
        dispatch(setOnboardingCompleted(profile.onboarding_completed || false));
      }
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
    await signOutUser();
    dispatch(logout());
  } catch (error) {
    console.error("Sign out error:", error);
  }
  dispatch(setAuthLoading(false));
};

export const loadSession = () => async (dispatch: AppDispatch) => {
  dispatch(setAuthLoading(true));

  try {
    const response = await getSession();
    const user = response.user; // Fix: access user directly from response

    if (user?.id) {
      const profileResponse = await getProfile(user.id);
      
      if (profileResponse.error) {
        console.error("Error fetching profile:", profileResponse.error);
        dispatch(setAuthError("Failed to load user profile"));
      } else if (profileResponse.profile) {
        dispatch(setUser(convertAPIProfileToDatabase(profileResponse.profile)));
        dispatch(
          setOnboardingCompleted(profileResponse.profile.onboarding_completed || false)
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
      const response = await getSession();
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
        dispatch(setUser(convertAPIProfileToDatabase(updateResponse.profile)));
      }
      dispatch(setAuthLoading(false));

      return { type: "auth/updateProfile/fulfilled", payload: updateResponse.profile };
    } catch (error) {
      console.error("Unexpected error during profile update:", error);
      dispatch(setAuthError("An unexpected error occurred"));
      dispatch(setAuthLoading(false));
      return { type: "auth/updateProfile/rejected" };
    }
  };
