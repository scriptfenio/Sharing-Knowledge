import React, { useState } from 'react';
import { MessageCircle, X, Sparkles } from 'lucide-react';
import { SK_ADMIN_INFO } from '../data/tutorsData';

export const WhatsAppFloatingButton: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  const defaultMessage = encodeURIComponent(
    'Olá Equipa SK - ISAF! Gostaria de esclarecer uma dúvida sobre o funcionamento das tutorias ou agendamento.'
  );

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {showTooltip && (
        <div className="bg-slate-900 text-white text-xs px-3.5 py-2.5 rounded-2xl shadow-xl border border-slate-800 flex items-center gap-2 max-w-xs animate-in slide-in-from-bottom-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="text-[11px] leading-tight">
            Precisa de ajuda rápida? <strong>Fale com a Coordenação SK</strong>
          </span>
          <button 
            onClick={() => setShowTooltip(false)}
            className="text-slate-400 hover:text-white p-0.5 ml-1"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      <a
        href={`https://wa.me/${SK_ADMIN_INFO.whatsappCentral}?text=${defaultMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        id="whatsapp-floating-btn"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-2xl hover:bg-[#20ba59] transition-all duration-300 hover:scale-110 focus:outline-none ring-4 ring-emerald-500/20"
        title="Falar no WhatsApp com a Equipa SK"
      >
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
        </span>
        <MessageCircle className="w-7 h-7" />
      </a>
    </div>
  );
};

