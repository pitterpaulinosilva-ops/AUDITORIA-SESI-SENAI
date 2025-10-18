import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Audit } from '../../types';
import { AuditIndicator } from './AuditIndicator';

interface WeekViewProps {
  currentDate: Date;
  audits: Audit[];
  onDayClick: (date: Date, audits: Audit[]) => void;
}

export function WeekView({ currentDate, audits, onDayClick }: WeekViewProps) {
  const weekStart = startOfWeek(currentDate, { locale: ptBR });
  const weekEnd = endOfWeek(currentDate, { locale: ptBR });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const getAuditsForDate = (date: Date) => {
    return audits.filter(audit => 
      audit.scheduledDate && isSameDay(new Date(audit.scheduledDate), date)
    );
  };

  const groupAuditsByStatus = (audits: Audit[]) => {
    return audits.reduce((acc, audit) => {
      acc[audit.status] = (acc[audit.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Cabeçalho da semana */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          {format(weekStart, 'dd MMM', { locale: ptBR })} - {format(weekEnd, 'dd MMM yyyy', { locale: ptBR })}
        </h3>
      </div>

      {/* Dias da semana */}
      <div className="grid grid-cols-1 sm:grid-cols-7 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
        {weekDays.map((day) => {
          const dayAudits = getAuditsForDate(day);
          const auditsByStatus = groupAuditsByStatus(dayAudits);
          const isCurrentDay = isToday(day);

          return (
            <div
              key={day.toISOString()}
              className={`p-3 min-h-[120px] cursor-pointer hover:bg-gray-50 transition-colors ${
                isCurrentDay ? 'bg-blue-50' : ''
              }`}
              onClick={() => onDayClick(day, dayAudits)}
            >
              {/* Cabeçalho do dia */}
              <div className="flex items-center justify-between mb-2">
                <div className="text-center">
                  <div className="text-xs text-gray-500 uppercase">
                    {format(day, 'EEE', { locale: ptBR })}
                  </div>
                  <div className={`text-lg font-semibold ${
                    isCurrentDay ? 'text-blue-600' : 'text-gray-900'
                  }`}>
                    {format(day, 'd')}
                  </div>
                </div>
                
                {dayAudits.length > 0 && (
                  <div className="text-xs text-gray-500">
                    {dayAudits.length} audit{dayAudits.length > 1 ? 's' : ''}
                  </div>
                )}
              </div>

              {/* Indicadores de auditorias */}
              <div className="space-y-1">
                {Object.entries(auditsByStatus).map(([status, count]) => (
                  <AuditIndicator
                    key={status}
                    status={status as any}
                    count={count}
                    size="sm"
                  />
                ))}
              </div>

              {/* Lista de auditorias (máximo 3 visíveis) */}
              <div className="mt-2 space-y-1">
                {dayAudits.slice(0, 3).map((audit, auditIndex) => (
                  <div
            key={`${audit.id}-${auditIndex}`}
            className="text-xs p-1 rounded bg-gray-100 text-gray-700 truncate"
            title={audit.title}
          >
                    {audit.title}
                  </div>
                ))}
                {dayAudits.length > 3 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{dayAudits.length - 3} mais
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}