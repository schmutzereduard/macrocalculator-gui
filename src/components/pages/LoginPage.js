import React, { useState } from "react";
import AuthApi from "../../api/AuthApi";
import "./LoginPage.css";
import {useNavigate} from "react-router-dom"; // Assuming App.css contains the shared styles

function LoginPage() {

    const navigate = useNavigate();
    const [ loginRequest, setLoginRequest ] = useState({
        username: "",
        password: ""
    });
    const [ error, setError ] = useState("");

    const handleLogin = async (event) => {

        event.preventDefault();

        try {
            const response = await AuthApi.authenticate(loginRequest);
            const data = response.data;
            const token = data.token;
            localStorage.setItem("authToken", token);
            navigate("/home");
        } catch (error) {
            setError(error.response?.data || "Login failed. Please try again.");
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
                <button type="submit" className="login-button">Log in</button>
                <button type="button" className="register-button" onClick={handleRegister}>Register</button>
            </form>
        </div>
    );
}

export default LoginPage;
