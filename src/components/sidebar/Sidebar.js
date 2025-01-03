import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import { Link } from 'react-router-dom';
import { logout } from "../../store/authSlice";
import './Sidebar.css';

const Sidebar = () => {

    const dispatch = useDispatch();
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleLogout = () => {
        dispatch(logout());
        toggleMenu();
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
                    <Link to="/" className="nav-button" onClick={handleLogout}>Logout</Link>
                </div>
            </div>

            {/* Overlay */}
            {menuOpen && <div className="overlay" onClick={toggleMenu}></div>}
        </>
    );
};

export default Sidebar;
