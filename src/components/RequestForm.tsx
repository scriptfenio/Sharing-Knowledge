import React, { useState, useMemo } from 'react';
import { 
  Send, 
  MessageCircle, 
  Mail, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  AlertCircle, 
  Copy, 
  Check, 
  FileText, 
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Sliders,
  HelpCircle,
  CalendarCheck
} from 'lucide-react';
import { COURSES, DISCIPLINES } from '../data/academicData';
import { SK_ADMIN_INFO } from '../data/tutorsData';
import { SkLogo } from './SkLogo';
import { 
  CourseId, 
  AcademicYear, 
  Semester, 
  UrgencyLevel, 
  SessionPreference, 
  TutoringRequest,
  Discipline
} from '../types';
import { 
  formatKz, 
  formatAngolaPhone, 
  generateTrackingCode, 
  buildWhatsAppLink, 
  buildEmailTemplate 
} from '../utils/formatters';

interface RequestFormProps {
  initialCourseId?: CourseId;
  initialDisciplineId?: string;
  onRequestSubmitted: (request: TutoringRequest) => void;
  onExploreTutorsForDiscipline?: (disciplineName: string) => void;
}

const COMMON_TAGS = [
  'Resolução de Exames Anteriores',
  'Trabalho de Investigação / TFC',
  'Exercícios Práticos de Ficha',
  'Dúvidas Conceituais / Teóricas',
  'Preparação Intensiva para Prova',
  'Software / Excel / Programação',
  'Encerramento de Contas / PGC',
  'Cálculo de Fórmulas e Demonstrações'
];

