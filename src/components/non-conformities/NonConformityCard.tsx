import React, { useState } from 'react'
import { Calendar, MapPin, User, AlertTriangle, Clock, FileText, Camera, ExternalLink } from 'lucide-react'
import { NonConformity, Audit, Evidence } from '../../types'
import { SeverityBadge } from './SeverityBadge'
import { EPAButton } from './EPAButton'
import { EvidenceGallery } from './EvidenceGallery'
import { useAuditProStore } from "../../store"

interface NonConformityCardProps {
  nonConformity: NonConformity
}

export function NonConformityCard({ nonConformity }: NonConformityCardProps) {
  const evidences = useAuditProStore(state => 
    state.evidences.filter(e => e.nonConformityId === nonConformity.id)
  )
  const [isExpanded, setIsExpanded] = useState(false)
  const [showEvidences, setShowEvidences] = useState(false)

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800'
      case 'in_treatment':
        return 'bg-yellow-100 text-yellow-800'
      case 'closed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open':
        return 'Aberta'
      case 'in_treatment':
        return 'Em Tratamento'
      case 'closed':
        return 'Fechada'
      case 'cancelled':
        return 'Cancelada'
      default:
        return status
    }
  }

  const isPatientRelated = nonConformity.category.toLowerCase().includes('paciente') || 
                          nonConformity.title.toLowerCase().includes('paciente') ||
                          nonConformity.description.toLowerCase().includes('paciente')

  return (
    <div className="p-4 hover:bg-gray-50 transition-colors">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-lg font-semibold text-gray-900 truncate">
                {nonConformity.title}
              </h4>
              {isPatientRelated && (
                <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap">
                  Evento - Paciente
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
              <SeverityBadge severity={nonConformity.severity} />
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(nonConformity.status)}`}>
                {getStatusText(nonConformity.status)}
              </span>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(nonConformity.createdAt)}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {isExpanded ? 'Menos detalhes' : 'Mais detalhes'}
            </button>
          </div>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{nonConformity.location}</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-600">
            <User className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{nonConformity.identifiedBy}</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-600">
            <FileText className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{nonConformity.category}</span>
          </div>
        </div>

        {/* Description */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-gray-700 text-sm leading-relaxed">
            {nonConformity.description}
          </p>
        </div>

        {/* Evidence Summary */}
        {nonConformity.evidences && nonConformity.evidences.length > 0 && (
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                {nonConformity.evidences.length} evidência{nonConformity.evidences.length !== 1 ? 's' : ''} anexada{nonConformity.evidences.length !== 1 ? 's' : ''}
              </span>
            </div>
            <button
              onClick={() => setShowEvidences(true)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Visualizar
            </button>
          </div>
        )}

        {/* Expanded Details */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Impact and Risk */}
              <div className="space-y-3">
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-1">Impacto</h5>
                  <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                    {nonConformity.impact}
                  </p>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-1">Nível de Risco</h5>
                  <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                    {nonConformity.riskLevel}
                  </p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-3">
                {nonConformity.rootCause && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-1">Causa Raiz</h5>
                    <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                      {nonConformity.rootCause}
                    </p>
                  </div>
                )}
                
                {nonConformity.dueDate && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-1">Prazo para Tratamento</h5>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Clock className="w-4 h-4" />
                      {formatDate(nonConformity.dueDate)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Corrective Actions */}
            {nonConformity.correctiveActions && nonConformity.correctiveActions.length > 0 && (
              <div>
                <h5 className="text-sm font-medium text-gray-900 mb-2">Ações Corretivas</h5>
                <div className="space-y-2">
                  {nonConformity.correctiveActions.map((action, index) => (
                    <div key={action.id} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          Ação {index + 1}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          action.status === 'completed' ? 'bg-green-100 text-green-800' :
                          action.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                          action.status === 'overdue' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {action.status === 'completed' ? 'Concluída' :
                           action.status === 'in_progress' ? 'Em Andamento' :
                           action.status === 'overdue' ? 'Atrasada' : 'Planejada'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{action.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          Responsável: {action.responsibleId}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Prazo: {formatDate(action.dueDate)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* EPA Button */}
        <div className="flex justify-end pt-3 border-t border-gray-200">
          <EPAButton 
            nonConformityId={nonConformity.id}
            isPatientRelated={isPatientRelated}
          />
        </div>
      </div>

      {/* Evidence Gallery Modal */}
      {showEvidences && nonConformity.evidences && Array.isArray(nonConformity.evidences) && (
        <EvidenceGallery
          evidences={nonConformity.evidences.filter((evidence): evidence is Evidence => typeof evidence !== 'string')}
          onClose={() => setShowEvidences(false)}
          title={`Evidências - ${nonConformity.title}`}
        />
      )}
    </div>
  )
}