import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import tendersReducer from "../features/tenders/tendersSlice";
import { bookmarksReducer } from "../features/bookmarks";
import { persistStore, persistCombineReducers } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

const persistConfig = {
  key: "root",
  blacklist: ["tenders", "bookmarks"],
  storage,
};

const persistedReducer = persistCombineReducers(persistConfig, {
  auth: authReducer,
  tenders: tendersReducer,
  bookmarks: bookmarksReducer,
});

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist
    }),
});
export const persistor = persistStore(store);
// Types for TS
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
