'use client';

import { FolderOpen, Refresh } from '@mui/icons-material';
import { Alert, Box, Button, Paper, Skeleton, Typography } from '@mui/material';
import type { Document } from '../types/document.types';
import DocumentListItem from './DocumentListItem';

interface DocumentListProps {
  documents: Document[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onView: (documentId: string) => Promise<void>;
  onDownload: (documentId: string) => Promise<void>;
  onDelete: (documentId: string) => Promise<void>;
}

function LoadingSkeleton() {
  return (
    <Box>
      {[1, 2, 3].map((i) => (
        <Box
          key={i}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 2,
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Skeleton variant="circular" width={24} height={24} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="60%" height={24} />
            <Skeleton variant="text" width="40%" height={16} />
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Skeleton variant="circular" width={28} height={28} />
            <Skeleton variant="circular" width={28} height={28} />
            <Skeleton variant="circular" width={28} height={28} />
          </Box>
        </Box>
      ))}
    </Box>
  );
}

function EmptyState() {
  return (
    <Box sx={{ textAlign: 'center', py: 6 }}>
      <FolderOpen sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Nenhum documento cadastrado
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Faça upload do seu primeiro documento usando o formulário ao lado.
      </Typography>
    </Box>
  );
}

export default function DocumentList({
  documents,
  isLoading,
  error,
  onRetry,
  onView,
  onDownload,
  onDelete,
}: DocumentListProps) {
  if (isLoading) {
    return (
      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <LoadingSkeleton />
      </Paper>
    );
  }

  if (error) {
    return (
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" startIcon={<Refresh />} onClick={onRetry}>
            Tentar novamente
          </Button>
        }
      >
        {error}
      </Alert>
    );
  }

  if (documents.length === 0) {
    return (
      <Paper variant="outlined" sx={{ borderRadius: 2 }}>
        <EmptyState />
      </Paper>
    );
  }

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
      <Box
        sx={{
          maxHeight: 300,
          overflow: 'auto',
        }}
      >
        {documents.map((doc) => (
          <DocumentListItem
            key={doc.id}
            document={doc}
            onView={onView}
            onDownload={onDownload}
            onDelete={onDelete}
          />
        ))}
      </Box>
    </Paper>
  );
}
