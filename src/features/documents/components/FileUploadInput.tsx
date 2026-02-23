'use client';

import { Close, CloudUpload, InsertDriveFile } from '@mui/icons-material';
import { Box, Button, IconButton, Paper, Typography } from '@mui/material';
import type React from 'react';
import { useRef } from 'react';

const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
];

const ACCEPTED_EXTENSIONS = '.pdf,.docx,.txt';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

interface FileUploadInputProps {
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
    return 'Tipo de arquivo não suportado. Use PDF, DOCX ou TXT.';
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'Arquivo muito grande. Máximo 10MB.';
  }
  return null;
}

export default function FileUploadInput({
  selectedFile,
  onFileSelect,
  error,
  disabled = false,
}: FileUploadInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

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
    // Reset input to allow re-selecting same file
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
          sx={{
            p: 3,
            textAlign: 'center',
            cursor: disabled ? 'default' : 'pointer',
            borderStyle: 'dashed',
            borderColor: error ? 'error.main' : 'divider',
            bgcolor: disabled ? 'action.disabledBackground' : 'background.paper',
            '&:hover': disabled
              ? {}
              : {
                  borderColor: 'primary.main',
                  bgcolor: 'action.hover',
                },
            transition: 'all 0.2s',
          }}
        >
          <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
          <Typography variant="body1" color="text.secondary">
            Clique para selecionar um arquivo
          </Typography>
          <Typography variant="caption" color="text.secondary">
            PDF, DOCX ou TXT (máx. 10MB)
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
