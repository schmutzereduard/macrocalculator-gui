import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AuthApi from "../api/AuthApi";
import {StorageManager} from "../utils/StorageManager";

export const login = createAsyncThunk(
    "auth/login",
    async ({ loginRequest, remember }) => {
        const response = await AuthApi.login(loginRequest);
        return { token: response.data, remember };
    }
);

export const fetchProfile = createAsyncThunk(
    "auth/fetchProfile",
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

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        profile: null,
        token: null,
        loading: false,
        error: null
    },
    reducers: {
        refreshToken: (state) => {
            state.token = StorageManager.retrieve("token")?.token;
        },
        logout: (state) => {
            state.token = null;
            StorageManager.clear();
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, handlePending)
            .addCase(login.rejected, handleRejected)
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                StorageManager.setStorageType(action.payload.remember);
                StorageManager.save("token", action.payload.token);
            })
            .addCase(fetchProfile.pending, handlePending)
            .addCase(fetchProfile.rejected, handleRejected)
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
                StorageManager.save("profile", action.payload);
            });
    }
});

export const { refreshToken, logout } = authSlice.actions;
export default authSlice.reducer;