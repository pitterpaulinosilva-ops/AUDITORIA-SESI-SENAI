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
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {audit.title}
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <StatusBadge status={audit.status} size="sm" />
            <span className="text-sm text-gray-500 px-2 py-1 bg-gray-100 rounded">
              {getTypeLabel(audit.type)}
            </span>
            {audit.executionNote && (
              <ExecutionTimingBadge status={audit.executionNote.status} size="sm" />
            )}
          </div>
        </div>
        
        {audit.score !== null && (
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(audit.score)}`}>
            {audit.score}%
          </div>
        )}
      </div>

      {/* Informações */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Building2 className="h-4 w-4 mr-2" />
          <span>{audit.sector}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <User className="h-4 w-4 mr-2" />
          <span>{audit.auditor}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2" />
          <span>{formatDate(audit.scheduledDate.toISOString())}</span>
        </div>
        
        {audit.checklistId && (
          <div className="flex items-center text-sm text-gray-600">
            <FileText className="h-4 w-4 mr-2" />
            <span>Checklist: {audit.checklistId}</span>
          </div>
        )}

        {/* Nota de execução */}
        {audit.executionNote && (
          <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
            {audit.executionNote.note}
          </div>
        )}
      </div>

      {/* Ações */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView(audit.id)}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Visualizar"
          >
            <Eye className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => onEdit(audit.id)}
            className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
            title="Editar"
          >
            <Edit className="h-4 w-4" />
          </button>
          
          {audit.status !== AuditStatus.COMPLETED && audit.status !== AuditStatus.CANCELLED && (
            <button
              onClick={() => onExecute(audit.id)}
              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Executar"
            >
              <Play className="h-4 w-4" />
            </button>
          )}
          
          <button
            onClick={() => onDelete(audit.id)}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Excluir"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        
        <span className="text-xs text-gray-500">
          ID: {audit.id.slice(0, 8)}
        </span>
      </div>
    </div>
  );
}