'use client';

import { DashboardOutlined, Description, LibraryBooks, LogoutOutlined } from '@mui/icons-material';
import { AppBar, Box, Button, Chip, Container, Paper, Toolbar, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';

/**
 * Dashboard Page
 *
 * Main landing page after login.
 * Protected route - requires authentication.
 */
export default function DashboardPage() {
  const router = useRouter();
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
          <Button
            color="inherit"
            startIcon={<Description />}
            onClick={() => router.push('/documents')}
            sx={{ mr: 1 }}
          >
            Documentos
          </Button>
          <Button
            color="inherit"
            startIcon={<LibraryBooks />}
            onClick={() => router.push('/compliance-kb')}
            sx={{ mr: 2 }}
          >
            Compliance KB
          </Button>
          <Chip label={user?.role || 'USER'} color="secondary" size="small" sx={{ mr: 2 }} />
          <Button color="inherit" startIcon={<LogoutOutlined />} onClick={logout}>
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

          {/* Quick Actions */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Acesso Rápido
            </Typography>
            <Box
              sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap', justifyContent: 'center' }}
            >
              <Button
                variant="contained"
                size="large"
                startIcon={<Description />}
                onClick={() => router.push('/documents')}
              >
                Gestão de Documentos
              </Button>
              <Button
                variant="contained"
                size="large"
                startIcon={<LibraryBooks />}
                onClick={() => router.push('/compliance-kb')}
              >
                Base de Conhecimento
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
