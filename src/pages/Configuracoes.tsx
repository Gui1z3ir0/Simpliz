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
} from 'lucide-react';
import { useCondominio } from '@/hooks/useCondominio';
import { populateDemoData } from '@/lib/demoData';

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

  if (loading) {
    return <p className="py-8 text-center text-sm text-slate-400">Carregando configurações...</p>;
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Configurações & Apresentação</h1>
        <p className="mt-1 text-sm text-slate-500">
          Personalize as informações da unidade e utilize os recursos de demonstração para a banca avaliadora.
        </p>
      </div>

      {/* Condomínio Data */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
            <Building2 size={22} />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">Dados da Unidade / Condomínio</h2>
            <p className="text-xs text-slate-500">Essas informações aparecem no cabeçalho e menu principal.</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Nome do condomínio</label>
            <input
              required
              value={currentNome}
              onChange={(event) => setNome(event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              placeholder="Ex: Residencial Jardins do Parque"
            />
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700">
              <MapPin size={15} className="text-slate-400" />
              Endereço completo
            </label>
            <input
              value={currentEndereco}
              onChange={(event) => setEndereco(event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              placeholder="Ex: Av. Paulista, 1500 - Bela Vista, São Paulo - SP"
            />
          </div>

          {formError && (
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-xl flex items-center gap-2">
              <AlertCircle size={16} />
              {formError}
            </p>
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-3 border-t border-slate-100">
            {saved && (
              <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 animate-fadeIn">
                <Check size={16} /> Configurações salvas com sucesso!
              </span>
            )}
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60 shadow-sm transition-all active:scale-95"
            >
              <Save size={16} />
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>

      {/* College Presentation Demo Generator */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 p-5 sm:p-6 text-white shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/20 px-3 py-1 text-xs font-semibold text-teal-300 ring-1 ring-teal-500/30">
              <Sparkles size={13} />
              Modo Apresentação Acadêmica
            </div>
            <h3 className="text-lg font-semibold text-white">Carregar Dados de Demonstração</h3>
            <p className="text-xs text-slate-300 max-w-xl">
              Popula o sistema com dados realistas (moradores em múltiplos blocos, porteiros escalados, movimentações ativas e histórico) para demonstrar todos os fluxos na apresentação da faculdade.
            </p>
          </div>

          <button
            type="button"
            disabled={seeding}
            onClick={handleCarregarDemo}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-teal-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-teal-400 disabled:opacity-60 shadow-lg shadow-teal-500/20 transition-all active:scale-95"
          >
            <Database size={16} />
            {seeding ? 'Carregando dados...' : 'Carregar Dados de Exemplo'}
          </button>
        </div>

        {seedSuccess && (
          <div className="mt-4 rounded-xl bg-emerald-500/20 p-3 text-xs font-medium text-emerald-300 ring-1 ring-emerald-500/40 flex items-center gap-2 animate-fadeIn">
            <Check size={16} />
            {seedSuccess}
          </div>
        )}
      </div>

      {/* Project Architecture & Tech Sheet */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Layers size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">Ficha Técnica & Arquitetura do Software</h2>
            <p className="text-xs text-slate-500">Destaques técnicos para explanação na banca da faculdade.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 text-xs">
          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 space-y-1">
            <span className="flex items-center gap-1.5 font-semibold text-slate-800">
              <Code2 size={14} className="text-teal-600" />
              Frontend & SPA
            </span>
            <p className="text-slate-500">React 18, TypeScript, Vite Bundler, TailwindCSS, Lucide Icons.</p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 space-y-1">
            <span className="flex items-center gap-1.5 font-semibold text-slate-800">
              <Database size={14} className="text-blue-600" />
              Banco de Dados
            </span>
            <p className="text-slate-500">PostgreSQL com Supabase, Chaves Estrangeiras, Índices e Triggers.</p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 space-y-1">
            <span className="flex items-center gap-1.5 font-semibold text-slate-800">
              <ShieldCheck size={14} className="text-emerald-600" />
              Segurança
            </span>
            <p className="text-slate-500">Row Level Security (RLS) habilitado em todas as tabelas e tipagem estrita.</p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 space-y-1 sm:col-span-2 md:col-span-3">
            <span className="flex items-center gap-1.5 font-semibold text-slate-800">
              <Cpu size={14} className="text-purple-600" />
              Diferenciais do Projeto
            </span>
            <p className="text-slate-500">
              Central de Atendimento com IA contextualizada, fluxo em 4 etapas (Solicitação → Validação de Guarita → Entrada com Carimbo de Data/Hora → Saída) e Dashboard com métricas em tempo real.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

