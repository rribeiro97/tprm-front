import axios from 'axios';
import { setupAuthInterceptors } from './authInterceptor';

/**
 * Axios instance configured with base URL from environment variables
 *
 * This instance is used throughout the application for all API calls.
 * Interceptors are configured automatically below.
 */
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
  withCredentials: true, // Always send cookies with requests
});

// Configure authentication interceptors
setupAuthInterceptors(apiClient);

export default apiClient;
