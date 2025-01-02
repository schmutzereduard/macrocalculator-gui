import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { fetchProfile } from "../../store/profileSlice";
import {useDispatch, useSelector} from "react-redux";
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

function App() {

    const dispatch = useDispatch();
    const { item: token } = useSelector(state => state.auth);

    useEffect(() => {
        if (token) {
            dispatch(fetchProfile());
        }
    }, [dispatch, token]);

    return (
        <Router>
            <div className="page-content">
                <ErrorBoundary>
                    {token && <Sidebar />}
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
