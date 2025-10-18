import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, LayoutGrid, List, Search } from 'lucide-react';
import { useAuditProStore } from '../../store';
import { FilterBar, AuditFilters } from '../../components/FilterBar';
import { Pagination } from '../../components/Pagination';
import { StatusBadge } from '../../components/StatusBadge';
import { AuditCard } from '../../components/AuditCard';
import { CancelAuditModal } from '../../components/CancelAuditModal';
import { AuditStatus } from '../../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function AuditList() {
  const navigate = useNavigate();
  const { audits, deleteAudit, updateAudit } = useAuditProStore();
  
  const [filters, setFilters] = useState<AuditFilters>({
    search: '',
    status: 'all',
    type: 'all',
    sector: '',
    auditor: '',
    dateFrom: '',
    dateTo: ''
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  
  // Estados para o modal de cancelamento
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [auditToCancel, setAuditToCancel] = useState<{ id: string; title: string } | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  // Filtrar e ordenar auditorias
  const filteredAudits = useMemo(() => {
    const filtered = audits.filter(audit => {
      // Busca por texto
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch = 
          audit.title.toLowerCase().includes(searchTerm) ||
          audit.sector.toLowerCase().includes(searchTerm) ||
          audit.auditor.toLowerCase().includes(searchTerm) ||
          audit.id.toLowerCase().includes(searchTerm);
        
        if (!matchesSearch) return false;
      }

      // Filtro por status
      if (filters.status !== 'all' && audit.status !== filters.status) {
        return false;
      }

      // Filtro por tipo
      if (filters.type !== 'all' && audit.type !== filters.type) {
        return false;
      }

      // Filtro por setor
      if (filters.sector && !audit.sector.toLowerCase().includes(filters.sector.toLowerCase())) {
        return false;
      }

      // Filtro por auditor
      if (filters.auditor && !audit.auditor.toLowerCase().includes(filters.auditor.toLowerCase())) {
        return false;
      }

      // Filtro por data
      if (filters.dateFrom) {
        const auditDate = new Date(audit.scheduledDate);
        const fromDate = new Date(filters.dateFrom);
        if (auditDate < fromDate) return false;
      }

      if (filters.dateTo) {
        const auditDate = new Date(audit.scheduledDate);
        const toDate = new Date(filters.dateTo);
        if (auditDate > toDate) return false;
      }

      return true;
    });

    // Ordenar por prioridade de status e datas
    return filtered.sort((a, b) => {
      const now = new Date();
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(now.getDate() + 7);

      const aScheduledDate = new Date(a.scheduledDate);
      const bScheduledDate = new Date(b.scheduledDate);

      // Função para determinar prioridade
      const getPriority = (audit: any) => {
        const auditScheduledDate = new Date(audit.scheduledDate);
        // 1. Auditorias em atraso (data passou e não está concluída)
        if (auditScheduledDate < now && audit.status !== AuditStatus.COMPLETED) {
          return 1;
        }
        // 2. Auditorias próximas do vencimento (próximos 7 dias)
        if (auditScheduledDate >= now && auditScheduledDate <= sevenDaysFromNow && audit.status !== AuditStatus.COMPLETED) {
          return 2;
        }
        // 3. Auditorias concluídas
        if (audit.status === AuditStatus.COMPLETED) {
          return 4;
        }
        // 4. Demais auditorias
        return 3;
      };

      const aPriority = getPriority(a);
      const bPriority = getPriority(b);

      // Se têm prioridades diferentes, ordenar por prioridade
      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }

      // Se têm a mesma prioridade, ordenar por data
      if (aPriority === 4) { // Auditorias concluídas
        // Ordenar por data de conclusão (mais recentes primeiro)
        const aCompletedDate = a.completedDate ? new Date(a.completedDate) : new Date(0);
        const bCompletedDate = b.completedDate ? new Date(b.completedDate) : new Date(0);
        return bCompletedDate.getTime() - aCompletedDate.getTime();
      } else {
        // Ordenar por data agendada (mais próximas primeiro)
        return aScheduledDate.getTime() - bScheduledDate.getTime();
      }
    });
  }, [audits, filters]);

  // Paginação
  const totalPages = Math.ceil(filteredAudits.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAudits = filteredAudits.slice(startIndex, startIndex + itemsPerPage);

  // Handlers
  const handleFilterChange = (newFilters: AuditFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleView = (id: string) => {
    navigate(`/audits/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/audits/${id}/edit`);
  };

  const handleExecute = (id: string) => {
    navigate(`/audits/${id}/execute`);
  };

  const handleCancel = (id: string) => {
    const audit = audits.find(a => a.id === id);
    if (audit) {
      setAuditToCancel({ id, title: audit.title });
      setCancelModalOpen(true);
    }
  };

  const handleCancelConfirm = async (reason: string) => {
    if (!auditToCancel) return;

    setIsCancelling(true);
    try {
      // Atualizar a auditoria com status cancelado e informações de rastreabilidade
      const updatedAudit = {
        ...audits.find(a => a.id === auditToCancel.id)!,
        status: AuditStatus.CANCELLED,
        cancellationReason: reason,
        cancellationDate: new Date().toISOString(),
        cancellationTime: new Date().toLocaleTimeString('pt-BR')
      };

      updateAudit(auditToCancel.id, updatedAudit);
      
      // Fechar modal e limpar estados
      setCancelModalOpen(false);
      setAuditToCancel(null);
    } catch (error) {
      console.error('Erro ao cancelar auditoria:', error);
    } finally {
      setIsCancelling(false);
    }
  };

  const handleCancelModalClose = () => {
    if (!isCancelling) {
      setCancelModalOpen(false);
      setAuditToCancel(null);
    }
  };

  const formatDate = (date: string) => {
    return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
  };

  const getTypeLabel = (type: string) => {
    const types = {
      interna: 'Interna',
      externa: 'Externa',
      fornecedor: 'Fornecedor'
    };
    return types[type as keyof typeof types] || type;
  };

  const getScoreColor = (score: number | null) => {
    if (score === null) return 'text-gray-500';
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Auditorias</h1>
          <p className="text-gray-600 mt-1">
            Gerencie e acompanhe todas as auditorias do sistema
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Toggle de visualização */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'table' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Visualização em tabela"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'cards' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Visualização em cards"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
          
          <button
            onClick={() => navigate('/audits/new')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nova Auditoria
          </button>
        </div>
      </div>

      {/* Filtros */}
      <FilterBar 
        onFilterChange={handleFilterChange}
        totalCount={filteredAudits.length}
      />

      {/* Conteúdo */}
      {filteredAudits.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma auditoria encontrada
          </h3>
          <p className="text-gray-600 mb-6">
            {audits.length === 0 
              ? 'Comece criando sua primeira auditoria.'
              : 'Tente ajustar os filtros para encontrar o que procura.'
            }
          </p>
          {audits.length === 0 && (
            <button
              onClick={() => navigate('/audits/new')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Criar primeira auditoria
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Visualização em tabela */}
          {viewMode === 'table' && (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
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
                        Setor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Auditor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data Inicial
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data Final
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pontuação
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedAudits.map((audit) => (
                      <tr key={audit.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {audit.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {audit.displayId || audit.id.slice(0, 8)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {getTypeLabel(audit.type)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {audit.sector}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {audit.auditor}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {audit.actualStartDate 
                            ? formatDate(audit.actualStartDate.toString()) 
                            : audit.plannedStartDate 
                              ? formatDate(audit.plannedStartDate.toString())
                              : '-'
                          }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {audit.actualEndDate 
                            ? formatDate(audit.actualEndDate.toString()) 
                            : audit.plannedEndDate 
                              ? formatDate(audit.plannedEndDate.toString())
                              : '-'
                          }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(audit.scheduledDate.toString())}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={audit.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm font-medium ${getScoreColor(audit.score)}`}>
                            {audit.score !== undefined && audit.score !== null ? `${audit.score}%` : '-'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleView(audit.id)}
                              className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200 hover:from-blue-100 hover:to-blue-200 hover:shadow-md transition-all duration-200"
                              title="Visualizar"
                            >
                              Ver
                            </button>
                            <button
                              onClick={() => handleEdit(audit.id)}
                              className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-700 border border-yellow-200 hover:from-yellow-100 hover:to-yellow-200 hover:shadow-md transition-all duration-200"
                              title="Editar"
                            >
                              Editar
                            </button>
                            {audit.status !== AuditStatus.COMPLETED && audit.status !== AuditStatus.CANCELLED && (
                              <button
                                onClick={() => handleExecute(audit.id)}
                                className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full bg-gradient-to-r from-green-50 to-green-100 text-green-700 border border-green-200 hover:from-green-100 hover:to-green-200 hover:shadow-md transition-all duration-200"
                                title="Executar"
                              >
                                Executar
                              </button>
                            )}
                            {audit.status !== AuditStatus.COMPLETED && audit.status !== AuditStatus.CANCELLED && (
                              <button
                                onClick={() => handleCancel(audit.id)}
                                className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 border border-orange-200 hover:from-orange-100 hover:to-orange-200 hover:shadow-md transition-all duration-200"
                                title="Cancelar"
                              >
                                Cancelar
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Visualização em cards */}
          {viewMode === 'cards' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedAudits.map((audit) => (
                <AuditCard
                  key={audit.id}
                  id={audit.id}
                  title={audit.title}
                  status={audit.status}
                  type={audit.type}
                  sector={audit.sector}
                  auditor={audit.auditor}
                  scheduledDate={audit.scheduledDate}
                  checklistId={audit.checklistId}
                  executionNote={audit.executionNote}
                  onView={handleView}
                  onEdit={handleEdit}
                  onExecute={handleExecute}
                  onCancel={handleCancel}
                />
              ))}
            </div>
          )}

          {/* Paginação */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredAudits.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </>
      )}

      {/* Modal de cancelamento */}
      <CancelAuditModal
        isOpen={cancelModalOpen}
        onClose={handleCancelModalClose}
        onConfirm={handleCancelConfirm}
        auditTitle={auditToCancel?.title || ''}
        isLoading={isCancelling}
      />
    </div>
  );
}