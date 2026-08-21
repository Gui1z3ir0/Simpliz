import { Clock, ShieldCheck, DoorOpen, CheckCircle2, XCircle } from 'lucide-react';
import type { StatusAcesso } from '@/types';

const STATUS_CONFIG: Record<
  StatusAcesso,
  { label: string; icon: typeof Clock; className: string }
> = {
  aguardando: {
    label: 'Aguardando liberação',
    icon: Clock,
    className: 'bg-amber-50 text-amber-700 ring-amber-200',
  },
  liberado: {
    label: 'Liberado',
    icon: ShieldCheck,
    className: 'bg-blue-50 text-blue-700 ring-blue-200',
  },
  no_condominio: {
    label: 'No condomínio',
    icon: DoorOpen,
    className: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  },
  finalizado: {
    label: 'Finalizado',
    icon: CheckCircle2,
    className: 'bg-slate-100 text-slate-600 ring-slate-200',
  },
  negado: {
    label: 'Negado',
    icon: XCircle,
    className: 'bg-red-50 text-red-700 ring-red-200',
  },
};

export function StatusBadge({ status }: { status: StatusAcesso }) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${config.className}`}
    >
      <Icon size={13} />
      {config.label}
    </span>
  );
}
