'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/features/auth/services/authService';
import {
  User,
  LoginCredentials,
} from '@/features/auth/types/auth.types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

interface InternalAuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Auth Provider Component
 *
 * Manages authentication state globally using React Context.
 * Uses httpOnly cookies for secure token storage (managed by backend).
 *
 * SECURITY:
 * - Access and refresh tokens are stored in httpOnly cookies (immune to XSS)
 * - Frontend never has direct access to tokens
 * - Cookies are automatically sent with all API requests
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<InternalAuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true, // Start as loading to check existing session
  });

  // Prevent race conditions between auth operations
  const authOperationInProgress = useRef(false);

  // Track if component is mounted to prevent state updates after unmount
  const isMountedRef = useRef(true);

  /**
   * Login user with credentials
   */
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      // Prevent concurrent login attempts
      if (authOperationInProgress.current) {
        throw new Error('Authentication operation already in progress');
      }

      try {
        authOperationInProgress.current = true;

        const response = await authService.login(credentials);

        // Backend sets httpOnly cookies automatically
        // Just store user data in state
        if (isMountedRef.current) {
          setState({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
          });

          // Redirect to dashboard immediately after successful login
          router.replace('/dashboard');
        }
      } catch (error) {
        if (isMountedRef.current) {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
        throw error; // Re-throw to be handled by login form
      } finally {
        authOperationInProgress.current = false;
      }
    },
    [router]
  );

  /**
   * Logout user - clear cookies and state
   */
  const logout = useCallback(async () => {
    try {
      // Call backend to clear httpOnly cookies
      await authService.logout();
    } catch (error) {
      // Even if backend call fails, clear client state
      console.error('Logout failed:', error);
    } finally {
      // Clear state
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });

      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  }, []);

  /**
   * Initialize auth state on mount
   *
   * Checks if user has valid cookies by calling a "me" endpoint
   * or by attempting to refresh the token.
   */
  useEffect(() => {
    isMountedRef.current = true;
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Try to refresh token to check if user has valid session
        // Backend will read from httpOnly cookie
        const response = await authService.refresh();

        if (mounted && isMountedRef.current) {
          setState({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
          });
        }
      } catch {
        // No valid session - user is not authenticated
        if (mounted && isMountedRef.current) {
          setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      }
    };

    initializeAuth();

    // Cleanup: mark component as unmounted
    return () => {
      mounted = false;
      isMountedRef.current = false;
    };
  }, []); // Run only once on mount

  const value: AuthContextType = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access auth context
 *
 * @throws Error if used outside AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
