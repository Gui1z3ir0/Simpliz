import { useCallback, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { LocalStorageService } from '@/lib/storage';
import type { Morador } from '@/types';

export function useMoradores() {
  const [moradores, setMoradores] = useState<Morador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMoradores = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured()) {
      setMoradores(LocalStorageService.getMoradores());
      setLoading(false);
      return;
    }

    try {
      const { data, error: fetchErr } = await supabase
        .from('moradores')
        .select('*')
        .order('bloco', { ascending: true })
        .order('apartamento', { ascending: true });

      if (fetchErr) {
        console.warn('Supabase moradores fetch failed, using local storage:', fetchErr.message);
        setMoradores(LocalStorageService.getMoradores());
      } else {
        setMoradores(data ?? []);
      }
    } catch (err) {
      console.warn('Network error in moradores, using local storage fallback:', err);
      setMoradores(LocalStorageService.getMoradores());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMoradores();
  }, [fetchMoradores]);

  const addMorador = async (morador: Omit<Morador, 'id' | 'created_at'>) => {
    if (!isSupabaseConfigured()) {
      LocalStorageService.addMorador(morador);
      await fetchMoradores();
      return;
    }

    try {
      const { error: insertErr } = await supabase.from('moradores').insert(morador);
      if (insertErr) {
        LocalStorageService.addMorador(morador);
      }
      await fetchMoradores();
    } catch {
      LocalStorageService.addMorador(morador);
      await fetchMoradores();
    }
  };

  const updateMorador = async (id: string, morador: Omit<Morador, 'id' | 'created_at'>) => {
    if (!isSupabaseConfigured()) {
      LocalStorageService.updateMorador(id, morador);
      await fetchMoradores();
      return;
    }

    try {
      const { error: updateErr } = await supabase.from('moradores').update(morador).eq('id', id);
      if (updateErr) {
        LocalStorageService.updateMorador(id, morador);
      }
      await fetchMoradores();
    } catch {
      LocalStorageService.updateMorador(id, morador);
      await fetchMoradores();
    }
  };

  const deleteMorador = async (id: string) => {
    if (!isSupabaseConfigured()) {
      LocalStorageService.deleteMorador(id);
      await fetchMoradores();
      return;
    }

    try {
      const { error: deleteErr } = await supabase.from('moradores').delete().eq('id', id);
      if (deleteErr) {
        LocalStorageService.deleteMorador(id);
      }
      await fetchMoradores();
    } catch {
      LocalStorageService.deleteMorador(id);
      await fetchMoradores();
    }
  };

  return {
    moradores,
    loading,
    error,
    addMorador,
    updateMorador,
    deleteMorador,
    refetch: fetchMoradores,
  };
}

