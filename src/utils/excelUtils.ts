import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { 
  NormativeRequirement, 
  ImportPreviewData,
  NormativeMappingConfig 
} from '../types';

// Configuração do template Excel
export const EXCEL_TEMPLATE_CONFIG: NormativeMappingConfig = {
  templateColumns: [
    {
      key: 'standard',
      header: 'Norma',
      width: 15,
      type: 'dropdown',
      required: true,
      validation: ['ONA', 'ISO 17025', 'ISO 9001', 'ISO 14001', 'OHSAS 18001']
    },
    {
      key: 'version',
      header: 'Versão da Norma',
      width: 15,
      type: 'text',
      required: true
    },
    {
      key: 'chapter',
      header: 'Capítulo/Seção',
      width: 20,
      type: 'text',
      required: true
    },
    {
      key: 'requirementCode',
      header: 'Código do Requisito',
      width: 20,
      type: 'text',
      required: true
    },
    {
      key: 'description',
      header: 'Descrição do Requisito',
      width: 50,
      type: 'text',
      required: true
    },
    {
      key: 'evaluationCriteria',
      header: 'Critério de Avaliação',
      width: 40,
      type: 'text',
      required: true
    },
    {
      key: 'verificationType',
      header: 'Tipo de Verificação',
      width: 20,
      type: 'dropdown',
      required: true,
      validation: ['yes_no', 'multiple_choice', 'text', 'numeric']
    },
    {
      key: 'weight',
      header: 'Peso/Pontuação',
      width: 15,
      type: 'number',
      required: true
    },
    {
      key: 'observations',
      header: 'Observações',
      width: 30,
      type: 'text',
      required: false
    }
  ],
  supportedStandards: ['ONA', 'ISO 17025', 'ISO 9001', 'ISO 14001', 'OHSAS 18001'],
  maxFileSize: 10, // 10MB
  allowedFileTypes: ['.xlsx', '.xls']
};

/**
 * Exporta template Excel para importação de requisitos normativos
 */
export const exportExcelTemplate = (): void => {
  try {
    // Criar workbook
    const wb = XLSX.utils.book_new();
    
    // Criar dados de exemplo
    const exampleData = [
      {
        standard: 'ONA',
        version: '2024',
        chapter: '1. Liderança e Governança',
        requirementCode: 'LG.01',
        description: 'A organização deve estabelecer e manter uma estrutura de governança clara',
        evaluationCriteria: 'Verificar se existe organograma atualizado e definição de responsabilidades',
        verificationType: 'yes_no',
        weight: 10,
        observations: 'Verificar documentos de governança'
      },
      {
        standard: 'ISO 17025',
        version: '2017',
        chapter: '4. Requisitos Gerais',
        requirementCode: '4.1.1',
        description: 'O laboratório deve ser uma entidade legal ou parte definida de uma entidade legal',
        evaluationCriteria: 'Verificar documentação legal do laboratório',
        verificationType: 'yes_no',
        weight: 15,
        observations: 'Analisar CNPJ e documentos constitutivos'
      }
    ];

    // Criar worksheet com dados de exemplo
    const ws = XLSX.utils.json_to_sheet(exampleData);

    // Configurar largura das colunas
    const colWidths = EXCEL_TEMPLATE_CONFIG.templateColumns.map(col => ({
      wch: col.width
    }));
    ws['!cols'] = colWidths;

    // Adicionar worksheet ao workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Requisitos Normativos');

    // Criar worksheet de instruções
    const instructionsData = [
      ['INSTRUÇÕES PARA PREENCHIMENTO DO TEMPLATE'],
      [''],
      ['1. Preencha todas as colunas obrigatórias (marcadas em vermelho no cabeçalho)'],
      ['2. Use apenas os valores permitidos nas colunas de seleção:'],
      ['   - Norma: ONA, ISO 17025, ISO 9001, ISO 14001, OHSAS 18001'],
      ['   - Tipo de Verificação: yes_no, multiple_choice, text, numeric'],
      ['3. O peso deve ser um número entre 1 e 100'],
      ['4. Mantenha o formato das colunas conforme o exemplo'],
      ['5. Não altere os nomes das colunas'],
      ['6. Salve o arquivo em formato .xlsx'],
      [''],
      ['DESCRIÇÃO DAS COLUNAS:'],
      ['- Norma: Nome da norma (ex: ONA, ISO 17025)'],
      ['- Versão da Norma: Ano ou versão da norma'],
      ['- Capítulo/Seção: Seção ou capítulo da norma'],
      ['- Código do Requisito: Código único do requisito'],
      ['- Descrição do Requisito: Texto completo do requisito'],
      ['- Critério de Avaliação: Como avaliar o cumprimento'],
      ['- Tipo de Verificação: Forma de verificação (Sim/Não, etc.)'],
      ['- Peso/Pontuação: Importância do requisito (1-100)'],
      ['- Observações: Informações adicionais (opcional)']
    ];

    const instructionsWs = XLSX.utils.aoa_to_sheet(instructionsData);
    
    // Configurar largura das colunas para instruções
    instructionsWs['!cols'] = [{ wch: 80 }];
    
    XLSX.utils.book_append_sheet(wb, instructionsWs, 'Instruções');

    // Gerar arquivo Excel
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    // Fazer download
    const fileName = `template_requisitos_normativos_${new Date().toISOString().split('T')[0]}.xlsx`;
    saveAs(data, fileName);

    console.log('Template Excel exportado com sucesso:', fileName);
  } catch (error) {
    console.error('Erro ao exportar template Excel:', error);
    throw new Error('Falha ao exportar template Excel');
  }
};

