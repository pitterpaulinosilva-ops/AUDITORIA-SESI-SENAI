import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { z } from 'zod';
import {
  ImportResult,
  ImportError,
  ImportValidationResult,
  ImportConfig,
  AuditorImportData,
  SectorImportData,
  SubprocessImportData,
  ProcessImportData,
  AuditTypeImportData,
  Auditor,
  Sector,
  Subprocess,
  Process,
  AuditTypeConfig
} from '../types';

// Configurações para cada tipo de importação
export const IMPORT_CONFIGS: Record<string, ImportConfig> = {
  auditores: {
    type: 'auditores',
    title: 'Auditores',
    description: 'Importar lista de auditores do sistema',
    icon: 'Users',
    columns: [
      {
        key: 'nome',
        label: 'Nome',
        required: true,
        type: 'text',
        maxLength: 100,
        example: 'João Silva'
      },
      {
        key: 'email',
        label: 'E-mail',
        required: true,
        type: 'email',
        maxLength: 150,
        example: 'joao.silva@empresa.com'
      },
      {
        key: 'auditorLider',
        label: 'Auditor Líder (Sim/Não)',
        required: true,
        type: 'select',
        options: ['Sim', 'Não'],
        example: 'Sim'
      }
    ],
    exampleData: [
      { nome: 'João Silva', email: 'joao.silva@empresa.com', auditorLider: 'Sim' },
      { nome: 'Maria Santos', email: 'maria.santos@empresa.com', auditorLider: 'Não' },
      { nome: 'Carlos Oliveira', email: 'carlos.oliveira@empresa.com', auditorLider: 'Sim' }
    ],
    validationRules: [
      { field: 'nome', type: 'required', message: 'Nome é obrigatório' },
      { field: 'nome', type: 'maxLength', message: 'Nome deve ter no máximo 100 caracteres', options: { maxLength: 100 } },
      { field: 'email', type: 'required', message: 'E-mail é obrigatório' },
      { field: 'email', type: 'email', message: 'E-mail deve ter formato válido' },
      { field: 'email', type: 'unique', message: 'E-mail já existe no sistema' },
      { field: 'auditorLider', type: 'required', message: 'Campo Auditor Líder é obrigatório' },
      { field: 'auditorLider', type: 'select', message: 'Auditor Líder deve ser "Sim" ou "Não"', options: { validValues: ['Sim', 'Não'] } }
    ]
  },
  setores: {
    type: 'setores',
    title: 'Setores',
    description: 'Importar lista de setores da empresa',
    icon: 'Building2',
    columns: [
      {
        key: 'nomeDoSetor',
        label: 'Nome do Setor',
        required: true,
        type: 'text',
        maxLength: 100,
        example: 'Recursos Humanos'
      }
    ],
    exampleData: [
      { nomeDoSetor: 'Recursos Humanos' },
      { nomeDoSetor: 'Tecnologia da Informação' },
      { nomeDoSetor: 'Produção' },
      { nomeDoSetor: 'Qualidade' }
    ],
    validationRules: [
      { field: 'nomeDoSetor', type: 'required', message: 'Nome do Setor é obrigatório' },
      { field: 'nomeDoSetor', type: 'maxLength', message: 'Nome do Setor deve ter no máximo 100 caracteres', options: { maxLength: 100 } },
      { field: 'nomeDoSetor', type: 'unique', message: 'Setor já existe no sistema' }
    ]
  },
  subprocessos: {
    type: 'subprocessos',
    title: 'Subprocessos',
    description: 'Importar lista de subprocessos por setor',
    icon: 'GitBranch',
    columns: [
      {
        key: 'nomeDoSubprocesso',
        label: 'Nome do Subprocesso',
        required: true,
        type: 'text',
        maxLength: 100,
        example: 'Recrutamento e Seleção'
      },
      {
        key: 'setor',
        label: 'Setor',
        required: true,
        type: 'text',
        maxLength: 100,
        example: 'Recursos Humanos'
      }
    ],
    exampleData: [
      { nomeDoSubprocesso: 'Recrutamento e Seleção', setor: 'Recursos Humanos' },
      { nomeDoSubprocesso: 'Treinamento e Desenvolvimento', setor: 'Recursos Humanos' },
      { nomeDoSubprocesso: 'Desenvolvimento de Software', setor: 'Tecnologia da Informação' },
      { nomeDoSubprocesso: 'Suporte Técnico', setor: 'Tecnologia da Informação' }
    ],
    validationRules: [
      { field: 'nomeDoSubprocesso', type: 'required', message: 'Nome do Subprocesso é obrigatório' },
      { field: 'nomeDoSubprocesso', type: 'maxLength', message: 'Nome do Subprocesso deve ter no máximo 100 caracteres', options: { maxLength: 100 } },
      { field: 'setor', type: 'required', message: 'Setor é obrigatório' },
      { field: 'setor', type: 'exists', message: 'Setor informado não existe no sistema', options: { referenceField: 'setores' } }
    ]
  },
  processos: {
    type: 'processos',
    title: 'Processos',
    description: 'Importar lista de processos por setor',
    icon: 'Workflow',
    columns: [
      {
        key: 'nomeDoProcesso',
        label: 'Nome do Processo',
        required: true,
        type: 'text',
        maxLength: 100,
        example: 'Gestão de Pessoas'
      },
      {
        key: 'setor',
        label: 'Setor',
        required: true,
        type: 'text',
        maxLength: 100,
        example: 'Recursos Humanos'
      }
    ],
    exampleData: [
      { nomeDoProcesso: 'Gestão de Pessoas', setor: 'Recursos Humanos' },
      { nomeDoProcesso: 'Desenvolvimento de Sistemas', setor: 'Tecnologia da Informação' },
      { nomeDoProcesso: 'Controle de Qualidade', setor: 'Qualidade' },
      { nomeDoProcesso: 'Manufatura', setor: 'Produção' }
    ],
    validationRules: [
      { field: 'nomeDoProcesso', type: 'required', message: 'Nome do Processo é obrigatório' },
      { field: 'nomeDoProcesso', type: 'maxLength', message: 'Nome do Processo deve ter no máximo 100 caracteres', options: { maxLength: 100 } },
      { field: 'setor', type: 'required', message: 'Setor é obrigatório' },
      { field: 'setor', type: 'exists', message: 'Setor informado não existe no sistema', options: { referenceField: 'setores' } }
    ]
  },
  tipos: {
    type: 'tipos',
    title: 'Tipos de Auditoria',
    description: 'Importar tipos de auditoria do sistema',
    icon: 'FileText',
    columns: [
      {
        key: 'nome',
        label: 'Nome',
        required: true,
        type: 'text',
        maxLength: 100,
        example: 'Auditoria Interna de Qualidade'
      },
      {
        key: 'descricao',
        label: 'Descrição',
        required: true,
        type: 'text',
        maxLength: 500,
        example: 'Auditoria interna para verificação dos processos de qualidade'
      }
    ],
    exampleData: [
      { nome: 'Auditoria Interna de Qualidade', descricao: 'Auditoria interna para verificação dos processos de qualidade' },
      { nome: 'Auditoria Externa ISO 9001', descricao: 'Auditoria externa para certificação ISO 9001' },
      { nome: 'Auditoria de Fornecedor', descricao: 'Auditoria para qualificação e avaliação de fornecedores' }
    ],
    validationRules: [
      { field: 'nome', type: 'required', message: 'Nome é obrigatório' },
      { field: 'nome', type: 'maxLength', message: 'Nome deve ter no máximo 100 caracteres', options: { maxLength: 100 } },
      { field: 'nome', type: 'unique', message: 'Tipo de auditoria já existe no sistema' },
      { field: 'descricao', type: 'required', message: 'Descrição é obrigatória' },
      { field: 'descricao', type: 'maxLength', message: 'Descrição deve ter no máximo 500 caracteres', options: { maxLength: 500 } }
    ]
  }
};

