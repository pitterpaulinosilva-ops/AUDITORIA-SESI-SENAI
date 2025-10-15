import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  GitCompare,
  Plus,
  Minus,
  Edit,
  ArrowRight,
  User,
  Clock,
  Tag,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { ChecklistVersion } from '../../types';

interface VersionComparisonProps {
  version1: ChecklistVersion;
  version2: ChecklistVersion;
  onClose: () => void;
}

interface ComparisonItem {
  type: 'added' | 'removed' | 'modified' | 'unchanged';
  field: string;
  oldValue?: any;
  newValue?: any;
  path: string;
}

const VersionComparison: React.FC<VersionComparisonProps> = ({
  version1,
  version2,
  onClose,
}) => {
  // Função para comparar duas versões e gerar diferenças
  const generateComparison = (): ComparisonItem[] => {
    const differences: ComparisonItem[] = [];
    
    if (!version1.snapshot || !version2.snapshot) {
      return differences;
    }

    const v1 = version1.snapshot;
    const v2 = version2.snapshot;

    // Comparar informações básicas
    if (v1.name !== v2.name) {
      differences.push({
        type: 'modified',
        field: 'Nome',
        oldValue: v1.name,
        newValue: v2.name,
        path: 'basic.name',
      });
    }

    if (v1.description !== v2.description) {
      differences.push({
        type: 'modified',
        field: 'Descrição',
        oldValue: v1.description,
        newValue: v2.description,
        path: 'basic.description',
      });
    }

    if (v1.category !== v2.category) {
      differences.push({
        type: 'modified',
        field: 'Categoria',
        oldValue: v1.category,
        newValue: v2.category,
        path: 'basic.category',
      });
    }

    // Comparar tags
    const v1Tags = v1.tags || [];
    const v2Tags = v2.tags || [];
    
    const addedTags = v2Tags.filter(tag => !v1Tags.includes(tag));
    const removedTags = v1Tags.filter(tag => !v2Tags.includes(tag));

    addedTags.forEach(tag => {
      differences.push({
        type: 'added',
        field: 'Tag',
        newValue: tag,
        path: 'tags',
      });
    });

    removedTags.forEach(tag => {
      differences.push({
        type: 'removed',
        field: 'Tag',
        oldValue: tag,
        path: 'tags',
      });
    });

    // Comparar categorias
    const v1Categories = v1.categories || [];
    const v2Categories = v2.categories || [];

    // Categorias adicionadas
    v2Categories.forEach(cat2 => {
      const existsInV1 = v1Categories.find(cat1 => cat1.id === cat2.id);
      if (!existsInV1) {
        differences.push({
          type: 'added',
          field: 'Categoria',
          newValue: cat2.title,
          path: `categories.${cat2.id}`,
        });
      }
    });

    // Categorias removidas
    v1Categories.forEach(cat1 => {
      const existsInV2 = v2Categories.find(cat2 => cat2.id === cat1.id);
      if (!existsInV2) {
        differences.push({
          type: 'removed',
          field: 'Categoria',
          oldValue: cat1.title,
          path: `categories.${cat1.id}`,
        });
      }
    });

    // Categorias modificadas
    v1Categories.forEach(cat1 => {
      const cat2 = v2Categories.find(cat => cat.id === cat1.id);
      if (cat2) {
        if (cat1.title !== cat2.title) {
          differences.push({
            type: 'modified',
            field: 'Título da Categoria',
            oldValue: cat1.title,
            newValue: cat2.title,
            path: `categories.${cat1.id}.title`,
          });
        }

        if (cat1.weight !== cat2.weight) {
          differences.push({
            type: 'modified',
            field: 'Peso da Categoria',
            oldValue: `${cat1.weight}%`,
            newValue: `${cat2.weight}%`,
            path: `categories.${cat1.id}.weight`,
          });
        }

        // Comparar itens da categoria
        const cat1Items = cat1.items || [];
        const cat2Items = cat2.items || [];

        // Itens adicionados
        cat2Items.forEach(item2 => {
          const existsInCat1 = cat1Items.find(item1 => item1.id === item2.id);
          if (!existsInCat1) {
            differences.push({
              type: 'added',
              field: 'Item',
              newValue: `${item2.title} (${cat2.title})`,
              path: `categories.${cat1.id}.items.${item2.id}`,
            });
          }
        });

        // Itens removidos
        cat1Items.forEach(item1 => {
          const existsInCat2 = cat2Items.find(item2 => item2.id === item1.id);
          if (!existsInCat2) {
            differences.push({
              type: 'removed',
              field: 'Item',
              oldValue: `${item1.title} (${cat1.title})`,
              path: `categories.${cat1.id}.items.${item1.id}`,
            });
          }
        });

        // Itens modificados
        cat1Items.forEach(item1 => {
          const item2 = cat2Items.find(item => item.id === item1.id);
          if (item2) {
            if (item1.title !== item2.title) {
              differences.push({
                type: 'modified',
                field: 'Título do Item',
                oldValue: `${item1.title} (${cat1.title})`,
                newValue: `${item2.title} (${cat2.title})`,
                path: `categories.${cat1.id}.items.${item1.id}.title`,
              });
            }

            if (item1.weight !== item2.weight) {
              differences.push({
                type: 'modified',
                field: 'Peso do Item',
                oldValue: `${item1.weight}% (${item1.title})`,
                newValue: `${item2.weight}% (${item2.title})`,
                path: `categories.${cat1.id}.items.${item1.id}.weight`,
              });
            }

            if (item1.maxScore !== item2.maxScore) {
              differences.push({
                type: 'modified',
                field: 'Pontuação Máxima',
                oldValue: `${item1.maxScore} pts (${item1.title})`,
                newValue: `${item2.maxScore} pts (${item2.title})`,
                path: `categories.${cat1.id}.items.${item1.id}.maxScore`,
              });
            }
          }
        });
      }
    });

    return differences;
  };

  const differences = generateComparison();
  const addedCount = differences.filter(d => d.type === 'added').length;
  const removedCount = differences.filter(d => d.type === 'removed').length;
  const modifiedCount = differences.filter(d => d.type === 'modified').length;

  const getChangeIcon = (type: string) => {
    switch (type) {
      case 'added':
        return <Plus className="w-4 h-4 text-green-600" />;
      case 'removed':
        return <Minus className="w-4 h-4 text-red-600" />;
      case 'modified':
        return <Edit className="w-4 h-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const getChangeColor = (type: string) => {
    switch (type) {
      case 'added':
        return 'bg-green-50 border-green-200';
      case 'removed':
        return 'bg-red-50 border-red-200';
      case 'modified':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GitCompare className="w-6 h-6 text-blue-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Comparação de Versões
                </h2>
                <p className="text-sm text-gray-600">
                  Versão {version1.version} vs Versão {version2.version}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Resumo das mudanças */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-semibold text-gray-900">{differences.length}</div>
              <div className="text-sm text-gray-600">Total de Mudanças</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-semibold text-green-600">{addedCount}</div>
              <div className="text-sm text-gray-600">Adicionados</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-lg font-semibold text-red-600">{removedCount}</div>
              <div className="text-sm text-gray-600">Removidos</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-semibold text-blue-600">{modifiedCount}</div>
              <div className="text-sm text-gray-600">Modificados</div>
            </div>
          </div>
        </div>

        {/* Informações das versões */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-3">
                Versão {version1.version} (Anterior)
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="w-4 h-4" />
                  {version1.createdBy}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  {format(new Date(version1.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                </div>
                <div className="flex items-start gap-2 text-gray-600">
                  <FileText className="w-4 h-4 mt-0.5" />
                  <span>{version1.description}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-3">
                Versão {version2.version} (Posterior)
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="w-4 h-4" />
                  {version2.createdBy}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  {format(new Date(version2.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                </div>
                <div className="flex items-start gap-2 text-gray-600">
                  <FileText className="w-4 h-4 mt-0.5" />
                  <span>{version2.description}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de diferenças */}
        <div className="flex-1 overflow-y-auto p-6">
          {differences.length === 0 ? (
            <div className="text-center py-12">
              <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma Diferença Encontrada
              </h3>
              <p className="text-gray-600">
                As duas versões são idênticas em conteúdo.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Detalhes das Mudanças
              </h3>
              
              {differences.map((diff, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 ${getChangeColor(diff.type)}`}
                >
                  <div className="flex items-start gap-3">
                    {getChangeIcon(diff.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900">
                          {diff.field}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          diff.type === 'added' ? 'bg-green-100 text-green-800' :
                          diff.type === 'removed' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {diff.type === 'added' ? 'Adicionado' :
                           diff.type === 'removed' ? 'Removido' : 'Modificado'}
                        </span>
                      </div>

                      {diff.type === 'modified' && (
                        <div className="flex items-center gap-3 text-sm">
                          <div className="flex-1">
                            <span className="text-gray-600">De: </span>
                            <span className="font-medium text-red-700">
                              {diff.oldValue}
                            </span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                          <div className="flex-1">
                            <span className="text-gray-600">Para: </span>
                            <span className="font-medium text-green-700">
                              {diff.newValue}
                            </span>
                          </div>
                        </div>
                      )}

                      {diff.type === 'added' && (
                        <div className="text-sm">
                          <span className="text-gray-600">Valor: </span>
                          <span className="font-medium text-green-700">
                            {diff.newValue}
                          </span>
                        </div>
                      )}

                      {diff.type === 'removed' && (
                        <div className="text-sm">
                          <span className="text-gray-600">Valor: </span>
                          <span className="font-medium text-red-700">
                            {diff.oldValue}
                          </span>
                        </div>
                      )}

                      <div className="text-xs text-gray-500 mt-2">
                        Caminho: {diff.path}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VersionComparison;