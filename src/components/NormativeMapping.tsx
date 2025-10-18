import React, { useState, useRef } from 'react';
import { Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle, X, Eye, Plus } from 'lucide-react';
import { useAuditProStore } from '../store';
import { 
  exportExcelTemplate, 
  validateExcelFile, 
  importExcelFile,
  EXCEL_TEMPLATE_CONFIG 
} from '../utils/excelUtils';
import { ImportPreviewData, NormativeRequirement, Checklist } from '../types';
import { ChecklistPreview } from './checklist/ChecklistPreview';
import { toast } from 'sonner';

interface NormativeMappingProps {
  onClose?: () => void;
}

export const NormativeMapping: React.FC<NormativeMappingProps> = ({ onClose }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewData, setPreviewData] = useState<ImportPreviewData | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [checklistName, setChecklistName] = useState('');
  const [selectedStandard, setSelectedStandard] = useState('');
  const [standardVersion, setStandardVersion] = useState('');
  const [showChecklistPreview, setShowChecklistPreview] = useState(false);
  const [previewChecklist, setPreviewChecklist] = useState<Checklist | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { 
    importNormativeRequirements, 
    convertRequirementsToChecklist,
    loading,
    error 
  } = useAuditProStore();

  const handleExportTemplate = () => {
    try {
      exportExcelTemplate();
      toast.success('Template Excel exportado com sucesso!');
    } catch (error) {
      toast.error('Erro ao exportar template: ' + (error as Error).message);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar arquivo
    const validation = validateExcelFile(file);
    if (!validation.valid) {
      toast.error(validation.error || 'Arquivo inválido');
      return;
    }

    setIsUploading(true);
    try {
      const importData = await importExcelFile(file);
      setPreviewData(importData);
      setShowPreview(true);
      
      if (importData.valid) {
        toast.success(`Arquivo processado: ${importData.validRows} requisitos válidos encontrados`);
      } else {
        toast.warning(`Arquivo processado com erros: ${importData.errors.length} problemas encontrados`);
      }
    } catch (error) {
      toast.error('Erro ao processar arquivo: ' + (error as Error).message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleImportRequirements = async () => {
    if (!previewData?.data || !selectedStandard || !standardVersion) {
      toast.error('Dados incompletos para importação');
      return;
    }

    try {
      await importNormativeRequirements(previewData.data, selectedStandard, standardVersion);
      toast.success('Requisitos normativos importados com sucesso!');
      
      // Limpar dados
      setPreviewData(null);
      setShowPreview(false);
      setSelectedStandard('');
      setStandardVersion('');
      
      // Limpar input de arquivo
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast.error('Erro ao importar requisitos: ' + (error as Error).message);
    }
  };

  const handleConvertToChecklist = async () => {
    if (!previewData?.data || !checklistName || !selectedStandard || !standardVersion) {
      toast.error('Dados incompletos para conversão');
      return;
    }

    try {
      // Criar checklist temporário para preview
      const tempChecklist = convertRequirementsToChecklist(
        previewData.data, 
        checklistName, 
        selectedStandard, 
        standardVersion,
        false // Não salvar ainda, apenas criar para preview
      ) as Checklist;
      
      // Mostrar preview para revisão
      setShowChecklistPreview(true);
      setPreviewChecklist(tempChecklist);
      
    } catch (error) {
      toast.error('Erro ao converter para checklist: ' + (error as Error).message);
    }
  };

  const handleSaveChecklist = async (finalChecklist: Checklist) => {
    try {
      // Agora sim, salvar o checklist final no store
      const checklistId = convertRequirementsToChecklist(
        previewData?.data || [],
        finalChecklist.name,
        selectedStandard || '',
        standardVersion || '',
        true // Salvar definitivamente
      ) as string;
      
      toast.success(`Checklist "${finalChecklist.name}" criado com sucesso!`);
      
      // Limpar dados
      setPreviewData(null);
      setShowPreview(false);
      setShowChecklistPreview(false);
      setPreviewChecklist(null);
      setChecklistName('');
      setSelectedStandard('');
      setStandardVersion('');
      
      // Limpar input de arquivo
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Fechar modal se callback fornecido
      if (onClose) {
        onClose();
      }
    } catch (error) {
      toast.error('Erro ao salvar checklist: ' + (error as Error).message);
    }
  };

  const handleCancelChecklistPreview = () => {
    setShowChecklistPreview(false);
    setPreviewChecklist(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileSpreadsheet className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            Mapeamento de Requisitos Normativos
          </h2>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Seção de Exportação de Template */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            1. Exportar Template Excel
          </h3>
          <p className="text-gray-600 mb-4">
            Baixe o template Excel para ver o formato necessário para importação de requisitos normativos.
          </p>
          <button
            onClick={handleExportTemplate}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            Exportar Template Excel
          </button>
        </div>

        {/* Seção de Importação */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            2. Importar Requisitos Normativos
          </h3>
          <p className="text-gray-600 mb-4">
            Selecione um arquivo Excel preenchido com os requisitos normativos para importação.
          </p>
          
          <div className="space-y-4">
            {/* Upload de arquivo */}
            <div className="flex items-center gap-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
                id="excel-upload"
              />
              <label
                htmlFor="excel-upload"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >
                <Upload className="h-4 w-4" />
                {isUploading ? 'Processando...' : 'Selecionar Arquivo Excel'}
              </label>
              
              {previewData && (
                <div className="flex items-center gap-2 text-sm">
                  {previewData.valid ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span className={previewData.valid ? 'text-green-700' : 'text-red-700'}>
                    {previewData.totalRows} linhas processadas, {previewData.validRows} válidas
                  </span>
                </div>
              )}
            </div>

            {/* Configurações da norma */}
            {previewData && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Norma *
                  </label>
                  <select
                    value={selectedStandard}
                    onChange={(e) => setSelectedStandard(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Selecione a norma</option>
                    {EXCEL_TEMPLATE_CONFIG.supportedStandards.map((standard) => (
                      <option key={standard} value={standard}>
                        {standard}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Versão da Norma *
                  </label>
                  <input
                    type="text"
                    value={standardVersion}
                    onChange={(e) => setStandardVersion(e.target.value)}
                    placeholder="Ex: 2024, 2017, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Preview dos dados */}
        {previewData && showPreview && (
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                3. Preview dos Dados
              </h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <Eye className="h-4 w-4" />
              </button>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{previewData.totalRows}</div>
                <div className="text-sm text-blue-700">Total de Linhas</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{previewData.validRows}</div>
                <div className="text-sm text-green-700">Linhas Válidas</div>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{previewData.errors.length}</div>
                <div className="text-sm text-red-700">Erros</div>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{previewData.warnings.length}</div>
                <div className="text-sm text-yellow-700">Avisos</div>
              </div>
            </div>

            {/* Erros */}
            {previewData.errors.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-red-700 mb-2">Erros encontrados:</h4>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 max-h-32 overflow-y-auto">
                  {previewData.errors.map((error, index) => (
                    <div key={index} className="text-sm text-red-700 mb-1">
                      • {error}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preview dos requisitos válidos */}
            {previewData.validRows > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">
                  Requisitos válidos (primeiros 5):
                </h4>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 max-h-64 overflow-y-auto">
                  {previewData.data.slice(0, 5).map((req, index) => (
                    <div key={index} className="mb-3 pb-3 border-b border-gray-200 last:border-b-0">
                      <div className="text-sm font-medium text-gray-900">
                        {req.requirementCode} - {req.standard} {req.version}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {req.chapter}: {req.description ? req.description.substring(0, 100) : 'Sem descrição'}
                        {req.description && req.description.length > 100 ? '...' : ''}
                      </div>
                    </div>
                  ))}
                  {previewData.data.length > 5 && (
                    <div className="text-sm text-gray-500 text-center pt-2">
                      ... e mais {previewData.data.length - 5} requisitos
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Seção de Ações */}
        {previewData && previewData.validRows > 0 && (
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              4. Ações
            </h3>
            
            <div className="space-y-4">
              {/* Importar apenas os requisitos */}
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-blue-900">Importar Requisitos</h4>
                  <p className="text-sm text-blue-700">
                    Adiciona os requisitos ao banco de dados para uso futuro
                  </p>
                </div>
                <button
                  onClick={handleImportRequirements}
                  disabled={loading || !selectedStandard || !standardVersion}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Importando...' : 'Importar'}
                </button>
              </div>

              {/* Converter para checklist */}
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex-1 mr-4">
                  <h4 className="font-medium text-green-900">Converter para Checklist</h4>
                  <p className="text-sm text-green-700 mb-2">
                    Cria um checklist automaticamente a partir dos requisitos
                  </p>
                  <input
                    type="text"
                    value={checklistName}
                    onChange={(e) => setChecklistName(e.target.value)}
                    placeholder="Nome do checklist"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleConvertToChecklist}
                  disabled={loading || !checklistName || !selectedStandard || !standardVersion}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  {loading ? 'Convertendo...' : 'Converter'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Informações sobre formatos suportados */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            Formatos Suportados
          </h3>
          <div className="text-sm text-gray-600 space-y-1">
            <div>• Arquivos: {EXCEL_TEMPLATE_CONFIG.allowedFileTypes.join(', ')}</div>
            <div>• Tamanho máximo: {EXCEL_TEMPLATE_CONFIG.maxFileSize}MB</div>
            <div>• Normas: {EXCEL_TEMPLATE_CONFIG.supportedStandards.join(', ')}</div>
          </div>
        </div>
      </div>

      {/* Modal de Preview do Checklist */}
      {showChecklistPreview && previewChecklist && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <ChecklistPreview
              checklist={previewChecklist}
              onSave={handleSaveChecklist}
              onCancel={handleCancelChecklistPreview}
              isEditable={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};