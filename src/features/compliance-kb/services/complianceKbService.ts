import { AxiosError } from 'axios';
import apiClient from '@/lib/axios';
import type {
  ComplianceDocument,
  ComplianceDocumentListResponse,
  ComplianceDocumentUploadResponse,
  GetDocumentsParams,
  SearchRequest,
  SearchResult,
} from '../types/complianceKb.types';
import { complianceKbServiceMock } from './complianceKbService.mock';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

/**
 * Compliance Knowledge Base Service
 *
 * Handles all compliance-kb API calls:
 * - List documents (paginated)
 * - Upload document
 * - Delete document
 * - RAG search
 *
 * SECURITY NOTE: Tokens are managed as httpOnly cookies by the backend.
 */
export const complianceKbService = {
  /**
   * List compliance documents with pagination and filters
   */
  async list(params?: GetDocumentsParams): Promise<ComplianceDocumentListResponse> {
    if (USE_MOCK) {
      return complianceKbServiceMock.list(params);
    }

    try {
      const response = await apiClient.get<ComplianceDocumentListResponse>(
        '/api/compliance-kb/documents',
        {
          params,
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const message =
          error.response?.data?.message || 'Falha ao carregar documentos. Tente novamente.';
        throw new Error(message);
      }
      throw new Error('Falha ao carregar documentos. Tente novamente.');
    }
  },

  /**
   * Upload a compliance document (file only, no name/description)
   */
  async upload(file: File): Promise<ComplianceDocument> {
    if (USE_MOCK) {
      return complianceKbServiceMock.upload(file);
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post<ComplianceDocumentUploadResponse>(
        '/api/compliance-kb/documents',
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 120000, // 2 minutes for large files (up to 50MB)
        }
      );
      return response.data.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const message =
          error.response?.data?.message || 'Falha ao enviar documento. Tente novamente.';
        throw new Error(message);
      }
      throw new Error('Falha ao enviar documento. Tente novamente.');
    }
  },

  /**
   * Delete a compliance document by ID
   */
  async delete(documentId: string): Promise<void> {
    if (USE_MOCK) {
      return complianceKbServiceMock.delete(documentId);
    }

    try {
      await apiClient.delete(`/api/compliance-kb/documents/${documentId}`, {
        withCredentials: true,
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        const message =
          error.response?.data?.message || 'Falha ao excluir documento. Tente novamente.';
        throw new Error(message);
      }
      throw new Error('Falha ao excluir documento. Tente novamente.');
    }
  },

  /**
   * Search the knowledge base using RAG
   *
   * Normalizes response key: backend may return `result` or `data`
   */
  async search(request: SearchRequest): Promise<SearchResult> {
    if (USE_MOCK) {
      return complianceKbServiceMock.search(request);
    }

    try {
      const response = await apiClient.post<{ result?: SearchResult; data?: SearchResult }>(
        '/api/compliance-kb/search',
        request,
        {
          withCredentials: true,
        }
      );

      // Normalize: backend may use `result` or `data` key
      const searchResult = response.data.result ?? response.data.data;
      if (!searchResult) {
        throw new Error('Resposta inválida do servidor.');
      }
      return searchResult;
    } catch (error) {
      if (error instanceof AxiosError) {
        const message =
          error.response?.data?.message || 'Falha ao processar busca. Tente novamente.';
        throw new Error(message);
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Falha ao processar busca. Tente novamente.');
    }
  },
};
