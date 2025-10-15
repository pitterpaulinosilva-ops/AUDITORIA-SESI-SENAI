import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import ChecklistEditor from '../components/checklist/ChecklistEditor';
import { useAuditProStore } from '../store';
import { ChecklistFormData } from '../types';

const ChecklistNew: React.FC = () => {
  const navigate = useNavigate();
  const { createChecklist } = useAuditProStore();

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
                  Novo Checklist
                </h1>
                <p className="text-sm text-gray-600">
                  Crie um novo checklist para suas auditorias
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ChecklistEditor
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default ChecklistNew;