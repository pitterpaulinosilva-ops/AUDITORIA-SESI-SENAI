import React from 'react';
import { 
  Play, 
  Eye, 
  Calendar, 
  Building2, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  Timer,
  User
} from 'lucide-react';
import { AuditStatus } from '../../types';
import type { Audit } from '../../types';
import { format, isToday, isTomorrow, isPast, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AuditActionCardProps {
  audit: Audit;
  onExecuteAudit: (auditId: string) => void;
  onViewDetails: () => void;
  showPriorityIndicator?: boolean;
}

export function AuditActionCard({ 
  audit, 
  onExecuteAudit, 
  onViewDetails,
  showPriorityIndicator = false 
}: AuditActionCardProps) {
  
  // Verificar se a auditoria pode ser executada
  const canExecuteAudit = (audit: Audit): boolean => {
    return audit.status === AuditStatus.PLANNED || audit.status === AuditStatus.IN_PROGRESS;
  };

  // Determinar prioridade baseada na data
  const getPriorityLevel = (audit: Audit): 'high' | 'medium' | 'low' => {
    if (!audit.scheduledDate) return 'low';
    
    const auditDate = new Date(audit.scheduledDate);
    const today = new Date();
    
    if (isPast(auditDate) && audit.status !== AuditStatus.COMPLETED) return 'high';
    if (isToday(auditDate) || isTomorrow(auditDate)) return 'high';
    
    const daysUntil = differenceInDays(auditDate, today);
    if (daysUntil <= 3) return 'medium';
    
    return 'low';
  };

  // Obter cor do status
  const getStatusColor = (status: AuditStatus): string => {
    switch (status) {
      case AuditStatus.PLANNED:
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case AuditStatus.IN_PROGRESS:
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case AuditStatus.COMPLETED:
        return 'bg-green-100 text-green-700 border-green-200';
      case AuditStatus.CANCELLED:
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Obter label do status
  const getStatusLabel = (status: AuditStatus): string => {
    switch (status) {
      case AuditStatus.PLANNED:
        return 'Planejada';
      case AuditStatus.IN_PROGRESS:
        return 'Em Andamento';
      case AuditStatus.COMPLETED:
        return 'Concluída';
      case AuditStatus.CANCELLED:
        return 'Cancelada';
      default:
        return 'Desconhecido';
    }
  };

  // Obter informações de data
  const getDateInfo = (audit: Audit) => {
    if (!audit.scheduledDate) return { label: 'Sem data', color: 'text-gray-500' };
    
    const auditDate = new Date(audit.scheduledDate);
    const today = new Date();
    
    if (isPast(auditDate) && audit.status !== AuditStatus.COMPLETED) {
      const daysOverdue = Math.abs(differenceInDays(today, auditDate));
      return { 
        label: `Atrasada ${daysOverdue} dia${daysOverdue > 1 ? 's' : ''}`, 
        color: 'text-red-600' 
      };
    }
    
    if (isToday(auditDate)) {
      return { label: 'Hoje', color: 'text-red-600' };
    }
    
    if (isTomorrow(auditDate)) {
      return { label: 'Amanhã', color: 'text-orange-600' };
    }
    
    const daysUntil = differenceInDays(auditDate, today);
    if (daysUntil <= 7) {
      return { 
        label: `Em ${daysUntil} dia${daysUntil > 1 ? 's' : ''}`, 
        color: 'text-yellow-600' 
      };
    }
    
    return { 
      label: format(auditDate, 'dd/MM/yyyy', { locale: ptBR }), 
      color: 'text-gray-600' 
    };
  };

  const priorityLevel = getPriorityLevel(audit);
  const dateInfo = getDateInfo(audit);
  const canExecute = canExecuteAudit(audit);

  return (
    <div className={`bg-white rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
      showPriorityIndicator && priorityLevel === 'high' 
        ? 'border-red-200 shadow-sm' 
        : 'border-gray-200 hover:border-gray-300'
    }`}>
      {/* Header do Card */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">
            {audit.title}
          </h3>
          {showPriorityIndicator && priorityLevel === 'high' && (
            <div className="flex-shrink-0 ml-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </div>
          )}
        </div>
        
        <div className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(audit.status)}`}>
          {audit.status === AuditStatus.COMPLETED && <CheckCircle className="h-3 w-3 mr-1" />}
          {audit.status === AuditStatus.IN_PROGRESS && <Timer className="h-3 w-3 mr-1" />}
          {audit.status === AuditStatus.PLANNED && <Clock className="h-3 w-3 mr-1" />}
          {getStatusLabel(audit.status)}
        </div>
      </div>

      {/* Conteúdo do Card */}
      <div className="p-4 space-y-3">
        {/* Informações da Auditoria */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Building2 className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{audit.sector}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{audit.auditor}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 flex-shrink-0 text-gray-400" />
            <span className={`font-medium ${dateInfo.color}`}>
              {dateInfo.label}
            </span>
          </div>
        </div>

        {/* Descrição (se houver) */}
        {audit.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {audit.description}
          </p>
        )}
      </div>

      {/* Ações do Card */}
      <div className="p-4 pt-0">
        <div className="flex gap-2">
          {/* Botão Ver Detalhes */}
          <button
            onClick={onViewDetails}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Eye className="h-4 w-4" />
            Ver
          </button>

          {/* Botão Executar (condicional) */}
          {canExecute && (
            <button
              onClick={() => onExecuteAudit(audit.id)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <Play className="h-4 w-4" />
              Executar
            </button>
          )}
        </div>

        {/* Indicador de Urgência */}
        {showPriorityIndicator && priorityLevel === 'high' && (
          <div className="mt-2 flex items-center gap-1 text-xs text-red-600">
            <AlertTriangle className="h-3 w-3" />
            <span className="font-medium">Atenção necessária</span>
          </div>
        )}
      </div>
    </div>
  );
}