'use client';

import { Folder } from '@mui/icons-material';
import { Box, Divider, Paper, Typography } from '@mui/material';
import type { Document } from '../types/document.types';
import DocumentChat from './DocumentChat';
import DocumentList from './DocumentList';

interface DocumentLibrarySectionProps {
  documents: Document[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onView: (documentId: string) => Promise<void>;
  onDownload: (documentId: string) => Promise<void>;
  onDelete: (documentId: string) => Promise<void>;
}

export default function DocumentLibrarySection({
  documents,
  isLoading,
  error,
  onRetry,
  onView,
  onDownload,
  onDelete,
}: DocumentLibrarySectionProps) {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Folder color="primary" />
        <Typography variant="h6" fontWeight={600}>
          Biblioteca de Documentos
        </Typography>
        {!isLoading && !error && (
          <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
            {documents.length} documento{documents.length !== 1 ? 's' : ''}
          </Typography>
        )}
      </Box>

      {/* Document List */}
      <DocumentList
        documents={documents}
        isLoading={isLoading}
        error={error}
        onRetry={onRetry}
        onView={onView}
        onDownload={onDownload}
        onDelete={onDelete}
      />

      <Divider sx={{ my: 3 }} />

      {/* Chat Section */}
      <Box sx={{ flex: 1, minHeight: 350 }}>
        <DocumentChat documents={documents} />
      </Box>
    </Paper>
  );
}
