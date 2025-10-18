import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Download, 
  FileSpreadsheet, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Users,
  Building2,
  GitBranch,
  Workflow,
  FileText,
  X,
  Info
} from 'lucide-react';
import { useAuditProStore } from '../store';
import { 
  IMPORT_CONFIGS, 
  downloadExcelTemplate, 
  validateExcelFile, 
  importExcelData,
  convertImportedData
} from '../utils/importUtils';
import { ImportResult, ImportError } from '../types';

interface DataImportProps {
  onClose: () => void;
}

interface ImportState {
  isUploading: boolean;
  uploadProgress: number;
  result: ImportResult<any> | null;
  selectedType: keyof typeof IMPORT_CONFIGS | null;
  showInstructions: boolean;
}

const iconMap = {
  Users,
  Building2,
  GitBranch,
  Workflow,
  FileText
};

export const DataImport: React.FC<DataImportProps> = ({ onClose }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importState, setImportState] = useState<ImportState>({
    isUploading: false,
    uploadProgress: 0,
    result: null,
    selectedType: null,
    showInstructions: false
  });

  const {
    auditors,
    sectors,
    subprocesses,
    processes,
    auditTypes,
    addAuditor,
    addSector,
    addSubprocess,
    addProcess,
    addAuditType
  } = useAuditProStore();

  const handleDownloadTemplate = (type: keyof typeof IMPORT_CONFIGS) => {
    try {
      downloadExcelTemplate(type);
    } catch (error) {
      console.error('Erro ao baixar modelo:', error);
      alert('Erro ao baixar modelo. Tente novamente.');
    }
  };

  const handleFileSelect = (type: keyof typeof IMPORT_CONFIGS) => {
    setImportState(prev => ({ ...prev, selectedType: type, result: null }));
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !importState.selectedType) return;

    setImportState(prev => ({ 
      ...prev, 
      isUploading: true, 
      uploadProgress: 0,
      result: null 
    }));

    try {
      // Validar arquivo
      setImportState(prev => ({ ...prev, uploadProgress: 20 }));
      await validateExcelFile(file);

      // Obter dados existentes baseado no tipo
      let existingData: any[] = [];
      switch (importState.selectedType) {
        case 'auditores':
          existingData = auditors;
          break;
        case 'setores':
          existingData = sectors;
          break;
        case 'subprocessos':
          existingData = subprocesses;
          break;
        case 'processos':
          existingData = processes;
          break;
        case 'tipos':
          existingData = auditTypes;
          break;
      }

      // Importar dados
      setImportState(prev => ({ ...prev, uploadProgress: 60 }));
      const result = await importExcelData(file, importState.selectedType, existingData);

      setImportState(prev => ({ 
        ...prev, 
        uploadProgress: 100,
        result,
        isUploading: false 
      }));

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error) {
      console.error('Erro na importação:', error);
      setImportState(prev => ({ 
        ...prev, 
        isUploading: false,
        uploadProgress: 0,
        result: {
          success: false,
          data: [],
          errors: [{
            row: 0,
            field: 'arquivo',
            value: file.name,
            message: error instanceof Error ? error.message : 'Erro desconhecido'
          }],
          duplicates: [],
          totalProcessed: 0,
          totalSuccess: 0,
          totalErrors: 1
        }
      }));
    }
  };

  const handleSaveData = async () => {
    if (!importState.result?.success || !importState.selectedType || !importState.result.data.length) {
      return;
    }

    try {
      const convertedData = convertImportedData[importState.selectedType](importState.result.data);

      // Salvar dados no store baseado no tipo
      switch (importState.selectedType) {
        case 'auditores':
          convertedData.forEach((auditor: any) => addAuditor(auditor));
          break;
        case 'setores':
          convertedData.forEach((sector: any) => addSector(sector));
          break;
        case 'subprocessos':
          convertedData.forEach((subprocess: any) => addSubprocess(subprocess));
          break;
        case 'processos':
          convertedData.forEach((process: any) => addProcess(process));
          break;
        case 'tipos':
          convertedData.forEach((auditType: any) => addAuditType(auditType));
          break;
      }

      alert(`${importState.result.totalSuccess} registros importados com sucesso!`);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      alert('Erro ao salvar dados. Tente novamente.');
    }
  };

  const toggleInstructions = () => {
    setImportState(prev => ({ ...prev, showInstructions: !prev.showInstructions }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <FileSpreadsheet className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Importação de Dados via Excel
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleInstructions}
              className="flex items-center space-x-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            >
              <Info className="h-4 w-4" />
              <span>Instruções</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Instructions Panel */}
        {importState.showInstructions && (
          <div className="p-6 bg-blue-50 border-b">
            <h3 className="text-lg font-medium text-blue-900 mb-3">
              Como usar a importação de dados
            </h3>
            <div className="space-y-2 text-sm text-blue-800">
              <p>• <strong>1. Baixe o modelo:</strong> Clique em "Baixar Modelo" para obter a planilha de exemplo</p>
              <p>• <strong>2. Preencha os dados:</strong> Use o modelo baixado como referência para preencher seus dados</p>
              <p>• <strong>3. Respeite o formato:</strong> Não altere os nomes das colunas e siga os exemplos fornecidos</p>
              <p>• <strong>4. Faça o upload:</strong> Clique em "Importar Arquivo" e selecione sua planilha preenchida</p>
              <p>• <strong>5. Revise os resultados:</strong> Verifique se há erros e corrija-os antes de salvar</p>
              <p>• <strong>6. Confirme a importação:</strong> Clique em "Salvar Dados" para finalizar</p>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {!importState.result ? (
            // Import Options
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(IMPORT_CONFIGS).map(([key, config]) => {
                const IconComponent = iconMap[config.icon as keyof typeof iconMap];
                
                return (
                  <div key={key} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <IconComponent className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {config.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {config.description}
                        </p>
                      </div>
                    </div>

                    {/* Columns Info */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Colunas:</h4>
                      <div className="space-y-1">
                        {config.columns.map((col, index) => (
                          <div key={index} className="text-xs text-gray-600">
                            <span className="font-medium">{col.label}</span>
                            {col.required && <span className="text-red-500 ml-1">*</span>}
                            {col.maxLength && (
                              <span className="text-gray-400 ml-1">
                                (máx. {col.maxLength})
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDownloadTemplate(key as keyof typeof IMPORT_CONFIGS)}
                        className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        <Download className="h-4 w-4" />
                        <span>Baixar Modelo</span>
                      </button>
                      <button
                        onClick={() => handleFileSelect(key as keyof typeof IMPORT_CONFIGS)}
                        disabled={importState.isUploading}
                        className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Upload className="h-4 w-4" />
                        <span>Importar Arquivo</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // Import Results
            <div className="space-y-6">
              {/* Results Summary */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Resultado da Importação
                  </h3>
                  <div className="flex items-center space-x-2">
                    {importState.result.success ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-600" />
                    )}
                    <span className={`font-medium ${
                      importState.result.success ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {importState.result.success ? 'Sucesso' : 'Erro'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {importState.result.totalProcessed}
                    </div>
                    <div className="text-sm text-gray-600">Total Processado</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {importState.result.totalSuccess}
                    </div>
                    <div className="text-sm text-gray-600">Sucessos</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {importState.result.totalErrors}
                    </div>
                    <div className="text-sm text-gray-600">Erros</div>
                  </div>
                </div>
              </div>

              {/* Errors */}
              {importState.result.errors.length > 0 && (
                <div className="bg-red-50 rounded-lg p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <h4 className="text-lg font-medium text-red-900">
                      Erros Encontrados ({importState.result.errors.length})
                    </h4>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {importState.result.errors.map((error: ImportError, index: number) => (
                      <div key={index} className="bg-white p-3 rounded border-l-4 border-red-400">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-red-900">
                              Linha {error.row}: {error.message}
                            </p>
                            <p className="text-xs text-red-700">
                              Campo: {error.field} | Valor: {String(error.value)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Success Data Preview */}
              {importState.result.success && importState.result.data.length > 0 && (
                <div className="bg-green-50 rounded-lg p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <h4 className="text-lg font-medium text-green-900">
                      Dados Prontos para Importação ({importState.result.data.length})
                    </h4>
                  </div>
                  <div className="bg-white rounded border max-h-60 overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {Object.keys(importState.result.data[0] || {}).map((key) => (
                            <th key={key} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {importState.result.data.slice(0, 10).map((item: any, index: number) => (
                          <tr key={index}>
                            {Object.values(item).map((value: any, valueIndex: number) => (
                              <td key={valueIndex} className="px-4 py-2 text-sm text-gray-900">
                                {String(value)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {importState.result.data.length > 10 && (
                      <div className="px-4 py-2 text-sm text-gray-500 text-center border-t">
                        ... e mais {importState.result.data.length - 10} registros
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-between">
                <button
                  onClick={() => setImportState(prev => ({ ...prev, result: null, selectedType: null }))}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  ← Voltar
                </button>
                <div className="flex space-x-3">
                  {importState.result.success && importState.result.data.length > 0 && (
                    <button
                      onClick={handleSaveData}
                      className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      Salvar Dados ({importState.result.totalSuccess} registros)
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {importState.isUploading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Processando arquivo...
                  </h3>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${importState.uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {importState.uploadProgress}% concluído
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
};