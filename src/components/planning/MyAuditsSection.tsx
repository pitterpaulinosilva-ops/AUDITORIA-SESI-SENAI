import React, { useState, useMemo } from 'react';
import { Search, Filter, Calendar, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { AuditStatus } from '../../types';
import type { Audit } from '../../types';
import { AuditActionCard } from './AuditActionCard';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MyAuditsSectionProps {
  audits: Audit[];
  onExecuteAudit: (auditId: string) => void;
  onAuditClick: (audit: Audit) => void;
  auditorName: string;
}

type FilterStatus = 'all' | 'planned' | 'in_progress' | 'completed' | 'overdue';
type SortOption = 'date' | 'status' | 'title';

export function MyAuditsSection({ 
  audits, 
  onExecuteAudit, 
  onAuditClick, 
  auditorName 
}: MyAuditsSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [showFilters, setShowFilters] = useState(false);

  // Filtrar e ordenar auditorias
  const filteredAndSortedAudits = useMemo(() => {
    let filtered = audits;

    // Filtro por busca
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(audit =>
        audit.title.toLowerCase().includes(searchLower) ||
        audit.sector.toLowerCase().includes(searchLower) ||
        audit.description?.toLowerCase().includes(searchLower)
      );
    }

    // Filtro por status
    if (filterStatus !== 'all') {
      if (filterStatus === 'overdue') {
        filtered = filtered.filter(audit =>
          audit.scheduledDate &&
          isPast(new Date(audit.scheduledDate)) &&
          audit.status !== AuditStatus.COMPLETED
        );
      } else {
        filtered = filtered.filter(audit => audit.status === filterStatus);
      }
    }

    // Ordenação
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          if (!a.scheduledDate && !b.scheduledDate) return 0;
          if (!a.scheduledDate) return 1;
          if (!b.scheduledDate) return -1;
          return new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime();
        
        case 'status':
          const statusOrder = { 
            [AuditStatus.PLANNED]: 1, 
            [AuditStatus.IN_PROGRESS]: 2, 
            [AuditStatus.COMPLETED]: 3,
            [AuditStatus.CANCELLED]: 4
          };
          return statusOrder[a.status] - statusOrder[b.status];
        
        case 'title':
          return a.title.localeCompare(b.title);
        
        default:
          return 0;
      }
    });

    return filtered;
  }, [audits, searchTerm, filterStatus, sortBy]);

  // Estatísticas da seção
  const sectionStats = useMemo(() => {
    const total = audits.length;
    const planned = audits.filter(a => a.status === AuditStatus.PLANNED).length;
    const inProgress = audits.filter(a => a.status === AuditStatus.IN_PROGRESS).length;
    const completed = audits.filter(a => a.status === AuditStatus.COMPLETED).length;
    const overdue = audits.filter(a =>
      a.scheduledDate &&
      isPast(new Date(a.scheduledDate)) &&
      a.status !== AuditStatus.COMPLETED
    ).length;

    return { total, planned, inProgress, completed, overdue };
  }, [audits]);

  const getStatusLabel = (status: FilterStatus) => {
    switch (status) {
      case 'all': return 'Todas';
      case 'planned': return 'Planejadas';
      case 'in_progress': return 'Em Andamento';
      case 'completed': return 'Concluídas';
      case 'overdue': return 'Atrasadas';
      default: return 'Todas';
    }
  };

  const getStatusCount = (status: FilterStatus) => {
    switch (status) {
      case 'all': return sectionStats.total;
      case 'planned': return sectionStats.planned;
      case 'in_progress': return sectionStats.inProgress;
      case 'completed': return sectionStats.completed;
      case 'overdue': return sectionStats.overdue;
      default: return sectionStats.total;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header da Seção */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Minhas Auditorias</h3>
            <p className="text-sm text-gray-600 mt-1">
              {filteredAndSortedAudits.length} de {audits.length} auditorias
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              showFilters 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Filter className="h-4 w-4" />
            Filtros
          </button>
        </div>

        {/* Filtros Rápidos */}
        <div className="flex flex-wrap gap-2 mb-4">
          {(['all', 'planned', 'in_progress', 'completed', 'overdue'] as FilterStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                filterStatus === status
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {getStatusLabel(status)} ({getStatusCount(status)})
            </button>
          ))}
        </div>

        {/* Filtros Expandidos */}
        {showFilters && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Busca */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por título, setor ou descrição..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Ordenação */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ordenar por
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="date">Data</option>
                  <option value="status">Status</option>
                  <option value="title">Título</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lista de Auditorias */}
      <div className="p-6">
        {filteredAndSortedAudits.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || filterStatus !== 'all' 
                ? 'Nenhuma auditoria encontrada' 
                : 'Nenhuma auditoria atribuída'
              }
            </h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus !== 'all'
                ? 'Tente ajustar os filtros para encontrar suas auditorias.'
                : `Não há auditorias atribuídas para ${auditorName} no momento.`
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredAndSortedAudits.map((audit) => (
              <AuditActionCard
                  key={`audit-${audit.id}`}
                  audit={audit}
                  onExecuteAudit={onExecuteAudit}
                  onViewDetails={() => onAuditClick(audit)}
                  showPriorityIndicator={true}
                />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}