import { supabase } from "../../supabase";
import {
  setSession,
  logout,
  setAuthLoading,
  setAuthError,
  setOnboardingCompleted,
} from "./authSlice";
import { type AppDispatch } from "../../app/store";

export const signIn =
  (email: string, password: string) => async (dispatch: AppDispatch) => {
    dispatch(setAuthLoading(true));

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    console.log(data);
    console.log(error);
    if (error) {
      dispatch(setAuthError(error.message));
    } else {
      dispatch(
        setSession({
          session: data.session,
          user: data.user,
        })
      );

      // Create user profile if not already present
      const user = data.user;
      if (!user?.id) throw new Error("No authenticated user");

      const { data: existingProfile, error: profileFetchError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single();

      if (profileFetchError) {
        console.error("Error checking profile existence:", profileFetchError);
      } else if (!existingProfile) {
        const { error: profileInsertError } = await supabase
          .from("profiles")
          .insert({
            onboarding_completed: false,
          });

        if (profileInsertError) {
          console.error("Error creating profile:", profileInsertError);
        }
      }
      dispatch(setOnboardingCompleted(true));
    }

    dispatch(setAuthLoading(false));
  };

export const signOut = () => async (dispatch: AppDispatch) => {
  await supabase.auth.signOut();
  dispatch(logout());
};

export const loadSession = () => async (dispatch: AppDispatch) => {
  dispatch(setAuthLoading(true));

  const { data } = await supabase.auth.getSession();
  const session = data.session;
  const user = session?.user;

  if (user) {
    dispatch(setSession({ session, user }));
    dispatch(setOnboardingCompleted(true));
  }
  dispatch(setAuthLoading(false));
};
