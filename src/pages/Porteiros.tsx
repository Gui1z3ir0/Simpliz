import { useState } from 'react';
import { Plus, Pencil, Trash2, ShieldCheck, Sun, Sunset, Moon, Clock, UserCheck } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { usePorteiros } from '@/hooks/usePorteiros';
import type { Porteiro } from '@/types';

type FormState = { nome: string; turno: string };

const TURNOS = ['Manhã', 'Tarde', 'Noite', '12x36 (Diurno)', '12x36 (Noturno)'];
const EMPTY_FORM: FormState = { nome: '', turno: 'Manhã' };

function getTurnoBadge(turno: string) {
  const t = turno.toLowerCase();
  if (t.includes('manhã') || t.includes('diurno')) {
    return {
      icon: <Sun size={13} className="text-amber-500" />,
      className: 'bg-amber-50 text-amber-800 ring-amber-200',
    };
  }
  if (t.includes('tarde')) {
    return {
      icon: <Sunset size={13} className="text-orange-500" />,
      className: 'bg-orange-50 text-orange-800 ring-orange-200',
    };
  }
  return {
    icon: <Moon size={13} className="text-indigo-500" />,
    className: 'bg-indigo-50 text-indigo-800 ring-indigo-200',
  };
}

export function Porteiros() {
  const { porteiros, loading, error, addPorteiro, updatePorteiro, deletePorteiro } = usePorteiros();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Porteiro | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<Porteiro | null>(null);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setModalOpen(true);
  };

  const openEdit = (porteiro: Porteiro) => {
    setEditing(porteiro);
    setForm({ nome: porteiro.nome, turno: porteiro.turno });
    setFormError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome.trim()) {
      setFormError('Informe o nome completo do porteiro.');
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      if (editing) {
        await updatePorteiro(editing.id, {
          nome: form.nome.trim(),
          turno: form.turno,
        });
      } else {
        await addPorteiro({
          nome: form.nome.trim(),
          turno: form.turno,
        });
      }
      setModalOpen(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao salvar porteiro.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await deletePorteiro(deleting.id);
    } catch (err) {
      console.error('Delete porteiro error:', err);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl shadow-xs ring-1 ring-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-display">
              Equipe de Portaria & Escala
            </h1>
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 ring-1 ring-blue-200">
              {porteiros.length} {porteiros.length === 1 ? 'profissional' : 'profissionais'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Gestão dos operadores da guarita, atribuição de turnos e controle de plantão.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-teal-700 active:scale-95"
        >
          <Plus size={16} />
          <span>Novo Porteiro</span>
        </button>
      </div>

      {/* Grid of Porteiros Cards */}
      <div className="rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-xs p-5 sm:p-6">
        {loading && (
          <p className="py-12 text-center text-sm text-slate-400">
            Carregando equipe de portaria...
          </p>
        )}

        {error && (
          <p className="mb-4 text-sm text-red-700 bg-red-50 p-4 rounded-2xl border border-red-200">
            {error}
          </p>
        )}

        {!loading && porteiros.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <ShieldCheck size={36} className="text-slate-300 mb-1" />
            <p className="text-base text-slate-700 font-bold font-display">
              Nenhum porteiro cadastrado
            </p>
            <p className="text-xs text-slate-400 max-w-sm">
              Cadastre os membros da equipe de segurança e guarita para atribuir liberações de visitas e turnos de trabalho.
            </p>
          </div>
        )}

        {!loading && porteiros.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {porteiros.map((porteiro) => {
              const badge = getTurnoBadge(porteiro.turno);
              return (
                <div
                  key={porteiro.id}
                  className="group relative rounded-3xl border border-slate-100 bg-slate-50/60 p-5 transition-all duration-200 hover:bg-white hover:shadow-md hover:border-teal-200 hover:ring-1 hover:ring-teal-200"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 text-teal-400 font-bold text-base shadow-sm ring-1 ring-slate-700">
                        {porteiro.nome.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 text-sm truncate font-display">
                          {porteiro.nome}
                        </p>
                        <div className="mt-1 flex items-center gap-1.5">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${badge.className}`}
                          >
                            {badge.icon}
                            {porteiro.turno}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-1 opacity-100 sm:opacity-0 transition-opacity sm:group-hover:opacity-100">
                      <button
                        onClick={() => openEdit(porteiro)}
                        className="rounded-xl p-2 text-slate-400 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                        title="Editar porteiro"
                        aria-label="Editar"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setDeleting(porteiro)}
                        className="rounded-xl p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Remover porteiro"
                        aria-label="Remover"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <UserCheck size={13} className="text-teal-600" />
                      Operador Autorizado
                    </span>
                    <span className="font-mono text-[11px]">Portaria Simpliz</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Create / Edit */}
      {modalOpen && (
        <Modal
          title={editing ? 'Editar Porteiro' : 'Novo Porteiro'}
          onClose={() => setModalOpen(false)}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs sm:text-sm font-semibold text-slate-700">
                Nome Completo do Porteiro *
              </label>
              <input
                autoFocus
                required
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                placeholder="Ex: Carlos Eduardo dos Santos"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs sm:text-sm font-semibold text-slate-700">
                Turno de Trabalho / Escala *
              </label>
              <select
                value={form.turno}
                onChange={(e) => setForm({ ...form, turno: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 bg-white"
              >
                {TURNOS.map((turno) => (
                  <option key={turno} value={turno}>
                    {turno}
                  </option>
                ))}
              </select>
            </div>

            {formError && (
              <p className="text-xs sm:text-sm text-red-700 bg-red-50 p-3 rounded-xl border border-red-200">
                {formError}
              </p>
            )}

            <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-xl px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-teal-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60 shadow-sm transition-colors"
              >
                {saving ? 'Salvando...' : 'Salvar Porteiro'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Dialog */}
      {deleting && (
        <ConfirmDialog
          title="Remover Porteiro"
          message={`Tem certeza de que deseja remover ${deleting.nome} da equipe de portaria? Essa ação afetará a escala de trabalho.`}
          confirmLabel="Sim, Remover"
          confirmVariant="danger"
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}

