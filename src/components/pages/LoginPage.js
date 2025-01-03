import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../store/authSlice";
import "./LoginPage.css";

function LoginPage() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [ remember, setRemember ] = useState(false);
    const { error } = useSelector(state => state.auth);
    const [ loginRequest, setLoginRequest ] = useState({
        username: "",
        password: ""
    });

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            await dispatch(login({ loginRequest, remember }));
            navigate("/");
        } catch (error) {
        }
    };

    const handleRegister = () => {

        console.log("Redirecting to registration page...");
    };

    const handleInputChange = (event) => {

        const { name, value } = event.target;
        setLoginRequest((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <div className="login-page">
            <form onSubmit={handleLogin} className="login-form">
                <h2>Login</h2>
                {error && <p className="error-message">{error}</p>}
                <div className="form-group">
                    <input
                        type="text"
                        name="username"
                        placeholder="Enter username"
                        value={loginRequest.username}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter password"
                        value={loginRequest.password}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="checkbox"
                        name="remember"
                        onChange={() => setRemember(!remember)}
                    />
                    <label>Remember me</label>
                </div>
                <button type="submit" className="login-button">Log in</button>
                <button type="button" className="register-button" onClick={handleRegister}>Register</button>
            </form>
        </div>
    );
}

export default LoginPage;
