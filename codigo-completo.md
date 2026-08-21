# Sistema de Gestão de Portaria - Código Completo

---

### package.json
```json
{
  "name": "vite-react-typescript-starter",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit -p tsconfig.app.json"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.57.4",
    "lucide-react": "^0.446.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@eslint/js": "^9.9.1",
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.18",
    "eslint": "^9.9.1",
    "eslint-plugin-react-hooks": "^5.1.0-rc.0",
    "eslint-plugin-react-refresh": "^0.4.11",
    "globals": "^15.9.0",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.5.3",
    "typescript-eslint": "^8.3.0",
    "vite": "^5.4.2"
  }
}
```

### vite.config.ts
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
```

### tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.15s ease-out',
        scaleIn: 'scaleIn 0.18s ease-out',
        slideDown: 'slideDown 0.2s ease-out',
      },
    },
  },
  plugins: [],
};
```

### postcss.config.js
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### tsconfig.json
```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

### tsconfig.app.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Path alias — depth-invariant imports for src (@/foo === src/foo from any file) */
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },

    /* Linting */
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

### tsconfig.node.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,

    /* Linting */
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["vite.config.ts"]
}
```

### eslint.config.js
```javascript
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  }
);
```

### index.html
```html
<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/vite.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Full Application Development</title>
  <meta property="og:image" content="https://bolt.new/static/og_default.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content="https://bolt.new/static/og_default.png" />
</head>

<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>

</html>
```

### src/main.tsx
```typescript
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

### src/index.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply text-slate-900 antialiased;
  }
}
```

### src/vite-env.d.ts
```typescript
/// <reference types="vite/client" />
```

### src/App.tsx
```typescript
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
          {page === 'dashboard' && <Dashboard />}
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
```

### src/types/index.ts
```typescript
export type StatusAcesso =
  | 'aguardando'
  | 'liberado'
  | 'no_condominio'
  | 'finalizado'
  | 'negado';

export interface Condominio {
  id: string;
  nome: string;
  endereco: string;
  created_at: string;
  updated_at: string;
}

export interface Morador {
  id: string;
  nome: string;
  bloco: string;
  apartamento: string;
  telefone: string;
  created_at: string;
}

export interface Porteiro {
  id: string;
  nome: string;
  turno: string;
  created_at: string;
}

export interface Visitante {
  id: string;
  nome: string;
  documento: string;
  telefone: string;
  created_at: string;
}

export interface ControleAcesso {
  id: string;
  visitante_id: string;
  morador_id: string;
  porteiro_id: string | null;
  status: StatusAcesso;
  motivo_visita: string;
  data_hora_solicitacao: string;
  data_hora_entrada: string | null;
  data_hora_saida: string | null;
  observacao: string;
}

export interface AcessoCompleto extends ControleAcesso {
  visitante: Visitante;
  morador: Morador;
  porteiro: Porteiro | null;
}
```

### src/lib/supabase.ts
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### src/hooks/useCondominio.ts
```typescript
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Condominio } from '@/types';

export function useCondominio() {
  const [condominio, setCondominio] = useState<Condominio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCondominio = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('condominio').select('*').maybeSingle();

    if (error) {
      setError(error.message);
    } else {
      setCondominio(data);
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCondominio();
  }, [fetchCondominio]);

  const updateCondominio = async (nome: string, endereco: string) => {
    if (!condominio) return;
    const { error } = await supabase
      .from('condominio')
      .update({ nome, endereco, updated_at: new Date().toISOString() })
      .eq('id', condominio.id);
    if (error) throw new Error(error.message);
    await fetchCondominio();
  };

  return { condominio, loading, error, updateCondominio };
}
```

### src/hooks/useMoradores.ts
```typescript
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Morador } from '@/types';

export function useMoradores() {
  const [moradores, setMoradores] = useState<Morador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMoradores = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('moradores')
      .select('*')
      .order('bloco', { ascending: true })
      .order('apartamento', { ascending: true });

    if (error) {
      setError(error.message);
    } else {
      setMoradores(data ?? []);
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMoradores();
  }, [fetchMoradores]);

  const addMorador = async (morador: Omit<Morador, 'id' | 'created_at'>) => {
    const { error } = await supabase.from('moradores').insert(morador);
    if (error) throw new Error(error.message);
    await fetchMoradores();
  };

  const updateMorador = async (id: string, morador: Omit<Morador, 'id' | 'created_at'>) => {
    const { error } = await supabase.from('moradores').update(morador).eq('id', id);
    if (error) throw new Error(error.message);
    await fetchMoradores();
  };

  const deleteMorador = async (id: string) => {
    const { error } = await supabase.from('moradores').delete().eq('id', id);
    if (error) throw new Error(error.message);
    await fetchMoradores();
  };

  return { moradores, loading, error, addMorador, updateMorador, deleteMorador, refetch: fetchMoradores };
}
```

### src/hooks/usePorteiros.ts
```typescript
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Porteiro } from '@/types';

export function usePorteiros() {
  const [porteiros, setPorteiros] = useState<Porteiro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPorteiros = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('porteiros')
      .select('*')
      .order('nome', { ascending: true });

    if (error) {
      setError(error.message);
    } else {
      setPorteiros(data ?? []);
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPorteiros();
  }, [fetchPorteiros]);

  const addPorteiro = async (porteiro: Omit<Porteiro, 'id' | 'created_at'>) => {
    const { error } = await supabase.from('porteiros').insert(porteiro);
    if (error) throw new Error(error.message);
    await fetchPorteiros();
  };

  const updatePorteiro = async (id: string, porteiro: Omit<Porteiro, 'id' | 'created_at'>) => {
    const { error } = await supabase.from('porteiros').update(porteiro).eq('id', id);
    if (error) throw new Error(error.message);
    await fetchPorteiros();
  };

  const deletePorteiro = async (id: string) => {
    const { error } = await supabase.from('porteiros').delete().eq('id', id);
    if (error) throw new Error(error.message);
    await fetchPorteiros();
  };

  return { porteiros, loading, error, addPorteiro, updatePorteiro, deletePorteiro, refetch: fetchPorteiros };
}
```

