import React from 'react'
import { ShieldAlert, AlertOctagon, AlertCircle, CheckCircle2, AlertTriangle, Info } from 'lucide-react'
import { NonConformitySeverity } from '../../types'

interface SeverityBadgeProps {
  severity: NonConformitySeverity
  showIcon?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function SeverityBadge({ severity, showIcon = true, size = 'md' }: SeverityBadgeProps) {
  const getSeverityConfig = (severity: NonConformitySeverity) => {
    switch (severity) {
      case 'critical':
        return {
          label: 'Crítica',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          borderColor: 'border-red-200',
          icon: ShieldAlert
        }
      case 'high':
        return {
          label: 'Alta',
          bgColor: 'bg-orange-100',
          textColor: 'text-orange-800',
          borderColor: 'border-orange-200',
          icon: AlertOctagon
        }
      case 'medium':
        return {
          label: 'Média',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          borderColor: 'border-yellow-200',
          icon: AlertCircle
        }
      case 'low':
        return {
          label: 'Baixa',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-200',
          icon: CheckCircle2
        }
      default:
        return {
          label: 'Desconhecida',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-200',
          icon: AlertCircle
        }
    }
  }

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm':
        return {
          container: 'px-2 py-1 text-xs',
          icon: 'w-3 h-3'
        }
      case 'lg':
        return {
          container: 'px-4 py-2 text-base',
          icon: 'w-5 h-5'
        }
      default:
        return {
          container: 'px-3 py-1.5 text-sm',
          icon: 'w-4 h-4'
        }
    }
  }

  const config = getSeverityConfig(severity)
  const sizeClasses = getSizeClasses(size)
  const Icon = config.icon

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${config.bgColor} ${config.textColor} ${config.borderColor} ${sizeClasses.container}`}
    >
      {showIcon && <Icon className={sizeClasses.icon} />}
      {config.label}
    </span>
  )
}

const severityConfig = {
  [NonConformitySeverity.CRITICAL]: {
    label: 'Crítica',
    icon: AlertTriangle,
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    borderColor: 'border-red-200',
    iconColor: 'text-red-600'
  },
  [NonConformitySeverity.HIGH]: {
    label: 'Alta',
    icon: AlertCircle,
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-800',
    borderColor: 'border-orange-200',
    iconColor: 'text-orange-600'
  },
  [NonConformitySeverity.MEDIUM]: {
    label: 'Média',
    icon: AlertTriangle,
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-200',
    iconColor: 'text-yellow-600'
  },
  [NonConformitySeverity.LOW]: {
    label: 'Baixa',
    icon: Info,
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    borderColor: 'border-green-200',
    iconColor: 'text-green-600'
  }
};