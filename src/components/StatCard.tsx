import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent: 'teal' | 'blue' | 'amber' | 'emerald' | 'slate';
  onClick?: () => void;
}

const ACCENTS: Record<StatCardProps['accent'], string> = {
  teal: 'bg-teal-50 text-teal-600 ring-teal-100',
  blue: 'bg-blue-50 text-blue-600 ring-blue-100',
  amber: 'bg-amber-50 text-amber-600 ring-amber-100',
  emerald: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
  slate: 'bg-slate-100 text-slate-600 ring-slate-200',
};

export function StatCard({ label, value, icon: Icon, accent, onClick }: StatCardProps) {
  const isClickable = Boolean(onClick);

  const cardContent = (
    <div className="flex items-center gap-4">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ${ACCENTS[accent]} transition-transform duration-200 ${
          isClickable ? 'group-hover:scale-110' : ''
        }`}
      >
        <Icon size={20} />
      </div>
      <div className="text-left min-w-0">
        <p className="text-2xl font-bold text-slate-900 leading-tight truncate">{value}</p>
        <p className="text-sm font-medium text-slate-500 truncate">{label}</p>
      </div>
    </div>
  );

  if (isClickable) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="group w-full rounded-2xl bg-white p-5 ring-1 ring-slate-200/80 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:ring-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500/40 text-left active:scale-[0.99]"
      >
        {cardContent}
      </button>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200/80 shadow-sm transition-all">
      {cardContent}
    </div>
  );
}