### src/hooks/useControleAcesso.ts
```typescript
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { AcessoCompleto, StatusAcesso } from '@/types';

export function useControleAcesso() {
  const [acessos, setAcessos] = useState<AcessoCompleto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAcessos = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('controle_acesso')
      .select('*, visitante:visitantes(*), morador:moradores(*), porteiro:porteiros(*)')
      .order('data_hora_solicitacao', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setAcessos((data as unknown as AcessoCompleto[]) ?? []);
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAcessos();
  }, [fetchAcessos]);

  const solicitarAcesso = async (params: {
    moradorId: string;
    nomeVisitante: string;
    documentoVisitante: string;
    telefoneVisitante: string;
    motivoVisita: string;
  }) => {
    const { data: visitante, error: visitanteError } = await supabase
      .from('visitantes')
      .insert({
        nome: params.nomeVisitante,
        documento: params.documentoVisitante,
        telefone: params.telefoneVisitante,
      })
      .select()
      .maybeSingle();

    if (visitanteError) throw new Error(visitanteError.message);
    if (!visitante) throw new Error('Não foi possível registrar o visitante.');

    const { error: acessoError } = await supabase.from('controle_acesso').insert({
      visitante_id: visitante.id,
      morador_id: params.moradorId,
      motivo_visita: params.motivoVisita,
      status: 'aguardando' as StatusAcesso,
    });

    if (acessoError) throw new Error(acessoError.message);
    await fetchAcessos();
  };

  const liberarAcesso = async (id: string, porteiroId: string) => {
    const { error } = await supabase
      .from('controle_acesso')
      .update({ status: 'liberado', porteiro_id: porteiroId })
      .eq('id', id);
    if (error) throw new Error(error.message);
    await fetchAcessos();
  };

  const negarAcesso = async (id: string, porteiroId: string, observacao: string) => {
    const { error } = await supabase
      .from('controle_acesso')
      .update({ status: 'negado', porteiro_id: porteiroId, observacao })
      .eq('id', id);
    if (error) throw new Error(error.message);
    await fetchAcessos();
  };

  const registrarEntrada = async (id: string, porteiroId: string) => {
    const { error } = await supabase
      .from('controle_acesso')
      .update({
        status: 'no_condominio',
        porteiro_id: porteiroId,
        data_hora_entrada: new Date().toISOString(),
      })
      .eq('id', id);
    if (error) throw new Error(error.message);
    await fetchAcessos();
  };

  const registrarSaida = async (id: string) => {
    const { error } = await supabase
      .from('controle_acesso')
      .update({
        status: 'finalizado',
        data_hora_saida: new Date().toISOString(),
      })
      .eq('id', id);
    if (error) throw new Error(error.message);
    await fetchAcessos();
  };

  return {
    acessos,
    loading,
    error,
    solicitarAcesso,
    liberarAcesso,
    negarAcesso,
    registrarEntrada,
    registrarSaida,
    refetch: fetchAcessos,
  };
}
```

### src/components/Sidebar.tsx
```typescript
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
      <header className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-3 md:hidden">
        <div className="flex items-center gap-2 text-white">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500">
            <Building2 size={18} />
          </div>
          <span className="font-semibold truncate max-w-[180px]">{condominioNome}</span>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 hover:text-white"
        >
          <Menu size={22} />
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-slate-900/60 animate-fadeIn" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 bg-slate-900 p-4 animate-slideDown">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500">
                  <Building2 size={18} />
                </div>
                <span className="font-semibold truncate max-w-[160px]">{condominioNome}</span>
              </div>
              <button onClick={() => setOpen(false)} className="rounded-lg p-1.5 text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <NavList current={current} onNavigate={handleNavigate} />
          </div>
        </div>
      )}

      <aside className="hidden md:flex md:w-64 md:flex-col md:shrink-0 bg-slate-900 p-4">
        <div className="mb-8 flex items-center gap-2.5 px-2 pt-2 text-white">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500">
            <Building2 size={20} />
          </div>
          <div className="min-w-0">
            <p className="font-semibold leading-tight truncate">{condominioNome}</p>
            <p className="text-xs text-slate-400">Gestão de Portaria</p>
          </div>
        </div>
        <NavList current={current} onNavigate={handleNavigate} />
      </aside>
    </>
  );
}

function NavList({ current, onNavigate }: { current: Page; onNavigate: (page: Page) => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
        const active = current === key;
        return (
          <button
            key={key}
            onClick={() => onNavigate(key)}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? 'bg-teal-500/15 text-teal-400'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Icon size={18} />
            {label}
          </button>
        );
      })}
    </nav>
  );
}
```

### src/components/Modal.tsx
```typescript
import { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: string;
}

export function Modal({ title, onClose, children, maxWidth = 'max-w-lg' }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />
      <div
        className={`relative w-full ${maxWidth} rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/5 max-h-[90vh] overflow-y-auto animate-scaleIn`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 sticky top-0 bg-white rounded-t-2xl">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
```

### src/components/ConfirmDialog.tsx
```typescript
import { Modal } from '@/components/Modal';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Confirmar',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal title={title} onClose={onCancel} maxWidth="max-w-sm">
      <p className="text-sm text-slate-600">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
```

### src/components/StatCard.tsx
```typescript
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent: 'teal' | 'blue' | 'amber' | 'emerald' | 'slate';
}

const ACCENTS: Record<StatCardProps['accent'], string> = {
  teal: 'bg-teal-50 text-teal-600',
  blue: 'bg-blue-50 text-blue-600',
  amber: 'bg-amber-50 text-amber-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  slate: 'bg-slate-100 text-slate-600',
};

export function StatCard({ label, value, icon: Icon, accent }: StatCardProps) {
  return (
    <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-100 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
      <div className="flex items-center gap-4">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${ACCENTS[accent]}`}>
          <Icon size={20} />
        </div>
        <div>
          <p className="text-2xl font-semibold text-slate-900 leading-tight">{value}</p>
          <p className="text-sm text-slate-500">{label}</p>
        </div>
      </div>
    </div>
  );
}
```

### src/components/StatusBadge.tsx
```typescript
import { Clock, ShieldCheck, DoorOpen, CheckCircle2, XCircle } from 'lucide-react';
import type { StatusAcesso } from '@/types';

const STATUS_CONFIG: Record<
  StatusAcesso,
  { label: string; icon: typeof Clock; className: string }
