// === Document Status ===
export type ComplianceDocumentStatus = 'PROCESSING' | 'READY' | 'FAILED';

// === Core Entity ===
export interface ComplianceDocument {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  status: ComplianceDocumentStatus;
  uploadedAt: string;
  usageCount: number;
}

// === Pagination ===
export interface PaginationMeta {
  skip: number;
  take: number;
  total: number;
  totalPages: number;
}

// === API Request Types ===
export interface GetDocumentsParams {
  skip?: number;
  take?: number;
  fileType?: string;
  status?: ComplianceDocumentStatus;
  orderBy?: 'fileName' | 'fileType' | 'uploadedAt' | 'usageCount';
  orderDirection?: 'asc' | 'desc';
}

export interface SearchRequest {
  query: string;
  topK?: number;
}

// === API Response Types ===
export interface ComplianceDocumentListResponse {
  data: ComplianceDocument[];
  pagination: PaginationMeta;
}

export interface ComplianceDocumentUploadResponse {
  data: ComplianceDocument;
  message: string;
}

// === Search Types ===
export interface SearchSource {
  documentId: string;
  fileName: string;
  similarityScore: number;
  excerpt: string;
}

export interface SearchResult {
  answer: string;
  confidenceScore: number;
  sources: SearchSource[];
}
