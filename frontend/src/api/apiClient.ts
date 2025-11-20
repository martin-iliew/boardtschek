import axios from "axios";
import {
  getToken,
  setToken,
  getRefreshToken,
  setRefreshToken,
  logoutUser,
} from "@/lib/utils";
import { ROUTES } from "@/routes";

const apiBaseUrl = "http://localhost:5050";

const apiClient = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let refreshQueue: Array<(token: string | null, err?: unknown) => void> = [];

apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (!error.response || !originalRequest) {
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshTokenValue = getRefreshToken();
      if (!refreshTokenValue) {
        logoutUser();
        window.location.href = ROUTES.LOGIN;
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push((newToken, err) => {
            if (err || !newToken) {
              reject(err ?? new Error("Refresh token failed"));
              return;
            }
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshResponse = await axios.post(
          `${apiBaseUrl}/refresh`,
          { refreshToken: refreshTokenValue },
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data?.accessToken as string;
        const newRefreshToken = refreshResponse.data?.refreshToken as string;

        setToken(newAccessToken);
        setRefreshToken(newRefreshToken);

        refreshQueue.forEach((cb) => cb(newAccessToken));
        refreshQueue = [];
        isRefreshing = false;

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);

        isRefreshing = false;
        refreshQueue.forEach((cb) => cb(null, refreshError));
        refreshQueue = [];

        logoutUser();
        window.location.href = ROUTES.LOGIN;

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