export const RequestForm: React.FC<RequestFormProps> = ({
  initialCourseId,
  initialDisciplineId,
  onRequestSubmitted,
  onExploreTutorsForDiscipline,
}) => {
  // Form State
  const [studentName, setStudentName] = useState('');
  const [studentPhone, setStudentPhone] = useState('+244 ');
  const [studentEmail, setStudentEmail] = useState('');
  
  const [selectedCourseId, setSelectedCourseId] = useState<CourseId | ''>(initialCourseId || 'contabilidade-financas');
  const [selectedYear, setSelectedYear] = useState<AcademicYear | ''>(1);
  const [selectedSemester, setSelectedSemester] = useState<Semester | ''>(1);
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('');
  
  const [doubtDescription, setDoubtDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [urgency, setUrgency] = useState<UrgencyLevel>('normal');
  const [sessionPreference, setSessionPreference] = useState<SessionPreference>('presencial');
  const [budgetKz, setBudgetKz] = useState<number>(5000);

  // UI / Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submittedRequest, setSubmittedRequest] = useState<TutoringRequest | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Auto set initial discipline if provided
  React.useEffect(() => {
    if (initialDisciplineId) {
      const disc = DISCIPLINES.find(d => d.id === initialDisciplineId);
      if (disc) {
        setSelectedCourseId(disc.courseId);
        setSelectedYear(disc.year);
        setSelectedSemester(disc.semester);
        setSelectedDiscipline(disc.name);
      }
    }
  }, [initialDisciplineId]);

  // Filter disciplines in cascade
  const filteredDisciplines = useMemo(() => {
    if (!selectedCourseId || !selectedYear || !selectedSemester) {
      return [];
    }
    return DISCIPLINES.filter(
      (d) => 
        d.courseId === selectedCourseId && 
        d.year === selectedYear && 
        d.semester === selectedSemester
    );
  }, [selectedCourseId, selectedYear, selectedSemester]);

  // Selected discipline metadata
  const currentDisciplineInfo = useMemo(() => {
    if (!selectedDiscipline) return null;
    return filteredDisciplines.find(d => d.name === selectedDiscipline) || null;
  }, [selectedDiscipline, filteredDisciplines]);

  // Handle phone input with Angolan mask
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAngolaPhone(e.target.value);
    setStudentPhone(formatted);
    if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
  };

  // Handle Course Change
  const handleCourseChange = (courseId: CourseId) => {
    setSelectedCourseId(courseId);
    setSelectedDiscipline('');
  };

  // Handle Year Change
  const handleYearChange = (year: AcademicYear) => {
    setSelectedYear(year);
    setSelectedDiscipline('');
  };

  // Handle Semester Change
  const handleSemesterChange = (semester: Semester) => {
    setSelectedSemester(semester);
    setSelectedDiscipline('');
  };

  // Toggle quick tags
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Validate form fields
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!studentName.trim()) {
      newErrors.studentName = 'Por favor, insira o seu nome completo.';
    } else if (studentName.trim().split(' ').length < 2) {
      newErrors.studentName = 'Por favor, insira nome e apelido.';
    }

    const cleanPhone = studentPhone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 9) {
      newErrors.phone = 'Por favor, insira um número de WhatsApp válido (+244 9XX XXX XXX).';
    }

    if (!selectedCourseId) {
      newErrors.course = 'Selecione o seu curso do ISAF.';
    }
    if (!selectedYear) {
      newErrors.year = 'Selecione o ano académico.';
    }
    if (!selectedSemester) {
      newErrors.semester = 'Selecione o semestre.';
    }
    if (!selectedDiscipline) {
      newErrors.discipline = 'Selecione a disciplina em que necessita de tutoria.';
    }

    if (!doubtDescription.trim()) {
      newErrors.description = 'Descreva os temas, capítulos ou exercícios onde sente maior dificuldade.';
    } else if (doubtDescription.trim().length < 15) {
      newErrors.description = 'Por favor, detalhe um pouco mais a sua dúvida (mínimo 15 caracteres).';
    }

    if (budgetKz < 2000 || budgetKz > 10000) {
      newErrors.budget = 'O valor da proposta deve situar-se entre 2.000 Kz e 10.000 Kz.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Form Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to first error
      const firstErrorKey = Object.keys(errors)[0];
      const el = document.getElementById(`field-${firstErrorKey}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);

    const currentCourse = COURSES.find(c => c.id === selectedCourseId);
    const trackingCode = generateTrackingCode();

    const newRequest: TutoringRequest = {
      id: `req-${Date.now()}`,
      trackingCode,
      studentName: studentName.trim(),
      studentPhone: studentPhone.trim(),
      studentEmail: studentEmail.trim() || 'Não informado',
      courseId: selectedCourseId as CourseId,
      courseName: currentCourse ? currentCourse.name : '',
      year: selectedYear as AcademicYear,
      semester: selectedSemester as Semester,
      discipline: selectedDiscipline,
      doubtDescription: doubtDescription.trim(),
      tags: selectedTags,
      urgency,
      sessionPreference,
      budgetKz,
      status: 'pendente',
      createdAt: new Date().toISOString(),
    };

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedRequest(newRequest);
      onRequestSubmitted(newRequest);
      setShowSuccessModal(true);
    }, 600);
  };

  const handleCopyTrackingCode = () => {
    if (submittedRequest) {
      navigator.clipboard.writeText(submittedRequest.trackingCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleCopyEmailTemplate = () => {
    if (submittedRequest) {
      const template = buildEmailTemplate(submittedRequest);
      navigator.clipboard.writeText(template.body);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const handleResetForm = () => {
    setShowSuccessModal(false);
    setSubmittedRequest(null);
    setDoubtDescription('');
    setSelectedTags([]);
    setBudgetKz(5000);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 py-6 sm:py-8">
      {/* Header Banner */}
      <div className="w-full bg-[#0F2042] rounded-2xl p-6 sm:p-8 text-white shadow-sm mb-8 border border-blue-950/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#D97706] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
            <span className="text-white">Rede de Monitores e Tutores do ISAF</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight mb-2">
            Solicitar Apoio Académico no <span className="text-[#D97706]">ISAF</span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
            Conecte-se aos melhores tutores da rede <strong>Sharing Knowledge (Grupo SK)</strong>. Escolha a sua disciplina curricular, explique os pontos de maior dúvida e defina uma proposta de valor acessível em Kwanzas.
          </p>

          <div className="flex flex-wrap gap-4 text-xs text-slate-300 border-t border-white/10 pt-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D97706]"></span>
              <span>Grelha Curricular Oficial</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Valores de 2.000 Kz a 10.000 Kz</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              <span>Atendimento Direto no WhatsApp</span>
            </div>
          </div>
        </div>

        {/* Official SK Logo Display in Banner */}
        <div className="hidden sm:flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/10 shrink-0">
          <SkLogo size="xl" shape="rounded" border={false} className="shadow-lg border border-white/20" />
          <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest mt-1.5">
            Sharing Knowledge
          </span>
        </div>
      </div>

      {/* Main Grid: 8 Cols Form + 4 Cols Sidebar on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Main Form (8 Cols) */}
        <section className="lg:col-span-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* PASSO 1: DADOS DO ESTUDANTE */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="mb-4 pb-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">1. Identificação do Estudante</h2>
                  <p className="text-xs text-slate-500">Dados de contacto para encaminhamento da sessão</p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2.5 py-1 rounded">
                  Obrigatório
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nome Completo */}
                <div id="field-studentName" className="sm:col-span-2 space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Nome Completo <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => {
                      setStudentName(e.target.value);
                      if (errors.studentName) setErrors((prev) => ({ ...prev, studentName: '' }));
                    }}
                    placeholder="Ex: Manuel António da Costa"
                    className={`w-full px-4 py-2.5 bg-slate-50 border rounded-lg text-sm transition-all focus:outline-none focus:border-[#1E40AF] focus:bg-white ${
                      errors.studentName
                        ? 'border-rose-300 bg-rose-50/40 text-rose-900'
                        : 'border-slate-200'
                    }`}
                  />
                  {errors.studentName && (
                    <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.studentName}
                    </p>
                  )}
                </div>

                {/* WhatsApp */}
                <div id="field-phone" className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                    <span>WhatsApp (+244) <span className="text-rose-500">*</span></span>
                    <span className="text-[10px] text-emerald-600 font-semibold lowercase">notificação rápida</span>
                  </label>
                  <input
                    type="text"
                    value={studentPhone}
                    onChange={handlePhoneChange}
                    placeholder="+244 9XX XXX XXX"
                    className={`w-full px-4 py-2.5 bg-slate-50 border rounded-lg text-sm font-medium transition-all focus:outline-none focus:border-[#1E40AF] focus:bg-white ${
                      errors.phone
                        ? 'border-rose-300 bg-rose-50/40 text-rose-900'
                        : 'border-slate-200'
                    }`}
                  />
                  {errors.phone ? (
                    <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.phone}
                    </p>
                  ) : (
                    <p className="text-[10px] text-slate-400">
                      Ex: +244 923 884 102
                    </p>
                  )}
                </div>

                {/* E-mail */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                    <span>E-mail</span>
                    <span className="text-[10px] text-slate-400 lowercase">opcional</span>
                  </label>
                  <input
                    type="email"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    placeholder="estudante@isaf.co.ao"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#1E40AF] focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            {/* PASSO 2: SELEÇÃO ACADÉMICA (CURSO -> ANO -> SEMESTRE -> DISCIPLINA) */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
              <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">2. Enquadramento Curricular</h2>
                  <p className="text-xs text-slate-500">Selecione o curso e disciplina oficial do ISAF</p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D97706] bg-amber-50 px-2.5 py-1 rounded border border-amber-200/60">
                  Grelha ISAF
                </span>
              </div>

              {/* Select Curso */}
              <div id="field-course" className="space-y-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Curso Académico <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {COURSES.map((c) => {
                    const isSelected = selectedCourseId === c.id;
                    return (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => handleCourseChange(c.id)}
                        className={`p-3 rounded-xl text-left border transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#0F2042] bg-slate-50 ring-1 ring-[#0F2042]'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                            isSelected ? 'bg-[#0F2042] text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {c.badge}
                          </span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#0F2042]" />}
                        </div>
                        <h3 className={`font-bold text-xs ${isSelected ? 'text-[#0F2042]' : 'text-slate-800'}`}>
                          {c.name}
                        </h3>
                      </button>
                    );
                  })}
                </div>
                {errors.course && (
                  <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.course}
                  </p>
                )}
              </div>

              {/* Ano e Semestre */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* Ano */}
                <div id="field-year" className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Ano Curricular <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[1, 2, 3, 4].map((year) => {
                      const isSelected = selectedYear === year;
                      return (
                        <button
                          type="button"
                          key={year}
                          onClick={() => handleYearChange(year as AcademicYear)}
                          className={`py-2 px-1 rounded-lg text-center font-bold text-xs border transition-all ${
                            isSelected
                              ? 'bg-[#0F2042] text-white border-[#0F2042]'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {year}º Ano
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Semestre */}
                <div id="field-semester" className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Semestre <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[1, 2].map((sem) => {
                      const isSelected = selectedSemester === sem;
                      return (
                        <button
                          type="button"
                          key={sem}
                          onClick={() => handleSemesterChange(sem as Semester)}
                          className={`py-2 px-2 rounded-lg text-center font-bold text-xs border transition-all ${
                            isSelected
                              ? 'bg-[#0F2042] text-white border-[#0F2042]'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {sem}º Semestre
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Disciplina */}
              <div id="field-discipline" className="space-y-1 pt-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Disciplina <span className="text-rose-500">*</span></span>
                  <span className="text-[11px] text-slate-400 font-normal lowercase">
                    {filteredDisciplines.length} disponíveis
                  </span>
                </label>

                {filteredDisciplines.length === 0 ? (
                  <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                    Por favor, confirme a seleção do Curso, Ano e Semestre.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {filteredDisciplines.map((disc) => {
                      const isSelected = selectedDiscipline === disc.name;
                      return (
                        <button
                          type="button"
                          key={disc.id}
                          onClick={() => {
                            setSelectedDiscipline(disc.name);
                            if (errors.discipline) setErrors((prev) => ({ ...prev, discipline: '' }));
                          }}
                          className={`p-2.5 rounded-lg text-left border transition-all flex flex-col justify-between ${
                            isSelected
                              ? 'border-[#1E40AF] bg-blue-50/70 text-[#0F2042] font-bold'
                              : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full mb-0.5">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                              {disc.area}
                            </span>
                            {disc.isAnnual && (
                              <span className="text-[8px] font-bold px-1 py-0.2 rounded bg-purple-100 text-purple-700">
                                Anual
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-semibold leading-snug">
                            {disc.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {errors.discipline && (
                  <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.discipline}
                  </p>
                )}
              </div>
            </div>

            {/* PASSO 3: DESCRIÇÃO DA DÚVIDA */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
              <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">3. Dificuldade & Formato</h2>
                  <p className="text-xs text-slate-500">Explique os exercícios e capítulos para o tutor</p>
                </div>
              </div>

              {/* Tópicos frequentes */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Tópicos Rápidos (Clique para adicionar)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_TAGS.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`text-[11px] px-2.5 py-1 rounded-md border transition-all ${
                          isSelected
                            ? 'bg-[#0F2042] text-white border-[#0F2042] font-semibold'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Textarea */}
              <div id="field-description" className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Descrição da Dúvida <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] text-slate-400">
                    {doubtDescription.length} / 1000
                  </span>
                </div>
                <textarea
                  rows={3}
                  maxLength={1000}
                  value={doubtDescription}
                  onChange={(e) => {
                    setDoubtDescription(e.target.value);
                    if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
                  }}
                  placeholder="Descreva os exercícios, lançamentos ou matérias em que precisa de reforço..."
                  className={`w-full px-4 py-2.5 bg-slate-50 border rounded-lg text-sm transition-all focus:outline-none focus:border-[#1E40AF] focus:bg-white resize-none ${
                    errors.description ? 'border-rose-300 bg-rose-50/40 text-rose-900' : 'border-slate-200'
                  }`}
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Modalidade e Urgência */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* Modalidade */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Modalidade
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'presencial', label: 'Presencial' },
                      { id: 'online', label: 'Online' },
                      { id: 'flexivel', label: 'Flexível' },
                    ].map((item) => {
                      const isSelected = sessionPreference === item.id;
                      return (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() => setSessionPreference(item.id as SessionPreference)}
                          className={`py-2 px-1 rounded-lg border text-center text-xs font-semibold transition-all ${
                            isSelected
                              ? 'border-[#0F2042] bg-[#0F2042] text-white'
                              : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Urgência */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Urgência
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'normal', label: 'Normal' },
                      { id: 'urgente', label: 'Urgente' },
                      { id: 'imediata', label: 'Imediata' },
                    ].map((item) => {
                      const isSelected = urgency === item.id;
                      return (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() => setUrgency(item.id as UrgencyLevel)}
                          className={`py-2 px-1 rounded-lg border text-center text-xs font-semibold transition-all ${
                            isSelected
                              ? 'border-[#D97706] bg-[#D97706] text-white'
                              : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* PASSO 4: PROPOSTA DE VALOR */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Proposta de Valor (Kz)
                </label>
                <span className="text-lg font-bold text-[#D97706]">
                  {formatKz(budgetKz)}
                </span>
              </div>

              <input
                type="range"
                min={2000}
                max={10000}
                step={500}
                value={budgetKz}
                onChange={(e) => setBudgetKz(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#D97706]"
              />

              <div className="flex gap-2 pt-1">
                {[2000, 5000, 7500, 10000].map((val) => {
                  const isSelected = budgetKz === val;
                  return (
                    <button
                      type="button"
                      key={val}
                      onClick={() => setBudgetKz(val)}
                      className={`flex-1 py-1.5 rounded-md text-[10px] font-bold transition-all ${
                        isSelected
                          ? 'bg-[#D97706] text-white shadow-sm'
                          : 'border border-[#D97706] text-[#D97706] hover:bg-amber-50'
                      }`}
                    >
                      {formatKz(val)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                type="submit"
                disabled={isSubmitting}
                id="submit-request-btn"
                className="flex-1 bg-[#0F2042] hover:bg-[#162D5A] text-white py-3.5 rounded-xl font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>A Processar...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submeter Proposta de Tutoria</span>
                  </>
                )}
              </button>

              <a
                href={`https://wa.me/${SK_ADMIN_INFO.whatsappCentral}?text=${encodeURIComponent('Olá Equipa SK! Gostaria de suporte para solicitar tutoria no ISAF.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#25D366] hover:bg-[#20ba59] text-white py-3.5 rounded-xl font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Enviar via WhatsApp SK</span>
              </a>
            </div>

          </form>
        </section>

        {/* Right Column: Sidebar (4 Cols) */}
        <aside className="lg:col-span-4 flex flex-col gap-6">
          {/* Urgent Callout Box */}
          <div className="bg-[#1E40AF] text-white p-6 rounded-2xl shadow-sm relative overflow-hidden">
            <div className="relative z-10 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                <Clock className="w-3 h-3 text-amber-300" />
                <span>Atendimento Rápido</span>
              </div>
              <h3 className="text-lg font-bold leading-snug">Precisa de Urgência?</h3>
              <p className="text-xs text-blue-100 opacity-90 leading-relaxed">
                Nossos tutores de Contabilidade, Finanças e TI estão online para responder às suas solicitações em tempo recorde no campus ou online.
              </p>
              
              <div className="flex items-center gap-2 pt-2 border-t border-white/15 text-xs text-blue-100">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Tempo médio de resposta: <strong>&lt; 30 min</strong></span>
              </div>
            </div>
          </div>

          {/* Recommended Tutors / Fast Mentors */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
            <div className="border-b border-slate-100 pb-3 mb-3 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Tutores Recomendados
              </h3>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                Online
              </span>
            </div>

            <div className="space-y-3">
              {[
                { initials: 'MS', name: 'Dr. Manuel Santos', specialty: 'Finanças & Cálculo', status: 'Disponível Agora', online: true },
                { initials: 'AC', name: 'Ana Carolina', specialty: 'Contabilidade & Fiscalidade', status: 'Disponível Agora', online: true },
                { initials: 'PM', name: 'Pedro Mucinda', specialty: 'Algoritmia & Java', status: 'Em Sessão', online: false },
              ].map((tut, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-slate-100"
                >
                  <div className="w-10 h-10 bg-slate-100 text-[#0F2042] rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                    {tut.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 truncate">{tut.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{tut.specialty}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${tut.online ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                      <span className={`text-[9px] font-medium ${tut.online ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {tut.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {onExploreTutorsForDiscipline && (
              <button
                type="button"
                onClick={() => onExploreTutorsForDiscipline('all')}
                className="w-full mt-4 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-500 hover:text-[#1E40AF] hover:border-[#1E40AF] transition-all"
              >
                Ver todos os tutores da rede
              </button>
            )}
          </div>
        </aside>

      </div>

      {/* ============================================================ */}
      {/* MODAL DE SUCESSO E ENCAMINHAMENTO */}
      {/* ============================================================ */}
      {showSuccessModal && submittedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-6">
            
            {/* Header Success */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-3 mb-1">
                <SkLogo size="md" shape="rounded" border={false} className="shadow-sm border border-slate-200" />
                <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                Requisição Submetida com Sucesso!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                A sua proposta foi registada na base da <strong>Sharing Knowledge (SK)</strong>. Escolha agora como deseja encaminhar para a nossa equipa:
              </p>
            </div>

            {/* Tracking Code Banner */}
            <div className="bg-slate-900 rounded-2xl p-4 sm:p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Código de Rastreio Oficial
                </span>
                <span className="text-lg sm:text-xl font-mono font-extrabold text-amber-400">
                  {submittedRequest.trackingCode}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyTrackingCode}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors border border-white/10"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-300" />
                    <span>Copiar Código</span>
                  </>
                )}
              </button>
            </div>

            {/* Request Summary Receipt */}
            <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 text-xs space-y-2.5">
              <div className="font-bold text-slate-900 pb-2 border-b border-slate-200 flex items-center justify-between">
                <span>Resumo da Solicitação</span>
                <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px] font-extrabold">
                  {formatKz(submittedRequest.budgetKz)}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                <div><strong>Estudante:</strong> {submittedRequest.studentName}</div>
                <div><strong>WhatsApp:</strong> {submittedRequest.studentPhone}</div>
                <div><strong>Curso:</strong> {submittedRequest.courseName}</div>
                <div><strong>Nível:</strong> {submittedRequest.year}º Ano • {submittedRequest.semester}º Semestre</div>
                <div className="sm:col-span-2">
                  <strong>Disciplina:</strong> <span className="text-[#0F2042] font-bold">{submittedRequest.discipline}</span>
                </div>
                <div className="sm:col-span-2 text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200/60 mt-1">
                  <strong>Dúvida:</strong> "{submittedRequest.doubtDescription}"
                </div>
              </div>
            </div>

            {/* Dual Action Buttons: WhatsApp & Email */}
            <div className="space-y-3 pt-2">
              {/* WhatsApp Button (Primary recommendation) */}
              <a
                href={buildWhatsAppLink(submittedRequest)}
                target="_blank"
                rel="noopener noreferrer"
                id="modal-send-whatsapp"
                className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-3 shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.01]"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Enviar Agora via WhatsApp para a Equipa SK</span>
              </a>

              {/* Email Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <a
                  href={buildEmailTemplate(submittedRequest).mailtoUrl}
                  className="py-3 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0F2042] font-bold text-xs flex items-center justify-center gap-2 border border-blue-200 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Abrir Cliente de E-mail</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyEmailTemplate}
                  className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 border border-slate-200 transition-colors"
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedEmail ? 'Template Copiado!' : 'Copiar Texto para E-mail'}</span>
                </button>
              </div>
            </div>

            {/* Footer Close */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={handleResetForm}
                className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
              >
                Fazer Nova Solicitação
              </button>
              <button
                type="button"
                onClick={() => setShowSuccessModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Fechar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
