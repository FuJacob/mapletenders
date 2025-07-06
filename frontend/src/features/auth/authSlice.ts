import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Session, User } from "@supabase/supabase-js";
import { type Database } from "../../../database.types";
interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  onboarding_completed: boolean; // Optional field for onboarding status
  profile: Profile | null; // Optional field for user profile
}

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

const initialState: AuthState = {
  user: null,
  session: null,
  loading: false,
  error: null,
  onboarding_completed: false,
  profile: null, // Optional field for user profile
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession: (
      state,
      action: PayloadAction<{ session: Session | null; user: User | null }>
    ) => {
      state.session = action.payload?.session || null;
      state.user = action.payload?.user || null;
    },
    logout: (state) => {
      state.session = null;
      state.user = null;
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
    setAuthProfile: (state, action: PayloadAction<Profile | null>) => {
      state.profile = action.payload;
    },
  },
});

export const {
  setSession,
  logout,
  setAuthLoading,
  setAuthError,
  setOnboardingCompleted,
  setAuthProfile,
} = authSlice.actions;
export default authSlice.reducer;
