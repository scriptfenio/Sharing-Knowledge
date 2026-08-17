import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  MessageCircle, 
  Mail, 
  Star, 
  CheckCircle, 
  Award, 
  GraduationCap, 
  BookOpen, 
  ArrowUpRight,
  Filter,
  PhoneCall,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { TUTORS, SK_ADMIN_INFO } from '../data/tutorsData';
import { Tutor, SpecialtyArea } from '../types';
import { SkLogo } from './SkLogo';

interface TutorsDirectoryProps {
  onSelectTutorToRequest: (tutor: Tutor) => void;
  selectedDisciplineFilter?: string;
}

const SPECIALTY_TABS: Array<{ id: string; label: string }> = [
  { id: 'all', label: 'Todos os Tutores' },
  { id: 'Contabilidade', label: 'Contabilidade & Fiscalidade' },
  { id: 'Finanças', label: 'Finanças & Cálculo Financeiro' },
  { id: 'Programação & TI', label: 'Programação & Redes / TI' },
  { id: 'Matemática & Estatística', label: 'Matemática & Estatística' },
  { id: 'Banca & Seguros', label: 'Banca, Seguros & Risco' },
];

export const TutorsDirectory: React.FC<TutorsDirectoryProps> = ({
  onSelectTutorToRequest,
  selectedDisciplineFilter,
}) => {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>(selectedDisciplineFilter || '');
  const [selectedTutorModal, setSelectedTutorModal] = useState<Tutor | null>(null);

  // Filter tutors by tab and search
  const filteredTutors = useMemo(() => {
    return TUTORS.filter((tutor) => {
      // Specialty tab match
      const matchesSpecialty = 
        selectedSpecialty === 'all' || 
        tutor.specialtyAreas.includes(selectedSpecialty as SpecialtyArea);

      // Search match
      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchesSpecialty;

      const matchesName = tutor.name.toLowerCase().includes(query);
      const matchesCourse = tutor.course.toLowerCase().includes(query);
      const matchesBio = tutor.bio.toLowerCase().includes(query);
      const matchesSubjects = tutor.featuredSubjects.some(s => s.toLowerCase().includes(query));

      return matchesSpecialty && (matchesName || matchesCourse || matchesBio || matchesSubjects);
    });
  }, [selectedSpecialty, searchQuery]);

  const generateTutorWhatsAppLink = (tutor: Tutor) => {
    const text = `Olá ${tutor.name}! Vi o seu perfil na Plataforma SK - ISAF e gostaria de tirar uma dúvida sobre explicações para o curso de ${tutor.course}.`;
    return `https://wa.me/${tutor.whatsapp}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 py-6 sm:py-8">
      {/* Directory Hero */}
      <div className="text-center max-w-4xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-blue-50 text-[#0F2042] border border-blue-100 text-xs font-bold">
          <SkLogo size="xs" shape="circle" border={false} />
          <span>Equipa de Monitores e Alunos de Excelência Sharing Knowledge</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Diretório de Tutores e Professores da <span className="text-[#0F2042]">Sharing Knowledge (SK)</span>
        </h1>

        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
          Conheça os colegas finalistas e monitores do ISAF preparados para orientar as suas dúvidas, apoiar na resolução de fichas e preparar para exames com metodologia comprovada.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar por disciplina (ex: Contabilidade Geral, Cálculo Financeiro, Java, SQL, Seguros...)"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:border-slate-300 focus:border-[#0F2042] focus:bg-white focus:ring-1 focus:ring-[#0F2042] text-sm transition-all focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-semibold"
              >
                Limpar
              </button>
            )}
          </div>

          <div className="text-xs text-slate-500 font-medium shrink-0">
            <strong>{filteredTutors.length}</strong> tutores disponíveis
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {SPECIALTY_TABS.map((tab) => {
            const isSelected = selectedSpecialty === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedSpecialty(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#0F2042] text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tutors Grid */}
      {filteredTutors.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 max-w-lg mx-auto">
          <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-base mb-1">Nenhum tutor encontrado</h3>
          <p className="text-xs text-slate-500 mb-4">
            Tente pesquisar com outro termo ou selecione "Todos os Tutores".
          </p>
          <button
            onClick={() => {
              setSelectedSpecialty('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-blue-50 text-blue-800 text-xs font-bold hover:bg-blue-100 transition-colors"
          >
            Ver Todos os Tutores
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {filteredTutors.map((tutor) => {
            return (
              <div
                key={tutor.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group hover:border-slate-300"
              >
                <div className="p-6 space-y-4">
                  {/* Tutor Header Info */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Avatar with initials */}
                      <div className="w-12 h-12 rounded-xl bg-[#0F2042] text-white font-bold text-base flex items-center justify-center shadow-inner">
                        {tutor.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-slate-900 text-base">
                            {tutor.name}
                          </h3>
                          {tutor.isVerified && (
                            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" title="Tutor Verificado ISAF" />
                          )}
                        </div>
                        <p className="text-xs text-slate-500 font-medium">
                          {tutor.role}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200 text-[#D97706] text-xs font-extrabold shrink-0">
                      <Star className="w-3.5 h-3.5 fill-[#D97706] text-[#D97706]" />
                      <span>{tutor.rating.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Course & Level badge */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {tutor.course}
                    </span>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-100">
                      {tutor.yearOfStudy}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 ml-auto">
                      ● {tutor.availability}
                    </span>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {tutor.bio}
                  </p>

                  {/* Featured Subjects */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Disciplinas Principais:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {tutor.featuredSubjects.map((sub, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-50 text-slate-700 border border-slate-200"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Academic Highlights */}
                  {tutor.academicHighlights && tutor.academicHighlights.length > 0 && (
                    <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center gap-2">
                      <Award className="w-4 h-4 text-[#D97706] shrink-0" />
                      <span className="truncate">{tutor.academicHighlights[0]}</span>
                    </div>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col gap-2">
                  <div className="grid grid-cols-2 gap-2">
                    {/* WhatsApp Action */}
                    <a
                      href={generateTutorWhatsAppLink(tutor)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>

                    {/* Email Action */}
                    <a
                      href={`mailto:${tutor.email}?subject=${encodeURIComponent(`[SK-ISAF] Pedido de Explicação - ${tutor.name}`)}`}
                      className="py-2 px-3 rounded-lg bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 border border-slate-200 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      <span>E-mail</span>
                    </a>
                  </div>

                  {/* Primary Request Action */}
                  <button
                    type="button"
                    onClick={() => onSelectTutorToRequest(tutor)}
                    className="w-full py-2.5 px-3 rounded-lg bg-[#0F2042] hover:bg-[#162D5A] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <span>Solicitar Apoio com {tutor.name.split(' ')[0]}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Central Support Card */}
      <div className="mt-12 bg-[#0F2042] rounded-2xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm border border-blue-950">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-[#D97706] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-white">Não encontrou o tutor para a sua disciplina?</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            A Coordenação SK Localiza o Especialista Ideal
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Temos mais de 20 monitores cadastrados no ISAF em todas as disciplinas dos 3 cursos. Fale diretamente com a coordenação para alocação personalizada.
          </p>
        </div>

        <a
          href={`https://wa.me/${SK_ADMIN_INFO.whatsappCentral}?text=${encodeURIComponent('Olá Coordenação SK! Gostaria de uma recomendação de tutor para uma disciplina específica do ISAF.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm shadow-sm flex items-center gap-2 shrink-0 transition-transform hover:scale-105"
        >
          <PhoneCall className="w-4 h-4" />
          <span>Falar com a Coordenação Central</span>
        </a>
      </div>
    </div>
  );
};
