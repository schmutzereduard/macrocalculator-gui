import axios from "axios";
import axiosRetry from "axios-retry";
import {SessionStorageManager} from "../utils/SessionStorageManager";

export function createAxiosInstance(baseURL) {

    const instance = axios.create({
        baseURL: baseURL,
        timeout: window.env.REQUEST_TIMEOUT,
    });

    instance.interceptors.request.use(
        (config) => {
            const userInfo = SessionStorageManager.retrieveUserInfo();
            if (userInfo?.token) {
                config.headers.Authorization = `Bearer ${userInfo.token}`;
            }

            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    instance.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            if (error.response && error.response.data) {
                error.message = error.response.data; // Attach response body to the error message
            }
            return Promise.reject(error);
        }
    );

    axiosRetry(instance, { retries: window.env.AXIOS_RETRIES });

    return instance;
}