// Schemas de validação Zod
const auditorSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome deve ter no máximo 100 caracteres'),
  email: z.string().email('E-mail deve ter formato válido').max(150, 'E-mail deve ter no máximo 150 caracteres'),
  auditorLider: z.enum(['Sim', 'Não'], { errorMap: () => ({ message: 'Auditor Líder deve ser "Sim" ou "Não"' }) })
});

const sectorSchema = z.object({
  nomeDoSetor: z.string().min(1, 'Nome do Setor é obrigatório').max(100, 'Nome do Setor deve ter no máximo 100 caracteres')
});

const subprocessSchema = z.object({
  nomeDoSubprocesso: z.string().min(1, 'Nome do Subprocesso é obrigatório').max(100, 'Nome do Subprocesso deve ter no máximo 100 caracteres'),
  setor: z.string().min(1, 'Setor é obrigatório')
});

const processSchema = z.object({
  nomeDoProcesso: z.string().min(1, 'Nome do Processo é obrigatório').max(100, 'Nome do Processo deve ter no máximo 100 caracteres'),
  setor: z.string().min(1, 'Setor é obrigatório')
});

const auditTypeSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome deve ter no máximo 100 caracteres'),
  descricao: z.string().min(1, 'Descrição é obrigatória').max(500, 'Descrição deve ter no máximo 500 caracteres')
});

