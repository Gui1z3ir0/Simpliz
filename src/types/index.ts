export type StatusAcesso =
  | 'aguardando'
  | 'liberado'
  | 'no_condominio'
  | 'finalizado'
  | 'negado';

export interface Condominio {
  id: string;
  nome: string;
  endereco: string;
  created_at?: string;
  updated_at?: string;
}

export interface Morador {
  id: string;
  nome: string;
  bloco: string;
  apartamento: string;
  telefone: string;
  created_at?: string;
}

export interface Porteiro {
  id: string;
  nome: string;
  turno: string;
  created_at?: string;
}

export interface Visitante {
  id: string;
  nome: string;
  documento: string;
  telefone: string;
  created_at?: string;
}

export interface ControleAcesso {
  id: string;
  visitante_id: string;
  morador_id: string;
  porteiro_id: string | null;
  status: StatusAcesso;
  motivo_visita: string;
  data_hora_solicitacao: string;
  data_hora_entrada: string | null;
  data_hora_saida: string | null;
  observacao: string;
}

export interface AcessoCompleto extends ControleAcesso {
  visitante?: Visitante | null;
  morador?: Morador | null;
  porteiro?: Porteiro | null;
}

