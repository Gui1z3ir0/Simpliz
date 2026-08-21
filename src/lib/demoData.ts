import { supabase } from './supabase';

export async function populateDemoData(): Promise<{ success: boolean; message: string }> {
  try {
    // 1. Condomínio
    const { data: condExist } = await supabase.from('condominio').select('id').limit(1);
    if (!condExist || condExist.length === 0) {
      await supabase.from('condominio').insert({
        nome: 'Residencial Jardins do Parque',
        endereco: 'Av. Paulista, 1500 - Bela Vista, São Paulo - SP',
      });
    }

    // 2. Porteiros
    const porteirosData = [
      { nome: 'Carlos Eduardo Santos', turno: 'Manhã' },
      { nome: 'Roberto Albuquerque', turno: 'Tarde' },
      { nome: 'Marcos Vinícius Costa', turno: 'Noite' },
      { nome: 'Antônio Silva Ramos', turno: '12x36 (Diurno)' },
    ];

    const { data: existingPorteiros } = await supabase.from('porteiros').select('id, nome');
    let porteiros = existingPorteiros || [];
    if (porteiros.length === 0) {
      const { data: insertedPorteiros } = await supabase.from('porteiros').insert(porteirosData).select();
      porteiros = insertedPorteiros || [];
    }

    // 3. Moradores
    const moradoresData = [
      { nome: 'Mariana Oliveira Souza', bloco: 'A', apartamento: '101', telefone: '(11) 98765-4321' },
      { nome: 'Dr. Fernando Guimarães', bloco: 'A', apartamento: '304', telefone: '(11) 99123-8877' },
      { nome: 'Juliana Castro Ramos', bloco: 'B', apartamento: '202', telefone: '(11) 97654-3210' },
      { nome: 'Ricardo Mendes Duarte', bloco: 'B', apartamento: '501', telefone: '(11) 98444-5566' },
      { nome: 'Beatriz Almeida Costa', bloco: 'C', apartamento: '103', telefone: '(11) 99555-1122' },
      { nome: 'Lucas Gabriel Pinheiro', bloco: 'C', apartamento: '402', telefone: '(11) 98111-7788' },
    ];

    const { data: existingMoradores } = await supabase.from('moradores').select('id, nome, bloco, apartamento');
    let moradores = existingMoradores || [];
    if (moradores.length === 0) {
      const { data: insertedMoradores } = await supabase.from('moradores').insert(moradoresData).select();
      moradores = insertedMoradores || [];
    }

    // 4. Visitantes
    const visitantesData = [
      { nome: 'Gabriel Medina Santos', documento: '45.892.110-X', telefone: '(11) 98877-2233' },
      { nome: 'Fernanda Lima Rocha (Sedex/Entrega)', documento: '38.441.902-8', telefone: '(11) 97711-4455' },
      { nome: 'Cláudio Ferreira (Técnico Internet)', documento: '50.123.876-4', telefone: '(11) 96622-3344' },
      { nome: 'Ana Paula Nogueira', documento: '41.229.008-1', telefone: '(11) 99933-8822' },
      { nome: 'Matheus Henrique Silva (Uber Eats)', documento: '52.331.774-0', telefone: '(11) 98222-1199' },
    ];

    const { data: existingVisitantes } = await supabase.from('visitantes').select('id, nome');
    let visitantes = existingVisitantes || [];
    if (visitantes.length === 0) {
      const { data: insertedVisitantes } = await supabase.from('visitantes').insert(visitantesData).select();
      visitantes = insertedVisitantes || [];
    }

    // 5. Controle de Acesso (Histórico e Fluxos Ativos)
    const { data: existingAcessos } = await supabase.from('controle_acesso').select('id').limit(1);
    if (!existingAcessos || existingAcessos.length === 0) {
      const pId = porteiros[0]?.id || null;
      const now = new Date();

      const formatIso = (minusMinutes: number) => {
        return new Date(now.getTime() - minusMinutes * 60 * 1000).toISOString();
      };

      if (moradores.length >= 4 && visitantes.length >= 4) {
        await supabase.from('controle_acesso').insert([
          {
            visitante_id: visitantes[0].id,
            morador_id: moradores[0].id,
            porteiro_id: null,
            status: 'aguardando',
            motivo_visita: 'Visita familiar de fim de semana',
            data_hora_solicitacao: formatIso(8),
            data_hora_entrada: null,
            data_hora_saida: null,
            observacao: '',
          },
          {
            visitante_id: visitantes[1].id,
            morador_id: moradores[1].id,
            porteiro_id: pId,
            status: 'liberado',
            motivo_visita: 'Entrega de encomenda / Pacote urgente',
            data_hora_solicitacao: formatIso(15),
            data_hora_entrada: null,
            data_hora_saida: null,
            observacao: 'Aguardando visitante se dirigir à guarita.',
          },
          {
            visitante_id: visitantes[2].id,
            morador_id: moradores[2].id,
            porteiro_id: pId,
            status: 'no_condominio',
            motivo_visita: 'Manutenção de fibra óptica',
            data_hora_solicitacao: formatIso(45),
            data_hora_entrada: formatIso(40),
            data_hora_saida: null,
            observacao: 'Entrada de serviço autorizada pelo morador.',
          },
          {
            visitante_id: visitantes[3].id,
            morador_id: moradores[3].id,
            porteiro_id: pId,
            status: 'finalizado',
            motivo_visita: 'Almoço com morador',
            data_hora_solicitacao: formatIso(180),
            data_hora_entrada: formatIso(170),
            data_hora_saida: formatIso(30),
            observacao: 'Saída registrada pela guarita principal.',
          },
          {
            visitante_id: visitantes[4]?.id || visitantes[0].id,
            morador_id: moradores[4]?.id || moradores[0].id,
            porteiro_id: pId,
            status: 'negado',
            motivo_visita: 'Entrega rápida',
            data_hora_solicitacao: formatIso(120),
            data_hora_entrada: null,
            data_hora_saida: null,
            observacao: 'Morador não atendeu ao interfone e não autorizou.',
          },
        ]);
      }
    }

    return { success: true, message: 'Dados de demonstração carregados com sucesso!' };
  } catch (err) {
    console.error('Demo data seed error:', err);
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Erro ao popular dados de demonstração.',
    };
  }
}

export async function resetSystemData(): Promise<{ success: boolean; message: string }> {
  try {
    // 1. Excluir controle de acesso (movimentações e histórico)
    const { error: errAcesso } = await supabase
      .from('controle_acesso')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    if (errAcesso) throw errAcesso;

    // 2. Excluir visitantes
    const { error: errVisitantes } = await supabase
      .from('visitantes')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    if (errVisitantes) throw errVisitantes;

    // 3. Excluir moradores
    const { error: errMoradores } = await supabase
      .from('moradores')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    if (errMoradores) throw errMoradores;

    // 4. Excluir porteiros
    const { error: errPorteiros } = await supabase
      .from('porteiros')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    if (errPorteiros) throw errPorteiros;

    return {
      success: true,
      message: 'Sistema zerado com sucesso! Nenhum usuário ou registro cadastrado.',
    };
  } catch (err) {
    console.error('Reset system data error:', err);
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Erro ao zerar dados do sistema.',
    };
  }
}

