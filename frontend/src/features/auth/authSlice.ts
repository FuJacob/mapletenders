import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type Database } from "../../../database.types";
import type { User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null; // Supabase user info
  profile: Profile | null; // Company profile data
  loading: boolean;
  error: string | null;
  onboarding_completed: boolean;
}

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

const initialState: AuthState = {
  user: null,
  profile: null,
  loading: false,
  error: null,
  onboarding_completed: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<Profile | null>) => {
      state.profile = action.payload;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.profile = null;
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
export default authSlice.reducer;
