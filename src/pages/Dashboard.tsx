import { useState } from 'react';
import {
  Users,
  ShieldCheck,
  DoorOpen,
  Clock,
  ArrowRight,
  UserPlus,
  ShieldAlert,
  Sparkles,
  Trash2,
  Activity,
  CheckCircle2,
  Calendar,
  Building2,
} from 'lucide-react';
import { StatCard } from '@/components/StatCard';
import { StatusBadge } from '@/components/StatusBadge';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useMoradores } from '@/hooks/useMoradores';
import { usePorteiros } from '@/hooks/usePorteiros';
import { useControleAcesso } from '@/hooks/useControleAcesso';
import { populateDemoData, resetSystemData } from '@/lib/demoData';
import type { Page } from '@/components/Sidebar';

interface DashboardProps {
  onNavigate?: (page: Page) => void;
}

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

export function Dashboard({ onNavigate }: DashboardProps) {
  const { moradores, loading: loadingMoradores, refetch: refetchMoradores } = useMoradores();
  const { porteiros, loading: loadingPorteiros, refetch: refetchPorteiros } = usePorteiros();
  const { acessos, loading: loadingAcessos, refetch: refetchAcessos } = useControleAcesso();
  const [seeding, setSeeding] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const loading = loadingMoradores || loadingPorteiros || loadingAcessos;

  const aguardando = acessos.filter((a) => a.status === 'aguardando').length;
  const noCondominio = acessos.filter((a) => a.status === 'no_condominio').length;
  const liberados = acessos.filter((a) => a.status === 'liberado').length;
  const finalizados = acessos.filter((a) => a.status === 'finalizado').length;

  const hoje = new Date().toDateString();
  const acessosHoje = acessos.filter((a) => {
    if (!a.data_hora_solicitacao) return false;
    const d = new Date(a.data_hora_solicitacao);
    return !isNaN(d.getTime()) && d.toDateString() === hoje;
  });

  const handleCarregarDemo = async () => {
    setSeeding(true);
    try {
      await populateDemoData();
      await Promise.all([refetchMoradores(), refetchPorteiros(), refetchAcessos()]);
    } catch (err) {
      console.error(err);
    } finally {
      setSeeding(false);
    }
  };

  const handleResetSystem = async () => {
    setShowResetConfirm(false);
    setResetting(true);
    try {
      await resetSystemData();
      await Promise.all([refetchMoradores(), refetchPorteiros(), refetchAcessos()]);
    } catch (err) {
      console.error(err);
    } finally {
      setResetting(false);
    }
  };

  const isEmpty = moradores.length === 0 && porteiros.length === 0 && acessos.length === 0;

  return (
    <div className="space-y-6">
      {/* Top Welcome & Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl shadow-xs ring-1 ring-slate-200/80">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-display">
              Painel de Controle da Portaria
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Operação Ativa
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Visão geral em tempo real de acessos, moradores cadastrados e equipe em serviço.
          </p>
        </div>

        {onNavigate && (
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => onNavigate('atendimento')}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 shadow-xs transition-all hover:bg-slate-100"
            >
              <Sparkles size={16} className="text-teal-600" />
              <span>Central IA</span>
            </button>
            <button
              onClick={() => onNavigate('acessos')}
              className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all hover:bg-teal-700 active:scale-95"
            >
              <UserPlus size={16} />
              <span>Registrar Acesso</span>
            </button>
          </div>
        )}
      </div>

      {/* Demo Seed Banner when Database is Empty */}
      {!loading && isEmpty && (
        <div className="rounded-3xl border border-teal-200 bg-gradient-to-r from-teal-500/10 via-emerald-500/5 to-transparent p-5 sm:p-6 text-slate-900 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-md shadow-teal-600/20">
              <Sparkles size={24} />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-base font-display">
                Banco de Dados Inicial (Sem Registros)
              </p>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5 max-w-xl">
                Você pode iniciar o cadastro manual de moradores e porteiros ou carregar dados completos de demonstração para testar todos os fluxos.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('moradores')}
                className="flex items-center gap-1.5 rounded-xl border border-teal-300 bg-white px-4 py-2.5 text-xs font-semibold text-teal-700 hover:bg-teal-50 transition-all shadow-xs"
              >
                <UserPlus size={15} />
                Cadastrar Morador
              </button>
            )}
            <button
              type="button"
              disabled={seeding || resetting}
              onClick={handleCarregarDemo}
              className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-teal-700 shadow-sm transition-all active:scale-95 disabled:opacity-60"
            >
              <Sparkles size={15} />
              {seeding ? 'Carregando dados...' : 'Carregar Dados de Demonstração'}
            </button>
          </div>
        </div>
      )}

      {/* System Active Data Quick Bar */}
      {!loading && !isEmpty && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white px-5 py-3 shadow-2xs ring-1 ring-slate-200/80 text-xs text-slate-600">
          <span className="flex items-center gap-2 font-medium">
            <span className="h-2 w-2 rounded-full bg-teal-500" />
            <span>Sistema com dados ativos e sincronizados</span>
          </span>
          <div className="flex items-center gap-4">
            <span className="text-slate-400 hidden sm:inline font-mono">
              {acessosHoje.length} solicitações hoje
            </span>
            <button
              onClick={() => setShowResetConfirm(true)}
              disabled={resetting || seeding}
              className="flex items-center gap-1.5 text-red-600 hover:text-red-700 font-medium transition-colors disabled:opacity-50"
            >
              <Trash2 size={14} />
              {resetting ? 'Limpando...' : 'Zerar Banco de Dados'}
            </button>
          </div>
        </div>
      )}

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Moradores Cadastrados"
          value={moradores.length}
          icon={Users}
          accent="teal"
          helperText="Total de residentes ativos"
          onClick={onNavigate ? () => onNavigate('moradores') : undefined}
        />
        <StatCard
          label="Equipe de Portaria"
          value={porteiros.length}
          icon={ShieldCheck}
          accent="blue"
          helperText="Profissionais na escala"
          onClick={onNavigate ? () => onNavigate('porteiros') : undefined}
        />
        <StatCard
          label="Presentes no Condomínio"
          value={noCondominio}
          icon={DoorOpen}
          accent="emerald"
          helperText="Visitantes com entrada ativa"
          onClick={onNavigate ? () => onNavigate('acessos') : undefined}
        />
        <StatCard
          label="Aguardando Liberação"
          value={aguardando}
          icon={Clock}
          accent="amber"
          helperText="Solicitações na fila"
          onClick={onNavigate ? () => onNavigate('acessos') : undefined}
        />
      </div>

      {/* Alert Banner for Pending Clearances */}
      {aguardando > 0 && onNavigate && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-amber-50 border border-amber-200 p-4 text-amber-950 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <ShieldAlert size={20} />
            </div>
            <div>
              <p className="font-bold text-sm">
                {aguardando === 1
                  ? '1 solicitação aguardando liberação na portaria'
                  : `${aguardando} solicitações aguardando liberação na portaria`}
              </p>
              <p className="text-xs text-amber-800 mt-0.5">
                Valide a identidade do visitante e confirme com o morador responsável.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('acessos')}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-amber-700 shadow-xs self-end sm:self-auto"
          >
            Ver Fila de Acesso
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* AI Cognitive Security & Insights Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950 p-5 sm:p-6 text-white shadow-md ring-1 ring-teal-500/20">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 font-bold shadow-md shadow-teal-500/20">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-display">
                Diagnóstico & Inteligência da Portaria
              </h2>
              <p className="text-xs text-slate-400">
                Análise em tempo real do fluxo de guarita e diretrizes de segurança
              </p>
            </div>
          </div>
          {onNavigate && (
            <button
              onClick={() => onNavigate('atendimento')}
              className="flex items-center gap-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 px-3.5 py-1.5 text-xs font-semibold text-teal-300 transition-colors ring-1 ring-teal-500/30"
            >
              Falar com Simpliz IA <ArrowRight size={13} />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
          <div className="rounded-2xl bg-slate-800/60 p-4 border border-slate-700/60">
            <p className="font-bold text-teal-300 mb-1.5 flex items-center gap-1.5">
              <Activity size={14} /> Fluxo de Guarita
            </p>
            <p className="text-slate-300 leading-relaxed">
              {aguardando > 0
                ? `A IA identificou ${aguardando} visita(s) pendente(s) de autorização da portaria.`
                : 'Fila de entrada operando sem pendências (0 solicitações aguardando).'}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-800/60 p-4 border border-slate-700/60">
            <p className="font-bold text-emerald-300 mb-1.5 flex items-center gap-1.5">
              <DoorOpen size={14} /> Circulação Interna
            </p>
            <p className="text-slate-300 leading-relaxed">
              {noCondominio > 0
                ? `${noCondominio} visitante(s) com acesso liberado e presença ativa dentro do condomínio.`
                : 'Nenhum visitante externo circulando nas áreas comuns no momento.'}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-800/60 p-4 border border-slate-700/60">
            <p className="font-bold text-blue-300 mb-1.5 flex items-center gap-1.5">
              <ShieldCheck size={14} /> Escala de Portaria
            </p>
            <p className="text-slate-300 leading-relaxed">
              {porteiros.length > 0
                ? `Equipe dimensionada com ${porteiros.length} profissionais distribuídos nos turnos.`
                : 'Cadastre porteiros na equipe para controle de assinaturas e turnos.'}
            </p>
          </div>
        </div>
      </div>

      {/* Operational Access Lifecycle Guide */}
      <div className="rounded-3xl bg-white p-5 sm:p-6 ring-1 ring-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-slate-100 pb-3.5">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-display">
              Fluxo Operacional de Controle de Acesso
            </h2>
            <p className="text-xs text-slate-500">
              Etapas padronizadas de segurança para recepção e liberação de visitantes
            </p>
          </div>
          <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-3 py-1 rounded-full ring-1 ring-teal-200 self-start sm:self-auto">
            4 Etapas de Segurança
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-4">
            <div className="flex items-center gap-2 font-bold text-amber-900 mb-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-200 text-amber-900 text-[11px] font-extrabold">
                1
              </span>
              Solicitação
            </div>
            <p className="text-slate-600 leading-relaxed">
              Registro dos dados do visitante (nome, documento, telefone) e seleção da unidade de destino.
            </p>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-4">
            <div className="flex items-center gap-2 font-bold text-blue-900 mb-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-200 text-blue-900 text-[11px] font-extrabold">
                2
              </span>
              Autorização
            </div>
            <p className="text-slate-600 leading-relaxed">
              Porteiro de serviço valida a permissão junto ao morador responsável antes da abertura do portão.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4">
            <div className="flex items-center gap-2 font-bold text-emerald-900 mb-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-200 text-emerald-900 text-[11px] font-extrabold">
                3
              </span>
              Entrada Registrada
            </div>
            <p className="text-slate-600 leading-relaxed">
              Carimbo de data/hora gravado no sistema com visitante presente nas dependências do prédio.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
            <div className="flex items-center gap-2 font-bold text-slate-800 mb-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-slate-900 text-[11px] font-extrabold">
                4
              </span>
              Saída & Histórico
            </div>
            <p className="text-slate-600 leading-relaxed">
              Finalização do acesso na portaria com registro de auditoria completo para segurança do condomínio.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity Table / Feed */}
      <div className="rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-xs overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 sm:px-6 py-4">
          <div>
            <h2 className="font-bold text-slate-900 text-base font-display">
              Movimentações Recentes na Portaria
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Últimas solicitações e registros em tempo real
            </p>
          </div>
          {onNavigate && (
            <button
              onClick={() => onNavigate('acessos')}
              className="flex items-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-xl transition-colors"
            >
              Ver todas as movimentações <ArrowRight size={14} />
            </button>
          )}
        </div>

        <div className="divide-y divide-slate-100">
          {loading && (
            <p className="px-6 py-8 text-center text-sm text-slate-400">
              Carregando movimentações...
            </p>
          )}

          {!loading && acessos.length === 0 && (
            <div className="px-6 py-12 text-center">
              <DoorOpen size={36} className="mx-auto text-slate-300 mb-2.5" />
              <p className="text-sm text-slate-600 font-semibold">Nenhum acesso registrado ainda.</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Assim que um visitante for registrado, o histórico aparecerá listado aqui.
              </p>
            </div>
          )}

          {!loading &&
            acessos.slice(0, 6).map((acesso) => (
              <div
                key={acesso.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 sm:px-6 py-4 hover:bg-slate-50/80 transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {acesso.visitante?.nome || 'Visitante'}
                    </p>
                    <span className="text-xs text-slate-400">para</span>
                    <strong className="text-xs font-semibold text-slate-700">
                      {acesso.morador?.nome || 'Morador'}
                    </strong>
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      Bloco {acesso.morador?.bloco || '-'} · Apto {acesso.morador?.apartamento || '-'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
                    <span>Solicitado em {formatDateTime(acesso.data_hora_solicitacao)}</span>
                    {acesso.motivo_visita && (
                      <span>· Motivo: <span className="text-slate-600">{acesso.motivo_visita}</span></span>
                    )}
                    {acesso.porteiro && (
                      <span>· Porteiro: <span className="text-slate-600">{acesso.porteiro.nome}</span></span>
                    )}
                  </p>
                </div>

                <div className="self-start sm:self-center shrink-0">
                  <StatusBadge status={acesso.status} />
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Confirmation Dialog for Reset */}
      {showResetConfirm && (
        <ConfirmDialog
          title="Zerar Banco de Dados?"
          message="Tem certeza de que deseja apagar todos os registros do sistema? Todos os moradores, porteiros, visitantes e histórico de controle de acesso serão excluídos permanentemente."
          confirmLabel="Sim, Zerar Registros"
          confirmVariant="danger"
          onConfirm={handleResetSystem}
          onCancel={() => setShowResetConfirm(false)}
        />
      )}
    </div>
  );
}



