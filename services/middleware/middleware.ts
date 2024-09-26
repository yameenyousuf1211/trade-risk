import axios from "axios";

const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
console.log(BASE_URL, "BASE_URL");
const api = axios.create({
  baseURL:
    BASE_URL === undefined ? "https://trade.yameenyousuf.com/api" : BASE_URL,
  // baseURL: "https://trade-prod.yameenyousuf.com/api",

  // baseURL: "http://localhost:8080/api",
  //baseURL: "https://trade.yameenyousuf.com/api",
  // baseURL: "http://128.199.30.51:8080/api",
});

api.interceptors.request.use(
  async (config) => {
    const accessToken = getAccessToken();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
