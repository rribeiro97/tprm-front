import type {
  ComplianceDocument,
  ComplianceDocumentListResponse,
  GetDocumentsParams,
  SearchRequest,
  SearchResult,
} from '../types/complianceKb.types';

/**
 * Mock Compliance KB Service
 * Used for frontend development without backend.
 * Documents persist in sessionStorage during the session.
 */

const STORAGE_KEY = 'mock_compliance_kb_documents';

const DEFAULT_DOCUMENTS: ComplianceDocument[] = [
  {
    id: 'kb-doc-1',
    fileName: 'ISO27001-Politica-Seguranca.pdf',
    fileType: 'application/pdf',
    fileSize: 1024 * 2400,
    status: 'READY',
    uploadedAt: '2026-02-15T10:30:00Z',
    usageCount: 42,
  },
  {
    id: 'kb-doc-2',
    fileName: 'SOC2-Relatorio-Auditoria.pdf',
    fileType: 'application/pdf',
    fileSize: 1024 * 5120,
    status: 'READY',
    uploadedAt: '2026-02-14T14:20:00Z',
    usageCount: 15,
  },
  {
    id: 'kb-doc-3',
    fileName: 'LGPD-Politica-Privacidade.docx',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    fileSize: 1024 * 350,
    status: 'READY',
    uploadedAt: '2026-02-10T09:00:00Z',
    usageCount: 8,
  },
  {
    id: 'kb-doc-4',
    fileName: 'Checklist-Fornecedores.xlsx',
    fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    fileSize: 1024 * 180,
    status: 'PROCESSING',
    uploadedAt: '2026-02-17T16:45:00Z',
    usageCount: 0,
  },
  {
    id: 'kb-doc-5',
    fileName: 'Certificado-PCI-DSS.png',
    fileType: 'image/png',
    fileSize: 1024 * 800,
    status: 'FAILED',
    uploadedAt: '2026-02-16T11:00:00Z',
    usageCount: 0,
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function getDocuments(): ComplianceDocument[] {
  if (typeof window === 'undefined') return DEFAULT_DOCUMENTS;
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (!stored) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DOCUMENTS));
    return DEFAULT_DOCUMENTS;
  }
  try {
    return JSON.parse(stored) as ComplianceDocument[];
  } catch {
    return DEFAULT_DOCUMENTS;
  }
}

function saveDocuments(documents: ComplianceDocument[]): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
}

export const complianceKbServiceMock = {
  async list(params?: GetDocumentsParams): Promise<ComplianceDocumentListResponse> {
    await delay(500);

    let documents = getDocuments();

    // Apply filters
    if (params?.status) {
      documents = documents.filter((doc) => doc.status === params.status);
    }
    if (params?.fileType) {
      documents = documents.filter((doc) => doc.fileType === params.fileType);
    }

    // Apply sorting
    const orderBy = params?.orderBy || 'uploadedAt';
    const direction = params?.orderDirection || 'desc';
    documents.sort((a, b) => {
      const aVal = a[orderBy];
      const bVal = b[orderBy];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return direction === 'asc'
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });

    // Apply pagination
    const total = documents.length;
    const take = params?.take || 10;
    const skip = params?.skip || 0;
    const paginated = documents.slice(skip, skip + take);

    return {
      data: paginated,
      pagination: {
        skip,
        take,
        total,
        totalPages: Math.ceil(total / take),
      },
    };
  },

  async upload(file: File): Promise<ComplianceDocument> {
    await delay(800);

    const newDoc: ComplianceDocument = {
      id: `kb-doc-${Date.now()}`,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      status: 'PROCESSING',
      uploadedAt: new Date().toISOString(),
      usageCount: 0,
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

  async search(request: SearchRequest): Promise<SearchResult> {
    await delay(1500);

    if (!request.query.trim()) {
      throw new Error('A consulta é obrigatória');
    }

    return {
      answer: `Baseado na análise dos documentos de compliance disponíveis, posso responder sobre "${request.query}".\n\nA Política de Segurança ISO 27001 estabelece que todos os acessos devem ser autenticados e autorizados. O documento também menciona a necessidade de revisões periódicas de acesso e controles de segurança da informação.\n\nO relatório SOC2 complementa com requisitos de monitoramento contínuo e gestão de incidentes.`,
      confidenceScore: 0.87,
      sources: [
        {
          documentId: 'kb-doc-1',
          fileName: 'ISO27001-Politica-Seguranca.pdf',
          similarityScore: 0.92,
          excerpt:
            'Todos os acessos devem ser autenticados e autorizados antes de serem concedidos ao usuário. Revisões periódicas de acesso devem ser realizadas trimestralmente...',
        },
        {
          documentId: 'kb-doc-2',
          fileName: 'SOC2-Relatorio-Auditoria.pdf',
          similarityScore: 0.84,
          excerpt:
            'O monitoramento contínuo de atividades suspeitas é obrigatório. Incidentes de segurança devem ser reportados em até 24 horas...',
        },
      ],
    };
  },
};
