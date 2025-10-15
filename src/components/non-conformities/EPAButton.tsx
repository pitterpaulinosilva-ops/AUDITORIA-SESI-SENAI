import React from 'react'
import { ExternalLink, AlertTriangle, User } from 'lucide-react'

interface EPAButtonProps {
  nonConformityId?: string
  isPatientRelated?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary'
}

export function EPAButton({ 
  nonConformityId, 
  isPatientRelated = false, 
  size = 'md',
  variant = 'primary'
}: EPAButtonProps) {
  const EPA_URL = 'https://sistemafiea.sysepa.com.br/epa/qualidade_ocorrencia_processo_1.php'

  const handleEPARedirect = () => {
    // Abrir EPA em nova aba
    window.open(EPA_URL, '_blank', 'noopener,noreferrer')
    
    // Log para auditoria
    console.log('Redirecionamento para EPA:', {
      nonConformityId,
      isPatientRelated,
      timestamp: new Date().toISOString(),
      url: EPA_URL
    })
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm'
      case 'lg':
        return 'px-6 py-3 text-lg'
      default:
        return 'px-4 py-2 text-base'
    }
  }

  const getVariantClasses = () => {
    if (variant === 'secondary') {
      return 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50'
    }
    return 'bg-blue-600 text-white hover:bg-blue-700 border-2 border-blue-600'
  }

  const getIcon = () => {
    if (isPatientRelated) {
      return <User className="w-4 h-4" />
    }
    return <AlertTriangle className="w-4 h-4" />
  }

  const getButtonText = () => {
    if (isPatientRelated) {
      return 'Abrir Evento no EPA'
    }
    return 'Abrir NC no EPA'
  }

  return (
    <button
      onClick={handleEPARedirect}
      className={`
        inline-flex items-center gap-2 font-semibold rounded-lg
        transition-all duration-200 transform hover:scale-105
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        shadow-md hover:shadow-lg
        ${getSizeClasses()}
        ${getVariantClasses()}
      `}
      title={`Abrir ${isPatientRelated ? 'evento relacionado a paciente' : 'não conformidade'} no sistema EPA`}
    >
      {getIcon()}
      <span>{getButtonText()}</span>
      <ExternalLink className="w-4 h-4" />
    </button>
  )
}