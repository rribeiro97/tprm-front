// types/auth.ts

export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * User returned by backend after successful authentication
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'ANALYST' | 'VIEWER' | 'VENDOR';
  companyId: string;
  companyName?: string;
}

/**
 * Response from login/refresh endpoints
 * Tokens are set as httpOnly cookies by backend
 */
export interface AuthResponse {
  success: boolean;
  user: User;
}

/**
 * Response from logout endpoint
 */
export interface LogoutResponse {
  success: boolean;
  message: string;
}

export interface AuthError {
  error: string;
  message?: string;
  details?: string[];
}

/**
 * Auth state (no tokens stored - managed by httpOnly cookies)
 */
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
