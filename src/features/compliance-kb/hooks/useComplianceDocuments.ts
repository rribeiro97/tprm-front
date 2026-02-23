'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { complianceKbService } from '../services/complianceKbService';
import type {
  ComplianceDocument,
  GetDocumentsParams,
  PaginationMeta,
} from '../types/complianceKb.types';

const DEFAULT_PAGE_SIZE = 10;

interface UseComplianceDocumentsReturn {
  documents: ComplianceDocument[];
  pagination: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  refresh: () => Promise<void>;
  loadPage: (page: number) => Promise<void>;
  uploadDocument: (file: File) => Promise<ComplianceDocument>;
  deleteDocument: (documentId: string) => Promise<void>;
}

export function useComplianceDocuments(): UseComplianceDocumentsReturn {
  const [documents, setDocuments] = useState<ComplianceDocument[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const isMountedRef = useRef(true);

  const fetchDocuments = useCallback(async (page: number) => {
    try {
      setIsLoading(true);
      setError(null);

      const params: GetDocumentsParams = {
        skip: (page - 1) * DEFAULT_PAGE_SIZE,
        take: DEFAULT_PAGE_SIZE,
        orderBy: 'uploadedAt',
        orderDirection: 'desc',
      };

      const response = await complianceKbService.list(params);

      if (isMountedRef.current) {
        setDocuments(response.data);
        setPagination(response.pagination);
        setCurrentPage(page);
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

  const refresh = useCallback(async () => {
    await fetchDocuments(currentPage);
  }, [fetchDocuments, currentPage]);

  const loadPage = useCallback(
    async (page: number) => {
      await fetchDocuments(page);
    },
    [fetchDocuments]
  );

  const uploadDocument = useCallback(
    async (file: File): Promise<ComplianceDocument> => {
      const newDoc = await complianceKbService.upload(file);
      // Refresh list to show new document
      if (isMountedRef.current) {
        await fetchDocuments(1);
      }
      return newDoc;
    },
    [fetchDocuments]
  );

  const deleteDocument = useCallback(
    async (documentId: string) => {
      await complianceKbService.delete(documentId);
      if (isMountedRef.current) {
        // Refresh current page after deletion
        await fetchDocuments(currentPage);
      }
    },
    [fetchDocuments, currentPage]
  );

  useEffect(() => {
    isMountedRef.current = true;
    fetchDocuments(1);

    return () => {
      isMountedRef.current = false;
    };
  }, [fetchDocuments]);

  return {
    documents,
    pagination,
    isLoading,
    error,
    currentPage,
    refresh,
    loadPage,
    uploadDocument,
    deleteDocument,
  };
}
