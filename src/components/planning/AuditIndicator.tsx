import { AuditStatus } from '../../types';

interface AuditIndicatorProps {
  status: AuditStatus;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function AuditIndicator({ status, count = 1, size = 'md' }: AuditIndicatorProps) {
  const getStatusConfig = (status: AuditStatus) => {
    switch (status) {
      case AuditStatus.COMPLETED:
        return {
          color: 'bg-green-500',
          textColor: 'text-green-700',
          label: 'Concluída'
        };
      case AuditStatus.IN_PROGRESS:
        return {
          color: 'bg-blue-500',
          textColor: 'text-blue-700',
          label: 'Em Andamento'
        };
      case AuditStatus.PLANNED:
        return {
          color: 'bg-orange-500',
          textColor: 'text-orange-700',
          label: 'Planejada'
        };
      default:
        return {
          color: 'bg-gray-400',
          textColor: 'text-gray-600',
          label: 'Indefinido'
        };
    }
  };

  const config = getStatusConfig(status);
  
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  return (
    <div className="flex items-center gap-1">
      <div 
        className={`${config.color} ${sizeClasses[size]} rounded-full flex items-center justify-center`}
        title={`${config.label}${count > 1 ? ` (${count})` : ''}`}
      >
        {count > 1 && size !== 'sm' && (
          <span className="text-white text-xs font-bold">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </div>
      {count > 1 && size === 'sm' && (
        <span className={`text-xs font-medium ${config.textColor}`}>
          {count}
        </span>
      )}
    </div>
  );
}