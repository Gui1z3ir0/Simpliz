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
  const condominioNome = condominio?.nome ?? 'Portaria';

  return (
    <div className="flex min-h-screen bg-slate-50 justify-center">
      <Sidebar current={page} onNavigate={setPage} condominioNome={condominioNome} />
      <main className="flex-1 overflow-x-hidden flex flex-col items-center justify-start w-full">
        <div className="w-full max-w-5xl mx-auto px-3.5 py-4 pb-24 md:px-8 md:py-8 md:pb-8">
          {page === 'dashboard' && <Dashboard onNavigate={setPage} />}
          {page === 'moradores' && <Moradores />}
          {page === 'porteiros' && <Porteiros />}
          {page === 'acessos' && <ControleAcesso />}
          {page === 'atendimento' && <CentralAtendimento />}
          {page === 'configuracoes' && <Configuracoes />}
        </div>
      </main>
    </div>
  );
}

export default App;
