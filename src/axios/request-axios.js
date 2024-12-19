import axios from "axios";
import axiosRetry from 'axios-retry';

const instance = axios.create({
    baseURL: "http://localhost:8080",
    timeout: "30000"
});

axiosRetry(instance, { retries: 3 });

instance.interceptors.request.use(config => {
    const token = sessionStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default instance;