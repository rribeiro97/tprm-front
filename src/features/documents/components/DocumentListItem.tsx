'use client';

import {
  Delete,
  Description,
  Download,
  PictureAsPdf,
  TextSnippet,
  Visibility,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import type React from 'react';
import { useState } from 'react';
import type { Document, DocumentFileType } from '../types/document.types';

interface DocumentListItemProps {
  document: Document;
  onView: (documentId: string) => Promise<void>;
  onDownload: (documentId: string) => Promise<void>;
  onDelete: (documentId: string) => Promise<void>;
}

const FILE_TYPE_CONFIG: Record<
  DocumentFileType,
  { icon: React.ReactNode; color: 'error' | 'primary' | 'default'; label: string }
> = {
  pdf: { icon: <PictureAsPdf />, color: 'error', label: 'PDF' },
  docx: { icon: <Description />, color: 'primary', label: 'DOCX' },
  txt: { icon: <TextSnippet />, color: 'default', label: 'TXT' },
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}

export default function DocumentListItem({
  document,
  onView,
  onDownload,
  onDelete,
}: DocumentListItemProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionLoading, setActionLoading] = useState<'view' | 'download' | null>(null);

  const fileConfig = FILE_TYPE_CONFIG[document.fileType];

  const handleView = async () => {
    setActionLoading('view');
    try {
      await onView(document.id);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDownload = async () => {
    setActionLoading('download');
    try {
      await onDownload(document.id);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await onDelete(document.id);
      setDeleteDialogOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        <Box sx={{ color: `${fileConfig.color}.main` }}>{fileConfig.icon}</Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="subtitle2"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {document.name}
          </Typography>

          {document.description && (
            <Typography variant="caption" color="text.secondary" component="p">
              {truncateText(document.description, 60)}
            </Typography>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
            <Chip
              label={fileConfig.label}
              size="small"
              color={fileConfig.color}
              variant="outlined"
              sx={{ height: 20, fontSize: 10 }}
            />
            <Typography variant="caption" color="text.secondary">
              {formatDate(document.uploadedAt)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatFileSize(document.fileSize)}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Visualizar">
            <IconButton size="small" onClick={handleView} disabled={actionLoading !== null}>
              {actionLoading === 'view' ? (
                <CircularProgress size={18} />
              ) : (
                <Visibility fontSize="small" />
              )}
            </IconButton>
          </Tooltip>

          <Tooltip title="Baixar">
            <IconButton size="small" onClick={handleDownload} disabled={actionLoading !== null}>
              {actionLoading === 'download' ? (
                <CircularProgress size={18} />
              ) : (
                <Download fontSize="small" />
              )}
            </IconButton>
          </Tooltip>

          <Tooltip title="Excluir">
            <IconButton
              size="small"
              onClick={handleDeleteClick}
              disabled={actionLoading !== null}
              color="error"
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir o documento &quot;{document.name}&quot;? Esta ação não
            pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={isDeleting}>
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={isDeleting}
          >
            {isDeleting ? <CircularProgress size={20} /> : 'Excluir'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
