import { configureStore } from '@reduxjs/toolkit';
import foodsSlice from '../features/foodsSlice';
import recipesSlice from '../features/recipesSlice';
import journalsSlice from '../features/journalsSlice';

const store = configureStore({
  reducer: {
    foods: foodsSlice,
    recipes: recipesSlice,
    journals: journalsSlice
  },
});

export default store;