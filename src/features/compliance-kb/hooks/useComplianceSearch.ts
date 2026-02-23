'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { complianceKbService } from '../services/complianceKbService';
import type { SearchResult } from '../types/complianceKb.types';

interface UseComplianceSearchReturn {
  result: SearchResult | null;
  isSearching: boolean;
  error: string | null;
  search: (query: string) => Promise<void>;
  clearResult: () => void;
}

export function useComplianceSearch(): UseComplianceSearchReturn {
  const [result, setResult] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);
  const isSearchingRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const search = useCallback(async (query: string) => {
    if (!query.trim() || isSearchingRef.current) return;

    try {
      isSearchingRef.current = true;
      setIsSearching(true);
      setError(null);
      setResult(null);

      const searchResult = await complianceKbService.search({ query, topK: 5 });

      if (isMountedRef.current) {
        setResult(searchResult);
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : 'Erro ao processar busca');
      }
    } finally {
      if (isMountedRef.current) {
        setIsSearching(false);
      }
      isSearchingRef.current = false;
    }
  }, []);

  const clearResult = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    result,
    isSearching,
    error,
    search,
    clearResult,
  };
}
