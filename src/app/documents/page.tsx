'use client';

import DocumentsPage from '@/features/documents/components/DocumentsPage';

/**
 * Documents Management Page
 *
 * Protected route - requires authentication.
 * Features:
 * - Document upload with validation
 * - Document library with view/download/delete
 * - RAG chat for querying documents
 */
export default function Page() {
  return <DocumentsPage />;
}
