import { Modal } from '@/components/Modal';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  confirmVariant?: 'danger' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Confirmar',
  confirmVariant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal title={title} onClose={onCancel} maxWidth="max-w-md">
      <div className="flex items-start gap-3.5 mb-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600 ring-1 ring-red-100">
          <AlertTriangle size={20} />
        </div>
        <p className="text-sm text-slate-600 leading-relaxed pt-1">{message}</p>
      </div>

      <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onCancel}
          className="w-full sm:w-auto rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className={`w-full sm:w-auto rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all active:scale-95 ${
            confirmVariant === 'danger'
              ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500/30'
              : 'bg-teal-600 hover:bg-teal-700 focus:ring-teal-500/30'
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}

