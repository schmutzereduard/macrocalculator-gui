import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import Navbar from '../pages/Navbar';
import Foods from '../pages/Foods';
import Recipes from '../pages/Recipes';
import Journals from '../pages/Journals';
import './App.css';

const App = () => {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <Routes>
                    <Route path='/' element={<Home />}></Route>
                    <Route path="/foods" element={<Foods />} />
                    <Route path="/recipes" element={<Recipes />} />
                    <Route path="/journals" element={<Journals />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
