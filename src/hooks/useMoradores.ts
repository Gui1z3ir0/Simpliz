import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Morador } from '@/types';

export function useMoradores() {
  const [moradores, setMoradores] = useState<Morador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMoradores = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: fetchErr } = await supabase
        .from('moradores')
        .select('*')
        .order('bloco', { ascending: true })
        .order('apartamento', { ascending: true });

      if (fetchErr) {
        setError(fetchErr.message);
      } else {
        setMoradores(data ?? []);
        setError(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar moradores');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMoradores();
  }, [fetchMoradores]);

  const addMorador = async (morador: Omit<Morador, 'id' | 'created_at'>) => {
    const { error: insertErr } = await supabase.from('moradores').insert(morador);
    if (insertErr) throw new Error(insertErr.message);
    await fetchMoradores();
  };

  const updateMorador = async (id: string, morador: Omit<Morador, 'id' | 'created_at'>) => {
    const { error: updateErr } = await supabase.from('moradores').update(morador).eq('id', id);
    if (updateErr) throw new Error(updateErr.message);
    await fetchMoradores();
  };

  const deleteMorador = async (id: string) => {
    const { error: deleteErr } = await supabase.from('moradores').delete().eq('id', id);
    if (deleteErr) throw new Error(deleteErr.message);
    await fetchMoradores();
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