> = {
  aguardando: {
    label: 'Aguardando liberação',
    icon: Clock,
    className: 'bg-amber-50 text-amber-700 ring-amber-200',
  },
  liberado: {
    label: 'Liberado',
    icon: ShieldCheck,
    className: 'bg-blue-50 text-blue-700 ring-blue-200',
  },
  no_condominio: {
    label: 'No condomínio',
    icon: DoorOpen,
    className: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  },
  finalizado: {
    label: 'Finalizado',
    icon: CheckCircle2,
    className: 'bg-slate-100 text-slate-600 ring-slate-200',
  },
  negado: {
    label: 'Negado',
    icon: XCircle,
    className: 'bg-red-50 text-red-700 ring-red-200',
  },
};

export function StatusBadge({ status }: { status: StatusAcesso }) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${config.className}`}
    >
      <Icon size={13} />
      {config.label}
    </span>
  );
}
```

### src/pages/Dashboard.tsx
```typescript
import { Users, ShieldCheck, DoorOpen, Clock } from 'lucide-react';
import { StatCard } from '@/components/StatCard';
import { StatusBadge } from '@/components/StatusBadge';
import { useMoradores } from '@/hooks/useMoradores';
import { usePorteiros } from '@/hooks/usePorteiros';
import { useControleAcesso } from '@/hooks/useControleAcesso';

function formatDateTime(value: string | null | undefined) {
  if (!value) return '-';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '-';
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function Dashboard() {
  const { moradores, loading: loadingMoradores } = useMoradores();
  const { porteiros, loading: loadingPorteiros } = usePorteiros();
  const { acessos, loading: loadingAcessos } = useControleAcesso();

  const loading = loadingMoradores || loadingPorteiros || loadingAcessos;

  const aguardando = acessos.filter((a) => a.status === 'aguardando').length;
  const noCondominio = acessos.filter((a) => a.status === 'no_condominio').length;
  const hoje = new Date().toDateString();
  const visitantesHoje = acessos.filter((a) => {
    if (!a.data_hora_solicitacao) return false;
    const d = new Date(a.data_hora_solicitacao);
    return !isNaN(d.getTime()) && d.toDateString() === hoje;
  }).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Painel Geral</h1>
        <p className="text-sm text-slate-500 mt-1">Visão geral da portaria em tempo real.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Moradores" value={moradores.length} icon={Users} accent="teal" />
        <StatCard label="Porteiros" value={porteiros.length} icon={ShieldCheck} accent="blue" />
        <StatCard label="No condomínio agora" value={noCondominio} icon={DoorOpen} accent="emerald" />
        <StatCard label="Aguardando liberação" value={aguardando} icon={Clock} accent="amber" />
      </div>

      <div className="rounded-2xl bg-white ring-1 ring-slate-100 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="font-semibold text-slate-900">Atividade Recente</h2>
          <span className="text-xs text-slate-400">{visitantesHoje} visitas solicitadas hoje</span>
        </div>
        <div className="divide-y divide-slate-100">
          {loading && (
            <p className="px-5 py-8 text-center text-sm text-slate-400">Carregando atividade...</p>
          )}
          {!loading && acessos.length === 0 && (
            <p className="px-5 py-8 text-center text-sm text-slate-400">
              Nenhuma solicitação de acesso registrada ainda.
            </p>
          )}
          {!loading &&
            acessos.slice(0, 8).map((acesso) => (
              <div key={acesso.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {acesso.visitante?.nome || 'Visitante'}{' '}
                    <span className="text-slate-400 font-normal">
                      visitando {acesso.morador?.nome || 'Morador'}
                    </span>
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {formatDateTime(acesso.data_hora_solicitacao)} · Bloco {acesso.morador?.bloco || '-'},
                    Apto {acesso.morador?.apartamento || '-'}
                  </p>
                </div>
                <StatusBadge status={acesso.status} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
```

### src/pages/Moradores.tsx
```typescript
import { useState } from 'react';
import { Plus, Pencil, Trash2, Phone, Users as UsersIcon } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useMoradores } from '@/hooks/useMoradores';
import type { Morador } from '@/types';

type FormState = {
  nome: string;
  bloco: string;
  apartamento: string;
  telefone: string;
};

const EMPTY_FORM: FormState = { nome: '', bloco: '', apartamento: '', telefone: '' };

export function Moradores() {
  const { moradores, loading, error, addMorador, updateMorador, deleteMorador } = useMoradores();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Morador | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<Morador | null>(null);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setModalOpen(true);
  };

  const openEdit = (morador: Morador) => {
    setEditing(morador);
    setForm({
      nome: morador.nome,
      bloco: morador.bloco,
      apartamento: morador.apartamento,
      telefone: morador.telefone,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome.trim()) {
      setFormError('Informe o nome do morador.');
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      if (editing) {
        await updateMorador(editing.id, form);
      } else {
        await addMorador(form);
      }
      setModalOpen(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao salvar morador.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await deleteMorador(deleting.id);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Moradores</h1>
          <p className="text-sm text-slate-500 mt-1">Cadastro de moradores do condomínio.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-teal-700"
        >
          <Plus size={16} />
          Novo Morador
        </button>
      </div>

      <div className="rounded-2xl bg-white ring-1 ring-slate-100 shadow-sm overflow-hidden">
        {loading && <p className="px-5 py-8 text-center text-sm text-slate-400">Carregando moradores...</p>}
        {error && <p className="px-5 py-4 text-sm text-red-600">{error}</p>}
        {!loading && moradores.length === 0 && (
          <div className="flex flex-col items-center gap-2 px-5 py-14 text-center">
            <UsersIcon size={28} className="text-slate-300" />
            <p className="text-sm text-slate-400">Nenhum morador cadastrado ainda.</p>
          </div>
        )}
        {!loading && moradores.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-3 font-medium">Nome</th>
                  <th className="px-5 py-3 font-medium">Bloco</th>
                  <th className="px-5 py-3 font-medium">Apartamento</th>
                  <th className="px-5 py-3 font-medium">Telefone</th>
                  <th className="px-5 py-3 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {moradores.map((morador) => (
                  <tr key={morador.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-slate-900">{morador.nome}</td>
                    <td className="px-5 py-3.5 text-slate-600">{morador.bloco || '-'}</td>
                    <td className="px-5 py-3.5 text-slate-600">{morador.apartamento || '-'}</td>
                    <td className="px-5 py-3.5 text-slate-600">
                      {morador.telefone ? (
                        <span className="inline-flex items-center gap-1.5">
                          <Phone size={13} className="text-slate-400" />
                          {morador.telefone}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => openEdit(morador)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-teal-600"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setDeleting(morador)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <Modal title={editing ? 'Editar Morador' : 'Novo Morador'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Nome completo</label>
              <input
                autoFocus
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                placeholder="Ex: Maria Silva"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Bloco</label>
                <input
                  value={form.bloco}
                  onChange={(e) => setForm({ ...form, bloco: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  placeholder="Ex: A"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Apartamento</label>
                <input
                  value={form.apartamento}
                  onChange={(e) => setForm({ ...form, apartamento: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  placeholder="Ex: 302"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Telefone</label>
              <input
                value={form.telefone}
                onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                placeholder="Ex: (11) 98765-4321"
              />
            </div>
            {formError && <p className="text-sm text-red-600">{formError}</p>}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-60"
              >
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {deleting && (
        <ConfirmDialog
          title="Remover Morador"
          message={`Tem certeza que deseja remover ${deleting.nome}? Essa ação não pode ser desfeita.`}
          confirmLabel="Remover"
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
```

