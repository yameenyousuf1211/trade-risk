import axios from "axios";

const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

const api = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_API_URL,
  // baseURL: "https://trade.yameenyousuf.com/api",
  baseURL: "https://trade-prod.yameenyousuf.com/api",
});
// http://128.199.30.51:8080/api
// https://trade-prod.yameenyousuf.com/api
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
