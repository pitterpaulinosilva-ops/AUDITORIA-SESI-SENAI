import React, { useState } from 'react';
import { Calendar, Filter, X, Search, Download } from 'lucide-react';
import { DateRange, ReportFilter, ExportOptions } from '../../types';
import { format } from 'date-fns';

interface ReportFiltersProps {
  dateRange?: DateRange;
  onDateRangeChange?: (dateRange: DateRange) => void;
  searchTerm?: string;
  onSearchChange?: (search: string) => void;
  onExport?: (format: 'pdf' | 'excel', options: any) => void;
  showAdvancedFilters?: boolean;
  filters?: any;
  onFiltersChange?: (filters: any) => void;
  availableFields?: { value: string; label: string }[];
  showExport?: boolean;
  isLoading?: boolean;
}

export const ReportFilters: React.FC<ReportFiltersProps> = ({
  dateRange,
  onDateRangeChange,
  searchTerm = '',
  onSearchChange,
  onExport,
  showAdvancedFilters = false,
  filters = {},
  onFiltersChange,
  availableFields = [],
  showExport = true,
  isLoading = false
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportOptions, setExportOptions] = useState({
    format: 'pdf' as 'pdf' | 'excel',
    includeCharts: true,
    includeRawData: false,
    fileName: ''
  });

  const clearAllFilters = () => {
    if (onFiltersChange) onFiltersChange({});
    if (onSearchChange) onSearchChange('');
  };

  const handleExport = () => {
    if (onExport) {
      onExport(exportOptions.format, exportOptions);
      setShowExportModal(false);
    }
  };

  const operatorOptions = [
    { value: 'equals', label: 'Igual a' },
    { value: 'contains', label: 'Contém' },
    { value: 'greater', label: 'Maior que' },
    { value: 'less', label: 'Menor que' },
    { value: 'between', label: 'Entre' },
    { value: 'in', label: 'Em' }
  ];

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Barra de pesquisa */}
        {onSearchChange && (
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Pesquisar..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        {/* Seletor de período */}
        {onDateRangeChange && (
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={dateRange ? format(dateRange.startDate, 'yyyy-MM-dd') : ''}
              onChange={(e) => {
                if (dateRange && e.target.value) {
                  onDateRangeChange({
                    ...dateRange,
                    startDate: new Date(e.target.value)
                  });
                }
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="text-gray-500">até</span>
            <input
              type="date"
              value={dateRange ? format(dateRange.endDate, 'yyyy-MM-dd') : ''}
              onChange={(e) => {
                if (dateRange && e.target.value) {
                  onDateRangeChange({
                    ...dateRange,
                    endDate: new Date(e.target.value)
                  });
                }
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        {/* Botões de ação */}
        <div className="flex items-center space-x-2">
          {showAdvancedFilters && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Filtros</span>
              {Object.keys(filters).length > 0 && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {Object.keys(filters).length}
                </span>
              )}
            </button>
          )}

          {showExport && onExport && (
            <button
              onClick={() => setShowExportModal(true)}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Exportar</span>
            </button>
          )}

          {(Object.keys(filters).length > 0 || searchTerm) && (
            <button
              onClick={clearAllFilters}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Limpar</span>
            </button>
          )}
        </div>
      </div>

      {/* Filtros avançados */}
      {showFilters && showAdvancedFilters && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">Filtros Avançados</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={clearAllFilters}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Limpar Tudo
              </button>
            </div>
          </div>

          <p className="text-sm text-gray-500 text-center py-4">
            Filtros avançados serão implementados em versão futura.
          </p>
        </div>
      )}

      {/* Modal de exportação */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Exportar Relatório</h3>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Formato
                </label>
                <select
                  value={exportOptions.format}
                  onChange={(e) => setExportOptions(prev => ({ ...prev, format: e.target.value as 'pdf' | 'excel' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                  <option value="csv">CSV</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do arquivo
                </label>
                <input
                  type="text"
                  value={exportOptions.fileName || ''}
                  onChange={(e) => setExportOptions(prev => ({ ...prev, fileName: e.target.value }))}
                  placeholder="relatorio-auditoria"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeCharts}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, includeCharts: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Incluir gráficos</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeRawData}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, includeRawData: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Incluir dados brutos</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleExport}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Exportando...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Exportar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};