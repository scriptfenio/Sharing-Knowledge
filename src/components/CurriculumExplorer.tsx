import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  GraduationCap, 
  ChevronRight, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Sparkles,
  Award
} from 'lucide-react';
import { COURSES, DISCIPLINES } from '../data/academicData';
import { CourseId, AcademicYear, Discipline, SpecialtyArea } from '../types';
import { SkLogo } from './SkLogo';

interface CurriculumExplorerProps {
  onSelectDisciplineToRequest: (discipline: Discipline) => void;
}

export const CurriculumExplorer: React.FC<CurriculumExplorerProps> = ({
  onSelectDisciplineToRequest,
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState<CourseId>('contabilidade-financas');
  const [selectedYear, setSelectedYear] = useState<AcademicYear | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDisciplineModal, setActiveDisciplineModal] = useState<Discipline | null>(null);

  const currentCourse = useMemo(() => {
    return COURSES.find(c => c.id === selectedCourseId) || COURSES[0];
  }, [selectedCourseId]);

  // Filter disciplines
  const filteredDisciplines = useMemo(() => {
    return DISCIPLINES.filter((d) => {
      const matchCourse = d.courseId === selectedCourseId;
      const matchYear = selectedYear === 'all' || d.year === selectedYear;
      
      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchCourse && matchYear;

      const matchName = d.name.toLowerCase().includes(query);
      const matchArea = d.area.toLowerCase().includes(query);
      const matchDesc = d.description ? d.description.toLowerCase().includes(query) : false;
      const matchTopics = d.keyTopics ? d.keyTopics.some(t => t.toLowerCase().includes(query)) : false;

      return matchCourse && matchYear && (matchName || matchArea || matchDesc || matchTopics);
    });
  }, [selectedCourseId, selectedYear, searchQuery]);

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 py-6 sm:py-8">
      {/* Explorer Hero */}
      <div className="text-center max-w-4xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-blue-50 text-[#0F2042] border border-blue-100 text-xs font-bold">
          <SkLogo size="xs" shape="circle" border={false} />
          <span>Grelha Curricular Oficial do ISAF • Base Sharing Knowledge</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Explorador de Disciplinas do <span className="text-[#0F2042]">ISAF</span>
        </h1>

        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
          Navegue pelas 40 disciplinas completas de cada curso, consulte os tópicos-chave e solicite apoio direcionado para a sua cadeira com um clique.
        </p>
      </div>

      {/* Course Switcher Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {COURSES.map((course) => {
          const isSelected = selectedCourseId === course.id;
          return (
            <button
              key={course.id}
              onClick={() => {
                setSelectedCourseId(course.id);
                setSelectedYear('all');
              }}
              className={`p-5 rounded-2xl text-left border transition-all relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#0F2042] text-white border-[#0F2042] shadow-sm'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    isSelected ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {course.badge}
                  </span>
                  <span className={`text-xs ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                    4 Anos • 8 Semestres
                  </span>
                </div>
                <h3 className="font-bold text-base mb-1">{course.name}</h3>
                <p className={`text-xs line-clamp-2 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                  {course.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-current/10 flex items-center justify-between text-xs font-semibold">
                <span>Explorar Grelha</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Pesquisar disciplinas de ${currentCourse.shortName}...`}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:border-slate-300 focus:border-[#0F2042] focus:bg-white focus:ring-1 focus:ring-[#0F2042] text-sm transition-all focus:outline-none"
            />
          </div>

          {/* Year Filter Buttons */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedYear('all')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedYear === 'all'
                  ? 'bg-[#0F2042] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todos os Anos
            </button>
            {[1, 2, 3, 4].map((yr) => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr as AcademicYear)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedYear === yr
                    ? 'bg-[#0F2042] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {yr}º Ano
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Disciplines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredDisciplines.map((disc) => {
          return (
            <div
              key={disc.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {disc.year}º Ano • {disc.semester}º Semestre
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    {disc.area}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base leading-snug">
                  {disc.name}
                </h3>

                {disc.description && (
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {disc.description}
                  </p>
                )}

                {/* Key Topics */}
                {disc.keyTopics && disc.keyTopics.length > 0 && (
                  <div className="pt-1">
                    <div className="flex flex-wrap gap-1">
                      {disc.keyTopics.map((topic, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-100">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                {disc.isAnnual ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                    Cadeira Anual
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400 font-medium">Semestral</span>
                )}

                <button
                  type="button"
                  onClick={() => onSelectDisciplineToRequest(disc)}
                  className="px-3 py-1.5 rounded-lg bg-[#0F2042] hover:bg-[#162D5A] text-white font-semibold text-xs flex items-center gap-1 transition-colors"
                >
                  <span>Pedir Ajuda</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
