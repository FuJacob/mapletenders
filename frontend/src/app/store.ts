import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import authReducer from "../features/auth/authSlice";
import tendersReducer from "../features/tenders/tendersSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    counter: counterReducer,
    tenders: tendersReducer,
  },
});

// Types for TS
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
