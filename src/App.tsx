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
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar current={page} onNavigate={setPage} condominioNome={condominioNome} />
      <main className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-8">
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
