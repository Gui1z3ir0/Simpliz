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
} from 'lucide-react';
import { Modal } from '@/components/Modal';
import { StatusBadge } from '@/components/StatusBadge';
import { useControleAcesso } from '@/hooks/useControleAcesso';
import { useMoradores } from '@/hooks/useMoradores';
import { usePorteiros } from '@/hooks/usePorteiros';
import type { AcessoCompleto, StatusAcesso, Morador } from '@/types';

type FiltroStatus = 'todos' | StatusAcesso;

const FILTROS: { key: FiltroStatus; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'aguardando', label: 'Aguardando' },
  { key: 'liberado', label: 'Liberados' },
  { key: 'no_condominio', label: 'No Condomínio' },
  { key: 'finalizado', label: 'Finalizados' },
  { key: 'negado', label: 'Negados' },
];

function formatDateTime(value: string | null | undefined) {
  if (!value) return '-';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '-';
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
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
          (a.motivo_visita && a.motivo_visita.toLowerCase().includes(term))
      );
    }
    return list;
  }, [acessos, filtro, busca]);

  const runAction = async (id: string, action: () => Promise<void>) => {
    setActionError(null);
    setBusyId(id);
    try {
      await action();
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
      setActionError('Selecione o porteiro de serviço no topo antes de liberar um acesso.');
      return;
    }
    runAction(acesso.id, () => liberarAcesso(acesso.id, porteiroServico));
  };

  const handleEntrada = (acesso: AcessoCompleto) => {
    if (!porteiroServico) {
      setActionError('Selecione o porteiro de serviço no topo antes de registrar a entrada.');
      return;
    }
    runAction(acesso.id, () => registrarEntrada(acesso.id, porteiroServico));
  };

  const handleSaida = (acesso: AcessoCompleto) => {
    runAction(acesso.id, () => registrarSaida(acesso.id));
  };

  const handleNegar = () => {
    if (!negarTarget) return;
    if (!porteiroServico) {
      setActionError('Selecione o porteiro de serviço antes de negar um acesso.');
      return;
    }
    runAction(negarTarget.id, () => negarAcesso(negarTarget.id, porteiroServico, motivoNegacao)).then(
      (success) => {
        if (success) {
          setNegarTarget(null);
          setMotivoNegacao('');
        }
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Controle de Acesso</h1>
          <p className="text-sm text-slate-500 mt-1">
            Gestão de entradas, saídas e solicitações de visitas em tempo real.
          </p>
        </div>
        <button
          onClick={() => setSolicitarOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-teal-700"
        >
          <Plus size={16} />
          Nova Solicitação
        </button>
      </div>

      {/* Porteiro de Serviço Selection Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4 ring-1 ring-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
            <UserRound size={18} />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 block">Porteiro de Serviço Responsável:</label>
            <select
              value={porteiroServico}
              onChange={(e) => {
                setPorteiroServico(e.target.value);
                setActionError(null);
              }}
              className="mt-0.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 bg-white"
            >
              <option value="">Selecione o porteiro de plantão...</option>
              {porteiros.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome} ({p.turno})
                </option>
              ))}
            </select>
          </div>
        </div>

        {!loadingPorteiros && porteiros.length === 0 && (
          <span className="text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg">
            Atenção: Cadastre um porteiro na aba "Porteiros" para autorizar liberações.
          </span>
        )}
      </div>

      {/* Action Error Banner */}
      {actionError && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700 ring-1 ring-red-100 flex items-center justify-between">
          <span>{actionError}</span>
          <button onClick={() => setActionError(null)} className="text-xs font-semibold text-red-800 hover:underline">
            Fechar
          </button>
        </div>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex gap-2 overflow-x-auto pb-1 max-w-full">
          {FILTROS.map(({ key, label }) => {
            const count = key === 'todos' ? acessos.length : acessos.filter((a) => a.status === key).length;
            const active = filtro === key;
            return (
              <button
                key={key}
                onClick={() => setFiltro(key)}
                className={`shrink-0 flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${active
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
                  }`}
              >
                <span>{label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-semibold ${active ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative min-w-[240px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por visitante, morador..."
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-full border border-slate-200 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 bg-white"
          />
        </div>
      </div>


      {/* Access Cards Feed */}
      <div className="space-y-3">
        {loading && <p className="py-8 text-center text-sm text-slate-400">Carregando registros...</p>}
        {error && <p className="p-4 text-sm text-red-600 bg-red-50 rounded-xl">{error}</p>}
        {!loading && listaFiltrada.length === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-2xl bg-white py-14 text-center ring-1 ring-slate-100">
            <DoorOpen size={32} className="text-slate-300 mb-1" />
            <p className="text-sm text-slate-500 font-medium">Nenhum registro encontrado.</p>
            <p className="text-xs text-slate-400">Tente ajustar os filtros ou registrar uma nova solicitação.</p>
          </div>
        )}

        {!loading &&
          listaFiltrada.map((acesso) => (
            <div
              key={acesso.id}
              className="rounded-2xl bg-white p-5 ring-1 ring-slate-100 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <p className="font-semibold text-slate-900 text-base">{acesso.visitante?.nome || 'Visitante'}</p>
                    <StatusBadge status={acesso.status} />
                  </div>
                  <p className="text-sm text-slate-600 mt-1">
                    Visitando{' '}
                    <strong className="font-medium text-slate-800">{acesso.morador?.nome || 'Morador'}</strong>
                    {' · '}
                    <span className="text-slate-500">
                      Bloco {acesso.morador?.bloco || '-'}, Apto {acesso.morador?.apartamento || '-'}
                    </span>
                  </p>
                  {acesso.motivo_visita && (
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                      <FileText size={13} className="text-slate-400" />
                      Motivo: {acesso.motivo_visita}
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                    <span>Doc: {acesso.visitante?.documento || '-'}</span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> Solicitado: {formatDateTime(acesso.data_hora_solicitacao)}
                    </span>
                    {acesso.data_hora_entrada && (
                      <span className="text-emerald-700 font-medium">
                        Entrada: {formatDateTime(acesso.data_hora_entrada)}
                      </span>
                    )}
                    {acesso.data_hora_saida && <span>Saída: {formatDateTime(acesso.data_hora_saida)}</span>}
                    {acesso.porteiro && <span className="text-slate-600">Porteiro: {acesso.porteiro.nome}</span>}
                  </div>

                  {acesso.status === 'negado' && acesso.observacao && (
                    <p className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded-lg">
                      Motivo da recusa: {acesso.observacao}
                    </p>
                  )}
                </div>

                {/* Actions Button Group */}
                <div className="flex flex-wrap gap-2 items-center">
                  {acesso.status === 'aguardando' && (
                    <>
                      <button
                        disabled={busyId === acesso.id}
                        onClick={() => handleLiberar(acesso)}
                        className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-60 shadow-sm transition-colors"
                      >
                        <ShieldCheck size={14} />
                        Liberar Acesso
                      </button>
                      <button
                        disabled={busyId === acesso.id}
                        onClick={() => {
                          setNegarTarget(acesso);
                          setMotivoNegacao('');
                        }}
                        className="flex items-center gap-1.5 rounded-xl bg-red-50 px-3.5 py-2 text-xs font-medium text-red-600 hover:bg-red-100 disabled:opacity-60 transition-colors"
                      >
                        <XCircle size={14} />
                        Negar
                      </button>
                    </>
                  )}

                  {acesso.status === 'liberado' && (
                    <>
                      <button
                        disabled={busyId === acesso.id}
                        onClick={() => handleEntrada(acesso)}
                        className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-60 shadow-sm transition-colors"
                      >
                        <LogIn size={14} />
                        Registrar Entrada
                      </button>
                      <button
                        disabled={busyId === acesso.id}
                        onClick={() => {
                          setNegarTarget(acesso);
                          setMotivoNegacao('');
                        }}
                        className="flex items-center gap-1.5 rounded-xl bg-red-50 px-3.5 py-2 text-xs font-medium text-red-600 hover:bg-red-100 disabled:opacity-60 transition-colors"
                      >
                        <XCircle size={14} />
                        Negar
                      </button>
                    </>
                  )}

                  {acesso.status === 'no_condominio' && (
                    <button
                      disabled={busyId === acesso.id}
                      onClick={() => handleSaida(acesso)}
                      className="flex items-center gap-1.5 rounded-xl bg-slate-800 px-4 py-2 text-xs font-medium text-white hover:bg-slate-900 disabled:opacity-60 shadow-sm transition-colors"
                    >
                      <LogOut size={14} />
                      Registrar Saída
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
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
        <Modal title="Negar Acesso" onClose={() => setNegarTarget(null)} maxWidth="max-w-sm">
          <p className="text-sm text-slate-600">
            Informe o motivo da recusa de acesso para{' '}
            <strong>{negarTarget.visitante?.nome || 'este visitante'}</strong>:
          </p>
          <textarea
            autoFocus
            value={motivoNegacao}
            onChange={(e) => setMotivoNegacao(e.target.value)}
            rows={3}
            className="mt-3 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            placeholder="Ex: Morador não autorizou ou não atendeu ao interfone."
          />
          <div className="mt-4 flex justify-end gap-3 border-t border-slate-100 pt-3">
            <button
              onClick={() => setNegarTarget(null)}
              className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleNegar}
              className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 shadow-sm transition-colors"
            >
              Confirmar Recusa
            </button>
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
        nomeVisitante: nome,
        documentoVisitante: documento,
        telefoneVisitante: telefone,
        motivoVisita: motivo,
      });
      onClose();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao registrar solicitação.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="Nova Solicitação de Acesso" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Morador visitado</label>
          <select
            required
            value={moradorId}
            onChange={(e) => setMoradorId(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 bg-white"
          >
            <option value="">Selecione o morador...</option>
            {moradores.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nome} — Bloco {m.bloco || '-'}, Apto {m.apartamento || '-'}
              </option>
            ))}
          </select>
          {!loadingMoradores && moradores.length === 0 && (
            <p className="mt-1.5 text-xs text-amber-600">
              Cadastre moradores na aba "Moradores" antes de solicitar acessos.
            </p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Nome do visitante</label>
          <input
            autoFocus
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            placeholder="Ex: Carlos Ferreira"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Documento / RG / CPF</label>
            <input
              value={documento}
              onChange={(e) => setDocumento(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              placeholder="Ex: 12.345.678-9"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Telefone do visitante</label>
            <input
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              placeholder="Ex: (11) 98765-4321"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Motivo da visita</label>
          <input
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            placeholder="Ex: Entrega, prestador de serviço, visita familiar"
          />
        </div>

        {formError && <p className="text-sm text-red-600 bg-red-50 p-2.5 rounded-lg">{formError}</p>}

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-teal-600 px-5 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-60 shadow-sm transition-colors"
          >
            {saving ? 'Registrando...' : 'Registrar Solicitação'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
