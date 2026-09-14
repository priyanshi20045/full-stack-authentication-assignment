import axios from "axios";

const API_URL = "https://full-stack-authentication-assignment.onrender.com";

const authApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});
const protectedApi = axios.create({
  baseURL: "https://full-stack-authentication-assignment.onrender.com/api",
  withCredentials: true,
});
protectedApi.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});
protectedApi.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const data = await refreshAccessToken();

        localStorage.setItem(
          "accessToken",
          data.accessToken
        );

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        originalRequest.headers.Authorization =
          `Bearer ${data.accessToken}`;

        return protectedApi(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
export const registerUser = async (userData) => {
  const response = await authApi.post("/register", userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await authApi.post("/login", userData);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await protectedApi.get("/auth/me");

  return response.data;
};

export const refreshAccessToken = async () => {
  const response = await authApi.post("/refresh");
  return response.data;
};

export const logoutUser = async (accessToken) => {
  const response = await authApi.post(
    "/logout",
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};