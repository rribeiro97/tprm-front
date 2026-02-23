'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { documentService } from '../services/documentService';
import type { ChatMessage } from '../types/document.types';

interface UseDocumentChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (question: string, documentIds?: string[]) => Promise<void>;
  clearChat: () => void;
}

export function useDocumentChat(): UseDocumentChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const sendMessage = useCallback(async (question: string, documentIds?: string[]) => {
    if (!question.trim()) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: question,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await documentService.chat({ question, documentIds });

      if (isMountedRef.current) {
        const assistantMessage: ChatMessage = {
          id: `msg-${Date.now()}-assistant`,
          role: 'assistant',
          content: response.answer,
          timestamp: new Date().toISOString(),
          sourceDocuments: response.sources,
        };

        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : 'Erro ao processar pergunta');
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
  };
}
