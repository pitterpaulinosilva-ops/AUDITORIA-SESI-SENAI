import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  History,
  User,
  Clock,
  Eye,
  GitCompare,
  ChevronDown,
  ChevronRight,
  FileText,
  Tag,
  AlertCircle,
} from 'lucide-react';
import { ChecklistVersion } from '../../types';

interface VersionHistoryProps {
  versions: ChecklistVersion[];
  currentVersion: string;
  onCompareVersions?: (version1: string, version2: string) => void;
  onViewVersion?: (versionId: string) => void;
}

const VersionHistory: React.FC<VersionHistoryProps> = ({
  versions,
  currentVersion,
  onCompareVersions,
  onViewVersion,
}) => {
  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(new Set());
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);

  const toggleVersion = (versionId: string) => {
    const newExpanded = new Set(expandedVersions);
    if (newExpanded.has(versionId)) {
      newExpanded.delete(versionId);
    } else {
      newExpanded.add(versionId);
    }
    setExpandedVersions(newExpanded);
  };

  const handleVersionSelect = (versionId: string) => {
    if (selectedVersions.includes(versionId)) {
      setSelectedVersions(selectedVersions.filter(id => id !== versionId));
    } else if (selectedVersions.length < 2) {
      setSelectedVersions([...selectedVersions, versionId]);
    } else {
      // Substituir a primeira seleção
      setSelectedVersions([selectedVersions[1], versionId]);
    }
  };

  const handleCompare = () => {
    if (selectedVersions.length === 2 && onCompareVersions) {
      onCompareVersions(selectedVersions[0], selectedVersions[1]);
    }
  };

  const sortedVersions = [...versions].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (versions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum Histórico Disponível
          </h3>
          <p className="text-gray-600">
            Este checklist ainda não possui versões anteriores.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <History className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                Histórico de Versões
              </h2>
              <p className="text-sm text-gray-600">
                {versions.length} versão{versions.length !== 1 ? 'ões' : ''} disponível{versions.length !== 1 ? 'eis' : ''}
              </p>
            </div>
          </div>

          {selectedVersions.length === 2 && (
            <button
              onClick={handleCompare}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <GitCompare className="w-4 h-4" />
              Comparar Versões
            </button>
          )}
        </div>

        {selectedVersions.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              {selectedVersions.length === 1 
                ? '1 versão selecionada. Selecione mais uma para comparar.'
                : '2 versões selecionadas. Clique em "Comparar Versões" para ver as diferenças.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Lista de versões */}
      <div className="divide-y divide-gray-200">
        {sortedVersions.map((version) => {
          const isExpanded = expandedVersions.has(version.id);
          const isSelected = selectedVersions.includes(version.id);
          const isCurrent = version.version === currentVersion;

          return (
            <div key={version.id} className={`${isSelected ? 'bg-blue-50' : ''}`}>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleVersionSelect(version.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      disabled={selectedVersions.length >= 2 && !isSelected}
                    />
                    
                    <button
                      onClick={() => toggleVersion(version.id)}
                      className="flex items-center gap-2 text-left"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      )}
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">
                            Versão {version.version}
                          </span>
                          {isCurrent && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Atual
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {version.description}
                        </p>
                      </div>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {onViewVersion && (
                      <button
                        onClick={() => onViewVersion(version.id)}
                        className="p-2 text-gray-400 hover:text-gray-600"
                        title="Visualizar versão"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4 pl-9 space-y-3">
                    {/* Informações da versão */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <User className="w-4 h-4" />
                        <span>Criado por: {version.createdBy}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>
                          {format(new Date(version.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                        </span>
                      </div>
                    </div>

                    {/* Snapshot da versão */}
                    {version.snapshot && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Resumo da Versão
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Categorias:</span>
                            <span className="ml-2 font-medium">
                              {version.snapshot.categories?.length || 0}
                            </span>
                          </div>
                          
                          <div>
                            <span className="text-gray-600">Itens:</span>
                            <span className="ml-2 font-medium">
                              {version.snapshot.categories?.reduce((sum, cat) => 
                                sum + (cat.items?.length || 0), 0
                              ) || 0}
                            </span>
                          </div>
                          
                          <div>
                            <span className="text-gray-600">Categoria:</span>
                            <span className="ml-2 font-medium">
                              {version.snapshot.category}
                            </span>
                          </div>
                        </div>

                        {/* Tags da versão */}
                        {version.snapshot.tags && version.snapshot.tags.length > 0 && (
                          <div className="mt-3">
                            <span className="text-sm text-gray-600 flex items-center gap-1 mb-2">
                              <Tag className="w-3 h-3" />
                              Tags:
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {version.snapshot.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-200 text-gray-700"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Alterações principais */}
                    {version.changes && version.changes.length > 0 && (
                      <div className="bg-yellow-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-yellow-600" />
                          Principais Alterações
                        </h4>
                        <ul className="space-y-1">
                          {version.changes.map((change, index) => (
                            <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                              <span className="text-yellow-600 mt-1">•</span>
                              {change}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VersionHistory;