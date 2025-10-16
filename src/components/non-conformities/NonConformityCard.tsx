import React, { useState } from 'react'
import { CalendarDays, MapPin, UserCheck, ShieldAlert, Timer, FileBarChart, Camera, ExternalLink, User, Calendar } from 'lucide-react'
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
    <div className="p-3 sm:p-4 hover:bg-gray-50 transition-colors">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 break-words">
                {nonConformity.title}
              </h4>
              {isPatientRelated && (
                <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap self-start">
                  Evento - Paciente
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm text-gray-600">
              <SeverityBadge severity={nonConformity.severity} />
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(nonConformity.status)}`}>
                {getStatusText(nonConformity.status)}
              </span>
              <div className="flex items-center gap-1">
                <CalendarDays className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm">{formatDate(nonConformity.createdAt)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors touch-manipulation"
            >
              {isExpanded ? 'Menos detalhes' : 'Mais detalhes'}
            </button>
          </div>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 text-sm">
          <div className="flex items-center gap-2 text-gray-600 min-w-0">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">{nonConformity.location}</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-600 min-w-0">
            <UserCheck className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">{nonConformity.identifiedBy}</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-600 min-w-0 sm:col-span-2 lg:col-span-1">
            <FileBarChart className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">{nonConformity.category}</span>
          </div>
        </div>

        {/* Description */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-gray-700 text-sm leading-relaxed break-words">
            {nonConformity.description}
          </p>
        </div>

        {/* Evidence Summary */}
        {nonConformity.evidences && nonConformity.evidences.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span className="text-sm font-medium text-blue-900">
                {nonConformity.evidences.length} evidência{nonConformity.evidences.length !== 1 ? 's' : ''} anexada{nonConformity.evidences.length !== 1 ? 's' : ''}
              </span>
            </div>
            <button
              onClick={() => setShowEvidences(true)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors touch-manipulation self-start sm:self-auto"
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
                  <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded leading-relaxed">
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
                    <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded leading-relaxed">
                      {nonConformity.rootCause}
                    </p>
                  </div>
                )}
                
                {nonConformity.dueDate && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-1">Prazo para Tratamento</h5>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Timer className="w-4 h-4 flex-shrink-0" />
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
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          Ação {index + 1}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium self-start ${
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
                      <p className="text-sm text-gray-700 mb-2 leading-relaxed">{action.description}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3 flex-shrink-0" />
                          <span>Responsável: {action.responsibleId}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 flex-shrink-0" />
                          <span>Prazo: {formatDate(action.dueDate)}</span>
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