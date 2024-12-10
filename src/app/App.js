import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import LoginPage from '../components/pages/LoginPage';
import Home from '../components/pages/Home';
import Foods from '../components/pages/Foods';
import Recipes from '../components/pages/Recipes';
import Journals from '../components/pages/Journals';
import './App.css';
import ErrorBoundary from "../error/ErrorBoundary";
import ProtectedRoute from "../components/app/ProtectedRoute";

function App() {
    return (
        <Router>
            <div className="App">
                <ErrorBoundary>
                    <Routes>
                        <Route path='/' element={<LoginPage />} />
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
