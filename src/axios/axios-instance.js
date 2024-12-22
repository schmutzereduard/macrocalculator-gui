import axios from "axios";
import axiosRetry from "axios-retry";
import {SessionStorageManager} from "../utils/SessionStorageManager";

export function createAxiosInstance(baseURL, additionalParams) {

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

    axiosRetry(instance, { retries: window.env.AXIOS_RETRIES });

    return instance;
}
