export const selectAuthLoading = (state: any) => state.auth.loading;
export const selectAuthError = (state: any) => state.auth.error;
export const selectAuthUser = (state: any) => state.auth.user; // This now returns the profile data
export const selectOnboardingCompleted = (state: any) =>
  state.auth.onboarding_completed;

// Helper selector to check if user is logged in
export const selectIsAuthenticated = (state: any) => !!state.auth.user;