/**
 * Valida arquivo Excel importado
 */
export const validateExcelFile = (file: File): { valid: boolean; error?: string } => {
  // Verificar tipo de arquivo
  const allowedTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'
  ];
  
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Tipo de arquivo não suportado. Use apenas arquivos .xlsx ou .xls'
    };
  }

  // Verificar tamanho do arquivo
  const maxSizeBytes = EXCEL_TEMPLATE_CONFIG.maxFileSize * 1024 * 1024; // Converter MB para bytes
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `Arquivo muito grande. Tamanho máximo: ${EXCEL_TEMPLATE_CONFIG.maxFileSize}MB`
    };
  }

  return { valid: true };
};

/**
 * Importa e processa arquivo Excel
 */
export const importExcelFile = async (file: File): Promise<ImportPreviewData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Pegar a primeira planilha
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Converter para JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length < 2) {
          resolve({
            valid: false,
            errors: ['Arquivo vazio ou sem dados válidos'],
            warnings: [],
            data: [],
            totalRows: 0,
            validRows: 0
          });
          return;
        }

        // Processar dados
        const result = processExcelData(jsonData as unknown[][]);
        resolve(result);
        
      } catch (error) {
        reject(new Error('Erro ao processar arquivo Excel: ' + (error as Error).message));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Erro ao ler arquivo'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Processa dados do Excel e valida
 */
const processExcelData = (rawData: unknown[][]): ImportPreviewData => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const validData: NormativeRequirement[] = [];
  
  // Pegar cabeçalhos (primeira linha)
  const headers = rawData[0];
  const expectedHeaders = EXCEL_TEMPLATE_CONFIG.templateColumns.map(col => col.header);
  
  // Validar cabeçalhos
  const missingHeaders = expectedHeaders.filter(header => !headers.includes(header));
  if (missingHeaders.length > 0) {
    errors.push(`Colunas obrigatórias ausentes: ${missingHeaders.join(', ')}`);
  }

  // Processar cada linha de dados
  for (let i = 1; i < rawData.length; i++) {
    const row = rawData[i];
    const rowErrors: string[] = [];
    
    if (!row || row.every(cell => !cell)) {
      continue; // Pular linhas vazias
    }

    try {
      const requirement: Partial<NormativeRequirement> = {
        id: Date.now() + i,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Mapear dados da linha
      headers.forEach((header: string, index: number) => {
        const column = EXCEL_TEMPLATE_CONFIG.templateColumns.find(col => col.header === header);
        if (!column) return;

        const cellValue = row[index];
        
        // Validar campos obrigatórios
        if (column.required && (!cellValue || cellValue.toString().trim() === '')) {
          rowErrors.push(`${header} é obrigatório`);
          return;
        }

        // Validar tipos e valores
        switch (column.key) {
          case 'standard': {
            const standardValue = cellValue?.toString() || '';
            if (standardValue && !EXCEL_TEMPLATE_CONFIG.supportedStandards.includes(standardValue)) {
              rowErrors.push(`Norma inválida: ${standardValue}`);
            } else {
              requirement.standard = standardValue;
            }
            break;
          }
          case 'version':
            requirement.version = cellValue?.toString() || '';
            break;
          case 'chapter':
            requirement.chapter = cellValue?.toString() || '';
            break;
          case 'requirementCode':
            requirement.requirementCode = cellValue?.toString() || '';
            break;
          case 'description':
            requirement.description = cellValue?.toString() || '';
            break;
          case 'evaluationCriteria':
            requirement.evaluationCriteria = cellValue?.toString() || '';
            break;
          case 'verificationType': {
            const validTypes = ['yes_no', 'multiple_choice', 'text', 'numeric'];
            const verificationValue = cellValue?.toString() || '';
            if (verificationValue && !validTypes.includes(verificationValue)) {
              rowErrors.push(`Tipo de verificação inválido: ${verificationValue}`);
            } else {
              requirement.verificationType = verificationValue as 'yes_no' | 'multiple_choice' | 'text' | 'numeric';
            }
            break;
          }
          case 'weight': {
            const weight = Number(cellValue);
            if (isNaN(weight) || weight < 1 || weight > 100) {
              rowErrors.push('Peso deve ser um número entre 1 e 100');
            } else {
              requirement.weight = weight;
            }
            break;
          }
          case 'observations':
            requirement.observations = cellValue?.toString() || '';
            break;
        }
      });

      if (rowErrors.length > 0) {
        errors.push(`Linha ${i + 1}: ${rowErrors.join(', ')}`);
      } else {
        validData.push(requirement as NormativeRequirement);
      }
      
    } catch {
      errors.push(`Linha ${i + 1}: Erro ao processar dados`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    data: validData,
    totalRows: rawData.length - 1, // Excluir cabeçalho
    validRows: validData.length
  };
};

/**
 * Converte requisitos normativos em checklist
 */
export const convertRequirementsToChecklist = (
  requirements: NormativeRequirement[],
  checklistName: string,
  standard: string,
  version: string
) => {
  const checklistId = `checklist_${Date.now()}`;
  
  // Agrupar requisitos por capítulo
  const groupedRequirements = requirements.reduce((acc, req) => {
    if (!acc[req.chapter]) {
      acc[req.chapter] = [];
    }
    acc[req.chapter].push(req);
    return acc;
  }, {} as Record<string, NormativeRequirement[]>);

  // Criar categorias e itens do checklist
  const categories = Object.entries(groupedRequirements).map(([chapter, reqs], categoryIndex) => ({
    id: `category_${checklistId}_${categoryIndex}`,
    name: chapter,
    description: `Requisitos do capítulo: ${chapter}`,
    order: categoryIndex,
    items: reqs.map((req, itemIndex) => ({
      id: `item_${checklistId}_${categoryIndex}_${itemIndex}`,
      categoryId: `category_${checklistId}_${categoryIndex}`,
      title: `${req.requirementCode} - ${req.description.substring(0, 100)}${req.description.length > 100 ? '...' : ''}`,
      description: req.description,
      type: req.verificationType === 'yes_no' ? 'boolean' as const : 
            req.verificationType === 'multiple_choice' ? 'multiple_choice' as const :
            req.verificationType === 'numeric' ? 'number' as const : 'text' as const,
      required: true,
      weight: req.weight,
      options: req.verificationType === 'multiple_choice' ? ['Conforme', 'Não Conforme', 'Não Aplicável'] : undefined,
      order: itemIndex,
      evidenceRequired: true,
      observations: req.observations
    }))
  }));

  return {
    id: checklistId,
    name: checklistName,
    description: `Checklist gerado automaticamente a partir dos requisitos da norma ${standard} versão ${version}`,
    version: '1.0',
    standard,
    standardVersion: version,
    categories,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'system'
  };
};