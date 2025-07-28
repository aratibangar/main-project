import axios from "axios";

axios.defaults.withCredentials = true;

const API = axios.create({
  baseURL: "http://localhost:8080/api", // Your backend base URL
});

// Request interceptor — adds Authorization header to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle common errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {

      // console.log(error)
      // Optional: Auto-logout on token expiry
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      window.location.href = "/sign-in";
    }
    return Promise.reject(error);
  }
);

export default API;
