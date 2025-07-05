import { supabase } from "../../supabase";
import { setSession, logout, setAuthLoading, setError } from "./authSlice";
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
      dispatch(setError(error.message));
    } else {
      dispatch(
        setSession({
          session: data.session,
          user: data.user,
        })
      );
    }

    dispatch(setAuthLoading(false));
  };

export const signOut = () => async (dispatch: AppDispatch) => {
  await supabase.auth.signOut();
  dispatch(logout());
};

export const loadSession = () => async (dispatch: AppDispatch) => {
  dispatch(setAuthLoading(true));

  const { data, error } = await supabase.auth.getSession();
  const session = data.session;
  const user = session?.user;

  if (user) {
    dispatch(setSession({ session, user }));
  }
  dispatch(setAuthLoading(false));
};
