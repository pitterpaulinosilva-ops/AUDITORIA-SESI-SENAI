import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuditProStore } from '../../store';
import { StatusBadge } from '../../components/StatusBadge';
import { AuditStatus, EvidenceType, NonConformitySeverity, NonConformityStatus } from '../../types';
import { 
  ArrowLeft, 
  Camera, 
  Check, 
  X, 
  AlertTriangle, 
  FileText, 
  Save,
  CheckCircle,
  XCircle,
  Upload,
  Trash2,
  Plus
} from 'lucide-react';

interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  isCompliant: boolean | null;
  notes: string;
  evidences: string[];
}

interface NonConformityForm {
  title: string;
  description: string;
  severity: NonConformitySeverity;
  checklistItemId?: string;
}

export function AuditExecution() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { getAuditById, updateAudit, addNonConformity, addEvidence, startAuditExecution, finishAuditExecution } = useAuditProStore();
  
  const audit = id ? getAuditById(id) : null;
  
  // Mock checklist items - em uma implementação real, viria do checklist associado
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
    {
      id: '1',
      title: 'Verificação de Equipamentos de Segurança',
      description: 'Verificar se todos os equipamentos de segurança estão em conformidade',
      isCompliant: null,
      notes: '',
      evidences: []
    },
    {
      id: '2',
      title: 'Documentação de Processos',
      description: 'Verificar se a documentação dos processos está atualizada',
      isCompliant: null,
      notes: '',
      evidences: []
    },
    {
      id: '3',
      title: 'Treinamento de Funcionários',
      description: 'Verificar se os funcionários receberam treinamento adequado',
      isCompliant: null,
      notes: '',
      evidences: []
    }
  ]);
  
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [showNonConformityForm, setShowNonConformityForm] = useState(false);
  const [nonConformityForm, setNonConformityForm] = useState<NonConformityForm>({
    title: '',
    description: '',
    severity: NonConformitySeverity.MEDIUM
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!audit) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/audits')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            Voltar
          </button>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500">Auditoria não encontrada</p>
        </div>
      </div>
    );
  }

  // Permitir execução apenas para auditorias planejadas ou em progresso
  if (audit.status !== AuditStatus.PLANNED && audit.status !== AuditStatus.IN_PROGRESS) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/audits')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            Voltar
          </button>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500">Esta auditoria não pode ser executada. Status atual: {audit.status}</p>
        </div>
      </div>
    );
  }

  const currentItem = checklistItems[currentItemIndex];
  const completedItems = checklistItems.filter(item => item.isCompliant !== null).length;
  const progress = (completedItems / checklistItems.length) * 100;

  const handleComplianceChange = (isCompliant: boolean) => {
    const updatedItems = [...checklistItems];
    updatedItems[currentItemIndex] = {
      ...updatedItems[currentItemIndex],
      isCompliant
    };
    setChecklistItems(updatedItems);

    if (!isCompliant) {
      setNonConformityForm({
        ...nonConformityForm,
        title: `Não conformidade: ${currentItem.title}`,
        checklistItemId: currentItem.id
      });
      setShowNonConformityForm(true);
    }
  };

  const handleNotesChange = (notes: string) => {
    const updatedItems = [...checklistItems];
    updatedItems[currentItemIndex] = {
      ...updatedItems[currentItemIndex],
      notes
    };
    setChecklistItems(updatedItems);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Simular upload de arquivo - em uma implementação real, faria upload para servidor
      const fileName = files[0].name;
      const updatedItems = [...checklistItems];
      updatedItems[currentItemIndex] = {
        ...updatedItems[currentItemIndex],
        evidences: [...updatedItems[currentItemIndex].evidences, fileName]
      };
      setChecklistItems(updatedItems);

      // Adicionar evidência ao store
      addEvidence({
        auditId: audit.id,
        type: EvidenceType.PHOTO,
        title: `Evidência - ${currentItem.title}`,
        description: `Evidência para: ${currentItem.title}`,
        filePath: fileName,
        checklistItemId: currentItem.id,
        tags: [],
        capturedBy: 'Auditor',
        isCompressed: false
      });
    }
  };

  const removeEvidence = (evidenceIndex: number) => {
    const updatedItems = [...checklistItems];
    updatedItems[currentItemIndex] = {
      ...updatedItems[currentItemIndex],
      evidences: updatedItems[currentItemIndex].evidences.filter((_, index) => index !== evidenceIndex)
    };
    setChecklistItems(updatedItems);
  };

  const handleNonConformitySubmit = () => {
    if (nonConformityForm.title && nonConformityForm.description) {
      addNonConformity({
        auditId: audit.id,
        title: nonConformityForm.title,
        description: nonConformityForm.description,
        severity: nonConformityForm.severity,
        status: NonConformityStatus.OPEN,
        checklistItemId: nonConformityForm.checklistItemId,
        correctiveActions: [],
        evidences: [],
        category: 'Processo',
        location: audit.sector,
        identifiedBy: 'Auditor',
        impact: 'Baixo',
        rootCause: '',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
        riskLevel: 'Baixo',
        verificationRequired: true
      });

      setShowNonConformityForm(false);
      setNonConformityForm({
        title: '',
        description: '',
        severity: NonConformitySeverity.MEDIUM
      });
    }
  };

  const handleNext = () => {
    if (currentItemIndex < checklistItems.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentItemIndex > 0) {
      setCurrentItemIndex(currentItemIndex - 1);
    }
  };

  const handleStartAudit = () => {
    if (audit.status === AuditStatus.PLANNED) {
      startAuditExecution(audit.id);
    }
  };

  const handleFinishAudit = async () => {
    setIsSubmitting(true);
    
    // Calcular pontuação
    const compliantItems = checklistItems.filter(item => item.isCompliant === true).length;
    const totalItems = checklistItems.length;
    const score = Math.round((compliantItems / totalItems) * 100);

    // Usar a nova função que adiciona notas automáticas
    finishAuditExecution(audit.id, score);

    setIsSubmitting(false);
    navigate(`/audits/${audit.id}`);
  };

  const canFinish = checklistItems.every(item => item.isCompliant !== null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/audits')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{audit.title}</h1>
              <p className="text-sm text-gray-500">{audit.sector}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {audit.status === AuditStatus.PLANNED && (
              <button
                onClick={handleStartAudit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Iniciar Auditoria
              </button>
            )}
            <StatusBadge status={audit.status === AuditStatus.PLANNED ? AuditStatus.PLANNED : AuditStatus.IN_PROGRESS} />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Progresso da Auditoria</span>
            <span>{completedItems} de {checklistItems.length} itens</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-4">
        {/* Current Item Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Item {currentItemIndex + 1} de {checklistItems.length}
            </h2>
            <div className="flex items-center gap-2">
              {currentItem.isCompliant === true && (
                <CheckCircle className="h-5 w-5 text-green-600" />
              )}
              {currentItem.isCompliant === false && (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
            </div>
          </div>

          <h3 className="text-xl font-medium text-gray-900 mb-2">
            {currentItem.title}
          </h3>
          
          {currentItem.description && (
            <p className="text-gray-600 mb-6">{currentItem.description}</p>
          )}

          {/* Compliance Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => handleComplianceChange(true)}
              className={`flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
                currentItem.isCompliant === true
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
              }`}
            >
              <Check className="h-5 w-5" />
              Conforme
            </button>
            
            <button
              onClick={() => handleComplianceChange(false)}
              className={`flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
                currentItem.isCompliant === false
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-200 hover:border-red-300 hover:bg-red-50'
              }`}
            >
              <X className="h-5 w-5" />
              Não Conforme
            </button>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observações
            </label>
            <textarea
              value={currentItem.notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Adicione observações sobre este item..."
            />
          </div>

          {/* Evidence Upload */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Evidências
              </label>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
              >
                <Camera className="h-4 w-4" />
                Adicionar Foto
              </button>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              multiple
            />

            {currentItem.evidences.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {currentItem.evidences.map((evidence, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Camera className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700 truncate">{evidence}</span>
                    </div>
                    <button
                      onClick={() => removeEvidence(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentItemIndex === 0}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-4 w-4" />
            Anterior
          </button>

          <div className="flex items-center gap-2">
            {checklistItems.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentItemIndex(index)}
                className={`w-8 h-8 rounded-full text-sm font-medium ${
                  index === currentItemIndex
                    ? 'bg-blue-600 text-white'
                    : checklistItems[index].isCompliant !== null
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {currentItemIndex === checklistItems.length - 1 ? (
            <button
              onClick={handleFinishAudit}
              disabled={!canFinish || isSubmitting}
              className="flex items-center gap-2 px-6 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle className="h-4 w-4" />
              {isSubmitting ? 'Finalizando...' : 'Finalizar Auditoria'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={currentItemIndex === checklistItems.length - 1}
              className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próximo
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </button>
          )}
        </div>
      </div>

      {/* Non-Conformity Modal */}
      {showNonConformityForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">Registrar Não Conformidade</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  value={nonConformityForm.title}
                  onChange={(e) => setNonConformityForm({...nonConformityForm, title: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  value={nonConformityForm.description}
                  onChange={(e) => setNonConformityForm({...nonConformityForm, description: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Severidade
                </label>
                <select
                  value={nonConformityForm.severity}
                  onChange={(e) => setNonConformityForm({...nonConformityForm, severity: e.target.value as any})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                  <option value="critica">Crítica</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={handleNonConformitySubmit}
                className="flex-1 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Registrar
              </button>
              <button
                onClick={() => setShowNonConformityForm(false)}
                className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}