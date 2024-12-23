import { createAxiosInstance } from "./axios-instance";
import { SessionStorageManager } from "../utils/SessionStorageManager";

const instance = createAxiosInstance(window.env.BACK_END_URL);

instance.interceptors.request.use(
    (config) => {

        const userInfo = SessionStorageManager.retrieveUserInfo();
        if (userInfo?.profileId) {
            const url = new URL(config.url, config.baseURL);
            if (!window.env.COMMON_ENDPOINTS.some(value => url.pathname.endsWith(value))) {
                url.searchParams.append("profileId", userInfo.profileId);
                config.url = url.pathname + url.search;
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default instance;