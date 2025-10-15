import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  FileText, 
  Building2, 
  User, 
  Calendar, 
  Save, 
  AlertCircle,
  Info
} from 'lucide-react';
import { useAuditProStore } from '../../store';
import { toast } from 'sonner';
import { AuditType, AuditTypeValue, AuditStatus } from '../../types';

// Schema de validação dinâmico
const createAuditFormSchema = (auditTypes: any[]) => z.object({
  title: z.string()
    .min(3, 'Título deve ter pelo menos 3 caracteres')
    .max(100, 'Título deve ter no máximo 100 caracteres'),
  type: z.string()
    .min(1, 'Selecione o tipo de auditoria')
    .refine((value) => auditTypes.some(type => type.name === value), {
      message: 'Tipo de auditoria inválido'
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

export default function AuditForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  
  const { 
    audits, 
    addAudit, 
    updateAudit,
    auditors,
    sectors,
    auditTypes
  } = useAuditProStore();

  // Criar schema dinâmico baseado nos tipos de auditoria disponíveis
  const auditFormSchema = createAuditFormSchema(auditTypes);
  type AuditFormData = z.infer<typeof auditFormSchema>;
  
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
      type: auditTypes.length > 0 ? auditTypes[0].name : '',
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
        type: data.type as AuditTypeValue,
        sector: data.sector,
        auditor: data.auditor,
        scheduledDate: new Date(data.scheduledDate),
        checklistId: data.checklistId || '',
        description: data.description || '',
        plannedStartDate: new Date(data.scheduledDate),
        plannedEndDate: new Date(data.scheduledDate),
        auditorId: data.auditor, // Usando o nome do auditor como ID temporário
        auditeeIds: [], // Array vazio por padrão
        department: data.sector, // Usando setor como departamento
        location: 'Sede', // Valor padrão
        objectives: ['Verificar conformidade'], // Valor padrão
        scope: 'Setor ' + data.sector, // Escopo baseado no setor
        criteria: ['Normas internas'], // Critério padrão
        status: AuditStatus.PLANNED,
        nonConformities: [],
        evidences: []
      };

      if (isEditing && id) {
        updateAudit(id, auditData);
        toast.success('Auditoria atualizada com sucesso!');
      } else {
        addAudit(auditData);
        toast.success('Auditoria criada com sucesso!');
      }

      navigate('/audits');
    } catch (error) {
      console.error('Erro ao salvar auditoria:', error);
      toast.error('Erro ao salvar auditoria. Tente novamente.');
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
        <div className="bg-white rounded-2xl border border-gray-200/60 p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
          <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            Informações Básicas
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Título */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                <div className="p-1 bg-blue-50 rounded-lg">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                Título da Auditoria *
              </label>
              <input
                type="text"
                {...register('title')}
                className={`w-full px-5 py-4 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 font-medium placeholder:text-gray-400 ${
                  errors.title ? 'border-red-300 bg-red-50/30' : 'border-gray-200 hover:border-gray-300 focus:bg-blue-50/30'
                }`}
                placeholder="Ex: Auditoria de Qualidade - Setor Produção"
              />
              {errors.title && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-2 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                  <AlertCircle className="h-4 w-4" />
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Tipo */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-3">
                Tipo de Auditoria *
              </label>
              {auditTypes.length > 0 ? (
                <select
                  {...register('type')}
                  className={`w-full px-5 py-4 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 font-medium bg-white ${
                    errors.type ? 'border-red-300 bg-red-50/30' : 'border-gray-200 hover:border-gray-300 focus:bg-blue-50/30'
                  }`}
                >
                  <option value="">Selecione um tipo de auditoria</option>
                  {auditTypes.map((auditType) => (
                    <option key={auditType.id} value={auditType.name} title={auditType.description}>
                      {auditType.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl bg-gray-50">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Info className="h-4 w-4" />
                    <span className="text-sm">Nenhum tipo de auditoria configurado</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Configure os tipos de auditoria na seção "Configurações"
                  </p>
                </div>
              )}
              {errors.type && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-2 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                  <AlertCircle className="h-4 w-4" />
                  {errors.type.message}
                </p>
              )}
              {selectedType && auditTypes.find(at => at.name === selectedType)?.description && (
                <p className="mt-2 text-sm text-blue-700 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200 font-medium">
                  {auditTypes.find(at => at.name === selectedType)?.description}
                </p>
              )}
            </div>

            {/* Setor */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                <div className="p-1 bg-green-50 rounded-lg">
                  <Building2 className="h-4 w-4 text-green-600" />
                </div>
                Setor *
              </label>
              {sectors.length > 0 ? (
                <select
                  {...register('sector')}
                  className={`w-full px-5 py-4 border-2 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-200 font-medium bg-white ${
                    errors.sector ? 'border-red-300 bg-red-50/30' : 'border-gray-200 hover:border-gray-300 focus:bg-green-50/30'
                  }`}
                >
                  <option value="">Selecione um setor</option>
                  {sectors.map((sector) => (
                    <option key={sector.id} value={sector.name}>
                      {sector.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl bg-gray-50">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Info className="h-4 w-4" />
                    <span className="text-sm">Nenhum setor configurado</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Configure os setores na seção "Configurações"
                  </p>
                </div>
              )}
              {errors.sector && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-2 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                  <AlertCircle className="h-4 w-4" />
                  {errors.sector.message}
                </p>
              )}
            </div>

            {/* Auditor */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                <div className="p-1 bg-purple-50 rounded-lg">
                  <User className="h-4 w-4 text-purple-600" />
                </div>
                Auditor Responsável *
              </label>
              {auditors.length > 0 ? (
                <select
                  {...register('auditor')}
                  className={`w-full px-5 py-4 border-2 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200 font-medium bg-white ${
                    errors.auditor ? 'border-red-300 bg-red-50/30' : 'border-gray-200 hover:border-gray-300 focus:bg-purple-50/30'
                  }`}
                >
                  <option value="">Selecione um auditor</option>
                  {auditors.map((auditor) => (
                    <option key={auditor.id} value={auditor.name}>
                      {auditor.name} - {auditor.role}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl bg-gray-50">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Info className="h-4 w-4" />
                    <span className="text-sm">Nenhum auditor configurado</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Configure os auditores na seção "Configurações"
                  </p>
                </div>
              )}
              {errors.auditor && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-2 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                  <AlertCircle className="h-4 w-4" />
                  {errors.auditor.message}
                </p>
              )}
            </div>

            {/* Data Agendada */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                <div className="p-1 bg-orange-50 rounded-lg">
                  <Calendar className="h-4 w-4 text-orange-600" />
                </div>
                Data Agendada *
              </label>
              <input
                type="date"
                {...register('scheduledDate')}
                className={`w-full px-5 py-4 border-2 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all duration-200 font-medium ${
                  errors.scheduledDate ? 'border-red-300 bg-red-50/30' : 'border-gray-200 hover:border-gray-300 focus:bg-orange-50/30'
                }`}
              />
              {errors.scheduledDate && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-2 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                  <AlertCircle className="h-4 w-4" />
                  {errors.scheduledDate.message}
                </p>
              )}
            </div>

            {/* Checklist ID */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-3">
                ID do Checklist (Opcional)
              </label>
              <input
                type="text"
                {...register('checklistId')}
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 hover:border-gray-300 transition-all duration-200 font-medium placeholder:text-gray-400 focus:bg-blue-50/30"
                placeholder="Ex: CHK-001"
              />
              <p className="mt-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                Você pode associar um checklist existente ou criar um durante a execução
              </p>
            </div>

            {/* Descrição */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-bold text-gray-800 mb-3">
                Descrição (Opcional)
              </label>
              <textarea
                {...register('description')}
                rows={4}
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 hover:border-gray-300 transition-all duration-200 resize-none font-medium placeholder:text-gray-400 focus:bg-blue-50/30"
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
            className="px-8 py-4 text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-bold shadow-sm hover:shadow-md"
          >
            Cancelar
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-3 font-bold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          >
            <Save className="h-5 w-5" />
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