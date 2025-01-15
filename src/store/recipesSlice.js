import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import MacroCalculatorApi from "../api/MacroCalculatorApi";

export const fetchRecipes = createAsyncThunk(
  "recipes/fetchRecipes",
  async () => {
    const response = await MacroCalculatorApi.getRecipes();
    return response.data;
  }
);

export const fetchRecipe = createAsyncThunk(
  "recipes/fetchRecipe",
  async (id) => {
    const response = await MacroCalculatorApi.getRecipe(id);
    return response.data;
  }
);

export const addRecipe = createAsyncThunk(
  "recipes/addRecipe",
  async (recipe) => {
    const response = await MacroCalculatorApi.addRecipe(recipe);
    return response.data;
  }
);

export const updateRecipe = createAsyncThunk(
  "recipes/updateRecipe",
  async (recipe) => {
    const response = await MacroCalculatorApi.updateRecipe(recipe);
    return response.data;
  }
);

export const deleteRecipe = createAsyncThunk(
  "recipes/deleteRecipe",
  async (id) => {
    await MacroCalculatorApi.deleteRecipe(id);
    return id;
  }
);

const handlePending = (state) => {
  state.loading = true;
  state.error = null;
};

const handleRejected = (state, action) => {
  state.loading = false;
  state.error = action.error.message;
};

const recipesSlice = createSlice({
  name: "recipes",
  initialState: {
    items: [],
    selectedItem: null,
    loading: false,
    error: null,
  },
  reducers: {
      addNewRecipe: (state) => {
        state.selectedItem = { name: '', description: '', recipeFoods: [] }
      },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipes.pending, handlePending)
      .addCase(fetchRecipes.rejected, handleRejected)
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchRecipe.pending, handlePending)
      .addCase(fetchRecipe.rejected, handleRejected)
      .addCase(fetchRecipe.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedItem = action.payload;
      })
      .addCase(addRecipe.pending, handlePending)
      .addCase(addRecipe.rejected, handleRejected)
      .addCase(addRecipe.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(updateRecipe.pending, handlePending)
      .addCase(updateRecipe.rejected, handleRejected)
      .addCase(updateRecipe.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.map((recipe) =>
          recipe.id === action.payload.id ? action.payload : recipe
        );
      })
      .addCase(deleteRecipe.pending, handlePending)
      .addCase(deleteRecipe.rejected, handleRejected)
      .addCase(deleteRecipe.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((recipe) => recipe.id !== action.payload);
      });
  },
});

export const { addNewRecipe } = recipesSlice.actions;
export default recipesSlice.reducer;
