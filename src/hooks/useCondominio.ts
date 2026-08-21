import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Condominio } from '@/types';

const DEFAULT_CONDOMINIO: Condominio = {
  id: 'default',
  nome: 'Residencial',
  endereco: 'Portaria Principal',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};


export function useCondominio() {
  const [condominio, setCondominio] = useState<Condominio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCondominio = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: fetchErr } = await supabase
        .from('condominio')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (fetchErr) {
        setError(fetchErr.message);
      } else if (data) {
        setCondominio(data);
        setError(null);
      } else {
        // Create initial default condominium if table is empty
        const { data: created, error: createErr } = await supabase
          .from('condominio')
          .insert({ nome: 'Portaria Residencial', endereco: '' })
          .select()
          .maybeSingle();

        if (createErr) {
          setCondominio(DEFAULT_CONDOMINIO);
        } else {
          setCondominio(created || DEFAULT_CONDOMINIO);
        }
        setError(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados do condomínio');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCondominio();
  }, [fetchCondominio]);

  const updateCondominio = async (nome: string, endereco: string) => {
    if (!condominio) return;
    try {
      if (condominio.id === 'default') {
        const { data, error: insertErr } = await supabase
          .from('condominio')
          .insert({ nome, endereco })
          .select()
          .maybeSingle();
        if (insertErr) throw new Error(insertErr.message);
        if (data) setCondominio(data);
      } else {
        const { error: updateErr } = await supabase
          .from('condominio')
          .update({ nome, endereco, updated_at: new Date().toISOString() })
          .eq('id', condominio.id);
        if (updateErr) throw new Error(updateErr.message);
      }
      await fetchCondominio();
    } catch (err) {
      throw err instanceof Error ? err : new Error('Erro ao salvar alterações');
    }
  };

  return { condominio, loading, error, updateCondominio, refetch: fetchCondominio };
}
