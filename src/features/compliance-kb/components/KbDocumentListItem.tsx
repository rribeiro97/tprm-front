'use client';

import { Delete, Description, Image, PictureAsPdf, TableChart } from '@mui/icons-material';
import {
  Box,
  Button,
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
import type { ComplianceDocument } from '../types/complianceKb.types';
import KbDocumentStatusBadge from './KbDocumentStatusBadge';

interface KbDocumentListItemProps {
  document: ComplianceDocument;
  onDelete: (documentId: string) => Promise<void>;
}

const FILE_TYPE_ICONS: Record<string, { icon: React.ReactNode; label: string }> = {
  'application/pdf': { icon: <PictureAsPdf />, label: 'PDF' },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
    icon: <Description />,
    label: 'DOCX',
  },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
    icon: <TableChart />,
    label: 'XLSX',
  },
  'image/png': { icon: <Image />, label: 'PNG' },
  'image/jpeg': { icon: <Image />, label: 'JPEG' },
};

const DEFAULT_ICON = { icon: <Description />, label: 'Arquivo' };

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

export default function KbDocumentListItem({ document, onDelete }: KbDocumentListItemProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fileConfig = FILE_TYPE_ICONS[document.fileType] || DEFAULT_ICON;
  const isProcessing = document.status === 'PROCESSING';

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
        <Box sx={{ color: 'primary.main' }}>{fileConfig.icon}</Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="subtitle2"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {document.fileName}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
            <KbDocumentStatusBadge status={document.status} />
            <Typography variant="caption" color="text.secondary">
              {formatDate(document.uploadedAt)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatFileSize(document.fileSize)}
            </Typography>
            {document.usageCount > 0 && (
              <Typography variant="caption" color="text.secondary">
                {document.usageCount} uso{document.usageCount !== 1 ? 's' : ''}
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title={isProcessing ? 'Aguarde o processamento' : 'Excluir'}>
            <span>
              <IconButton
                size="small"
                onClick={handleDeleteClick}
                disabled={isProcessing}
                color="error"
              >
                <Delete fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Box>

      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir o documento &quot;{document.fileName}&quot;? Esta ação
            não pode ser desfeita.
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
