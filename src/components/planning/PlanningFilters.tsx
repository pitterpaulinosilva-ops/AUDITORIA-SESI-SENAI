import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { AuditStatus, AuditType } from '../../types';

interface PlanningFiltersProps {
  onFiltersChange: (filters: PlanningFilters) => void;
  onSearchChange: (search: string) => void;
}

export interface PlanningFilters {
  status: AuditStatus[];
  type: AuditType[];
  auditor: string[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

export function PlanningFilters({ onFiltersChange, onSearchChange }: PlanningFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<PlanningFilters>({
    status: [],
    type: [],
    auditor: [],
    dateRange: { start: null, end: null }
  });

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onSearchChange(value);
  };

  const handleFilterChange = (newFilters: Partial<PlanningFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const clearFilters = () => {
    const emptyFilters: PlanningFilters = {
      status: [],
      type: [],
      auditor: [],
      dateRange: { start: null, end: null }
    };
    setFilters(emptyFilters);
    onFiltersChange(emptyFilters);
    setSearch('');
    onSearchChange('');
  };

  const hasActiveFilters = 
    filters.status.length > 0 || 
    filters.type.length > 0 || 
    filters.auditor.length > 0 || 
    filters.dateRange.start || 
    filters.dateRange.end ||
    search.length > 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Busca */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar auditorias..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Botão de filtros */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
              hasActiveFilters 
                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filtros</span>
            {hasActiveFilters && (
              <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {filters.status.length + filters.type.length + filters.auditor.length + (filters.dateRange.start ? 1 : 0)}
              </span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Limpar filtros"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Painel de filtros */}
      {isOpen && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filtro por Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="space-y-2">
                {Object.values(AuditStatus).map((status) => (
                  <label key={status} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.status.includes(status)}
                      onChange={(e) => {
                        const newStatus = e.target.checked
                          ? [...filters.status, status]
                          : filters.status.filter(s => s !== status);
                        handleFilterChange({ status: newStatus });
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      {status === AuditStatus.COMPLETED && 'Concluídas'}
                      {status === AuditStatus.IN_PROGRESS && 'Em Andamento'}
                      {status === AuditStatus.PLANNED && 'Programadas'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filtro por Tipo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo
              </label>
              <div className="space-y-2">
                {Object.values(AuditType).map((type) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.type.includes(type)}
                      onChange={(e) => {
                        const newType = e.target.checked
                          ? [...filters.type, type]
                          : filters.type.filter(t => t !== type);
                        handleFilterChange({ type: newType });
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      {type === AuditType.INTERNAL && 'Interna'}
                      {type === AuditType.EXTERNAL && 'Externa'}
                      {type === AuditType.SUPPLIER && 'Fornecedor'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filtro por Período */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Período
              </label>
              <div className="space-y-2">
                <input
                  type="date"
                  value={filters.dateRange.start?.toISOString().split('T')[0] || ''}
                  onChange={(e) => {
                    const start = e.target.value ? new Date(e.target.value) : null;
                    handleFilterChange({ 
                      dateRange: { ...filters.dateRange, start } 
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Data inicial"
                />
                <input
                  type="date"
                  value={filters.dateRange.end?.toISOString().split('T')[0] || ''}
                  onChange={(e) => {
                    const end = e.target.value ? new Date(e.target.value) : null;
                    handleFilterChange({ 
                      dateRange: { ...filters.dateRange, end } 
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Data final"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}