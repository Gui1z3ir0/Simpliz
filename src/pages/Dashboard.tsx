import { useState } from 'react';
import {
  Users,
  ShieldCheck,
  DoorOpen,
  Clock,
  ArrowRight,
  UserPlus,
  ShieldAlert,
  Headphones,
  Sparkles,
} from 'lucide-react';
import { StatCard } from '@/components/StatCard';
import { StatusBadge } from '@/components/StatusBadge';
import { useMoradores } from '@/hooks/useMoradores';
import { usePorteiros } from '@/hooks/usePorteiros';
import { useControleAcesso } from '@/hooks/useControleAcesso';
import { populateDemoData } from '@/lib/demoData';
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
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { moradores, loading: loadingMoradores, refetch: refetchMoradores } = useMoradores();
  const { porteiros, loading: loadingPorteiros, refetch: refetchPorteiros } = usePorteiros();
  const { acessos, loading: loadingAcessos, refetch: refetchAcessos } = useControleAcesso();
  const [seeding, setSeeding] = useState(false);

  const loading = loadingMoradores || loadingPorteiros || loadingAcessos;

  const aguardando = acessos.filter((a) => a.status === 'aguardando').length;
  const noCondominio = acessos.filter((a) => a.status === 'no_condominio').length;
  const liberados = acessos.filter((a) => a.status === 'liberado').length;
  const hoje = new Date().toDateString();
  const visitantesHoje = acessos.filter((a) => {
    if (!a.data_hora_solicitacao) return false;
    const d = new Date(a.data_hora_solicitacao);
    return !isNaN(d.getTime()) && d.toDateString() === hoje;
  }).length;

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

  const isEmpty = moradores.length === 0 && porteiros.length === 0 && acessos.length === 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">Simpliz — Painel Geral</h1>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
              Sistema Online
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">Gestão inteligente e monitoramento de portaria em tempo real.</p>
        </div>
        {onNavigate && (
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => onNavigate('atendimento')}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50"
            >
              <Headphones size={16} className="text-teal-600" />
              Central de Atendimento
            </button>
            <button
              onClick={() => onNavigate('acessos')}
              className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-teal-700 active:scale-95"
            >
              <UserPlus size={16} />
              Registrar Acesso
            </button>
          </div>
        )}
      </div>

      {/* College Presentation Quick Demo Seeder Banner if empty */}
      {!loading && isEmpty && (
        <div className="rounded-2xl border border-teal-200 bg-gradient-to-r from-teal-500/10 via-teal-500/5 to-transparent p-5 text-slate-900 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm">
              <Sparkles size={22} />
            </div>
            <div>
              <p className="font-semibold text-sm text-slate-900">Preparando para apresentar na faculdade?</p>
              <p className="text-xs text-slate-600 mt-0.5">
                Clique no botão ao lado para carregar moradores, porteiros e acessos de teste automaticamente.
              </p>
            </div>
          </div>
          <button
            type="button"
            disabled={seeding}
            onClick={handleCarregarDemo}
            className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-teal-700 shadow-sm transition-all"
          >
            <Sparkles size={14} />
            {seeding ? 'Carregando Dados...' : 'Carregar Dados de Exemplo'}
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Moradores Cadastrados"
          value={moradores.length}
          icon={Users}
          accent="teal"
          onClick={onNavigate ? () => onNavigate('moradores') : undefined}
        />
        <StatCard
          label="Porteiros na Equipe"
          value={porteiros.length}
          icon={ShieldCheck}
          accent="blue"
          onClick={onNavigate ? () => onNavigate('porteiros') : undefined}
        />
        <StatCard
          label="No Condomínio Agora"
          value={noCondominio}
          icon={DoorOpen}
          accent="emerald"
          onClick={onNavigate ? () => onNavigate('acessos') : undefined}
        />
        <StatCard
          label="Aguardando Liberação"
          value={aguardando}
          icon={Clock}
          accent="amber"
          onClick={onNavigate ? () => onNavigate('acessos') : undefined}
        />
      </div>

      {/* Alert banner if there are pending authorizations */}
      {aguardando > 0 && onNavigate && (
        <div className="flex items-center justify-between rounded-2xl bg-amber-50 border border-amber-200/80 p-4 text-amber-900 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <ShieldAlert size={18} />
            </div>
            <div>
              <p className="font-semibold text-sm">
                {aguardando === 1 ? '1 solicitação aguardando liberação' : `${aguardando} solicitações aguardando liberação`}
              </p>
              <p className="text-xs text-amber-700">Verifique os visitantes pendentes na portaria.</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('acessos')}
            className="flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-amber-700 shadow-sm"
          >
            Ver fila
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* AI Insights & Safety Analysis Card */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950 p-5 text-white shadow-md ring-1 ring-teal-500/20">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 font-bold shadow-sm">
              <Sparkles size={16} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Diagnóstico & Insights da IA</h2>
              <p className="text-[11px] text-slate-400">Análise preditiva e monitoramento cognitivo de segurança</p>
            </div>
          </div>
          {onNavigate && (
            <button
              onClick={() => onNavigate('atendimento')}
              className="flex items-center gap-1.5 rounded-lg bg-teal-500/20 px-3 py-1 text-xs font-semibold text-teal-300 hover:bg-teal-500/30 transition-colors"
            >
              Consultar IA <ArrowRight size={13} />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="rounded-xl bg-slate-800/60 p-3 border border-slate-700/60">
            <p className="font-semibold text-teal-300 mb-1">Fluxo de Guarita</p>
            <p className="text-slate-300">
              {aguardando > 0
                ? `IA identificou ${aguardando} visita(s) aguardando validação da portaria.`
                : 'Fila de liberação operando com tempo de resposta ideal (0 pendências).'}
            </p>
          </div>

          <div className="rounded-xl bg-slate-800/60 p-3 border border-slate-700/60">
            <p className="font-semibold text-emerald-300 mb-1">Presença no Condomínio</p>
            <p className="text-slate-300">
              {noCondominio > 0
                ? `${noCondominio} visitante(s) ativos dentro do condomínio com entrada registrada.`
                : 'Nenhum visitante externo circulando nas dependências no momento.'}
            </p>
          </div>

          <div className="rounded-xl bg-slate-800/60 p-3 border border-slate-700/60">
            <p className="font-semibold text-blue-300 mb-1">Escala & Plantão</p>
            <p className="text-slate-300">
              {porteiros.length > 0
                ? `Equipe dimensionada com ${porteiros.length} porteiros cadastrados nos turnos.`
                : 'Cadastre porteiros na equipe para controle de assinaturas.'}
            </p>
          </div>
        </div>
      </div>

      {/* Workflow Stepper Guide for Presentation */}
      <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Fluxo Operacional de Acesso</h2>
            <p className="text-xs text-slate-500">Ciclo completo de validação e segurança implementado no software</p>
          </div>
          <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full ring-1 ring-teal-200">
            4 Etapas de Controle
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-3">
            <div className="flex items-center gap-2 font-semibold text-amber-800 mb-1">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-200 text-amber-900 text-[11px] font-bold">1</span>
              Solicitação
            </div>
            <p className="text-slate-600">Morador ou visitante informa nome, documento e apartamento.</p>
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3">
            <div className="flex items-center gap-2 font-semibold text-blue-800 mb-1">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-200 text-blue-900 text-[11px] font-bold">2</span>
              Autorização
            </div>
            <p className="text-slate-600">Porteiro de plantão confirma com o morador e libera o acesso.</p>
          </div>

          <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3">
            <div className="flex items-center gap-2 font-semibold text-emerald-800 mb-1">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-200 text-emerald-900 text-[11px] font-bold">3</span>
              Entrada
            </div>
            <p className="text-slate-600">Carimbo de data/hora registrado com visitante dentro do prédio.</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3">
            <div className="flex items-center gap-2 font-semibold text-slate-800 mb-1">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-slate-900 text-[11px] font-bold">4</span>
              Saída & Conclusão
            </div>
            <p className="text-slate-600">Finalização do acesso com histórico arquivado para auditoria.</p>
          </div>
        </div>
      </div>

      {/* Recent Activity Table / Feed */}
      <div className="rounded-2xl bg-white ring-1 ring-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="font-semibold text-slate-900">Atividade Recente de Acesso</h2>
            <p className="text-xs text-slate-400 mt-0.5">{visitantesHoje} movimentações solicitadas hoje</p>
          </div>
          {onNavigate && (
            <button
              onClick={() => onNavigate('acessos')}
              className="flex items-center gap-1 text-xs font-medium text-teal-600 hover:text-teal-700"
            >
              Ver todas <ArrowRight size={14} />
            </button>
          )}
        </div>

        <div className="divide-y divide-slate-100">
          {loading && (
            <p className="px-5 py-8 text-center text-sm text-slate-400">Carregando movimentações...</p>
          )}
          {!loading && acessos.length === 0 && (
            <div className="px-5 py-12 text-center">
              <DoorOpen size={32} className="mx-auto text-slate-300 mb-2" />
              <p className="text-sm text-slate-500 font-medium">Nenhum acesso registrado ainda.</p>
              <p className="text-xs text-slate-400 mt-1">As novas solicitações aparecerão aqui em tempo real.</p>
            </div>
          )}
          {!loading &&
            acessos.slice(0, 7).map((acesso) => (
              <div
                key={acesso.id}
                className="flex items-center justify-between gap-4 px-5 py-3.5 hover:bg-slate-50/70 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {acesso.visitante?.nome || 'Visitante'}{' '}
                    <span className="text-slate-400 font-normal">
                      visitando <strong className="text-slate-700 font-medium">{acesso.morador?.nome || 'Morador'}</strong>
                    </span>
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {formatDateTime(acesso.data_hora_solicitacao)} · Bloco {acesso.morador?.bloco || '-'}, Apto{' '}
                    {acesso.morador?.apartamento || '-'}
                    {acesso.motivo_visita && ` · Motivo: ${acesso.motivo_visita}`}
                  </p>
                </div>
                <StatusBadge status={acesso.status} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

