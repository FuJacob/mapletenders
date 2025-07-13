import type { RootState } from "../../app/configureStore";

export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectAuthUser = (state: RootState) => state.auth.user; // Supabase user info
export const selectAuthProfile = (state: RootState) => state.auth.profile; // Company profile data
export const selectOnboardingCompleted = (state: RootState) =>
  state.auth.onboarding_completed;

// Helper selector to check if user is logged in
export const selectIsAuthenticated = (state: RootState) => !!state.auth.user;
