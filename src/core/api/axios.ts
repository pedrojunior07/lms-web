import axios from "axios";

// API configurada para produção
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://athenarhdlearning.com/e-learning/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const apiMultipart = axios.create({
  baseURL: API_BASE_URL,
});

apiMultipart.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});

export { api, apiMultipart };
