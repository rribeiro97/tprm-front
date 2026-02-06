'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Paper,
  Link as MuiLink,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  LoginOutlined,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';

/**
 * Login Form Validation Schema
 *
 * Defines validation rules for email and password fields
 */
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido'),
  password: z
    .string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Login Form Component
 *
 * Features:
 * - Email and password validation with Zod
 * - Show/hide password toggle
 * - Loading state during authentication
 * - Error messages from API
 * - Responsive design
 * - Keyboard shortcuts (Enter to submit)
 */
export default function LoginForm() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Prevent concurrent submissions
  const isSubmittingRef = useRef(false);

  // Track if component is mounted
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur', // Validate on blur for better UX
  });

  /**
   * Handle form submission
   */
  const onSubmit = async (data: LoginFormData) => {
    // Prevent concurrent submissions
    if (isSubmittingRef.current) {
      return;
    }

    try {
      isSubmittingRef.current = true;
      setIsSubmitting(true);
      setApiError(null);

      await login(data);

      // Note: Redirect is handled by AuthContext after state update
    } catch (error) {
      // Only update state if component is still mounted
      if (isMountedRef.current) {
        const message = error instanceof Error ? error.message : 'Falha ao fazer login. Tente novamente.';
        setApiError(message);
      }
    } finally {
      if (isMountedRef.current) {
        setIsSubmitting(false);
      }
      isSubmittingRef.current = false;
    }
  };

  /**
   * Toggle password visibility
   */
  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          maxWidth: 400,
          width: '100%',
          borderRadius: 2,
        }}
      >
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <LoginOutlined sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            TPRM Login
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Entre com suas credenciais para acessar o sistema
          </Typography>
        </Box>

        {/* API Error Alert */}
        {apiError && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setApiError(null)}>
            {apiError}
          </Alert>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Email Field */}
          <TextField
            {...register('email')}
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            autoComplete="email"
            autoFocus
            error={!!errors.email}
            helperText={errors.email?.message}
            disabled={isSubmitting}
          />

          {/* Password Field */}
          <TextField
            {...register('password')}
            label="Senha"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            margin="normal"
            autoComplete="current-password"
            error={!!errors.password}
            helperText={errors.password?.message}
            disabled={isSubmitting}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleTogglePassword}
                    edge="end"
                    disabled={isSubmitting}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Forgot Password Link */}
          <Box sx={{ textAlign: 'right', mt: 1, mb: 2 }}>
            <MuiLink
              href="#"
              variant="body2"
              sx={{
                textDecoration: 'none',
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' },
              }}
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                // TODO: Implement forgot password
                alert('Funcionalidade "Esqueci minha senha" em desenvolvimento');
              }}
            >
              Esqueceu sua senha?
            </MuiLink>
          </Box>

          {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isSubmitting}
            sx={{
              mt: 2,
              mb: 2,
              height: 48,
              textTransform: 'none',
              fontSize: '1rem',
            }}
          >
            {isSubmitting ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
