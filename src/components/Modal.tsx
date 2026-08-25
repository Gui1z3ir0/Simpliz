import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: string;
}

export function Modal({ title, onClose, children, maxWidth = 'max-w-lg' }: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs animate-fadeIn"
        onClick={onClose}
      />
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full ${maxWidth} rounded-3xl bg-white shadow-2xl ring-1 ring-slate-900/10 max-h-[92vh] flex flex-col overflow-hidden animate-scaleIn my-auto`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 sm:px-6 py-4 bg-slate-50/70 backdrop-blur-xs sticky top-0 z-10">
          <h2 id="modal-title" className="text-base sm:text-lg font-bold text-slate-900 font-display">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar janela"
            className="rounded-xl p-1.5 text-slate-400 transition-colors hover:bg-slate-200/70 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-5 sm:px-6 py-5 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}


