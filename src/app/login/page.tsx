'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '@/features/auth/components/LoginForm';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Box, CircularProgress } from '@mui/material';

/**
 * Login Page
 *
 * Features:
 * - Renders login form
 * - Redirects to dashboard if already authenticated
 * - Shows loading state during auth check
 */
export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const isMountedRef = useRef(true);

  /**
   * Redirect to dashboard if already authenticated
   */
  useEffect(() => {
    if (!isLoading && isAuthenticated && isMountedRef.current) {
      router.replace('/dashboard');
      isMountedRef.current = false;
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [isAuthenticated, isLoading, router]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Don't render login form if already authenticated (will redirect)
  if (isAuthenticated) {
    return null;
  }

  return <LoginForm />;
}
