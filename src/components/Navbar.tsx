import React, { useState } from 'react';
import { 
  GraduationCap, 
  Users, 
  HelpCircle, 
  BookOpen, 
  MessageCircle, 
  Menu, 
  X, 
  Sparkles,
  PhoneCall,
  History
} from 'lucide-react';
import { SK_ADMIN_INFO } from '../data/tutorsData';
import { SkLogo } from './SkLogo';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  savedRequestsCount: number;
  onOpenHistory: () => void;
  onSelectCourseQuick: (courseId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  savedRequestsCount,
  onOpenHistory,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'request', label: 'Solicitar Apoio', icon: GraduationCap, highlight: true },
    { id: 'tutors', label: 'Nossos Tutores SK', icon: Users },
    { id: 'explorer', label: 'Grelha Curricular ISAF', icon: BookOpen },
    { id: 'how-it-works', label: 'Como Funciona', icon: HelpCircle },
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    
    // Smooth scroll to top when changing tab
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0F2042] text-white shadow-lg border-b border-blue-950/60 w-full">
      {/* Top micro banner */}
      <div className="bg-[#09152C] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 py-1.5 text-xs text-slate-300 border-b border-white/5 w-full">
        <div className="w-full flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              OFICIAL SK
            </span>
            <span className="hidden sm:inline text-slate-300 font-medium">
              Suporte do Saber • Exclusivo para Estudantes do ISAF
            </span>
            <span className="sm:hidden text-slate-300">
              Grupo SK • ISAF
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-[11px] text-slate-300">
            <span className="hidden md:inline flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block"></span>
              Tutores Ativos no Campus & Online
            </span>
            <a 
              href={`https://wa.me/${SK_ADMIN_INFO.whatsappCentral}?text=${encodeURIComponent('Olá Equipa SK! Gostaria de esclarecer uma dúvida sobre a plataforma de apoio académico do ISAF.')}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-amber-300 transition-colors flex items-center gap-1 font-medium text-emerald-400"
            >
              <PhoneCall className="w-3 h-3" />
              WhatsApp SK: {SK_ADMIN_INFO.whatsappDisplay}
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo & Brand */}
          <button 
            onClick={() => handleNavClick('request')}
            className="flex items-center gap-3 text-left group focus:outline-none"
            id="brand-logo-btn"
          >
            <SkLogo 
              size="md" 
              shape="rounded" 
              className="transition-transform group-hover:scale-105" 
            />

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base sm:text-lg text-white tracking-tight leading-tight">
                  SHARING KNOWLEDGE
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold uppercase tracking-wider">
                  ISAF
                </span>
              </div>
              <p className="text-[10px] text-slate-300 tracking-wider uppercase font-medium">
                Grupo SK • Suporte Académico
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-sm font-medium transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'text-white border-b-2 border-[#D97706] pb-1 font-semibold'
                      : 'text-slate-300 hover:text-white pb-1 border-b-2 border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#D97706]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* History Pill / Button */}
            <button
              onClick={onOpenHistory}
              id="nav-history-btn"
              className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-white/10 hover:bg-white/15 border border-white/10 hover:text-white transition-colors"
              title="Ver minhas solicitações enviadas"
            >
              <History className="w-3.5 h-3.5 text-[#D97706]" />
              <span className="hidden lg:inline">Requisições</span>
              {savedRequestsCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#D97706] text-white font-bold text-[9px] flex items-center justify-center">
                  {savedRequestsCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Action on desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={`https://wa.me/${SK_ADMIN_INFO.whatsappCentral}?text=${encodeURIComponent('Olá Equipa SK! Preciso de orientações sobre tutoria para disciplinas do ISAF.')}`}
              target="_blank"
              rel="noopener noreferrer"
              id="nav-whatsapp-direct"
              className="bg-[#25D366] hover:bg-[#20ba59] text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-sm transition-all hover:scale-105"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Suporte WhatsApp</span>
            </a>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenHistory}
              className="p-2 rounded-lg bg-blue-900/60 text-slate-200 hover:text-white"
              title="Histórico"
            >
              <History className="w-5 h-5 text-amber-400" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              id="mobile-menu-toggle"
              className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 focus:outline-none"
              aria-label="Abrir Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A162E] border-b border-blue-900/80 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? item.highlight 
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-blue-800/80 text-white font-semibold'
                    : item.highlight
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive && !item.highlight ? 'text-amber-400' : ''}`} />
                  <span>{item.label}</span>
                </div>
                {item.highlight && <Sparkles className="w-4 h-4" />}
              </button>
            );
          })}

          <div className="pt-3 border-t border-white/10 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenHistory();
              }}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg bg-blue-950/60 text-slate-200 text-xs font-medium"
            >
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-amber-400" />
                <span>Minhas Solicitações Salvas</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-bold text-[10px]">
                {savedRequestsCount}
              </span>
            </button>

            <a
              href={`https://wa.me/${SK_ADMIN_INFO.whatsappCentral}?text=${encodeURIComponent('Olá Equipa SK! Gostaria de falar diretamente com a coordenação.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold shadow"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chamar Coordenação no WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
