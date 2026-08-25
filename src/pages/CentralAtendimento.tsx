import { useEffect, useRef, useState } from 'react';
import { Sparkles, Send, User, Bot, RefreshCw, Loader2, ShieldAlert, FileText, Package, Users, Building, ShieldCheck, DoorOpen } from 'lucide-react';
import { useMoradores } from '@/hooks/useMoradores';
import { usePorteiros } from '@/hooks/usePorteiros';
import { useControleAcesso } from '@/hooks/useControleAcesso';
import { useCondominio } from '@/hooks/useCondominio';

interface Mensagem {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

const CATEGORIAS_SUGESTOES = [
  { icon: DoorOpen, label: 'Quem está no condomínio agora?' },
  { icon: ShieldAlert, label: 'Há visitas aguardando liberação?' },
  { icon: Users, label: 'Quantos moradores temos cadastrados?' },
  { icon: ShieldCheck, label: 'Quem são os porteiros da escala?' },
  { icon: FileText, label: 'Quais são as regras de mudança e barulho?' },
  { icon: Package, label: 'Como funciona a entrega de encomendas e Sedex?' },
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
        'Olá! Sou o Assistente de Inteligência Artificial do Simpliz. Tenho acesso aos registros em tempo real do condomínio e posso ajudar você a consultar moradores, validar acessos pendentes, verificar turnos da portaria e orientar sobre procedimentos de segurança. Como posso auxiliar?',
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
    const liberados = acessos.filter((a) => a.status === 'liberado');

    if (p.includes('quem está') || p.includes('no condomínio') || p.includes('presente') || p.includes('circulando')) {
      if (noCondominio.length === 0) {
        return 'No momento, não há nenhum visitante externo registrado dentro do condomínio.';
      }
      const lista = noCondominio
        .map(
          (a) =>
            `• ${a.visitante?.nome || 'Visitante'} (Doc: ${a.visitante?.documento || '-'}) visitando ${a.morador?.nome || 'Morador'} — Bloco ${a.morador?.bloco || '-'}, Apto ${a.morador?.apartamento || '-'}`
        )
        .join('\n');
      return `Atualmente temos ${noCondominio.length} visitante(s) presente(s) no condomínio:\n\n${lista}`;
    }

    if (p.includes('aguardando') || p.includes('liberação') || p.includes('pendente') || p.includes('fila')) {
      if (aguardando.length === 0) {
        return 'Excelente! Não há nenhuma solicitação de acesso aguardando liberação no momento. A fila de guarita está limpa.';
      }
      const lista = aguardando
        .map(
          (a) =>
            `• ${a.visitante?.nome || 'Visitante'} aguardando autorização para ${a.morador?.nome || 'Morador'} (Bloco ${a.morador?.bloco || '-'}, Apto ${a.morador?.apartamento || '-'})`
        )
        .join('\n');
      return `Há ${aguardando.length} solicitação(ões) pendente(s) de liberação na portaria:\n\n${lista}`;
    }

    if (p.includes('morador') || p.includes('quantos moradores') || p.includes('residentes')) {
      if (moradores.length === 0) {
        return 'Ainda não há moradores cadastrados no sistema. Acesse a aba "Moradores" para adicionar as unidades.';
      }
      const blocos = Array.from(new Set(moradores.map((m) => m.bloco).filter(Boolean)));
      return `O ${condominio?.nome || 'condomínio'} possui atualmente ${moradores.length} morador(es) cadastrado(s) distribuídos em ${blocos.length || 1} bloco(s)/torre(s). Você pode pesquisar contatos e detalhes na aba de Moradores.`;
    }

    if (p.includes('porteiro') || p.includes('escala') || p.includes('plantão') || p.includes('equipe')) {
      if (porteiros.length === 0) {
        return 'Não há porteiros cadastrados na equipe ainda. Acesse a aba "Equipe de Portaria" para cadastrar os profissionais.';
      }
      const lista = porteiros.map((pr) => `• ${pr.nome} — Turno: ${pr.turno}`).join('\n');
      return `A equipe de portaria conta com ${porteiros.length} profissional(is) registrado(s):\n\n${lista}`;
    }

    if (p.includes('encomenda') || p.includes('sedex') || p.includes('entrega') || p.includes('pacote')) {
      return `Procedimento para Encomendas e Entregas:\n1. O entregador deve ser identificado na guarita com nome e documento.\n2. O porteiro registra a solicitação vinculada ao apartamento de destino.\n3. O morador é notificado para retirar na portaria ou autorizar a subida do entregador mediante protocolo.`;
    }

    if (p.includes('barulho') || p.includes('mudança') || p.includes('regra') || p.includes('horário')) {
      return `Diretrizes do Regulamento Interno:\n• Horário de Silêncio: das 22h às 08h.\n• Mudanças e Obras: permitidas de segunda a sexta, das 08h às 17h, e aos sábados das 08h às 12h, mediante agendamento prévio com a administração.\n• Uso de Áreas Comuns: reservas realizadas através da administração predial.`;
    }

    return `Com base nos registros atuais do ${condominio?.nome || 'condomínio'}:\n• Sistema operacional com ${moradores.length} moradores cadastrados, ${porteiros.length} porteiros na equipe e ${noCondominio.length} visitante(s) presente(s).\n\nCaso queira consultar dados de um morador ou visitante específico, informe o nome ou o apartamento!`;
  };

