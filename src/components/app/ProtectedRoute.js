import React from "react";
import { Navigate } from "react-router-dom";
import { StorageManager } from "../../utils/StorageManager";

const ProtectedRoute = ({ children }) => {
    const token = StorageManager.retrieve("token");
    return token ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;