'use client';

import { Folder, LibraryBooks, Logout } from '@mui/icons-material';
import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useComplianceDocuments } from '../hooks/useComplianceDocuments';
import KbDocumentList from './KbDocumentList';
import KbSearchSection from './KbSearchSection';
import KbUploadSection from './KbUploadSection';

export default function ComplianceKbPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const {
    documents,
    pagination,
    isLoading: docsLoading,
    error,
    currentPage,
    refresh,
    loadPage,
    uploadDocument,
    deleteDocument,
  } = useComplianceDocuments();

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

  const handleUpload = async (file: File) => {
    await uploadDocument(file);
  };

  const handleDelete = async (documentId: string) => {
    await deleteDocument(documentId);
  };

  const handlePageChange = (page: number) => {
    loadPage(page);
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
          <LibraryBooks sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Base de Conhecimento
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
            <KbUploadSection onUpload={handleUpload} />
          </Grid>

          {/* Right Section - Library + Search */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={3}>
              {/* Document Library Header */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Folder color="primary" />
                <Typography variant="h6" fontWeight={600}>
                  Biblioteca de Documentos
                </Typography>
                {!docsLoading && !error && pagination && (
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                    {pagination.total} documento{pagination.total !== 1 ? 's' : ''}
                  </Typography>
                )}
              </Box>

              <KbDocumentList
                documents={documents}
                pagination={pagination}
                isLoading={docsLoading}
                error={error}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onRetry={refresh}
                onDelete={handleDelete}
              />

              <KbSearchSection />
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
