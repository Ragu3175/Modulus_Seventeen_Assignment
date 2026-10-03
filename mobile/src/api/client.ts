import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { storage } from '../utils/storage';

// Default Android emulator maps 10.0.2.2 to host localhost:5000
// Can be changed to LAN IP for physical device testing
export const BASE_API_URL = 'http://10.0.2.2:5000/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor: Attach JWT Bearer Token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await storage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Format error messages
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      // Server responded with an error status (4xx, 5xx)
      const message =
        error.response.data?.message ||
        error.response.data?.errors?.[0]?.message ||
        `Error: ${error.response.statusText}`;

      return Promise.reject(new Error(message));
    } else if (error.request) {
      // Network error (no response)
      return Promise.reject(
        new Error('Cannot connect to server. Please check your backend connection or network.')
      );
    } else {
      return Promise.reject(error);
    }
  }
);
