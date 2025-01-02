import { configureStore } from '@reduxjs/toolkit';
import foodsSlice from './foodsSlice';
import recipesSlice from './recipesSlice';
import journalsSlice from './journalsSlice';
import profileSlice from './profileSlice';
import authSlice from "./authSlice";

const store = configureStore({
  reducer: {
    foods: foodsSlice,
    recipes: recipesSlice,
    journals: journalsSlice,
    profile: profileSlice,
    auth: authSlice,
  },
});

export default store;