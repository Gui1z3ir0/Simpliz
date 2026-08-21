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
