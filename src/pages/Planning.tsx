import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Plus, Calendar, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { useAuditStore } from '../store';
import { PlanningCalendar } from '../components/planning/PlanningCalendar';
import { CalendarLegend } from '../components/planning/CalendarLegend';
import { PlanningFilters, type PlanningFilters as PlanningFiltersType } from '../components/planning/PlanningFilters';
import { CalendarViewToggle, type CalendarView } from '../components/planning/CalendarViewToggle';
import { WeekView } from '../components/planning/WeekView';
import { ListView } from '../components/planning/ListView';
import { AuditModal } from '../components/planning/AuditModal';
import type { Audit } from '@/types';
import { AuditStatus } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function Planning() {
  const navigate = useNavigate();
  const { audits, createAudit } = useAuditStore();
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedAudits, setSelectedAudits] = useState<Audit[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<CalendarView>('month');
  const [filters, setFilters] = useState<PlanningFiltersType>({
    status: [],
    type: [],
    auditor: [],
    dateRange: { start: null, end: null }
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar auditorias baseado nos filtros aplicados
  const filteredAudits = useMemo(() => {
    return audits.filter(audit => {
      // Filtro por status
      if (filters.status.length > 0 && !filters.status.includes(audit.status)) {
        return false;
      }

      // Filtro por tipo
      if (filters.type.length > 0 && !filters.type.includes(audit.type as any)) {
        return false;
      }

      // Filtro por auditor
      if (filters.auditor.length > 0 && !filters.auditor.includes(audit.auditor)) {
        return false;
      }

      // Filtro por período
      if (filters.dateRange.start || filters.dateRange.end) {
        const auditDate = audit.scheduledDate ? new Date(audit.scheduledDate) : null;
        if (!auditDate) return false;
        
        if (filters.dateRange.start && auditDate < filters.dateRange.start) {
          return false;
        }
        if (filters.dateRange.end && auditDate > filters.dateRange.end) {
          return false;
        }
      }

      // Filtro por busca
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          audit.title.toLowerCase().includes(searchLower) ||
          audit.description?.toLowerCase().includes(searchLower) ||
          audit.auditor.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [audits, filters, searchTerm]);

  // Estatísticas das auditorias
  const stats = useMemo(() => {
    const total = filteredAudits.length;
    const completed = filteredAudits.filter(a => a.status === AuditStatus.COMPLETED).length;
    const inProgress = filteredAudits.filter(a => a.status === AuditStatus.IN_PROGRESS).length;
    const scheduled = filteredAudits.filter(a => a.status === AuditStatus.PLANNED).length;

    return { total, completed, inProgress, scheduled };
  }, [filteredAudits]);

  const handleDayClick = (date: Date, dayAudits: Audit[]) => {
    setSelectedDate(date);
    setSelectedAudits(dayAudits);
    setIsModalOpen(true);
  };

  const handleOpenAudit = (auditId: string) => {
    navigate(`/audits/${auditId}`);
    setIsModalOpen(false);
  };

  const handleCreateAudit = () => {
    if (!selectedDate) return;

    const newAudit = createAudit({
      title: `Nova Auditoria - ${format(selectedDate, 'dd/MM/yyyy', { locale: ptBR })}`,
      description: '',
      type: 'INTERNAL' as any,
      scheduledDate: selectedDate,
      auditor: 'Usuário Atual',
      auditorId: 'user-1',
      estimatedDuration: 4
    });

    navigate(`/audits/${newAudit.id}`);
    setIsModalOpen(false);
  };

  const handleExport = () => {
    // Implementar exportação do cronograma
    console.log('Exportando cronograma...');
  };

  const handleAuditClick = (audit: Audit) => {
    navigate(`/audits/${audit.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cabeçalho */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Planejamento</h1>
              <p className="mt-2 text-gray-600">
                Gerencie o cronograma de auditorias e acompanhe o progresso
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Exportar</span>
              </button>
              
              <button
                onClick={() => navigate('/audits/new')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Nova Auditoria</span>
              </button>
            </div>
          </div>

          {/* Estatísticas rápidas */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Programadas</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.scheduled}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Em Andamento</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Concluídas</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-6">
          <PlanningFilters
            onFiltersChange={setFilters}
            onSearchChange={setSearchTerm}
          />
        </div>

        {/* Controles de visualização */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CalendarViewToggle
            currentView={currentView}
            onViewChange={setCurrentView}
          />
          
          {currentView === 'month' && <CalendarLegend />}
        </div>

        {/* Visualizações */}
        {currentView === 'month' && (
          <PlanningCalendar
            audits={filteredAudits}
            onDayClick={handleDayClick}
          />
        )}

        {currentView === 'week' && (
          <WeekView
            currentDate={new Date()}
            audits={filteredAudits}
            onDayClick={handleDayClick}
          />
        )}

        {currentView === 'list' && (
          <ListView
            audits={filteredAudits}
            onAuditClick={handleAuditClick}
          />
        )}

        {/* Modal de auditoria */}
        <AuditModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          date={selectedDate || new Date()}
          audits={selectedAudits}
          onOpenAudit={handleOpenAudit}
          onCreateAudit={handleCreateAudit}
        />
      </div>
    </div>
  );
}