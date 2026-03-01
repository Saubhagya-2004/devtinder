import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../constants/api";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: false,
    timeout: 15000,
});

// Request interceptor — inject token from AsyncStorage
axiosInstance.interceptors.request.use(
    async (config) => {
        try {
            const token = await AsyncStorage.getItem("token");
            if (token) {
                config.headers["Authorization"] = `Bearer ${token}`;
            }
        } catch (e) { }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;
