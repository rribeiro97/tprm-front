'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { documentService } from '../services/documentService';
import type { Document } from '../types/document.types';

interface UseDocumentsReturn {
  documents: Document[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  uploadDocument: (name: string, description: string | undefined, file: File) => Promise<Document>;
  deleteDocument: (documentId: string) => Promise<void>;
  downloadDocument: (documentId: string) => Promise<void>;
}

export function useDocuments(): UseDocumentsReturn {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await documentService.list();
      if (isMountedRef.current) {
        setDocuments(data);
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar documentos');
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  const uploadDocument = useCallback(
    async (name: string, description: string | undefined, file: File): Promise<Document> => {
      const newDoc = await documentService.upload(name, description, file);
      if (isMountedRef.current) {
        setDocuments((prev) => [newDoc, ...prev]);
      }
      return newDoc;
    },
    []
  );

  const deleteDocument = useCallback(async (documentId: string) => {
    await documentService.delete(documentId);
    if (isMountedRef.current) {
      setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
    }
  }, []);

  const downloadDocument = useCallback(async (documentId: string) => {
    const url = await documentService.getDownloadUrl(documentId);
    window.open(url, '_blank');
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    refresh();

    return () => {
      isMountedRef.current = false;
    };
  }, [refresh]);

  return {
    documents,
    isLoading,
    error,
    refresh,
    uploadDocument,
    deleteDocument,
    downloadDocument,
  };
}
