import { Calendar, User, Building2, FileText, Eye, Edit, Play, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Audit, AuditStatus } from '../types';
import { StatusBadge } from './StatusBadge';
import { ExecutionTimingBadge } from './ExecutionTimingBadge';

interface AuditCardProps {
  audit: Audit;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onExecute: (id: string) => void;
  onDelete: (id: string) => void;
}

export function AuditCard({ audit, onView, onEdit, onExecute, onDelete }: AuditCardProps) {
  const formatDate = (date: string) => {
    return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
  };

  const getTypeLabel = (type: string) => {
    const types = {
      interna: 'Interna',
      externa: 'Externa',
      fornecedor: 'Fornecedor'
    };
    return types[type as keyof typeof types] || type;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-700 bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200';
    if (score >= 70) return 'text-amber-700 bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200';
    return 'text-red-700 bg-gradient-to-r from-red-50 to-red-100 border border-red-200';
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/60 p-6 hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 hover:border-gray-300/60 group hover:-translate-y-1">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors duration-200">
            {audit.title}
          </h3>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <StatusBadge status={audit.status} size="sm" />
            <span className="text-sm text-gray-600 px-3 py-1.5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-full font-medium border border-gray-200">
              {getTypeLabel(audit.type)}
            </span>
            {audit.executionNote && (
              <ExecutionTimingBadge status={audit.executionNote.status} size="sm" />
            )}
          </div>
        </div>
        
        {audit.score !== null && (
          <div className={`px-4 py-2 rounded-full text-sm font-bold shadow-sm ${getScoreColor(audit.score)}`}>
            {audit.score}%
          </div>
        )}
      </div>

      {/* Informações */}
      <div className="space-y-3 mb-5">
        <div className="flex items-center text-sm text-gray-700 group/item hover:text-gray-900 transition-colors duration-200">
          <div className="p-1.5 rounded-lg bg-blue-50 mr-3 group-hover/item:bg-blue-100 transition-colors duration-200">
            <Building2 className="h-4 w-4 text-blue-600" />
          </div>
          <span className="font-medium">{audit.sector}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-700 group/item hover:text-gray-900 transition-colors duration-200">
          <div className="p-1.5 rounded-lg bg-green-50 mr-3 group-hover/item:bg-green-100 transition-colors duration-200">
            <User className="h-4 w-4 text-green-600" />
          </div>
          <span className="font-medium">{audit.auditor}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-700 group/item hover:text-gray-900 transition-colors duration-200">
          <div className="p-1.5 rounded-lg bg-purple-50 mr-3 group-hover/item:bg-purple-100 transition-colors duration-200">
            <Calendar className="h-4 w-4 text-purple-600" />
          </div>
          <span className="font-medium">{formatDate(audit.scheduledDate.toISOString())}</span>
        </div>
        
        {audit.checklistId && (
          <div className="flex items-center text-sm text-gray-700 group/item hover:text-gray-900 transition-colors duration-200">
            <div className="p-1.5 rounded-lg bg-orange-50 mr-3 group-hover/item:bg-orange-100 transition-colors duration-200">
              <FileText className="h-4 w-4 text-orange-600" />
            </div>
            <span className="font-medium">Checklist: {audit.checklistId}</span>
          </div>
        )}

        {/* Nota de execução */}
        {audit.executionNote && (
          <div className="text-sm text-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-xl border border-gray-200 font-medium leading-relaxed">
            {audit.executionNote.note}
          </div>
        )}
      </div>

      {/* Ações */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200/60">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onView(audit.id)}
            className="p-2.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 group/btn"
            title="Visualizar"
          >
            <Eye className="h-4 w-4 group-hover/btn:scale-110 transition-transform duration-200" />
          </button>
          
          <button
            onClick={() => onEdit(audit.id)}
            className="p-2.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 group/btn"
            title="Editar"
          >
            <Edit className="h-4 w-4 group-hover/btn:scale-110 transition-transform duration-200" />
          </button>
          
          {audit.status !== AuditStatus.COMPLETED && audit.status !== AuditStatus.CANCELLED && (
            <button
              onClick={() => onExecute(audit.id)}
              className="p-2.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 group/btn"
              title="Executar"
            >
              <Play className="h-4 w-4 group-hover/btn:scale-110 transition-transform duration-200" />
            </button>
          )}
          
          <button
            onClick={() => onDelete(audit.id)}
            className="p-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 group/btn"
            title="Excluir"
          >
            <Trash2 className="h-4 w-4 group-hover/btn:scale-110 transition-transform duration-200" />
          </button>
        </div>
        
        <span className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded-lg">
          ID: {audit.id.slice(0, 8)}
        </span>
      </div>
    </div>
  );
}