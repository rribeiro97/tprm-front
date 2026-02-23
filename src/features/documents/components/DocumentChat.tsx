'use client';

import { AutoAwesome, CheckCircle, DeleteOutline, Send } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDocumentChat } from '../hooks/useDocumentChat';
import type { Document } from '../types/document.types';
import ChatMessage from './ChatMessage';

const SUGGESTED_QUESTIONS = [
  'Quais são os principais pontos deste documento?',
  'Resuma o conteúdo dos documentos selecionados.',
  'O que diz sobre conformidade?',
];

interface DocumentChatProps {
  documents: Document[];
}

export default function DocumentChat({ documents }: DocumentChatProps) {
  const { messages, isLoading, error, sendMessage, clearChat } = useDocumentChat();
  const [input, setInput] = useState('');
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  const handleToggleDocument = (docId: string) => {
    setSelectedDocIds((prev) =>
      prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]
    );
  };

  const handleSelectAll = () => {
    if (selectedDocIds.length === documents.length) {
      setSelectedDocIds([]);
    } else {
      setSelectedDocIds(documents.map((d) => d.id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const question = input.trim();
    setInput('');

    // Pass selected document IDs (empty = all documents)
    const docIds = selectedDocIds.length > 0 ? selectedDocIds : undefined;
    await sendMessage(question, docIds);
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const selectedCount = selectedDocIds.length;
  const allSelected = selectedCount === documents.length && documents.length > 0;

  return (
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        bgcolor: 'grey.50',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AutoAwesome color="secondary" />
          <Typography variant="subtitle1" fontWeight={600}>
            Pergunte sobre seus documentos
          </Typography>
        </Box>
        {messages.length > 0 && (
          <Button
            size="small"
            startIcon={<DeleteOutline />}
            onClick={clearChat}
            disabled={isLoading}
          >
            Limpar
          </Button>
        )}
      </Box>

      {/* Document Selection */}
      {documents.length > 0 && (
        <Box
          sx={{
            p: 1.5,
            borderBottom: 1,
            borderColor: 'divider',
            bgcolor: 'grey.100',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Selecione os documentos para conversar:
            </Typography>
            <Button
              size="small"
              variant="text"
              onClick={handleSelectAll}
              sx={{ fontSize: 11, minWidth: 'auto', p: 0.5 }}
            >
              {allSelected ? 'Limpar seleção' : 'Selecionar todos'}
            </Button>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {documents.map((doc) => {
              const isSelected = selectedDocIds.includes(doc.id);
              return (
                <Chip
                  key={doc.id}
                  label={doc.name}
                  size="small"
                  onClick={() => handleToggleDocument(doc.id)}
                  color={isSelected ? 'primary' : 'default'}
                  variant={isSelected ? 'filled' : 'outlined'}
                  icon={isSelected ? <CheckCircle sx={{ fontSize: 16 }} /> : undefined}
                  sx={{
                    fontSize: 11,
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: isSelected ? 'primary.dark' : 'action.hover',
                    },
                  }}
                />
              );
            })}
          </Box>
          {selectedCount > 0 && (
            <Typography variant="caption" color="primary" sx={{ mt: 1, display: 'block' }}>
              {selectedCount} documento{selectedCount !== 1 ? 's' : ''} selecionado
              {selectedCount !== 1 ? 's' : ''}
            </Typography>
          )}
          {selectedCount === 0 && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Nenhum selecionado = conversar com todos
            </Typography>
          )}
        </Box>
      )}

      {/* Messages Area */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
          minHeight: 150,
        }}
      >
        {messages.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <AutoAwesome sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Faça perguntas sobre os documentos selecionados.
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
              Sugestões:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
              {SUGGESTED_QUESTIONS.map((question) => (
                <Button
                  key={question}
                  size="small"
                  variant="outlined"
                  onClick={() => handleSuggestedQuestion(question)}
                  sx={{ textTransform: 'none', fontSize: 11 }}
                >
                  {question}
                </Button>
              ))}
            </Box>
          </Box>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 5 }}>
                <CircularProgress size={16} />
                <Typography variant="caption" color="text.secondary">
                  Analisando documentos...
                </Typography>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </Box>

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mx: 2, mb: 1 }} onClose={() => {}}>
          {error}
        </Alert>
      )}

      {/* Input */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          display: 'flex',
          gap: 1,
        }}
      >
        <TextField
          inputRef={inputRef}
          fullWidth
          size="small"
          placeholder="Digite sua pergunta..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          autoComplete="off"
        />
        <IconButton type="submit" color="primary" disabled={!input.trim() || isLoading}>
          {isLoading ? <CircularProgress size={24} /> : <Send />}
        </IconButton>
      </Box>
    </Paper>
  );
}
