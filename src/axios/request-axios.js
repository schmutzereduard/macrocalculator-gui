import { createAxiosInstance } from "./axios-instance";
import { StorageManager } from "../utils/StorageManager";

const instance = createAxiosInstance(window.env.BACK_END_URL);

instance.interceptors.request.use(
    (config) => {

        const profile = StorageManager.retrieve("profile");
        if (profile?.id) {
            const url = new URL(config.url, config.baseURL);
            if (!window.env.COMMON_ENDPOINTS.some(value => url.pathname.endsWith(value))) {
                url.searchParams.append("profileId", profile.id);
                config.url = url.pathname + url.search;
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default instance;