'use client';

import { CloudUpload } from '@mui/icons-material';
import { Box, Button, CircularProgress, Paper, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/components/ui/ToastProvider';
import KbFileUploadInput from './KbFileUploadInput';

interface KbUploadSectionProps {
  onUpload: (file: File) => Promise<void>;
}

export default function KbUploadSection({ onUpload }: KbUploadSectionProps) {
  const { showToast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
    if (file) {
      setFileError('');
    }
  };

  const handleSubmit = async () => {
    if (isSubmittingRef.current) return;

    if (!selectedFile) {
      setFileError('Selecione um arquivo');
      return;
    }

    try {
      isSubmittingRef.current = true;
      setIsSubmitting(true);
      setFileError('');

      await onUpload(selectedFile);

      if (isMountedRef.current) {
        showToast('Documento enviado com sucesso!', 'success');
        setSelectedFile(null);
      }
    } catch (error) {
      if (isMountedRef.current) {
        const message =
          error instanceof Error ? error.message : 'Falha ao enviar documento. Tente novamente.';
        showToast(message, 'error');
      }
    } finally {
      if (isMountedRef.current) {
        setIsSubmitting(false);
      }
      isSubmittingRef.current = false;
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <CloudUpload color="primary" />
        <Typography variant="h6" fontWeight={600}>
          Adicionar Documento
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Arquivo *
        </Typography>
        <KbFileUploadInput
          selectedFile={selectedFile}
          onFileSelect={handleFileSelect}
          error={fileError}
          disabled={isSubmitting}
        />
      </Box>

      <Button
        variant="contained"
        fullWidth
        size="large"
        disabled={isSubmitting}
        onClick={handleSubmit}
        sx={{ height: 48 }}
      >
        {isSubmitting ? (
          <>
            <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
            Enviando...
          </>
        ) : (
          'Enviar Documento'
        )}
      </Button>
    </Paper>
  );
}
