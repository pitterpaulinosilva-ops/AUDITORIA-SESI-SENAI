import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronRight,
  Save,
  X,
  Calculator,
  AlertCircle,
  Edit3,
  Check,
  Minus,
  Pencil
} from 'lucide-react';
import { ChecklistCategory, ChecklistItem, ChecklistFormData, NormativeSection, NormativeRequirement } from '../../types';
import { useAuditProStore } from '../../store';

// Interface para o Modal de Requisito Personalizado
interface CustomRequirementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (title: string, description: string) => void;
  existingTitles: string[];
}

// Componente Modal para Adicionar Requisito Personalizado
const CustomRequirementModal: React.FC<CustomRequirementModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  existingTitles,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [notification, setNotification] = useState('');

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
      setError('');
      setNotification('');
      // Focus on title input after modal opens
      setTimeout(() => {
        const titleInput = document.getElementById('custom-requirement-title');
        if (titleInput) titleInput.focus();
      }, 100);
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const handleSubmit = () => {
    if (!title.trim()) {
      setError('Título é obrigatório');
      return;
    }

    // Check for duplicates
    const titleExists = existingTitles.some(
      existingTitle => existingTitle.toLowerCase().trim() === title.toLowerCase().trim()
    );

    if (titleExists) {
      setNotification('Já existe um requisito com este título nesta categoria');
      setTimeout(() => setNotification(''), 3000);
      return;
    }

    onAdd(title.trim(), description.trim());
    onClose();
  };

  // Handle Enter key for submit
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-in fade-in duration-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Adicionar Requisito Personalizado
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Notification */}
          {notification && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <p className="text-sm text-red-700">{notification}</p>
              </div>
            </div>
          )}

          <div className="space-y-4" onKeyDown={handleKeyDown}>
            <div>
              <label htmlFor="custom-requirement-title" className="block text-sm font-medium text-gray-700 mb-1">
                Título *
              </label>
              <input
                id="custom-requirement-title"
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setError('');
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Digite o título do requisito"
              />
              {error && (
                <p className="text-red-600 text-sm mt-1">{error}</p>
              )}
            </div>

            <div>
              <label htmlFor="custom-requirement-description" className="block text-sm font-medium text-gray-700 mb-1">
                Descrição (opcional)
              </label>
              <textarea
                id="custom-requirement-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Digite uma descrição detalhada (opcional)"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Schema de validação
const checklistItemSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  weight: z.number().min(0.1, 'Peso deve ser maior que 0').max(100, 'Peso não pode exceder 100'),
  isRequired: z.boolean(),
  criteria: z.array(z.string()).optional(),
  evidenceRequired: z.boolean(),
  maxScore: z.number().min(1, 'Pontuação máxima deve ser maior que 0'),
});

const checklistCategorySchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  weight: z.number().min(0.1, 'Peso deve ser maior que 0').max(100, 'Peso não pode exceder 100'),
  items: z.array(checklistItemSchema).min(1, 'Categoria deve ter pelo menos um item'),
});

const checklistSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  tags: z.array(z.string()),
  categories: z.array(checklistCategorySchema).min(1, 'Checklist deve ter pelo menos uma categoria'),
});

type ChecklistFormValues = z.infer<typeof checklistSchema>;

interface ChecklistEditorProps {
  initialData?: ChecklistFormData;
  onSave: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

// Interface para requisito editável
interface EditableRequirement extends NormativeRequirement {
  included: boolean;
  isEditing: boolean;
  editedTitle?: string;
  editedDescription?: string;
}

// Componente para item sortable
interface SortableItemProps {
  id: string;
  children: React.ReactNode;
}

const SortableItem: React.FC<SortableItemProps> = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className="flex items-start gap-2">
        <button
          {...listeners}
          className="mt-2 p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-4 h-4" />
        </button>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};

// Componente para editar requisito normativo
interface RequirementEditorProps {
  requirement: EditableRequirement;
  onUpdate: (id: number, updates: Partial<EditableRequirement>) => void;
  onRemove: (id: number) => void;
}

