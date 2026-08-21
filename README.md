# 🏢 Simpliz — Sistema de Gestão de Portaria & Controle de Acesso com IA

> **Simpliz** é uma plataforma moderna e inteligente desenvolvida para controle de acesso, gestão de guarita e assistência operacional com Inteligência Artificial para condomínios residenciais e comerciais.

---

## 🌟 Funcionalidades Principais

1. **📊 Painel Geral (Dashboard)**:
   - Monitoramento em tempo real de visitantes no condomínio, solicitações pendentes e equipe de plantão.
   - **Diagnóstico & Insights da IA**: Análise preditiva do fluxo de guarita e segurança predial.
   - **Guia Visual de 4 Etapas do Fluxo de Portaria** (*Solicitação → Autorização → Entrada com Carimbo → Saída*).
   - Feed de atividades recentes atualizado instantaneamente.

2. **🚪 Controle de Acesso & Portaria**:
   - Filtros dinâmicos com contadores (`Aguardando`, `Liberados`, `No Condomínio`, `Finalizados`, `Negados`).
   - Seleção e assinatura do **Porteiro de Plantão** para auditoria.
   - Registro de recusa com justificativa.
   - **💬 Notificação Direta via WhatsApp**: Botão de 1 clique que gera a mensagem pré-formatada para o morador autorizar a visita.

3. **🤖 Assistente IA da Portaria (PortariaGPT)**:
   - Assistente cognitivo com processamento em tempo real e acesso aos dados do condomínio.
   - Consultas de segurança (*"Quem está no condomínio agora?"*, *"Há visitas aguardando liberação?"*).
   - Regras do condomínio (horário de silêncio, normas de mudanças e obras).
   - Protocolo de encomendas e procedimentos de emergência (Polícia, Bombeiros, SAMU).

4. **👥 Gestão de Moradores**:
   - Cadastro completo de moradores por Bloco e Apartamento.
   - Busca em tempo real por nome, unidade ou telefone.
   - Acesso rápido ao contato do morador via WhatsApp.

5. **🛡️ Gestão de Porteiros & Escalas**:
   - Cadastro da equipe de segurança e controle de turnos (*Manhã*, *Tarde*, *Noite*, *12x36 Diurno*, *12x36 Noturno*).

6. **⚡ Modo Apresentação Acadêmica (Configurações)**:
   - Botão **"Carregar Dados de Exemplo"** que popula moradores, porteiros e acessos realistas com 1 clique para demonstrações e bancas de faculdade.
   - **Ficha Técnica & Arquitetura de Software** documentada na interface.

---

## 🛠️ Pilha Tecnológica

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons
- **Backend / Database**: PostgreSQL via Supabase com Row Level Security (RLS)
- **IA**: Motor cognitivo local e integrado aos dados do condomínio

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- Node.js instalado (versão 18+)

### 1. Clonar o Repositório
```bash
git clone https://github.com/SEU_USUARIO/simpliz.git
cd simpliz
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Configurar Variáveis de Ambiente
Crie um arquivo `.env` baseado no `.env.example`:
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
```

### 4. Iniciar o Servidor de Desenvolvimento
```bash
npm run dev
```

Acesse no navegador: **`http://localhost:5173`**

---

## 📄 Licença
Desenvolvido para fins acadêmicos e demonstrações práticas.
