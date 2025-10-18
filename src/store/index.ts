import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  Audit, 
  Checklist, 
  NonConformity, 
  Evidence, 
  Resource, 
  ResourceAllocation, 
  Report, 
  KPI, 
  ChartData, 
  SystemConfig,
  NonConformityStatus,
  ChecklistVersion,
  AuditStatus,
  NonConformitySeverity,
  AuditType,
  EvidenceType,
  ExecutionTimingStatus,
  ExecutionNote,
  Auditor,
  Sector,
  Subprocess,
  Process,
  AuditTypeConfig,
  NormativeRequirement as NormativeRequirementType,
  NormativeStandard,
  ChecklistTag,
  ChecklistCategory,
  NormativeSection,
  NormativeRequirement as NormativeRequirementInterface,
  EvaluationMeasure,
  ImportPreviewData
} from '../types';

// Interface do estado principal
interface AuditProState {
  // Dados principais
  audits: Audit[];
  checklists: Checklist[];
  nonConformities: NonConformity[];
  evidences: Evidence[];
  resources: Resource[];
  resourceAllocations: ResourceAllocation[];
  reports: Report[];
  kpis: KPI[];
  chartData: ChartData[];
  systemConfig: SystemConfig;
  
  // Dados de configurações
  auditors: Auditor[];
  sectors: Sector[];
  subprocesses: Subprocess[];
  processes: Process[];
  auditTypes: AuditTypeConfig[];
  checklistCategories: ChecklistCategory[];
  
  // Dados normativos
  normativeRequirements: NormativeRequirementType[];
  normativeStandards: NormativeStandard[];
  
  // Estado da UI
  sidebarOpen: boolean;
  currentView: string;
  loading: boolean;
  error: string | null;
  
  // Ações para auditorias
  addAudit: (audit: Omit<Audit, 'id' | 'createdAt' | 'updatedAt'>) => void;
  createAudit: (audit: Omit<Audit, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'score' | 'nonConformities' | 'evidences' | 'reportGenerated'>) => Audit;
  updateAudit: (id: string, updates: Partial<Audit>) => void;
  deleteAudit: (id: string) => void;
  getAuditById: (id: string) => Audit | undefined;
  getAuditsByStatus: (status: AuditStatus) => Audit[];
  startAuditExecution: (id: string) => void;
  finishAuditExecution: (id: string, score?: number) => void;
  
