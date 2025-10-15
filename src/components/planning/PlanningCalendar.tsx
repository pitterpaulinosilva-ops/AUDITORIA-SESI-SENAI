import { useState } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  addMonths, 
  subMonths,
  isSameDay,
  isToday
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarNavigation } from './CalendarNavigation';
import { CalendarDay } from './CalendarDay';
import { Audit } from '../../types';

interface PlanningCalendarProps {
  audits: Audit[];
  onDayClick: (date: Date, audits: Audit[]) => void;
}

export function PlanningCalendar({ audits, onDayClick }: PlanningCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { locale: ptBR });
  const calendarEnd = endOfWeek(monthEnd, { locale: ptBR });
  
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  });

  const getAuditsForDate = (date: Date) => {
    return audits.filter(audit => 
      audit.scheduledDate && isSameDay(new Date(audit.scheduledDate), date)
    );
  };

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDayClick = (date: Date) => {
    const dayAudits = getAuditsForDate(date);
    onDayClick(date, dayAudits);
  };

  // Dias da semana
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Navegação do calendário */}
      <div className="p-4 border-b border-gray-200">
        <CalendarNavigation
          currentDate={currentDate}
          onPreviousMonth={handlePreviousMonth}
          onNextMonth={handleNextMonth}
          onToday={handleToday}
        />
      </div>

      {/* Cabeçalho dos dias da semana */}
      <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
        {weekDays.map((day) => (
          <div
            key={day}
            className="p-3 text-center text-sm font-medium text-gray-700"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grade do calendário */}
      <div className="grid grid-cols-7 divide-x divide-gray-200">
        {calendarDays.map((day) => {
          const dayAudits = getAuditsForDate(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isTodayDate = isToday(day);

          return (
            <CalendarDay
              key={day.toISOString()}
              date={day}
              audits={dayAudits}
              isToday={isTodayDate}
              isCurrentMonth={isCurrentMonth}
              onClick={() => handleDayClick(day)}
            />
          );
        })}
      </div>
    </div>
  );
}