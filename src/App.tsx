import { useState } from 'react';
import { Sidebar, type Page } from '@/components/Sidebar';
import { Dashboard } from '@/pages/Dashboard';
import { Moradores } from '@/pages/Moradores';
import { Porteiros } from '@/pages/Porteiros';
import { ControleAcesso } from '@/pages/ControleAcesso';
import { Configuracoes } from '@/pages/Configuracoes';
import { CentralAtendimento } from '@/pages/CentralAtendimento';
import { useCondominio } from '@/hooks/useCondominio';

function App() {
  const [page, setPage] = useState<Page>('dashboard');
  const { condominio } = useCondominio();
  const condominioNome = condominio?.nome ?? 'Simpliz Portaria';

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-0 sm:py-6">
      {/* Smartphone Container */}
      <div className="w-full sm:max-w-[440px] min-h-screen sm:min-h-[860px] sm:max-h-[92vh] bg-slate-50 sm:rounded-[36px] sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] sm:border-[8px] sm:border-slate-800 flex flex-col relative overflow-hidden ring-1 ring-slate-700/50">
        
        {/* Mobile Header & Bottom Navigation */}
        <Sidebar current={page} onNavigate={setPage} condominioNome={condominioNome} />

        {/* Scrollable Main Mobile Content */}
        <main className="flex-1 overflow-y-auto px-4 py-4 pb-24 space-y-4">
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