const schemas = {
  auditores: auditorSchema,
  setores: sectorSchema,
  subprocessos: subprocessSchema,
  processos: processSchema,
  tipos: auditTypeSchema
};

// Função para gerar e baixar modelo Excel
export const downloadExcelTemplate = (type: keyof typeof IMPORT_CONFIGS): void => {
  const config = IMPORT_CONFIGS[type];
  if (!config) {
    throw new Error(`Tipo de importação não encontrado: ${type}`);
  }

  // Criar workbook
  const wb = XLSX.utils.book_new();

  // Criar worksheet com dados de exemplo
  const ws = XLSX.utils.json_to_sheet(config.exampleData);

  // Adicionar worksheet ao workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Dados');

  // Criar worksheet com instruções
  const instructions = [
    ['INSTRUÇÕES PARA PREENCHIMENTO'],
    [''],
    ['1. Preencha os dados nas colunas indicadas'],
    ['2. Não altere os nomes das colunas'],
    ['3. Campos obrigatórios estão marcados com *'],
    ['4. Respeite os limites de caracteres'],
    [''],
    ['COLUNAS:'],
    ...config.columns.map(col => [
      `${col.label}${col.required ? ' *' : ''}`,
      `Tipo: ${col.type}`,
      col.maxLength ? `Máximo: ${col.maxLength} caracteres` : '',
      col.options ? `Opções: ${col.options.join(', ')}` : '',
      col.example ? `Exemplo: ${col.example}` : ''
    ])
  ];

  const wsInstructions = XLSX.utils.aoa_to_sheet(instructions);
  XLSX.utils.book_append_sheet(wb, wsInstructions, 'Instruções');

  // Gerar arquivo e fazer download
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/octet-stream' });
  saveAs(blob, `modelo_${type}.xlsx`);
};

// Função para validar arquivo Excel
export const validateExcelFile = (file: File): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Verificar se tem pelo menos uma planilha
        if (workbook.SheetNames.length === 0) {
          reject(new Error('Arquivo Excel não contém planilhas'));
          return;
        }
        
        resolve(true);
      } catch {
        reject(new Error('Arquivo Excel inválido'));
      }
    };
    
    reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
    reader.readAsArrayBuffer(file);
  });
};

// Função para importar dados do Excel
export const importExcelData = async <T>(
  file: File,
  type: keyof typeof IMPORT_CONFIGS,
  existingData: unknown[] = []
): Promise<ImportResult<T>> => {
  const config = IMPORT_CONFIGS[type];
  const schema = schemas[type];
  
  if (!config || !schema) {
    throw new Error(`Tipo de importação não encontrado: ${type}`);
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const result: ImportResult<T> = {
          success: false,
          data: [],
          errors: [],
          duplicates: [],
          totalProcessed: jsonData.length,
          totalSuccess: 0,
          totalErrors: 0
        };

        // Validar cada linha
        jsonData.forEach((row: unknown, index: number) => {
          try {
            // Validação com Zod
            const validatedData = schema.parse(row);
            
            // Validações específicas
            const validationResult = validateSpecificRules(validatedData, type, existingData, result.data);
            
            if (validationResult.isValid) {
              result.data.push(validatedData as T);
              result.totalSuccess++;
            } else {
              result.errors.push(...validationResult.errors.map(error => ({
                ...error,
                row: index + 2 // +2 porque Excel começa em 1 e tem header
              })));
              result.totalErrors++;
            }
          } catch (validationError) {
            if (validationError instanceof z.ZodError) {
              validationError.errors.forEach(err => {
                result.errors.push({
                  row: index + 2,
                  field: err.path.join('.'),
                  value: (row as Record<string, unknown>)[err.path[0]],
                  message: err.message
                });
              });
            } else {
              result.errors.push({
                row: index + 2,
                field: 'geral',
                value: row,
                message: 'Erro desconhecido na validação'
              });
            }
            result.totalErrors++;
          }
        });

        result.success = result.totalErrors === 0;
        resolve(result);
      } catch (error) {
        reject(new Error('Erro ao processar arquivo Excel: ' + (error as Error).message));
      }
    };
    
    reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
    reader.readAsArrayBuffer(file);
  });
};

