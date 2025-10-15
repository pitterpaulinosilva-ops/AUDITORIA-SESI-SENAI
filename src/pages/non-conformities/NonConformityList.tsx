import React, { useState, useMemo } from 'react'
import { Search, Filter, FileText, AlertTriangle, Calendar, MapPin, User, ExternalLink } from 'lucide-react'
import { useAuditProStore } from "../../store";
import { NonConformity, Audit, NonConformitySeverity } from '../../types'
import { NonConformityCard } from '../../components/non-conformities/NonConformityCard'
import { NonConformityFilters } from '../../components/non-conformities/NonConformityFilters'
import { SeverityBadge } from '../../components/non-conformities/SeverityBadge'
import { EPAButton } from '../../components/non-conformities/EPAButton'

interface GroupedNonConformities {
  audit: Audit
  nonConformities: NonConformity[]
}

export function NonConformityList() {
  const { nonConformities, audits } = useAuditProStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    auditId: '',
    severity: '' as NonConformitySeverity | '',
    status: '',
    category: '',
    dateRange: { start: '', end: '' }
  })
  const [expandedAudits, setExpandedAudits] = useState<Set<string>>(new Set())

  // Agrupar não conformidades por auditoria
  const groupedNonConformities = useMemo(() => {
    const groups: GroupedNonConformities[] = []
    
    audits.forEach(audit => {
      if (audit.nonConformities && audit.nonConformities.length > 0) {
        let filteredNCs = audit.nonConformities

        // Aplicar filtros
        if (searchTerm) {
          filteredNCs = filteredNCs.filter(nc =>
            nc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            nc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            nc.category.toLowerCase().includes(searchTerm.toLowerCase())
          )
        }

        if (filters.severity) {
          filteredNCs = filteredNCs.filter(nc => nc.severity === filters.severity)
        }

        if (filters.status) {
          filteredNCs = filteredNCs.filter(nc => nc.status === filters.status)
        }

        if (filters.category) {
          filteredNCs = filteredNCs.filter(nc => 
            nc.category.toLowerCase().includes(filters.category.toLowerCase())
          )
        }

        if (filters.dateRange.start) {
          filteredNCs = filteredNCs.filter(nc => 
            new Date(nc.createdAt) >= new Date(filters.dateRange.start)
          )
        }

        if (filters.dateRange.end) {
          filteredNCs = filteredNCs.filter(nc => 
            new Date(nc.createdAt) <= new Date(filters.dateRange.end)
          )
        }

        if (filteredNCs.length > 0) {
          groups.push({
            audit,
            nonConformities: filteredNCs
          })
        }
      }
    })

    return groups
  }, [audits, searchTerm, filters])

  const totalNonConformities = useMemo(() => {
    return groupedNonConformities.reduce((total, group) => total + group.nonConformities.length, 0)
  }, [groupedNonConformities])

  const severityStats = useMemo(() => {
    const stats = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0
    }

    groupedNonConformities.forEach(group => {
      group.nonConformities.forEach(nc => {
        stats[nc.severity]++
      })
    })

    return stats
  }, [groupedNonConformities])

  const toggleAuditExpansion = (auditId: string) => {
    const newExpanded = new Set(expandedAudits)
    if (newExpanded.has(auditId)) {
      newExpanded.delete(auditId)
    } else {
      newExpanded.add(auditId)
    }
    setExpandedAudits(newExpanded)
  }

  const exportReport = () => {
    // Implementar exportação de relatório
    console.log('Exportando relatório de não conformidades...')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Não Conformidades</h1>
          <p className="text-gray-600">
            {totalNonConformities} não conformidade{totalNonConformities !== 1 ? 's' : ''} encontrada{totalNonConformities !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={exportReport}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <FileText className="w-4 h-4" />
            Exportar Relatório
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-600">Críticas</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-1">{severityStats.critical}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-600">Altas</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-1">{severityStats.high}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-600">Médias</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-1">{severityStats.medium}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-600">Baixas</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-1">{severityStats.low}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar não conformidades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              showFilters 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'bg-gray-100 text-gray-700 border border-gray-200'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filtros
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <NonConformityFilters
              filters={filters}
              onFiltersChange={setFilters}
              audits={audits}
            />
          </div>
        )}
      </div>

      {/* Non-Conformities List */}
      <div className="space-y-6">
        {groupedNonConformities.length === 0 ? (
          <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
            <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma não conformidade encontrada
            </h3>
            <p className="text-gray-600">
              {searchTerm || Object.values(filters).some(f => f !== '' && (typeof f !== 'object' || Object.values(f).some(v => v !== '')))
                ? 'Tente ajustar os filtros de busca.'
                : 'As não conformidades aparecerão aqui conforme forem identificadas nas auditorias.'}
            </p>
          </div>
        ) : (
          groupedNonConformities.map((group) => (
            <div key={group.audit.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Audit Header */}
              <div 
                className="p-4 bg-gray-50 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => toggleAuditExpansion(group.audit.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {group.audit.title}
                      </h3>
                      <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {group.nonConformities.length} NC{group.nonConformities.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(group.audit.plannedStartDate).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {group.audit.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {group.audit.auditor}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <EPAButton />
                    <button className="text-gray-400 hover:text-gray-600">
                      {expandedAudits.has(group.audit.id) ? '−' : '+'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Non-Conformities */}
              {expandedAudits.has(group.audit.id) && (
                <div className="divide-y divide-gray-200">
                  {group.nonConformities.map((nonConformity) => (
                    <NonConformityCard
                      key={nonConformity.id}
                      nonConformity={nonConformity}
                    />
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}