import React from 'react'
import { Calendar, Filter, X } from 'lucide-react'
import { NonConformitySeverity, Audit } from '../../types'

interface NonConformityFiltersProps {
  filters: {
    auditId: string
    severity: NonConformitySeverity | ''
    status: string
    category: string
    dateRange: { start: string; end: string }
  }
  onFiltersChange: (filters: any) => void
  audits: Audit[]
}

export function NonConformityFilters({ filters, onFiltersChange, audits }: NonConformityFiltersProps) {
  const handleFilterChange = (key: string, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const handleDateRangeChange = (key: 'start' | 'end', value: string) => {
    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [key]: value
      }
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      auditId: '',
      severity: '',
      status: '',
      category: '',
      dateRange: { start: '', end: '' }
    })
  }

  const hasActiveFilters = () => {
    return filters.auditId !== '' || 
           filters.severity !== '' || 
           filters.status !== '' || 
           filters.category !== '' ||
           filters.dateRange.start !== '' ||
           filters.dateRange.end !== ''
  }

  // Extrair categorias únicas das não conformidades
  const getUniqueCategories = () => {
    const categories = new Set<string>()
    audits.forEach(audit => {
      audit.nonConformities?.forEach(nc => {
        categories.add(nc.category)
      })
    })
    return Array.from(categories).sort()
  }

  const uniqueCategories = getUniqueCategories()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Filtros</span>
        </div>
        
        {hasActiveFilters() && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
          >
            <X className="w-4 h-4" />
            Limpar filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* Auditoria */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Auditoria
          </label>
          <select
            value={filters.auditId}
            onChange={(e) => handleFilterChange('auditId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="">Todas as auditorias</option>
            {audits
              .filter(audit => audit.nonConformities && audit.nonConformities.length > 0)
              .map(audit => (
                <option key={audit.id} value={audit.id}>
                  {audit.title}
                </option>
              ))
            }
          </select>
        </div>

        {/* Severidade */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Severidade
          </label>
          <select
            value={filters.severity}
            onChange={(e) => handleFilterChange('severity', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="">Todas as severidades</option>
            <option value="critical">Crítica</option>
            <option value="high">Alta</option>
            <option value="medium">Média</option>
            <option value="low">Baixa</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="">Todos os status</option>
            <option value="open">Aberta</option>
            <option value="in_treatment">Em Tratamento</option>
            <option value="closed">Fechada</option>
            <option value="cancelled">Cancelada</option>
          </select>
        </div>

        {/* Categoria */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoria
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="">Todas as categorias</option>
            {uniqueCategories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Período */}
        <div className="sm:col-span-2 lg:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Período
          </label>
          <div className="space-y-2">
            <input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => handleDateRangeChange('start', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="Data inicial"
            />
            <input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => handleDateRangeChange('end', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="Data final"
            />
          </div>
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters() && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
          <span className="text-sm text-gray-600">Filtros ativos:</span>
          
          {filters.auditId && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              Auditoria: {audits.find(a => a.id === filters.auditId)?.title || 'Desconhecida'}
              <button
                onClick={() => handleFilterChange('auditId', '')}
                className="hover:text-blue-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          
          {filters.severity && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              Severidade: {
                filters.severity === 'critical' ? 'Crítica' :
                filters.severity === 'high' ? 'Alta' :
                filters.severity === 'medium' ? 'Média' : 'Baixa'
              }
              <button
                onClick={() => handleFilterChange('severity', '')}
                className="hover:text-blue-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          
          {filters.status && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              Status: {
                filters.status === 'open' ? 'Aberta' :
                filters.status === 'in_treatment' ? 'Em Tratamento' :
                filters.status === 'closed' ? 'Fechada' : 'Cancelada'
              }
              <button
                onClick={() => handleFilterChange('status', '')}
                className="hover:text-blue-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          
          {filters.category && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              Categoria: {filters.category}
              <button
                onClick={() => handleFilterChange('category', '')}
                className="hover:text-blue-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          
          {(filters.dateRange.start || filters.dateRange.end) && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              <Calendar className="w-3 h-3" />
              {filters.dateRange.start && new Date(filters.dateRange.start).toLocaleDateString('pt-BR')}
              {filters.dateRange.start && filters.dateRange.end && ' - '}
              {filters.dateRange.end && new Date(filters.dateRange.end).toLocaleDateString('pt-BR')}
              <button
                onClick={() => {
                  handleDateRangeChange('start', '');
                  handleDateRangeChange('end', '');
                }}
                className="hover:text-blue-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}