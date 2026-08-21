import { useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, Phone, Users as UsersIcon, Search, Building } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useMoradores } from '@/hooks/useMoradores';
import type { Morador } from '@/types';

type FormState = {
  nome: string;
  bloco: string;
  apartamento: string;
  telefone: string;
};

const EMPTY_FORM: FormState = { nome: '', bloco: '', apartamento: '', telefone: '' };

export function Moradores() {
  const { moradores, loading, error, addMorador, updateMorador, deleteMorador } = useMoradores();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Morador | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<Morador | null>(null);
  const [search, setSearch] = useState('');

  const moradoresFiltrados = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return moradores;
    return moradores.filter(
      (m) =>
        m.nome.toLowerCase().includes(term) ||
        m.bloco.toLowerCase().includes(term) ||
        m.apartamento.toLowerCase().includes(term) ||
        m.telefone.toLowerCase().includes(term)
    );
  }, [moradores, search]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setModalOpen(true);
  };

  const openEdit = (morador: Morador) => {
    setEditing(morador);
    setForm({
      nome: morador.nome,
      bloco: morador.bloco,
      apartamento: morador.apartamento,
      telefone: morador.telefone,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome.trim()) {
      setFormError('Informe o nome do morador.');
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      if (editing) {
        await updateMorador(editing.id, form);
      } else {
        await addMorador(form);
      }
      setModalOpen(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao salvar morador.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await deleteMorador(deleting.id);
    } catch (err) {
      console.error('Delete morador error:', err);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Moradores</h1>
          <p className="text-sm text-slate-500 mt-1">Cadastro e gerenciamento de unidades e moradores.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-teal-700"
        >
          <Plus size={16} />
          Novo Morador
        </button>
      </div>

      {/* Search Input */}
      <div className="flex items-center gap-3 rounded-2xl bg-white p-3.5 ring-1 ring-slate-100 shadow-sm">
        <Search size={18} className="text-slate-400 ml-1" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome, bloco, apartamento ou telefone..."
          className="w-full text-sm placeholder:text-slate-400 focus:outline-none bg-transparent"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="text-xs font-medium text-slate-400 hover:text-slate-600 px-2 py-1"
          >
            Limpar
          </button>
        )}
      </div>

      {/* Table / List */}
      <div className="rounded-2xl bg-white ring-1 ring-slate-100 shadow-sm overflow-hidden">
        {loading && <p className="px-5 py-8 text-center text-sm text-slate-400">Carregando moradores...</p>}
        {error && <p className="px-5 py-4 text-sm text-red-600 bg-red-50">{error}</p>}
        {!loading && moradores.length === 0 && (
          <div className="flex flex-col items-center gap-2 px-5 py-14 text-center">
            <UsersIcon size={32} className="text-slate-300 mb-1" />
            <p className="text-sm text-slate-500 font-medium">Nenhum morador cadastrado ainda.</p>
            <p className="text-xs text-slate-400">Clique em "Novo Morador" para iniciar o cadastro.</p>
          </div>
        )}
        {!loading && moradores.length > 0 && moradoresFiltrados.length === 0 && (
          <div className="px-5 py-12 text-center text-sm text-slate-400">
            Nenhum morador encontrado para a busca "{search}".
          </div>
        )}
        {!loading && moradoresFiltrados.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400 bg-slate-50/50">
                  <th className="px-5 py-3.5 font-medium">Nome</th>
                  <th className="px-5 py-3.5 font-medium">Bloco</th>
                  <th className="px-5 py-3.5 font-medium">Apartamento</th>
                  <th className="px-5 py-3.5 font-medium">Telefone</th>
                  <th className="px-5 py-3.5 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {moradoresFiltrados.map((morador) => (
                  <tr key={morador.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-slate-900">{morador.nome}</td>
                    <td className="px-5 py-3.5 text-slate-600">
                      <span className="inline-flex items-center gap-1">
                        <Building size={13} className="text-slate-400" />
                        {morador.bloco || '-'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">{morador.apartamento || '-'}</td>
                    <td className="px-5 py-3.5 text-slate-600">
                      {morador.telefone ? (
                        <span className="inline-flex items-center gap-1.5 text-slate-700">
                          <Phone size={13} className="text-slate-400" />
                          {morador.telefone}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => openEdit(morador)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                          title="Editar"
                          aria-label="Editar morador"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setDeleting(morador)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Remover"
                          aria-label="Remover morador"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <Modal title={editing ? 'Editar Morador' : 'Novo Morador'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Nome completo</label>
              <input
                autoFocus
                required
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                placeholder="Ex: Maria Silva"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Bloco / Torre</label>
                <input
                  value={form.bloco}
                  onChange={(e) => setForm({ ...form, bloco: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  placeholder="Ex: A ou Bloco 1"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Apartamento</label>
                <input
                  value={form.apartamento}
                  onChange={(e) => setForm({ ...form, apartamento: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  placeholder="Ex: 302"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Telefone / WhatsApp</label>
              <input
                value={form.telefone}
                onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                placeholder="Ex: (11) 98765-4321"
              />
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
                {saving ? 'Salvando...' : 'Salvar Morador'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation */}
      {deleting && (
        <ConfirmDialog
          title="Remover Morador"
          message={`Tem certeza que deseja remover ${deleting.nome}? Todas as movimentações vinculadas serão afetadas.`}
          confirmLabel="Sim, Remover"
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
