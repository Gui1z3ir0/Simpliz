import { useCallback, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { LocalStorageService } from '@/lib/storage';
import type { AcessoCompleto, StatusAcesso } from '@/types';

export function useControleAcesso() {
  const [acessos, setAcessos] = useState<AcessoCompleto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAcessos = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured()) {
      setAcessos(LocalStorageService.getAcessos());
      setLoading(false);
      return;
    }

    try {
      const { data, error: fetchErr } = await supabase
        .from('controle_acesso')
        .select('*, visitante:visitantes(*), morador:moradores(*), porteiro:porteiros(*)')
        .order('data_hora_solicitacao', { ascending: false });

      if (fetchErr) {
        console.warn('Supabase acessos fetch failed, using local storage:', fetchErr.message);
        setAcessos(LocalStorageService.getAcessos());
      } else {
        setAcessos((data as unknown as AcessoCompleto[]) ?? []);
      }
    } catch (err) {
      console.warn('Network error in acessos, using local storage fallback:', err);
      setAcessos(LocalStorageService.getAcessos());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAcessos();
  }, [fetchAcessos]);

  const solicitarAcesso = async (params: {
    moradorId: string;
    nomeVisitante: string;
    documentoVisitante: string;
    telefoneVisitante: string;
    motivoVisita: string;
  }) => {
    if (!isSupabaseConfigured()) {
      LocalStorageService.solicitarAcesso(params);
      await fetchAcessos();
      return;
    }

    try {
      const { data: visitante, error: visitanteError } = await supabase
        .from('visitantes')
        .insert({
          nome: params.nomeVisitante,
          documento: params.documentoVisitante,
          telefone: params.telefoneVisitante,
        })
        .select()
        .maybeSingle();

      if (visitanteError || !visitante) {
        LocalStorageService.solicitarAcesso(params);
        await fetchAcessos();
        return;
      }

      const { error: acessoError } = await supabase.from('controle_acesso').insert({
        visitante_id: visitante.id,
        morador_id: params.moradorId,
        motivo_visita: params.motivoVisita,
        status: 'aguardando' as StatusAcesso,
      });

      if (acessoError) {
        LocalStorageService.solicitarAcesso(params);
      }
      await fetchAcessos();
    } catch {
      LocalStorageService.solicitarAcesso(params);
      await fetchAcessos();
    }
  };

  const liberarAcesso = async (id: string, porteiroId: string) => {
    if (!isSupabaseConfigured()) {
      LocalStorageService.liberarAcesso(id, porteiroId);
      await fetchAcessos();
      return;
    }

    try {
      const { error: libErr } = await supabase
        .from('controle_acesso')
        .update({ status: 'liberado', porteiro_id: porteiroId })
        .eq('id', id);
      if (libErr) {
        LocalStorageService.liberarAcesso(id, porteiroId);
      }
      await fetchAcessos();
    } catch {
      LocalStorageService.liberarAcesso(id, porteiroId);
      await fetchAcessos();
    }
  };

  const negarAcesso = async (id: string, porteiroId: string, observacao: string) => {
    if (!isSupabaseConfigured()) {
      LocalStorageService.negarAcesso(id, porteiroId, observacao);
      await fetchAcessos();
      return;
    }

    try {
      const { error: negErr } = await supabase
        .from('controle_acesso')
        .update({ status: 'negado', porteiro_id: porteiroId, observacao })
        .eq('id', id);
      if (negErr) {
        LocalStorageService.negarAcesso(id, porteiroId, observacao);
      }
      await fetchAcessos();
    } catch {
      LocalStorageService.negarAcesso(id, porteiroId, observacao);
      await fetchAcessos();
    }
  };

  const registrarEntrada = async (id: string, porteiroId: string) => {
    if (!isSupabaseConfigured()) {
      LocalStorageService.registrarEntrada(id, porteiroId);
      await fetchAcessos();
      return;
    }

    try {
      const { error: entErr } = await supabase
        .from('controle_acesso')
        .update({
          status: 'no_condominio',
          porteiro_id: porteiroId,
          data_hora_entrada: new Date().toISOString(),
        })
        .eq('id', id);
      if (entErr) {
        LocalStorageService.registrarEntrada(id, porteiroId);
      }
      await fetchAcessos();
    } catch {
      LocalStorageService.registrarEntrada(id, porteiroId);
      await fetchAcessos();
    }
  };

  const registrarSaida = async (id: string) => {
    if (!isSupabaseConfigured()) {
      LocalStorageService.registrarSaida(id);
      await fetchAcessos();
      return;
    }

    try {
      const { error: saiErr } = await supabase
        .from('controle_acesso')
        .update({
          status: 'finalizado',
          data_hora_saida: new Date().toISOString(),
        })
        .eq('id', id);
      if (saiErr) {
        LocalStorageService.registrarSaida(id);
      }
      await fetchAcessos();
    } catch {
      LocalStorageService.registrarSaida(id);
      await fetchAcessos();
    }
  };

  return {
    acessos,
    loading,
    error,
    solicitarAcesso,
    liberarAcesso,
    negarAcesso,
    registrarEntrada,
    registrarSaida,
    refetch: fetchAcessos,
  };
}

