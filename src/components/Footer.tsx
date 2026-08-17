import React from 'react';
import { 
  GraduationCap, 
  MapPin, 
  Clock, 
  PhoneCall, 
  Mail, 
  MessageCircle, 
  ShieldCheck, 
  Heart,
  BookOpen
} from 'lucide-react';
import { SK_ADMIN_INFO } from '../data/tutorsData';
import { SkLogo } from './SkLogo';

interface FooterProps {
  onNavigateTab: (tab: string) => void;
  onSelectCourse: (courseId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab, onSelectCourse }) => {
  return (
    <footer className="bg-[#09152C] text-slate-300 border-t border-blue-950/80 pt-16 pb-12 mt-20 w-full">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Column 1: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <SkLogo size="lg" shape="rounded" />
              <div>
                <span className="font-extrabold text-white text-lg tracking-tight">
                  SHARING KNOWLEDGE • ISAF
                </span>
                <p className="text-[11px] text-amber-400 font-semibold tracking-wider uppercase">
                  Grupo SK • Suporte do Saber
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed pr-4">
              Plataforma académica desenvolvida pela rede <strong>Sharing Knowledge (SK)</strong> para estudantes do <strong>Instituto Superior de Administração e Finanças (ISAF)</strong> em Luanda. Promovemos a entreajuda, nivelamento prático de matérias e excelência académica.
            </p>

            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-3 py-2 rounded-xl w-fit">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Mentoria por Monitores e Finalistas do ISAF</span>
            </div>
          </div>

          {/* Column 2: Cursos ISAF */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">
              Cursos do ISAF
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => {
                    onSelectCourse('contabilidade-financas');
                    onNavigateTab('explorer');
                  }}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  Contabilidade e Finanças
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCourse('gestao-bancaria-seguros');
                    onNavigateTab('explorer');
                  }}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  Gestão Bancária & Seguros
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCourse('informatica-gestao-financeira');
                    onNavigateTab('explorer');
                  }}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  Informática de Gestão Financeira
                </button>
              </li>
              <li className="pt-1">
                <button
                  onClick={() => onNavigateTab('explorer')}
                  className="text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <BookOpen className="w-3 h-3" />
                  <span>Ver todas as 40 disciplinas</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Links Rápidos */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">
              Plataforma
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onNavigateTab('request')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Solicitar Apoio Académico
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('tutors')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Diretório de Tutores SK
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('how-it-works')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Como Funciona o Match
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('how-it-works')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Perguntas Frequentes (FAQ)
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contacto & Atendimento */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">
              Coordenação SK
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Campus ISAF, Luanda - Angola</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{SK_ADMIN_INFO.operatingHours}</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
                <a 
                  href={`https://wa.me/${SK_ADMIN_INFO.whatsappCentral}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 font-semibold"
                >
                  {SK_ADMIN_INFO.whatsappDisplay}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a 
                  href={`mailto:${SK_ADMIN_INFO.email}`} 
                  className="hover:text-blue-300 truncate"
                >
                  {SK_ADMIN_INFO.email}
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>
            © {new Date().getFullYear()} Grupo SK (Suporte do Saber) • Exclusivo para a comunidade académica do ISAF.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Rigor Académico</span>
            <span>•</span>
            <span>Ética Universitária</span>
            <span>•</span>
            <span>Entreajuda Estudantil</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
