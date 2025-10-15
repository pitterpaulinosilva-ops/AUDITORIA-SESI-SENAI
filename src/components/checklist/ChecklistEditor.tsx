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
  SortableContext as SortableContextProvider,
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
  AlertCircle
} from 'lucide-react';
import { ChecklistCategory, ChecklistItem, ChecklistFormData } from '../../types';

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

// Componente para editar item
interface ItemEditorProps {
  index: number;
  categoryIndex: number;
  item: ChecklistItem;
  onUpdate: (updates: Partial<ChecklistItem>) => void;
  onRemove: () => void;
  register: any;
  errors: any;
}

const ItemEditor: React.FC<ItemEditorProps> = ({
  index,
  categoryIndex,
  item,
  onUpdate,
  onRemove,
  register,
  errors,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [criteria, setCriteria] = useState<string[]>(item.criteria || []);
  const [newCriterion, setNewCriterion] = useState('');

  const fieldPath = `categories.${categoryIndex}.items.${index}`;

  const addCriterion = () => {
    if (newCriterion.trim()) {
      const updatedCriteria = [...criteria, newCriterion.trim()];
      setCriteria(updatedCriteria);
      onUpdate({ criteria: updatedCriteria });
      setNewCriterion('');
    }
  };

  const removeCriterion = (criterionIndex: number) => {
    const updatedCriteria = criteria.filter((_, i) => i !== criterionIndex);
    setCriteria(updatedCriteria);
    onUpdate({ criteria: updatedCriteria });
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
          {item.title || 'Novo Item'}
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="text-red-600 hover:text-red-800 p-1"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título *
            </label>
            <input
              {...register(`${fieldPath}.title`)}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Título do item"
            />
            {errors?.categories?.[categoryIndex]?.items?.[index]?.title && (
              <p className="text-red-600 text-sm mt-1">
                {errors.categories[categoryIndex].items[index].title.message}
              </p>
            )}
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              {...register(`${fieldPath}.description`)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Descrição detalhada do item"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Peso */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Peso *
              </label>
              <input
                {...register(`${fieldPath}.weight`, { valueAsNumber: true })}
                type="number"
                step="0.1"
                min="0.1"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors?.categories?.[categoryIndex]?.items?.[index]?.weight && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.categories[categoryIndex].items[index].weight.message}
                </p>
              )}
            </div>

            {/* Pontuação máxima */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pontuação Máxima *
              </label>
              <input
                {...register(`${fieldPath}.maxScore`, { valueAsNumber: true })}
                type="number"
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors?.categories?.[categoryIndex]?.items?.[index]?.maxScore && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.categories[categoryIndex].items[index].maxScore.message}
                </p>
              )}
            </div>

            {/* Checkboxes */}
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  {...register(`${fieldPath}.isRequired`)}
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Obrigatório</span>
              </label>
              <label className="flex items-center">
                <input
                  {...register(`${fieldPath}.evidenceRequired`)}
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Evidência obrigatória</span>
              </label>
            </div>
          </div>

          {/* Critérios */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Critérios de Avaliação
            </label>
            <div className="space-y-2">
              {criteria.map((criterion, criterionIndex) => (
                <div key={criterionIndex} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={criterion}
                    onChange={(e) => {
                      const updatedCriteria = [...criteria];
                      updatedCriteria[criterionIndex] = e.target.value;
                      setCriteria(updatedCriteria);
                      onUpdate({ criteria: updatedCriteria });
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => removeCriterion(criterionIndex)}
                    className="text-red-600 hover:text-red-800 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newCriterion}
                  onChange={(e) => setNewCriterion(e.target.value)}
                  placeholder="Novo critério"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCriterion())}
                />
                <button
                  type="button"
                  onClick={addCriterion}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Componente principal
const ChecklistEditor: React.FC<ChecklistEditorProps> = ({
  initialData,
  onSave,
  onCancel,
  isLoading = false,
}) => {
  const [tagInput, setTagInput] = useState('');

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
      categories: initialData?.categories || [
        {
          id: Date.now().toString(),
          title: '',
          description: '',
          weight: 100,
          order: 0,
          items: [
            {
              id: Date.now().toString() + '_item',
              title: '',
              description: '',
              weight: 100,
              isRequired: true,
              order: 0,
              criteria: [],
              evidenceRequired: false,
              maxScore: 10,
            },
          ],
        },
      ],
    },
  });

  const { fields: categoryFields, append: appendCategory, remove: removeCategory, move: moveCategory } = useFieldArray({
    control,
    name: 'categories',
  });

  const watchedCategories = watch('categories');
  const watchedTags = watch('tags');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Calcular peso total
  const totalWeight = watchedCategories.reduce((sum, category) => sum + (category.weight || 0), 0);
  const isWeightValid = Math.abs(totalWeight - 100) < 0.01;

  // Handlers
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = categoryFields.findIndex((field) => field.id === active.id);
      const newIndex = categoryFields.findIndex((field) => field.id === over.id);

      moveCategory(oldIndex, newIndex);
    }
  };

  const addCategory = () => {
    appendCategory({
      title: '',
      description: '',
      weight: 0,
      items: [
        {
          title: '',
          description: '',
          weight: 100,
          isRequired: true,
          criteria: [],
          evidenceRequired: false,
          maxScore: 10,
        },
      ],
    });
  };

  const addItem = (categoryIndex: number) => {
    const currentItems = watchedCategories[categoryIndex]?.items || [];
    const newItem = {
      title: '',
      description: '',
      weight: 1,
      isRequired: false,
      evidenceRequired: false,
      maxScore: 10,
      criteria: []
    };
    setValue(`categories.${categoryIndex}.items`, [...currentItems, newItem]);
  };

  const removeItem = (categoryIndex: number, itemIndex: number) => {
    const currentItems = watchedCategories[categoryIndex].items;
    const updatedItems = currentItems.filter((_, i) => i !== itemIndex);
    setValue(`categories.${categoryIndex}.items`, updatedItems);
  };

  const addTag = () => {
    if (tagInput.trim() && !watchedTags.includes(tagInput.trim())) {
      setValue('tags', [...watchedTags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagIndex: number) => {
    const updatedTags = watchedTags.filter((_, i) => i !== tagIndex);
    setValue('tags', updatedTags);
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
            <input
              {...register('category')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Categoria do checklist"
            />
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

        {/* Tags */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {watchedTags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Nova tag"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            />
            <button
              type="button"
              onClick={addTag}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Calculadora de peso */}
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

      {/* Categorias */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Categorias</h3>
          <button
            type="button"
            onClick={addCategory}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Adicionar Categoria
          </button>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={categoryFields.map(field => field.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {categoryFields.map((field, categoryIndex) => (
                <SortableItem key={field.id} id={field.id}>
                  <div className="border border-gray-300 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-md font-medium text-gray-900">
                        Categoria {categoryIndex + 1}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeCategory(categoryIndex)}
                        className="text-red-600 hover:text-red-800 p-1"
                        disabled={categoryFields.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Título *
                        </label>
                        <input
                          {...register(`categories.${categoryIndex}.title`)}
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Título da categoria"
                        />
                        {errors?.categories?.[categoryIndex]?.title && (
                          <p className="text-red-600 text-sm mt-1">
                            {errors.categories[categoryIndex].title.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Peso *
                        </label>
                        <input
                          {...register(`categories.${categoryIndex}.weight`, { valueAsNumber: true })}
                          type="number"
                          step="0.1"
                          min="0.1"
                          max="100"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {errors?.categories?.[categoryIndex]?.weight && (
                          <p className="text-red-600 text-sm mt-1">
                            {errors.categories[categoryIndex].weight.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descrição
                      </label>
                      <textarea
                        {...register(`categories.${categoryIndex}.description`)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Descrição da categoria"
                      />
                    </div>

                    {/* Itens da categoria */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="text-sm font-medium text-gray-700">Itens</h5>
                        <button
                          type="button"
                          onClick={() => addItem(categoryIndex)}
                          className="flex items-center gap-1 px-2 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          <Plus className="w-3 h-3" />
                          Item
                        </button>
                      </div>

                      <div className="space-y-3">
                        {watchedCategories[categoryIndex]?.items?.map((item, itemIndex) => (
                          <ItemEditor
                            key={`${categoryIndex}-${itemIndex}`}
                            index={itemIndex}
                            categoryIndex={categoryIndex}
                            item={{
                              id: `item-${categoryIndex}-${itemIndex}`,
                              title: item.title || '',
                              description: item.description,
                              weight: item.weight || 1,
                              isRequired: item.isRequired || false,
                              order: itemIndex,
                              criteria: item.criteria || [],
                              evidenceRequired: item.evidenceRequired || false,
                              maxScore: item.maxScore || 10
                            }}
                            onUpdate={(updates) => {
                              const currentItems = watchedCategories[categoryIndex].items;
                              const updatedItems = [...currentItems];
                              updatedItems[itemIndex] = { ...updatedItems[itemIndex], ...updates };
                              setValue(`categories.${categoryIndex}.items`, updatedItems);
                            }}
                            onRemove={() => removeItem(categoryIndex, itemIndex)}
                            register={register}
                            errors={errors}
                          />
                        ))}
                      </div>

                      {errors?.categories?.[categoryIndex]?.items && (
                        <p className="text-red-600 text-sm mt-2">
                          {errors.categories[categoryIndex].items.message}
                        </p>
                      )}
                    </div>
                  </div>
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {errors.categories && (
          <p className="text-red-600 text-sm mt-2">{errors.categories.message}</p>
        )}
      </div>

      {/* Botões de ação */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading || !isWeightValid}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          {isLoading ? 'Salvando...' : 'Salvar Checklist'}
        </button>
      </div>
    </form>
  );
};

export default ChecklistEditor;