import { configureStore } from '@reduxjs/toolkit';
import foodsSlice from '../features/foodsSlice';
import recipesSlice from '../features/recipesSlice';
import journalsSlice from '../features/journalsSlice';
import profileSlice from '../features/profileSlice';
import authSlice from "../features/authSlice";

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