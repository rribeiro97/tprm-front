'use client';

import { Close, CloudUpload, InsertDriveFile } from '@mui/icons-material';
import { Box, Button, IconButton, Paper, Typography } from '@mui/material';
import type React from 'react';
import { useRef, useState } from 'react';

const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/png',
  'image/jpeg',
];

const ACCEPTED_EXTENSIONS = '.pdf,.docx,.xlsx,.png,.jpg,.jpeg';
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

interface KbFileUploadInputProps {
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
  error?: string;
  disabled?: boolean;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function validateFile(file: File): string | null {
  if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
    return 'Tipo de arquivo não suportado. Use PDF, DOCX, XLSX, PNG ou JPEG.';
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'Arquivo muito grande. Máximo 50MB.';
  }
  return null;
}

export default function KbFileUploadInput({
  selectedFile,
  onFileSelect,
  error,
  disabled = false,
}: KbFileUploadInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      onFileSelect(null);
      alert(validationError);
      return;
    }

    onFileSelect(file);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleClear = () => {
    onFileSelect(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (disabled) return;

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      onFileSelect(null);
      alert(validationError);
      return;
    }

    onFileSelect(file);
  };

  return (
    <Box>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_EXTENSIONS}
        onChange={handleChange}
        style={{ display: 'none' }}
        disabled={disabled}
      />

      {!selectedFile ? (
        <Paper
          variant="outlined"
          onClick={disabled ? undefined : handleClick}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          sx={{
            p: 3,
            textAlign: 'center',
            cursor: disabled ? 'default' : 'pointer',
            borderStyle: 'dashed',
            borderWidth: 2,
            borderColor: isDragActive ? 'primary.main' : error ? 'error.main' : 'divider',
            bgcolor: isDragActive
              ? 'primary.50'
              : disabled
                ? 'action.disabledBackground'
                : 'background.paper',
            '&:hover': disabled
              ? {}
              : {
                  borderColor: 'primary.main',
                  bgcolor: 'action.hover',
                },
            transition: 'all 0.2s',
          }}
        >
          <CloudUpload
            sx={{ fontSize: 48, color: isDragActive ? 'primary.main' : 'text.secondary', mb: 1 }}
          />
          <Typography variant="body1" color={isDragActive ? 'primary.main' : 'text.secondary'}>
            {isDragActive ? 'Solte o arquivo aqui' : 'Clique ou arraste um arquivo'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            PDF, DOCX, XLSX, PNG ou JPEG (máx. 50MB)
          </Typography>
        </Paper>
      ) : (
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            borderColor: error ? 'error.main' : 'success.main',
          }}
        >
          <InsertDriveFile color="primary" />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {selectedFile.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatFileSize(selectedFile.size)}
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={handleClear}
            disabled={disabled}
            aria-label="Remover arquivo"
          >
            <Close fontSize="small" />
          </IconButton>
        </Paper>
      )}

      {error && (
        <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
          {error}
        </Typography>
      )}

      {selectedFile && (
        <Button size="small" onClick={handleClick} disabled={disabled} sx={{ mt: 1 }}>
          Trocar arquivo
        </Button>
      )}
    </Box>
  );
}
