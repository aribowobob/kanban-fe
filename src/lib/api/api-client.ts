import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { getCookie } from "cookies-next";
import { devLog } from "../utils/common";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to handle authentication
apiClient.interceptors.request.use((config) => {
  // Get token from cookie and add to Authorization header
  const token = getCookie("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle expired tokens, unauthorized access, etc.
    if (error.response?.status === 401) {
      devLog("[API Client] Received 401 Unauthorized error");

      // Redirect to login page on 401 error
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export async function getData<T>(
  url: string,
  options?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.get<T>(url, options);
  return response.data;
}

export async function postData<T, D = unknown>(
  url: string,
  data?: D,
  options?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.post<T>(url, data, options);
  return response.data;
}

export async function putData<T, D = unknown>(
  url: string,
  data?: D,
  options?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.put<T>(url, data, options);
  return response.data;
}

export async function deleteData<T>(
  url: string,
  options?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.delete<T>(url, options);
  return response.data;
}

export function handleApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message || error.message || "Something went wrong"
    );
  }
  return "Unknown error occurred";
}
