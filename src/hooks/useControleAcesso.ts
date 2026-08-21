import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { AcessoCompleto, StatusAcesso } from '@/types';

export function useControleAcesso() {
  const [acessos, setAcessos] = useState<AcessoCompleto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAcessos = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('controle_acesso')
        .select('*, visitante:visitantes(*), morador:moradores(*), porteiro:porteiros(*)')
        .order('data_hora_solicitacao', { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setAcessos((data as unknown as AcessoCompleto[]) ?? []);
        setError(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar registros de acesso.');
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
    const { data: visitante, error: visitanteError } = await supabase
      .from('visitantes')
      .insert({
        nome: params.nomeVisitante,
        documento: params.documentoVisitante,
        telefone: params.telefoneVisitante,
      })
      .select()
      .maybeSingle();

    if (visitanteError) throw new Error(visitanteError.message);
    if (!visitante) throw new Error('Não foi possível registrar o visitante.');

    const { error: acessoError } = await supabase.from('controle_acesso').insert({
      visitante_id: visitante.id,
      morador_id: params.moradorId,
      motivo_visita: params.motivoVisita,
      status: 'aguardando' as StatusAcesso,
    });

    if (acessoError) throw new Error(acessoError.message);
    await fetchAcessos();
  };

  const liberarAcesso = async (id: string, porteiroId: string) => {
    const { error } = await supabase
      .from('controle_acesso')
      .update({ status: 'liberado', porteiro_id: porteiroId })
      .eq('id', id);
    if (error) throw new Error(error.message);
    await fetchAcessos();
  };

  const negarAcesso = async (id: string, porteiroId: string, observacao: string) => {
    const { error } = await supabase
      .from('controle_acesso')
      .update({ status: 'negado', porteiro_id: porteiroId, observacao })
      .eq('id', id);
    if (error) throw new Error(error.message);
    await fetchAcessos();
  };

  const registrarEntrada = async (id: string, porteiroId: string) => {
    const { error } = await supabase
      .from('controle_acesso')
      .update({
        status: 'no_condominio',
        porteiro_id: porteiroId,
        data_hora_entrada: new Date().toISOString(),
      })
      .eq('id', id);
    if (error) throw new Error(error.message);
    await fetchAcessos();
  };

  const registrarSaida = async (id: string) => {
    const { error } = await supabase
      .from('controle_acesso')
      .update({
        status: 'finalizado',
        data_hora_saida: new Date().toISOString(),
      })
      .eq('id', id);
    if (error) throw new Error(error.message);
    await fetchAcessos();
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
