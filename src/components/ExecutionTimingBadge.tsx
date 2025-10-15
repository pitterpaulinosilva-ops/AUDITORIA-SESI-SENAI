import React from 'react';
import { ExecutionTimingStatus } from '../types';
import { Clock, CheckCircle, AlertTriangle } from 'lucide-react';

interface ExecutionTimingBadgeProps {
  status: ExecutionTimingStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export function ExecutionTimingBadge({ 
  status, 
  size = 'md', 
  showIcon = true 
}: ExecutionTimingBadgeProps) {
  const getStatusConfig = (status: ExecutionTimingStatus) => {
    switch (status) {
      case ExecutionTimingStatus.ON_TIME:
        return {
          label: 'No Prazo',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          borderColor: 'border-blue-200',
          icon: CheckCircle
        };
      case ExecutionTimingStatus.EARLY:
        return {
          label: 'Antecipada',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-200',
          icon: CheckCircle
        };
      case ExecutionTimingStatus.LATE:
        return {
          label: 'Em Atraso',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          borderColor: 'border-red-200',
          icon: AlertTriangle
        };
      default:
        return {
          label: 'Desconhecido',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-200',
          icon: Clock
        };
    }
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'lg':
        return 'px-4 py-2 text-base';
      default:
        return 'px-3 py-1 text-sm';
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;
  const sizeClasses = getSizeClasses(size);

  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-full border font-medium
        ${config.bgColor} ${config.textColor} ${config.borderColor} ${sizeClasses}
      `}
    >
      {showIcon && <Icon className={`${size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'}`} />}
      {config.label}
    </span>
  );
}