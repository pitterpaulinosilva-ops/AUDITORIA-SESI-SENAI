import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuditProStore } from '../../store';
import { StatusBadge } from '../../components/StatusBadge';
import { ExecutionTimingBadge } from '../../components/ExecutionTimingBadge';
import { AuditStatus } from '../../types';
import { 
  Calendar, 
  User, 
  Building2, 
  FileText, 
  Edit, 
  Play, 
  Trash2, 
  ArrowLeft,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle,
  Camera,
  X
} from 'lucide-react';

export function AuditDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getAuditById, deleteAudit, getNonConformitiesByAudit, getEvidencesByAudit } = useAuditProStore();

  const audit = id ? getAuditById(id) : null;
  const nonConformities = id ? getNonConformitiesByAudit(id) : [];
  const evidences = id ? getEvidencesByAudit(id) : [];

  if (!audit) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/audits')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            Voltar
          </button>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500">Auditoria não encontrada</p>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir esta auditoria?')) {
      deleteAudit(audit.id);
      navigate('/audits');
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const getTypeLabel = (type: string) => {
    const types = {
      'interna': 'Auditoria Interna',
      'externa': 'Auditoria Externa',
      'qualidade': 'Auditoria de Qualidade',
      'seguranca': 'Auditoria de Segurança',
      'ambiental': 'Auditoria Ambiental',
      'financeira': 'Auditoria Financeira'
    };
    return types[type as keyof typeof types] || type;
  };

  const getScoreColor = (score: number | null) => {
    if (score === null) return 'text-gray-500';
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/audits')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            Voltar
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{audit.title}</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/audits/${audit.id}/edit`)}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
          >
            <Edit className="h-4 w-4" />
            Editar
          </button>
          
          {audit.status === AuditStatus.PLANNED && (
            <button
              onClick={() => navigate(`/audits/${audit.id}/execute`)}
              className="flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
            >
              <Play className="h-4 w-4" />
              Executar
            </button>
          )}
          
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
          >
            <Trash2 className="h-4 w-4" />
            Excluir
          </button>
        </div>
      </div>

      {/* Main Info Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Setor</p>
              <p className="font-medium text-gray-900">{audit.sector}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <User className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Auditor</p>
              <p className="font-medium text-gray-900">{audit.auditor}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Data Agendada</p>
              <p className="font-medium text-gray-900">{formatDate(audit.scheduledDate)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <FileText className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tipo</p>
              <p className="font-medium text-gray-900">{getTypeLabel(audit.type)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Status and Score */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-50 rounded-lg">
              <Clock className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <div className="flex items-center gap-2">
                <StatusBadge status={audit.status} />
                {audit.executionNote && (
                  <ExecutionTimingBadge status={audit.executionNote.status} size="sm" />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Target className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pontuação</p>
              <p className={`text-lg font-semibold ${getScoreColor(audit.score)}`}>
                {audit.score !== null ? `${audit.score}%` : 'Não avaliada'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Não Conformidades</p>
              <p className="text-lg font-semibold text-gray-900">{nonConformities.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Execution Note */}
      {audit.executionNote && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Nota de Execução</h3>
          <div className="flex items-start gap-3">
            <ExecutionTimingBadge status={audit.executionNote.status} size="md" />
            <div className="flex-1">
              <p className="text-gray-700 mb-2">{audit.executionNote.note}</p>
              <div className="text-sm text-gray-500 space-y-1">
                <p>Data programada: {formatDate(audit.executionNote.scheduledDate)}</p>
                <p>Data de execução: {formatDate(audit.executionNote.executedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancellation History */}
      {audit.status === AuditStatus.CANCELLED && (audit.cancellationReason || audit.cancellationDate) && (
        <div className="bg-white rounded-lg border border-orange-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-50 rounded-lg">
              <X className="h-5 w-5 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Histórico de Cancelamentos</h3>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
            <div className="space-y-3">
              {audit.cancellationDate && audit.cancellationTime && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-orange-600" />
                  <span className="font-medium text-orange-800">Data e Hora:</span>
                  <span className="text-orange-700">
                    {audit.cancellationDate} às {audit.cancellationTime}
                  </span>
                </div>
              )}
              
              {audit.cancelledBy && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-orange-600" />
                  <span className="font-medium text-orange-800">Cancelado por:</span>
                  <span className="text-orange-700">{audit.cancelledBy}</span>
                </div>
              )}
              
              {audit.cancellationReason && (
                <div className="mt-3">
                  <div className="flex items-start gap-2 text-sm mb-2">
                    <FileText className="h-4 w-4 text-orange-600 mt-0.5" />
                    <span className="font-medium text-orange-800">Motivo do Cancelamento:</span>
                  </div>
                  <div className="bg-white rounded-md p-3 border border-orange-200">
                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                      {audit.cancellationReason}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Description */}
      {audit.description && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Descrição</h3>
          <p className="text-gray-700 leading-relaxed">{audit.description}</p>
        </div>
      )}

      {/* Checklist */}
      {audit.checklistId && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Checklist</h3>
          <div className="flex items-center gap-2 text-blue-600">
            <CheckCircle className="h-5 w-5" />
            <span>Checklist ID: {audit.checklistId}</span>
          </div>
        </div>
      )}

      {/* Non-Conformities */}
      {nonConformities.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Não Conformidades</h3>
          <div className="space-y-3">
            {nonConformities.map((nc) => (
              <div key={nc.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{nc.title}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    nc.severity === 'high' ? 'bg-red-100 text-red-800' :
                    nc.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {nc.severity}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{nc.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Evidences */}
      {evidences.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Evidências</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {evidences.map((evidence) => (
              <div key={evidence.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Camera className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-900">{evidence.type}</span>
                </div>
                {evidence.description && (
                  <p className="text-sm text-gray-600">{evidence.description}</p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  {formatDate(evidence.createdAt)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audit History */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">Criada em {formatDate(audit.createdAt)}</span>
          </div>
          {audit.actualStartDate && (
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-600">Iniciada em {formatDate(audit.actualStartDate)}</span>
            </div>
          )}
          {audit.actualEndDate && (
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Finalizada em {formatDate(audit.actualEndDate)}</span>
            </div>
          )}
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
            <span className="text-gray-600">Última atualização em {formatDate(audit.updatedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}