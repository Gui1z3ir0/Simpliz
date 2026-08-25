import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  DoorOpen,
  Settings,
  Menu,
  X,
  Sparkles,
  Building2,
  Clock,
  ExternalLink,
} from 'lucide-react';

export type Page = 'dashboard' | 'moradores' | 'porteiros' | 'acessos' | 'configuracoes' | 'atendimento';

interface SidebarProps {
  current: Page;
  onNavigate: (page: Page) => void;
  condominioNome: string;
}

export const NAV_ITEMS: {
  key: Page;
  label: string;
  shortLabel: string;
  description: string;
  icon: typeof LayoutDashboard;
  badge?: string;
}[] = [
  {
    key: 'dashboard',
    label: 'Painel Geral',
    shortLabel: 'Painel',
    description: 'Métricas e visão geral',
    icon: LayoutDashboard,
  },
  {
    key: 'acessos',
    label: 'Controle de Acesso',
    shortLabel: 'Acessos',
    description: 'Entradas, saídas e fila',
    icon: DoorOpen,
  },
  {
    key: 'moradores',
    label: 'Moradores',
    shortLabel: 'Moradores',
    description: 'Gestão de unidades e contatos',
    icon: Users,
  },
  {
    key: 'porteiros',
    label: 'Equipe de Portaria',
    shortLabel: 'Portaria',
    description: 'Escala de plantão e turnos',
    icon: ShieldCheck,
  },
  {
    key: 'atendimento',
    label: 'Central com IA',
    shortLabel: 'IA',
    description: 'Assistente inteligente em tempo real',
    icon: Sparkles,
    badge: 'IA',
  },
  {
    key: 'configuracoes',
    label: 'Configurações',
    shortLabel: 'Ajustes',
    description: 'Unidade e banco de dados',
    icon: Settings,
  },
];

