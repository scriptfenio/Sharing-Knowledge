import React from 'react';
import { 
  X, 
  History, 
  MessageCircle, 
  Trash2, 
  Calendar, 
  Clock, 
  GraduationCap, 
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { TutoringRequest } from '../types';
import { formatKz, buildWhatsAppLink, buildEmailTemplate } from '../utils/formatters';
import { SkLogo } from './SkLogo';

interface RequestHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  requests: TutoringRequest[];
  onDeleteRequest: (id: string) => void;
  onClearAll: () => void;
}

export const RequestHistoryModal: React.FC<RequestHistoryModalProps> = ({
  isOpen,
  onClose,
  requests,
  onDeleteRequest,
  onClearAll,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <SkLogo size="sm" shape="rounded" border={false} className="border border-slate-200" />
            <div>
              <h3 className="font-bold text-slate-900 text-base">Minhas Solicitações de Apoio</h3>
              <p className="text-xs text-slate-500">Histórico de pedidos gerados na rede Sharing Knowledge (SK)</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {requests.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <GraduationCap className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="font-bold text-slate-700 text-base">Nenhuma solicitação registada</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Quando submeter um pedido de tutoria na plataforma, ele ficará guardado aqui para fácil consulta.
              </p>
            </div>
          ) : (
            requests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3 hover:border-slate-300 transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#0F2042] bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                      {req.trackingCode}
                    </span>
                    <button
                      onClick={() => handleCopyCode(req.trackingCode, req.id)}
                      className="text-slate-400 hover:text-slate-600 p-1"
                      title="Copiar código de rastreio"
                    >
                      {copiedId === req.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                      {formatKz(req.budgetKz)}
                    </span>
                    <button
                      onClick={() => onDeleteRequest(req.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Remover do histórico"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                    {req.discipline}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {req.courseName} • {req.year}º Ano ({req.semester}º Semestre)
                  </p>
                </div>

                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 line-clamp-2">
                  "{req.doubtDescription}"
                </p>

                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(req.createdAt).toLocaleDateString('pt-AO')}
                  </span>

                  <a
                    href={buildWhatsAppLink(req)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-[#25D366] hover:text-emerald-700"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Reenviar no WhatsApp</span>
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        {requests.length > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={onClearAll}
              className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpar Histórico</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#0F2042] text-white rounded-lg text-xs font-semibold hover:bg-[#162D5A] transition-colors"
            >
              Fechar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
