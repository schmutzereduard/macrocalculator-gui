import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import MacroCalculatorApi from "../api/MacroCalculatorApi";

export const fetchFoods = createAsyncThunk(
    "foods/fetchFoods",
    async () => {
        const response = await MacroCalculatorApi.getFoods();
        return response.data;
    }
);

export const fetchFoodTypes = createAsyncThunk(
    "foods/fetchFoodTypes",
    async () => {
        const response = await MacroCalculatorApi.getFoodTypes();
        return response.data;
    }
);

export const fetchFood = createAsyncThunk(
    "foods/fetchFood",
    async (id) => {
        const response = await MacroCalculatorApi.getFood(id);
        return response.data;
    }
);

export const addFood = createAsyncThunk(
    "foods/addFood",
    async (food) => {
        const response = await MacroCalculatorApi.addFood(food);
        return response.data;
    }
);

export const updateFood = createAsyncThunk(
    "foods/updateFood",
    async (food) => {
        const response = await MacroCalculatorApi.updateFood(food);
        return response.data;
    }
);

export const deleteFood = createAsyncThunk(
    "foods/deleteFood",
    async (id) => {
        await MacroCalculatorApi.deleteFood(id);
        return id
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

const foodsSlice = createSlice({
    name: 'foods',
    initialState: {
        items: [],
        selectedItem: null,
        itemTypes: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFoods.pending, handlePending)
            .addCase(fetchFoods.rejected, handleRejected)
            .addCase(fetchFoods.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchFoodTypes.pending, handlePending)
            .addCase(fetchFoodTypes.rejected, handleRejected)
            .addCase(fetchFoodTypes.fulfilled, (state, action) => {
                state.loading = false;
                state.itemTypes = action.payload;
            })
            .addCase(fetchFood.pending, handlePending)
            .addCase(fetchFood.rejected, handleRejected)
            .addCase(fetchFood.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedItem = action.payload;
            })
            .addCase(addFood.pending, handlePending)
            .addCase(addFood.rejected, handleRejected)
            .addCase(addFood.fulfilled, (state, action) => {
                state.loading = false;
                state.items.push(action.payload);
            })
            .addCase(updateFood.pending, handlePending)
            .addCase(updateFood.rejected, handleRejected)
            .addCase(updateFood.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.map(food => food.id === action.payload.id ? action.payload : food);
            })
            .addCase(deleteFood.pending, handlePending)
            .addCase(deleteFood.rejected, handleRejected)
            .addCase(deleteFood.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter(food => food.id !== action.payload);
            });
    },
});

export default foodsSlice.reducer;