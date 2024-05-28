import axios from "axios";
import axiosRetry from 'axios-retry';

const instance = axios.create({
    baseURL: window.properties.BACK_END_URL,
    timeout: parseInt(window.properties.REQUEST_TIMEOUT, 10)
});

axiosRetry(instance, {retries: parseInt(window.properties.AXIOS_RETRIES, 10)});

export default instance;