export function Sidebar({ current, onNavigate, condominioNome }: SidebarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleNavigate = (page: Page) => {
    onNavigate(page);
    setDrawerOpen(false);
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. DESKTOP SIDEBAR (Visible only on lg: and larger)                      */}
      {/* ========================================================================= */}
      <aside className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 z-40 bg-slate-900 border-r border-slate-800/80 text-white select-none">
        {/* Brand Logo & Unit info */}
        <div className="p-5 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-500 via-teal-400 to-emerald-400 text-slate-950 font-black text-xl shadow-lg shadow-teal-500/20">
              S
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white">Simpliz</span>
                <span className="rounded bg-teal-500/20 px-1.5 py-0.5 text-[10px] font-bold text-teal-400 ring-1 ring-teal-500/30">
                  PRO
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate mt-0.5 max-w-[170px]" title={condominioNome}>
                {condominioNome}
              </p>
            </div>
          </div>
        </div>

        {/* Live Status Pill & Clock */}
        <div className="px-4 py-3 border-b border-slate-800/60 bg-slate-950/40">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 text-emerald-400 font-medium">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              Portaria Online
            </span>
            <span className="flex items-center gap-1 text-slate-400 font-mono text-[11px]">
              <Clock size={12} className="text-slate-500" />
              {time || '--:--:--'}
            </span>
          </div>
        </div>

        {/* Navigation items */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1.5">
          <p className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Módulos do Sistema
          </p>
          {NAV_ITEMS.map(({ key, label, description, icon: Icon, badge }) => {
            const active = current === key;
            return (
              <button
                key={key}
                onClick={() => handleNavigate(key)}
                className={`group w-full flex items-center justify-between rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-150 text-left ${
                  active
                    ? 'bg-gradient-to-r from-teal-500/15 to-emerald-500/10 text-teal-300 ring-1 ring-teal-500/30 shadow-sm'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-100'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                      active
                        ? 'bg-teal-500 text-slate-950 shadow-sm shadow-teal-500/30'
                        : 'bg-slate-800/80 text-slate-400 group-hover:text-white group-hover:bg-slate-700'
                    }`}
                  >
                    <Icon size={17} className={active ? 'stroke-[2.5]' : 'stroke-2'} />
                  </div>
                  <div className="min-w-0">
                    <p className={`font-semibold leading-snug truncate ${active ? 'text-white' : 'text-slate-300'}`}>
                      {label}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate leading-tight mt-0.5">
                      {description}
                    </p>
                  </div>
                </div>

                {badge && (
                  <span className="rounded-md bg-gradient-to-r from-teal-500 to-emerald-400 px-1.5 py-0.5 text-[10px] font-extrabold text-slate-950 uppercase shadow-sm">
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer info in desktop sidebar */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/50">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Building2 size={15} className="text-teal-500" />
              <span className="truncate font-medium text-slate-300">Simpliz Portaria</span>
            </div>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
              v2.4.0
            </span>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MOBILE TOPBAR (Visible only on <lg)                                    */}
      {/* ========================================================================= */}
      <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between border-b border-slate-800/90 bg-slate-900/95 backdrop-blur-md px-4 py-3 shadow-md w-full shrink-0">
        <div className="flex items-center gap-2.5 text-white min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 font-black text-sm shadow-sm">
            S
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-wide text-white block">Simpliz</span>
              <span className="rounded bg-teal-500/20 px-1 py-0.2 text-[9px] font-bold text-teal-400">PRO</span>
            </div>
            <span className="text-[11px] text-slate-400 block -mt-0.5 truncate max-w-[190px]">
              {condominioNome}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Online
          </span>
          <button
            onClick={() => setDrawerOpen(true)}
            className="rounded-xl p-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500/30"
            aria-label="Abrir Menu de Navegação"
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. MOBILE BOTTOM NAVIGATION (Visible only on <lg)                          */}
      {/* ========================================================================= */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 flex items-center justify-around bg-slate-900/95 backdrop-blur-lg border-t border-slate-800/90 px-1 py-1.5 shadow-2xl safe-area-bottom">
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
                <Icon size={20} className={active ? 'stroke-[2.5]' : 'stroke-2'} />
                {badge && (
                  <span className="absolute -top-1 -right-2 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500" />
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 font-medium truncate ${active ? 'text-teal-400 font-bold' : 'text-slate-400'}`}>
                {shortLabel}
              </span>
              {active && (
                <span className="absolute bottom-0 w-8 h-0.5 bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* ========================================================================= */}
      {/* 4. MOBILE DRAWER MODAL                                                    */}
      {/* ========================================================================= */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-fadeIn"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="relative w-full max-w-sm rounded-3xl bg-slate-900/95 backdrop-blur-xl border border-slate-800 p-5 shadow-2xl animate-scaleIn flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            <div>
              <div className="mb-5 flex items-center justify-between pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-3 text-white min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 font-black shadow-md text-lg">
                    S
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-lg text-white block tracking-wide">Simpliz</span>
                    <span className="text-xs text-slate-400 block truncate max-w-[170px]">
                      {condominioNome}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                  aria-label="Fechar Menu"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="py-1 space-y-1.5">
                {NAV_ITEMS.map(({ key, label, description, icon: Icon, badge }) => {
                  const active = current === key;
                  return (
                    <button
                      key={key}
                      onClick={() => handleNavigate(key)}
                      className={`w-full flex items-center justify-between rounded-xl px-3.5 py-3 text-sm font-medium transition-all ${
                        active
                          ? 'bg-teal-500/15 text-teal-400 ring-1 ring-teal-500/30'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon size={19} className={active ? 'text-teal-400' : 'text-slate-400'} />
                        <div className="text-left min-w-0">
                          <p className="font-medium text-white truncate">{label}</p>
                          <p className="text-[11px] text-slate-400 truncate">{description}</p>
                        </div>
                      </div>
                      {badge && (
                        <span className="rounded-md bg-gradient-to-r from-teal-500 to-emerald-400 px-1.5 py-0.5 text-[10px] font-bold text-slate-950 uppercase shadow-sm">
                          {badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-slate-800/80 pt-4 mt-5 text-center flex items-center justify-between text-xs text-slate-400 px-1">
              <span>Simpliz • Portaria Inteligente</span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Online
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

