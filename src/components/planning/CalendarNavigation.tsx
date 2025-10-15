import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface CalendarNavigationProps {
  currentDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

export function CalendarNavigation({ 
  currentDate, 
  onPreviousMonth, 
  onNextMonth, 
  onToday 
}: CalendarNavigationProps) {
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const currentMonth = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();
  const today = new Date();
  const isCurrentMonth = 
    currentDate.getMonth() === today.getMonth() && 
    currentDate.getFullYear() === today.getFullYear();

  return (
    <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center gap-4">
        <button
          onClick={onPreviousMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Mês anterior"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        
        <h2 className="text-xl font-semibold text-gray-900 min-w-[200px] text-center">
          {currentMonth} {currentYear}
        </h2>
        
        <button
          onClick={onNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Próximo mês"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {!isCurrentMonth && (
        <button
          onClick={onToday}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          <Calendar className="w-4 h-4" />
          <span className="hidden sm:inline">Hoje</span>
        </button>
      )}
    </div>
  );
}