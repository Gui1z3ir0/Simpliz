import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent: 'teal' | 'blue' | 'amber' | 'emerald' | 'slate';
  helperText?: string;
  onClick?: () => void;
}

const ACCENTS: Record<
  StatCardProps['accent'],
  { iconBg: string; text: string; ring: string; lightBg: string }
> = {
  teal: {
    iconBg: 'bg-teal-500/10 text-teal-600',
    text: 'text-teal-600',
    ring: 'group-hover:ring-teal-400/50',
    lightBg: 'from-teal-500/5 to-transparent',
  },
  blue: {
    iconBg: 'bg-blue-500/10 text-blue-600',
    text: 'text-blue-600',
    ring: 'group-hover:ring-blue-400/50',
    lightBg: 'from-blue-500/5 to-transparent',
  },
  amber: {
    iconBg: 'bg-amber-500/10 text-amber-600',
    text: 'text-amber-600',
    ring: 'group-hover:ring-amber-400/50',
    lightBg: 'from-amber-500/5 to-transparent',
  },
  emerald: {
    iconBg: 'bg-emerald-500/10 text-emerald-600',
    text: 'text-emerald-600',
    ring: 'group-hover:ring-emerald-400/50',
    lightBg: 'from-emerald-500/5 to-transparent',
  },
  slate: {
    iconBg: 'bg-slate-500/10 text-slate-600',
    text: 'text-slate-600',
    ring: 'group-hover:ring-slate-400/50',
    lightBg: 'from-slate-500/5 to-transparent',
  },
};

export function StatCard({ label, value, icon: Icon, accent, helperText, onClick }: StatCardProps) {
  const isClickable = Boolean(onClick);
  const colors = ACCENTS[accent];

  const content = (
    <div className="relative flex items-center gap-4">
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${colors.iconBg} ring-1 ring-black/5 transition-transform duration-200 ${
          isClickable ? 'group-hover:scale-110' : ''
        }`}
      >
        <Icon size={22} className="stroke-[2.2]" />
      </div>
      <div className="text-left min-w-0 flex-1">
        <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-none tracking-tight truncate font-display">
          {value}
        </p>
        <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1 truncate">
          {label}
        </p>
        {helperText && (
          <p className="text-[11px] text-slate-400 mt-0.5 truncate">
            {helperText}
          </p>
        )}
      </div>
    </div>
  );

  if (isClickable) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`group relative w-full rounded-2xl bg-white p-5 shadow-xs ring-1 ring-slate-200/80 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:ring-2 ${colors.ring} focus:outline-none focus:ring-2 focus:ring-teal-500/40 text-left active:scale-[0.99] overflow-hidden`}
      >
        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${colors.lightBg} rounded-bl-full pointer-events-none`} />
        {content}
      </button>
    );
  }

  return (
    <div className="relative rounded-2xl bg-white p-5 shadow-xs ring-1 ring-slate-200/80 transition-all overflow-hidden">
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${colors.lightBg} rounded-bl-full pointer-events-none`} />
      {content}
    </div>
  );
}


