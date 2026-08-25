import { useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, Phone, Users as UsersIcon, Search, Building, MessageCircle } from 'lucide-react';
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
      setFormError('Informe o nome completo do morador.');
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      if (editing) {
        await updateMorador(editing.id, {
          nome: form.nome.trim(),
          bloco: form.bloco.trim(),
          apartamento: form.apartamento.trim(),
          telefone: form.telefone.trim(),
        });
      } else {
        await addMorador({
          nome: form.nome.trim(),
          bloco: form.bloco.trim(),
          apartamento: form.apartamento.trim(),
          telefone: form.telefone.trim(),
        });
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl shadow-xs ring-1 ring-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-display">
              Moradores & Unidades
            </h1>
            <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700 ring-1 ring-teal-200">
              {moradores.length} {moradores.length === 1 ? 'residente' : 'residentes'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Cadastro de moradores, blocos, apartamentos e canais de contato direto via WhatsApp.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-teal-700 active:scale-95"
        >
          <Plus size={16} />
          <span>Novo Morador</span>
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="flex items-center gap-3 rounded-2xl bg-white p-3.5 ring-1 ring-slate-200/80 shadow-xs">
        <Search size={18} className="text-slate-400 ml-1.5 shrink-0" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar morador por nome, bloco, apartamento ou telefone..."
          className="w-full text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none bg-transparent"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="text-xs font-semibold text-slate-400 hover:text-slate-700 px-2.5 py-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Limpar
          </button>
        )}
      </div>

      {/* Main Container */}
      <div className="rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-xs overflow-hidden">
        {loading && (
          <p className="px-6 py-12 text-center text-sm text-slate-400">
            Carregando lista de moradores...
          </p>
        )}

        {error && (
          <p className="px-6 py-4 text-sm text-red-700 bg-red-50 border-b border-red-100">
            {error}
          </p>
        )}

        {!loading && moradores.length === 0 && (
          <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
            <UsersIcon size={36} className="text-slate-300 mb-1" />
            <p className="text-base text-slate-700 font-bold font-display">
              Nenhum morador cadastrado
            </p>
            <p className="text-xs text-slate-400 max-w-sm">
              Cadastre os primeiros moradores do condomínio para gerenciar o controle de acesso e autorizações de visitas.
            </p>
          </div>
        )}

        {!loading && moradores.length > 0 && moradoresFiltrados.length === 0 && (
          <div className="px-6 py-14 text-center text-sm text-slate-500">
            Nenhum morador encontrado para o termo <strong className="text-slate-800">"{search}"</strong>.
          </div>
        )}

        {/* Table View */}
        {!loading && moradoresFiltrados.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-50/60">
                  <th className="px-6 py-4">Nome do Morador</th>
                  <th className="px-6 py-4">Bloco / Torre</th>
                  <th className="px-6 py-4">Apartamento</th>
                  <th className="px-6 py-4">Contato / WhatsApp</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {moradoresFiltrados.map((morador) => {
                  const cleanPhone = (morador.telefone || '').replace(/\D/g, '');
                  return (
                    <tr key={morador.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700 font-bold text-xs ring-1 ring-teal-200">
                            {morador.nome.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-semibold text-slate-900 block leading-tight">
                              {morador.nome}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              Residente
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        <span className="inline-flex items-center gap-1.5 font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg text-xs">
                          <Building size={13} className="text-slate-400" />
                          {morador.bloco ? `Bloco ${morador.bloco}` : 'Não informado'}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-slate-700 font-semibold text-xs sm:text-sm">
                        {morador.apartamento ? `Apto ${morador.apartamento}` : '-'}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {morador.telefone ? (
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                              <Phone size={13} className="text-slate-400" />
                              {morador.telefone}
                            </span>
                            {cleanPhone.length >= 10 && (
                              <a
                                href={`https://wa.me/55${cleanPhone}`}
                                target="_blank"
                                rel="noreferrer"
                                title="Abrir conversa no WhatsApp"
                                className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-2 py-1 text-[11px] font-semibold transition-colors ring-1 ring-emerald-200"
                              >
                                <MessageCircle size={12} className="text-emerald-600" />
                                WhatsApp
                              </a>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs">Sem telefone</span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => openEdit(morador)}
                            className="rounded-xl p-2 text-slate-400 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                            title="Editar morador"
                            aria-label="Editar morador"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => setDeleting(morador)}
                            className="rounded-xl p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                            title="Remover morador"
                            aria-label="Remover morador"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <Modal title={editing ? 'Editar Morador' : 'Novo Morador'} onClose={() => setModalOpen(false)} maxWidth="max-w-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs sm:text-sm font-semibold text-slate-700">
                Nome Completo do Morador *
              </label>
              <input
                autoFocus
                required
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                placeholder="Ex: Maria Silva Ramos"
              />
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="mb-1.5 block text-xs sm:text-sm font-semibold text-slate-700">
                  Bloco / Torre
                </label>
                <input
                  value={form.bloco}
                  onChange={(e) => setForm({ ...form, bloco: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  placeholder="Ex: A, B ou 1"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs sm:text-sm font-semibold text-slate-700">
                  Apartamento
                </label>
                <input
                  value={form.apartamento}
                  onChange={(e) => setForm({ ...form, apartamento: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  placeholder="Ex: 302"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs sm:text-sm font-semibold text-slate-700">
                Telefone / WhatsApp
              </label>
              <input
                value={form.telefone}
                onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                placeholder="Ex: (11) 98765-4321"
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
          message={`Tem certeza de que deseja remover ${deleting.nome} (Bloco ${deleting.bloco || '-'}, Apto ${deleting.apartamento || '-'})? Essa ação não poderá ser desfeita.`}
          confirmLabel="Sim, Remover"
          confirmVariant="danger"
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}

