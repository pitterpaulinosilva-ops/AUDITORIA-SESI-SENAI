import React, { useEffect, useState } from 'react';
import { useReportsStore } from '../../stores/reportsStore';
import { useAuditProStore } from '../../store';
import { MetricCard } from '../../components/reports/MetricCard';
import { TrendChart } from '../../components/reports/TrendChart';
import { ReportFilters } from '../../components/reports/ReportFilters';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  Calendar,
  User,
  Building
} from 'lucide-react';
import { DateRange, AuditFilters } from '../../types';

export const AuditReports: React.FC = () => {
  const {
    dashboardMetrics,
    trendData,
    isLoading,
    generateDashboardMetrics,
    generateTrendData,
    exportReport
  } = useReportsStore();

  const { audits } = useAuditProStore();

  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date()
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<AuditFilters>({});

  useEffect(() => {
    generateDashboardMetrics(dateRange);
    generateTrendData(dateRange);
  }, [dateRange, generateDashboardMetrics, generateTrendData]);

  const handleExport = async (format: 'pdf' | 'excel', options: any) => {
    await exportReport({
      format,
      includeCharts: options.includeCharts,
      includeDetails: options.includeRawData,
      fileName: options.fileName || `audit-report-${new Date().toISOString().split('T')[0]}`
    }, {
      periodStart: dateRange.startDate,
      periodEnd: dateRange.endDate,
      auditType: 'all',
      auditorName: '',
      auditedSector: '',
      auditedProcess: '',
      auditedSubprocess: ''
    });
  };

  const filteredAudits = audits.filter(audit => {
    const matchesSearch = !searchTerm || 
      audit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      audit.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDateRange = 
      new Date(audit.scheduledDate) >= dateRange.startDate &&
      new Date(audit.scheduledDate) <= dateRange.endDate;

    const matchesStatus = !filters.status || filters.status.includes(audit.status);
    const matchesType = !filters.type || filters.type.includes(audit.type as any);
    const matchesAuditor = !filters.auditor || filters.auditor.includes(audit.auditorId);

    return matchesSearch && matchesDateRange && matchesStatus && matchesType && matchesAuditor;
  });

  const auditsByStatus = filteredAudits.reduce((acc, audit) => {
    acc[audit.status] = (acc[audit.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const auditsByType = filteredAudits.reduce((acc, audit) => {
    acc[audit.type] = (acc[audit.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const completionRate = filteredAudits.length > 0 
    ? Math.round((auditsByStatus.completed || 0) / filteredAudits.length * 100)
    : 0;

  const averageTime = filteredAudits
    .filter(audit => audit.status === 'completed' && audit.executionNote)
    .reduce((acc, audit) => {
      const startDate = new Date(audit.scheduledDate);
      const endDate = audit.executionNote?.executedAt ? new Date(audit.executionNote.executedAt) : new Date();
      const diffDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      return acc + diffDays;
    }, 0) / Math.max(auditsByStatus.completed || 1, 1);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Relatórios de Auditorias</h1>
          <p className="text-gray-600">Análise detalhada das auditorias realizadas</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <ReportFilters
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onExport={handleExport}
            showAdvancedFilters={true}
            filters={filters}
            onFiltersChange={setFilters}
          />
        </div>
      </div>

      {/* KPIs das Auditorias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total de Auditorias"
          value={filteredAudits.length}
          icon={FileText}
          color="blue"
        />
        
        <MetricCard
          title="Taxa de Conclusão"
          value={completionRate}
          unit="%"
          icon={CheckCircle}
          color="green"
        />
        
        <MetricCard
          title="Tempo Médio"
          value={Math.round(averageTime)}
          unit="dias"
          icon={Clock}
          color="purple"
        />
        
        <MetricCard
          title="Em Andamento"
          value={auditsByStatus.in_progress || 0}
          icon={AlertTriangle}
          color="orange"
        />
      </div>

      {/* Gráficos de Análise */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Auditorias por Status */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Auditorias por Status</h3>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <TrendChart
            title="Auditorias por Status"
            data={{
              labels: Object.keys(auditsByStatus).map(status => {
                const statusMap: Record<string, string> = {
                  'draft': 'Rascunho',
                  'scheduled': 'Agendada',
                  'in_progress': 'Em Andamento',
                  'completed': 'Concluída',
                  'cancelled': 'Cancelada'
                };
                return statusMap[status] || status;
              }),
              datasets: [{
                data: Object.values(auditsByStatus),
                backgroundColor: ['#6B7280', '#F59E0B', '#3B82F6', '#10B981', '#EF4444']
              }]
            }}
            type="doughnut"
            height={300}
            colors={['#6B7280', '#F59E0B', '#3B82F6', '#10B981', '#EF4444']}
          />
        </div>

        {/* Auditorias por Tipo */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Auditorias por Tipo</h3>
            <Building className="h-5 w-5 text-gray-400" />
          </div>
          <TrendChart
            title="Auditorias por Tipo"
            data={{
              labels: Object.keys(auditsByType).map(type => {
                const typeMap: Record<string, string> = {
                  'internal': 'Interna',
                  'external': 'Externa',
                  'compliance': 'Conformidade',
                  'quality': 'Qualidade',
                  'safety': 'Segurança'
                };
                return typeMap[type] || type;
              }),
              datasets: [{
                data: Object.values(auditsByType),
                backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444']
              }]
            }}
            type="bar"
            height={300}
            colors={['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444']}
          />
        </div>
      </div>

      {/* Tendência Temporal */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Tendência de Auditorias</h3>
          <Calendar className="h-5 w-5 text-gray-400" />
        </div>
        <TrendChart
          title="Tendência de Auditorias"
          data={trendData.audits}
          type="line"
          height={400}
          colors={['#3B82F6', '#10B981', '#F59E0B']}
        />
      </div>

      {/* Tabela de Auditorias */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Lista de Auditorias</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Auditoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Agendada
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Auditor
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAudits.slice(0, 10).map((audit) => (
                <tr key={audit.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{audit.title}</div>
                      <div className="text-sm text-gray-500">{audit.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {audit.type === 'interna' ? 'Interna' :
                       audit.type === 'externa' ? 'Externa' :
                       audit.type === 'fornecedor' ? 'Fornecedor' : 'Interna'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      audit.status === 'completed' ? 'bg-green-100 text-green-800' :
                      audit.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      audit.status === 'planned' ? 'bg-yellow-100 text-yellow-800' :
                      audit.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {audit.status === 'completed' ? 'Concluída' :
                       audit.status === 'in_progress' ? 'Em Andamento' :
                       audit.status === 'planned' ? 'Agendada' :
                       audit.status === 'cancelled' ? 'Cancelada' : 'Rascunho'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(audit.scheduledDate).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">Auditor {audit.auditorId}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredAudits.length > 10 && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Mostrando 10 de {filteredAudits.length} auditorias. Use os filtros para refinar os resultados.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};