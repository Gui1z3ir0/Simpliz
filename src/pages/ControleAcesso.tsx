import { useMemo, useState } from 'react';
import {
  Plus,
  DoorOpen,
  ShieldCheck,
  XCircle,
  LogIn,
  LogOut,
  UserRound,
  FileText,
  Clock,
  Search,
  CheckCircle2,
  Calendar,
  Phone,
  AlertCircle,
  Building,
} from 'lucide-react';
import { Modal } from '@/components/Modal';
import { StatusBadge } from '@/components/StatusBadge';
import { useControleAcesso } from '@/hooks/useControleAcesso';
import { useMoradores } from '@/hooks/useMoradores';
import { usePorteiros } from '@/hooks/usePorteiros';
import type { AcessoCompleto, StatusAcesso, Morador } from '@/types';

type FiltroStatus = 'todos' | StatusAcesso;

const FILTROS: { key: FiltroStatus; label: string }[] = [
  { key: 'todos', label: 'Todos os Registros' },
  { key: 'aguardando', label: 'Aguardando' },
  { key: 'liberado', label: 'Liberados' },
  { key: 'no_condominio', label: 'No Condomínio' },
  { key: 'finalizado', label: 'Concluídos' },
  { key: 'negado', label: 'Recusados' },
];

function formatDateTime(value: string | null | undefined) {
  if (!value) return '-';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '-';
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatShortTime(value: string | null | undefined) {
  if (!value) return '-';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '-';
  return d.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ControleAcesso() {
  const {
    acessos,
    loading,
    error,
    solicitarAcesso,
    liberarAcesso,
    negarAcesso,
    registrarEntrada,
    registrarSaida,
  } = useControleAcesso();
  const { moradores, loading: loadingMoradores } = useMoradores();
  const { porteiros, loading: loadingPorteiros } = usePorteiros();

  const [filtro, setFiltro] = useState<FiltroStatus>('todos');
  const [busca, setBusca] = useState('');
  const [porteiroServico, setPorteiroServico] = useState('');
  const [solicitarOpen, setSolicitarOpen] = useState(false);
  const [negarTarget, setNegarTarget] = useState<AcessoCompleto | null>(null);
  const [motivoNegacao, setMotivoNegacao] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const listaFiltrada = useMemo(() => {
    let list = filtro === 'todos' ? acessos : acessos.filter((a) => a.status === filtro);
    if (busca.trim()) {
      const term = busca.toLowerCase().trim();
      list = list.filter(
        (a) =>
          (a.visitante?.nome && a.visitante.nome.toLowerCase().includes(term)) ||
          (a.morador?.nome && a.morador.nome.toLowerCase().includes(term)) ||
          (a.morador?.bloco && a.morador.bloco.toLowerCase().includes(term)) ||
          (a.morador?.apartamento && a.morador.apartamento.toLowerCase().includes(term)) ||
          (a.motivo_visita && a.motivo_visita.toLowerCase().includes(term)) ||
          (a.visitante?.documento && a.visitante.documento.toLowerCase().includes(term))
      );
    }
    return list;
  }, [acessos, filtro, busca]);

  const showFeedback = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const runAction = async (id: string, action: () => Promise<void>, successMessage: string) => {
    setActionError(null);
    setBusyId(id);
    try {
      await action();
      showFeedback(successMessage);
      return true;
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Erro ao processar ação.');
      return false;
    } finally {
      setBusyId(null);
    }
  };

  const handleLiberar = (acesso: AcessoCompleto) => {
    if (!porteiroServico) {
      setActionError('Selecione o porteiro de serviço no topo antes de liberar o acesso.');
      return;
    }
    runAction(
      acesso.id,
      () => liberarAcesso(acesso.id, porteiroServico),
      `Acesso de ${acesso.visitante?.nome || 'visitante'} liberado com sucesso!`
    );
  };

  const handleEntrada = (acesso: AcessoCompleto) => {
    if (!porteiroServico) {
      setActionError('Selecione o porteiro de serviço no topo antes de registrar a entrada.');
      return;
    }
    runAction(
      acesso.id,
      () => registrarEntrada(acesso.id, porteiroServico),
      `Entrada de ${acesso.visitante?.nome || 'visitante'} registrada no condomínio.`
    );
  };

  const handleSaida = (acesso: AcessoCompleto) => {
    runAction(
      acesso.id,
      () => registrarSaida(acesso.id),
      `Saída de ${acesso.visitante?.nome || 'visitante'} registrada. Acesso finalizado.`
    );
  };

  const handleNegar = () => {
    if (!negarTarget) return;
    if (!porteiroServico) {
      setActionError('Selecione o porteiro de serviço antes de recusar o acesso.');
      return;
    }
    runAction(
      negarTarget.id,
      () => negarAcesso(negarTarget.id, porteiroServico, motivoNegacao.trim()),
      `Acesso de ${negarTarget.visitante?.nome || 'visitante'} recusado.`
    ).then((success) => {
      if (success) {
        setNegarTarget(null);
        setMotivoNegacao('');
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl shadow-xs ring-1 ring-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-display">
              Controle de Acesso
            </h1>
            <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700 ring-1 ring-teal-200">
              {acessos.length} {acessos.length === 1 ? 'registro' : 'registros'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Gestão de entradas, saídas, autorizações de moradores e histórico da guarita.
          </p>
        </div>

        <button
          onClick={() => setSolicitarOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-teal-700 active:scale-95"
        >
          <Plus size={16} />
          <span>Nova Solicitação</span>
        </button>
      </div>

      {/* Porteiro de Serviço Selection Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-white p-4 sm:p-5 ring-1 ring-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3.5 w-full sm:w-auto">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 ring-1 ring-teal-100">
            <UserRound size={20} />
          </div>
          <div className="flex-1 sm:flex-initial min-w-0">
            <label className="text-xs font-bold text-slate-700 block uppercase tracking-wide">
              Porteiro de Plantão Responsável:
            </label>
            <select
              value={porteiroServico}
              onChange={(e) => {
                setPorteiroServico(e.target.value);
                setActionError(null);
              }}
              className="mt-1 w-full sm:w-80 rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-medium text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 bg-slate-50/50"
            >
              <option value="">Selecione o porteiro em serviço...</option>
              {porteiros.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome} — Turno {p.turno}
                </option>
              ))}
            </select>
          </div>
        </div>

        {!loadingPorteiros && porteiros.length === 0 && (
          <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3.5 py-2 rounded-xl flex items-center gap-2">
            <AlertCircle size={15} />
            <span>Cadastre um porteiro na aba "Equipe de Portaria" para autorizar liberações.</span>
          </div>
        )}
      </div>

      {/* Success / Error Banners */}
      {actionSuccess && (
        <div className="rounded-2xl bg-emerald-50 p-4 text-xs sm:text-sm font-medium text-emerald-800 ring-1 ring-emerald-200 flex items-center justify-between animate-fadeIn">
          <span className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600" />
            {actionSuccess}
          </span>
          <button
            onClick={() => setActionSuccess(null)}
            className="text-xs font-bold text-emerald-700 hover:underline"
          >
            Fechar
          </button>
        </div>
      )}

      {actionError && (
        <div className="rounded-2xl bg-red-50 p-4 text-xs sm:text-sm font-medium text-red-800 ring-1 ring-red-200 flex items-center justify-between animate-fadeIn">
          <span className="flex items-center gap-2">
            <AlertCircle size={16} className="text-red-600" />
            {actionError}
          </span>
          <button
            onClick={() => setActionError(null)}
            className="text-xs font-bold text-red-700 hover:underline"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Filters & Search Controls */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        <div className="flex gap-1.5 overflow-x-auto pb-1.5 max-w-full no-scrollbar">
          {FILTROS.map(({ key, label }) => {
            const count =
              key === 'todos' ? acessos.length : acessos.filter((a) => a.status === key).length;
            const active = filtro === key;
            return (
              <button
                key={key}
                onClick={() => setFiltro(key)}
                className={`shrink-0 flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                  active
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 ring-1 ring-slate-200/80 hover:bg-slate-50'
                }`}
              >
                <span>{label}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    active ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative min-w-[260px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar visitante, morador, bloco..."
            className="w-full pl-10 pr-9 py-2 text-xs rounded-xl border border-slate-200 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 bg-white"
          />
          {busca && (
            <button
              onClick={() => setBusca('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 px-1"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Access Cards Feed */}
      <div className="space-y-3.5">
        {loading && (
          <p className="py-12 text-center text-sm text-slate-400">
            Carregando movimentações da portaria...
          </p>
        )}

        {error && (
          <p className="p-4 text-sm text-red-700 bg-red-50 rounded-2xl border border-red-200">
            {error}
          </p>
        )}

        {!loading && listaFiltrada.length === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-3xl bg-white py-16 text-center ring-1 ring-slate-200/80 shadow-xs">
            <DoorOpen size={36} className="text-slate-300 mb-1" />
            <p className="text-base text-slate-700 font-bold font-display">
              Nenhum registro de acesso encontrado
            </p>
            <p className="text-xs text-slate-400 max-w-sm">
              {busca
                ? `Nenhum resultado corresponde à busca "${busca}".`
                : 'Não há registros para o filtro selecionado. Registre uma nova solicitação no botão acima.'}
            </p>
          </div>
        )}

        {!loading &&
          listaFiltrada.map((acesso) => {
            const isAguardando = acesso.status === 'aguardando';
            const isLiberado = acesso.status === 'liberado';
            const isNoCondominio = acesso.status === 'no_condominio';

            return (
              <div
                key={acesso.id}
                className="rounded-3xl bg-white p-5 sm:p-6 ring-1 ring-slate-200/80 shadow-xs transition-all hover:shadow-md hover:ring-slate-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Column: Visitor & Resident Info */}
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white font-bold text-sm shadow-xs">
                        {(acesso.visitante?.nome || 'V').charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold text-slate-900 text-base font-display">
                            {acesso.visitante?.nome || 'Visitante'}
                          </p>
                          <StatusBadge status={acesso.status} />
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Documento: <strong className="text-slate-700">{acesso.visitante?.documento || 'Não informado'}</strong>
                          {acesso.visitante?.telefone && ` · Tel: ${acesso.visitante.telefone}`}
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Building size={14} className="text-teal-600" />
                        <span>
                          Visitando: <strong className="font-semibold text-slate-900">{acesso.morador?.nome || 'Morador'}</strong>
                        </span>
                        <span className="bg-white px-2 py-0.5 rounded-md text-slate-600 font-semibold ring-1 ring-slate-200">
                          Bloco {acesso.morador?.bloco || '-'} · Apto {acesso.morador?.apartamento || '-'}
                        </span>
                      </div>

                      {acesso.motivo_visita && (
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <FileText size={13} className="text-slate-400" />
                          <span>Motivo: <strong className="text-slate-800">{acesso.motivo_visita}</strong></span>
                        </div>
                      )}
                    </div>

                    {/* Timestamps and Operator */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> Solicitado: {formatDateTime(acesso.data_hora_solicitacao)}
                      </span>
                      {acesso.data_hora_entrada && (
                        <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                          <LogIn size={12} /> Entrada: {formatDateTime(acesso.data_hora_entrada)}
                        </span>
                      )}
                      {acesso.data_hora_saida && (
                        <span className="flex items-center gap-1 text-slate-600">
                          <LogOut size={12} /> Saída: {formatDateTime(acesso.data_hora_saida)}
                        </span>
                      )}
                      {acesso.porteiro && (
                        <span className="text-slate-600 font-medium">
                          Porteiro: {acesso.porteiro.nome}
                        </span>
                      )}
                    </div>

                    {/* Denial Reason Banner if Rejected */}
                    {acesso.status === 'negado' && acesso.observacao && (
                      <p className="text-xs text-red-700 bg-red-50 p-2.5 rounded-xl border border-red-100 flex items-start gap-1.5">
                        <AlertCircle size={14} className="shrink-0 mt-0.5 text-red-600" />
                        <span><strong>Motivo da recusa:</strong> {acesso.observacao}</span>
                      </p>
                    )}
                  </div>

                  {/* Right Column: Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 self-end lg:self-center shrink-0">
                    {isAguardando && (
                      <>
                        <button
                          disabled={busyId === acesso.id}
                          onClick={() => handleLiberar(acesso)}
                          className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-60 shadow-xs transition-colors"
                        >
                          <ShieldCheck size={15} />
                          Liberar na Guarita
                        </button>
                        <button
                          disabled={busyId === acesso.id}
                          onClick={() => {
                            setNegarTarget(acesso);
                            setMotivoNegacao('');
                          }}
                          className="flex items-center gap-1.5 rounded-xl bg-red-50 px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:opacity-60 transition-colors"
                        >
                          <XCircle size={15} />
                          Recusar
                        </button>
                      </>
                    )}

                    {isLiberado && (
                      <>
                        <button
                          disabled={busyId === acesso.id}
                          onClick={() => handleEntrada(acesso)}
                          className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60 shadow-xs transition-colors"
                        >
                          <LogIn size={15} />
                          Registrar Entrada
                        </button>
                        <button
                          disabled={busyId === acesso.id}
                          onClick={() => {
                            setNegarTarget(acesso);
                            setMotivoNegacao('');
                          }}
                          className="flex items-center gap-1.5 rounded-xl bg-red-50 px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:opacity-60 transition-colors"
                        >
                          <XCircle size={15} />
                          Cancelar
                        </button>
                      </>
                    )}

                    {isNoCondominio && (
                      <button
                        disabled={busyId === acesso.id}
                        onClick={() => handleSaida(acesso)}
                        className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-60 shadow-xs transition-colors"
                      >
                        <LogOut size={15} />
                        Registrar Saída do Prédio
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* New Request Modal */}
      {solicitarOpen && (
        <NovaSolicitacaoModal
          moradores={moradores}
          loadingMoradores={loadingMoradores}
          onClose={() => setSolicitarOpen(false)}
          onSubmit={solicitarAcesso}
        />
      )}

      {/* Denial Reason Modal */}
      {negarTarget && (
        <Modal title="Recusar Acesso na Portaria" onClose={() => setNegarTarget(null)} maxWidth="max-w-md">
          <div className="space-y-3">
            <p className="text-xs sm:text-sm text-slate-600">
              Informe a justificativa para a recusa de entrada de{' '}
              <strong className="text-slate-900">{negarTarget.visitante?.nome || 'este visitante'}</strong>:
            </p>
            <textarea
              autoFocus
              value={motivoNegacao}
              onChange={(e) => setMotivoNegacao(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              placeholder="Ex: Morador não autorizou a entrada ou não atendeu ao interfone."
            />
            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setNegarTarget(null)}
                className="rounded-xl px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={handleNegar}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-red-700 shadow-xs transition-colors"
              >
                Confirmar Recusa
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

interface NovaSolicitacaoModalProps {
  moradores: Morador[];
  loadingMoradores: boolean;
  onClose: () => void;
  onSubmit: (params: {
    moradorId: string;
    nomeVisitante: string;
    documentoVisitante: string;
    telefoneVisitante: string;
    motivoVisita: string;
  }) => Promise<void>;
}

function NovaSolicitacaoModal({
  moradores,
  loadingMoradores,
  onClose,
  onSubmit,
}: NovaSolicitacaoModalProps) {
  const [moradorId, setMoradorId] = useState('');
  const [nome, setNome] = useState('');
  const [documento, setDocumento] = useState('');
  const [telefone, setTelefone] = useState('');
  const [motivo, setMotivo] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moradorId) {
      setFormError('Selecione o morador a ser visitado.');
      return;
    }
    if (!nome.trim()) {
      setFormError('Informe o nome completo do visitante.');
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      await onSubmit({
        moradorId,
        nomeVisitante: nome.trim(),
        documentoVisitante: documento.trim(),
        telefoneVisitante: telefone.trim(),
        motivoVisita: motivo.trim(),
      });
      onClose();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao registrar solicitação.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="Nova Solicitação de Acesso" onClose={onClose} maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs sm:text-sm font-semibold text-slate-700">
            Morador / Unidade de Destino *
          </label>
          <select
            required
            value={moradorId}
            onChange={(e) => setMoradorId(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 bg-white"
          >
            <option value="">Selecione o morador a ser visitado...</option>
            {moradores.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nome} — Bloco {m.bloco || '-'}, Apto {m.apartamento || '-'}
              </option>
            ))}
          </select>
          {!loadingMoradores && moradores.length === 0 && (
            <p className="mt-1.5 text-xs text-amber-700 bg-amber-50 p-2 rounded-lg">
              Cadastre moradores na aba "Moradores" antes de registrar solicitações.
            </p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-xs sm:text-sm font-semibold text-slate-700">
            Nome Completo do Visitante *
          </label>
          <input
            autoFocus
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            placeholder="Ex: Carlos Ferreira"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs sm:text-sm font-semibold text-slate-700">
              Documento (RG / CPF)
            </label>
            <input
              value={documento}
              onChange={(e) => setDocumento(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              placeholder="Ex: 12.345.678-9"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs sm:text-sm font-semibold text-slate-700">
              Telefone do Visitante
            </label>
            <input
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              placeholder="Ex: (11) 98765-4321"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs sm:text-sm font-semibold text-slate-700">
            Motivo da Visita / Observações
          </label>
          <input
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            placeholder="Ex: Entrega de encomenda, prestador de serviço, visita familiar"
          />
        </div>

        {formError && (
          <p className="text-xs sm:text-sm text-red-700 bg-red-50 p-3 rounded-xl border border-red-200">
            {formError}
          </p>
        )}

        <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-teal-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60 shadow-sm transition-colors"
          >
            {saving ? 'Registrando...' : 'Registrar Solicitação'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

