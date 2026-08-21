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
} from 'lucide-react';

export type Page = 'dashboard' | 'moradores' | 'porteiros' | 'acessos' | 'configuracoes' | 'atendimento';

interface SidebarProps {
  current: Page;
  onNavigate: (page: Page) => void;
  condominioNome: string;
}

const NAV_ITEMS: { key: Page; label: string; icon: typeof LayoutDashboard }[] = [
  { key: 'dashboard', label: 'Painel', icon: LayoutDashboard },
  { key: 'acessos', label: 'Controle de Acesso', icon: DoorOpen },
  { key: 'moradores', label: 'Moradores', icon: Users },
  { key: 'porteiros', label: 'Porteiros', icon: ShieldCheck },
  { key: 'atendimento', label: 'Central de Atendimento', icon: Headphones },
  { key: 'configuracoes', label: 'Configurações', icon: Settings },
];

export function Sidebar({ current, onNavigate, condominioNome }: SidebarProps) {
  const [open, setOpen] = useState(false);

  const handleNavigate = (page: Page) => {
    onNavigate(page);
    setOpen(false);
  };

  return (
    <>
      {/* Mobile Top Header */}
      <header className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-3 md:hidden sticky top-0 z-30">
        <div className="flex items-center gap-2.5 text-white min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-500 text-white shadow-sm">
            <Building2 size={18} />
          </div>
          <div className="min-w-0">
            <span className="font-semibold text-sm truncate block max-w-[170px]">{condominioNome}</span>
            <span className="text-[10px] text-slate-400 block -mt-0.5">Portaria</span>
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

      {/* Mobile Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fadeIn" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 bg-slate-900 p-5 shadow-2xl animate-slideDown flex flex-col justify-between">
            <div>
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-white min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-500 text-white shadow-sm">
                    <Building2 size={20} />
                  </div>
                  <div className="min-w-0">
                    <span className="font-semibold truncate block max-w-[150px]">{condominioNome}</span>
                    <span className="text-xs text-slate-400 block">Gestão de Portaria</span>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                  aria-label="Fechar Menu"
                >
                  <X size={20} />
                </button>
              </div>
              <NavList current={current} onNavigate={handleNavigate} />
            </div>

            <div className="border-t border-slate-800 pt-4 mt-6 text-center">
              <span className="text-xs text-slate-500">Sistema de Portaria v1.0</span>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:shrink-0 bg-slate-900 p-5 justify-between min-h-screen sticky top-0 h-screen">
        <div>
          <div className="mb-8 flex items-center gap-3 px-2 pt-1 text-white">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-500 text-white shadow-md">
              <Building2 size={22} />
            </div>
            <div className="min-w-0">
              <p className="font-semibold leading-tight truncate text-white">{condominioNome}</p>
              <p className="text-xs text-slate-400 mt-0.5">Gestão de Portaria</p>
            </div>
          </div>
          <NavList current={current} onNavigate={handleNavigate} />
        </div>

        <div className="border-t border-slate-800/80 pt-4 px-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Status: Operacional</span>
            <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
          </div>
        </div>
      </aside>
    </>
  );
}

function NavList({ current, onNavigate }: { current: Page; onNavigate: (page: Page) => void }) {
  return (
    <nav className="flex flex-col gap-1.5">
      {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
        const active = current === key;
        return (
          <button
            key={key}
            onClick={() => onNavigate(key)}
            className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${active
              ? 'bg-teal-500/15 text-teal-400 shadow-sm ring-1 ring-teal-500/30'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
          >
            <Icon size={18} className={active ? 'text-teal-400' : 'text-slate-400'} />
            <span className="truncate">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
