import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { BASE_URL, DEFAULT_HEADERS } from "./const";
import Cookies from "js-cookie";

export const baseApi = axios.create({
  baseURL: BASE_URL,
  headers: { ...DEFAULT_HEADERS },
});

baseApi.interceptors.request.use(
  (config) => {
    const token = Cookies.get("access_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

baseApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = Cookies.get("refresh_token");

      if (refreshToken) {
        try {
          const refreshResponse = await axios.post(
            `${BASE_URL}/users/token/refresh/`,
            { refresh: refreshToken },
            { headers: { ...DEFAULT_HEADERS } }
          );

          const { access, refresh } = refreshResponse.data;

          Cookies.set("access_token", access, { secure: true, expires: 0.5 });
          Cookies.set("refresh_token", refresh, { secure: true, expires: 0.5 });

          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${access}`,
          };

          return baseApi(originalRequest);
        } catch (refreshError) {
          Cookies.remove("access_token");
          Cookies.remove("refresh_token");

          if (
            !window.location.pathname.includes("/signin") &&
            !window.location.pathname.includes("/signup")
          ) {
            window.location.href = "/signin";
          }

          return Promise.reject(refreshError);
        }
      } else {
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");

        if (
          !window.location.pathname.includes("/signin") &&
          !window.location.pathname.includes("/signup")
        ) {
          window.location.href = "/signin";
        }
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);
