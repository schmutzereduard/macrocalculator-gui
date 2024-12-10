import axios from "axios";
import axiosRetry from 'axios-retry';

const instance = axios.create({
    baseURL: "http://localhost:8088/api/auth",
    timeout: "30000"
});

axiosRetry(instance, { retries: 3});

export default instance;