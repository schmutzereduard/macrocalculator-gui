import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { fetchProfile } from "../features/profileSlice";
import { useDispatch } from "react-redux";
import LoginPage from '../components/pages/LoginPage';
import Home from '../components/pages/Home';
import Profile from "../components/pages/Profile";
import Foods from '../components/pages/Foods';
import Recipes from '../components/pages/Recipes';
import Journals from '../components/pages/Journals';
import ProtectedRoute from "../components/app/ProtectedRoute";
import ErrorBoundary from "../error/ErrorBoundary";
import './App.css';

function App() {

    const dispatch = useDispatch();
    const token = sessionStorage.getItem("authToken");

    useEffect(() => {
        if (token) {
            dispatch(fetchProfile());
        }
    }, [dispatch, token]);

    return (
        <Router>
            <div className="App">
                <ErrorBoundary>
                    <Routes>
                        <Route path='/' element={<LoginPage />} />
                        <Route
                            path='/profile'
                            element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            } />
                        <Route
                            path='/home'
                            element={
                                <ProtectedRoute>
                                    <Home />
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
