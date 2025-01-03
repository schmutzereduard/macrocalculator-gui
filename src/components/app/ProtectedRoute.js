import React from "react";
import { Navigate } from "react-router-dom";
import { SessionStorageManager } from "../../utils/SessionStorageManager";

const ProtectedRoute = ({ children }) => {
    const userInfo = SessionStorageManager.retrieveUserInfo();
    return userInfo?.token ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;