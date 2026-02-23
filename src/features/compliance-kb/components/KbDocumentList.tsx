'use client';

import { FolderOpen, Refresh } from '@mui/icons-material';
import { Alert, Box, Button, Pagination, Paper, Skeleton, Typography } from '@mui/material';
import type { ComplianceDocument, PaginationMeta } from '../types/complianceKb.types';
import KbDocumentListItem from './KbDocumentListItem';

interface KbDocumentListProps {
  documents: ComplianceDocument[];
  pagination: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  onPageChange: (page: number) => void;
  onRetry: () => void;
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
          <Skeleton variant="circular" width={28} height={28} />
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
        Nenhum documento na base de conhecimento
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Faça upload do seu primeiro documento usando o formulário ao lado.
      </Typography>
    </Box>
  );
}

export default function KbDocumentList({
  documents,
  pagination,
  isLoading,
  error,
  currentPage,
  onPageChange,
  onRetry,
  onDelete,
}: KbDocumentListProps) {
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
          maxHeight: 400,
          overflow: 'auto',
        }}
      >
        {documents.map((doc) => (
          <KbDocumentListItem key={doc.id} document={doc} onDelete={onDelete} />
        ))}
      </Box>

      {pagination && pagination.totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <Pagination
            count={pagination.totalPages}
            page={currentPage}
            onChange={(_, page) => onPageChange(page)}
            color="primary"
            size="small"
          />
        </Box>
      )}
    </Paper>
  );
}
