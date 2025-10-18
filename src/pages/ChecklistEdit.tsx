import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ChecklistEditor } from '../components/checklist/ChecklistEditor';
import { useAuditProStore } from '../store';
import { ChecklistFormData } from '../types';

const ChecklistEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getChecklistById, updateChecklist } = useAuditProStore();
  const [checklist, setChecklist] = useState<ChecklistFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        // Converter para formato do formulário
        const formData: ChecklistFormData = {
          name: foundChecklist.name,
          description: foundChecklist.description,
          category: foundChecklist.category,
          tags: foundChecklist.tags || [],
          categories: foundChecklist.categories || [],
        };

        setChecklist(formData);
        setIsLoading(false);
      } catch (err) {
        console.error('Erro ao carregar checklist:', err);
        setError('Erro ao carregar checklist');
        setIsLoading(false);
      }
    };

    loadChecklist();
  }, [id, getChecklistById]);

  const handleSave = (data: ChecklistFormData) => {
    if (!id) {
      toast.error('ID do checklist não encontrado');
      return;
    }

    try {
      const processedData = {
        ...data,
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
      
      updateChecklist(id, processedData);
      toast.success('Checklist atualizado com sucesso!');
      navigate('/checklists');
    } catch (error) {
      console.error('Erro ao atualizar checklist:', error);
      toast.error('Erro ao atualizar checklist. Tente novamente.');
    }
  };

  const handleCancel = () => {
    navigate('/checklists');
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
                    Editar Checklist
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Content */}
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
              className="btn btn-primary"
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
                  Editar Checklist
                </h1>
                <p className="text-sm text-gray-600">
                  {checklist.name}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ChecklistEditor
          initialData={checklist}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default ChecklistEdit;