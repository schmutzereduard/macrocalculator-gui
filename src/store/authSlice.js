import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AuthApi from "../api/AuthApi";
import {SessionStorageManager} from "../utils/SessionStorageManager";

export const login = createAsyncThunk(
    "auth/login",
    async (loginRequest) => {
        const response = await AuthApi.login(loginRequest);
        return response.data;
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
            state.token = SessionStorageManager.retrieveUserInfo()?.token;
        },
        logout: (state) => {
            state.token = null;
            SessionStorageManager.removeUserInfo();
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, handlePending)
            .addCase(login.rejected, handleRejected)
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload;
                SessionStorageManager.saveUserInfo(action.payload);
            })
            .addCase(fetchProfile.pending, handlePending)
            .addCase(fetchProfile.rejected, handleRejected)
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
                SessionStorageManager.saveUserInfo({
                    profileId: action.payload.id
                });
            });
    }
});

export const { refreshToken, logout } = authSlice.actions;
export default authSlice.reducer;