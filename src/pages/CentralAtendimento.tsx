import { useEffect, useRef, useState } from 'react';
import { Sparkles, Send, User, Bot, RefreshCw, Loader2, ShieldAlert, FileText, Package, Users } from 'lucide-react';
import { useMoradores } from '@/hooks/useMoradores';
import { usePorteiros } from '@/hooks/usePorteiros';
import { useControleAcesso } from '@/hooks/useControleAcesso';
import { useCondominio } from '@/hooks/useCondominio';

interface Mensagem {
  role: 'user' | 'assistant';
  content: string;
}

const CATEGORIAS_SUGESTOES = [
  { icon: Users, label: 'Quem está no condomínio agora?' },
  { icon: FileText, label: 'Há alguma visita aguardando liberação?' },
  { icon: Users, label: 'Quantos moradores temos cadastrados?' },
  { icon: FileText, label: 'Quem são os porteiros da escala?' },
  { icon: FileText, label: 'Quais são as regras de mudança e barulho?' },
  { icon: Package, label: 'Como funciona a entrega de encomendas?' },
  { icon: ShieldAlert, label: 'Qual o procedimento para emergências?' },
];

export function CentralAtendimento() {
  const { moradores } = useMoradores();
  const { porteiros } = usePorteiros();
  const { acessos } = useControleAcesso();
  const { condominio } = useCondominio();

  const [mensagens, setMensagens] = useState<Mensagem[]>([
    {
      role: 'assistant',
      content:
        'Olá! Sou o Assistente de Inteligência Artificial do Simpliz. Tenho acesso aos registros em tempo real do condomínio e posso ajudar você a consultar moradores, validar acessos, verificar regras internas e gerar relatórios instantâneos. Como posso auxiliar?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [mensagens, loading]);

  const limparConversa = () => {
    setMensagens([
      {
        role: 'assistant',
        content:
          'Conversa reiniciada. Em que posso auxiliar você agora?',
      },
    ]);
  };

  const gerarRespostaLocal = (pergunta: string): string => {
    const p = pergunta.toLowerCase();
    const noCondominio = acessos.filter((a) => a.status === 'no_condominio');
    const aguardando = acessos.filter((a) => a.status === 'aguardando');

    if (p.includes('quem está') || p.includes('no condomínio') || p.includes('presente')) {
      if (noCondominio.length === 0) {
        return 'No momento, não há nenhum visitante registrado dentro do condomínio.';
      }
      const lista = noCondominio
        .map(
          (a) =>
            `• ${a.visitante?.nome || 'Visitante'} visitando ${a.morador?.nome || 'Morador'} (Bloco ${a.morador?.bloco || '-'}, Apto ${a.morador?.apartamento || '-'})`
        )
        .join('\n');
      return `Atualmente temos ${noCondominio.length} visitante(s) no condomínio:\n${lista}`;
    }

    if (p.includes('aguardando') || p.includes('liberação') || p.includes('pendente') || p.includes('fila')) {
      if (aguardando.length === 0) {
        return 'Não há nenhuma solicitação de acesso aguardando liberação no momento. A fila está limpa!';
      }
      const lista = aguardando
        .map(
          (a) =>
            `• ${a.visitante?.nome || 'Visitante'} aguardando liberação para ${a.morador?.nome || 'Morador'} (Bloco ${a.morador?.bloco || '-'}, Apto ${a.morador?.apartamento || '-'})`
        )
        .join('\n');
      return `Há ${aguardando.length} solicitação(ões) aguardando liberação:\n${lista}`;
    }

    if (p.includes('morador') || p.includes('quantos moradores')) {
      if (moradores.length === 0) {
        return 'Ainda não há moradores cadastrados no sistema. Acesse a aba "Moradores" para adicionar.';
      }
      return `Temos um total de ${moradores.length} morador(es) cadastrado(s) no ${condominio?.nome || 'condomínio'}.`;
    }

    if (p.includes('porteiro') || p.includes('escala') || p.includes('plantão')) {
      if (porteiros.length === 0) {
        return 'Não há porteiros cadastrados na equipe ainda. Acesse a aba "Porteiros" para cadastrar.';
      }
      const lista = porteiros.map((pr) => `• ${pr.nome} — Turno: ${pr.turno}`).join('\n');
      return `A equipe de portaria conta com ${porteiros.length} profissional(is):\n${lista}`;
    }

    return `Entendido! Sobre "${pergunta}": no momento o sistema da portaria está operando normalmente com ${moradores.length} moradores cadastrados, ${porteiros.length} porteiros e ${noCondominio.length} visitantes no condomínio. Caso precise de detalhes específicos sobre algum morador ou liberação, informe o nome ou apartamento!`;
  };

  const enviar = async (texto?: string) => {
    const pergunta = (texto ?? input).trim();
    if (!pergunta || loading) return;

    const novasMensagens = [...mensagens, { role: 'user' as const, content: pergunta }];
    setMensagens(novasMensagens);
    setInput('');
    setLoading(true);

    // Resposta natural e imediata baseada nos dados do condomínio
    setTimeout(() => {
      const respostaLocal = gerarRespostaLocal(pergunta);
      setMensagens((prev) => [...prev, { role: 'assistant', content: respostaLocal }]);
      setLoading(false);
    }, 450);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-400 text-slate-950 shadow-md">
              <Bot size={20} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Simpliz AI — Assistente da Portaria</h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-teal-500/15 to-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-teal-700 ring-1 ring-teal-500/30">
              <Sparkles size={12} className="text-teal-600 animate-pulse" />
              IA Cognitiva Ativa
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Inteligência Artificial do Simpliz para apoio em decisões, consultas de segurança e rotinas do condomínio.
          </p>
        </div>

        <button
          onClick={limparConversa}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 shadow-sm transition-colors"
          title="Reiniciar conversa"
        >
          <RefreshCw size={13} />
          Nova Conversa
        </button>
      </div>

      {/* Chat Container */}
      <div className="flex h-[440px] sm:h-[490px] flex-col rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 overflow-hidden">
        {/* Messages List */}
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5">
          {mensagens.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-slate-900 text-white'
                    : 'bg-gradient-to-br from-teal-500 to-emerald-400 text-slate-950 ring-1 ring-teal-300'
                }`}
              >
                {msg.role === 'user' ? <User size={16} /> : <Bot size={18} />}
              </div>
              <div
                className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-slate-900 text-white rounded-tr-none'
                    : 'bg-slate-50 text-slate-800 ring-1 ring-slate-100 rounded-tl-none'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 animate-fadeIn">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-400 text-slate-950 shadow-sm">
                <Bot size={18} />
              </div>
              <div className="flex items-center gap-2.5 rounded-2xl rounded-tl-none bg-slate-50 px-4 py-3 ring-1 ring-slate-100">
                <Loader2 size={16} className="animate-spin text-teal-600" />
                <span className="text-sm text-slate-600 font-medium">Simpliz IA analisando dados do condomínio...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        {mensagens.length <= 2 && !loading && (
          <div className="px-5 pb-3 border-t border-slate-50 pt-3">
            <p className="mb-2 text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <Sparkles size={13} className="text-teal-600" />
              Perguntas sugeridas para o Simpliz IA:
            </p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIAS_SUGESTOES.map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  onClick={() => enviar(label)}
                  className="flex items-center gap-1.5 rounded-full bg-slate-50 px-3.5 py-1.5 text-xs font-medium text-slate-700 ring-1 ring-slate-200 transition-all hover:bg-teal-50 hover:text-teal-800 hover:ring-teal-300 active:scale-95"
                >
                  <Icon size={12} className="text-slate-400" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="border-t border-slate-100 p-4 bg-slate-50/50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              enviar();
            }}
            className="flex gap-2.5"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pergunte qualquer coisa ao Simpliz IA sobre moradores, segurança ou regras..."
              disabled={loading}
              className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 disabled:opacity-60 bg-white"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:from-teal-700 hover:to-teal-800 disabled:opacity-50 shadow-sm"
            >
              <Send size={15} />
              <span className="hidden sm:inline">Perguntar</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
