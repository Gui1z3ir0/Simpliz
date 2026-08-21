import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  DoorOpen,
  Settings,
  Menu,
  X,
  Building2,
  Headphones,
  Sparkles,
} from 'lucide-react';

export type Page = 'dashboard' | 'moradores' | 'porteiros' | 'acessos' | 'configuracoes' | 'atendimento';

interface SidebarProps {
  current: Page;
  onNavigate: (page: Page) => void;
  condominioNome: string;
}

const NAV_ITEMS: { key: Page; label: string; shortLabel: string; icon: typeof LayoutDashboard; badge?: string }[] = [
  { key: 'dashboard', label: 'Painel Geral', shortLabel: 'Painel', icon: LayoutDashboard },
  { key: 'acessos', label: 'Controle de Acesso', shortLabel: 'Acessos', icon: DoorOpen },
  { key: 'moradores', label: 'Moradores', shortLabel: 'Moradores', icon: Users },
  { key: 'porteiros', label: 'Porteiros', shortLabel: 'Portaria', icon: ShieldCheck },
  { key: 'atendimento', label: 'Simpliz IA', shortLabel: 'IA', icon: Sparkles, badge: 'IA' },
  { key: 'configuracoes', label: 'Configurações', shortLabel: 'Ajustes', icon: Settings },
];

export function Sidebar({ current, onNavigate, condominioNome }: SidebarProps) {
  const [open, setOpen] = useState(false);

  const handleNavigate = (page: Page) => {
    onNavigate(page);
    setOpen(false);
  };

  return (
    <>
      {/* Mobile Top App Header */}
      <header className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-3 md:hidden sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-2.5 text-white min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 font-black text-sm shadow-sm">
            S
          </div>
          <div className="min-w-0">
            <span className="font-bold text-sm tracking-wide text-white block">Simpliz</span>
            <span className="text-[10px] text-slate-400 block -mt-0.5 truncate max-w-[170px]">{condominioNome}</span>
          </div>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          aria-label="Abrir Menu"
        >
          <Menu size={22} />
        </button>
      </header>

      {/* Mobile Bottom Navigation Bar (App Mobile Style) */}
      <nav className="fixed bottom-0 inset-x-0 z-40 flex md:hidden items-center justify-around bg-slate-900/95 backdrop-blur-md border-t border-slate-800/80 px-2 py-2 shadow-2xl safe-area-bottom max-w-lg mx-auto sm:rounded-t-2xl sm:border-x">
        {NAV_ITEMS.map(({ key, shortLabel, icon: Icon, badge }) => {
          const active = current === key;
          return (
            <button
              key={key}
              onClick={() => handleNavigate(key)}
              className={`relative flex flex-1 flex-col items-center justify-center py-1 px-0.5 transition-all duration-150 ${
                active ? 'text-teal-400 scale-105' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon size={19} className={active ? 'stroke-[2.5]' : 'stroke-2'} />
                {badge && (
                  <span className="absolute -top-1 -right-2 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500" />
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 font-medium truncate ${active ? 'text-teal-400 font-semibold' : 'text-slate-400'}`}>
                {shortLabel}
              </span>
              {active && (
                <span className="absolute bottom-0 w-8 h-0.5 bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Mobile Drawer / Centered Mobile Menu */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-fadeIn" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-sm rounded-3xl bg-slate-900/95 backdrop-blur-xl border border-slate-800 p-5 shadow-2xl animate-scaleIn flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            <div>
              <div className="mb-5 flex items-center justify-between pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-3 text-white min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 font-black shadow-md text-lg">
                    S
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-lg text-white block tracking-wide">Simpliz</span>
                    <span className="text-xs text-slate-400 block truncate max-w-[170px]">{condominioNome}</span>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                  aria-label="Fechar Menu"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="py-1">
                <NavList current={current} onNavigate={handleNavigate} />
              </div>
            </div>

            <div className="border-t border-slate-800/80 pt-4 mt-5 text-center flex items-center justify-between text-xs text-slate-400 px-1">
              <span>Simpliz • Portaria Mobile</span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Online
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:shrink-0 bg-slate-900 p-5 justify-between min-h-screen sticky top-0 h-screen">
        <div>
          <div className="mb-8 flex items-center gap-3 px-2 pt-1 text-white">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 font-black text-lg shadow-md">
              S
            </div>
            <div className="min-w-0">
              <p className="font-bold leading-tight tracking-wide text-lg text-white">Simpliz</p>
              <p className="text-xs text-slate-400 mt-0.5 truncate">{condominioNome}</p>
            </div>
          </div>
          <NavList current={current} onNavigate={handleNavigate} />
        </div>

        <div className="border-t border-slate-800/80 pt-4 px-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Simpliz v1.0</span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Online
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}

function NavList({ current, onNavigate }: { current: Page; onNavigate: (page: Page) => void }) {
  return (
    <nav className="flex flex-col gap-1.5">
      {NAV_ITEMS.map(({ key, label, icon: Icon, badge }) => {
        const active = current === key;
        return (
          <button
            key={key}
            onClick={() => onNavigate(key)}
            className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
              active
                ? 'bg-teal-500/15 text-teal-400 shadow-sm ring-1 ring-teal-500/30'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <Icon size={18} className={active ? 'text-teal-400' : 'text-slate-400'} />
              <span className="truncate">{label}</span>
            </div>
            {badge && (
              <span className="rounded-md bg-gradient-to-r from-teal-500 to-emerald-400 px-1.5 py-0.5 text-[10px] font-bold text-slate-950 uppercase shadow-sm">
                {badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
