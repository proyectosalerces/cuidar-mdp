'use client';

/**
 * useResenas — hook for the review / rating system.
 *
 * Provides data, actions and loading state for a given entity's
 * reviews. Composes the lower-level service layer with auth context.
 */

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { Resena, ResenaFormData, ResenaStats, EntidadTipo } from '@/types/resena';
import * as service from '@/services/resenas.service';

interface UseResenasReturn {
  resenas: Resena[];
  stats: ResenaStats | null;
  miResenaPendiente: Resena | null;
  loading: boolean;
  error: string | null;
  yaReseno: boolean;
  crearResena: (data: ResenaFormData) => Promise<Resena>;
  recargar: () => void;
}

export function useResenas(
  entidadId: string,
  entidadTipo: EntidadTipo,
): UseResenasReturn {
  const { user } = useAuth();

  const [resenas, setResenas] = useState<Resena[]>([]);
  const [stats, setStats] = useState<ResenaStats | null>(null);
  const [miResenaPendiente, setMiResenaPendiente] = useState<Resena | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [yaResenoState, setYaResenoState] = useState(false);
  const [version, setVersion] = useState(0);

  /* ── Fetch data ─────────────────────────────────────────────────────── */

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [fetchedResenas, fetchedStats] = await Promise.all([
          service.getResenas(entidadId, entidadTipo),
          service.getResenaStats(entidadId, entidadTipo),
        ]);

        if (cancelled) return;

        setResenas(fetchedResenas);
        setStats(fetchedStats);

        // Check user-specific state
        if (user) {
          const already = await service.yaReseno(user.uid, entidadId, entidadTipo);
          if (cancelled) return;
          setYaResenoState(already);

          // Find pending review by this user for this entity
          const misResenas = await service.getMisResenas(user.uid);
          if (cancelled) return;
          const pending = misResenas.find(
            (r) =>
              r.entidadId === entidadId &&
              r.entidadTipo === entidadTipo &&
              !r.aprobada,
          );
          setMiResenaPendiente(pending ?? null);
        } else {
          setYaResenoState(false);
          setMiResenaPendiente(null);
        }
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Error al cargar las reseñas');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [entidadId, entidadTipo, user, version]);

  /* ── Create ─────────────────────────────────────────────────────────── */

  const crearResena = useCallback(
    async (data: ResenaFormData): Promise<Resena> => {
      if (!user) {
        throw new Error('Debés iniciar sesión para dejar una reseña.');
      }

      const already = await service.yaReseno(user.uid, entidadId, entidadTipo);
      if (already) {
        throw new Error('Ya dejaste una reseña para esta entidad.');
      }

      const nueva = await service.crearResena(data, user, entidadId, entidadTipo);
      // Trigger re-fetch
      setVersion((v) => v + 1);
      return nueva;
    },
    [user, entidadId, entidadTipo],
  );

  /* ── Reload ─────────────────────────────────────────────────────────── */

  const recargar = useCallback(() => {
    setVersion((v) => v + 1);
  }, []);

  return {
    resenas,
    stats,
    miResenaPendiente,
    loading,
    error,
    yaReseno: yaResenoState,
    crearResena,
    recargar,
  };
}
