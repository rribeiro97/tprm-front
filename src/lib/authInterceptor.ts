import { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import { authService } from '@/features/auth/services/authService';

/**
 * Token refresh state management
 *
 * CRITICAL: Prevents multiple simultaneous refresh requests (race condition)
 * when multiple API calls fail with 401 at the same time.
 */
let isRefreshing = false;
let refreshSubscribers: Array<() => void> = [];

/**
 * Add callback to queue of requests waiting for token refresh
 */
function subscribeTokenRefresh(callback: () => void) {
  refreshSubscribers.push(callback);
}

/**
 * Execute all queued callbacks after token refresh and clear queue
 */
function onTokenRefreshed() {
  refreshSubscribers.forEach((callback) => callback());
  refreshSubscribers = [];
}

/**
 * Clear all pending refresh subscribers
 */
function clearRefreshSubscribers() {
  refreshSubscribers = [];
}

/**
 * Configure authentication interceptors for Axios instance
 *
 * Response interceptor: Handles 401 errors with automatic token refresh
 *
 * NOTE: No request interceptor needed - cookies are sent automatically
 * with `withCredentials: true` in axios config.
 *
 * @param axiosInstance - Axios instance to configure
 */
export function setupAuthInterceptors(axiosInstance: AxiosInstance) {
  /**
   * RESPONSE INTERCEPTOR
   *
   * Handles 401 Unauthorized errors with automatic token refresh
   *
   * Flow:
   * 1. Request fails with 401 (access token expired)
   * 2. Try to refresh token (backend reads from httpOnly cookie)
   * 3. If refresh succeeds: retry original request (new cookie is set)
   * 4. If refresh fails: redirect to login page
   *
   * IMPORTANT: Prevents multiple simultaneous refresh requests using
   * a queue system. All failed requests wait for the same refresh.
   */
  axiosInstance.interceptors.response.use(
    (response) => response, // Success - pass through
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      // Check if error is 401 and we haven't retried yet
      if (error.response?.status === 401 && !originalRequest._retry) {
        // Don't retry auth endpoints to avoid infinite loops
        if (
          originalRequest.url?.includes('/auth/login') ||
          originalRequest.url?.includes('/auth/refresh')
        ) {
          return Promise.reject(error);
        }

        // If already refreshing, queue this request
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            subscribeTokenRefresh(() => {
              // Retry original request after refresh completes
              axiosInstance(originalRequest)
                .then(resolve)
                .catch(reject);
            });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Attempt to refresh token (backend reads from httpOnly cookie)
          await authService.refresh();

          // Notify all queued requests that refresh succeeded
          onTokenRefreshed();

          // Retry original request (new cookie is already set by backend)
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // Refresh failed - redirect to login
          clearRefreshSubscribers();

          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }

          return Promise.reject(refreshError);
        } finally {
          // Always reset refresh state to prevent memory leaks
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
}
