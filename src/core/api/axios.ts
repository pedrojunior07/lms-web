import axios from "axios";

// API configurada para localhost
const api = axios.create({
  baseURL: "http://localhost:8085/e-learning/api",
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
  baseURL: "http://localhost:8085/e-learning/api",
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