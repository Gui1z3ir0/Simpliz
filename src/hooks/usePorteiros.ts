import { useCallback, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { LocalStorageService } from '@/lib/storage';
import type { Porteiro } from '@/types';

export function usePorteiros() {
  const [porteiros, setPorteiros] = useState<Porteiro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPorteiros = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured()) {
      setPorteiros(LocalStorageService.getPorteiros());
      setLoading(false);
      return;
    }

    try {
      const { data, error: fetchErr } = await supabase
        .from('porteiros')
        .select('*')
        .order('nome', { ascending: true });

      if (fetchErr) {
        console.warn('Supabase porteiros fetch failed, using local storage:', fetchErr.message);
        setPorteiros(LocalStorageService.getPorteiros());
      } else {
        setPorteiros(data ?? []);
      }
    } catch (err) {
      console.warn('Network error in porteiros, using local storage fallback:', err);
      setPorteiros(LocalStorageService.getPorteiros());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPorteiros();
  }, [fetchPorteiros]);

  const addPorteiro = async (porteiro: Omit<Porteiro, 'id' | 'created_at'>) => {
    if (!isSupabaseConfigured()) {
      LocalStorageService.addPorteiro(porteiro);
      await fetchPorteiros();
      return;
    }

    try {
      const { error: insertErr } = await supabase.from('porteiros').insert(porteiro);
      if (insertErr) {
        LocalStorageService.addPorteiro(porteiro);
      }
      await fetchPorteiros();
    } catch {
      LocalStorageService.addPorteiro(porteiro);
      await fetchPorteiros();
    }
  };

  const updatePorteiro = async (id: string, porteiro: Omit<Porteiro, 'id' | 'created_at'>) => {
    if (!isSupabaseConfigured()) {
      LocalStorageService.updatePorteiro(id, porteiro);
      await fetchPorteiros();
      return;
    }

    try {
      const { error: updateErr } = await supabase.from('porteiros').update(porteiro).eq('id', id);
      if (updateErr) {
        LocalStorageService.updatePorteiro(id, porteiro);
      }
      await fetchPorteiros();
    } catch {
      LocalStorageService.updatePorteiro(id, porteiro);
      await fetchPorteiros();
    }
  };

  const deletePorteiro = async (id: string) => {
    if (!isSupabaseConfigured()) {
      LocalStorageService.deletePorteiro(id);
      await fetchPorteiros();
      return;
    }

    try {
      const { error: deleteErr } = await supabase.from('porteiros').delete().eq('id', id);
      if (deleteErr) {
        LocalStorageService.deletePorteiro(id);
      }
      await fetchPorteiros();
    } catch {
      LocalStorageService.deletePorteiro(id);
      await fetchPorteiros();
    }
  };

  return {
    porteiros,
    loading,
    error,
    addPorteiro,
    updatePorteiro,
    deletePorteiro,
    refetch: fetchPorteiros,
  };
}

