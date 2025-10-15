import { AuditStatus, NonConformityStatus } from '../types';

interface StatusBadgeProps {
  status: AuditStatus | NonConformityStatus;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig = {
  // Status de Auditoria
  planejada: {
    label: 'Planejada',
    className: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  em_andamento: {
    label: 'Em Andamento',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  },
  concluida: {
    label: 'Concluída',
    className: 'bg-green-100 text-green-800 border-green-200'
  },
  cancelada: {
    label: 'Cancelada',
    className: 'bg-red-100 text-red-800 border-red-200'
  },
  // Status de Não Conformidade
  aberta: {
    label: 'Aberta',
    className: 'bg-red-100 text-red-800 border-red-200'
  },
  em_tratamento: {
    label: 'Em Tratamento',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  },
  fechada: {
    label: 'Fechada',
    className: 'bg-green-100 text-green-800 border-green-200'
  }
};

const sizeClasses = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-2 text-base'
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  if (!config) {
    return (
      <span className={`inline-flex items-center rounded-full border font-medium ${sizeClasses[size]} bg-gray-100 text-gray-800 border-gray-200`}>
        {status}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center rounded-full border font-medium ${sizeClasses[size]} ${config.className}`}>
      {config.label}
    </span>
  );
}