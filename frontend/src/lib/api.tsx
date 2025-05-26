// lib/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // using cookies on server
});

/*
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
*/


export function handleApiError(err: unknown ) {
  if (axios.isAxiosError(err)) {
    if (err.response) {
      return err.response.data?.message || 'Server returned an error.';
    } else{
      return 'Network error: Unable to reach the server.';
    }
  } else {
    return 'An unexpected error occurred.';
  }
}

export default api;