  // Ações para checklists
  createChecklist: (checklist: Omit<Checklist, 'id' | 'createdAt' | 'updatedAt'>) => void;
  addChecklist: (checklist: Omit<Checklist, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateChecklist: (id: string, updates: Partial<Checklist>) => void;
  toggleChecklistStatus: (id: string) => void;
  deleteChecklist: (id: string) => void;
  getChecklistById: (id: string) => Checklist | undefined;
  getActiveChecklists: () => Checklist[];
  duplicateChecklist: (id: string, newName?: string) => string;
  createChecklistVersion: (id: string, changes: string[]) => void;
  activateChecklistVersion: (checklistId: string, versionId: string) => void;
  getChecklistVersions: (checklistId: string) => ChecklistVersion[];
  compareChecklistVersions: (checklistId: string, version1: string, version2: string) => Record<string, unknown>;
  
  // Ações para não conformidades
  addNonConformity: (nc: Omit<NonConformity, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNonConformity: (id: string, updates: Partial<NonConformity>) => void;
  deleteNonConformity: (id: string) => void;
  getNonConformityById: (id: string) => NonConformity | undefined;
  getNonConformitiesByAudit: (auditId: string) => NonConformity[];
  getNonConformitiesByStatus: (status: NonConformityStatus) => NonConformity[];
  
  // Ações para evidências
  addEvidence: (evidence: Omit<Evidence, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEvidence: (id: string, updates: Partial<Evidence>) => void;
  deleteEvidence: (id: string) => void;
  getEvidenceById: (id: string) => Evidence | undefined;
  getEvidencesByAudit: (auditId: string) => Evidence[];
  
  // Ações para recursos
  addResource: (resource: Resource) => void;
  updateResource: (id: string, updates: Partial<Resource>) => void;
  deleteResource: (id: string) => void;
  getResourceById: (id: string) => Resource | undefined;
  getAvailableResources: (date: Date) => Resource[];
  
  // Ações para alocação de recursos
  addResourceAllocation: (allocation: ResourceAllocation) => void;
  updateResourceAllocation: (id: string, updates: Partial<ResourceAllocation>) => void;
  deleteResourceAllocation: (id: string) => void;
  getResourceAllocationsByAudit: (auditId: string) => ResourceAllocation[];
  
  // Ações para relatórios
  addReport: (report: Report) => void;
  updateReport: (id: string, updates: Partial<Report>) => void;
  deleteReport: (id: string) => void;
  getReportById: (id: string) => Report | undefined;
  getReportsByAudit: (auditId: string) => Report[];
  
  // Ações para KPIs
  updateKPIs: (kpis: KPI[]) => void;
  getKPIsByCategory: (category: string) => KPI[];
  
  // Ações para dados de gráficos
  updateChartData: (chartData: ChartData[]) => void;
  getChartDataByType: (type: string) => ChartData[];
  
  // Ações da UI
  toggleSidebar: () => void;
  setCurrentView: (view: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Ações do sistema
  updateSystemConfig: (config: Partial<SystemConfig>) => void;
  resetStore: () => void;
  exportData: () => string;
  importData: (data: string) => void;

  // Ações para configurações
  addAuditor: (auditor: Omit<Auditor, 'id'>) => void;
  updateAuditor: (id: number, updates: Partial<Omit<Auditor, 'id'>>) => void;
  deleteAuditor: (id: number) => void;
  
  addSector: (sector: Omit<Sector, 'id'>) => void;
  updateSector: (id: number, updates: Partial<Omit<Sector, 'id'>>) => void;
  deleteSector: (id: number) => void;
  
  addSubprocess: (subprocess: Omit<Subprocess, 'id'>) => void;
  updateSubprocess: (id: number, updates: Partial<Omit<Subprocess, 'id'>>) => void;
  deleteSubprocess: (id: number) => void;
  
  addProcess: (process: Omit<Process, 'id'>) => void;
  updateProcess: (id: number, updates: Partial<Omit<Process, 'id'>>) => void;
  deleteProcess: (id: number) => void;
  
  addAuditType: (auditType: Omit<AuditTypeConfig, 'id'>) => void;
  updateAuditType: (id: number, updates: Partial<Omit<AuditTypeConfig, 'id'>>) => void;
  deleteAuditType: (id: number) => void;
  
  // Ações para categorias de checklist
  addChecklistCategory: (category: Omit<ChecklistCategory, 'id'>) => void;
  updateChecklistCategory: (id: string, updates: Partial<Omit<ChecklistCategory, 'id'>>) => void;
  deleteChecklistCategory: (id: string) => void;
  getChecklistCategoryById: (id: string) => ChecklistCategory | undefined;
  
  // Ações para seções normativas
  addNormativeSection: (categoryId: number, section: Omit<NormativeSection, 'id'>) => void;
  updateNormativeSection: (categoryId: number, sectionId: number, updates: Partial<Omit<NormativeSection, 'id'>>) => void;
  deleteNormativeSection: (categoryId: number, sectionId: number) => void;
  
  // Ações para requisitos normativos
  addNormativeRequirement: (categoryId: number, sectionId: number, requirement: Omit<NormativeRequirementInterface, 'id'>) => void;
  updateNormativeRequirement: (categoryId: number, sectionId: number, requirementId: number, updates: Partial<Omit<NormativeRequirementInterface, 'id'>>) => void;
  deleteNormativeRequirement: (categoryId: number, sectionId: number, requirementId: number) => void;
  
  getSubprocessesBySector: (sectorName: string) => Subprocess[];
  getProcessesBySector: (sectorName: string) => Process[];
  
  // Ações para requisitos normativos (sistema antigo)
  addNormativeRequirementOld: (requirement: Omit<NormativeRequirementType, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNormativeRequirementOld: (id: number, updates: Partial<NormativeRequirementType>) => void;
  deleteNormativeRequirementOld: (id: number) => void;
  getNormativeRequirementsByStandard: (standard: string) => NormativeRequirementType[];
  
  addNormativeStandard: (standard: Omit<NormativeStandard, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNormativeStandard: (id: string, updates: Partial<NormativeStandard>) => void;
  deleteNormativeStandard: (id: string) => void;
  
  // Ações para importação e conversão
  importNormativeRequirements: (requirements: NormativeRequirementType[], standardName: string, version: string) => Promise<void>;
  convertRequirementsToChecklist: (requirements: NormativeRequirementType[], checklistName: string, standard: string, version: string, shouldSave?: boolean) => string | Checklist;
}

// Configuração inicial do sistema
const initialSystemConfig: SystemConfig = {
  companyName: 'AuditPro',
  theme: 'light',
  language: 'pt-BR',
  timezone: 'America/Sao_Paulo',
  dateFormat: 'dd/MM/yyyy',
  currency: 'BRL',
  notifications: {
    email: true,
    push: true,
    sms: false
  },
  auditSettings: {
    autoScore: true,
    requireEvidence: true,
    allowPartialCompletion: true,
    defaultDuration: 8
  },
  reportSettings: {
    defaultTemplate: 'standard',
    includePhotos: true,
    watermark: true,
    digitalSignature: false
  }
};

// Função para gerar ID único
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Dados de exemplo para testes
const sampleAudits: Audit[] = [
  {
    id: 'audit-1',
    displayId: 'INT-2024-001',
    title: 'Auditoria de Segurança do Paciente - UTI',
    description: 'Auditoria focada em protocolos de segurança do paciente na UTI',
    type: AuditType.INTERNAL,
    status: AuditStatus.COMPLETED,
    scheduledDate: new Date('2024-01-15'),
    completedDate: new Date('2024-01-15'),
    auditorId: 'auditor-1',
    auditeeId: 'auditee-1',
    checklistId: 'checklist-1',
    location: 'UTI - 3º Andar',
    score: 85,
    maxScore: 100,
    duration: 4,
    findings: 'Identificadas 3 não conformidades relacionadas à higienização das mãos',
    recommendations: 'Implementar treinamento adicional sobre protocolos de higienização',
    nonConformities: ['nc-1', 'nc-2', 'nc-3'],
    evidences: ['ev-1', 'ev-2', 'ev-3'],
    reportGenerated: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'audit-2',
    displayId: 'INT-2024-002',
    title: 'Auditoria de Medicamentos - Farmácia',
    description: 'Verificação dos processos de armazenamento e dispensação de medicamentos',
    type: AuditType.INTERNAL,
    status: AuditStatus.COMPLETED,
    scheduledDate: new Date('2024-01-20'),
    completedDate: new Date('2024-01-20'),
    auditorId: 'auditor-2',
    auditeeId: 'auditee-2',
    checklistId: 'checklist-2',
    location: 'Farmácia Central',
    score: 92,
    maxScore: 100,
    duration: 3,
    findings: 'Encontrada 1 não conformidade menor no controle de temperatura',
    recommendations: 'Calibrar equipamentos de monitoramento de temperatura',
    nonConformities: ['nc-4'],
    evidences: ['ev-4', 'ev-5'],
    reportGenerated: true,
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'audit-3',
    displayId: 'INT-2024-003',
    title: 'Auditoria de Emergência - Pronto Socorro',
    description: 'Avaliação dos protocolos de atendimento de emergência',
    type: AuditType.INTERNAL,
    status: AuditStatus.COMPLETED,
    scheduledDate: new Date('2024-01-25'),
    completedDate: new Date('2024-01-25'),
    auditorId: 'auditor-1',
    auditeeId: 'auditee-3',
    checklistId: 'checklist-3',
    location: 'Pronto Socorro',
    score: 78,
    maxScore: 100,
    duration: 5,
    findings: 'Identificadas 2 não conformidades críticas relacionadas a eventos com pacientes',
    recommendations: 'Revisão imediata dos protocolos de triagem e atendimento',
    nonConformities: ['nc-5', 'nc-6'],
    evidences: ['ev-6', 'ev-7', 'ev-8'],
    reportGenerated: true,
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-25')
  }
];

const sampleNonConformities: NonConformity[] = [
  {
    id: 'nc-1',
    auditId: 'audit-1',
    title: 'Higienização inadequada das mãos',
    description: 'Observado que 30% dos profissionais não seguem o protocolo completo de higienização das mãos antes do contato com pacientes',
    category: 'Controle de Infecção',
    severity: NonConformitySeverity.HIGH,
    status: NonConformityStatus.OPEN,
    location: 'UTI - Leitos 1-10',
    identifiedBy: 'Dr. João Silva',
    identifiedAt: new Date('2024-01-15T10:30:00'),
    impact: 'Alto risco de infecção cruzada entre pacientes',
    riskLevel: 'Alto',
    rootCause: 'Falta de treinamento adequado e ausência de supervisão contínua',
    dueDate: new Date('2024-02-15'),
    isPatientRelated: false,
    correctiveActions: [
      {
        id: 'ca-1',
        nonConformityId: 'nc-1',
        description: 'Implementar treinamento obrigatório sobre higienização das mãos',
        responsibleId: 'resp-1',
        dueDate: new Date('2024-02-01'),
        status: NonConformityStatus.IN_PROGRESS,
        createdAt: new Date('2024-01-16'),
        updatedAt: new Date('2024-01-20')
      }
    ],
    evidences: ['ev-1', 'ev-2'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'nc-2',
    auditId: 'audit-1',
    title: 'Equipamentos de proteção individual inadequados',
    description: 'Alguns profissionais utilizando EPIs vencidos ou danificados',
    category: 'Segurança Ocupacional',
    severity: NonConformitySeverity.MEDIUM,
    status: NonConformityStatus.IN_PROGRESS,
    location: 'UTI - Posto de Enfermagem',
    identifiedBy: 'Enf. Maria Santos',
    identifiedAt: new Date('2024-01-15T14:15:00'),
    impact: 'Risco de exposição ocupacional a agentes biológicos',
    riskLevel: 'Médio',
    rootCause: 'Controle inadequado do estoque e validade dos EPIs',
    dueDate: new Date('2024-02-10'),
    isPatientRelated: false,
    correctiveActions: [],
    evidences: ['ev-3'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: 'nc-3',
    auditId: 'audit-1',
    title: 'Documentação incompleta de procedimentos',
    description: 'Registros de enfermagem incompletos em 15% dos prontuários verificados',
    category: 'Documentação',
    severity: NonConformitySeverity.LOW,
    status: NonConformityStatus.RESOLVED,
    location: 'UTI - Todos os leitos',
    identifiedBy: 'Auditora Ana Costa',
    identifiedAt: new Date('2024-01-15T16:45:00'),
    impact: 'Comprometimento da continuidade do cuidado e aspectos legais',
    riskLevel: 'Baixo',
    rootCause: 'Sobrecarga de trabalho e falta de padronização',
    dueDate: new Date('2024-01-30'),
    isPatientRelated: false,
    correctiveActions: [],
    evidences: [],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-28')
  },
  {
    id: 'nc-4',
    auditId: 'audit-2',
    title: 'Temperatura inadequada no armazenamento',
    description: 'Geladeira de medicamentos apresentando temperatura de 12°C (limite máximo 8°C)',
    category: 'Armazenamento',
    severity: NonConformitySeverity.MEDIUM,
    status: NonConformityStatus.RESOLVED,
    location: 'Farmácia Central - Geladeira 02',
    identifiedBy: 'Farm. Carlos Oliveira',
    identifiedAt: new Date('2024-01-20T09:20:00'),
    impact: 'Possível perda de eficácia de medicamentos termolábeis',
    riskLevel: 'Médio',
    rootCause: 'Defeito no termostato da geladeira',
    dueDate: new Date('2024-01-25'),
    isPatientRelated: false,
    correctiveActions: [],
    evidences: ['ev-4', 'ev-5'],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-24')
  },
  {
    id: 'nc-5',
    auditId: 'audit-3',
    title: 'Evento adverso - Queda de paciente',
    description: 'Paciente sofreu queda durante transferência da maca para leito, resultando em escoriação no braço direito',
    category: 'Segurança do Paciente',
    severity: NonConformitySeverity.CRITICAL,
    status: NonConformityStatus.OPEN,
    location: 'Pronto Socorro - Sala 3',
    identifiedBy: 'Enf. Pedro Lima',
    identifiedAt: new Date('2024-01-25T11:30:00'),
    impact: 'Lesão física ao paciente e comprometimento da confiança',
    riskLevel: 'Crítico',
    rootCause: 'Falha na comunicação durante transferência e ausência de grades de proteção',
    dueDate: new Date('2024-02-05'),
    isPatientRelated: true,
    correctiveActions: [],
    evidences: ['ev-6', 'ev-7'],
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25')
  },
  {
    id: 'nc-6',
    auditId: 'audit-3',
    title: 'Evento adverso - Medicação incorreta',
    description: 'Administração de medicamento em dosagem incorreta devido a erro de prescrição não identificado',
    category: 'Segurança do Paciente',
    severity: NonConformitySeverity.CRITICAL,
    status: NonConformityStatus.IN_PROGRESS,
    location: 'Pronto Socorro - Sala 1',
    identifiedBy: 'Dr. Roberto Alves',
    identifiedAt: new Date('2024-01-25T15:45:00'),
    impact: 'Risco de reação adversa grave ao paciente',
    riskLevel: 'Crítico',
    rootCause: 'Falha no processo de dupla checagem de medicamentos',
    dueDate: new Date('2024-02-01'),
    isPatientRelated: true,
    correctiveActions: [],
    evidences: ['ev-8'],
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-26')
  }
];

const sampleEvidences: Evidence[] = [
  {
    id: 'ev-1',
    auditId: 'audit-1',
    nonConformityId: 'nc-1',
    title: 'Foto - Pia sem sabão',
    description: 'Pia da UTI sem dispensador de sabão funcionando',
    type: EvidenceType.PHOTO,
    url: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=hospital%20sink%20without%20soap%20dispenser%20medical%20facility&image_size=landscape_4_3',
    fileSize: 2048576,
    capturedBy: 'Dr. João Silva',
    capturedAt: new Date('2024-01-15T10:35:00'),
    location: 'UTI - Pia próxima ao leito 5',
    tags: ['higienização', 'infraestrutura', 'uti'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'ev-2',
    auditId: 'audit-1',
    nonConformityId: 'nc-1',
    title: 'Vídeo - Procedimento inadequado',
    description: 'Gravação mostrando profissional não seguindo protocolo de higienização',
    type: EvidenceType.VIDEO,
    url: '/evidences/video-higienizacao-inadequada.mp4',
    fileSize: 15728640,
    capturedBy: 'Auditora Ana Costa',
    capturedAt: new Date('2024-01-15T10:45:00'),
    location: 'UTI - Leito 3',
    tags: ['procedimento', 'protocolo', 'treinamento'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'ev-3',
    auditId: 'audit-1',
    nonConformityId: 'nc-2',
    title: 'Foto - EPI vencido',
    description: 'Máscara N95 com data de validade vencida sendo utilizada',
    type: EvidenceType.PHOTO,
    url: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=expired%20N95%20mask%20medical%20equipment%20healthcare%20safety&image_size=square_hd',
    fileSize: 1536000,
    capturedBy: 'Enf. Maria Santos',
    capturedAt: new Date('2024-01-15T14:20:00'),
    location: 'UTI - Posto de Enfermagem',
    tags: ['epi', 'validade', 'segurança'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'ev-4',
    auditId: 'audit-2',
    nonConformityId: 'nc-4',
    title: 'Foto - Termômetro da geladeira',
    description: 'Display do termômetro mostrando temperatura de 12°C',
    type: EvidenceType.PHOTO,
    url: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=digital%20thermometer%20display%20showing%2012%20degrees%20celsius%20medical%20refrigerator&image_size=square',
    fileSize: 1024000,
    capturedBy: 'Farm. Carlos Oliveira',
    capturedAt: new Date('2024-01-20T09:25:00'),
    location: 'Farmácia Central - Geladeira 02',
    tags: ['temperatura', 'medicamentos', 'armazenamento'],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'ev-5',
    auditId: 'audit-2',
    nonConformityId: 'nc-4',
    title: 'Documento - Registro de temperatura',
    description: 'Planilha de controle de temperatura dos últimos 7 dias',
    type: EvidenceType.DOCUMENT,
    url: '/evidences/controle-temperatura-farmacia.pdf',
    fileSize: 512000,
    capturedBy: 'Farm. Carlos Oliveira',
    capturedAt: new Date('2024-01-20T09:30:00'),
    location: 'Farmácia Central',
    tags: ['controle', 'temperatura', 'histórico'],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'ev-6',
    auditId: 'audit-3',
    nonConformityId: 'nc-5',
    title: 'Foto - Local da queda',
    description: 'Área onde ocorreu a queda do paciente, mostrando ausência de proteções',
    type: EvidenceType.PHOTO,
    url: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=hospital%20emergency%20room%20bed%20transfer%20area%20without%20safety%20rails&image_size=landscape_4_3',
    fileSize: 2560000,
    capturedBy: 'Enf. Pedro Lima',
    capturedAt: new Date('2024-01-25T11:35:00'),
    location: 'Pronto Socorro - Sala 3',
    tags: ['queda', 'segurança', 'paciente', 'evento-adverso'],
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25')
  },
  {
    id: 'ev-7',
    auditId: 'audit-3',
    nonConformityId: 'nc-5',
    title: 'Nota - Relato do incidente',
    description: 'Descrição detalhada do evento adverso conforme relatado pela equipe',
    type: EvidenceType.NOTE,
    url: '',
    content: 'Paciente J.S., 65 anos, durante transferência da maca para o leito às 11:30h, sofreu queda lateral resultando em escoriação no braço direito. Equipe presente: Enf. Pedro Lima e Téc. Ana Silva. Paciente consciente e orientado após o incidente. Família comunicada. Médico acionado para avaliação.',
    fileSize: 0,
    capturedBy: 'Enf. Pedro Lima',
    capturedAt: new Date('2024-01-25T12:00:00'),
    location: 'Pronto Socorro - Sala 3',
    tags: ['relato', 'incidente', 'evento-adverso'],
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25')
  },
  {
    id: 'ev-8',
    auditId: 'audit-3',
    nonConformityId: 'nc-6',
    title: 'Documento - Prescrição médica',
    description: 'Cópia da prescrição com erro de dosagem não identificado',
    type: EvidenceType.DOCUMENT,
    url: '/evidences/prescricao-erro-dosagem.pdf',
    fileSize: 768000,
    capturedBy: 'Dr. Roberto Alves',
    capturedAt: new Date('2024-01-25T16:00:00'),
    location: 'Pronto Socorro - Sala 1',
    tags: ['prescrição', 'medicação', 'erro', 'evento-adverso'],
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25')
  }
];

// Store principal
export const useAuditProStore = create<AuditProState>()(
  persist(
    (set, get) => ({
      // Estado inicial com dados de exemplo
      audits: sampleAudits,
      checklists: [],
      nonConformities: sampleNonConformities,
      evidences: sampleEvidences,
      resources: [],
      resourceAllocations: [],
      reports: [],
      kpis: [],
      chartData: [],
      systemConfig: initialSystemConfig,
      
      // Estado inicial das configurações
      auditors: [],
      sectors: [],
      subprocesses: [],
      processes: [],
      auditTypes: [],
      checklistCategories: [],
      
      // Estado inicial dos requisitos normativos
      normativeRequirements: [],
      normativeStandards: [],
      
      // Estado da UI
      sidebarOpen: false,
      currentView: 'dashboard',
      loading: false,
      error: null,
      
      // Implementação das ações para auditorias
      createAudit: (auditData) => {
        const currentYear = new Date().getFullYear();
        const auditsForTypeAndYear = get().audits.filter(
          (audit) => audit.type === auditData.type && new Date(audit.createdAt).getFullYear() === currentYear
        );
        const nextSequenceNumber = auditsForTypeAndYear.length + 1;

        let typeAcronym = 'AUD';
        switch (auditData.type) {
          case AuditType.INTERNAL:
            typeAcronym = 'INT';
            break;
          case AuditType.EXTERNAL:
            typeAcronym = 'EXT';
            break;
          case AuditType.SUPPLIER:
            typeAcronym = 'FOR';
            break;
        }

        const displayId = `${typeAcronym}-${currentYear}-${String(nextSequenceNumber).padStart(3, '0')}`;

        const newAudit: Audit = {
          ...auditData,
          id: generateId(),
          displayId: displayId, // Adiciona o displayId gerado
          status: AuditStatus.PLANNED,
          score: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          nonConformities: [],
          evidences: [],
          reportGenerated: false
        };
        
        set((state) => ({
          audits: [...state.audits, newAudit]
        }));
        
        return newAudit;
      },
      
      addAudit: (auditData) => {
        const newAudit: Audit = {
          ...auditData,
          id: generateId(),
          createdAt: new Date(),
          updatedAt: new Date(),
          nonConformities: [],
          evidences: [],
          reportGenerated: false
        };
        
        set((state) => ({
          audits: [...state.audits, newAudit]
        }));
      },
      
      updateAudit: (id, updates) => {
        set((state) => ({
          audits: state.audits.map((audit) =>
            audit.id === id
              ? { ...audit, ...updates, updatedAt: new Date() }
              : audit
          )
        }));
      },
      
      deleteAudit: (id) => {
        set((state) => ({
          audits: state.audits.filter((audit) => audit.id !== id),
          nonConformities: state.nonConformities.filter((nc) => nc.auditId !== id),
          evidences: state.evidences.filter((ev) => ev.auditId !== id)
        }));
      },
      
      getAuditById: (id) => {
        return get().audits.find((audit) => audit.id === id);
      },
      
      getAuditsByStatus: (status) => {
        return get().audits.filter((audit) => audit.status === status);
      },

      startAuditExecution: (id) => {
        set((state) => ({
          audits: state.audits.map((audit) =>
            audit.id === id
              ? { 
                  ...audit, 
                  status: AuditStatus.IN_PROGRESS,
                  actualStartDate: new Date(),
                  updatedAt: new Date()
                }
              : audit
          )
        }));
      },

      finishAuditExecution: (id, score) => {
        const audit = get().audits.find(a => a.id === id);
        if (!audit) return;

        const executedAt = new Date();
        const scheduledDate = audit.scheduledDate;
        
        // Log de debug para verificar o score recebido
        console.log('=== DEBUG STORE ===');
        console.log('Score recebido no store:', score);
        console.log('Tipo do score:', typeof score);
        console.log('==================');
        
        // Determinar status de execução em relação ao prazo
        let timingStatus: ExecutionTimingStatus;
        let note: string;
        
        const executedDateOnly = new Date(executedAt.getFullYear(), executedAt.getMonth(), executedAt.getDate());
        const scheduledDateOnly = new Date(scheduledDate.getFullYear(), scheduledDate.getMonth(), scheduledDate.getDate());
        
        if (executedDateOnly < scheduledDateOnly) {
          timingStatus = ExecutionTimingStatus.EARLY;
          note = `Auditoria executada antecipadamente em ${executedAt.toLocaleDateString('pt-BR')}`;
        } else if (executedDateOnly > scheduledDateOnly) {
          timingStatus = ExecutionTimingStatus.LATE;
          note = `Auditoria executada em atraso em ${executedAt.toLocaleDateString('pt-BR')}`;
        } else {
          timingStatus = ExecutionTimingStatus.ON_TIME;
          note = `Auditoria executada no prazo em ${executedAt.toLocaleDateString('pt-BR')}`;
        }

        const executionNote: ExecutionNote = {
          status: timingStatus,
          executedAt,
          scheduledDate,
          note
        };

        set((state) => ({
          audits: state.audits.map((audit) =>
            audit.id === id
              ? { 
                  ...audit, 
                  status: AuditStatus.COMPLETED,
                  actualEndDate: executedAt,
                  score: score !== undefined ? Number(score) : audit.score, // Garantir que seja número
                  executionNote,
                  updatedAt: new Date()
                }
              : audit
          )
        }));
        
        // Log de debug para verificar o que foi salvo
        const updatedAudit = get().audits.find(a => a.id === id);
        console.log('=== DEBUG APÓS SALVAR ===');
        console.log('Score salvo:', updatedAudit?.score);
        console.log('Tipo do score salvo:', typeof updatedAudit?.score);
        console.log('========================');
      },
      
      // Implementação das ações para checklists
      createChecklist: (checklistData) => {
        const newChecklist: Checklist = {
          ...checklistData,
          id: generateId(),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        set((state) => ({
          checklists: [...state.checklists, newChecklist]
        }));
      },

      addChecklist: (checklistData) => {
        const newChecklist: Checklist = {
          ...checklistData,
          id: generateId(),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        set((state) => ({
          checklists: [...state.checklists, newChecklist]
        }));
      },

      toggleChecklistStatus: (id) => {
        set((state) => ({
          checklists: state.checklists.map((checklist) =>
            checklist.id === id
              ? { ...checklist, isActive: !checklist.isActive, updatedAt: new Date() }
              : checklist
          )
        }));
      },
      
      updateChecklist: (id, updates) => {
        set((state) => ({
          checklists: state.checklists.map((checklist) =>
            checklist.id === id
              ? { ...checklist, ...updates, updatedAt: new Date() }
              : checklist
          )
        }));
      },
      
      deleteChecklist: (id) => {
        set((state) => ({
          checklists: state.checklists.filter((checklist) => checklist.id !== id)
        }));
      },
      
      getChecklistById: (id) => {
        return get().checklists.find((checklist) => checklist.id === id);
      },
      
      getActiveChecklists: () => {
        return get().checklists.filter((checklist) => checklist.isActive);
      },
      
      // Ações avançadas para checklists
      duplicateChecklist: (id, newName) => {
        const originalChecklist = get().getChecklistById(id);
        if (!originalChecklist) return '';
        
        const duplicatedChecklist: Checklist = {
          ...originalChecklist,
          id: generateId(),
          name: newName || `${originalChecklist.name} (Cópia)`,
          version: '1.0',
          parentId: id,
          isActive: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          versions: []
        };
        
        set((state) => ({
          checklists: [...state.checklists, duplicatedChecklist]
        }));
        
        return duplicatedChecklist.id;
      },
      
      createChecklistVersion: (id, changes) => {
        const checklist = get().getChecklistById(id);
        if (!checklist) return;
        
        const newVersion: ChecklistVersion = {
          id: generateId(),
          checklistId: id,
          version: `${parseFloat(checklist.version) + 0.1}`,
          changes,
          createdBy: 'Admin',
          createdAt: new Date(),
          isActive: false,
          snapshot: {
            name: checklist.name,
            description: checklist.description,
            version: checklist.version,
            isActive: checklist.isActive,
            category: checklist.category,
            categories: checklist.categories,
            totalWeight: checklist.totalWeight,
            maxScore: checklist.maxScore,
            createdBy: checklist.createdBy,
            approvedBy: checklist.approvedBy,
            approvedAt: checklist.approvedAt,
            tags: checklist.tags,
            parentId: checklist.parentId
          }
        };
        
        set((state) => ({
          checklists: state.checklists.map((c) =>
            c.id === id
              ? { ...c, versions: [...c.versions, newVersion], updatedAt: new Date() }
              : c
          )
        }));
      },
      
      activateChecklistVersion: (checklistId, versionId) => {
        const checklist = get().getChecklistById(checklistId);
        if (!checklist) return;
        
        const version = checklist.versions.find(v => v.id === versionId);
        if (!version) return;
        
        set((state) => ({
          checklists: state.checklists.map((c) =>
            c.id === checklistId
              ? {
                  ...c,
                  ...version.snapshot,
                  version: version.version,
                  updatedAt: new Date(),
                  versions: c.versions.map(v => ({
                    ...v,
                    isActive: v.id === versionId
                  }))
                }
              : c
          )
        }));
      },
      
      getChecklistVersions: (checklistId) => {
        const checklist = get().getChecklistById(checklistId);
        return checklist?.versions || [];
      },
      
      compareChecklistVersions: (checklistId, version1, version2) => {
        const checklist = get().getChecklistById(checklistId);
        if (!checklist) return null;
        
        const v1 = checklist.versions.find(v => v.version === version1);
        const v2 = checklist.versions.find(v => v.version === version2);
        
        if (!v1 || !v2) return null;
        
        return {
          version1: v1,
          version2: v2,
          differences: {
            name: v1.snapshot.name !== v2.snapshot.name,
            description: v1.snapshot.description !== v2.snapshot.description,
            categories: JSON.stringify(v1.snapshot.categories) !== JSON.stringify(v2.snapshot.categories),
            tags: JSON.stringify(v1.snapshot.tags) !== JSON.stringify(v2.snapshot.tags)
          }
        };
      },
      
      // Implementação das ações para não conformidades
      addNonConformity: (ncData) => {
        const newNonConformity: NonConformity = {
          ...ncData,
          id: generateId(),
          createdAt: new Date(),
          updatedAt: new Date(),
          correctiveActions: [],
          evidences: []
        };
        
        set((state) => ({
          nonConformities: [...state.nonConformities, newNonConformity]
        }));
      },
      
      updateNonConformity: (id, updates) => {
        set((state) => ({
          nonConformities: state.nonConformities.map((nc) =>
            nc.id === id
              ? { ...nc, ...updates, updatedAt: new Date() }
              : nc
          )
        }));
      },
      
      deleteNonConformity: (id) => {
        set((state) => ({
          nonConformities: state.nonConformities.filter((nc) => nc.id !== id),
          evidences: state.evidences.filter((ev) => ev.nonConformityId !== id)
        }));
      },
      
      getNonConformityById: (id) => {
        return get().nonConformities.find((nc) => nc.id === id);
      },
      
      getNonConformitiesByAudit: (auditId) => {
        return get().nonConformities.filter((nc) => nc.auditId === auditId);
      },
      
      getNonConformitiesByStatus: (status) => {
        return get().nonConformities.filter((nc) => nc.status === status);
      },
      
      // Implementação das ações para evidências
      addEvidence: (evidenceData) => {
        const newEvidence: Evidence = {
          ...evidenceData,
          id: generateId(),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        set((state) => ({
          evidences: [...state.evidences, newEvidence]
        }));
      },
      
      updateEvidence: (id, updates) => {
        set((state) => ({
          evidences: state.evidences.map((evidence) =>
            evidence.id === id
              ? { ...evidence, ...updates, updatedAt: new Date() }
              : evidence
          )
        }));
      },
      
      deleteEvidence: (id) => {
        set((state) => ({
          evidences: state.evidences.filter((evidence) => evidence.id !== id)
        }));
      },
      
      getEvidenceById: (id) => {
        return get().evidences.find((evidence) => evidence.id === id);
      },
      
      getEvidencesByAudit: (auditId) => {
        return get().evidences.filter((evidence) => evidence.auditId === auditId);
      },
      
      // Implementação das ações para recursos
      addResource: (resource) => {
        set((state) => ({
          resources: [...state.resources, resource]
        }));
      },
      
      updateResource: (id, updates) => {
        set((state) => ({
          resources: state.resources.map((resource) =>
            resource.id === id ? { ...resource, ...updates } : resource
          )
        }));
      },
      
      deleteResource: (id) => {
        set((state) => ({
          resources: state.resources.filter((resource) => resource.id !== id),
          resourceAllocations: state.resourceAllocations.filter((allocation) => allocation.resourceId !== id)
        }));
      },
      
      getResourceById: (id) => {
        return get().resources.find((resource) => resource.id === id);
      },
      
      getAvailableResources: () => {
        // Implementação simplificada - pode ser expandida com lógica de disponibilidade
        return get().resources.filter((resource) => resource.isActive);
      },
      
      // Implementação das ações para alocação de recursos
      addResourceAllocation: (allocation) => {
        set((state) => ({
          resourceAllocations: [...state.resourceAllocations, allocation]
        }));
      },
      
      updateResourceAllocation: (id, updates) => {
        set((state) => ({
          resourceAllocations: state.resourceAllocations.map((allocation) =>
            allocation.id === id ? { ...allocation, ...updates } : allocation
          )
        }));
      },
      
      deleteResourceAllocation: (id) => {
        set((state) => ({
          resourceAllocations: state.resourceAllocations.filter((allocation) => allocation.id !== id)
        }));
      },
      
      getResourceAllocationsByAudit: (auditId) => {
        return get().resourceAllocations.filter((allocation) => allocation.auditId === auditId);
      },
      
      // Implementação das ações para relatórios
      addReport: (report) => {
        set((state) => ({
          reports: [...state.reports, report]
        }));
      },
      
      updateReport: (id, updates) => {
        set((state) => ({
          reports: state.reports.map((report) =>
            report.id === id
              ? { ...report, ...updates, updatedAt: new Date() }
              : report
          )
        }));
      },
      
      deleteReport: (id) => {
        set((state) => ({
          reports: state.reports.filter((report) => report.id !== id)
        }));
      },
      
      getReportById: (id) => {
        return get().reports.find((report) => report.id === id);
      },
      
      getReportsByAudit: (auditId) => {
        return get().reports.filter((report) => report.auditId === auditId);
      },
      
      // Implementação das ações para KPIs
      updateKPIs: (kpis) => {
        set({ kpis });
      },
      
      getKPIsByCategory: (category) => {
        return get().kpis.filter((kpi) => kpi.category === category);
      },
      
      // Implementação das ações para dados de gráficos
      updateChartData: (chartData) => {
        set({ chartData });
      },
      
      getChartDataByType: (type) => {
        return get().chartData.filter((chart) => chart.type === type);
      },
      
      // Implementação das ações da UI
      toggleSidebar: () => {
        set((state) => ({
          sidebarOpen: !state.sidebarOpen
        }));
      },
      
      setCurrentView: (view) => {
        set({ currentView: view });
      },
      
      setLoading: (loading) => {
        set({ loading });
      },
      
      setError: (error) => {
        set({ error });
      },
      
      // Implementação das ações do sistema
      updateSystemConfig: (config) => {
        set((state) => ({
          systemConfig: { ...state.systemConfig, ...config }
        }));
      },
      
      resetStore: () => {
        set({
          audits: [],
          checklists: [],
          nonConformities: [],
          evidences: [],
          resources: [],
          resourceAllocations: [],
          reports: [],
          kpis: [],
          chartData: [],
          systemConfig: initialSystemConfig,
          sidebarOpen: false,
          currentView: 'dashboard',
          loading: false,
          error: null
        });
      },
      
      exportData: () => {
        const state = get();
        const exportData = {
          audits: state.audits,
          checklists: state.checklists,
          nonConformities: state.nonConformities,
          evidences: state.evidences,
          resources: state.resources,
          resourceAllocations: state.resourceAllocations,
          reports: state.reports,
          systemConfig: state.systemConfig,
          exportedAt: new Date()
        };
        return JSON.stringify(exportData, null, 2);
      },
      
      importData: (data) => {
        try {
          const importedData = JSON.parse(data);
          set((state) => ({
            ...state,
            ...importedData,
            loading: false,
            error: null
          }));
        } catch {
          set({ error: 'Erro ao importar dados: formato inválido' });
        }
      },

      // Ações para Auditores
      addAuditor: (auditor: Omit<Auditor, 'id'>) => {
        const newAuditor: Auditor = {
          ...auditor,
          id: Date.now()
        };
        set((state) => ({
          auditors: [...state.auditors, newAuditor]
        }));
      },

      updateAuditor: (id: number, updates: Partial<Omit<Auditor, 'id'>>) => {
        set((state) => ({
          auditors: state.auditors.map((auditor) =>
            auditor.id === id ? { ...auditor, ...updates } : auditor
          )
        }));
      },

      deleteAuditor: (id: number) => {
        set((state) => ({
          auditors: state.auditors.filter((auditor) => auditor.id !== id)
        }));
      },

      // Ações para Setores
      addSector: (sector: Omit<Sector, 'id'>) => {
        const newSector: Sector = {
          ...sector,
          id: Date.now()
        };
        set((state) => ({
          sectors: [...state.sectors, newSector]
        }));
      },

      updateSector: (id: number, updates: Partial<Omit<Sector, 'id'>>) => {
        set((state) => ({
          sectors: state.sectors.map((sector) =>
            sector.id === id ? { ...sector, ...updates } : sector
          )
        }));
      },

      deleteSector: (id: number) => {
        set((state) => ({
          sectors: state.sectors.filter((sector) => sector.id !== id),
          // Remove subprocessos e processos relacionados
          subprocesses: state.subprocesses.filter((subprocess) => 
            state.sectors.find(s => s.id === id)?.name !== subprocess.sector
          ),
          processes: state.processes.filter((process) => 
            state.sectors.find(s => s.id === id)?.name !== process.sector
          )
        }));
      },

      // Ações para Subprocessos
      addSubprocess: (subprocess: Omit<Subprocess, 'id'>) => {
        const newSubprocess: Subprocess = {
          ...subprocess,
          id: Date.now()
        };
        set((state) => ({
          subprocesses: [...state.subprocesses, newSubprocess]
        }));
      },

      updateSubprocess: (id: number, updates: Partial<Omit<Subprocess, 'id'>>) => {
        set((state) => ({
          subprocesses: state.subprocesses.map((subprocess) =>
            subprocess.id === id ? { ...subprocess, ...updates } : subprocess
          )
        }));
      },

      deleteSubprocess: (id: number) => {
        set((state) => ({
          subprocesses: state.subprocesses.filter((subprocess) => subprocess.id !== id)
        }));
      },

      // Ações para Processos
      addProcess: (process: Omit<Process, 'id'>) => {
        const newProcess: Process = {
          ...process,
          id: Date.now()
        };
        set((state) => ({
          processes: [...state.processes, newProcess]
        }));
      },

      updateProcess: (id: number, updates: Partial<Omit<Process, 'id'>>) => {
        set((state) => ({
          processes: state.processes.map((process) =>
            process.id === id ? { ...process, ...updates } : process
          )
        }));
      },

      deleteProcess: (id: number) => {
        set((state) => ({
          processes: state.processes.filter((process) => process.id !== id)
        }));
      },

      // Ações para Tipos de Auditoria
      addAuditType: (auditType: Omit<AuditTypeConfig, 'id'>) => {
        const newAuditType: AuditTypeConfig = {
          ...auditType,
          id: Date.now()
        };
        set((state) => ({
          auditTypes: [...state.auditTypes, newAuditType]
        }));
      },

      updateAuditType: (id: number, updates: Partial<Omit<AuditTypeConfig, 'id'>>) => {
        set((state) => ({
          auditTypes: state.auditTypes.map((auditType) =>
            auditType.id === id ? { ...auditType, ...updates } : auditType
          )
        }));
      },

      deleteAuditType: (id: number) => {
        set((state) => ({
          auditTypes: state.auditTypes.filter(type => type.id !== id)
        }));
      },

      // Ações para categorias de checklist
      addChecklistCategory: (category: Omit<ChecklistCategory, 'id'>) => {
        const newCategory: ChecklistCategory = {
          ...category,
          id: `category-${Date.now()}`
        };
        
        set((state) => ({
          checklistCategories: [...state.checklistCategories, newCategory]
        }));
        
        console.log('Categoria adicionada:', newCategory);
        console.log('Total de categorias:', get().checklistCategories.length);
      },

      updateChecklistCategory: (id: string, updates: Partial<Omit<ChecklistCategory, 'id'>>) => {
        set((state) => ({
          checklistCategories: state.checklistCategories.map(category =>
            category.id === id ? { ...category, ...updates } : category
          )
        }));
      },

      deleteChecklistCategory: (id: string) => {
        set((state) => ({
          checklistCategories: state.checklistCategories.filter(category => category.id !== id)
        }));
      },

      getChecklistCategoryById: (id: string) => {
        return get().checklistCategories.find(category => category.id === id);
      },

      // Ações para seções normativas
      addNormativeSection: (categoryId: number, section: Omit<NormativeSection, 'id'>) => {
        // Esta função não é compatível com a estrutura atual de ChecklistCategory
        // ChecklistCategory não possui normativeSections
        console.warn('addNormativeSection: Esta função não é compatível com a estrutura atual de ChecklistCategory');
      },

      updateNormativeSection: (_categoryId: number, _sectionId: number, _updates: Partial<Omit<NormativeSection, 'id'>>) => {
        // Esta função não é compatível com a estrutura atual de ChecklistCategory
        // ChecklistCategory não possui normativeSections
        console.warn('updateNormativeSection: Esta função não é compatível com a estrutura atual de ChecklistCategory');
      },

      deleteNormativeSection: (_categoryId: number, _sectionId: number) => {
        // Esta função não é compatível com a estrutura atual de ChecklistCategory
        // ChecklistCategory não possui normativeSections
        console.warn('deleteNormativeSection: Esta função não é compatível com a estrutura atual de ChecklistCategory');
      },

      // Ações para requisitos normativos
      addNormativeRequirement: (_categoryId: number, _sectionId: number, _requirement: Omit<NormativeRequirementInterface, 'id'>) => {
        // Esta função não é compatível com a estrutura atual de ChecklistCategory
        // ChecklistCategory não possui normativeSections
        console.warn('addNormativeRequirement: Esta função não é compatível com a estrutura atual de ChecklistCategory');
      },

      updateNormativeRequirement: (_categoryId: number, _sectionId: number, _requirementId: number, _updates: Partial<Omit<NormativeRequirementInterface, 'id'>>) => {
        // Esta função não é compatível com a estrutura atual de ChecklistCategory
        // ChecklistCategory não possui normativeSections
        console.warn('updateNormativeRequirement: Esta função não é compatível com a estrutura atual de ChecklistCategory');
      },

      deleteNormativeRequirement: (_categoryId: number, _sectionId: number, _requirementId: number) => {
        // Esta função não é compatível com a estrutura atual de ChecklistCategory
        // ChecklistCategory não possui normativeSections
        console.warn('deleteNormativeRequirement: Esta função não é compatível com a estrutura atual de ChecklistCategory');
      },

      // Ações para tags de checklist (usando ChecklistCategory)
      addChecklistTag: (tag: Omit<ChecklistCategory, 'id'>) => {
        const newTag: ChecklistCategory = {
          ...tag,
          id: `tag-${Date.now()}`
        };
        set((state) => ({
          checklistCategories: [...state.checklistCategories, newTag]
        }));
      },

      updateChecklistTag: (id: string, updates: Partial<Omit<ChecklistCategory, 'id'>>) => {
        set((state) => ({
          checklistCategories: state.checklistCategories.map(tag =>
            tag.id === id ? { ...tag, ...updates } : tag
          )
        }));
      },

      deleteChecklistTag: (id: string) => {
        set((state) => ({
          checklistCategories: state.checklistCategories.filter((tag) => tag.id !== id)
        }));
      },

      getChecklistTagById: (id: string) => {
        return get().checklistCategories.find((tag) => tag.id === id);
      },

      // Funções auxiliares para configurações
      getSubprocessesBySector: (sectorName: string) => {
        return get().subprocesses.filter((subprocess) => subprocess.sector === sectorName);
      },

      getProcessesBySector: (sectorName: string) => {
        return get().processes.filter((process) => process.sector === sectorName);
      },

      // Ações para requisitos normativos (sistema antigo)
      addNormativeRequirementOld: (requirement: Omit<NormativeRequirementType, 'id' | 'createdAt' | 'updatedAt'>) => {
        const newRequirement: NormativeRequirementType = {
          ...requirement,
          id: Date.now(),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        set((state) => ({
          normativeRequirements: [...state.normativeRequirements, newRequirement]
        }));
      },

      updateNormativeRequirementOld: (id: number, updates: Partial<NormativeRequirementType>) => {
        set((state) => ({
          normativeRequirements: state.normativeRequirements.map((req) =>
            req.id === id ? { ...req, ...updates, updatedAt: new Date() } : req
          )
        }));
      },

      deleteNormativeRequirementOld: (id: number) => {
        set((state) => ({
          normativeRequirements: state.normativeRequirements.filter((req) => req.id !== id)
        }));
      },

      getNormativeRequirementsByStandard: (standard: string) => {
        return get().normativeRequirements.filter((req) => req.standard === standard);
      },

      addNormativeStandard: (standard: Omit<NormativeStandard, 'id' | 'createdAt' | 'updatedAt'>) => {
        const newStandard: NormativeStandard = {
          ...standard,
          id: generateId(),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        set((state) => ({
          normativeStandards: [...state.normativeStandards, newStandard]
        }));
      },

      updateNormativeStandard: (id: string, updates: Partial<NormativeStandard>) => {
        set((state) => ({
          normativeStandards: state.normativeStandards.map((std) =>
            std.id === id ? { ...std, ...updates, updatedAt: new Date() } : std
          )
        }));
      },

      deleteNormativeStandard: (id: string) => {
        set((state) => ({
          normativeStandards: state.normativeStandards.filter((std) => std.id !== id),
          // Remove requisitos relacionados
          normativeRequirements: state.normativeRequirements.filter((req) => 
            state.normativeStandards.find(s => s.id === id)?.name !== req.standard
          )
        }));
      },

      // Ações para importação de requisitos
      importNormativeRequirements: async (requirements: NormativeRequirementType[], standardName: string, version: string) => {
        try {
          set({ loading: true, error: null });

          // Verificar se a norma já existe
          const existingStandard = get().normativeStandards.find(
            (std) => std.name === standardName && std.version === version
          );

          // Criar norma se não existir
          if (!existingStandard) {
            const newStandard: NormativeStandard = {
              id: generateId(),
              name: standardName,
              version: version,
              description: `Norma ${standardName} versão ${version}`,
              totalRequirements: requirements.length,
              createdAt: new Date(),
              updatedAt: new Date()
            };

            set((state) => ({
              normativeStandards: [...state.normativeStandards, newStandard]
            }));
          } else {
            // Atualizar contagem de requisitos
            set((state) => ({
              normativeStandards: state.normativeStandards.map((std) =>
                std.id === existingStandard.id
                  ? { ...std, totalRequirements: requirements.length, updatedAt: new Date() }
                  : std
              )
            }));
          }

          // Adicionar requisitos
          set((state) => ({
            normativeRequirements: [...state.normativeRequirements, ...requirements],
            loading: false
          }));

        } catch (error) {
          set({ 
            error: 'Erro ao importar requisitos normativos: ' + (error as Error).message,
            loading: false 
          });
          throw error;
        }
      },

      convertRequirementsToChecklist: (requirements: NormativeRequirementType[], checklistName: string, standard: string, version: string, shouldSave: boolean = true) => {
        try {
          const checklistId = generateId();
          
          // Agrupar requisitos por capítulo
          const groupedRequirements = requirements.reduce((acc, req) => {
            if (!acc[req.chapter]) {
              acc[req.chapter] = [];
            }
            acc[req.chapter].push(req);
            return acc;
          }, {} as Record<string, NormativeRequirementType[]>);

          // Criar categorias e itens do checklist
          const categories = Object.entries(groupedRequirements).map(([chapter, reqs], categoryIndex) => ({
            id: `category_${checklistId}_${categoryIndex}`,
            name: chapter,
            title: chapter,
            description: `Requisitos do capítulo: ${chapter}`,
            weight: reqs.reduce((sum, req) => sum + req.weight, 0),
            order: categoryIndex,
            items: reqs.map((req, itemIndex) => ({
              id: `item_${checklistId}_${categoryIndex}_${itemIndex}`,
              title: `${req.requirementCode} - ${req.description ? req.description.substring(0, 100) : 'Sem descrição'}${req.description && req.description.length > 100 ? '...' : ''}`,
              description: req.description || 'Sem descrição',
              weight: req.weight,
              isRequired: true,
              order: itemIndex,
              evidenceRequired: true,
              maxScore: req.weight,
              observations: req.observations
            }))
          }));

          const newChecklist: Checklist = {
            id: checklistId,
            name: checklistName,
            description: `Checklist gerado automaticamente a partir dos requisitos da norma ${standard} versão ${version}`,
            version: '1.0',
            isActive: true,
            category: standard,
            categories,
            totalWeight: categories.reduce((sum, cat) => sum + cat.weight, 0),
            maxScore: categories.reduce((sum, cat) => sum + cat.weight, 0),
            createdBy: 'system',
            tags: [standard, version],
            versions: [],
            createdAt: new Date(),
            updatedAt: new Date()
          };

          // Só adicionar ao store se shouldSave for true
          if (shouldSave) {
            set((state) => ({
              checklists: [...state.checklists, newChecklist]
            }));
            return checklistId;
          }

          // Se não deve salvar, retorna o checklist para preview
          return newChecklist;
        } catch (error) {
          set({ error: 'Erro ao converter requisitos em checklist: ' + (error as Error).message });
          throw error;
        }
      }
    }),
    {
      name: 'auditapro-storage',

      partialize: (state) => ({
        audits: state.audits,
        checklists: state.checklists,
        nonConformities: state.nonConformities,
        evidences: state.evidences,
        resources: state.resources,
        resourceAllocations: state.resourceAllocations,
        reports: state.reports,
        kpis: state.kpis,
        chartData: state.chartData,
        systemConfig: state.systemConfig,
        auditors: state.auditors,
        sectors: state.sectors,
        subprocesses: state.subprocesses,
        processes: state.processes,
        auditTypes: state.auditTypes,
        checklistCategories: state.checklistCategories,
        normativeRequirements: state.normativeRequirements,
        normativeStandards: state.normativeStandards
      })
    }
  )
);

// Exportar o hook do store
export const useAuditStore = useAuditProStore;