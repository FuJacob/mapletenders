export const selectAuthLoading = (state: any) => state.auth.loading;
export const selectAuthError = (state: any) => state.auth.error;
export const selectAuthUser = (state: any) => state.auth.user;
export const selectAuthSession = (state: any) => state.auth.session;
export const selectOnboardingCompleted = (state: any) =>
  state.auth.onboarding_completed;
export const selectAuthProfile = (state: any) => state.auth.profile;
