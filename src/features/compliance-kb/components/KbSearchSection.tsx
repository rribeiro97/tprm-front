'use client';

import { Article, Search } from '@mui/icons-material';
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import type React from 'react';
import { useState } from 'react';
import { useComplianceSearch } from '../hooks/useComplianceSearch';

const SUGGESTED_QUESTIONS = [
  'Quais são os requisitos de segurança da informação?',
  'O que diz a política sobre retenção de dados?',
  'Quais são os controles de acesso obrigatórios?',
];

function getConfidenceColor(score: number): 'success' | 'warning' | 'error' {
  if (score >= 0.75) return 'success';
  if (score >= 0.5) return 'warning';
  return 'error';
}

export default function KbSearchSection() {
  const { result, isSearching, error, search, clearResult } = useComplianceSearch();
  const [input, setInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSearching) return;
    await search(input.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Search color="primary" />
        <Typography variant="h6" fontWeight={600}>
          Busca Inteligente
        </Typography>
      </Box>

      {/* Search Input */}
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Faça uma pergunta sobre seus documentos..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSearching}
          autoComplete="off"
          slotProps={{
            input: {
              sx: { pr: 1 },
            },
          }}
        />
        <IconButton type="submit" color="primary" disabled={!input.trim() || isSearching}>
          {isSearching ? <CircularProgress size={24} /> : <Search />}
        </IconButton>
      </Box>

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={clearResult}>
          {error}
        </Alert>
      )}

      {/* Result */}
      {result && (
        <Box>
          <Divider sx={{ mb: 2 }} />

          {/* Confidence Score */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Chip
              label={`Confiança: ${Math.round(result.confidenceScore * 100)}%`}
              color={getConfidenceColor(result.confidenceScore)}
              size="small"
            />
          </Box>

          {/* Answer */}
          <Typography
            variant="body2"
            sx={{
              whiteSpace: 'pre-wrap',
              mb: 2,
              p: 2,
              bgcolor: 'grey.50',
              borderRadius: 1,
              lineHeight: 1.7,
            }}
          >
            {result.answer}
          </Typography>

          {/* Sources */}
          {result.sources.length > 0 && (
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
                sx={{ mb: 1, display: 'block' }}
              >
                Fontes ({result.sources.length}):
              </Typography>
              {result.sources.map((source) => (
                <Box
                  key={`${source.documentId}-${source.similarityScore}`}
                  sx={{
                    p: 1.5,
                    mb: 1,
                    borderRadius: 1,
                    border: 1,
                    borderColor: 'divider',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Article sx={{ fontSize: 16, color: 'primary.main' }} />
                    <Typography variant="caption" fontWeight={600}>
                      {source.fileName}
                    </Typography>
                    <Chip
                      label={`${Math.round(source.similarityScore * 100)}%`}
                      size="small"
                      variant="outlined"
                      sx={{ height: 18, fontSize: 10 }}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    {source.excerpt}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}

      {/* Empty State - Suggestions */}
      {!result && !error && !isSearching && (
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Digite uma pergunta para consultar a base de conhecimento.
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            Sugestões:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
            {SUGGESTED_QUESTIONS.map((question) => (
              <Chip
                key={question}
                label={question}
                size="small"
                variant="outlined"
                onClick={() => handleSuggestedQuestion(question)}
                sx={{ cursor: 'pointer', fontSize: 11 }}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Searching State */}
      {isSearching && (
        <Box
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, py: 3 }}
        >
          <CircularProgress size={20} />
          <Typography variant="body2" color="text.secondary">
            Analisando documentos...
          </Typography>
        </Box>
      )}
    </Paper>
  );
}