### src/pages/Porteiros.tsx
```typescript
import { useState } from 'react';
import { Plus, Pencil, Trash2, ShieldCheck } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { usePorteiros } from '@/hooks/usePorteiros';
import type { Porteiro } from '@/types';

type FormState = { nome: string; turno: string };

const TURNOS = ['Manhã', 'Tarde', 'Noite'];
const EMPTY_FORM: FormState = { nome: '', turno: 'Manhã' };

export function Porteiros() {
  const { porteiros, loading, error, addPorteiro, updatePorteiro, deletePorteiro } = usePorteiros();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Porteiro | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<Porteiro | null>(null);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setModalOpen(true);
  };

  const openEdit = (porteiro: Porteiro) => {
    setEditing(porteiro);
    setForm({ nome: porteiro.nome, turno: porteiro.turno });
    setFormError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome.trim()) {
      setFormError('Informe o nome do porteiro.');
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      if (editing) {
        await updatePorteiro(editing.id, form);
      } else {
        await addPorteiro(form);
      }
      setModalOpen(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao salvar porteiro.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await deletePorteiro(deleting.id);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Porteiros</h1>
          <p className="text-sm text-slate-500 mt-1">Equipe responsável pela portaria.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-teal-700"
        >
          <Plus size={16} />
          Novo Porteiro
        </button>
      </div>

      <div className="rounded-2xl bg-white ring-1 ring-slate-100 shadow-sm overflow-hidden">
        {loading && <p className="px-5 py-8 text-center text-sm text-slate-400">Carregando porteiros...</p>}
        {error && <p className="px-5 py-4 text-sm text-red-600">{error}</p>}
        {!loading && porteiros.length === 0 && (
          <div className="flex flex-col items-center gap-2 px-5 py-14 text-center">
            <ShieldCheck size={28} className="text-slate-300" />
            <p className="text-sm text-slate-400">Nenhum porteiro cadastrado ainda.</p>
          </div>
        )}
        {!loading && porteiros.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
            {porteiros.map((porteiro) => (
              <div
                key={porteiro.id}
                className="group rounded-xl border border-slate-100 p-4 transition-colors hover:border-teal-200 hover:bg-teal-50/30"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600 font-semibold">
                      {porteiro.nome.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{porteiro.nome}</p>
                      <p className="text-xs text-slate-500">Turno: {porteiro.turno}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => openEdit(porteiro)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-teal-600"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setDeleting(porteiro)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-red-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalOpen && (
        <Modal title={editing ? 'Editar Porteiro' : 'Novo Porteiro'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Nome completo</label>
              <input
                autoFocus
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                placeholder="Ex: João Pereira"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Turno</label>
              <select
                value={form.turno}
                onChange={(e) => setForm({ ...form, turno: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              >
                {TURNOS.map((turno) => (
                  <option key={turno} value={turno}>
                    {turno}
                  </option>
                ))}
              </select>
            </div>
            {formError && <p className="text-sm text-red-600">{formError}</p>}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-60"
              >
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {deleting && (
        <ConfirmDialog
          title="Remover Porteiro"
          message={`Tem certeza que deseja remover ${deleting.nome}? Essa ação não pode ser desfeita.`}
          confirmLabel="Remover"
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
```

