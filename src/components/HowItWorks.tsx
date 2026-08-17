import React, { useState } from 'react';
import { 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  ArrowRight, 
  GraduationCap, 
  MessageCircle, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  DollarSign, 
  ChevronDown,
  ChevronUp,
  FileCheck,
  Users,
  BookOpen
} from 'lucide-react';
import { SK_ADMIN_INFO } from '../data/tutorsData';
import { SkLogo } from './SkLogo';

interface HowItWorksProps {
  onStartRequest: () => void;
}

const FAQS = [
  {
    q: 'Como é feito o pagamento da sessão de tutoria?',
    a: 'O pagamento é combinado diretamente com o tutor ou coordenação SK após a confirmação da disponibilidade. Pode ser efetuado via transferência bancária, Multicaixa Express ou em numerário no campus do ISAF no início da sessão presencial.'
  },
  {
    q: 'Onde decorrem as explicações presenciais?',
    a: 'As sessões presenciais decorrem nas salas de estudo, biblioteca ou áreas de convivência académica do Campus do ISAF (Luanda), em horários compatíveis entre o estudante e o tutor.'
  },
  {
    q: 'Posso solicitar tutoria em grupo para dividir a proposta de valor?',
    a: 'Sim! Grupos de estudo de até 3 colegas da mesma turma podem submeter a requisição e partilhar a proposta de valor definida (2.000 Kz a 10.000 Kz), tornando o apoio ainda mais económico.'
  },
  {
    q: 'Qual o tempo médio de resposta da equipa SK?',
    a: 'Para solicitações normais, o match ocorre em menos de 2 a 4 horas. Para pedidos marcados como "Urgente" ou "Imediato", a nossa equipa de coordenação prioriza o contacto no WhatsApp em poucos minutos.'
  },
  {
    q: 'A plataforma cobre preparação para exames de recurso e trabalhos de fim de curso (TFC)?',
    a: 'Com certeza! Temos tutores dedicados especificamente à orientação metodológica e prática de Monografias/TFC e resolução intensiva de exames de anos anteriores do ISAF.'
  }
];

export const HowItWorks: React.FC<HowItWorksProps> = ({ onStartRequest }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const steps = [
    {
      step: '01',
      title: 'Selecione a sua Matéria no ISAF',
      desc: 'Filtre por Curso (Contabilidade, Banca ou Informática), Ano Curricular (1º ao 4º) e Semestre para encontrar exatamente a sua disciplina.',
      icon: BookOpen,
    },
    {
      step: '02',
      title: 'Descreva a Dúvida & Proponha o Valor',
      desc: 'Explique se precisa de apoio para exames, fichas práticas ou conceitos teóricos. Ajuste a proposta entre 2.000 Kz e 10.000 Kz.',
      icon: DollarSign,
    },
    {
      step: '03',
      title: 'Match com o Tutor Especialista SK',
      desc: 'O sistema gera um código de rastreio e você pode encaminhar os detalhes formatados para o WhatsApp da coordenação SK.',
      icon: MessageCircle,
    },
    {
      step: '04',
      title: 'Sessão no Campus ou Online',
      desc: 'Realize a sua explicação presencial no Campus do ISAF ou via Google Meet com material e resolução prática de exercícios.',
      icon: GraduationCap,
    },
  ];

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 py-6 sm:py-8 space-y-12">
      
      {/* Hero */}
      <div className="text-center max-w-4xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-100 text-[#0F2042] border border-slate-200 text-xs font-semibold">
          <SkLogo size="xs" shape="circle" border={false} />
          <span>Metodologia & Transparência da Sharing Knowledge (SK)</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
          Como Funciona o Apoio da <span className="text-[#0F2042]">Sharing Knowledge (SK)</span>
        </h1>

        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
          Criada por estudantes para estudantes do <strong>ISAF</strong>, a rede Sharing Knowledge (Grupo SK) simplifica o acesso a explicações personalizadas com foco em aprovação e excelência académica.
        </p>
      </div>

      {/* 4 Step Process */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-slate-300 font-mono">
                    {item.step}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0F2042] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 text-base leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center text-[11px] font-semibold text-slate-400">
                <span>Passo {item.step} de 04</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pillars / Trust Section */}
      <div className="bg-[#0F2042] rounded-2xl p-8 sm:p-10 text-white shadow-sm border border-blue-950">
        <div className="max-w-3xl mb-8 space-y-2">
          <span className="text-[#D97706] text-xs font-bold uppercase tracking-widest">
            Porquê escolher o Grupo SK?
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Excelência Académica Construída no ISAF
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Nossos tutores conhecem em detalhe a exigência dos professores, o formato das provas e as matérias mais desafiadoras de cada curso.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-[#D97706]/20 text-[#D97706] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-sm">Monitores Verificados</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Estudantes dos 3º e 4º anos com notas de excelência comprovadas nas disciplinas lecionadas.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-sm">Preços Justos em Kwanzas</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Valores acessíveis (2.000 Kz a 10.000 Kz) adaptados à realidade dos estudantes universitários.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-blue-400/20 text-blue-300 flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-sm">Flexibilidade Total</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Sessões presenciais nos espaços de estudo do ISAF ou sessões virtuais com partilha de ecrã e gravações.
            </p>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5 text-[#0F2042]" />
            <span>Perguntas Frequentes (FAQ)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Tudo o que Precisa de Saber
          </h2>
          <p className="text-xs text-slate-500">
            Dúvidas comuns sobre as explicações do Grupo SK para estudantes do ISAF
          </p>
        </div>

        <div className="space-y-3 pt-2">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className={`border rounded-xl transition-all overflow-hidden ${
                  isOpen ? 'border-slate-300 bg-slate-50/50' : 'border-slate-200 bg-white'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 font-semibold text-slate-900 text-xs sm:text-sm focus:outline-none"
                >
                  <span className="leading-snug">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#0F2042] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Ready CTA */}
      <div className="text-center space-y-3 pt-4">
        <h3 className="text-xl font-bold text-slate-900">
          Pronto para Esclarecer as Suas Dúvidas?
        </h3>
        <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto">
          Não deixe as matérias acumular para a época de exames. Submeta a sua requisição agora mesmo.
        </p>
        <button
          onClick={onStartRequest}
          className="py-3 px-6 rounded-xl bg-[#0F2042] hover:bg-[#162D5A] text-white font-bold text-xs sm:text-sm shadow-sm transition-all hover:scale-[1.02] inline-flex items-center gap-2"
        >
          <span>Preencher Formulário de Apoio</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
