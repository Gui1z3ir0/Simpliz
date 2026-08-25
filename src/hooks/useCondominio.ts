import { useCallback, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { LocalStorageService } from '@/lib/storage';
import type { Condominio } from '@/types';

export function useCondominio() {
  const [condominio, setCondominio] = useState<Condominio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCondominio = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured()) {
      setCondominio(LocalStorageService.getCondominio());
      setLoading(false);
      return;
    }

    try {
      const { data, error: fetchErr } = await supabase
        .from('condominio')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (fetchErr) {
        console.warn('Supabase fetch failed, falling back to local storage:', fetchErr.message);
        setCondominio(LocalStorageService.getCondominio());
      } else if (data) {
        setCondominio(data);
      } else {
        const local = LocalStorageService.getCondominio();
        setCondominio(local);
      }
    } catch (err) {
      console.warn('Network error, using local storage fallback:', err);
      setCondominio(LocalStorageService.getCondominio());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCondominio();
  }, [fetchCondominio]);

  const updateCondominio = async (nome: string, endereco: string) => {
    if (!isSupabaseConfigured()) {
      const updated = LocalStorageService.updateCondominio(nome, endereco);
      setCondominio(updated);
      return;
    }

    try {
      if (!condominio || condominio.id === 'default' || condominio.id === 'c1') {
        const { data, error: insertErr } = await supabase
          .from('condominio')
          .insert({ nome, endereco })
          .select()
          .maybeSingle();
        if (insertErr) {
          const updated = LocalStorageService.updateCondominio(nome, endereco);
          setCondominio(updated);
        } else if (data) {
          setCondominio(data);
        }
      } else {
        const { error: updateErr } = await supabase
          .from('condominio')
          .update({ nome, endereco, updated_at: new Date().toISOString() })
          .eq('id', condominio.id);
        if (updateErr) {
          const updated = LocalStorageService.updateCondominio(nome, endereco);
          setCondominio(updated);
        }
      }
      await fetchCondominio();
    } catch {
      const updated = LocalStorageService.updateCondominio(nome, endereco);
      setCondominio(updated);
    }
  };

  return { condominio, loading, error, updateCondominio, refetch: fetchCondominio };
}

