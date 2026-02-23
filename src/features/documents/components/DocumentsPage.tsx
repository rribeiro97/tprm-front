'use client';

import { Description, Logout } from '@mui/icons-material';
import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Toolbar,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDocuments } from '../hooks/useDocuments';
import DocumentLibrarySection from './DocumentLibrarySection';
import DocumentUploadSection from './DocumentUploadSection';

export default function DocumentsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const {
    documents,
    isLoading: docsLoading,
    error,
    refresh,
    uploadDocument,
    deleteDocument,
    downloadDocument,
  } = useDocuments();

  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  const handleLogout = async () => {
    await logout();
  };

  const handleUpload = async (name: string, description: string | undefined, file: File) => {
    await uploadDocument(name, description, file);
  };

  const handleView = async (documentId: string) => {
    await downloadDocument(documentId);
  };

  const handleDownload = async (documentId: string) => {
    await downloadDocument(documentId);
  };

  const handleDelete = async (documentId: string) => {
    await deleteDocument(documentId);
  };

  // Show loading while checking auth
  if (authLoading || !isAuthenticated) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* App Bar */}
      <AppBar position="static">
        <Toolbar>
          <Description sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Gestão de Documentos
          </Typography>
          {user && (
            <Typography variant="body2" sx={{ mr: 2 }}>
              {user.firstName} {user.lastName}
            </Typography>
          )}
          <Button color="inherit" onClick={handleLogout} startIcon={<Logout />}>
            Sair
          </Button>
        </Toolbar>
      </AppBar>

      {/* Content */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {/* Left Section - Upload */}
          <Grid size={{ xs: 12, md: 4 }}>
            <DocumentUploadSection onUpload={handleUpload} />
          </Grid>

          {/* Right Section - Library + Chat */}
          <Grid size={{ xs: 12, md: 8 }}>
            <DocumentLibrarySection
              documents={documents}
              isLoading={docsLoading}
              error={error}
              onRetry={refresh}
              onView={handleView}
              onDownload={handleDownload}
              onDelete={handleDelete}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
