import { AuditStatus, NonConformityStatus } from '@/types';

interface StatusBadgeProps {
  status: AuditStatus | NonConformityStatus | string;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig = {
  // Status de Auditoria (usando valores corretos dos enums)
  [AuditStatus.PLANNED]: {
    label: 'Planejada',
    className: 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border-blue-300 shadow-sm hover:shadow-md transition-all duration-200'
  },
  [AuditStatus.IN_PROGRESS]: {
    label: 'Em Andamento',
    className: 'bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-800 border-yellow-300 shadow-sm hover:shadow-md transition-all duration-200'
  },
  [AuditStatus.COMPLETED]: {
    label: 'Concluída',
    className: 'bg-gradient-to-r from-green-50 to-green-100 text-green-800 border-green-300 shadow-sm hover:shadow-md transition-all duration-200'
  },
  [AuditStatus.CANCELLED]: {
    label: 'Cancelada',
    className: 'bg-gradient-to-r from-red-50 to-red-100 text-red-800 border-red-300 shadow-sm hover:shadow-md transition-all duration-200'
  },
  // Status de Não Conformidade
  [NonConformityStatus.OPEN]: {
    label: 'Aberta',
    className: 'bg-gradient-to-r from-red-50 to-red-100 text-red-800 border-red-300 shadow-sm hover:shadow-md transition-all duration-200'
  },
  [NonConformityStatus.IN_TREATMENT]: {
    label: 'Em Tratamento',
    className: 'bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-800 border-yellow-300 shadow-sm hover:shadow-md transition-all duration-200'
  },
  [NonConformityStatus.IN_PROGRESS]: {
    label: 'Em Progresso',
    className: 'bg-gradient-to-r from-orange-50 to-orange-100 text-orange-800 border-orange-300 shadow-sm hover:shadow-md transition-all duration-200'
  },
  [NonConformityStatus.CLOSED]: {
    label: 'Fechada',
    className: 'bg-gradient-to-r from-green-50 to-green-100 text-green-800 border-green-300 shadow-sm hover:shadow-md transition-all duration-200'
  },
  [NonConformityStatus.RESOLVED]: {
    label: 'Resolvida',
    className: 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-800 border-emerald-300 shadow-sm hover:shadow-md transition-all duration-200'
  },
  [NonConformityStatus.CANCELLED]: {
    label: 'NC Cancelada',
    className: 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 border-gray-300 shadow-sm hover:shadow-md transition-all duration-200'
  }
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base'
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status as keyof typeof statusConfig];
  
  if (!config) {
    return (
      <span className={`inline-flex items-center rounded-full border font-semibold ${sizeClasses[size]} bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 border-gray-300 shadow-sm hover:shadow-md transition-all duration-200`}>
        {typeof status === 'string' ? status : String(status)}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center rounded-full border font-semibold ${sizeClasses[size]} ${config.className}`}>
      {config.label}
    </span>
  );
}