import axios from "axios";
import axiosRetry from 'axios-retry';

const instance = axios.create({
    baseURL: "http://localhost:8088/api/",
    timeout: "30000"
});

instance.interceptors.request.use(config => {
    const token = sessionStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

axiosRetry(instance, { retries: 3 });

export default instance;