import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { RequestForm } from './components/RequestForm';
import { TutorsDirectory } from './components/TutorsDirectory';
import { CurriculumExplorer } from './components/CurriculumExplorer';
import { HowItWorks } from './components/HowItWorks';
import { Footer } from './components/Footer';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { RequestHistoryModal } from './components/RequestHistoryModal';
import { TutoringRequest, CourseId, Discipline, Tutor } from './types';
import { COURSES } from './data/academicData';

export default function App() {
  const [activeTab, setActiveTab] = useState<'request' | 'tutors' | 'explorer' | 'how-it-works'>('request');
  
  // Pre-selection params when navigating from other tabs
  const [initialCourseId, setInitialCourseId] = useState<CourseId>('contabilidade-financas');
  const [initialDisciplineId, setInitialDisciplineId] = useState<string | undefined>(undefined);
  const [selectedDisciplineFilter, setSelectedDisciplineFilter] = useState<string>('');

  // Local storage history
  const [savedRequests, setSavedRequests] = useState<TutoringRequest[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('sk_isaf_requests');
      if (stored) {
        setSavedRequests(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Could not read saved requests from localStorage', e);
    }
  }, []);

  // Save to localStorage
  const handleRequestSubmitted = (newRequest: TutoringRequest) => {
    const updated = [newRequest, ...savedRequests];
    setSavedRequests(updated);
    try {
      localStorage.setItem('sk_isaf_requests', JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save request to localStorage', e);
    }
  };

  const handleDeleteRequest = (id: string) => {
    const updated = savedRequests.filter(r => r.id !== id);
    setSavedRequests(updated);
    try {
      localStorage.setItem('sk_isaf_requests', JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not update localStorage', e);
    }
  };

  const handleClearAllRequests = () => {
    setSavedRequests([]);
    try {
      localStorage.removeItem('sk_isaf_requests');
    } catch (e) {
      console.warn('Could not clear localStorage', e);
    }
  };

  // Nav actions
  const handleSelectCourseQuick = (courseId: string) => {
    const validCourse = COURSES.find(c => c.id === courseId);
    if (validCourse) {
      setInitialCourseId(validCourse.id);
    }
  };

  const handleSelectTutorToRequest = (tutor: Tutor) => {
    // Switch to request tab and pre-fill context
    if (tutor.course.includes('Contabilidade')) {
      setInitialCourseId('contabilidade-financas');
    } else if (tutor.course.includes('Bancária') || tutor.course.includes('Seguros')) {
      setInitialCourseId('gestao-bancaria-seguros');
    } else if (tutor.course.includes('Informática')) {
      setInitialCourseId('informatica-gestao-financeira');
    }
    setActiveTab('request');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectDisciplineToRequest = (discipline: Discipline) => {
    setInitialCourseId(discipline.courseId);
    setInitialDisciplineId(discipline.id);
    setActiveTab('request');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreTutorsForDiscipline = (disciplineName: string) => {
    setSelectedDisciplineFilter(disciplineName);
    setActiveTab('tutors');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#F8FAFC] text-slate-900 font-sans overflow-x-hidden">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => setActiveTab(tab as any)}
        savedRequestsCount={savedRequests.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onSelectCourseQuick={handleSelectCourseQuick}
      />

      {/* Main Tab Content */}
      <main className="flex-1 w-full">
        {activeTab === 'request' && (
          <RequestForm
            key={`${initialCourseId}-${initialDisciplineId || 'none'}`}
            initialCourseId={initialCourseId}
            initialDisciplineId={initialDisciplineId}
            onRequestSubmitted={handleRequestSubmitted}
            onExploreTutorsForDiscipline={handleExploreTutorsForDiscipline}
          />
        )}

        {activeTab === 'tutors' && (
          <TutorsDirectory
            onSelectTutorToRequest={handleSelectTutorToRequest}
            selectedDisciplineFilter={selectedDisciplineFilter}
          />
        )}

        {activeTab === 'explorer' && (
          <CurriculumExplorer
            onSelectDisciplineToRequest={handleSelectDisciplineToRequest}
          />
        )}

        {activeTab === 'how-it-works' && (
          <HowItWorks
            onStartRequest={() => {
              setActiveTab('request');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigateTab={(tab) => {
          setActiveTab(tab as any);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectCourse={(courseId) => {
          handleSelectCourseQuick(courseId);
        }}
      />

      {/* Floating Action Button */}
      <WhatsAppFloatingButton />

      {/* Request History Modal */}
      <RequestHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        requests={savedRequests}
        onDeleteRequest={handleDeleteRequest}
        onClearAll={handleClearAllRequests}
      />
    </div>
  );
}