// Função para validações específicas por tipo
const validateSpecificRules = (
  data: unknown,
  type: keyof typeof IMPORT_CONFIGS,
  existingData: unknown[],
  currentBatchData: unknown[]
): ImportValidationResult => {
  const errors: ImportError[] = [];

  switch (type) {
    case 'auditores': {
      // Verificar email único no sistema
      const existingEmails = existingData.map((auditor: Auditor) => auditor.email.toLowerCase());
      const currentEmails = currentBatchData.map((auditor: AuditorImportData) => auditor.email.toLowerCase());
      const auditorData = data as AuditorImportData;
      
      if (existingEmails.includes(auditorData.email.toLowerCase()) || 
          currentEmails.includes(auditorData.email.toLowerCase())) {
        errors.push({
          row: 0,
          field: 'email',
          value: auditorData.email,
          message: 'E-mail já existe no sistema'
        });
      }
      break;
    }

    case 'setores': {
      // Verificar nome único no sistema
      const existingSectors = existingData.map((sector: Sector) => sector.name.toLowerCase());
      const currentSectors = currentBatchData.map((sector: SectorImportData) => sector.nomeDoSetor.toLowerCase());
      const sectorData = data as SectorImportData;
      
      if (existingSectors.includes(sectorData.nomeDoSetor.toLowerCase()) || 
          currentSectors.includes(sectorData.nomeDoSetor.toLowerCase())) {
        errors.push({
          row: 0,
          field: 'nomeDoSetor',
          value: sectorData.nomeDoSetor,
          message: 'Setor já existe no sistema'
        });
      }
      break;
    }

    case 'subprocessos':
    case 'processos': {
      // Verificar se o setor existe
      const processData = data as ProcessImportData;
      const sectorExists = existingData.some((sector: Sector) => 
        sector.name.toLowerCase() === processData.setor.toLowerCase()
      );
      
      if (!sectorExists) {
        errors.push({
          row: 0,
          field: 'setor',
          value: processData.setor,
          message: 'Setor informado não existe no sistema'
        });
      }
      break;
    }

    case 'tipos': {
      // Verificar nome único no sistema
      const existingTypes = existingData.map((auditType: AuditTypeConfig) => auditType.name.toLowerCase());
      const currentTypes = currentBatchData.map((auditType: AuditTypeImportData) => auditType.nome.toLowerCase());
      const typeData = data as AuditTypeImportData;
      
      if (existingTypes.includes(typeData.nome.toLowerCase()) || 
          currentTypes.includes(typeData.nome.toLowerCase())) {
        errors.push({
          row: 0,
          field: 'nome',
          value: typeData.nome,
          message: 'Tipo de auditoria já existe no sistema'
        });
      }
      break;
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Função para converter dados importados para formato do sistema
export const convertImportedData = {
  auditores: (data: AuditorImportData[]): Omit<Auditor, 'id'>[] => {
    return data.map(item => ({
      name: item.nome,
      email: item.email,
      leader: item.auditorLider === 'Sim',
      role: item.auditorLider === 'Sim' ? 'Auditor Líder' : 'Auditor'
    }));
  },

  setores: (data: SectorImportData[]): Omit<Sector, 'id'>[] => {
    return data.map(item => ({
      name: item.nomeDoSetor
    }));
  },

  subprocessos: (data: SubprocessImportData[]): Omit<Subprocess, 'id'>[] => {
    return data.map(item => ({
      name: item.nomeDoSubprocesso,
      sector: item.setor
    }));
  },

  processos: (data: ProcessImportData[]): Omit<Process, 'id'>[] => {
    return data.map(item => ({
      name: item.nomeDoProcesso,
      sector: item.setor
    }));
  },

  tipos: (data: AuditTypeImportData[]): Omit<AuditTypeConfig, 'id'>[] => {
    return data.map(item => ({
      name: item.nome,
      description: item.descricao
    }));
  }
};