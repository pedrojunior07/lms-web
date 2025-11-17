import axios from "axios";

// CORREÇÃO: Adicione o IP que está faltando
const api = axios.create({
  baseURL: "http://192.250.224.214:8585/e-learning/api", // IP estava faltando aqui
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
  baseURL: "http://192.250.224.214:8585/e-learning/api",
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