import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, Calendar, User, Building2, FileText, AlertCircle } from 'lucide-react';
import { useAuditProStore } from '../../store';
import { AuditType, AuditTypeValue } from '../../types';

// Schema de validação
const auditFormSchema = z.object({
  title: z.string()
    .min(3, 'Título deve ter pelo menos 3 caracteres')
    .max(100, 'Título deve ter no máximo 100 caracteres'),
  type: z.enum(['interna', 'externa', 'fornecedor'], {
    required_error: 'Selecione o tipo de auditoria'
  }),
  sector: z.string()
    .min(2, 'Setor deve ter pelo menos 2 caracteres')
    .max(50, 'Setor deve ter no máximo 50 caracteres'),
  auditor: z.string()
    .min(2, 'Nome do auditor deve ter pelo menos 2 caracteres')
    .max(50, 'Nome do auditor deve ter no máximo 50 caracteres'),
  scheduledDate: z.string()
    .min(1, 'Data é obrigatória')
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, 'Data deve ser hoje ou no futuro'),
  checklistId: z.string().optional(),
  description: z.string().optional()
});

type AuditFormData = z.infer<typeof auditFormSchema>;

export function AuditForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  
  const { audits, checklists, createAudit, updateAudit } = useAuditProStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch
  } = useForm<AuditFormData>({
    resolver: zodResolver(auditFormSchema),
    defaultValues: {
      title: '',
      type: 'interna',
      sector: '',
      auditor: '',
      scheduledDate: '',
      checklistId: '',
      description: ''
    }
  });

  // Carregar dados para edição
  useEffect(() => {
    if (isEditing && id) {
      const audit = audits.find(a => a.id === id);
      if (audit) {
        reset({
          title: audit.title,
          type: audit.type,
          sector: audit.sector,
          auditor: audit.auditor,
          scheduledDate: audit.scheduledDate instanceof Date 
            ? audit.scheduledDate.toISOString().split('T')[0] 
            : new Date(audit.scheduledDate).toISOString().split('T')[0], // Formato YYYY-MM-DD
          checklistId: audit.checklistId || '',
          description: audit.description || ''
        });
      } else {
        navigate('/audits');
      }
    }
  }, [isEditing, id, audits, reset, navigate]);

  const onSubmit = async (data: AuditFormData) => {
    try {
      const auditData = {
        title: data.title,
        type: data.type === 'interna' ? AuditType.INTERNAL : 
              data.type === 'externa' ? AuditType.EXTERNAL : 
              AuditType.SUPPLIER,
        sector: data.sector,
        auditor: data.auditor,
        scheduledDate: new Date(data.scheduledDate),
        checklistId: data.checklistId || undefined,
        description: data.description || '',
        plannedStartDate: new Date(data.scheduledDate),
        plannedEndDate: new Date(new Date(data.scheduledDate).getTime() + 24 * 60 * 60 * 1000), // +1 dia
        auditorId: data.auditor, // Usando o nome como ID temporariamente
        auditeeIds: [], // Array vazio por padrão
        department: data.sector, // Usando setor como departamento
        location: 'Sede', // Valor padrão
        objectives: ['Verificar conformidade'], // Valor padrão
        scope: 'Setor ' + data.sector, // Escopo baseado no setor
        criteria: ['Normas internas'] // Critério padrão
      };

      if (isEditing && id) {
        updateAudit(id, auditData);
      } else {
        createAudit(auditData);
      }

      navigate('/audits');
    } catch (error) {
      console.error('Erro ao salvar auditoria:', error);
    }
  };

  const selectedType = watch('type');

  const getTypeLabel = (type: AuditTypeValue) => {
    const types = {
      interna: 'Auditoria Interna',
      externa: 'Auditoria Externa',
      fornecedor: 'Auditoria de Fornecedor'
    };
    return types[type];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/audits')}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Editar Auditoria' : 'Nova Auditoria'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditing 
              ? 'Atualize as informações da auditoria'
              : 'Preencha os dados para criar uma nova auditoria'
            }
          </p>
        </div>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Informações Básicas
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Título */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="inline h-4 w-4 mr-1" />
                Título da Auditoria *
              </label>
              <input
                type="text"
                {...register('title')}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ex: Auditoria de Qualidade - Setor Produção"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Tipo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Auditoria *
              </label>
              <select
                {...register('type')}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.type ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="interna">Auditoria Interna</option>
                <option value="externa">Auditoria Externa</option>
                <option value="fornecedor">Auditoria de Fornecedor</option>
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.type.message}
                </p>
              )}
              {selectedType && (
                <p className="mt-1 text-sm text-gray-600">
                  {getTypeLabel(selectedType)}
                </p>
              )}
            </div>

            {/* Setor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building2 className="inline h-4 w-4 mr-1" />
                Setor *
              </label>
              <input
                type="text"
                {...register('sector')}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.sector ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ex: Produção, Qualidade, Administrativo"
              />
              {errors.sector && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.sector.message}
                </p>
              )}
            </div>

            {/* Auditor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline h-4 w-4 mr-1" />
                Auditor Responsável *
              </label>
              <input
                type="text"
                {...register('auditor')}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.auditor ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Nome do auditor responsável"
              />
              {errors.auditor && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.auditor.message}
                </p>
              )}
            </div>

            {/* Data Agendada */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Data Agendada *
              </label>
              <input
                type="date"
                {...register('scheduledDate')}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.scheduledDate ? 'border-red-300' : 'border-gray-300'
                }`}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.scheduledDate && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.scheduledDate.message}
                </p>
              )}
            </div>

            {/* Checklist */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Checklist (Opcional)
              </label>
              <select
                {...register('checklistId')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="">Selecione um checklist (opcional)</option>
                {checklists.map((checklist) => (
                  <option key={checklist.id} value={checklist.id}>
                    {checklist.name} - v{checklist.version}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-600">
                Você pode associar um checklist existente ou criar um durante a execução
              </p>
            </div>

            {/* Descrição */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição (Opcional)
              </label>
              <textarea
                {...register('description')}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                placeholder="Descreva o objetivo, escopo ou observações importantes sobre esta auditoria..."
              />
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/audits')}
            className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isSubmitting 
              ? 'Salvando...' 
              : isEditing 
                ? 'Atualizar Auditoria' 
                : 'Criar Auditoria'
            }
          </button>
        </div>
      </form>
    </div>
  );
}