import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AuthApi from "../api/AuthApi";

export const fetchProfile = createAsyncThunk(
    "profile/fetchProfile",
    async () => {
        const response = await AuthApi.getUserProfile();
        return response.data;
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

const profileSlice = createSlice({
    name: 'profile',
    initialState: {
        item: null,
        loading: false,
        error: null
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfile.pending, handlePending)
            .addCase(fetchProfile.rejected, handleRejected)
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.item = action.payload;
            });
    },
});

export default profileSlice.reducer;