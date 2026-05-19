import {
  configureStore,
  combineReducers,
} from "@reduxjs/toolkit";

import {
  persistStore,
  persistReducer,
} from "redux-persist";

import createWebStorage from "redux-persist/es/storage/createWebStorage";

import authReducer from "./slices/authSlice";
import notificationReducer from "./slices/notificationSlice";

const storage =
  createWebStorage("local");

const rootReducer = combineReducers({
  auth: authReducer,
  notifications: notificationReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const persistedReducer =
  persistReducer(
    persistConfig,
    rootReducer
  );

export const store = configureStore({
  reducer: persistedReducer,

  middleware: (
    getDefaultMiddleware
  ) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor =
  persistStore(store);

export type RootState =
  ReturnType<typeof store.getState>;

export type AppDispatch =
  typeof store.dispatch;