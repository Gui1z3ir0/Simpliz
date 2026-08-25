import type { Condominio, Morador, Porteiro, Visitante, ControleAcesso, AcessoCompleto, StatusAcesso } from '@/types';

const STORAGE_KEYS = {
  CONDOMINIO: 'simpliz_condominio',
  MORADORES: 'simpliz_moradores',
  PORTEIROS: 'simpliz_porteiros',
  VISITANTES: 'simpliz_visitantes',
  ACESSOS: 'simpliz_acessos',
  INITIALIZED: 'simpliz_initialized_v2',
};

const DEFAULT_CONDOMINIO: Condominio = {
  id: 'c1',
  nome: 'Residencial Jardins do Parque',
  endereco: 'Av. Paulista, 1500 - Bela Vista, São Paulo - SP',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const DEFAULT_PORTEIROS: Porteiro[] = [
  { id: 'p1', nome: 'Carlos Eduardo Santos', turno: 'Manhã', created_at: new Date().toISOString() },
  { id: 'p2', nome: 'Roberto Albuquerque', turno: 'Tarde', created_at: new Date().toISOString() },
  { id: 'p3', nome: 'Marcos Vinícius Costa', turno: 'Noite', created_at: new Date().toISOString() },
  { id: 'p4', nome: 'Antônio Silva Ramos', turno: '12x36 (Diurno)', created_at: new Date().toISOString() },
];

const DEFAULT_MORADORES: Morador[] = [
  { id: 'm1', nome: 'Mariana Oliveira Souza', bloco: 'A', apartamento: '101', telefone: '(11) 98765-4321', created_at: new Date().toISOString() },
  { id: 'm2', nome: 'Dr. Fernando Guimarães', bloco: 'A', apartamento: '304', telefone: '(11) 99123-8877', created_at: new Date().toISOString() },
  { id: 'm3', nome: 'Juliana Castro Ramos', bloco: 'B', apartamento: '202', telefone: '(11) 97654-3210', created_at: new Date().toISOString() },
  { id: 'm4', nome: 'Ricardo Mendes Duarte', bloco: 'B', apartamento: '501', telefone: '(11) 98444-5566', created_at: new Date().toISOString() },
  { id: 'm5', nome: 'Beatriz Almeida Costa', bloco: 'C', apartamento: '103', telefone: '(11) 99555-1122', created_at: new Date().toISOString() },
  { id: 'm6', nome: 'Lucas Gabriel Pinheiro', bloco: 'C', apartamento: '402', telefone: '(11) 98111-7788', created_at: new Date().toISOString() },
];

const DEFAULT_VISITANTES: Visitante[] = [
  { id: 'v1', nome: 'Gabriel Medina Santos', documento: '45.892.110-X', telefone: '(11) 98877-2233', created_at: new Date().toISOString() },
  { id: 'v2', nome: 'Fernanda Lima Rocha (Sedex/Entrega)', documento: '38.441.902-8', telefone: '(11) 97711-4455', created_at: new Date().toISOString() },
  { id: 'v3', nome: 'Cláudio Ferreira (Técnico Internet)', documento: '50.123.876-4', telefone: '(11) 96622-3344', created_at: new Date().toISOString() },
  { id: 'v4', nome: 'Ana Paula Nogueira', documento: '41.229.008-1', telefone: '(11) 99933-8822', created_at: new Date().toISOString() },
  { id: 'v5', nome: 'Matheus Henrique Silva (Delivery)', documento: '52.331.774-0', telefone: '(11) 98222-1199', created_at: new Date().toISOString() },
];

function initDefaultDataIfNeeded() {
  if (typeof window === 'undefined') return;
  const isInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
  if (!isInitialized) {
    localStorage.setItem(STORAGE_KEYS.CONDOMINIO, JSON.stringify(DEFAULT_CONDOMINIO));
    localStorage.setItem(STORAGE_KEYS.PORTEIROS, JSON.stringify(DEFAULT_PORTEIROS));
    localStorage.setItem(STORAGE_KEYS.MORADORES, JSON.stringify(DEFAULT_MORADORES));
    localStorage.setItem(STORAGE_KEYS.VISITANTES, JSON.stringify(DEFAULT_VISITANTES));

    const now = Date.now();
    const iso = (minsAgo: number) => new Date(now - minsAgo * 60 * 1000).toISOString();

    const defaultAcessos: ControleAcesso[] = [
      {
        id: 'a1',
        visitante_id: 'v1',
        morador_id: 'm1',
        porteiro_id: null,
        status: 'aguardando',
        motivo_visita: 'Visita familiar',
        data_hora_solicitacao: iso(10),
        data_hora_entrada: null,
        data_hora_saida: null,
        observacao: '',
      },
      {
        id: 'a2',
        visitante_id: 'v2',
        morador_id: 'm2',
        porteiro_id: 'p1',
        status: 'liberado',
        motivo_visita: 'Entrega de pacote urgente',
        data_hora_solicitacao: iso(25),
        data_hora_entrada: null,
        data_hora_saida: null,
        observacao: 'Aguardando visitante se dirigir à guarita',
      },
      {
        id: 'a3',
        visitante_id: 'v3',
        morador_id: 'm3',
        porteiro_id: 'p1',
        status: 'no_condominio',
        motivo_visita: 'Manutenção de rede de internet',
        data_hora_solicitacao: iso(50),
        data_hora_entrada: iso(45),
        data_hora_saida: null,
        observacao: 'Entrada autorizada pelo morador',
      },
      {
        id: 'a4',
        visitante_id: 'v4',
        morador_id: 'm4',
        porteiro_id: 'p2',
        status: 'finalizado',
        motivo_visita: 'Almoço com morador',
        data_hora_solicitacao: iso(180),
        data_hora_entrada: iso(170),
        data_hora_saida: iso(30),
        observacao: 'Saída concluída na guarita principal',
      },
      {
        id: 'a5',
        visitante_id: 'v5',
        morador_id: 'm5',
        porteiro_id: 'p1',
        status: 'negado',
        motivo_visita: 'Entrega rápida',
        data_hora_solicitacao: iso(120),
        data_hora_entrada: null,
        data_hora_saida: null,
        observacao: 'Morador não atendeu ao interfone',
      },
    ];

    localStorage.setItem(STORAGE_KEYS.ACESSOS, JSON.stringify(defaultAcessos));
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  }
}

initDefaultDataIfNeeded();

function getList<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setList<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

export const LocalStorageService = {
  // Condomínio
  getCondominio(): Condominio {
    if (typeof window === 'undefined') return DEFAULT_CONDOMINIO;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CONDOMINIO);
      return raw ? JSON.parse(raw) : DEFAULT_CONDOMINIO;
    } catch {
      return DEFAULT_CONDOMINIO;
    }
  },

  updateCondominio(nome: string, endereco: string): Condominio {
    const current = this.getCondominio();
    const updated: Condominio = {
      ...current,
      nome,
      endereco,
      updated_at: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.CONDOMINIO, JSON.stringify(updated));
    return updated;
  },

  // Moradores
  getMoradores(): Morador[] {
    return getList<Morador>(STORAGE_KEYS.MORADORES);
  },

  addMorador(data: Omit<Morador, 'id' | 'created_at'>): Morador {
    const moradores = this.getMoradores();
    const newMorador: Morador = {
      ...data,
      id: 'm_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      created_at: new Date().toISOString(),
    };
    moradores.push(newMorador);
    setList(STORAGE_KEYS.MORADORES, moradores);
    return newMorador;
  },

  updateMorador(id: string, data: Omit<Morador, 'id' | 'created_at'>): Morador {
    const moradores = this.getMoradores();
    const index = moradores.findIndex((m) => m.id === id);
    if (index === -1) throw new Error('Morador não encontrado');
    const updated: Morador = { ...moradores[index], ...data };
    moradores[index] = updated;
    setList(STORAGE_KEYS.MORADORES, moradores);
    return updated;
  },

  deleteMorador(id: string): void {
    const moradores = this.getMoradores().filter((m) => m.id !== id);
    setList(STORAGE_KEYS.MORADORES, moradores);
  },

  // Porteiros
  getPorteiros(): Porteiro[] {
    return getList<Porteiro>(STORAGE_KEYS.PORTEIROS);
  },

  addPorteiro(data: Omit<Porteiro, 'id' | 'created_at'>): Porteiro {
    const porteiros = this.getPorteiros();
    const newPorteiro: Porteiro = {
      ...data,
      id: 'p_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      created_at: new Date().toISOString(),
    };
    porteiros.push(newPorteiro);
    setList(STORAGE_KEYS.PORTEIROS, porteiros);
    return newPorteiro;
  },

  updatePorteiro(id: string, data: Omit<Porteiro, 'id' | 'created_at'>): Porteiro {
    const porteiros = this.getPorteiros();
    const index = porteiros.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Porteiro não encontrado');
    const updated: Porteiro = { ...porteiros[index], ...data };
    porteiros[index] = updated;
    setList(STORAGE_KEYS.PORTEIROS, porteiros);
    return updated;
  },

  deletePorteiro(id: string): void {
    const porteiros = this.getPorteiros().filter((p) => p.id !== id);
    setList(STORAGE_KEYS.PORTEIROS, porteiros);
  },

  // Visitantes
  getVisitantes(): Visitante[] {
    return getList<Visitante>(STORAGE_KEYS.VISITANTES);
  },

  addVisitante(data: Omit<Visitante, 'id' | 'created_at'>): Visitante {
    const visitantes = this.getVisitantes();
    const newVisitante: Visitante = {
      ...data,
      id: 'v_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      created_at: new Date().toISOString(),
    };
    visitantes.push(newVisitante);
    setList(STORAGE_KEYS.VISITANTES, visitantes);
    return newVisitante;
  },

  // Controle de Acesso
  getAcessos(): AcessoCompleto[] {
    const acessos = getList<ControleAcesso>(STORAGE_KEYS.ACESSOS);
    const moradores = this.getMoradores();
    const porteiros = this.getPorteiros();
    const visitantes = this.getVisitantes();

    const result: AcessoCompleto[] = acessos.map((a) => ({
      ...a,
      visitante: visitantes.find((v) => v.id === a.visitante_id) || null,
      morador: moradores.find((m) => m.id === a.morador_id) || null,
      porteiro: porteiros.find((p) => p.id === a.porteiro_id) || null,
    }));

    return result.sort((a, b) => {
      return new Date(b.data_hora_solicitacao).getTime() - new Date(a.data_hora_solicitacao).getTime();
    });
  },

  solicitarAcesso(params: {
    moradorId: string;
    nomeVisitante: string;
    documentoVisitante: string;
    telefoneVisitante: string;
    motivoVisita: string;
  }): AcessoCompleto {
    const visitante = this.addVisitante({
      nome: params.nomeVisitante,
      documento: params.documentoVisitante,
      telefone: params.telefoneVisitante,
    });

    const acessos = getList<ControleAcesso>(STORAGE_KEYS.ACESSOS);
    const novoAcesso: ControleAcesso = {
      id: 'a_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      visitante_id: visitante.id,
      morador_id: params.moradorId,
      porteiro_id: null,
      status: 'aguardando',
      motivo_visita: params.motivoVisita,
      data_hora_solicitacao: new Date().toISOString(),
      data_hora_entrada: null,
      data_hora_saida: null,
      observacao: '',
    };

    acessos.unshift(novoAcesso);
    setList(STORAGE_KEYS.ACESSOS, acessos);

    const moradores = this.getMoradores();
    return {
      ...novoAcesso,
      visitante,
      morador: moradores.find((m) => m.id === params.moradorId) || null,
      porteiro: null,
    };
  },

  liberarAcesso(id: string, porteiroId: string): void {
    const acessos = getList<ControleAcesso>(STORAGE_KEYS.ACESSOS);
    const idx = acessos.findIndex((a) => a.id === id);
    if (idx !== -1) {
      acessos[idx].status = 'liberado';
      acessos[idx].porteiro_id = porteiroId;
      setList(STORAGE_KEYS.ACESSOS, acessos);
    }
  },

  negarAcesso(id: string, porteiroId: string, observacao: string): void {
    const acessos = getList<ControleAcesso>(STORAGE_KEYS.ACESSOS);
    const idx = acessos.findIndex((a) => a.id === id);
    if (idx !== -1) {
      acessos[idx].status = 'negado';
      acessos[idx].porteiro_id = porteiroId;
      acessos[idx].observacao = observacao;
      setList(STORAGE_KEYS.ACESSOS, acessos);
    }
  },

  registrarEntrada(id: string, porteiroId: string): void {
    const acessos = getList<ControleAcesso>(STORAGE_KEYS.ACESSOS);
    const idx = acessos.findIndex((a) => a.id === id);
    if (idx !== -1) {
      acessos[idx].status = 'no_condominio';
      acessos[idx].porteiro_id = porteiroId;
      acessos[idx].data_hora_entrada = new Date().toISOString();
      setList(STORAGE_KEYS.ACESSOS, acessos);
    }
  },

  registrarSaida(id: string): void {
    const acessos = getList<ControleAcesso>(STORAGE_KEYS.ACESSOS);
    const idx = acessos.findIndex((a) => a.id === id);
    if (idx !== -1) {
      acessos[idx].status = 'finalizado';
      acessos[idx].data_hora_saida = new Date().toISOString();
      setList(STORAGE_KEYS.ACESSOS, acessos);
    }
  },

  // Reset & Populate Demo
  populateDemoData(): { success: boolean; message: string } {
    localStorage.removeItem(STORAGE_KEYS.INITIALIZED);
    localStorage.removeItem(STORAGE_KEYS.CONDOMINIO);
    localStorage.removeItem(STORAGE_KEYS.PORTEIROS);
    localStorage.removeItem(STORAGE_KEYS.MORADORES);
    localStorage.removeItem(STORAGE_KEYS.VISITANTES);
    localStorage.removeItem(STORAGE_KEYS.ACESSOS);
    initDefaultDataIfNeeded();
    return { success: true, message: 'Dados de demonstração carregados com sucesso!' };
  },

  resetSystemData(): { success: boolean; message: string } {
    setList(STORAGE_KEYS.MORADORES, []);
    setList(STORAGE_KEYS.PORTEIROS, []);
    setList(STORAGE_KEYS.VISITANTES, []);
    setList(STORAGE_KEYS.ACESSOS, []);
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    return { success: true, message: 'Banco de dados zerado com sucesso! Nenhum usuário cadastrado.' };
  },
};
