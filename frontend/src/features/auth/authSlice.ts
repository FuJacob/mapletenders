import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type Database } from "../../../database.types";
import type { User } from "@supabase/supabase-js";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface CombinedUser {
  user: User;
  profile: Profile | null;
}

interface AuthState {
  user: CombinedUser | null;
  loading: boolean;
  error: string | null;
  onboarding_completed: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  onboarding_completed: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<CombinedUser | null>) => {
      state.user = action.payload;
      state.onboarding_completed = action.payload?.profile?.onboarding_completed || false;
    },
    setProfile: (state, action: PayloadAction<Profile | null>) => {
      if (state.user) {
        state.user.profile = action.payload;
        state.onboarding_completed = action.payload?.onboarding_completed || false;
      }
    },
    logout: (state) => {
      state.user = null;
      state.onboarding_completed = false;
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setAuthError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setOnboardingCompleted: (state, action: PayloadAction<boolean>) => {
      state.onboarding_completed = action.payload;
      if (state.user?.profile) {
        state.user.profile.onboarding_completed = action.payload;
      }
    },
  },
});

export const {
  setUser,
  setProfile,
  logout,
  setAuthLoading,
  setAuthError,
  setOnboardingCompleted,
} = authSlice.actions;

export type { CombinedUser, Profile };
export default authSlice.reducer;
