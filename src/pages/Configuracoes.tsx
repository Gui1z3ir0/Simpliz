import { useState } from 'react';
import {
  Save,
  Building2,
  MapPin,
  Check,
  AlertCircle,
  Sparkles,
  Database,
  Layers,
  ShieldCheck,
  Code2,
  Cpu,
  Trash2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { useCondominio } from '@/hooks/useCondominio';
import { populateDemoData, resetSystemData } from '@/lib/demoData';
import { ConfirmDialog } from '@/components/ConfirmDialog';

export function Configuracoes() {
  const { condominio, loading, error, updateCondominio, refetch } = useCondominio();
  const [nome, setNome] = useState<string | null>(null);
  const [endereco, setEndereco] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Demo seeding state
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState<string | null>(null);

  // Reset system state
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);

  const currentNome = nome !== null ? nome : (condominio?.nome ?? '');
  const currentEndereco = endereco !== null ? endereco : (condominio?.endereco ?? '');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!currentNome.trim()) {
      setFormError('Informe o nome do condomínio.');
      return;
    }
    setSaving(true);
    setSaved(false);
    setFormError(null);
    try {
      await updateCondominio(currentNome.trim(), currentEndereco.trim());
      setNome(null);
      setEndereco(null);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 3500);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Não foi possível salvar as configurações.');
    } finally {
      setSaving(false);
    }
  };

  const handleCarregarDemo = async () => {
    setSeeding(true);
    setSeedSuccess(null);
    try {
      const res = await populateDemoData();
      if (res.success) {
        setSeedSuccess(res.message);
        await refetch();
        window.setTimeout(() => setSeedSuccess(null), 5000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSeeding(false);
    }
  };

  const handleResetSystem = async () => {
    setShowResetConfirm(false);
    setResetting(true);
    setResetSuccess(null);
    setResetError(null);
    try {
      const res = await resetSystemData();
      if (res.success) {
        setResetSuccess(res.message);
        await refetch();
        window.setTimeout(() => setResetSuccess(null), 5000);
      } else {
        setResetError(res.message);
        window.setTimeout(() => setResetError(null), 5000);
      }
    } catch (err) {
      console.error(err);
      setResetError(err instanceof Error ? err.message : 'Erro ao zerar dados do sistema.');
    } finally {
      setResetting(false);
    }
  };

  if (loading) {
    return <p className="py-12 text-center text-sm text-slate-400">Carregando configurações...</p>;
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Top Header */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-xs ring-1 ring-slate-200/80">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-display">
          Configurações do Sistema
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          Personalize as informações da unidade predial e gerencie o banco de dados do sistema.
        </p>
      </div>

      {/* Condomínio Data */}
      <div className="rounded-3xl bg-white p-5 sm:p-6 shadow-xs ring-1 ring-slate-200/80">
        <div className="mb-5 flex items-center gap-3.5 border-b border-slate-100 pb-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 ring-1 ring-teal-100">
            <Building2 size={20} />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-base font-display">Dados da Unidade / Condomínio</h2>
            <p className="text-xs text-slate-400">Essas informações aparecem no cabeçalho e relatórios do sistema.</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-2xl bg-red-50 p-3.5 text-xs sm:text-sm text-red-700 border border-red-200">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs sm:text-sm font-semibold text-slate-700">
              Nome do Condomínio / Edifício *
            </label>
            <input
              required
              value={currentNome}
              onChange={(event) => setNome(event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              placeholder="Ex: Residencial Jardins do Parque"
            />
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700">
              <MapPin size={14} className="text-slate-400" />
              Endereço Completo
            </label>
            <input
              value={currentEndereco}
              onChange={(event) => setEndereco(event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              placeholder="Ex: Av. Paulista, 1500 - Bela Vista, São Paulo - SP"
            />
          </div>

          {formError && (
            <p className="text-xs sm:text-sm text-red-700 bg-red-50 p-3 rounded-xl border border-red-200 flex items-center gap-2">
              <AlertCircle size={16} />
              {formError}
            </p>
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <div>
              {saved && (
                <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-600 animate-fadeIn">
                  <Check size={16} /> Configurações salvas com sucesso!
                </span>
              )}
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60 shadow-sm transition-all active:scale-95"
            >
              <Save size={15} />
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>

      {/* Demo Data Generator */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 p-5 sm:p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/20 px-3 py-1 text-xs font-semibold text-teal-300 ring-1 ring-teal-500/30">
              <Sparkles size={13} />
              Ambiente de Demonstração & Testes
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white font-display">Carregar Dados de Exemplo</h3>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Popula o sistema com registros realistas (moradores em múltiplos blocos, porteiros escalados e histórico de movimentações com diferentes status) para testes de rotina.
            </p>
          </div>

          <button
            type="button"
            disabled={seeding || resetting}
            onClick={handleCarregarDemo}
            className="w-full md:w-auto flex items-center justify-center gap-2 rounded-2xl bg-teal-500 px-5 py-3 text-xs sm:text-sm font-bold text-slate-950 hover:bg-teal-400 disabled:opacity-60 shadow-lg shadow-teal-500/20 transition-all active:scale-95 shrink-0"
          >
            <Database size={16} />
            {seeding ? 'Carregando dados...' : 'Carregar Dados de Exemplo'}
          </button>
        </div>

        {seedSuccess && (
          <div className="mt-4 rounded-2xl bg-emerald-500/20 p-3 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-500/40 flex items-center gap-2 animate-fadeIn">
            <Check size={16} />
            {seedSuccess}
          </div>
        )}
      </div>

      {/* Danger Zone: Reset System / Clear All Records */}
      <div className="rounded-3xl bg-white p-5 sm:p-6 shadow-xs ring-1 ring-red-200/80 border border-red-100">
        <div className="mb-4 flex items-center gap-3.5 border-b border-red-100 pb-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600 ring-1 ring-red-100">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-base font-display">Zerar Banco de Dados</h2>
            <p className="text-xs text-slate-400">
              Exclui todos os registros e retorna o sistema ao estado inicial vazio.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <p className="text-xs text-slate-600 max-w-md leading-relaxed">
            Esta operação irá apagar permanentemente <strong>todos os moradores, porteiros, visitantes e histórico de controle de acesso</strong>.
          </p>

          <button
            type="button"
            disabled={resetting || seeding}
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-red-700 disabled:opacity-60 transition-all active:scale-95 shrink-0"
          >
            <Trash2 size={15} />
            {resetting ? 'Zerando sistema...' : 'Zerar Banco de Dados'}
          </button>
        </div>

        {resetSuccess && (
          <div className="mt-4 rounded-2xl bg-emerald-50 p-3 text-xs font-medium text-emerald-800 ring-1 ring-emerald-200 flex items-center gap-2 animate-fadeIn">
            <Check size={16} className="text-emerald-600" />
            {resetSuccess}
          </div>
        )}

        {resetError && (
          <div className="mt-4 rounded-2xl bg-red-50 p-3 text-xs font-medium text-red-800 ring-1 ring-red-200 flex items-center gap-2 animate-fadeIn">
            <AlertCircle size={16} className="text-red-600" />
            {resetError}
          </div>
        )}
      </div>

      {/* Confirmation Dialog for Reset */}
      {showResetConfirm && (
        <ConfirmDialog
          title="Zerar Banco de Dados?"
          message="Tem certeza de que deseja apagar todos os dados? Todos os moradores, porteiros, visitantes e histórico de movimentações serão excluídos permanentemente. O sistema ficará sem nenhum registro cadastrado."
          confirmLabel="Sim, Zerar Registros"
          confirmVariant="danger"
          onConfirm={handleResetSystem}
          onCancel={() => setShowResetConfirm(false)}
        />
      )}

      {/* Project Architecture & Tech Sheet */}
      <div className="rounded-3xl bg-white p-5 sm:p-6 shadow-xs ring-1 ring-slate-200/80">
        <div className="mb-4 flex items-center gap-3.5 border-b border-slate-100 pb-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
            <Layers size={20} />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-base font-display">Especificações Técnicas da Plataforma</h2>
            <p className="text-xs text-slate-400">Padrões de engenharia e tecnologias empregadas no desenvolvimento.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 text-xs">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 space-y-1">
            <span className="flex items-center gap-1.5 font-bold text-slate-800">
              <Code2 size={15} className="text-teal-600" />
              Frontend & SPA
            </span>
            <p className="text-slate-500">React 18, TypeScript, Vite Bundler, TailwindCSS, Lucide Icons, Design Responsivo.</p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 space-y-1">
            <span className="flex items-center gap-1.5 font-bold text-slate-800">
              <Database size={15} className="text-blue-600" />
              Banco de Dados
            </span>
            <p className="text-slate-500">PostgreSQL com Supabase, Relacionamentos, Chaves Estrangeiras e Índices.</p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 space-y-1">
            <span className="flex items-center gap-1.5 font-bold text-slate-800">
              <ShieldCheck size={15} className="text-emerald-600" />
              Segurança & RLS
            </span>
            <p className="text-slate-500">Row Level Security (RLS), Tipagem estrita de interfaces e sanitização de formulários.</p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 space-y-1 sm:col-span-2 md:col-span-3">
            <span className="flex items-center gap-1.5 font-bold text-slate-800">
              <Cpu size={15} className="text-purple-600" />
              Diferenciais da Plataforma Simpliz
            </span>
            <p className="text-slate-500 leading-relaxed">
              Central de Atendimento inteligente com IA integrada aos dados em tempo real, fluxo operacional em 4 etapas (Solicitação → Autorização de Guarita → Entrada com Carimbo de Data/Hora → Saída & Auditoria) e integração direta com WhatsApp para contato rápido com moradores.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}



