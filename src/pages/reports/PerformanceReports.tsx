import React, { useState, useEffect } from 'react';
import { useAuditProStore } from '../../store';
import { useReportsStore } from '../../stores/reportsStore';
import { MetricCard } from '../../components/reports/MetricCard';
import { TrendChart } from '../../components/reports/TrendChart';
import { ReportFilters } from '../../components/reports/ReportFilters';
import { 
  Users, 
  Clock, 
  TrendingUp, 
  Award,
  Target,
  BarChart3,
  User,
  Building2,
  Calendar,
  CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const PerformanceReports: React.FC = () => {
  const { audits } = useAuditProStore();
  const { 
    dashboardMetrics, 
    generateDashboardMetrics,
    exportReport,
    isLoading 
  } = useReportsStore();

  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date()
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    generateDashboardMetrics(dateRange);
  }, [dateRange, generateDashboardMetrics]);

  // Calcular métricas de performance
  const filteredAudits = audits.filter(audit => {
    const auditDate = new Date(audit.createdAt);
    return auditDate >= dateRange.startDate && auditDate <= dateRange.endDate;
  });

  // Métricas por auditor
  // Mock users data for now
  const users = [
    { id: 'auditor-1', name: 'Dr. João Silva' },
    { id: 'auditor-2', name: 'Dra. Maria Santos' },
    { id: 'auditor-3', name: 'Dr. Roberto Alves' }
  ];

  const auditorMetrics = users.map(user => {
    const userAudits = filteredAudits.filter(audit => audit.auditorId === user.id);
    const completedAudits = userAudits.filter(audit => audit.status === 'completed');
    const totalTime = completedAudits.reduce((acc, audit) => {
      if (audit.completedDate && audit.createdAt) {
        return acc + (new Date(audit.completedDate).getTime() - new Date(audit.createdAt).getTime());
      }
      return acc;
    }, 0);

    return {
      id: user.id,
      name: user.name,
      email: `${user.name.toLowerCase().replace(' ', '.')}@hospital.com`,
      totalAudits: userAudits.length,
      completedAudits: completedAudits.length,
      completionRate: userAudits.length > 0 ? (completedAudits.length / userAudits.length) * 100 : 0,
      averageTime: completedAudits.length > 0 ? totalTime / completedAudits.length : 0,
      efficiency: completedAudits.length > 0 ? (completedAudits.length / userAudits.length) * 100 : 0
    };
  }).filter(metric => metric.totalAudits > 0);

  // Métricas por departamento
  const departmentMetrics = [
    { name: 'Qualidade', audits: 45, completion: 92, avgTime: 4.2 },
    { name: 'Produção', audits: 38, completion: 87, avgTime: 5.1 },
    { name: 'Logística', audits: 29, completion: 94, avgTime: 3.8 },
    { name: 'RH', audits: 22, completion: 89, avgTime: 4.7 },
    { name: 'Financeiro', audits: 18, completion: 96, avgTime: 3.2 }
  ];

  // Dados para gráficos
  const performanceOverTimeData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [{
      label: 'Taxa de Conclusão (%)',
      data: [85, 88, 92, 89, 94, 91],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4
    }]
  };

  const auditorComparisonData = {
    labels: auditorMetrics.slice(0, 5).map(a => a.name.split(' ')[0]),
    datasets: [{
      label: 'Auditorias Concluídas',
      data: auditorMetrics.slice(0, 5).map(a => a.completedAudits),
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(139, 92, 246, 0.8)'
      ]
    }]
  };

  const efficiencyByDepartmentData = {
    labels: departmentMetrics.map(d => d.name),
    datasets: [{
      label: 'Taxa de Conclusão (%)',
      data: departmentMetrics.map(d => d.completion),
      backgroundColor: 'rgba(16, 185, 129, 0.8)',
      borderColor: 'rgb(16, 185, 129)',
      borderWidth: 1
    }]
  };

  // Calcular KPIs gerais
  const totalAuditors = auditorMetrics.length;
  const avgCompletionRate = auditorMetrics.length > 0 
    ? auditorMetrics.reduce((acc, a) => acc + a.completionRate, 0) / auditorMetrics.length 
    : 0;
  const avgTimeHours = auditorMetrics.length > 0
    ? auditorMetrics.reduce((acc, a) => acc + a.averageTime, 0) / auditorMetrics.length / (1000 * 60 * 60)
    : 0;
  const topPerformer = auditorMetrics.length > 0
    ? auditorMetrics.reduce((prev, current) => 
        prev.completionRate > current.completionRate ? prev : current
      )
    : null;

  const handleExport = (format: 'pdf' | 'excel', options: any) => {
    exportReport({
      format,
      includeCharts: options.includeCharts,
      includeDetails: options.includeRawData,
      fileName: options.fileName || `performance-report-${new Date().toISOString().split('T')[0]}`
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

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Relatórios de Performance</h1>
          <p className="text-gray-600 mt-1">
            Análise de produtividade e eficiência dos auditores
          </p>
        </div>
      </div>

      {/* Filtros */}
      <ReportFilters
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onExport={handleExport}
        showExport={true}
        isLoading={isLoading}
      />

      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total de Auditores"
          value={totalAuditors.toString()}
          icon={Users}
          color="blue"
          trend="stable"
        />
        <MetricCard
          title="Taxa Média de Conclusão"
          value={avgCompletionRate.toFixed(1)}
          unit="%"
          icon={Target}
          color="green"
          trend="up"
          trendValue={2.3}
        />
        <MetricCard
          title="Tempo Médio"
          value={avgTimeHours.toFixed(1)}
          unit="h"
          icon={Clock}
          color="orange"
          trend="down"
          trendValue={0.5}
        />
        <MetricCard
          title="Melhor Performer"
          value={topPerformer?.name.split(' ')[0] || 'N/A'}
          icon={Award}
          color="purple"
          trend="stable"
        />
      </div>

      {/* Gráficos de Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Performance ao Longo do Tempo
          </h3>
          <TrendChart
            title="Performance ao Longo do Tempo"
            data={performanceOverTimeData}
            type="line"
            height={300}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Comparação entre Auditores
          </h3>
          <TrendChart
            title="Comparação entre Auditores"
            data={auditorComparisonData}
            type="bar"
            height={300}
          />
        </div>
      </div>

      {/* Eficiência por Departamento */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Eficiência por Departamento
        </h3>
        <TrendChart
          title="Eficiência por Departamento"
          data={efficiencyByDepartmentData}
          type="bar"
          height={300}
        />
      </div>

      {/* Ranking de Auditores */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Ranking de Auditores</h3>
          <p className="text-sm text-gray-600 mt-1">
            Classificação baseada na taxa de conclusão e eficiência
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Posição
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Auditor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total de Auditorias
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Concluídas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Taxa de Conclusão
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tempo Médio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Eficiência
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {auditorMetrics
                .sort((a, b) => b.completionRate - a.completionRate)
                .map((auditor, index) => (
                <tr key={auditor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                        index === 0 ? 'bg-yellow-100 text-yellow-800' :
                        index === 1 ? 'bg-gray-100 text-gray-800' :
                        index === 2 ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {index + 1}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {auditor.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {auditor.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {auditor.totalAudits}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                      {auditor.completedAudits}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${auditor.completionRate}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {auditor.completionRate.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-gray-400 mr-1" />
                      {(auditor.averageTime / (1000 * 60 * 60)).toFixed(1)}h
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      auditor.efficiency >= 90 ? 'bg-green-100 text-green-800' :
                      auditor.efficiency >= 80 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {auditor.efficiency.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Métricas por Departamento */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Performance por Departamento</h3>
          <p className="text-sm text-gray-600 mt-1">
            Análise comparativa de eficiência entre departamentos
          </p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departmentMetrics.map((dept, index) => (
              <div key={dept.name} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Building2 className="w-5 h-5 text-blue-500 mr-2" />
                    <h4 className="font-medium text-gray-900">{dept.name}</h4>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    dept.completion >= 90 ? 'bg-green-100 text-green-800' :
                    dept.completion >= 80 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {dept.completion}%
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Auditorias:</span>
                    <span className="font-medium">{dept.audits}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tempo médio:</span>
                    <span className="font-medium">{dept.avgTime}h</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${dept.completion}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};