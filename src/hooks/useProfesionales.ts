'use client';

/**
 * Custom hook for fetching profesionales (healthcare professionals)
 *
 * Provides reactive state for the profesionales listing page,
 * including loading/error states and specialty filtering.
 */

import { useState, useEffect, useCallback } from 'react';

import type { Profesional, Especialidad } from '@/types/profesional';
import { getProfesionales } from '@/services/profesionales.service';

interface UseProfesionalesReturn {
  profesionales: Profesional[];
  loading: boolean;
  error: string | null;
  especialidad: Especialidad | undefined;
  setEspecialidad: (especialidad: Especialidad | undefined) => void;
}

export function useProfesionales(
  initialEspecialidad?: Especialidad
): UseProfesionalesReturn {
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [especialidad, setEspecialidad] = useState<Especialidad | undefined>(
    initialEspecialidad
  );

  const fetchProfesionales = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getProfesionales(especialidad);
      setProfesionales(data);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Error al cargar los profesionales. Intentá de nuevo más tarde.';
      setError(message);
      setProfesionales([]);
    } finally {
      setLoading(false);
    }
  }, [especialidad]);

  useEffect(() => {
    fetchProfesionales();
  }, [fetchProfesionales]);

  return {
    profesionales,
    loading,
    error,
    especialidad,
    setEspecialidad,
  };
}
