import { format, isToday, isFuture, isPast } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Clock, User, FileText } from 'lucide-react';
import { Audit, AuditStatus } from '../../types';

interface ListViewProps {
  audits: Audit[];
  onAuditClick: (audit: Audit) => void;
}

export function ListView({ audits, onAuditClick }: ListViewProps) {
  // Ordenar auditorias por data
  const sortedAudits = [...audits].sort((a, b) => {
    const dateA = new Date(a.scheduledDate || a.createdAt);
    const dateB = new Date(b.scheduledDate || b.createdAt);
    return dateA.getTime() - dateB.getTime();
  });

  // Agrupar auditorias por período
  const groupedAudits = sortedAudits.reduce((acc, audit) => {
    const auditDate = new Date(audit.scheduledDate || audit.createdAt);
    let group = 'Sem data';
    
    if (audit.scheduledDate) {
      if (isToday(auditDate)) {
        group = 'Hoje';
      } else if (isFuture(auditDate)) {
        group = 'Futuras';
      } else if (isPast(auditDate)) {
        group = 'Passadas';
      }
    }
    
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(audit);
    return acc;
  }, {} as Record<string, Audit[]>);

  const getStatusColor = (status: AuditStatus) => {
    switch (status) {
      case AuditStatus.COMPLETED:
        return 'bg-green-100 text-green-800 border-green-200';
      case AuditStatus.IN_PROGRESS:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case AuditStatus.SCHEDULED:
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case AuditStatus.DRAFT:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: AuditStatus) => {
    switch (status) {
      case AuditStatus.COMPLETED:
        return 'Concluída';
      case AuditStatus.IN_PROGRESS:
        return 'Em Andamento';
      case AuditStatus.SCHEDULED:
        return 'Programada';
      case AuditStatus.DRAFT:
        return 'Rascunho';
      default:
        return status;
    }
  };

  const groupOrder = ['Hoje', 'Futuras', 'Passadas', 'Sem data'];

  return (
    <div className="space-y-6">
      {groupOrder.map((groupName) => {
        const groupAudits = groupedAudits[groupName];
        if (!groupAudits || groupAudits.length === 0) return null;

        return (
          <div key={groupName} className="bg-white rounded-lg border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">
                {groupName} ({groupAudits.length})
              </h3>
            </div>
            
            <div className="divide-y divide-gray-200">
              {groupAudits.map((audit) => (
                <div
                  key={audit.id}
                  onClick={() => onAuditClick(audit)}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-medium text-gray-900 truncate">
                          {audit.title}
                        </h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(audit.status)}`}>
                          {getStatusLabel(audit.status)}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        {audit.scheduledDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {format(new Date(audit.scheduledDate), 'dd/MM/yyyy', { locale: ptBR })}
                            </span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{audit.auditor}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          <span>{audit.type}</span>
                        </div>
                        
                        {audit.estimatedDuration && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{audit.estimatedDuration}h</span>
                          </div>
                        )}
                      </div>
                      
                      {audit.description && (
                        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                          {audit.description}
                        </p>
                      )}
                    </div>
                    
                    {audit.progress !== undefined && (
                      <div className="ml-4 text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {Math.round(audit.progress)}%
                        </div>
                        <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${audit.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
      
      {Object.keys(groupedAudits).length === 0 && (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Nenhuma auditoria encontrada
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Não há auditorias que correspondam aos filtros aplicados.
          </p>
        </div>
      )}
    </div>
  );
}