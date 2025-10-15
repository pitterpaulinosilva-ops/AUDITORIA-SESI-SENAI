import { AuditStatus } from '../../types';
import { AuditIndicator } from './AuditIndicator';

export function CalendarLegend() {
  const legendItems = [
    { status: AuditStatus.COMPLETED, label: 'Concluídas' },
    { status: AuditStatus.IN_PROGRESS, label: 'Em Andamento' },
    { status: AuditStatus.SCHEDULED, label: 'Programadas' },
    { status: AuditStatus.DRAFT, label: 'Rascunhos' }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-medium text-gray-900 mb-3">Legenda</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {legendItems.map((item) => (
          <div key={item.status} className="flex items-center gap-2">
            <AuditIndicator status={item.status} size="md" />
            <span className="text-sm text-gray-600">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}