  const enviar = async (texto?: string) => {
    const pergunta = (texto ?? input).trim();
    if (!pergunta || loading) return;

    const novasMensagens = [...mensagens, { role: 'user' as const, content: pergunta }];
    setMensagens(novasMensagens);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      const respostaLocal = gerarRespostaLocal(pergunta);
      setMensagens((prev) => [...prev, { role: 'assistant', content: respostaLocal }]);
      setLoading(false);
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl shadow-xs ring-1 ring-slate-200/80">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 shadow-md shadow-teal-500/20 font-bold">
              <Bot size={20} />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-display">
              Simpliz AI — Assistente de Portaria
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-teal-500/15 to-emerald-500/15 px-3 py-1 text-xs font-semibold text-teal-700 ring-1 ring-teal-500/30">
              <Sparkles size={12} className="text-teal-600 animate-pulse" />
              IA Cognitiva Conectada
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Inteligência Artificial contextualizada com os dados em tempo real da unidade e diretrizes operacionais.
          </p>
        </div>

        <button
          onClick={limparConversa}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 shadow-xs transition-colors self-start sm:self-auto"
          title="Reiniciar conversa com a IA"
        >
          <RefreshCw size={14} />
          <span>Nova Conversa</span>
        </button>
      </div>

      {/* Chat Container */}
      <div className="flex h-[480px] sm:h-[540px] lg:h-[600px] flex-col rounded-3xl bg-white shadow-xs ring-1 ring-slate-200/80 overflow-hidden">
        {/* Messages Feed */}
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5 sm:p-6">
          {mensagens.map((msg, i) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={i}
                className={`flex gap-3.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl shadow-xs ${
                    isUser
                      ? 'bg-slate-900 text-white'
                      : 'bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 font-bold ring-1 ring-teal-300'
                  }`}
                >
                  {isUser ? <User size={18} /> : <Bot size={20} />}
                </div>

                <div
                  className={`max-w-[85%] sm:max-w-[75%] whitespace-pre-wrap rounded-3xl px-5 py-3.5 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                    isUser
                      ? 'bg-slate-900 text-white rounded-tr-xs'
                      : 'bg-slate-50 text-slate-800 ring-1 ring-slate-200/70 rounded-tl-xs'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3.5 animate-fadeIn">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 shadow-xs">
                <Bot size={20} />
              </div>
              <div className="flex items-center gap-2.5 rounded-3xl rounded-tl-xs bg-slate-50 px-5 py-3.5 ring-1 ring-slate-200/70">
                <Loader2 size={16} className="animate-spin text-teal-600" />
                <span className="text-xs sm:text-sm text-slate-600 font-medium">
                  Simpliz IA consultando registros do condomínio...
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        {mensagens.length <= 2 && !loading && (
          <div className="px-5 sm:px-6 pb-3.5 pt-3 border-t border-slate-100 bg-slate-50/40">
            <p className="mb-2 text-xs font-bold text-slate-600 flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles size={13} className="text-teal-600" />
              Perguntas Frequentes Sugeridas:
            </p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIAS_SUGESTOES.map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  onClick={() => enviar(label)}
                  className="flex items-center gap-2 rounded-xl bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/80 shadow-2xs transition-all hover:bg-teal-50 hover:text-teal-800 hover:ring-teal-300 active:scale-95 text-left"
                >
                  <Icon size={13} className="text-teal-600 shrink-0" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Input Form */}
        <div className="border-t border-slate-200/80 p-4 sm:p-5 bg-white">
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
              placeholder="Digite sua dúvida sobre moradores, visitantes ou procedimentos da portaria..."
              disabled={loading}
              className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-xs sm:text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 disabled:opacity-60 bg-slate-50/60"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex items-center justify-center gap-2 rounded-2xl bg-teal-600 px-5 sm:px-6 py-3 text-xs sm:text-sm font-semibold text-white transition-all hover:bg-teal-700 disabled:opacity-50 shadow-sm active:scale-95 shrink-0"
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

