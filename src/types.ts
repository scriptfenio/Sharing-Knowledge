export type CourseId = 
  | 'contabilidade-financas' 
  | 'gestao-bancaria-seguros' 
  | 'informatica-gestao-financeira';

export type AcademicYear = 1 | 2 | 3 | 4;

export type Semester = 1 | 2;

export type SpecialtyArea = 
  | 'Contabilidade' 
  | 'Finanças' 
  | 'Programação & TI' 
  | 'Matemática & Estatística' 
  | 'Banca & Seguros' 
  | 'Direito & Gestão';

export interface Discipline {
  id: string;
  name: string;
  courseId: CourseId;
  year: AcademicYear;
  semester: Semester;
  area: SpecialtyArea;
  isAnnual?: boolean;
  code?: string;
  description?: string;
  keyTopics?: string[];
}

export interface Course {
  id: CourseId;
  name: string;
  shortName: string;
  badge: string;
  description: string;
  iconName: string;
  color: string;
  totalDisciplines: number;
}

export interface Tutor {
  id: string;
  name: string;
  role: string;
  course: string;
  yearOfStudy: string;
  specialtyAreas: SpecialtyArea[];
  featuredSubjects: string[];
  phone: string;
  whatsapp: string;
  email: string;
  rating: number;
  totalSessions: number;
  bio: string;
  availability: 'Disponível Hoje' | 'Presencial & Online' | 'Online (Google Meet)' | 'Apenas Fins de Semana';
  isVerified: boolean;
  avatarSeed: string;
  academicHighlights: string[];
}

export type UrgencyLevel = 'normal' | 'urgente' | 'imediata';
export type SessionPreference = 'presencial' | 'online' | 'flexivel';

export interface TutoringRequest {
  id: string;
  trackingCode: string;
  studentName: string;
  studentPhone: string;
  studentEmail: string;
  courseId: CourseId;
  courseName: string;
  year: AcademicYear;
  semester: Semester;
  discipline: string;
  doubtDescription: string;
  tags: string[];
  urgency: UrgencyLevel;
  sessionPreference: SessionPreference;
  budgetKz: number;
  status: 'pendente' | 'em_atendimento' | 'atribuido' | 'concluido';
  createdAt: string;
}

export interface RequestFormData {
  studentName: string;
  studentPhone: string;
  studentEmail: string;
  courseId: CourseId | '';
  year: AcademicYear | '';
  semester: Semester | '';
  discipline: string;
  doubtDescription: string;
  tags: string[];
  urgency: UrgencyLevel;
  sessionPreference: SessionPreference;
  budgetKz: number;
}