### src/pages/ControleAcesso.tsx
```typescript
import { useMemo, useState } from 'react';
import {
  Plus,
  DoorOpen,
  ShieldCheck,
  XCircle,
  LogIn,
  LogOut,
  UserRound,
} from 'lucide-react';
import { Modal } from '@/components/Modal';
import { StatusBadge } from '@/components/StatusBadge';
import { useControleAcesso } from '@/hooks/useControleAcesso';
import { useMoradores } from '@/hooks/useMoradores';
import { usePorteiros } from '@/hooks/usePorteiros';
import type { AcessoCompleto, StatusAcesso } from '@/types';

type FiltroStatus = 'todos' | StatusAcesso;

const FILTROS: { key: FiltroStatus; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'aguardando', label: 'Aguardando' },
  { key: 'liberado', label: 'Liberado' },
  { key: 'no_condominio', label: 'No condomínio' },
  { key: 'finalizado', label: 'Finalizado' },
  { key: 'negado', label: 'Negado' },
];

function formatDateTime(value: string | null | undefined) {
  if (!value) return '-';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '-';
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ControleAcesso() {
  const {
    acessos,
    loading,
    error,
    solicitarAcesso,
    liberarAcesso,
    negarAcesso,
    registrarEntrada,
    registrarSaida,
  } = useControleAcesso();
  const { moradores, loading: loadingMoradores } = useMoradores();
  const { porteiros, loading: loadingPorteiros } = usePorteiros();

  const [filtro, setFiltro] = useState<FiltroStatus>('todos');
  const [porteiroServico, setPorteiroServico] = useState('');
  const [solicitarOpen, setSolicitarOpen] = useState(false);
  const [negarTarget, setNegarTarget] = useState<AcessoCompleto | null>(null);
  const [motivoNegacao, setMotivoNegacao] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const listaFiltrada = useMemo(
    () => (filtro === 'todos' ? acessos : acessos.filter((a) => a.status === filtro)),
    [acessos, filtro]
  );

  const runAction = async (id: string, action: () => Promise<void>) => {
    setActionError(null);
    setBusyId(id);
    try {
      await action();
      return true;
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Erro ao processar ação.');
      return false;
    } finally {
      setBusyId(null);
    }
  };

  const handleLiberar = (acesso: AcessoCompleto) => {
    if (!porteiroServico) {
      setActionError('Selecione o porteiro de serviço antes de liberar um acesso.');
      return;
    }
    runAction(acesso.id, () => liberarAcesso(acesso.id, porteiroServico));
  };

  const handleEntrada = (acesso: AcessoCompleto) => {
    if (!porteiroServico) {
      setActionError('Selecione o porteiro de serviço antes de registrar a entrada.');
      return;
    }
    runAction(acesso.id, () => registrarEntrada(acesso.id, porteiroServico));
  };

  const handleSaida = (acesso: AcessoCompleto) => {
    runAction(acesso.id, () => registrarSaida(acesso.id));
  };

  const handleNegar = () => {
    if (!negarTarget) return;
    if (!porteiroServico) {
      setActionError('Selecione o porteiro de serviço antes de negar um acesso.');
      return;
    }
    runAction(negarTarget.id, () => negarAcesso(negarTarget.id, porteiroServico, motivoNegacao)).then(
      () => setNegarTarget(null)
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Controle de Acesso</h1>
          <p className="text-sm text-slate-500 mt-1">Solicitações, liberações e movimentação de visitantes.</p>
        </div>
        <button
          onClick={() => setSolicitarOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-teal-700"
        >
          <Plus size={16} />
          Nova Solicitação
        </button>
      </div>

      <div className="rounded-2xl bg-white ring-1 ring-slate-100 shadow-sm p-4 flex flex-wrap items-center gap-3">
        <UserRound size={16} className="text-slate-400" />
        <label className="text-sm font-medium text-slate-700">Porteiro de serviço:</label>
        <select
          value={porteiroServico}
          onChange={(e) => setPorteiroServico(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
        >
          <option value="">Selecione...</option>
          {porteiros.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nome} ({p.turno})
            </option>
          ))}
        </select>
        {!loadingPorteiros && porteiros.length === 0 && (
          <span className="text-xs text-amber-600">Cadastre um porteiro para liberar ou negar acessos.</span>
        )}
      </div>

      {actionError && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-100">
          {actionError}
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTROS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFiltro(key)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              filtro === key
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {loading && <p className="py-8 text-center text-sm text-slate-400">Carregando registros...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {!loading && listaFiltrada.length === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-2xl bg-white py-14 text-center ring-1 ring-slate-100">
            <DoorOpen size={28} className="text-slate-300" />
            <p className="text-sm text-slate-400">Nenhum registro encontrado para este filtro.</p>
          </div>
        )}
        {!loading &&
          listaFiltrada.map((acesso) => (
            <div key={acesso.id} className="rounded-2xl bg-white p-5 ring-1 ring-slate-100 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2.5">
                    <p className="font-semibold text-slate-900">{acesso.visitante?.nome || 'Visitante'}</p>
                    <StatusBadge status={acesso.status} />
                  </div>
                  <p className="text-sm text-slate-500 mt-1">
                    Visitando <span className="font-medium text-slate-700">{acesso.morador?.nome || 'Morador'}</span> · Bloco{' '}
                    {acesso.morador?.bloco || '-'}, Apto {acesso.morador?.apartamento || '-'}
                  </p>
                  {acesso.motivo_visita && (
                    <p className="text-sm text-slate-500 mt-0.5">Motivo: {acesso.motivo_visita}</p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                    <span>Documento: {acesso.visitante?.documento || '-'}</span>
                    <span>Solicitado: {formatDateTime(acesso.data_hora_solicitacao)}</span>
                    {acesso.data_hora_entrada && <span>Entrada: {formatDateTime(acesso.data_hora_entrada)}</span>}
                    {acesso.data_hora_saida && <span>Saída: {formatDateTime(acesso.data_hora_saida)}</span>}
                    {acesso.porteiro && <span>Porteiro: {acesso.porteiro.nome}</span>}
                  </div>
                  {acesso.status === 'negado' && acesso.observacao && (
                    <p className="mt-2 text-xs text-red-600">Motivo da negativa: {acesso.observacao}</p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {acesso.status === 'aguardando' && (
                    <>
                      <button
                        disabled={busyId === acesso.id}
                        onClick={() => handleLiberar(acesso)}
                        className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                      >
                        <ShieldCheck size={14} />
                        Liberar
                      </button>
                      <button
                        disabled={busyId === acesso.id}
                        onClick={() => setNegarTarget(acesso)}
                        className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 disabled:opacity-60"
                      >
                        <XCircle size={14} />
                        Negar
                      </button>
                    </>
                  )}
                  {acesso.status === 'liberado' && (
                    <>
                      <button
                        disabled={busyId === acesso.id}
                        onClick={() => handleEntrada(acesso)}
                        className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
                      >
                        <LogIn size={14} />
                        Registrar Entrada
                      </button>
                      <button
                        disabled={busyId === acesso.id}
                        onClick={() => setNegarTarget(acesso)}
                        className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 disabled:opacity-60"
                      >
                        <XCircle size={14} />
                        Negar
                      </button>
                    </>
                  )}
                  {acesso.status === 'no_condominio' && (
                    <button
                      disabled={busyId === acesso.id}
                      onClick={() => handleSaida(acesso)}
                      className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-900 disabled:opacity-60"
                    >
                      <LogOut size={14} />
                      Registrar Saída
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>

      {solicitarOpen && (
        <NovaSolicitacaoModal
          moradores={moradores}
          loadingMoradores={loadingMoradores}
          onClose={() => setSolicitarOpen(false)}
          onSubmit={solicitarAcesso}
        />
      )}

      {negarTarget && (
        <Modal title="Negar Acesso" onClose={() => setNegarTarget(null)} maxWidth="max-w-sm">
          <p className="text-sm text-slate-600">
            Informe o motivo para negar o acesso de <strong>{negarTarget.visitante?.nome || 'este visitante'}</strong>.
          </p>
          <textarea
            value={motivoNegacao}
            onChange={(e) => setMotivoNegacao(e.target.value)}
            rows={3}
            className="mt-3 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            placeholder="Ex: Morador não autorizou a visita."
          />
          <div className="mt-4 flex justify-end gap-3">
            <button
              onClick={() => setNegarTarget(null)}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              onClick={handleNegar}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Negar Acesso
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

interface NovaSolicitacaoModalProps {
  moradores: { id: string; nome: string; bloco: string; apartamento: string }[];
  loadingMoradores: boolean;
  onClose: () => void;
  onSubmit: (params: {
    moradorId: string;
    nomeVisitante: string;
    documentoVisitante: string;
    telefoneVisitante: string;
    motivoVisita: string;
  }) => Promise<void>;
}

function NovaSolicitacaoModal({ moradores, loadingMoradores, onClose, onSubmit }: NovaSolicitacaoModalProps) {
  const [moradorId, setMoradorId] = useState('');
  const [nome, setNome] = useState('');
  const [documento, setDocumento] = useState('');
  const [telefone, setTelefone] = useState('');
  const [motivo, setMotivo] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moradorId) {
      setFormError('Selecione o morador que está recebendo a visita.');
      return;
    }
    if (!nome.trim()) {
      setFormError('Informe o nome do visitante.');
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      await onSubmit({
        moradorId,
        nomeVisitante: nome,
        documentoVisitante: documento,
        telefoneVisitante: telefone,
        motivoVisita: motivo,
      });
      onClose();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao registrar solicitação.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="Nova Solicitação de Acesso" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Morador visitado</label>
          <select
            value={moradorId}
            onChange={(e) => setMoradorId(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          >
            <option value="">Selecione o morador...</option>
            {moradores.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nome} - Bloco {m.bloco || '-'}, Apto {m.apartamento || '-'}
              </option>
            ))}
          </select>
          {!loadingMoradores && moradores.length === 0 && (
            <p className="mt-1 text-xs text-amber-600">Cadastre um morador antes de solicitar um acesso.</p>
          )}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Nome do visitante</label>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            placeholder="Ex: Carlos Souza"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Documento</label>
            <input
              value={documento}
              onChange={(e) => setDocumento(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              placeholder="Ex: 123.456.789-00"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Telefone</label>
            <input
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              placeholder="Ex: (11) 91234-5678"
            />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Motivo da visita</label>
          <input
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            placeholder="Ex: Entrega, visita social, prestador de serviço"
          />
        </div>
        {formError && <p className="text-sm text-red-600">{formError}</p>}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-60"
          >
            {saving ? 'Enviando...' : 'Registrar Solicitação'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
```