const RequirementEditor: React.FC<RequirementEditorProps> = ({
  requirement,
  onUpdate,
  onRemove,
}) => {
  const [editedTitle, setEditedTitle] = useState(requirement.editedTitle || requirement.description);
  const [editedDescription, setEditedDescription] = useState(requirement.editedDescription || '');

  const handleSaveEdit = () => {
    onUpdate(requirement.id, {
      editedTitle,
      editedDescription,
      isEditing: false,
    });
  };

  const handleCancelEdit = () => {
    setEditedTitle(requirement.editedTitle || requirement.description);
    setEditedDescription(requirement.editedDescription || '');
    onUpdate(requirement.id, { isEditing: false });
  };

  return (
    <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={requirement.included}
          onChange={(e) => onUpdate(requirement.id, { included: e.target.checked })}
          className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-1 rounded">
              {requirement.code}
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => onUpdate(requirement.id, { isEditing: !requirement.isEditing })}
                className="p-1 text-blue-600 hover:text-blue-800"
                title="Editar requisito"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onRemove(requirement.id)}
                className="p-1 text-red-600 hover:text-red-800"
                title="Remover requisito"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {requirement.isEditing ? (
            <div className="space-y-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Título
                </label>
                <textarea
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Descrição (opcional)
                </label>
                <textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                >
                  <Check className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-900 font-medium">
                {requirement.editedTitle || requirement.description}
              </p>
              {requirement.editedDescription && (
                <p className="text-xs text-gray-600 mt-1">
                  {requirement.editedDescription}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Componente principal
export const ChecklistEditor: React.FC<ChecklistEditorProps> = ({
  initialData,
  onSave,
  onCancel,
  isLoading = false,
}) => {
  // Acessar o store para obter as categorias cadastradas
  const { checklistCategories } = useAuditProStore();
  
  // Estados para o novo fluxo
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedSections, setSelectedSections] = useState<number[]>([]);
  const [generatedCategories, setGeneratedCategories] = useState<{
    section: NormativeSection;
    requirements: EditableRequirement[];
    isExpanded: boolean;
  }[]>([]);
  const [showNormativeSections, setShowNormativeSections] = useState(false);
  const [showGeneratedCategories, setShowGeneratedCategories] = useState(false);
  
  // Estado para o modal de requisito personalizado
  const [isCustomRequirementModalOpen, setIsCustomRequirementModalOpen] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number | null>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ChecklistFormValues>({
    resolver: zodResolver(checklistSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      category: initialData?.category || '',
      tags: initialData?.tags || [],
      categories: initialData?.categories || [],
    },
  });

  const { fields: categoryFields, append: appendCategory, remove: removeCategory, move: moveCategory } = useFieldArray({
    control,
    name: 'categories',
  });

  const watchedCategories = watch('categories');
  const watchedCategory = watch('category');

  // Calcular peso total
  const totalWeight = watchedCategories.reduce((sum, category) => sum + (category.weight || 0), 0);
  const isWeightValid = Math.abs(totalWeight - 100) < 0.1;

  // Configurar sensores para drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Efeito para reagir à mudança de categoria
  useEffect(() => {
    if (watchedCategory) {
      const categoryId = parseInt(watchedCategory);
      const category = checklistCategories.find(cat => cat.id === categoryId.toString());
      
      if (category && (category as any).sections && (category as any).sections.length > 0) {
        setSelectedCategoryId(categoryId);
        setShowNormativeSections(true);
        setSelectedSections([]);
        setGeneratedCategories([]);
        setShowGeneratedCategories(false);
        // Limpar categorias existentes do formulário
        setValue('categories', []);
      } else {
        setShowNormativeSections(false);
        setShowGeneratedCategories(false);
      }
    } else {
      setShowNormativeSections(false);
      setShowGeneratedCategories(false);
      setSelectedCategoryId(null);
      setSelectedSections([]);
      setGeneratedCategories([]);
    }
  }, [watchedCategory, checklistCategories, setValue]);

  // Efeito para gerar categorias baseadas nas seções selecionadas
  useEffect(() => {
    if (selectedSections.length > 0 && selectedCategoryId) {
      const category = checklistCategories.find(cat => cat.id === selectedCategoryId?.toString());
      if (category && (category as any).sections) {
        const newGeneratedCategories = selectedSections.map(sectionId => {
          const section = (category as any).sections?.find(s => s.id === sectionId);
          if (section) {
            const requirements: EditableRequirement[] = section.requirements.map(req => ({
              ...req,
              included: true,
              isEditing: false,
            }));
            
            return {
              section,
              requirements,
              isExpanded: true,
            };
          }
          return null;
        }).filter(Boolean) as {
          section: NormativeSection;
          requirements: EditableRequirement[];
          isExpanded: boolean;
        }[];

        setGeneratedCategories(newGeneratedCategories);
        setShowGeneratedCategories(true);

        // Gerar categorias do formulário
        const formCategories = newGeneratedCategories.map((genCat, index) => {
          const includedRequirements = genCat.requirements.filter(req => req.included);
          const itemsPerRequirement = Math.max(1, Math.floor(100 / Math.max(1, includedRequirements.length)));
          
          return {
            title: genCat.section.name,
            description: `Categoria baseada na seção normativa: ${genCat.section.name}`,
            weight: Math.round(100 / newGeneratedCategories.length),
            items: includedRequirements.map((req, itemIndex) => ({
              title: req.editedTitle || req.description,
              description: req.editedDescription || '',
              weight: itemsPerRequirement,
              isRequired: true,
              criteria: [],
              evidenceRequired: true,
              maxScore: 10,
            })),
          };
        });

        setValue('categories', formCategories);
      }
    } else {
      setGeneratedCategories([]);
      setShowGeneratedCategories(false);
      setValue('categories', []);
    }
  }, [selectedSections, selectedCategoryId, checklistCategories, setValue]);

  const handleSectionToggle = (sectionId: number) => {
    setSelectedSections(prev => {
      if (prev.includes(sectionId)) {
        return prev.filter(id => id !== sectionId);
      } else {
        return [...prev, sectionId];
      }
    });
  };

  const handleRequirementUpdate = (categoryIndex: number, requirementId: number, updates: Partial<EditableRequirement>) => {
    setGeneratedCategories(prev => {
      const newCategories = [...prev];
      const category = newCategories[categoryIndex];
      if (category) {
        category.requirements = category.requirements.map(req =>
          req.id === requirementId ? { ...req, ...updates } : req
        );
      }
      return newCategories;
    });

    // Atualizar o formulário
    updateFormFromGeneratedCategories();
  };

  const handleRequirementRemove = (categoryIndex: number, requirementId: number) => {
    setGeneratedCategories(prev => {
      const newCategories = [...prev];
      const category = newCategories[categoryIndex];
      if (category) {
        category.requirements = category.requirements.filter(req => req.id !== requirementId);
      }
      return newCategories;
    });

    // Atualizar o formulário
    updateFormFromGeneratedCategories();
  };

  const handleAddCustomRequirement = (categoryIndex: number) => {
    setCurrentSectionIndex(categoryIndex);
    setIsCustomRequirementModalOpen(true);
  };

  const handleModalAddRequirement = (title: string, description: string) => {
    if (currentSectionIndex === null) return;

    // Gerar um ID único para o requisito personalizado (usando timestamp negativo para diferenciar dos normativos)
    const customId = -Date.now();
    
    const customRequirement: EditableRequirement = {
      id: customId,
      standard: 'CUSTOM',
      version: '1.0',
      chapter: 'Custom',
      requirementCode: `CUSTOM-${Math.abs(customId).toString().slice(-4)}`,
      code: `CUSTOM-${Math.abs(customId).toString().slice(-4)}`,
      description: title,
      evaluationCriteria: description,
      verificationType: 'yes_no' as const,
      weight: 1,
      observations: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      included: true,
      isEditing: false,
      editedTitle: title,
      editedDescription: description,
    };

    setGeneratedCategories(prev => {
      const newCategories = [...prev];
      const category = newCategories[currentSectionIndex];
      if (category) {
        category.requirements.push(customRequirement);
      }
      return newCategories;
    });

    // Atualizar o formulário
    setTimeout(() => updateFormFromGeneratedCategories(), 100);
  };

  const updateFormFromGeneratedCategories = () => {
    const formCategories = generatedCategories.map((genCat, index) => {
      const includedRequirements = genCat.requirements.filter(req => req.included);
      const itemsPerRequirement = Math.max(1, Math.floor(100 / Math.max(1, includedRequirements.length)));
      
      return {
        title: genCat.section.name,
        description: `Categoria baseada na seção normativa: ${genCat.section.name}`,
        weight: Math.round(100 / generatedCategories.length),
        items: includedRequirements.map((req, itemIndex) => ({
          title: req.editedTitle || req.description,
          description: req.editedDescription || '',
          weight: itemsPerRequirement,
          isRequired: true,
          criteria: [],
          evidenceRequired: true,
          maxScore: 10,
        })),
      };
    });

    setValue('categories', formCategories);
  };

  const toggleCategoryExpansion = (index: number) => {
    setGeneratedCategories(prev => {
      const newCategories = [...prev];
      newCategories[index].isExpanded = !newCategories[index].isExpanded;
      return newCategories;
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = categoryFields.findIndex(field => field.id === active.id);
      const newIndex = categoryFields.findIndex(field => field.id === over.id);

      moveCategory(oldIndex, newIndex);
    }
  };



  const onSubmit = (data: ChecklistFormValues) => {
    // Calcular totais
    const processedData = {
      ...data,
      categories: data.categories.map((category, categoryIndex) => ({
        id: `category-${categoryIndex}`,
        title: category.title,
        description: category.description,
        weight: category.weight,
        order: categoryIndex,
        items: category.items.map((item, itemIndex) => ({
          id: `item-${categoryIndex}-${itemIndex}`,
          title: item.title,
          description: item.description,
          weight: item.weight,
          isRequired: item.isRequired,
          order: itemIndex,
          criteria: item.criteria || [],
          evidenceRequired: item.evidenceRequired,
          maxScore: item.maxScore,
        })),
      })),
    };

    onSave(processedData);
  };

  const selectedCategory = selectedCategoryId ? checklistCategories.find(cat => cat.id === selectedCategoryId.toString()) : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Informações básicas */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Informações Básicas</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Checklist *
            </label>
            <input
              {...register('name')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nome do checklist"
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoria *
            </label>
            <select
              {...register('category')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecione uma categoria</option>
              {checklistCategories.map((category) => (
                <option key={category.id} value={category.id.toString()}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-600 text-sm mt-1">{errors.category.message}</p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrição *
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Descrição detalhada do checklist"
          />
          {errors.description && (
            <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>


      </div>

      {/* Seções Normativas */}
      {showNormativeSections && selectedCategory && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Seções Normativas *
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Selecione as seções normativas que deseja incluir no checklist:
          </p>
          
          <div className="space-y-3">
            {(selectedCategory as any).sections.map((section) => (
              <div key={section.id} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
                <input
                  type="checkbox"
                  id={`section-${section.id}`}
                  checked={selectedSections.includes(section.id)}
                  onChange={() => handleSectionToggle(section.id)}
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="flex-1">
                  <label htmlFor={`section-${section.id}`} className="block font-medium text-gray-900 cursor-pointer">
                    {section.name}
                  </label>
                  <p className="text-sm text-gray-600 mt-1">
                    {section.requirements.length} requisito(s) normativo(s)
                  </p>
                </div>
              </div>
            ))}
          </div>

          {selectedSections.length === 0 && (
            <p className="text-red-600 text-sm mt-2">
              Selecione pelo menos uma seção normativa.
            </p>
          )}
        </div>
      )}

      {/* Categorias Geradas */}
      {showGeneratedCategories && generatedCategories.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Categorias Geradas
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Revise e edite os requisitos normativos para cada categoria:
          </p>

          <div className="space-y-4">
            {generatedCategories.map((genCategory, categoryIndex) => (
              <div key={genCategory.section.id} className="border border-gray-300 rounded-lg">
                <div 
                  className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer"
                  onClick={() => toggleCategoryExpansion(categoryIndex)}
                >
                  <div className="flex items-center gap-2">
                    {genCategory.isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-600" />
                    )}
                    <h4 className="font-medium text-gray-900">
                      Categoria {categoryIndex + 1}: {genCategory.section.name}
                    </h4>
                  </div>
                  <span className="text-sm text-gray-600">
                    {genCategory.requirements.filter(req => req.included).length} de {genCategory.requirements.length} requisitos incluídos
                  </span>
                </div>

                {genCategory.isExpanded && (
                  <div className="p-4 space-y-3">
                    {genCategory.requirements.map((requirement) => (
                      <RequirementEditor
                        key={requirement.id}
                        requirement={requirement}
                        onUpdate={(id, updates) => handleRequirementUpdate(categoryIndex, id, updates)}
                        onRemove={(id) => handleRequirementRemove(categoryIndex, id)}
                      />
                    ))}
                    
                    {/* Botão para adicionar requisito personalizado */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleAddCustomRequirement(categoryIndex)}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Adicionar Requisito Personalizado
                      </button>
                      <p className="text-xs text-gray-500 mt-2">
                        Adicione requisitos customizados além dos normativos
                      </p>
                    </div>
                    
                    {genCategory.requirements.filter(req => req.included).length === 0 && (
                      <p className="text-red-600 text-sm">
                        Esta categoria deve ter pelo menos um requisito incluído.
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Calculadora de peso */}
      {showGeneratedCategories && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">Peso Total das Categorias</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-lg font-bold ${isWeightValid ? 'text-green-600' : 'text-red-600'}`}>
                {totalWeight.toFixed(1)}%
              </span>
              {!isWeightValid && (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
            </div>
          </div>
          {!isWeightValid && (
            <p className="text-red-600 text-sm mt-2">
              O peso total deve ser igual a 100%. Ajuste os pesos das categorias.
            </p>
          )}
        </div>
      )}

      {/* Botões de ação */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading || !isWeightValid || (showGeneratedCategories && generatedCategories.some(cat => cat.requirements.length === 0))}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          {isLoading ? 'Salvando...' : 'Salvar Checklist'}
        </button>
      </div>

      {/* Modal de Requisito Personalizado */}
      <CustomRequirementModal
        isOpen={isCustomRequirementModalOpen}
        onClose={() => {
          setIsCustomRequirementModalOpen(false);
          setCurrentSectionIndex(null);
        }}
        onAdd={handleModalAddRequirement}
        existingTitles={
          currentSectionIndex !== null && generatedCategories[currentSectionIndex]
            ? generatedCategories[currentSectionIndex].requirements.map(req => 
                req.editedTitle || req.description
              )
            : []
        }
      />
    </form>
  );
};