import React, { useEffect, useState } from 'react';
import { useReportsStore } from '../../stores/reportsStore';
import { AuditReportFilters, ReportExportOptions, AuditTypeValue } from '../../types';
import { 
  Calendar,
  FileText,
  User,
  Building2,
  Settings,
  Download,
  Filter,
  Search,
  RefreshCw,
  FileSpreadsheet,
  Eye
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const {
    auditReportData,
    isLoading,
    generateAuditReport,
    exportReport
  } = useReportsStore();

  const [filters, setFilters] = useState<AuditReportFilters>({
    periodStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 dias atrás
    periodEnd: new Date(),
    auditType: 'all',
    auditorName: '',
    auditedSector: '',
    auditedProcess: '',
    auditedSubprocess: ''
  });

  const [showFilters, setShowFilters] = useState(true);
  const [previewData, setPreviewData] = useState<any[]>([]);

  useEffect(() => {
    generateAuditReport(filters);
  }, [filters, generateAuditReport]);

  const handleFilterChange = (field: keyof AuditReportFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleExport = async (format: 'pdf' | 'excel') => {
    const options: ReportExportOptions = {
      format,
      includeCharts: true,
      includeDetails: true,
      fileName: `relatorio-auditorias-${new Date().toISOString().split('T')[0]}`
    };
    
    await exportReport(options, filters);
  };

  const clearFilters = () => {
    setFilters({
      periodStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      periodEnd: new Date(),
      auditType: 'all',
      auditorName: '',
      auditedSector: '',
      auditedProcess: '',
      auditedSubprocess: ''
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Carregando relatórios...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Relatórios de Auditoria</h1>
          <p className="text-gray-600">Gere relatórios personalizados com filtros específicos</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Filter className="h-4 w-4 mr-2" />
            {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
          </button>
          <button
            onClick={clearFilters}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Limpar
          </button>
        </div>
      </div>

      {/* Filtros */}
      {showFilters && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Filtros de Relatório</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Período de Emissão */}
            <div className="col-span-full lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-2" />
                Período de Emissão
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Data Inicial</label>
                  <input
                    type="date"
                    value={filters.periodStart.toISOString().split('T')[0]}
                    onChange={(e) => handleFilterChange('periodStart', new Date(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Data Final</label>
                  <input
                    type="date"
                    value={filters.periodEnd.toISOString().split('T')[0]}
                    onChange={(e) => handleFilterChange('periodEnd', new Date(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Tipo de Auditoria */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="h-4 w-4 inline mr-2" />
                Tipo de Auditoria
              </label>
              <select
                value={filters.auditType}
                onChange={(e) => handleFilterChange('auditType', e.target.value as AuditTypeValue | 'all')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos os tipos</option>
                <option value="interna">Auditoria Interna</option>
                <option value="externa">Auditoria Externa</option>
                <option value="fornecedor">Auditoria de Fornecedor</option>
              </select>
            </div>

            {/* Nome do Auditor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 inline mr-2" />
                Nome do Auditor
              </label>
              <input
                type="text"
                placeholder="Digite o nome do auditor"
                value={filters.auditorName}
                onChange={(e) => handleFilterChange('auditorName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Setor Auditado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building2 className="h-4 w-4 inline mr-2" />
                Setor Auditado
              </label>
              <input
                type="text"
                placeholder="Digite o setor auditado"
                value={filters.auditedSector}
                onChange={(e) => handleFilterChange('auditedSector', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Processo Auditado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Settings className="h-4 w-4 inline mr-2" />
                Processo Auditado
              </label>
              <input
                type="text"
                placeholder="Digite o processo auditado"
                value={filters.auditedProcess}
                onChange={(e) => handleFilterChange('auditedProcess', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Subprocesso Auditado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Settings className="h-4 w-4 inline mr-2" />
                Subprocesso Auditado
              </label>
              <input
                type="text"
                placeholder="Digite o subprocesso auditado"
                value={filters.auditedSubprocess}
                onChange={(e) => handleFilterChange('auditedSubprocess', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Resumo dos Resultados */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Resultados Encontrados ({auditReportData?.length || 0} auditorias)
          </h3>
          <div className="flex space-x-3">
            <button
              onClick={() => handleExport('pdf')}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar PDF
            </button>
            <button
              onClick={() => handleExport('excel')}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Exportar Excel
            </button>
          </div>
        </div>

        {/* Preview dos Dados */}
        {auditReportData && auditReportData.length > 0 ? (
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
                    Auditor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Setor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Processo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Período
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {auditReportData.slice(0, 10).map((audit) => (
                  <tr key={audit.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{audit.title}</div>
                      <div className="text-sm text-gray-500">{audit.subprocess}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        audit.type === 'interna' ? 'bg-blue-100 text-blue-800' :
                        audit.type === 'externa' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {audit.type === 'interna' ? 'Interna' : 
                         audit.type === 'externa' ? 'Externa' : 'Fornecedor'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {audit.auditor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {audit.sector}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {audit.process}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {audit.startDate.toLocaleDateString('pt-BR')} - {audit.endDate.toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        audit.status === 'completed' ? 'bg-green-100 text-green-800' :
                        audit.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                        audit.status === 'planned' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {audit.status === 'completed' ? 'Concluída' :
                         audit.status === 'in_progress' ? 'Em Andamento' :
                         audit.status === 'planned' ? 'Planejada' : 'Cancelada'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {auditReportData.length > 10 && (
              <div className="mt-4 text-center text-sm text-gray-500">
                Mostrando 10 de {auditReportData.length} resultados. Use a exportação para ver todos os dados.
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum resultado encontrado</h3>
            <p className="text-gray-500">Ajuste os filtros para encontrar as auditorias desejadas.</p>
          </div>
        )}
      </div>

      {/* Histórico de Relatórios */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Histórico de Relatórios Gerados</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Relatório de Auditorias - Janeiro 2024</p>
                <p className="text-xs text-gray-500">Gerado em 15/01/2024 às 14:30</p>
              </div>
            </div>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              <Eye className="h-4 w-4 inline mr-1" />
              Visualizar
            </button>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <FileSpreadsheet className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Relatório Completo - Dezembro 2023</p>
                <p className="text-xs text-gray-500">Gerado em 02/01/2024 às 09:15</p>
              </div>
            </div>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              <Eye className="h-4 w-4 inline mr-1" />
              Visualizar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};