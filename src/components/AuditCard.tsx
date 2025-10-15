import React from 'react';
import { Calendar, User, Building, FileText, Eye, Edit, Play, Trash2 } from 'lucide-react';

import { AuditStatus, AuditType, ExecutionNote } from '../types';

interface AuditCardProps {
  id: string;
  title: string;
  status: AuditStatus;
  type: AuditType;
  sector: string;
  auditor: string;
  scheduledDate: Date;
  checklistId?: string;
  executionNote?: ExecutionNote;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onExecute?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const statusConfig = {
  [AuditStatus.PLANNED]: {
    label: 'Planejada',
    color: 'bg-blue-100 text-blue-800',
    dot: 'bg-blue-500'
  },
  [AuditStatus.IN_PROGRESS]: {
    label: 'Em Andamento',
    color: 'bg-yellow-100 text-yellow-800',
    dot: 'bg-yellow-500'
  },
  [AuditStatus.COMPLETED]: {
    label: 'Concluída',
    color: 'bg-green-100 text-green-800',
    dot: 'bg-green-500'
  },
  [AuditStatus.CANCELLED]: {
    label: 'Cancelada',
    color: 'bg-red-100 text-red-800',
    dot: 'bg-red-500'
  }
};

export const AuditCard: React.FC<AuditCardProps> = ({
  id,
  title,
  status,
  type,
  sector,
  auditor,
  scheduledDate,
  checklistId,
  executionNote,
  onView,
  onEdit,
  onExecute,
  onDelete
}) => {
  const config = statusConfig[status];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 leading-tight">{title}</h3>
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full ${config.dot} mr-2 flex-shrink-0`}></div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
              {config.label}
            </span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 sm:flex-shrink-0">
          {onView && (
            <button
              onClick={() => onView(id)}
              className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors touch-manipulation"
              title="Visualizar"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
          {onEdit && status !== AuditStatus.COMPLETED && (
            <button
              onClick={() => onEdit(id)}
              className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors touch-manipulation"
              title="Editar"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
          {onExecute && status === AuditStatus.PLANNED && (
            <button
              onClick={() => onExecute(id)}
              className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors touch-manipulation"
              title="Executar"
            >
              <Play className="w-4 h-4" />
            </button>
          )}
          {onDelete && status !== 'in_progress' && (
            <button
              onClick={() => onDelete(id)}
              className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors touch-manipulation"
              title="Excluir"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <FileText className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
          <span className="truncate">{type}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Building className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
          <span className="truncate">{sector}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <User className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
          <span className="truncate">{auditor}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
          <span className="truncate">{scheduledDate.toLocaleDateString('pt-BR')}</span>
        </div>
      </div>

      {checklistId && (
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-1">Checklist ID:</p>
          <p className="text-sm font-mono text-gray-700 bg-gray-50 px-2 py-1 rounded text-xs sm:text-sm break-all">{checklistId}</p>
        </div>
      )}

      {executionNote && (
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-1">Observações:</p>
          <p className="text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded leading-relaxed">{executionNote.note}</p>
        </div>
      )}

      <div className="pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-400">ID: {id}</p>
      </div>
    </div>
  );
};