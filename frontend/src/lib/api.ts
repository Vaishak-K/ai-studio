import axios, { AxiosError } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export interface Generation {
  id: string;
  prompt: string;
  style: string;
  imageUrl: string;
  status: string;
  createdAt: string;
}

export const authAPI = {
  signup: async (email: string, password: string) => {
    const { data } = await api.post("/auth/signup", { email, password });
    return data;
  },
  login: async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", { email, password });
    return data;
  },
};

export const generationsAPI = {
  create: async (formData: FormData, signal?: AbortSignal) => {
    const { data } = await api.post<Generation>("/generations", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      signal,
    });
    console.log("Return Data:", data);
    return data;
  },
  getRecent: async (limit = 5) => {
    const { data } = await api.get<Generation[]>(`/generations?limit=${limit}`);
    return data;
  },
};
