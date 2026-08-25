import { Clock, ShieldCheck, DoorOpen, CheckCircle2, XCircle } from 'lucide-react';
import type { StatusAcesso } from '@/types';

const STATUS_CONFIG: Record<
  StatusAcesso,
  { label: string; icon: typeof Clock; className: string; dotClass: string }
> = {
  aguardando: {
    label: 'Aguardando Liberação',
    icon: Clock,
    className: 'bg-amber-50 text-amber-700 ring-amber-300/80',
    dotClass: 'bg-amber-500 animate-pulse',
  },
  liberado: {
    label: 'Liberado na Portaria',
    icon: ShieldCheck,
    className: 'bg-blue-50 text-blue-700 ring-blue-300/80',
    dotClass: 'bg-blue-500',
  },
  no_condominio: {
    label: 'Presente no Condomínio',
    icon: DoorOpen,
    className: 'bg-emerald-50 text-emerald-700 ring-emerald-300/80',
    dotClass: 'bg-emerald-500 animate-pulse',
  },
  finalizado: {
    label: 'Acesso Concluído',
    icon: CheckCircle2,
    className: 'bg-slate-100 text-slate-700 ring-slate-300/80',
    dotClass: 'bg-slate-400',
  },
  negado: {
    label: 'Acesso Recusado',
    icon: XCircle,
    className: 'bg-red-50 text-red-700 ring-red-300/80',
    dotClass: 'bg-red-500',
  },
};

export function StatusBadge({ status }: { status: StatusAcesso }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.aguardando;
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 shadow-2xs whitespace-nowrap ${config.className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dotClass}`} />
      <Icon size={13} className="shrink-0" />
      <span>{config.label}</span>
    </span>
  );
}

