import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Foods from '../components/Foods';
import Meals from '../components/Meals';
import Planner from '../components/Planner';
import Calculator from '../components/Calculator';
import './App.css';

const App = () => {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <Routes>
                    <Route path="/foods" element={<Foods />} />
                    <Route path="/meals" element={<Meals />} />
                    <Route path="/planner" element={<Planner />} />
                    <Route path="/calculator" element={<Calculator />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
