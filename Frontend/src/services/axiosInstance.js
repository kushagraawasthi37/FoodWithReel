import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
});

// Add interceptor to include JWT from localStorage
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
