import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type Database } from "../../../database.types";

interface AuthState {
  user: Profile | null; // The actual user profile data we care about
  loading: boolean;
  error: string | null;
  onboarding_completed: boolean;
}

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

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
    setUser: (state, action: PayloadAction<Profile | null>) => {
      state.user = action.payload;
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
    },
  },
});

export const {
  setUser,
  logout,
  setAuthLoading,
  setAuthError,
  setOnboardingCompleted,
} = authSlice.actions;
export default authSlice.reducer;
