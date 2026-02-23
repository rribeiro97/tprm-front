import { z } from 'zod';

// === File Types ===
export type DocumentFileType = 'pdf' | 'docx' | 'txt';

// === Zod Schemas ===
export const documentUploadSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  description: z.string().max(500, 'Descrição muito longa').optional(),
});

export type DocumentUploadFormData = z.infer<typeof documentUploadSchema>;

// === Document Entity ===
export interface Document {
  id: string;
  name: string;
  description: string | null;
  fileName: string;
  fileType: DocumentFileType;
  fileSize: number;
  uploadedAt: string;
  uploadedBy: string;
  url: string;
}

// === API Request/Response Types ===
export interface DocumentListResponse {
  success: boolean;
  data: Document[];
  total: number;
}

export interface DocumentUploadResponse {
  success: boolean;
  data: Document;
}

export interface DocumentDeleteResponse {
  success: boolean;
  message: string;
}

// === Chat Types ===
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sourceDocuments?: ChatSourceDocument[];
}

export interface ChatSourceDocument {
  documentId: string;
  documentName: string;
  relevanceScore: number;
  excerpt: string;
}

export interface ChatRequest {
  question: string;
  documentIds?: string[];
}

export interface ChatResponse {
  success: boolean;
  data: {
    answer: string;
    sources: ChatSourceDocument[];
  };
}
