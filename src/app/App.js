import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../components/pages/Home';
import Navbar from '../components/app/Navbar';
import Foods from '../components/pages/Foods';
import Recipes from '../components/pages/Recipes';
import Journals from '../components/pages/Journals';
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path="/foods" element={<Foods />} />
                    <Route path="/recipes" element={<Recipes />} />
                    <Route path="/journals" element={<Journals />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;