import { Audit } from '../../types';
import { AuditIndicator } from './AuditIndicator';

interface CalendarDayProps {
  date: Date;
  audits: Audit[];
  isToday: boolean;
  isCurrentMonth: boolean;
  onClick: (date: Date, audits: Audit[]) => void;
}

export function CalendarDay({ 
  date, 
  audits, 
  isToday, 
  isCurrentMonth, 
  onClick 
}: CalendarDayProps) {
  const dayNumber = date.getDate();
  const hasAudits = audits.length > 0;
  
  // Agrupar auditorias por status
  const auditsByStatus = audits.reduce((acc, audit) => {
    if (!acc[audit.status]) {
      acc[audit.status] = [];
    }
    acc[audit.status].push(audit);
    return acc;
  }, {} as Record<string, Audit[]>);

  const handleClick = () => {
    onClick(date, audits);
  };

  return (
    <div
      onClick={handleClick}
      className={`
        relative min-h-[80px] p-2 border border-gray-200 cursor-pointer transition-all duration-200
        ${isCurrentMonth ? 'bg-white hover:bg-blue-50' : 'bg-gray-50 text-gray-400'}
        ${isToday ? 'ring-2 ring-blue-500 bg-blue-50' : ''}
        ${hasAudits ? 'hover:shadow-md' : ''}
      `}
    >
      {/* Número do dia */}
      <div className={`
        text-sm font-medium mb-1
        ${isToday ? 'text-blue-600 font-bold' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
      `}>
        {dayNumber}
      </div>

      {/* Indicadores de auditorias */}
      {hasAudits && (
        <div className="space-y-1">
          {Object.entries(auditsByStatus).map(([status, statusAudits]) => (
            <div key={status} className="flex items-center justify-between">
              <AuditIndicator 
                status={status as any} 
                count={statusAudits.length}
                size="sm"
              />
              {statusAudits.length === 1 && (
                <div className="text-xs text-gray-600 truncate max-w-[60px]" title={statusAudits[0].title}>
                  {statusAudits[0].title}
                </div>
              )}
            </div>
          ))}
          
          {/* Indicador de múltiplas auditorias */}
          {audits.length > 3 && (
            <div className="text-xs text-gray-500 text-center">
              +{audits.length - 3} mais
            </div>
          )}
        </div>
      )}

      {/* Indicador visual para hoje */}
      {isToday && (
        <div className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
      )}
    </div>
  );
}