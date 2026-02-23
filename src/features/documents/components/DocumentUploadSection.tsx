'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CloudUpload } from '@mui/icons-material';
import { Box, Button, CircularProgress, Paper, TextField, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/components/ui/ToastProvider';
import { type DocumentUploadFormData, documentUploadSchema } from '../types/document.types';
import FileUploadInput from './FileUploadInput';

interface DocumentUploadSectionProps {
  onUpload: (name: string, description: string | undefined, file: File) => Promise<void>;
}

export default function DocumentUploadSection({ onUpload }: DocumentUploadSectionProps) {
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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DocumentUploadFormData>({
    resolver: zodResolver(documentUploadSchema),
    mode: 'onBlur',
  });

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
    if (file) {
      setFileError('');
    }
  };

  const onSubmit = async (data: DocumentUploadFormData) => {
    // Prevent concurrent submissions
    if (isSubmittingRef.current) return;

    // Validate file selection
    if (!selectedFile) {
      setFileError('Selecione um arquivo');
      return;
    }

    try {
      isSubmittingRef.current = true;
      setIsSubmitting(true);
      setFileError('');

      await onUpload(data.name, data.description, selectedFile);

      if (isMountedRef.current) {
        showToast('Documento enviado com sucesso!', 'success');
        reset();
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
          Upload de Documento
        </Typography>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Nome */}
        <TextField
          {...register('name')}
          label="Nome do documento"
          fullWidth
          margin="normal"
          error={!!errors.name}
          helperText={errors.name?.message}
          disabled={isSubmitting}
          required
        />

        {/* Descrição */}
        <TextField
          {...register('description')}
          label="Descrição"
          fullWidth
          margin="normal"
          multiline
          rows={3}
          error={!!errors.description}
          helperText={errors.description?.message || 'Opcional'}
          disabled={isSubmitting}
        />

        {/* File Upload */}
        <Box sx={{ mt: 2, mb: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Arquivo *
          </Typography>
          <FileUploadInput
            selectedFile={selectedFile}
            onFileSelect={handleFileSelect}
            error={fileError}
            disabled={isSubmitting}
          />
        </Box>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          disabled={isSubmitting}
          sx={{ height: 48 }}
        >
          {isSubmitting ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
              Enviando...
            </>
          ) : (
            'Cadastrar Documento'
          )}
        </Button>
      </form>
    </Paper>
  );
}
