import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, refreshToken } from "../../store/authSlice";
import LoginPage from '../pages/LoginPage';
import Home from '../pages/Home';
import Profile from "../pages/Profile";
import Foods from '../pages/Foods';
import Recipes from '../pages/Recipes';
import Journals from '../pages/Journals';
import ProtectedRoute from "./ProtectedRoute";
import Sidebar from "../sidebar/Sidebar";
import ErrorBoundary from "../../error/ErrorBoundary";
import './App.css';
import Recipe from "../pages/Recipe";

function App() {

    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!token) {
            dispatch(refreshToken());
        } else {
            dispatch(fetchProfile());
        }
    }, [dispatch, token]);

    return (
        <Router>
            <div className="page-content">
                <ErrorBoundary>
                    {token && <Sidebar />}
                    <Routes>
                        <Route path='/login' element={<LoginPage />} />
                        <Route
                            path='/'
                            element={
                                <ProtectedRoute>
                                    <Home />
                                </ProtectedRoute>
                            } />
                        <Route
                            path='/profile'
                            element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            } />
                        <Route
                            path="/foods"
                            element={
                                <ProtectedRoute>
                                    <Foods />
                                </ProtectedRoute>
                            } />
                        <Route
                            path="/recipes"
                            element={
                                <ProtectedRoute>
                                    <Recipes />
                                </ProtectedRoute>
                            } />
                        <Route
                            path="/recipe/:id"
                            element={
                                <ProtectedRoute>
                                    <Recipe />
                                </ProtectedRoute>
                            }
                            />
                        <Route
                            path="/journals"
                            element={
                                <ProtectedRoute>
                                    <Journals />
                                </ProtectedRoute>
                            } />
                    </Routes>
                </ErrorBoundary>
            </div>
        </Router>
    );
}

export default App;
