import { useState } from 'react';
import { Sidebar, type Page, NAV_ITEMS } from '@/components/Sidebar';
import { Dashboard } from '@/pages/Dashboard';
import { Moradores } from '@/pages/Moradores';
import { Porteiros } from '@/pages/Porteiros';
import { ControleAcesso } from '@/pages/ControleAcesso';
import { Configuracoes } from '@/pages/Configuracoes';
import { CentralAtendimento } from '@/pages/CentralAtendimento';
import { useCondominio } from '@/hooks/useCondominio';
import { Sparkles, Plus, Shield, Bell } from 'lucide-react';

export function App() {
  const [page, setPage] = useState<Page>('dashboard');
  const { condominio } = useCondominio();
  const condominioNome = condominio?.nome ?? 'Simpliz Portaria';

  const currentPageInfo = NAV_ITEMS.find((item) => item.key === page) ?? NAV_ITEMS[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-900 font-sans flex flex-col lg:flex-row antialiased">
      {/* Sidebar Component (Desktop Sticky Aside + Mobile Header & Bottom Bar) */}
      <Sidebar current={page} onNavigate={setPage} condominioNome={condominioNome} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-72 min-w-0 bg-slate-100/90 min-h-screen">
        {/* Desktop Top Header Bar */}
        <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200/80 sticky top-0 z-20 shadow-xs">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold text-slate-900 font-display">
                {currentPageInfo.label}
              </h1>
              {currentPageInfo.badge && (
                <span className="rounded-md bg-gradient-to-r from-teal-500 to-emerald-400 px-2 py-0.5 text-[11px] font-extrabold text-slate-950 uppercase shadow-xs">
                  {currentPageInfo.badge}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentPageInfo.description}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setPage('atendimento')}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                page === 'atendimento'
                  ? 'bg-teal-50 text-teal-700 ring-1 ring-teal-300'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 ring-1 ring-slate-200'
              }`}
            >
              <Sparkles size={14} className="text-teal-600" />
              <span>Simpliz IA</span>
            </button>

            <button
              onClick={() => setPage('acessos')}
              className="flex items-center gap-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 text-xs font-semibold shadow-sm transition-all active:scale-95"
            >
              <Plus size={15} />
              <span>Registrar Acesso</span>
            </button>
          </div>
        </header>

        {/* Scrollable Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-28 lg:pb-12 max-w-7xl w-full mx-auto animate-fadeIn">
          {page === 'dashboard' && <Dashboard onNavigate={setPage} />}
          {page === 'moradores' && <Moradores />}
          {page === 'porteiros' && <Porteiros />}
          {page === 'acessos' && <ControleAcesso />}
          {page === 'atendimento' && <CentralAtendimento />}
          {page === 'configuracoes' && <Configuracoes />}
        </main>
      </div>
    </div>
  );
}

export default App;


