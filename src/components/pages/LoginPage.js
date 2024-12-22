import React, { useState } from "react";
import "./LoginPage.css";
import {useNavigate} from "react-router-dom";
import {fetchProfile} from "../../features/profileSlice";
import { useDispatch } from "react-redux";
import { login } from "../../features/authSlice";
import { SessionStorageManager } from "../../utils/SessionStorageManager";

function LoginPage() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [ loginRequest, setLoginRequest ] = useState({
        username: "",
        password: ""
    });
    const [ error, setError ] = useState("");

    const handleLogin = async (event) => {

        event.preventDefault();

        try {
            const loginInfo = await dispatch(login(loginRequest));
            SessionStorageManager.saveUserInfo(loginInfo.payload);

            const profileInfo = await dispatch(fetchProfile());
            SessionStorageManager.saveUserInfo({
                profileId: profileInfo.payload.id
            });

            navigate("/home");
        } catch (error) {
            console.log(error);
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
