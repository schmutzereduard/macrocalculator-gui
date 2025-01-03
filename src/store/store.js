import { configureStore } from '@reduxjs/toolkit';
import foodsSlice from './foodsSlice';
import recipesSlice from './recipesSlice';
import journalsSlice from './journalsSlice';
import authSlice from "./authSlice";

const store = configureStore({
  reducer: {
    foods: foodsSlice,
    recipes: recipesSlice,
    journals: journalsSlice,
    auth: authSlice,
  },
});

export default store;