### src/pages/Configuracoes.tsx
```typescript
import { useState } from 'react';
import { Save, Building2, MapPin, Check } from 'lucide-react';
import { useCondominio } from '@/hooks/useCondominio';

export function Configuracoes() {
  const { condominio, loading, error, updateCondominio } = useCondominio();
  const [nome, setNome] = useState<string | null>(null);
  const [endereco, setEndereco] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const currentNome = nome !== null ? nome : (condominio?.nome ?? '');
  const currentEndereco = endereco !== null ? endereco : (condominio?.endereco ?? '');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!currentNome.trim()) {
      setFormError('Informe o nome do condomínio.');
      return;
    }
    setSaving(true);
    setSaved(false);
    setFormError(null);
    try {
      await updateCondominio(currentNome.trim(), currentEndereco.trim());
      setNome(null);
      setEndereco(null);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Não foi possível salvar as configurações.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="py-8 text-center text-sm text-slate-400">Carregando configurações...</p>;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Configurações</h1>
        <p className="mt-1 text-sm text-slate-500">Personalize as informações exibidas na portaria.</p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
            <Building2 size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">Dados do condomínio</h2>
            <p className="text-sm text-slate-500">Essas informações aparecem no menu principal.</p>
          </div>
        </div>

        {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Nome do condomínio</label>
            <input
              value={currentNome}
              onChange={(event) => setNome(event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              placeholder="Ex: Residencial Jardim das Flores"
            />
          </div>
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700">
              <MapPin size={14} className="text-slate-400" />
              Endereço
            </label>
            <input
              value={currentEndereco}
              onChange={(event) => setEndereco(event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              placeholder="Rua, número, cidade e estado"
            />
          </div>
          {formError && <p className="text-sm text-red-600">{formError}</p>}
          <div className="flex items-center justify-end gap-3 pt-2">
            {saved && (
              <span className="flex items-center gap-1.5 text-sm text-emerald-600">
                <Check size={16} /> Salvo com sucesso
              </span>
            )}
            <button
              type="submit"
              disabled={saving || !condominio}
              className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-60"
            >
              <Save size={16} />
              {saving ? 'Salvando...' : 'Salvar alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

### src/pages/CentralAtendimento.tsx
```typescript
import { useEffect, useRef, useState } from 'react';
import { Headphones, Send, User, AlertCircle, Loader2 } from 'lucide-react';

interface Mensagem {
  role: 'user' | 'assistant';
  content: string;
}

const SUGESTOES = [
  'Quem está no condomínio agora?',
  'Há alguma visita aguardando liberação?',
  'Quantos moradores temos cadastrados?',
  'Quem são os porteiros do turno da noite?',
];

