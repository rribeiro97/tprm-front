'use client';

import { Description, Person, SmartToy } from '@mui/icons-material';
import { Box, Chip, Paper, Stack, Typography } from '@mui/material';
import type { ChatMessage as ChatMessageType } from '../types/document.types';

interface ChatMessageProps {
  message: ChatMessageType;
}

function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        mb: 2,
      }}
    >
      <Box
        sx={{
          maxWidth: '85%',
          display: 'flex',
          flexDirection: isUser ? 'row-reverse' : 'row',
          gap: 1,
        }}
      >
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: isUser ? 'primary.main' : 'secondary.main',
            color: 'white',
            flexShrink: 0,
          }}
        >
          {isUser ? <Person fontSize="small" /> : <SmartToy fontSize="small" />}
        </Box>

        <Box>
          <Paper
            elevation={1}
            sx={{
              p: 2,
              bgcolor: isUser ? 'primary.main' : 'background.paper',
              color: isUser ? 'primary.contrastText' : 'text.primary',
              borderRadius: 2,
              borderTopLeftRadius: isUser ? 2 : 0,
              borderTopRightRadius: isUser ? 0 : 2,
            }}
          >
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {message.content}
            </Typography>
          </Paper>

          {message.sourceDocuments && message.sourceDocuments.length > 0 && (
            <Box sx={{ mt: 1 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', mb: 0.5 }}
              >
                Fontes:
              </Typography>
              <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                {message.sourceDocuments.map((source) => (
                  <Chip
                    key={source.documentId}
                    icon={<Description sx={{ fontSize: 14 }} />}
                    label={source.documentName}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: 11 }}
                  />
                ))}
              </Stack>
            </Box>
          )}

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', mt: 0.5, textAlign: isUser ? 'right' : 'left' }}
          >
            {formatTime(message.timestamp)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
