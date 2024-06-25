import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <div className="navbar">
            <h2>Macro Calculator</h2>
            <div className="nav-buttons">
                <Link to="/foods" className="nav-button">Foods</Link>
                <Link to="/recipes" className="nav-button">Recipes</Link>
                <Link to="/planner" className="nav-button">Planner</Link>
                <Link to="/journal" className="nav-button">Journal</Link>
            </div>
        </div>
    );
};

export default Navbar;
