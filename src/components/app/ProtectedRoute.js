import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("authToken");

    // If no token is found, redirect to the login page
    if (!token) {
        return <Navigate to="/" />;
    }

    // If authenticated, render the children (protected components)
    return children;
};

export default ProtectedRoute;