import { AxiosError } from 'axios';
import apiClient from '@/lib/axios';
import type { AuthResponse, LoginCredentials, LogoutResponse } from '../types/auth.types';
import { authServiceMock } from './authService.mock';

// Auth has its own mock toggle (NEXT_PUBLIC_USE_MOCK_AUTH) for when
// we need real backend for other services but don't have auth credentials yet
const USE_MOCK =
  process.env.NEXT_PUBLIC_USE_MOCK === 'true' || process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true';

/**
 * Authentication Service
 *
 * Handles all authentication-related API calls:
 * - Login
 * - Token refresh
 * - Logout
 *
 * SECURITY NOTE: Tokens are managed as httpOnly cookies by the backend.
 * Frontend never has direct access to tokens.
 */
export const authService = {
  /**
   * Authenticate user with email and password
   *
   * Backend sets httpOnly cookies with access and refresh tokens.
   *
   * @param credentials - User email and password
   * @returns User data
   * @throws Error with message from API response
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    if (USE_MOCK) {
      return authServiceMock.login(credentials);
    }

    try {
      const response = await apiClient.post<AuthResponse>('/api/auth/login', credentials, {
        withCredentials: true, // Send/receive cookies
      });
      return response.data;
    } catch (error) {
      // Extract error message from API response
      if (error instanceof AxiosError) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          'Falha ao fazer login. Tente novamente.';
        throw new Error(message);
      }
      throw new Error('Falha ao fazer login. Tente novamente.');
    }
  },

  /**
   * Refresh access token using refresh token from httpOnly cookie
   *
   * @returns Updated user data
   * @throws Error if refresh fails (user must login again)
   *
   * NOTE: Backend reads refresh token from httpOnly cookie automatically.
   * Backend implements token rotation - sets new cookies on each refresh.
   */
  async refresh(): Promise<AuthResponse> {
    if (USE_MOCK) {
      return authServiceMock.refresh();
    }

    try {
      const response = await apiClient.post<AuthResponse>(
        '/api/auth/refresh',
        {},
        {
          withCredentials: true, // Send cookies
        }
      );
      return response.data;
    } catch (error) {
      // If refresh fails, user must login again
      if (error instanceof AxiosError) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          'Sessão expirada. Faça login novamente.';
        throw new Error(message);
      }
      throw new Error('Sessão expirada. Faça login novamente.');
    }
  },

  /**
   * Logout user and clear httpOnly cookies
   *
   * Backend clears the authentication cookies.
   */
  async logout(): Promise<LogoutResponse> {
    if (USE_MOCK) {
      return authServiceMock.logout();
    }

    try {
      const response = await apiClient.post<LogoutResponse>(
        '/api/auth/logout',
        {},
        {
          withCredentials: true, // Send cookies to be cleared
        }
      );
      return response.data;
    } catch (error) {
      // Even if logout fails, clear client-side state
      if (error instanceof AxiosError) {
        const message = error.response?.data?.message || 'Erro ao fazer logout.';
        throw new Error(message);
      }
      throw new Error('Erro ao fazer logout.');
    }
  },
};
