import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { ChecklistEditor } from '../components/checklist/ChecklistEditor';
import { useAuditProStore } from '../store';
import { ChecklistFormData } from '../types';

const ChecklistNew: React.FC = () => {
  const navigate = useNavigate();
  const { createChecklist } = useAuditProStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ChecklistFormData>({
    name: '',
    description: '',
    category: '',
    tags: [],
    categories: []
  });

  const handleSave = (data: ChecklistFormData) => {
    try {
      const checklistData = {
      ...data,
      version: '1.0',
      isActive: true,
      createdBy: 'Admin',
      totalWeight: data.categories.reduce((sum, cat) => sum + cat.weight, 0),
      maxScore: data.categories.reduce((sum, cat) => 
        sum + cat.items.reduce((itemSum, item) => itemSum + (item.maxScore || 0), 0), 0
      ),
      versions: [],
      categories: data.categories.map((category, categoryIndex) => ({
        id: category.id || `category-${categoryIndex}`,
        name: category.title,
        title: category.title,
        description: category.description,
        weight: category.weight,
        order: categoryIndex,
        items: category.items.map((item, itemIndex) => ({
          id: item.id || `item-${categoryIndex}-${itemIndex}`,
          title: item.title,
          description: item.description,
          weight: item.weight,
          isRequired: item.isRequired,
          order: itemIndex,
          criteria: item.criteria || [],
          evidenceRequired: item.evidenceRequired,
          maxScore: item.maxScore,
        })),
      }))
    };
      
      createChecklist(checklistData);
      toast.success('Checklist criado com sucesso!');
      navigate('/checklists');
    } catch (error) {
      console.error('Erro ao criar checklist:', error);
      toast.error('Erro ao criar checklist. Tente novamente.');
    }
  };

  const handleCancel = () => {
    navigate('/checklists');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/checklists')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Checklists
          </button>
          <h1 className="text-xl font-semibold text-gray-900">
            Novo Checklist
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={(e) => { e.preventDefault(); handleSave(formData); }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Checklist *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  placeholder="Digite o nome do checklist"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="Segurança">Segurança</option>
                  <option value="Qualidade">Qualidade</option>
                  <option value="Meio Ambiente">Meio Ambiente</option>
                  <option value="Processos">Processos</option>
                  <option value="Infraestrutura">Infraestrutura</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                placeholder="Descreva o objetivo e escopo do checklist"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (separadas por vírgula)
              </label>
              <input
                type="text"
                value={formData.tags.join(', ')}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag) 
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                placeholder="auditoria, segurança, qualidade"
              />
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/checklists')}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Criando...' : 'Criar Checklist'}
              </button>
            </div>
          </form>
        </div>
        
        <ChecklistEditor
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default ChecklistNew;