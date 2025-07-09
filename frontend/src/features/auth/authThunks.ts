import { supabase } from "../../supabase";
import {
  setUser,
  logout,
  setAuthLoading,
  setAuthError,
  setOnboardingCompleted,
} from "./authSlice";
import { type AppDispatch } from "../../app/configureStore";
import type { Database } from "../../../database.types";

type ProfileUpdate = Partial<
  Database["public"]["Tables"]["profiles"]["Update"]
>;
export const signIn =
  (email: string, password: string) => async (dispatch: AppDispatch) => {
    dispatch(setAuthLoading(true));

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      dispatch(setAuthError(error.message));
      dispatch(setAuthLoading(false));
      return;
    }

    // Get or create user profile
    const user = data.user;
    if (!user?.id) {
      dispatch(setAuthError("No authenticated user"));
      dispatch(setAuthLoading(false));
      return;
    }

    const { data: initialProfile, error: profileFetchError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    let profile = initialProfile;

    // If profile doesn't exist, create it
    if (profileFetchError && profileFetchError.code === "PGRST116") {
      const { data: newProfile, error: profileInsertError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          email: user.email,
          onboarding_completed: false,
        })
        .select("*")
        .single();

      if (profileInsertError) {
        console.error("Error creating profile:", profileInsertError);
        dispatch(setAuthError("Failed to create user profile"));
        dispatch(setAuthLoading(false));
        return;
      }
      profile = newProfile;
    } else if (profileFetchError) {
      console.error("Error fetching profile:", profileFetchError);
      dispatch(setAuthError("Failed to fetch user profile"));
      dispatch(setAuthLoading(false));
      return;
    }

    // Set user and onboarding status
    dispatch(setUser(profile));
    dispatch(setOnboardingCompleted(profile?.onboarding_completed || false));
    dispatch(setAuthLoading(false));
  };

export const signOut = () => async (dispatch: AppDispatch) => {
  dispatch(setAuthLoading(true));
  await supabase.auth.signOut();
  dispatch(logout());
  dispatch(setAuthLoading(false));
};

export const loadSession = () => async (dispatch: AppDispatch) => {
  dispatch(setAuthLoading(true));

  const { data } = await supabase.auth.getSession();
  const session = data.session;
  const user = session?.user;

  if (user?.id) {
    const { data: existingProfile, error: profileFetchError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileFetchError) {
      console.error("Error fetching profile:", profileFetchError);
      dispatch(setAuthError("Failed to load user profile"));
    } else if (existingProfile) {
      dispatch(setUser(existingProfile));
      dispatch(
        setOnboardingCompleted(existingProfile.onboarding_completed || false)
      );
    }
  }

  dispatch(setAuthLoading(false));
};

export const updateProfile =
  (profileData: ProfileUpdate) => async (dispatch: AppDispatch) => {
    dispatch(setAuthLoading(true));
    dispatch(setAuthError(null));

    try {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;

      if (!user?.id) {
        dispatch(setAuthError("No authenticated user"));
        dispatch(setAuthLoading(false));
        return { type: "auth/updateProfile/rejected" };
      }

      // Update the profile in Supabase
      const { data: updatedProfile, error: updateError } = await supabase
        .from("profiles")
        .update({
          ...profileData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)
        .select("*")
        .single();

      if (updateError) {
        console.error("Profile update error:", updateError);
        dispatch(setAuthError("Failed to update profile"));
        dispatch(setAuthLoading(false));
        return { type: "auth/updateProfile/rejected" };
      }

      // Update Redux state with the new profile data
      dispatch(setUser(updatedProfile));
      dispatch(setAuthLoading(false));

      return { type: "auth/updateProfile/fulfilled", payload: updatedProfile };
    } catch (error) {
      console.error("Unexpected error during profile update:", error);
      dispatch(setAuthError("An unexpected error occurred"));
      dispatch(setAuthLoading(false));
      return { type: "auth/updateProfile/rejected" };
    }
  };
