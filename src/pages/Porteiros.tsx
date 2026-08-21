import { useState } from 'react';
import { Plus, Pencil, Trash2, ShieldCheck, Sun, Sunset, Moon } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { usePorteiros } from '@/hooks/usePorteiros';
import type { Porteiro } from '@/types';

type FormState = { nome: string; turno: string };

const TURNOS = ['Manhã', 'Tarde', 'Noite', '12x36 (Diurno)', '12x36 (Noturno)'];
const EMPTY_FORM: FormState = { nome: '', turno: 'Manhã' };

function getTurnoIcon(turno: string) {
  if (turno.toLowerCase().includes('manhã') || turno.toLowerCase().includes('diurno')) {
    return <Sun size={13} className="text-amber-500" />;
  }
  if (turno.toLowerCase().includes('tarde')) {
    return <Sunset size={13} className="text-orange-500" />;
  }
  return <Moon size={13} className="text-indigo-400" />;
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
      setFormError('Informe o nome do porteiro.');
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      if (editing) {
        await updatePorteiro(editing.id, form);
      } else {
        await addPorteiro(form);
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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold text-slate-900">Porteiros</h1>
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 ring-1 ring-blue-200">
              {porteiros.length} {porteiros.length === 1 ? 'membro' : 'membros'}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">Equipe responsável pela segurança e atendimento na portaria.</p>
        </div>
        <button
          onClick={openCreate}
          className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-teal-700 active:scale-95"
        >
          <Plus size={16} />
          Novo Porteiro
        </button>
      </div>

      {/* Grid List */}
      <div className="rounded-2xl bg-white ring-1 ring-slate-100 shadow-sm overflow-hidden p-4 sm:p-6">
        {loading && <p className="py-8 text-center text-sm text-slate-400">Carregando porteiros...</p>}
        {error && <p className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-xl">{error}</p>}
        {!loading && porteiros.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-12 text-center">
            <ShieldCheck size={32} className="text-slate-300 mb-1" />
            <p className="text-sm text-slate-500 font-medium">Nenhum porteiro cadastrado ainda.</p>
            <p className="text-xs text-slate-400">Cadastre os membros da equipe para atribuir turnos e liberações.</p>
          </div>
        )}
        {!loading && porteiros.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {porteiros.map((porteiro) => (
              <div
                key={porteiro.id}
                className="group relative rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:bg-white hover:shadow-md hover:border-teal-200"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white font-semibold shadow-sm">
                      {porteiro.nome.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 truncate">{porteiro.nome}</p>
                      <span className="inline-flex items-center gap-1.5 mt-0.5 rounded-full bg-white px-2 py-0.5 text-xs text-slate-600 ring-1 ring-slate-200">
                        {getTurnoIcon(porteiro.turno)}
                        {porteiro.turno}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-100 sm:opacity-0 transition-opacity sm:group-hover:opacity-100">
                    <button
                      onClick={() => openEdit(porteiro)}
                      className="rounded-lg p-2 sm:p-1.5 text-slate-400 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                      title="Editar porteiro"
                      aria-label="Editar"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => setDeleting(porteiro)}
                      className="rounded-lg p-2 sm:p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Remover porteiro"
                      aria-label="Remover"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Create / Edit */}
      {modalOpen && (
        <Modal title={editing ? 'Editar Porteiro' : 'Novo Porteiro'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Nome do porteiro</label>
              <input
                autoFocus
                required
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                placeholder="Ex: Carlos Eduardo"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Turno de trabalho</label>
              <select
                value={form.turno}
                onChange={(e) => setForm({ ...form, turno: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 bg-white"
              >
                {TURNOS.map((turno) => (
                  <option key={turno} value={turno}>
                    {turno}
                  </option>
                ))}
              </select>
            </div>
            {formError && <p className="text-sm text-red-600 bg-red-50 p-2.5 rounded-lg">{formError}</p>}
            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-teal-600 px-5 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-60 shadow-sm transition-colors"
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
          message={`Tem certeza que deseja remover ${deleting.nome}? Essa ação retirará o porteiro da escala.`}
          confirmLabel="Sim, Remover"
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
