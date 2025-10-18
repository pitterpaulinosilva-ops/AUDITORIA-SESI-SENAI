import { Calendar, List, Grid, User } from 'lucide-react';

export type CalendarView = 'month' | 'week' | 'list' | 'auditor';

interface CalendarViewToggleProps {
  currentView: CalendarView;
  onViewChange: (view: CalendarView) => void;
}

export function CalendarViewToggle({ currentView, onViewChange }: CalendarViewToggleProps) {
  const views = [
    { key: 'auditor' as CalendarView, label: 'Auditor', icon: User },
    { key: 'month' as CalendarView, label: 'Mês', icon: Calendar },
    { key: 'week' as CalendarView, label: 'Semana', icon: Grid },
    { key: 'list' as CalendarView, label: 'Lista', icon: List }
  ];

  return (
    <div className="flex bg-gray-100 rounded-lg p-1">
      {views.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => onViewChange(key)}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            currentView === key
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Icon className="w-4 h-4" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}