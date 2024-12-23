import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <>
            {/* Burger Icon */}
            <div className="burger-icon" onClick={toggleMenu}>
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
            </div>

            {/* Sidebar */}
            <div className={`sidebar ${menuOpen ? 'open' : ''}`}>
                <h2>Macro Calculator</h2>
                <div className="nav-buttons">
                    <Link to="/profile" className="nav-button" onClick={toggleMenu}>Profile</Link>
                    <Link to="/foods" className="nav-button" onClick={toggleMenu}>Foods</Link>
                    <Link to="/recipes" className="nav-button" onClick={toggleMenu}>Recipes</Link>
                    <Link to="/journals" className="nav-button" onClick={toggleMenu}>Journals</Link>
                </div>
            </div>

            {/* Overlay */}
            {menuOpen && <div className="overlay" onClick={toggleMenu}></div>}
        </>
    );
};

export default Sidebar;
