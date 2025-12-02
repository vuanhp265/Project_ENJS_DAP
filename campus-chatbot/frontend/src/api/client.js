import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// auto attach token
api.interceptors.request.use((config) => {
  const tk = localStorage.getItem("token");
  if (tk) config.headers.Authorization = "Bearer " + tk;
  return config;
});

// auto logout on invalid token
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);
