import { AxiosError } from 'axios';
import apiClient from '@/lib/axios';
import type {
  ChatRequest,
  ChatResponse,
  Document,
  DocumentDeleteResponse,
  DocumentListResponse,
  DocumentUploadResponse,
} from '../types/document.types';
import { documentServiceMock } from './documentService.mock';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

/**
 * Document Service
 *
 * Handles all document-related API calls:
 * - List documents
 * - Upload document
 * - Delete document
 * - Download document
 * - RAG chat queries
 */
export const documentService = {
  /**
   * List all documents for the current user's company
   */
  async list(): Promise<Document[]> {
    if (USE_MOCK) {
      return documentServiceMock.list();
    }

    try {
      const response = await apiClient.get<DocumentListResponse>('/api/documents', {
        withCredentials: true,
      });
      return response.data.data;
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
   * Upload a new document using FormData
   */
  async upload(name: string, description: string | undefined, file: File): Promise<Document> {
    if (USE_MOCK) {
      return documentServiceMock.upload(name, description, file);
    }

    try {
      const formData = new FormData();
      formData.append('name', name);
      if (description) {
        formData.append('description', description);
      }
      formData.append('file', file);

      const response = await apiClient.post<DocumentUploadResponse>('/api/documents', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
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
   * Delete a document by ID
   */
  async delete(documentId: string): Promise<void> {
    if (USE_MOCK) {
      return documentServiceMock.delete(documentId);
    }

    try {
      await apiClient.delete<DocumentDeleteResponse>(`/api/documents/${documentId}`, {
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
   * Get download URL for a document
   */
  async getDownloadUrl(documentId: string): Promise<string> {
    if (USE_MOCK) {
      return documentServiceMock.getDownloadUrl(documentId);
    }

    try {
      const response = await apiClient.get<{ url: string }>(
        `/api/documents/${documentId}/download`,
        { withCredentials: true }
      );
      return response.data.url;
    } catch (error) {
      if (error instanceof AxiosError) {
        const message =
          error.response?.data?.message || 'Falha ao baixar documento. Tente novamente.';
        throw new Error(message);
      }
      throw new Error('Falha ao baixar documento. Tente novamente.');
    }
  },

  /**
   * Send a RAG chat query about documents
   */
  async chat(request: ChatRequest): Promise<ChatResponse['data']> {
    if (USE_MOCK) {
      return documentServiceMock.chat(request);
    }

    try {
      const response = await apiClient.post<ChatResponse>('/api/documents/chat', request, {
        withCredentials: true,
      });
      return response.data.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const message =
          error.response?.data?.message || 'Falha ao processar pergunta. Tente novamente.';
        throw new Error(message);
      }
      throw new Error('Falha ao processar pergunta. Tente novamente.');
    }
  },
};
