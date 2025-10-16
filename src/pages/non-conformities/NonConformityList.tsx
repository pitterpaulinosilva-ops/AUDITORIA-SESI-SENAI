import { useState } from 'react';
import { 
  ShieldAlert, 
  ExternalLink,
  Check,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuditProStore } from "../../store";
import { NonConformitySeverity } from '../../types'
import { format } from 'date-fns';

export function NonConformityList() {
  const { audits, nonConformities, updateNonConformity } = useAuditProStore();
  
  // Estados para filtros e paginação
  const [ncFilters, setNcFilters] = useState({
    epaStatus: 'all', // 'all', 'pending', 'opened'
    severity: 'all', // 'all', 'critical', 'high', 'medium', 'low'
    sector: 'all' // 'all' ou nome do setor
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Funções para filtros e paginação
  const getFilteredNonConformities = () => {
    return nonConformities.filter(nc => {
      // Filtro por status EPA
      if (ncFilters.epaStatus === 'pending' && nc.epaOpened) return false;
      if (ncFilters.epaStatus === 'opened' && !nc.epaOpened) return false;

      // Filtro por severidade
      if (ncFilters.severity !== 'all' && nc.severity !== ncFilters.severity) return false;

      // Filtro por setor
      if (ncFilters.sector !== 'all') {
        const audit = audits.find(a => a.id === nc.auditId);
        if (!audit || audit.department !== ncFilters.sector) return false;
      }

      return true;
    });
  };

  const getPaginatedNonConformities = () => {
    const filtered = getFilteredNonConformities();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return {
      data: filtered.slice(startIndex, endIndex),
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / itemsPerPage)
    };
  };

  const handleEpaStatusToggle = (ncId: string) => {
    const nc = nonConformities.find(n => n.id === ncId);
    if (nc) {
      updateNonConformity(ncId, {
        ...nc,
        epaOpened: !nc.epaOpened,
        epaOpenedAt: !nc.epaOpened ? new Date() : undefined,
        epaOpenedBy: !nc.epaOpened ? 'Usuário Atual' : undefined
      });
    }
  };

  const getSeverityColor = (severity: NonConformitySeverity) => {
    switch (severity) {
      case NonConformitySeverity.CRITICAL: return 'text-red-600 bg-red-50';
      case NonConformitySeverity.HIGH: return 'text-orange-600 bg-orange-50';
      case NonConformitySeverity.MEDIUM: return 'text-yellow-600 bg-yellow-50';
      case NonConformitySeverity.LOW: return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getSeverityLabel = (severity: NonConformitySeverity) => {
    switch (severity) {
      case NonConformitySeverity.CRITICAL: return 'Crítica';
      case NonConformitySeverity.HIGH: return 'Alta';
      case NonConformitySeverity.MEDIUM: return 'Média';
      case NonConformitySeverity.LOW: return 'Baixa';
      default: return severity;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Não Conformidades</h1>
          <p className="text-gray-600">
            Gerenciamento completo das não conformidades identificadas
          </p>
        </div>
      </div>

      {/* Seção de Não Conformidades Encontradas */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Não Conformidades Encontradas</h3>
          
          {/* Filtros */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Filtro Status EPA */}
            <select
              value={ncFilters.epaStatus}
              onChange={(e) => {
                setNcFilters(prev => ({ ...prev, epaStatus: e.target.value }));
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos Status EPA</option>
              <option value="pending">Pendente EPA</option>
              <option value="opened">Aberta no EPA</option>
            </select>

            {/* Filtro Severidade */}
            <select
              value={ncFilters.severity}
              onChange={(e) => {
                setNcFilters(prev => ({ ...prev, severity: e.target.value }));
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas Severidades</option>
              <option value={NonConformitySeverity.CRITICAL}>Crítica</option>
              <option value={NonConformitySeverity.HIGH}>Alta</option>
              <option value={NonConformitySeverity.MEDIUM}>Média</option>
              <option value={NonConformitySeverity.LOW}>Baixa</option>
            </select>

            {/* Filtro Setor */}
            <select
              value={ncFilters.sector}
              onChange={(e) => {
                setNcFilters(prev => ({ ...prev, sector: e.target.value }));
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos Setores</option>
              {Array.from(new Set(audits.map(a => a.department).filter(Boolean))).map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tabela de Não Conformidades */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID / Auditoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severidade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Setor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status EPA
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {getPaginatedNonConformities().data.map((nc) => {
                const audit = audits.find(a => a.id === nc.auditId);
                return (
                  <tr key={nc.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {nc.id.slice(-8)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {audit?.title || 'Auditoria não encontrada'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {nc.title}
                      </div>
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {nc.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(nc.severity)}`}>
                        {getSeverityLabel(nc.severity)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(nc.identifiedAt || nc.createdAt), 'dd/MM/yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {audit?.department || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        nc.epaOpened 
                          ? 'text-green-600 bg-green-50' 
                          : 'text-orange-600 bg-orange-50'
                      }`}>
                        {nc.epaOpened ? 'Aberta' : 'Pendente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {/* Botão Abrir no EPA */}
                        <a
                          href="https://sistemafiea.sysepa.com.br/epa/qualidade_ocorrencia_processo_1.php"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1 border border-blue-300 text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors duration-200"
                          title="Abrir no Sistema EPA"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          EPA
                        </a>
                        
                        {/* Toggle Status EPA */}
                        <button
                          onClick={() => handleEpaStatusToggle(nc.id)}
                          className={`inline-flex items-center px-3 py-1 border rounded-md transition-colors duration-200 ${
                            nc.epaOpened
                              ? 'border-green-300 text-green-700 bg-green-50 hover:bg-green-100'
                              : 'border-gray-300 text-gray-700 bg-gray-50 hover:bg-gray-100'
                          }`}
                          title={nc.epaOpened ? 'Marcar como pendente' : 'Marcar como aberta no EPA'}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          {nc.epaOpened ? 'Aberta' : 'Marcar'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {getPaginatedNonConformities().totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-700">
              Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, getPaginatedNonConformities().total)} de {getPaginatedNonConformities().total} resultados
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Anterior
              </button>
              
              <span className="text-sm text-gray-700">
                Página {currentPage} de {getPaginatedNonConformities().totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, getPaginatedNonConformities().totalPages))}
                disabled={currentPage === getPaginatedNonConformities().totalPages}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próxima
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        )}

        {/* Mensagem quando não há dados */}
        {getPaginatedNonConformities().data.length === 0 && (
          <div className="text-center py-8">
            <ShieldAlert className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma não conformidade encontrada com os filtros aplicados.</p>
          </div>
        )}
      </div>
    </div>
  );
}