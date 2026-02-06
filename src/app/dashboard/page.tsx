'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  AppBar,
  Toolbar,
  Chip,
} from '@mui/material';
import { LogoutOutlined, DashboardOutlined } from '@mui/icons-material';
import { useAuth } from '@/features/auth/hooks/useAuth';

/**
 * Dashboard Page
 *
 * Main landing page after login.
 * Protected route - requires authentication.
 */
export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* App Bar */}
      <AppBar position="static">
        <Toolbar>
          <DashboardOutlined sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            TPRM Dashboard
          </Typography>
          <Chip
            label={user?.role || 'USER'}
            color="secondary"
            size="small"
            sx={{ mr: 2 }}
          />
          <Button
            color="inherit"
            startIcon={<LogoutOutlined />}
            onClick={logout}
          >
            Sair
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: 400,
          }}
        >
          <Typography variant="h4" gutterBottom>
            Bem-vindo ao TPRM!
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Você está autenticado com sucesso.
          </Typography>

          {/* User Info */}
          {user && (
            <Box sx={{ mt: 4, textAlign: 'left', width: '100%', maxWidth: 500 }}>
              <Typography variant="h6" gutterBottom>
                Informações do Usuário:
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Nome:</strong> {user.firstName} {user.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  <strong>Email:</strong> {user.email}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  <strong>Role:</strong> {user.role}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Next Steps */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Esta é uma página de dashboard temporária.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Funcionalidades completas serão implementadas em breve.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
