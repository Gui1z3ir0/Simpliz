import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Porteiro } from '@/types';

export function usePorteiros() {
  const [porteiros, setPorteiros] = useState<Porteiro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPorteiros = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: fetchErr } = await supabase
        .from('porteiros')
        .select('*')
        .order('nome', { ascending: true });

      if (fetchErr) {
        setError(fetchErr.message);
      } else {
        setPorteiros(data ?? []);
        setError(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar porteiros');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPorteiros();
  }, [fetchPorteiros]);

  const addPorteiro = async (porteiro: Omit<Porteiro, 'id' | 'created_at'>) => {
    const { error: insertErr } = await supabase.from('porteiros').insert(porteiro);
    if (insertErr) throw new Error(insertErr.message);
    await fetchPorteiros();
  };

  const updatePorteiro = async (id: string, porteiro: Omit<Porteiro, 'id' | 'created_at'>) => {
    const { error: updateErr } = await supabase.from('porteiros').update(porteiro).eq('id', id);
    if (updateErr) throw new Error(updateErr.message);
    await fetchPorteiros();
  };

  const deletePorteiro = async (id: string) => {
    const { error: deleteErr } = await supabase.from('porteiros').delete().eq('id', id);
    if (deleteErr) throw new Error(deleteErr.message);
    await fetchPorteiros();
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