export function CentralAtendimento() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([
    {
      role: 'assistant',
      content:
        'Olá! Seja bem-vindo à Central de Atendimento da Portaria. Posso ajudar com informações sobre moradores, visitantes, controle de acesso e normas do condomínio. Em que posso ajudar?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [mensagens, loading]);

  const enviar = async (texto?: string) => {
    const pergunta = (texto ?? input).trim();
    if (!pergunta || loading) return;

    setError(null);
    const novasMensagens = [...mensagens, { role: 'user' as const, content: pergunta }];
    setMensagens(novasMensagens);
    setInput('');
    setLoading(true);

    try {
      const baseUrl = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/+$/, '');
      if (!baseUrl) {
        throw new Error('Servidor não configurado.');
      }
      const apiUrl = `${baseUrl}/functions/v1/ai-assistant`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || ''}`,
        },
        body: JSON.stringify({ messages: novasMensagens }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error ?? `Erro ${response.status}`);
      }

      const data = await response.json();
      if (!data.reply) throw new Error('Resposta inválida da central.');

      setMensagens((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Não foi possível se comunicar com o atendimento.';
      setError(msg);
      setMensagens((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Desculpe, o serviço de atendimento está temporariamente indisponível. Por favor, tente novamente em instantes.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold text-slate-900">
          <Headphones size={22} className="text-teal-600" />
          Central de Atendimento
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Consulte informações rápidas sobre moradores, visitantes, controle de acesso e atividades do condomínio.
        </p>
      </div>

      <div className="flex h-[calc(100vh-220px)] min-h-[400px] flex-col rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5">
          {mensagens.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  msg.role === 'user'
                    ? 'bg-slate-800 text-white'
                    : 'bg-teal-50 text-teal-600'
                }`}
              >
                {msg.role === 'user' ? <User size={16} /> : <Headphones size={16} />}
              </div>
              <div
                className={`max-w-[75%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-50 text-slate-700 ring-1 ring-slate-100'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                <Headphones size={16} />
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100">
                <Loader2 size={15} className="animate-spin text-slate-400" />
                <span className="text-sm text-slate-400">Consultando dados...</span>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="mx-5 mb-3 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-100">
            <AlertCircle size={15} />
            {error}
          </div>
        )}

        {mensagens.length <= 1 && !loading && (
          <div className="px-5 pb-2">
            <p className="mb-2 text-xs font-medium text-slate-400">Consultas rápidas:</p>
            <div className="flex flex-wrap gap-2">
              {SUGESTOES.map((sug) => (
                <button
                  key={sug}
                  onClick={() => enviar(sug)}
                  className="rounded-full bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200 transition-colors hover:bg-teal-50 hover:text-teal-700 hover:ring-teal-200"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-slate-100 p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              enviar();
            }}
            className="flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua dúvida ou consulta..."
              disabled={loading}
              className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex items-center justify-center rounded-xl bg-teal-600 px-4 py-2.5 text-white transition-colors hover:bg-teal-700 disabled:opacity-60"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
```

### supabase/functions/ai-assistant/index.ts
```typescript
import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({
          error:
            'O serviço de atendimento está temporariamente indisponível.',
        }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const hoje = new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    const agora = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

    const [condominioRes, moradoresRes, porteirosRes, acessosRes] = await Promise.all([
      supabase.from('condominio').select('*').maybeSingle(),
      supabase.from('moradores').select('*'),
      supabase.from('porteiros').select('*'),
      supabase
        .from('controle_acesso')
        .select('*, visitante:visitantes(*), morador:moradores(*), porteiro:porteiros(*)')
        .order('data_hora_solicitacao', { ascending: false })
        .limit(100),
    ]);

    const condominio = condominioRes.data;
    const moradores = moradoresRes.data ?? [];
    const porteiros = porteirosRes.data ?? [];
    const acessos = acessosRes.data ?? [];

    const noCondominio = acessos.filter((a: any) => a.status === 'no_condominio');
    const aguardando = acessos.filter((a: any) => a.status === 'aguardando');
    const finalizadosHoje = acessos.filter(
      (a: any) => new Date(a.data_hora_solicitacao).toLocaleDateString('pt-BR') === hoje
    );

    const contextData = {
      condominio: condominio
        ? { nome: condominio.nome, endereco: condominio.endereco }
        : null,
      dataHoraAtual: agora,
      resumo: {
        totalMoradores: moradores.length,
        totalPorteiros: porteiros.length,
        visitantesNoCondominio: noCondominio.length,
        aguardandoLiberacao: aguardando.length,
        visitasHoje: finalizadosHoje.length,
      },
      moradores: moradores.map((m: any) => ({
        nome: m.nome,
        bloco: m.bloco,
        apartamento: m.apartamento,
        telefone: m.telefone,
      })),
      porteiros: porteiros.map((p: any) => ({ nome: p.nome, turno: p.turno })),
      visitantesNoCondominio: noCondominio.map((a: any) => ({
        visitante: a.visitante?.nome,
        visitando: a.morador?.nome,
        bloco: a.morador?.bloco,
        apartamento: a.morador?.apartamento,
        motivo: a.motivo_visita,
        entrada: a.data_hora_entrada,
      })),
      aguardandoLiberacao: aguardando.map((a: any) => ({
        visitante: a.visitante?.nome,
        visitando: a.morador?.nome,
        motivo: a.motivo_visita,
        solicitadoEm: a.data_hora_solicitacao,
      })),
    };

    const systemPrompt = `Você é o operador da Central de Atendimento da Portaria do condomínio. Você ajuda porteiros e administradores a consultar informações sobre moradores, visitantes, controle de acesso e rotinas da portaria.

IMPORTANTE:
- NUNCA mencione que você é uma inteligência artificial, IA, robô, modelo de linguagem ou bot.
- Apresente-se e responda sempre como a equipe / Central de Atendimento da Portaria.
- Responda em português brasileiro com tom profissional, cordial, solícito e humano.
- Seja conciso e direto. Use listas organizadas quando apropriado.
- Você tem acesso aos dados em tempo real do condomínio (fornecidos abaixo). Use esses dados para responder com precisão. Se não encontrar uma informação, responda cordialmente que o registro não consta no sistema.
- Quando perguntarem sobre quem está no condomínio, liste os visitantes atualmente presentes.
- Quando perguntarem sobre aguardando liberação, liste as solicitações pendentes.
- Para perguntas sobre moradores, consulte os dados disponíveis.
- Não invente dados fora do contexto fornecido.
- Se perguntarem algo fora do escopo da portaria, responda educadamente sugerindo o contato com a administração.

DADOS DO CONDOMÍNIO (em tempo real):
${JSON.stringify(contextData, null, 2)}`;

    const body = await req.json();
    const messages: ChatMessage[] = body.messages ?? [];

    if (!messages.length) {
      return new Response(
        JSON.stringify({ error: 'Nenhuma mensagem fornecida.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
        temperature: 0.7,
        max_tokens: 600,
      }),
    });

    if (!openaiResponse.ok) {
      const errText = await openaiResponse.text();
      console.error('Service error:', errText);
      return new Response(
        JSON.stringify({ error: 'Falha ao consultar a central de atendimento.' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const openaiData = await openaiResponse.json();
    const reply = openaiData.choices?.[0]?.message?.content ?? 'Sem resposta.';

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Edge function error:', err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Erro interno do servidor.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

### supabase/migrations/20260819225240_create_portaria_schema.sql
```sql
/*
# Sistema de Gestão de Portaria - Esquema Inicial

## Resumo
Cria toda a base de dados para o aplicativo de gestão de portaria de condomínio,
cobrindo condomínio, moradores, porteiros, visitantes e o controle de acesso
(entradas e saídas). Este é um sistema de uso interno do condomínio, sem login
individual, então todas as tabelas ficam acessíveis à aplicação (chave anônima).

## Novas Tabelas

1. `condominio`
   - `id` (uuid, chave primária)
   - `nome` (texto) - nome do condomínio
   - `endereco` (texto) - endereço do condomínio
   - `created_at`, `updated_at` (timestamps)

2. `moradores`
   - `id` (uuid, chave primária)
   - `nome` (texto) - nome do morador
   - `bloco` (texto) - bloco/torre
   - `apartamento` (texto) - número do apartamento
   - `telefone` (texto, opcional)
   - `created_at` (timestamp)

3. `porteiros`
   - `id` (uuid, chave primária)
   - `nome` (texto) - nome do porteiro
   - `turno` (texto) - turno de trabalho (Manhã, Tarde, Noite)
   - `created_at` (timestamp)

4. `visitantes`
   - `id` (uuid, chave primária)
   - `nome` (texto) - nome do visitante
   - `documento` (texto) - documento de identificação
   - `telefone` (texto, opcional)
   - `created_at` (timestamp)

5. `controle_acesso`
   - `id` (uuid, chave primária)
   - `visitante_id` (uuid, referencia visitantes)
   - `morador_id` (uuid, referencia moradores) - quem está sendo visitado
   - `porteiro_id` (uuid, opcional, referencia porteiros) - quem validou o acesso
   - `status` (texto) - aguardando | liberado | no_condominio | finalizado | negado
   - `motivo_visita` (texto, opcional)
   - `data_hora_solicitacao` (timestamp)
   - `data_hora_entrada` (timestamp, opcional)
   - `data_hora_saida` (timestamp, opcional)
   - `observacao` (texto, opcional)

## Segurança
- RLS habilitado em todas as tabelas.
- Como o app não possui login (uso interno da portaria), as políticas liberam
  leitura e escrita para os papéis `anon` e `authenticated`, mantendo o RLS
  ativo (e não desabilitado) para controle futuro.

## Notas
- `controle_acesso.status` guia todo o fluxo: solicitação do morador ->
  liberação da portaria -> registro de entrada -> registro de saída.
*/

CREATE TABLE IF NOT EXISTS condominio (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL DEFAULT 'Meu Condomínio',
  endereco text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS moradores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  bloco text NOT NULL DEFAULT '',
  apartamento text NOT NULL DEFAULT '',
  telefone text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS porteiros (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  turno text NOT NULL DEFAULT 'Manhã',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS visitantes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  documento text NOT NULL DEFAULT '',
  telefone text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS controle_acesso (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitante_id uuid NOT NULL REFERENCES visitantes(id) ON DELETE CASCADE,
  morador_id uuid NOT NULL REFERENCES moradores(id) ON DELETE CASCADE,
  porteiro_id uuid REFERENCES porteiros(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'aguardando' CHECK (status IN ('aguardando', 'liberado', 'no_condominio', 'finalizado', 'negado')),
  motivo_visita text NOT NULL DEFAULT '',
  data_hora_solicitacao timestamptz DEFAULT now(),
  data_hora_entrada timestamptz,
  data_hora_saida timestamptz,
  observacao text NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_controle_acesso_status ON controle_acesso(status);
CREATE INDEX IF NOT EXISTS idx_controle_acesso_morador ON controle_acesso(morador_id);
CREATE INDEX IF NOT EXISTS idx_controle_acesso_visitante ON controle_acesso(visitante_id);

ALTER TABLE condominio ENABLE ROW LEVEL SECURITY;
ALTER TABLE moradores ENABLE ROW LEVEL SECURITY;
ALTER TABLE porteiros ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE controle_acesso ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_condominio" ON condominio;
CREATE POLICY "select_condominio" ON condominio FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "insert_condominio" ON condominio;
CREATE POLICY "insert_condominio" ON condominio FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "update_condominio" ON condominio;
CREATE POLICY "update_condominio" ON condominio FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "delete_condominio" ON condominio;
CREATE POLICY "delete_condominio" ON condominio FOR DELETE TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "select_moradores" ON moradores;
CREATE POLICY "select_moradores" ON moradores FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "insert_moradores" ON moradores;
CREATE POLICY "insert_moradores" ON moradores FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "update_moradores" ON moradores;
CREATE POLICY "update_moradores" ON moradores FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "delete_moradores" ON moradores;
CREATE POLICY "delete_moradores" ON moradores FOR DELETE TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "select_porteiros" ON porteiros;
CREATE POLICY "select_porteiros" ON porteiros FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "insert_porteiros" ON porteiros;
CREATE POLICY "insert_porteiros" ON porteiros FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "update_porteiros" ON porteiros;
CREATE POLICY "update_porteiros" ON porteiros FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "delete_porteiros" ON porteiros;
CREATE POLICY "delete_porteiros" ON porteiros FOR DELETE TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "select_visitantes" ON visitantes;
CREATE POLICY "select_visitantes" ON visitantes FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "insert_visitantes" ON visitantes;
CREATE POLICY "insert_visitantes" ON visitantes FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "update_visitantes" ON visitantes;
CREATE POLICY "update_visitantes" ON visitantes FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "delete_visitantes" ON visitantes;
CREATE POLICY "delete_visitantes" ON visitantes FOR DELETE TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "select_controle_acesso" ON controle_acesso;
CREATE POLICY "select_controle_acesso" ON controle_acesso FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "insert_controle_acesso" ON controle_acesso;
CREATE POLICY "insert_controle_acesso" ON controle_acesso FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "update_controle_acesso" ON controle_acesso;
CREATE POLICY "update_controle_acesso" ON controle_acesso FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "delete_controle_acesso" ON controle_acesso;
CREATE POLICY "delete_controle_acesso" ON controle_acesso FOR DELETE TO anon, authenticated USING (true);

INSERT INTO condominio (nome, endereco)
SELECT 'Residencial Jardim das Flores', 'Rua das Acácias, 123 - São Paulo, SP'
WHERE NOT EXISTS (SELECT 1 FROM condominio);
```

