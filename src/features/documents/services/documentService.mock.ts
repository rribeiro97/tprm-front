import type {
  ChatRequest,
  ChatSourceDocument,
  Document,
  DocumentFileType,
} from '../types/document.types';

/**
 * Mock Document Service
 * Used for frontend development without backend.
 * Documents persist in sessionStorage during the session.
 */

const STORAGE_KEY = 'mock_documents';

const DEFAULT_DOCUMENTS: Document[] = [
  {
    id: 'doc-1',
    name: 'Política de Segurança',
    description:
      'Documento de política de segurança da informação da empresa com diretrizes e procedimentos obrigatórios.',
    fileName: 'politica-seguranca.pdf',
    fileType: 'pdf',
    fileSize: 1024 * 500,
    uploadedAt: '2025-01-15T10:30:00Z',
    uploadedBy: 'mock-user-1',
    url: '/mock/politica-seguranca.pdf',
  },
  {
    id: 'doc-2',
    name: 'Contrato de Serviço',
    description: 'Contrato de prestação de serviços com fornecedor XYZ.',
    fileName: 'contrato-servico.docx',
    fileType: 'docx',
    fileSize: 1024 * 150,
    uploadedAt: '2025-01-10T14:20:00Z',
    uploadedBy: 'mock-user-1',
    url: '/mock/contrato-servico.docx',
  },
  {
    id: 'doc-3',
    name: 'Checklist de Compliance',
    description: 'Lista de verificação para auditoria de compliance.',
    fileName: 'checklist-compliance.txt',
    fileType: 'txt',
    fileSize: 1024 * 25,
    uploadedAt: '2025-01-05T09:00:00Z',
    uploadedBy: 'mock-user-1',
    url: '/mock/checklist-compliance.txt',
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function getFileType(fileName: string): DocumentFileType {
  const extension = fileName.split('.').pop()?.toLowerCase();
  if (extension === 'pdf') return 'pdf';
  if (extension === 'docx') return 'docx';
  return 'txt';
}

/**
 * Get documents from sessionStorage
 */
function getDocuments(): Document[] {
  if (typeof window === 'undefined') return DEFAULT_DOCUMENTS;
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (!stored) {
    // Initialize with default documents
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DOCUMENTS));
    return DEFAULT_DOCUMENTS;
  }
  try {
    return JSON.parse(stored) as Document[];
  } catch {
    return DEFAULT_DOCUMENTS;
  }
}

/**
 * Save documents to sessionStorage
 */
function saveDocuments(documents: Document[]): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
}

export const documentServiceMock = {
  async list(): Promise<Document[]> {
    await delay(500);
    return [...getDocuments()];
  },

  async upload(name: string, description: string | undefined, file: File): Promise<Document> {
    await delay(800);

    const newDoc: Document = {
      id: `doc-${Date.now()}`,
      name,
      description: description || null,
      fileName: file.name,
      fileType: getFileType(file.name),
      fileSize: file.size,
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'mock-user-1',
      url: `/mock/${file.name}`,
    };

    const documents = getDocuments();
    const updated = [newDoc, ...documents];
    saveDocuments(updated);

    return newDoc;
  },

  async delete(documentId: string): Promise<void> {
    await delay(400);
    const documents = getDocuments();
    const exists = documents.some((doc) => doc.id === documentId);
    if (!exists) {
      throw new Error('Documento não encontrado');
    }
    const updated = documents.filter((doc) => doc.id !== documentId);
    saveDocuments(updated);
  },

  async getDownloadUrl(documentId: string): Promise<string> {
    await delay(200);
    const documents = getDocuments();
    const doc = documents.find((d) => d.id === documentId);
    if (!doc) {
      throw new Error('Documento não encontrado');
    }
    return doc.url;
  },

  async chat(request: ChatRequest): Promise<{ answer: string; sources: ChatSourceDocument[] }> {
    await delay(1500);

    const documents = getDocuments();
    const relevantDocs = documents.slice(0, 2);

    const answer = `Baseado na análise dos documentos disponíveis, posso fornecer informações sobre "${request.question}".

A Política de Segurança estabelece que todos os acessos devem ser autenticados e autorizados. O documento também menciona a necessidade de revisões periódicas de acesso e controles de segurança.

O Contrato de Serviço define as responsabilidades do fornecedor em relação à proteção de dados e conformidade com regulamentações aplicáveis.`;

    return {
      answer,
      sources: relevantDocs.map((doc, index) => ({
        documentId: doc.id,
        documentName: doc.name,
        relevanceScore: 0.95 - index * 0.1,
        excerpt:
          doc.id === 'doc-1'
            ? 'Todos os acessos devem ser autenticados e autorizados antes de serem concedidos ao usuário...'
            : 'O fornecedor se compromete a manter a confidencialidade dos dados...',
      })),
    };
  },
};
