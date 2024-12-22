import { createAxiosInstance } from "./axios-instance";

const instance = createAxiosInstance(window.env.AUTH_URL);

export default instance;