import React, { useState } from 'react';
import { 
  Eye, 
  Edit3, 
  Save, 
  X, 
  Plus, 
  Minus, 
  AlertCircle, 
  CheckCircle,
  FileText,
  Tag,
  Weight,
  Trash2
} from 'lucide-react';
import { Checklist, ChecklistCategory, ChecklistItem, NormativeRequirement } from '../../types';
import { toast } from 'sonner';

interface ChecklistPreviewProps {
  checklist: Checklist;
  onSave: (checklist: Checklist) => void;
  onCancel: () => void;
  isEditable?: boolean;
}

export const ChecklistPreview: React.FC<ChecklistPreviewProps> = ({
  checklist: initialChecklist,
  onSave,
  onCancel,
  isEditable = true
}) => {
  const [checklist, setChecklist] = useState<Checklist>(initialChecklist);
  const [isEditing, setIsEditing] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set([0]));

  const handleSave = () => {
    // Validações básicas
    if (!checklist.name.trim()) {
      toast.error('Nome do checklist é obrigatório');
      return;
    }

    if (!checklist.description.trim()) {
      toast.error('Descrição do checklist é obrigatória');
      return;
    }

    if (checklist.categories.length === 0) {
      toast.error('Pelo menos uma categoria é obrigatória');
      return;
    }

    // Validar se todas as categorias têm pelo menos um item
    const emptyCategoriesCount = checklist.categories.filter(cat => !cat.items || cat.items.length === 0).length;
    if (emptyCategoriesCount > 0) {
      toast.error(`${emptyCategoriesCount} categoria(s) estão vazias. Adicione pelo menos um item em cada categoria.`);
      return;
    }

    onSave(checklist);
  };

  const updateChecklistField = (field: keyof Checklist, value: any) => {
    setChecklist(prev => ({ ...prev, [field]: value }));
  };

  const updateCategory = (categoryIndex: number, updates: Partial<ChecklistCategory>) => {
    setChecklist(prev => ({
      ...prev,
      categories: prev.categories.map((cat, index) => 
        index === categoryIndex ? { ...cat, ...updates } : cat
      )
    }));
  };

  const addCategory = () => {
    const newCategory: ChecklistCategory = {
      id: `cat_${Date.now()}`,
      name: 'Nova Categoria',
      title: 'Nova Categoria',
      description: '',
      weight: 1,
      order: checklist.categories.length,
      items: []
    };

    setChecklist(prev => ({
      ...prev,
      categories: [...prev.categories, newCategory]
    }));

    // Expandir a nova categoria
    setExpandedCategories(prev => new Set([...prev, checklist.categories.length]));
  };

  const removeCategory = (categoryIndex: number) => {
    if (checklist.categories.length <= 1) {
      toast.error('Pelo menos uma categoria é obrigatória');
      return;
    }

    setChecklist(prev => ({
      ...prev,
      categories: prev.categories.filter((_, index) => index !== categoryIndex)
    }));
  };

  const updateItem = (categoryIndex: number, itemIndex: number, updates: Partial<ChecklistItem>) => {
    setChecklist(prev => ({
      ...prev,
      categories: prev.categories.map((cat, catIndex) => 
        catIndex === categoryIndex 
          ? {
              ...cat,
              items: cat.items?.map((item, itmIndex) => 
                itmIndex === itemIndex ? { ...item, ...updates } : item
              ) || []
            }
          : cat
      )
    }));
  };

  const addItem = (categoryIndex: number) => {
    const newItem: ChecklistItem = {
      id: `item_${Date.now()}`,
      title: 'Novo Item',
      description: '',
      weight: 1,
      isRequired: true,
      order: 0,
      criteria: [],
      evidenceRequired: true,
      maxScore: 10
    };

    setChecklist(prev => ({
      ...prev,
      categories: prev.categories.map((cat, index) => 
        index === categoryIndex 
          ? { ...cat, items: [...(cat.items || []), newItem] }
          : cat
      )
    }));
  };

  const removeItem = (categoryIndex: number, itemIndex: number) => {
    setChecklist(prev => ({
      ...prev,
      categories: prev.categories.map((cat, catIndex) => 
        catIndex === categoryIndex 
          ? {
              ...cat,
              items: cat.items?.filter((_, itmIndex) => itmIndex !== itemIndex) || []
            }
          : cat
      )
    }));
  };

  const toggleCategoryExpansion = (categoryIndex: number) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryIndex)) {
        newSet.delete(categoryIndex);
      } else {
        newSet.add(categoryIndex);
      }
      return newSet;
    });
  };

  const totalItems = checklist.categories.reduce((sum, cat) => sum + (cat.items?.length || 0), 0);
  const totalWeight = checklist.categories.reduce((sum, cat) => 
    sum + (cat.items?.reduce((itemSum, item) => itemSum + (item.weight || 1), 0) || 0), 0
  );

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {isEditing ? 'Editar Checklist' : 'Revisar Checklist'}
            </h2>
            <p className="text-sm text-gray-600">
              {isEditing ? 'Faça as alterações necessárias antes de salvar' : 'Revise os dados importados antes de salvar'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isEditable && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isEditing 
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              {isEditing ? <Eye className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
              {isEditing ? 'Visualizar' : 'Editar'}
            </button>
          )}
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-h-[70vh] overflow-y-auto">
        {/* Informações Básicas */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Informações Básicas</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Checklist *
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={checklist.name}
                  onChange={(e) => updateChecklistField('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Digite o nome do checklist"
                />
              ) : (
                <p className="text-gray-900 py-2">{checklist.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={checklist.category}
                  onChange={(e) => updateChecklistField('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Digite a categoria"
                />
              ) : (
                <p className="text-gray-900 py-2">{checklist.category}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição *
              </label>
              {isEditing ? (
                <textarea
                  value={checklist.description}
                  onChange={(e) => updateChecklistField('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Digite a descrição do checklist"
                />
              ) : (
                <p className="text-gray-900 py-2">{checklist.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Estatísticas</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">{checklist.categories.length}</div>
              <div className="text-sm text-blue-700">Categorias</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">{totalItems}</div>
              <div className="text-sm text-green-700">Itens</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600">{totalWeight}</div>
              <div className="text-sm text-purple-700">Peso Total</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-yellow-600">{checklist.version}</div>
              <div className="text-sm text-yellow-700">Versão</div>
            </div>
          </div>
        </div>

        {/* Categorias e Itens */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Categorias e Itens</h3>
            {isEditing && (
              <button
                onClick={addCategory}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Adicionar Categoria
              </button>
            )}
          </div>

          <div className="space-y-4">
            {checklist.categories.map((category, categoryIndex) => (
              <div key={category.id || categoryIndex} className="border border-gray-200 rounded-lg">
                {/* Category Header */}
                <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center gap-3 flex-1">
                    <button
                      onClick={() => toggleCategoryExpansion(categoryIndex)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      {expandedCategories.has(categoryIndex) ? (
                        <Minus className="h-4 w-4" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </button>
                    
                    {isEditing ? (
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                          type="text"
                          value={category.title}
                          onChange={(e) => updateCategory(categoryIndex, { title: e.target.value })}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Título da categoria"
                        />
                        <input
                          type="text"
                          value={category.description || ''}
                          onChange={(e) => updateCategory(categoryIndex, { description: e.target.value })}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Descrição da categoria"
                        />
                        <input
                          type="number"
                          value={category.weight}
                          onChange={(e) => updateCategory(categoryIndex, { weight: Number(e.target.value) })}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Peso"
                          min="1"
                        />
                      </div>
                    ) : (
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{category.title}</h4>
                        {category.description && (
                          <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      {category.items?.length || 0} itens
                    </span>
                    {isEditing && (
                      <button
                        onClick={() => removeCategory(categoryIndex)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                        title="Remover categoria"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Category Items */}
                {expandedCategories.has(categoryIndex) && (
                  <div className="p-4">
                    {category.items && category.items.length > 0 ? (
                      <div className="space-y-3">
                        {category.items.map((item, itemIndex) => (
                          <div key={item.id || itemIndex} className="border border-gray-100 rounded-lg p-3 bg-gray-50">
                            {isEditing ? (
                              <div className="space-y-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <input
                                    type="text"
                                    value={item.title}
                                    onChange={(e) => updateItem(categoryIndex, itemIndex, { title: e.target.value })}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Título do item"
                                  />
                                  <input
                                    type="number"
                                    value={item.weight || 1}
                                    onChange={(e) => updateItem(categoryIndex, itemIndex, { weight: Number(e.target.value) })}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Peso"
                                    min="1"
                                  />
                                </div>
                                <textarea
                                  value={item.description || ''}
                                  onChange={(e) => updateItem(categoryIndex, itemIndex, { description: e.target.value })}
                                  rows={2}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="Descrição do item"
                                />
                                <div className="flex items-center justify-between">
                                  <label className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      checked={item.isRequired}
                                      onChange={(e) => updateItem(categoryIndex, itemIndex, { isRequired: e.target.checked })}
                                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">Item obrigatório</span>
                                  </label>
                                  <button
                                    onClick={() => removeItem(categoryIndex, itemIndex)}
                                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                                    title="Remover item"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h5 className="font-medium text-gray-900">{item.title}</h5>
                                    {item.description && (
                                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Weight className="h-3 w-3" />
                                    {item.weight || 1}
                                  </div>
                                </div>
                                {item.isRequired && (
                                  <div className="flex items-center gap-1 mt-2">
                                    <AlertCircle className="h-3 w-3 text-red-500" />
                                    <span className="text-xs text-red-600">Obrigatório</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">Nenhum item nesta categoria</p>
                    )}

                    {isEditing && (
                      <button
                        onClick={() => addItem(categoryIndex)}
                        className="w-full mt-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
                      >
                        <Plus className="h-4 w-4 inline mr-2" />
                        Adicionar Item
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <CheckCircle className="h-4 w-4 text-green-600" />
          Checklist pronto para ser salvo
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="h-4 w-4" />
            Salvar Checklist
          </button>
        </div>
      </div>
    </div>
  );
};