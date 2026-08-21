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
