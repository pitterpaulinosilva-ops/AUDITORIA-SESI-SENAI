import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Plus, Calendar, TrendingUp, Clock, CheckCircle, User } from 'lucide-react';
import { useAuditStore } from '../store';
import { PlanningCalendar } from '../components/planning/PlanningCalendar';
import { CalendarLegend } from '../components/planning/CalendarLegend';
import { PlanningFilters } from '../components/planning/PlanningFilters';
import { CalendarViewToggle, type CalendarView } from '../components/planning/CalendarViewToggle';
import { WeekView } from '../components/planning/WeekView';
import { ListView } from '../components/planning/ListView';
import { AuditModal } from '../components/planning/AuditModal';
import { AuditorDashboard } from '../components/planning/AuditorDashboard';
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
  const [currentView, setCurrentView] = useState<CalendarView>('auditor'); // Iniciar com dashboard do auditor

  const [searchTerm, setSearchTerm] = useState('');
  const [showMyAuditsOnly, setShowMyAuditsOnly] = useState(false);
  
  // Simulação do auditor logado - em produção viria do contexto de autenticação
  const currentAuditor = "João Silva";

  // Filtrar auditorias baseado nos filtros aplicados
  const filteredAudits = useMemo(() => {
    return audits.filter(audit => {
      // Filtro "Minhas Auditorias" - prioridade máxima
      if (showMyAuditsOnly && audit.auditor !== currentAuditor) {
        return false;
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
  }, [audits, searchTerm, showMyAuditsOnly, currentAuditor]);

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

  const handleExecuteAudit = (auditId: string) => {
    // Validar se a auditoria pode ser executada
    const audit = audits.find(a => a.id === auditId);
    if (!audit) {
      console.error('Auditoria não encontrada');
      return;
    }

    // Verificar se o status permite execução
    if (audit.status !== AuditStatus.PLANNED && audit.status !== AuditStatus.IN_PROGRESS) {
      console.error('Auditoria não pode ser executada no status atual:', audit.status);
      return;
    }

    // Verificar se existe checklist associado
    if (!audit.checklistId) {
      console.warn('Auditoria sem checklist associado');
      // Ainda permite execução, mas com aviso
    }

    // Verificar se a data de execução é apropriada
    if (audit.scheduledDate) {
      const scheduledDate = new Date(audit.scheduledDate);
      const today = new Date();
      const diffInDays = Math.ceil((scheduledDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffInDays > 7) {
        console.warn('Executando auditoria com mais de 7 dias de antecedência');
      }
    }

    // Navegar para a página de execução
    navigate(`/audits/${auditId}/execute`);
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
              <h1 className="text-3xl font-bold text-gray-900">Execução de Auditoria</h1>
              <p className="mt-2 text-gray-600">
                Visualize e execute suas auditorias programadas
              </p>
            </div>
            

          </div>


        </div>

        {/* Filtros */}
        <div className="mb-6">
          <PlanningFilters
            onSearchChange={setSearchTerm}
          />
        </div>

        {/* Controles de visualização */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <CalendarViewToggle
              currentView={currentView}
              onViewChange={setCurrentView}
            />
            
            {/* Filtro rápido "Minhas Auditorias" */}
            <button
              onClick={() => setShowMyAuditsOnly(!showMyAuditsOnly)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                showMyAuditsOnly
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <User className="w-4 h-4" />
              Minhas Auditorias
            </button>
          </div>
          
          {currentView === 'month' && <CalendarLegend />}
        </div>

        {/* Visualizações */}
        {currentView === 'auditor' && (
          <AuditorDashboard
            onAuditClick={handleAuditClick}
            onExecuteAudit={handleExecuteAudit}
            currentAuditor={currentAuditor}
          />
        )}

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
            onExecuteAudit={handleExecuteAudit}
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
          onExecuteAudit={handleExecuteAudit}
        />
      </div>
    </div>
  );
}