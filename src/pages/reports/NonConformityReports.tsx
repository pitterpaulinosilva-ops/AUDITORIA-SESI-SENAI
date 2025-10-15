import React, { useEffect, useState } from 'react';
import { useReportsStore } from '../../stores/reportsStore';
import { useAuditProStore } from '../../store';
import { MetricCard } from '../../components/reports/MetricCard';
import { TrendChart } from '../../components/reports/TrendChart';
import { ReportFilters } from '../../components/reports/ReportFilters';
import { 
  AlertTriangle, 
  TrendingDown, 
  Clock, 
  CheckCircle,
  BarChart3,
  Calendar,
  MapPin,
  Target
} from 'lucide-react';
import { DateRange, NonConformityFilters } from '../../types';

export const NonConformityReports: React.FC = () => {
  const {
    dashboardMetrics,
    trendData,
    isLoading,
    generateDashboardMetrics,
    generateTrendData,
    exportReport
  } = useReportsStore();

  const { nonConformities } = useAuditProStore();

  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date()
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<NonConformityFilters>({});

  useEffect(() => {
    generateDashboardMetrics(dateRange);
    generateTrendData(dateRange);
  }, [dateRange, generateDashboardMetrics, generateTrendData]);

  const handleExport = async (format: 'pdf' | 'excel', options: any) => {
    await exportReport({
      format,
      includeCharts: options.includeCharts,
      includeDetails: options.includeRawData,
      fileName: options.fileName || `non-conformity-report-${new Date().toISOString().split('T')[0]}`
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

  const filteredNonConformities = nonConformities.filter(nc => {
    const matchesSearch = !searchTerm || 
      nc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nc.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDateRange = 
      new Date(nc.identifiedAt || nc.createdAt) >= dateRange.startDate &&
        new Date(nc.identifiedAt || nc.createdAt) <= dateRange.endDate;

    const matchesStatus = !filters.status || filters.status.includes(nc.status);
    const matchesSeverity = !filters.severity || filters.severity.includes((nc.severity || 'low') as any);

    return matchesSearch && matchesDateRange && matchesStatus && matchesSeverity;
  });

  const nonConformitiesBySeverity = filteredNonConformities.reduce((acc, nc) => {
    const severityKey = nc.severity || 'low';
    acc[severityKey] = (acc[severityKey] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const nonConformitiesByStatus = filteredNonConformities.reduce((acc, nc) => {
    acc[nc.status] = (acc[nc.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const resolvedRate = filteredNonConformities.length > 0 
    ? Math.round((nonConformitiesByStatus.resolved || 0) / filteredNonConformities.length * 100)
    : 0;

  const averageResolutionTime = filteredNonConformities
    .filter(nc => nc.status === 'resolved' && nc.closedAt)
    .reduce((acc, nc) => {
      const identifiedDate = new Date(nc.identifiedAt || nc.createdAt);
      const resolvedDate = new Date(nc.closedAt || new Date());
      const diffDays = Math.ceil((resolvedDate.getTime() - identifiedDate.getTime()) / (1000 * 60 * 60 * 24));
      return acc + diffDays;
    }, 0) / Math.max(nonConformitiesByStatus.resolved || 1, 1);

  // Dados para mapa de calor (simulado por departamento)
  const heatmapData = [
    { department: 'Produção', count: Math.floor(Math.random() * 20) + 5 },
    { department: 'Qualidade', count: Math.floor(Math.random() * 15) + 3 },
    { department: 'Logística', count: Math.floor(Math.random() * 12) + 2 },
    { department: 'Manutenção', count: Math.floor(Math.random() * 18) + 4 },
    { department: 'Segurança', count: Math.floor(Math.random() * 10) + 1 },
    { department: 'Administrativo', count: Math.floor(Math.random() * 8) + 1 }
  ];

  // Timeline de resolução (últimos 6 meses)
  const timelineData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Identificadas',
        data: [12, 19, 15, 25, 22, 18],
        backgroundColor: '#EF4444',
        borderColor: '#DC2626'
      },
      {
        label: 'Resolvidas',
        data: [8, 15, 12, 20, 18, 16],
        backgroundColor: '#10B981',
        borderColor: '#059669'
      }
    ]
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Relatórios de Não Conformidades</h1>
          <p className="text-gray-600">Análise detalhada das não conformidades identificadas</p>
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

      {/* KPIs das Não Conformidades */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total de NCs"
          value={filteredNonConformities.length}
          icon={AlertTriangle}
          color="red"
        />
        
        <MetricCard
          title="Taxa de Resolução"
          value={resolvedRate}
          unit="%"
          icon={CheckCircle}
          color="green"
        />
        
        <MetricCard
          title="Tempo Médio"
          value={Math.round(averageResolutionTime)}
          unit="dias"
          icon={Clock}
          color="purple"
        />
        
        <MetricCard
          title="Em Aberto"
          value={(nonConformitiesByStatus.open || 0) + (nonConformitiesByStatus.in_progress || 0)}
          icon={TrendingDown}
          color="orange"
        />
      </div>

      {/* Gráficos de Análise */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* NCs por Severidade */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Não Conformidades por Severidade</h3>
            <AlertTriangle className="h-5 w-5 text-gray-400" />
          </div>
          <TrendChart
            title="Não Conformidades por Severidade"
            data={{
              labels: Object.keys(nonConformitiesBySeverity).map(severity => {
                const severityMap: Record<string, string> = {
                  'low': 'Baixa',
                  'medium': 'Média',
                  'high': 'Alta',
                  'critical': 'Crítica'
                };
                return severityMap[severity] || severity;
              }),
              datasets: [{
                data: Object.values(nonConformitiesBySeverity),
                backgroundColor: ['#10B981', '#F59E0B', '#EF4444', '#7C2D12']
              }]
            }}
            type="doughnut"
            height={300}
            colors={['#10B981', '#F59E0B', '#EF4444', '#7C2D12']}
          />
        </div>

        {/* Timeline de Resolução */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Timeline de Resolução</h3>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <TrendChart
            title="Timeline de Não Conformidades"
            data={timelineData}
            type="bar"
            height={300}
            colors={['#EF4444', '#10B981']}
          />
        </div>
      </div>

      {/* Mapa de Calor por Departamento */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Mapa de Calor - Não Conformidades por Departamento</h3>
          <MapPin className="h-5 w-5 text-gray-400" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {heatmapData.map((item) => {
            const intensity = Math.min(item.count / 20, 1); // Normaliza para 0-1
            const bgColor = `rgba(239, 68, 68, ${0.1 + intensity * 0.8})`; // Vermelho com opacidade variável
            
            return (
              <div
                key={item.department}
                className="p-4 rounded-lg border text-center"
                style={{ backgroundColor: bgColor }}
              >
                <div className="text-2xl font-bold text-gray-900">{item.count}</div>
                <div className="text-sm text-gray-600">{item.department}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Taxa de Recorrência */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Status das Não Conformidades</h3>
            <Target className="h-5 w-5 text-gray-400" />
          </div>
          <TrendChart
            title="Status das Não Conformidades"
            data={{
              labels: Object.keys(nonConformitiesByStatus).map(status => {
                const statusMap: Record<string, string> = {
                  'open': 'Aberta',
                  'in_progress': 'Em Andamento',
                  'resolved': 'Resolvida',
                  'closed': 'Fechada'
                };
                return statusMap[status] || status;
              }),
              datasets: [{
                data: Object.values(nonConformitiesByStatus),
                backgroundColor: ['#EF4444', '#F59E0B', '#10B981', '#6B7280']
              }]
            }}
            type="bar"
            height={300}
            colors={['#EF4444', '#F59E0B', '#10B981', '#6B7280']}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Tendência Mensal</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <TrendChart
            title="Tendência Mensal"
            data={trendData.nonConformitiesBySeverity}
            type="line"
            height={300}
            colors={['#EF4444', '#F59E0B', '#10B981']}
          />
        </div>
      </div>

      {/* Tabela de Não Conformidades */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Não Conformidades Detalhadas</h3>
        </div>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Não Conformidade
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Severidade
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Status
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Data
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Prazo
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredNonConformities.slice(0, 10).map((nc) => (
                    <tr key={nc.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{nc.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{nc.description}</div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          (nc.severity || 'low') === 'critical' ? 'bg-red-100 text-red-800' :
                    (nc.severity || 'low') === 'high' ? 'bg-orange-100 text-orange-800' :
                    (nc.severity || 'low') === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                          {(nc.severity || 'low') === 'critical' ? 'Crítica' :
                          (nc.severity || 'low') === 'high' ? 'Alta' :
                          (nc.severity || 'low') === 'medium' ? 'Média' : 'Baixa'}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          nc.status === 'resolved' ? 'bg-green-100 text-green-800' :
                          nc.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          nc.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {nc.status === 'resolved' ? 'Resolvida' :
                           nc.status === 'in_progress' ? 'Em Andamento' :
                           nc.status === 'closed' ? 'Fechada' : 'Aberta'}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(nc.identifiedAt || nc.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {nc.dueDate ? new Date(nc.dueDate).toLocaleDateString('pt-BR') : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {filteredNonConformities.length > 10 && (
          <div className="px-4 sm:px-6 py-3 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Mostrando 10 de {filteredNonConformities.length} não conformidades. Use os filtros para refinar os resultados.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};