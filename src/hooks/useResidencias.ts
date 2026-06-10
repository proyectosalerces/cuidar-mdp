'use client';

/**
 * Custom hook for fetching and filtering residencias
 *
 * Provides reactive state for the residencias listing page,
 * including loading/error states and filter management.
 */

import { useState, useEffect, useCallback } from 'react';

import type { Residencia, FiltrosResidencia } from '@/types/residencia';
import { getResidencias } from '@/services/residencias.service';

interface UseResidenciasReturn {
  residencias: Residencia[];
  loading: boolean;
  error: string | null;
  filtros: FiltrosResidencia;
  setFiltros: (filtros: FiltrosResidencia) => void;
  /** Update a single filter field without replacing the whole object */
  updateFiltro: <K extends keyof FiltrosResidencia>(
    key: K,
    value: FiltrosResidencia[K]
  ) => void;
  /** Reset all filters to their initial (empty) state */
  resetFiltros: () => void;
}

const INITIAL_FILTROS: FiltrosResidencia = {};

export function useResidencias(
  initialFiltros?: FiltrosResidencia
): UseResidenciasReturn {
  const [residencias, setResidencias] = useState<Residencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosResidencia>(
    initialFiltros ?? INITIAL_FILTROS
  );

  const fetchResidencias = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getResidencias(filtros);
      setResidencias(data);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Error al cargar las residencias. Intentá de nuevo más tarde.';
      setError(message);
      setResidencias([]);
    } finally {
      setLoading(false);
    }
  }, [filtros]);

  useEffect(() => {
    fetchResidencias();
  }, [fetchResidencias]);

  const updateFiltro = useCallback(
    <K extends keyof FiltrosResidencia>(
      key: K,
      value: FiltrosResidencia[K]
    ) => {
      setFiltros((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const resetFiltros = useCallback(() => {
    setFiltros(INITIAL_FILTROS);
  }, []);

  return {
    residencias,
    loading,
    error,
    filtros,
    setFiltros,
    updateFiltro,
    resetFiltros,
  };
}
