import { X, Calendar, User, Clock, FileText } from 'lucide-react';
import { Audit, AuditStatus } from '../../types';
import { AuditIndicator } from './AuditIndicator';

interface AuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  audits: Audit[];
  onOpenAudit: (auditId: string) => void;
  onCreateAudit: (date: Date) => void;
}

export function AuditModal({ 
  isOpen, 
  onClose, 
  date, 
  audits, 
  onOpenAudit, 
  onCreateAudit 
}: AuditModalProps) {
  if (!isOpen) return null;

  const formatDate = (date: Date) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return 'Data inválida';
    }
    
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
        return 'Indefinido';
    }
  };

  const handleCreateAudit = () => {
    onCreateAudit(date);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {audits.length > 0 ? 'Auditorias do Dia' : 'Criar Nova Auditoria'}
            </h2>
            <p className="text-sm text-gray-600 capitalize">
              {formatDate(date)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {audits.length > 0 ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                {audits.length === 1 
                  ? 'Encontrada 1 auditoria para esta data:' 
                  : `Encontradas ${audits.length} auditorias para esta data:`
                }
              </p>

              {/* Lista de auditorias */}
              <div className="space-y-3">
                {audits.map((audit) => (
                  <div
                    key={audit.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{audit.title}</h3>
                      <AuditIndicator status={audit.status} size="md" />
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span>{getStatusLabel(audit.status)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{audit.auditor}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>
                          {audit.scheduledDate 
                            ? new Date(audit.scheduledDate).toLocaleDateString('pt-BR')
                            : 'Data não definida'
                          }
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onOpenAudit(audit.id);
                        onClose();
                      }}
                      className="mt-3 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Abrir Auditoria
                    </button>
                  </div>
                ))}
              </div>

              {/* Opção de criar nova auditoria */}
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={handleCreateAudit}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Criar Nova Auditoria para Este Dia
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              
              <div>
                <p className="text-gray-600 mb-4">
                  Nenhuma auditoria encontrada para esta data.
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Deseja criar uma nova auditoria para este dia?
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateAudit}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Criar Auditoria
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}