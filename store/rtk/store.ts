import { configureStore } from "@reduxjs/toolkit";
import userProfileReducer from "./slices/userProfile.slice";
import badgesReducer from "./slices/badges.slice";
import scoresReducer from "./slices/scores.slice";
import challengesReducer from "./slices/challenges.slice";

export const store = configureStore({
  reducer: {
    userProfile: userProfileReducer,
    badges: badgesReducer,
    scores: scoresReducer,
    challenges: challengesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


