import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  ArrowLeft,
  Edit,
  Copy,
  History,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  Tag,
  Weight,
  FileText,
  Camera,
  Star,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuditProStore } from '../store';
import { Checklist, ChecklistCategory, ChecklistItem, ChecklistVersion } from '../types';

const ChecklistView: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { 
    getChecklistById, 
    duplicateChecklist, 
    toggleChecklistStatus,
    getChecklistVersions 
  } = useAuditProStore();
  
  const [checklist, setChecklist] = useState<Checklist | null>(null);
  const [versions, setVersions] = useState<ChecklistVersion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [showVersionHistory, setShowVersionHistory] = useState(false);

  useEffect(() => {
    const loadChecklist = () => {
      if (!id) {
        setError('ID do checklist não fornecido');
        setIsLoading(false);
        return;
      }

      try {
        const foundChecklist = getChecklistById(id);
        if (!foundChecklist) {
          setError('Checklist não encontrado');
          setIsLoading(false);
          return;
        }

        setChecklist(foundChecklist);
        
        // Carregar versões
        const checklistVersions = getChecklistVersions(id);
        setVersions(checklistVersions);
        
        // Expandir todas as categorias por padrão
        const categoryIds = new Set(foundChecklist.categories?.map(cat => cat.id) || []);
        setExpandedCategories(categoryIds);
        
        setIsLoading(false);
      } catch (err) {
        console.error('Erro ao carregar checklist:', err);
        setError('Erro ao carregar checklist');
        setIsLoading(false);
      }
    };

    loadChecklist();
  }, [id, getChecklistById, getChecklistVersions]);

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleDuplicate = () => {
    if (!checklist) return;
    
    try {
      const duplicatedId = duplicateChecklist(checklist.id);
      toast.success('Checklist duplicado com sucesso!');
      navigate(`/checklists/${duplicatedId}/edit`);
    } catch (error) {
      console.error('Erro ao duplicar checklist:', error);
      toast.error('Erro ao duplicar checklist. Tente novamente.');
    }
  };

  const handleToggleStatus = () => {
    if (!checklist) return;
    
    try {
      toggleChecklistStatus(checklist.id);
      setChecklist(prev => prev ? { ...prev, isActive: !prev.isActive } : null);
      toast.success(`Checklist ${checklist.isActive ? 'desativado' : 'ativado'} com sucesso!`);
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      toast.error('Erro ao alterar status. Tente novamente.');
    }
  };

  const calculateCategoryTotal = (category: ChecklistCategory): number => {
    return category.items?.reduce((sum, item) => sum + (item.maxScore || 0), 0) || 0;
  };

  const calculateChecklistTotal = (): number => {
    return checklist?.categories?.reduce((sum, category) => sum + calculateCategoryTotal(category), 0) || 0;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando checklist...</p>
        </div>
      </div>
    );
  }

  if (error || !checklist) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/checklists')}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="hidden sm:inline">Voltar</span>
                </button>
                <h1 className="text-xl font-semibold text-gray-900">
                  Visualizar Checklist
                </h1>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Erro ao Carregar Checklist
            </h2>
            <p className="text-gray-600 mb-6">
              {error || 'Checklist não encontrado'}
            </p>
            <button
              onClick={() => navigate('/checklists')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Voltar para Lista
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/checklists')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Voltar</span>
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {checklist.name}
                </h1>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Versão {checklist.version}</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    checklist.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {checklist.isActive ? (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Ativo
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3 mr-1" />
                        Inativo
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowVersionHistory(!showVersionHistory)}
                className="flex items-center gap-2 px-3 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <History className="w-4 h-4" />
                <span className="hidden sm:inline">Histórico</span>
              </button>
              <button
                onClick={handleDuplicate}
                className="flex items-center gap-2 px-3 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Copy className="w-4 h-4" />
                <span className="hidden sm:inline">Duplicar</span>
              </button>
              <button
                onClick={handleToggleStatus}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                  checklist.isActive
                    ? 'text-red-700 border border-red-300 hover:bg-red-50'
                    : 'text-green-700 border border-green-300 hover:bg-green-50'
                }`}
              >
                {checklist.isActive ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    <span className="hidden sm:inline">Desativar</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    <span className="hidden sm:inline">Ativar</span>
                  </>
                )}
              </button>
              <button
                onClick={() => navigate(`/checklists/${checklist.id}/edit`)}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Edit className="w-4 h-4" />
                <span className="hidden sm:inline">Editar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Conteúdo principal */}
          <div className="lg:col-span-3 space-y-6">
            {/* Informações básicas */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Informações Gerais</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Descrição</h3>
                  <p className="text-gray-900">{checklist.description}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Categoria</h3>
                  <p className="text-gray-900">{checklist.category}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Criado por</h3>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{checklist.createdBy}</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Data de criação</h3>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">
                      {format(new Date(checklist.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {checklist.tags && checklist.tags.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {checklist.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Resumo de pontuação */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Resumo de Pontuação</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{checklist.categories?.length || 0}</div>
                  <div className="text-sm text-gray-600">Categorias</div>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {checklist.categories?.reduce((sum, cat) => sum + (cat.items?.length || 0), 0) || 0}
                  </div>
                  <div className="text-sm text-gray-600">Itens</div>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{calculateChecklistTotal()}</div>
                  <div className="text-sm text-gray-600">Pontos Totais</div>
                </div>
              </div>
            </div>

            {/* Categorias */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Estrutura do Checklist</h2>
              
              <div className="space-y-4">
                {checklist.categories?.map((category) => (
                  <div key={category.id} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        {expandedCategories.has(category.id) ? (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        )}
                        <div>
                          <h3 className="font-medium text-gray-900">{category.title}</h3>
                          {category.description && (
                            <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Weight className="w-4 h-4" />
                          {category.weight}%
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4" />
                          {calculateCategoryTotal(category)} pts
                        </div>
                        <div className="text-gray-400">
                          {category.items?.length || 0} itens
                        </div>
                      </div>
                    </button>

                    {expandedCategories.has(category.id) && (
                      <div className="border-t border-gray-200 p-4 bg-gray-50">
                        <div className="space-y-3">
                          {category.items?.map((item, itemIndex) => (
                            <div key={item.id} className="bg-white rounded-lg p-4 border border-gray-200">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900">{item.title}</h4>
                                  {item.description && (
                                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                  )}
                                  
                                  {/* Critérios */}
                                  {item.criteria && item.criteria.length > 0 && (
                                    <div className="mt-3">
                                      <h5 className="text-xs font-medium text-gray-700 mb-2">Critérios:</h5>
                                      <ul className="space-y-1">
                                        {item.criteria.map((criterion, criterionIndex) => (
                                          <li key={criterionIndex} className="text-sm text-gray-600 flex items-start gap-2">
                                            <span className="text-gray-400 mt-1">•</span>
                                            {criterion}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="ml-4 text-right">
                                  <div className="text-sm font-medium text-gray-900">
                                    {item.maxScore} pts
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    Peso: {item.weight}%
                                  </div>
                                  <div className="flex items-center gap-2 mt-2">
                                    {item.isRequired && (
                                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                        Obrigatório
                                      </span>
                                    )}
                                    {item.evidenceRequired && (
                                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        <Camera className="w-3 h-3 mr-1" />
                                        Evidência
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Histórico de versões */}
            {showVersionHistory && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Histórico de Versões</h3>
                
                {versions.length > 0 ? (
                  <div className="space-y-3">
                    {versions.map((version) => (
                      <div key={version.id} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">v{version.version}</span>
                          <span className="text-xs text-gray-600">
                            {format(new Date(version.createdAt), 'dd/MM/yy', { locale: ptBR })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{version.description}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                          <User className="w-3 h-3" />
                          {version.createdBy}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-sm">Nenhuma versão anterior encontrada.</p>
                )}
              </div>
            )}

            {/* Estatísticas */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Estatísticas</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total de Categorias</span>
                  <span className="font-medium">{checklist.categories?.length || 0}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total de Itens</span>
                  <span className="font-medium">
                    {checklist.categories?.reduce((sum, cat) => sum + (cat.items?.length || 0), 0) || 0}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Itens Obrigatórios</span>
                  <span className="font-medium">
                    {checklist.categories?.reduce((sum, cat) => 
                      sum + (cat.items?.filter(item => item.isRequired).length || 0), 0
                    ) || 0}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Evidências Requeridas</span>
                  <span className="font-medium">
                    {checklist.categories?.reduce((sum, cat) => 
                      sum + (cat.items?.filter(item => item.evidenceRequired).length || 0), 0
                    ) || 0}
                  </span>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <span className="text-sm font-medium text-gray-900">Pontuação Máxima</span>
                  <span className="font-bold text-lg text-blue-600">{calculateChecklistTotal()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChecklistView;

// ...existing code ...