import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AuthApi from "../api/AuthApi";

export const login = createAsyncThunk(
    "auth/login",
    async (loginRequest) => {
        const response = await AuthApi.login(loginRequest);
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

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        item: null,
        loading: false,
        error: null
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, handlePending)
            .addCase(login.rejected, handleRejected)
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.item = action.payload;
            });
    },
});

export default authSlice.reducer;