import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  DashboardMetrics, 
  AuditorMetric, 
  DepartmentMetric, 
  TrendData, 
  DateRange,
  ReportConfig,
  ReportSchedule,
  ExportOptions,
  AlertConfig,
  CustomReportBuilder,
  Audit,
  NonConformity,
  AuditStatus,
  NonConformitySeverity,
  NonConformityStatus,
  AuditReportFilters,
  AuditReportData,
  ReportExportOptions
} from '../types';
import { differenceInDays, format, subDays, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

interface ReportsState {
  // Estado
  dashboardMetrics: DashboardMetrics | null;
  trendData: any;
  alerts: any[];
  reportConfigs: ReportConfig[];
  reportSchedules: ReportSchedule[];
  alertConfigs: AlertConfig[];
  isLoading: boolean;
  error: string | null;
  
  // Novos campos para relatórios de auditoria
  auditReportData: AuditReportData[] | null;
  
  // Ações
  generateDashboardMetrics: (dateRange?: DateRange) => void;
  generateTrendData: (dateRange?: DateRange) => void;
  generateAlerts: () => void;
  calculateAuditorMetrics: (audits: Audit[], dateRange?: DateRange) => AuditorMetric[];
  calculateDepartmentMetrics: (audits: Audit[], nonConformities: NonConformity[], dateRange?: DateRange) => DepartmentMetric[];
  
  // Novas ações para relatórios de auditoria
  generateAuditReport: (filters: AuditReportFilters) => void;
  exportReport: (options: ReportExportOptions, filters: AuditReportFilters) => Promise<void>;
  
  // Filtros e processamento
  filterAuditsByDateRange: (audits: Audit[], dateRange: DateRange) => Audit[];
  filterNonConformitiesByDateRange: (nonConformities: NonConformity[], dateRange: DateRange) => NonConformity[];
  
  // Configurações de relatórios
  saveReportConfig: (config: Omit<ReportConfig, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateReportConfig: (id: string, config: Partial<ReportConfig>) => void;
  deleteReportConfig: (id: string) => void;
  
  // Agendamento
  saveReportSchedule: (schedule: Omit<ReportSchedule, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateReportSchedule: (id: string, schedule: Partial<ReportSchedule>) => void;
  deleteReportSchedule: (id: string) => void;
  
  // Alertas
  saveAlertConfig: (alert: Omit<AlertConfig, 'id'>) => void;
  updateAlertConfig: (id: string, alert: Partial<AlertConfig>) => void;
  deleteAlertConfig: (id: string) => void;
  checkAlerts: (metrics: DashboardMetrics) => AlertConfig[];
  
  // Exportação (mantida para compatibilidade)
  exportReportLegacy: (data: any, options: ExportOptions) => Promise<void>;
  
  // Utilitários
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useReportsStore = create<ReportsState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      dashboardMetrics: null,
      trendData: {
        audits: [],
        nonConformitiesBySeverity: [],
        auditsByStatus: []
      },
      alerts: [],
      reportConfigs: [],
      reportSchedules: [],
      alertConfigs: [],
      isLoading: false,
      error: null,
      
      // Novos campos
      auditReportData: null,

      // Geração de métricas do dashboard
      generateDashboardMetrics: (dateRange?: DateRange) => {
        set({ isLoading: true, error: null });
        
        try {
          // Mock data para demonstração
          const mockAudits: Audit[] = [];
          const mockNonConformities: NonConformity[] = [];
          
          const filteredAudits = dateRange ? get().filterAuditsByDateRange(mockAudits, dateRange) : mockAudits;
          const filteredNCs = dateRange ? get().filterNonConformitiesByDateRange(mockNonConformities, dateRange) : mockNonConformities;
          
          // Métricas de auditorias
          const totalAudits = filteredAudits.length;
          const completedAudits = filteredAudits.filter(a => a.status === AuditStatus.COMPLETED).length;
          const pendingAudits = filteredAudits.filter(a => a.status === AuditStatus.IN_PROGRESS).length;
          const overdueAudits = filteredAudits.filter(a => {
            if (a.status === AuditStatus.COMPLETED) return false;
            return new Date() > new Date(a.plannedEndDate);
          }).length;
          
          const completionRate = totalAudits > 0 ? (completedAudits / totalAudits) * 100 : 0;
          const averageScore = filteredAudits
            .filter(a => a.score !== undefined)
            .reduce((sum, a) => sum + (a.score || 0), 0) / 
            (filteredAudits.filter(a => a.score !== undefined).length || 1);

          // Métricas de não conformidades
          const totalNCs = filteredNCs.length;
          const criticalNCs = filteredNCs.filter(nc => nc.severity === NonConformitySeverity.CRITICAL).length;
          const highNCs = filteredNCs.filter(nc => nc.severity === NonConformitySeverity.HIGH).length;
          const mediumNCs = filteredNCs.filter(nc => nc.severity === NonConformitySeverity.MEDIUM).length;
          const lowNCs = filteredNCs.filter(nc => nc.severity === NonConformitySeverity.LOW).length;
          const resolvedNCs = filteredNCs.filter(nc => nc.status === NonConformityStatus.CLOSED).length;
          
          const resolutionRate = totalNCs > 0 ? (resolvedNCs / totalNCs) * 100 : 0;
          const averageResolutionTime = filteredNCs
            .filter(nc => nc.closedAt)
            .reduce((sum, nc) => {
              const days = differenceInDays(new Date(nc.closedAt!), new Date(nc.createdAt));
              return sum + days;
            }, 0) / (filteredNCs.filter(nc => nc.closedAt).length || 1);

          // Métricas de performance
          const auditorsProductivity = get().calculateAuditorMetrics(filteredAudits, dateRange);
          const departmentCompliance = get().calculateDepartmentMetrics(filteredAudits, filteredNCs, dateRange);
          const trendsData = get().generateTrendData(filteredAudits, filteredNCs, dateRange);
          
          const averageAuditTime = filteredAudits
            .filter(a => a.actualStartDate && a.actualEndDate)
            .reduce((sum, a) => {
              const days = differenceInDays(new Date(a.actualEndDate!), new Date(a.actualStartDate!));
              return sum + days;
            }, 0) / (filteredAudits.filter(a => a.actualStartDate && a.actualEndDate).length || 1);

          const metrics: DashboardMetrics = {
            audits: {
              total: totalAudits,
              completed: completedAudits,
              pending: pendingAudits,
              overdue: overdueAudits,
              completionRate,
              averageScore
            },
            nonConformities: {
              total: totalNCs,
              critical: criticalNCs,
              high: highNCs,
              medium: mediumNCs,
              low: lowNCs,
              resolved: resolvedNCs,
              resolutionRate,
              averageResolutionTime
            },
            performance: {
              averageAuditTime,
              auditorsProductivity,
              departmentCompliance,
              trendsData
            }
          };

          set({ dashboardMetrics: metrics, isLoading: false });
        } catch (error) {
          set({ error: 'Erro ao gerar métricas do dashboard', isLoading: false });
        }
      },

      // Cálculo de métricas por auditor
      calculateAuditorMetrics: (audits: Audit[], dateRange?: DateRange): AuditorMetric[] => {
        const filteredAudits = dateRange ? get().filterAuditsByDateRange(audits, dateRange) : audits;
        const auditorMap = new Map<string, AuditorMetric>();

        filteredAudits.forEach(audit => {
          if (!auditorMap.has(audit.auditorId)) {
            auditorMap.set(audit.auditorId, {
              auditorId: audit.auditorId,
              auditorName: audit.auditor,
              totalAudits: 0,
              completedAudits: 0,
              averageTime: 0,
              averageScore: 0,
              complianceRate: 0,
              efficiency: 0,
              nonConformitiesFound: 0
            });
          }

          const metric = auditorMap.get(audit.auditorId)!;
          metric.totalAudits++;
          
          if (audit.status === AuditStatus.COMPLETED) {
            metric.completedAudits++;
            
            if (audit.actualStartDate && audit.actualEndDate) {
              const auditTime = differenceInDays(new Date(audit.actualEndDate), new Date(audit.actualStartDate));
              metric.averageTime = (metric.averageTime * (metric.completedAudits - 1) + auditTime) / metric.completedAudits;
            }
            
            if (audit.score !== undefined) {
              metric.averageScore = (metric.averageScore * (metric.completedAudits - 1) + audit.score) / metric.completedAudits;
            }
          }
          
          metric.nonConformitiesFound += audit.nonConformities.length;
        });

        return Array.from(auditorMap.values()).map(metric => ({
          ...metric,
          complianceRate: metric.totalAudits > 0 ? (metric.completedAudits / metric.totalAudits) * 100 : 0,
          efficiency: metric.averageTime > 0 ? Math.max(0, 100 - (metric.averageTime * 10)) : 0
        }));
      },

      // Cálculo de métricas por departamento
      calculateDepartmentMetrics: (audits: Audit[], nonConformities: NonConformity[], dateRange?: DateRange): DepartmentMetric[] => {
        const filteredAudits = dateRange ? get().filterAuditsByDateRange(audits, dateRange) : audits;
        const filteredNCs = dateRange ? get().filterNonConformitiesByDateRange(nonConformities, dateRange) : nonConformities;
        const departmentMap = new Map<string, DepartmentMetric>();

        filteredAudits.forEach(audit => {
          if (!departmentMap.has(audit.department)) {
            departmentMap.set(audit.department, {
              department: audit.department,
              totalAudits: 0,
              completedAudits: 0,
              averageScore: 0,
              complianceRate: 0,
              nonConformitiesCount: 0,
              improvementTrend: 'stable'
            });
          }

          const metric = departmentMap.get(audit.department)!;
          metric.totalAudits++;
          
          if (audit.status === AuditStatus.COMPLETED) {
            metric.completedAudits++;
            
            if (audit.score !== undefined) {
              metric.averageScore = (metric.averageScore * (metric.completedAudits - 1) + audit.score) / metric.completedAudits;
            }
          }
        });

        // Contar não conformidades por departamento
        filteredNCs.forEach(nc => {
          const audit = filteredAudits.find(a => a.id === nc.auditId);
          if (audit && departmentMap.has(audit.department)) {
            departmentMap.get(audit.department)!.nonConformitiesCount++;
          }
        });

        return Array.from(departmentMap.values()).map(metric => ({
          ...metric,
          complianceRate: metric.totalAudits > 0 ? (metric.completedAudits / metric.totalAudits) * 100 : 0
        }));
      },

      // Geração de dados de tendência
      generateTrendData: (dateRange?: DateRange) => {
        const range = dateRange || {
          startDate: subDays(new Date(), 90),
          endDate: new Date()
        };

        // Mock data para demonstração
        const mockTrendData = {
          audits: [
            { period: 'Jan 2024', value: 15 },
            { period: 'Fev 2024', value: 18 },
            { period: 'Mar 2024', value: 22 }
          ],
          nonConformitiesBySeverity: [
            { label: 'Crítica', value: 5 },
            { label: 'Alta', value: 12 },
            { label: 'Média', value: 8 }
          ],
          auditsByStatus: [
            { label: 'Concluídas', value: 45 },
            { label: 'Em Progresso', value: 12 },
            { label: 'Planejadas', value: 8 }
          ]
        };

        set({ trendData: mockTrendData, isLoading: false });
      },

      // Geração de alertas
      generateAlerts: () => {
        const mockAlerts = [
          {
            id: '1',
            type: 'warning' as const,
            title: 'Auditorias Pendentes',
            message: '5 auditorias estão atrasadas e precisam de atenção',
            timestamp: new Date(),
            isRead: false
          },
          {
            id: '2',
            type: 'critical' as const,
            title: 'Não Conformidades Críticas',
            message: '2 não conformidades críticas foram identificadas',
            timestamp: new Date(),
            isRead: false
          }
        ];
        
        set({ alerts: mockAlerts });
      },

      // Filtros por data
      filterAuditsByDateRange: (audits: Audit[], dateRange: DateRange): Audit[] => {
        return audits.filter(audit => 
          isWithinInterval(new Date(audit.createdAt), { 
            start: dateRange.startDate, 
            end: dateRange.endDate 
          })
        );
      },

      filterNonConformitiesByDateRange: (nonConformities: NonConformity[], dateRange: DateRange): NonConformity[] => {
        return nonConformities.filter(nc => 
          isWithinInterval(new Date(nc.createdAt), { 
            start: dateRange.startDate, 
            end: dateRange.endDate 
          })
        );
      },

      // Configurações de relatórios
      saveReportConfig: (config) => {
        const newConfig: ReportConfig = {
          ...config,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        set(state => ({
          reportConfigs: [...state.reportConfigs, newConfig]
        }));
      },

      updateReportConfig: (id, config) => {
        set(state => ({
          reportConfigs: state.reportConfigs.map(rc => 
            rc.id === id ? { ...rc, ...config, updatedAt: new Date() } : rc
          )
        }));
      },

      deleteReportConfig: (id) => {
        set(state => ({
          reportConfigs: state.reportConfigs.filter(rc => rc.id !== id)
        }));
      },

      // Agendamento
      saveReportSchedule: (schedule) => {
        const newSchedule: ReportSchedule = {
          ...schedule,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        set(state => ({
          reportSchedules: [...state.reportSchedules, newSchedule]
        }));
      },

      updateReportSchedule: (id, schedule) => {
        set(state => ({
          reportSchedules: state.reportSchedules.map(rs => 
            rs.id === id ? { ...rs, ...schedule, updatedAt: new Date() } : rs
          )
        }));
      },

      deleteReportSchedule: (id) => {
        set(state => ({
          reportSchedules: state.reportSchedules.filter(rs => rs.id !== id)
        }));
      },

      // Alertas
      saveAlertConfig: (alert) => {
        const newAlert: AlertConfig = {
          ...alert,
          id: crypto.randomUUID()
        };
        
        set(state => ({
          alertConfigs: [...state.alertConfigs, newAlert]
        }));
      },

      updateAlertConfig: (id, alert) => {
        set(state => ({
          alertConfigs: state.alertConfigs.map(ac => 
            ac.id === id ? { ...ac, ...alert } : ac
          )
        }));
      },

      deleteAlertConfig: (id) => {
        set(state => ({
          alertConfigs: state.alertConfigs.filter(ac => ac.id !== id)
        }));
      },

      checkAlerts: (metrics) => {
        const { alertConfigs } = get();
        const triggeredAlerts: AlertConfig[] = [];

        alertConfigs.forEach(alert => {
          if (!alert.isActive) return;

          let shouldTrigger = false;

          switch (alert.type) {
            case 'critical_nc':
              shouldTrigger = metrics.nonConformities.critical >= alert.threshold;
              break;
            case 'overdue_audit':
              shouldTrigger = metrics.audits.overdue >= alert.threshold;
              break;
            case 'low_compliance':
              shouldTrigger = metrics.audits.completionRate <= alert.threshold;
              break;
            case 'performance_drop':
              shouldTrigger = metrics.audits.averageScore <= alert.threshold;
              break;
          }

          if (shouldTrigger) {
            triggeredAlerts.push(alert);
          }
        });

        return triggeredAlerts;
      },

      // Geração de relatório de auditoria
      generateAuditReport: (filters: AuditReportFilters) => {
        set({ isLoading: true });
        
        try {
          // Simular dados de auditoria baseados nos filtros
          const mockAudits: AuditReportData[] = [
            {
              id: '1',
              title: 'Auditoria de Qualidade - Produção',
              type: 'interna',
              auditor: 'João Silva',
              sector: 'Produção',
              process: 'Controle de Qualidade',
              subprocess: 'Inspeção Final',
              startDate: new Date('2024-01-15'),
              endDate: new Date('2024-01-20'),
              status: 'completed'
            },
            {
              id: '2',
              title: 'Auditoria Externa ISO 9001',
              type: 'externa',
              auditor: 'Maria Santos',
              sector: 'Administração',
              process: 'Gestão da Qualidade',
              subprocess: 'Documentação',
              startDate: new Date('2024-01-10'),
              endDate: new Date('2024-01-12'),
              status: 'completed'
            },
            {
              id: '3',
              title: 'Auditoria de Fornecedor - ABC Corp',
              type: 'fornecedor',
              auditor: 'Carlos Oliveira',
              sector: 'Compras',
              process: 'Avaliação de Fornecedores',
              subprocess: 'Qualificação',
              startDate: new Date('2024-01-25'),
              endDate: new Date('2024-01-26'),
              status: 'in_progress'
            }
          ];

          // Aplicar filtros
          let filteredAudits = mockAudits.filter(audit => {
            // Filtro por período
            const auditInPeriod = audit.startDate >= filters.periodStart && 
                                 audit.endDate <= filters.periodEnd;
            
            // Filtro por tipo
            const typeMatch = filters.auditType === 'all' || audit.type === filters.auditType;
            
            // Filtro por auditor
            const auditorMatch = !filters.auditorName || 
                                audit.auditor.toLowerCase().includes(filters.auditorName.toLowerCase());
            
            // Filtro por setor
            const sectorMatch = !filters.auditedSector || 
                               audit.sector.toLowerCase().includes(filters.auditedSector.toLowerCase());
            
            // Filtro por processo
            const processMatch = !filters.auditedProcess || 
                                audit.process.toLowerCase().includes(filters.auditedProcess.toLowerCase());
            
            // Filtro por subprocesso
            const subprocessMatch = !filters.auditedSubprocess || 
                                   audit.subprocess.toLowerCase().includes(filters.auditedSubprocess.toLowerCase());
            
            return auditInPeriod && typeMatch && auditorMatch && sectorMatch && processMatch && subprocessMatch;
          });

          set({ auditReportData: filteredAudits, isLoading: false });
        } catch (error) {
          set({ error: 'Erro ao gerar relatório de auditoria', isLoading: false });
        }
      },

      // Nova função de exportação para relatórios de auditoria
      exportReport: async (options: ReportExportOptions, filters: AuditReportFilters) => {
        set({ isLoading: true });
        
        try {
          const { auditReportData } = get();
          
          if (!auditReportData || auditReportData.length === 0) {
            throw new Error('Nenhum dado para exportar');
          }

          const fileName = options.fileName || `relatorio-auditorias-${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}`;
          
          if (options.format === 'pdf') {
            // Simular exportação PDF
            console.log('Exportando para PDF:', { data: auditReportData, options, filters });
            
            // Em um cenário real, aqui seria usado uma biblioteca como jsPDF ou similar
            const pdfContent = `Relatório de Auditorias\n\nPeríodo: ${filters.periodStart.toLocaleDateString('pt-BR')} - ${filters.periodEnd.toLocaleDateString('pt-BR')}\nTotal de auditorias: ${auditReportData.length}\n\n${auditReportData.map(audit => `${audit.title} - ${audit.auditor} - ${audit.sector}`).join('\n')}`;
            
            const blob = new Blob([pdfContent], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${fileName}.pdf`;
            a.click();
            URL.revokeObjectURL(url);
            
          } else if (options.format === 'excel') {
            // Simular exportação Excel
            console.log('Exportando para Excel:', { data: auditReportData, options, filters });
            
            // Converter dados para CSV (simulando Excel)
            const headers = ['Título', 'Tipo', 'Auditor', 'Setor', 'Processo', 'Subprocesso', 'Data Início', 'Data Fim', 'Status'];
            const csvContent = [
              headers.join(','),
              ...auditReportData.map(audit => [
                audit.title,
                audit.type === 'interna' ? 'Interna' : audit.type === 'externa' ? 'Externa' : 'Fornecedor',
                audit.auditor,
                audit.sector,
                audit.process,
                audit.subprocess,
                audit.startDate.toLocaleDateString('pt-BR'),
                audit.endDate.toLocaleDateString('pt-BR'),
                audit.status === 'completed' ? 'Concluída' : audit.status === 'in_progress' ? 'Em Andamento' : 'Planejada'
              ].join(','))
            ].join('\n');
            
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${fileName}.xlsx`;
            a.click();
            URL.revokeObjectURL(url);
          }
          
          set({ isLoading: false });
        } catch (error) {
          set({ error: 'Erro ao exportar relatório', isLoading: false });
        }
      },

      // Exportação (implementação básica - mantida para compatibilidade)
      exportReportLegacy: async (data, options) => {
        set({ isLoading: true });
        
        try {
          // Implementação básica de exportação
          // Em um cenário real, isso seria mais complexo
          const fileName = options.fileName || `relatorio_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}`;
          
          if (options.format === 'csv') {
            const csvContent = JSON.stringify(data);
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${fileName}.csv`;
            a.click();
            URL.revokeObjectURL(url);
          }
          
          set({ isLoading: false });
        } catch (error) {
          set({ error: 'Erro ao exportar relatório', isLoading: false });
        }
      },

      // Utilitários
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null })
    }),
    {
      name: 'reports-storage',
      partialize: (state) => ({
        reportConfigs: state.reportConfigs,
        reportSchedules: state.reportSchedules,
        alertConfigs: state.alertConfigs
      })
    }
  )
);