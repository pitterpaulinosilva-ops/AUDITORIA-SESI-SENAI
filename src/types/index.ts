// Tipos principais do sistema AuditPro
// Baseado na documentação técnica

// Enums para status e tipos
export enum AuditStatus {
  PLANNED = 'planned',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum AuditType {
  INTERNAL = 'interna',
  EXTERNAL = 'externa',
  SUPPLIER = 'fornecedor'
}

export type AuditTypeValue = 'interna' | 'externa' | 'fornecedor';

export enum NonConformityStatus {
  OPEN = 'nc_open',
  IN_TREATMENT = 'nc_in_treatment',
  IN_PROGRESS = 'nc_in_progress',
  CLOSED = 'nc_closed',
  RESOLVED = 'nc_resolved',
  CANCELLED = 'nc_cancelled'
}

export enum NonConformitySeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum UserRole {
  ADMIN = 'admin',
  AUDITOR = 'auditor',
  AUDITEE = 'auditee',
  MANAGER = 'manager'
}

export enum EvidenceType {
  PHOTO = 'photo',
  DOCUMENT = 'document',
  VIDEO = 'video',
  AUDIO = 'audio',
  NOTE = 'note'
}

// Interface base para entidades com ID
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Interface para usuário (opcional para futuras implementações)
export interface User extends BaseEntity {
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  phone?: string;
  avatar?: string;
  isActive: boolean;
}

// Enum para status de execução em relação ao prazo
export enum ExecutionTimingStatus {
  ON_TIME = 'on_time',
  EARLY = 'early',
  LATE = 'late'
}

// Interface para notas de execução
export interface ExecutionNote {
  status: ExecutionTimingStatus;
  executedAt: Date;
  scheduledDate: Date;
  note: string;
}

// Interface para auditoria
export interface Audit extends BaseEntity {
  title: string;
  description: string;
  type: AuditType | AuditTypeValue | string;
  status: AuditStatus;
  plannedStartDate?: Date; // Opcional para compatibilidade
  plannedEndDate?: Date; // Opcional para compatibilidade
  actualStartDate?: Date;
  actualEndDate?: Date;
  auditorId: string;
  auditor?: string; // Opcional para compatibilidade
  auditee?: string; // Opcional para compatibilidade
  auditeeIds?: string[]; // Opcional para compatibilidade
  auditeeId?: string; // Para compatibilidade com código existente
  checklistId?: string; // Para compatibilidade com store
  department?: string; // Opcional para compatibilidade
  sector?: string; // Setor da auditoria - opcional
  location?: string; // Para compatibilidade com store
  scheduledDate?: Date; // Para compatibilidade com store
  completedDate?: Date; // Data de conclusão
  objectives?: string[]; // Opcional para compatibilidade
  scope?: string; // Opcional para compatibilidade
  criteria?: string[]; // Opcional para compatibilidade
  score?: number; // Para compatibilidade com store
  maxScore?: number; // Para compatibilidade com store
  duration?: number; // Duração em horas
  findings?: string; // Achados da auditoria
  nonConformities: NonConformity[] | string[]; // Permite array de strings para compatibilidade
  evidences: Evidence[] | string[]; // Permite array de strings para compatibilidade
  observations?: string;
  recommendations?: string[] | string; // Permite string ou array de strings
  reportGenerated?: boolean; // Para compatibilidade com store
  reportPath?: string;
  executionNote?: ExecutionNote; // Nota sobre execução em relação ao prazo
  estimatedDuration?: number; // Duração estimada para compatibilidade
  // Campos para histórico de cancelamento
  cancellationReason?: string; // Motivo do cancelamento
  cancellationDate?: string; // Data do cancelamento
  cancellationTime?: string; // Hora do cancelamento
  cancelledBy?: string; // Usuário que cancelou
}

// Interface para categoria de checklist
export interface ChecklistCategory {
  id: string;
  title: string;
  description?: string;
  weight: number;
  order: number;
  items: ChecklistItem[];
  isCollapsed?: boolean;
}

// Interface para item de checklist
export interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  weight: number;
  isRequired: boolean;
  order: number;
  criteria?: string[];
  evidenceRequired: boolean;
  maxScore: number;
  actualScore?: number;
  status?: 'pending' | 'compliant' | 'non_compliant' | 'not_applicable';
  observations?: string;
  evidences?: Evidence[];
}

// Interface para versão de checklist
export interface ChecklistVersion {
  id: string;
  checklistId: string;
  version: string;
  changes: string[];
  createdBy: string;
  createdAt: Date;
  isActive: boolean;
  description?: string;
  snapshot: Omit<Checklist, 'id' | 'createdAt' | 'updatedAt' | 'versions'>;
}

// Interface para checklist
export interface Checklist extends BaseEntity {
  name: string;
  description: string;
  version: string;
  isActive: boolean;
  category: string;
  categories: ChecklistCategory[];
  totalWeight: number;
  maxScore: number;
  createdBy: string;
  approvedBy?: string;
  approvedAt?: Date;
  tags: string[];
  versions: ChecklistVersion[];
  parentId?: string; // Para duplicação
}

// Interfaces para configurações do sistema
export interface Auditor {
  id: number;
  name: string;
  email: string;
  leader: boolean;
  role: string; // "Auditor Líder" ou "Auditor"
}

export interface Sector {
  id: number;
  name: string;
}

export interface Subprocess {
  id: number;
  name: string;
  sector: string; // Nome do setor (referência por string)
}

export interface Process {
  id: number;
  name: string;
  sector: string; // Nome do setor (referência por string)
}

export interface AuditTypeConfig {
  id: number;
  name: string;
  description: string;
}

// Interface para não conformidade
export interface NonConformity extends BaseEntity {
  auditId: string;
  checklistItemId?: string;
  title: string;
  description: string;
  severity: NonConformitySeverity;
  status: NonConformityStatus;
  category: string;
  location: string;
  identifiedBy: string;
  identifiedAt?: Date; // Data de identificação para compatibilidade
  responsibleId?: string;
  dueDate?: Date;
  rootCause?: string;
  correctiveActions: CorrectiveAction[];
  evidences: Evidence[] | string[]; // Permite array de strings para compatibilidade
  impact: string;
  riskLevel: string;
  cost?: number;
  closedAt?: Date;
  closedBy?: string;
  verificationRequired?: boolean;
  verifiedAt?: Date;
  verifiedBy?: string;
  isPatientRelated?: boolean; // Para compatibilidade com código existente
}

// Enums para ação corretiva
export enum CorrectiveActionStatus {
  PLANNED = 'planned',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  OVERDUE = 'overdue'
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Interface para ação corretiva
export interface CorrectiveAction {
  id: string;
  nonConformityId: string;
  description: string;
  responsibleId: string;
  dueDate: Date;
  status: CorrectiveActionStatus | NonConformityStatus; // Permite ambos os tipos para compatibilidade
  priority?: Priority; // Opcional para compatibilidade
  cost?: number;
  completedAt?: Date;
  verificationRequired?: boolean; // Opcional para compatibilidade
  verifiedAt?: Date;
  verifiedBy?: string;
  effectiveness?: string;
  evidences?: Evidence[]; // Opcional para compatibilidade
  createdAt?: Date; // Para compatibilidade com código existente
  updatedAt?: Date; // Para compatibilidade com código existente
}

// Interface para evidência
export interface Evidence extends BaseEntity {
  auditId?: string;
  nonConformityId?: string;
  checklistItemId?: string;
  type: EvidenceType;
  title: string;
  description?: string;
  filePath?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  thumbnailPath?: string;
  capturedBy: string;
  capturedAt?: Date; // Data de captura para compatibilidade
  location?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  tags: string[];
  isCompressed?: boolean;
  originalSize?: number;
  compressedSize?: number;
  url?: string; // URL para compatibilidade com código existente
  content?: string; // Conteúdo para evidências do tipo nota
}

// Interface para planejamento de recursos
export interface Resource {
  id: string;
  name: string;
  type: 'auditor' | 'equipment' | 'room' | 'vehicle';
  availability: ResourceAvailability[];
  skills?: string[];
  department?: string;
  cost?: number;
  isActive: boolean;
}

export interface ResourceAvailability {
  date: Date;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  reason?: string;
}

export interface ResourceAllocation {
  id: string;
  auditId: string;
  resourceId: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  role?: string;
  notes?: string;
}

// Interface para relatórios
export interface Report extends BaseEntity {
  auditId: string;
  type: 'audit_report' | 'non_conformity_report' | 'dashboard_report';
  title: string;
  template: string;
  format: 'pdf' | 'excel' | 'word';
  filePath: string;
  generatedBy: string;
  parameters: Record<string, unknown>;
  size: number;
}

// Interface para KPIs do dashboard
export interface KPI {
  id: string;
  name: string;
  value: number;
  target?: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
  category: 'audit' | 'quality' | 'compliance' | 'efficiency';
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  lastUpdated: Date;
}

// Interface para dados de gráficos
export interface ChartData {
  id: string;
  type: 'pie' | 'bar' | 'line' | 'heatmap' | 'area';
  title: string;
  data: Record<string, unknown>[];
  config: Record<string, unknown>;
  period: string;
  lastUpdated: Date;
}

// Interface para configurações do sistema
export interface SystemConfig {
  companyName: string;
  logo?: string;
  theme: 'light' | 'dark' | 'auto';
  language: 'pt-BR' | 'en-US' | 'es-ES';
  timezone: string;
  dateFormat: string;
  currency: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  auditSettings: {
    autoScore: boolean;
    requireEvidence: boolean;
    allowPartialCompletion: boolean;
    defaultDuration: number;
  };
  reportSettings: {
    defaultTemplate: string;
    includePhotos: boolean;
    watermark: boolean;
    digitalSignature: boolean;
  };
}

// Tipos para formulários
export interface AuditFormData {
  title: string;
  description: string;
  type: AuditType;
  plannedStartDate: string;
  plannedEndDate: string;
  auditorId: string;
  auditeeIds: string[];
  checklistId: string;
  department: string;
  location: string;
  objectives: string[];
  scope: string;
  criteria: string[];
}

export interface NonConformityFormData {
  title: string;
  description: string;
  severity: NonConformitySeverity;
  category: string;
  location: string;
  responsibleId?: string;
  dueDate?: string;
  rootCause?: string;
  impact: string;
  riskLevel: string;
  cost?: number;
}

export interface ChecklistFormData {
  name: string;
  description: string;
  category: string;
  tags: string[];
  categories: ChecklistCategoryFormData[];
}

export interface ChecklistCategoryFormData {
  id?: string;
  title: string;
  description?: string;
  weight: number;
  items: ChecklistItemFormData[];
  order?: number;
}

export interface ChecklistItemFormData {
  id?: string;
  title: string;
  description?: string;
  weight: number;
  isRequired: boolean;
  criteria?: string[];
  evidenceRequired: boolean;
  maxScore: number;
  order?: number;
}

// Tipos para filtros e pesquisa
export interface AuditFilters {
  status?: AuditStatus[];
  type?: AuditType[];
  auditor?: string[];
  department?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  score?: {
    min: number;
    max: number;
  };
}

export interface NonConformityFilters {
  status?: NonConformityStatus[];
  severity?: NonConformitySeverity[];
  responsible?: string[];
  category?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

// Tipos para paginação
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Tipos específicos para o Módulo de Relatórios
export interface ReportConfig extends BaseEntity {
  name: string;
  type: 'audit' | 'non-conformity' | 'performance' | 'custom';
  description: string;
  filters: ReportFilter[];
  charts: ChartConfig[];
}

// Novos tipos para relatórios específicos de auditoria
export interface AuditReportFilters {
  periodStart: Date;
  periodEnd: Date;
  auditType: AuditTypeValue | 'all';
  auditorName: string;
  auditedSector: string;
  auditedProcess: string;
  auditedSubprocess: string;
}

export interface AuditReportData {
  id: string;
  title: string;
  type: AuditTypeValue;
  auditor: string;
  sector: string;
  process: string;
  subprocess: string;
  startDate: Date;
  endDate: Date;
  status: AuditStatus;
  score?: number;
  maxScore?: number;
  nonConformitiesCount: number;
  observations?: string;
  recommendations?: string[];
}

export interface ReportExportOptions {
  format: 'pdf' | 'excel';
  includeCharts: boolean;
  includeDetails: boolean;
  fileName?: string;
  template?: string;
}

export interface ReportFilter {
  id: string;
  field: string;
  operator: 'equals' | 'contains' | 'greater' | 'less' | 'between' | 'in';
  value: string | number | Date | [Date, Date] | string[];
  label: string;
}

export interface ChartConfig {
  id: string;
  type: 'bar' | 'line' | 'pie' | 'doughnut' | 'radar' | 'area' | 'heatmap';
  title: string;
  dataSource: string;
  xAxis: string;
  yAxis: string;
  options: ChartOptions;
}

export interface ChartOptions {
  responsive: boolean;
  maintainAspectRatio: boolean;
  plugins?: {
    legend?: {
      display: boolean;
      position?: 'top' | 'bottom' | 'left' | 'right';
    };
    tooltip?: {
      enabled: boolean;
    };
  };
  scales?: {
    x?: {
      display: boolean;
      title?: {
        display: boolean;
        text: string;
      };
    };
    y?: {
      display: boolean;
      title?: {
        display: boolean;
        text: string;
      };
    };
  };
}

export interface ReportSchedule extends BaseEntity {
  reportId: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  recipients: string[];
  format: 'pdf' | 'excel' | 'csv';
  isActive: boolean;
  nextRun: Date;
  lastRun?: Date;
  createdBy: string;
}

export interface DashboardMetrics {
  audits: {
    total: number;
    completed: number;
    pending: number;
    overdue: number;
    completionRate: number;
    averageScore: number;
  };
  nonConformities: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    resolved: number;
    resolutionRate: number;
    averageResolutionTime: number;
  };
  performance: {
    averageAuditTime: number;
    auditorsProductivity: AuditorMetric[];
    departmentCompliance: DepartmentMetric[];
    trendsData: TrendData[];
  };
}

export interface AuditorMetric {
  auditorId: string;
  auditorName: string;
  totalAudits: number;
  completedAudits: number;
  averageTime: number;
  averageScore: number;
  complianceRate: number;
  efficiency: number;
  nonConformitiesFound: number;
}

export interface DepartmentMetric {
  department: string;
  totalAudits: number;
  completedAudits: number;
  averageScore: number;
  complianceRate: number;
  nonConformitiesCount: number;
  improvementTrend: 'up' | 'down' | 'stable';
}

export interface TrendData {
  period: string;
  date: Date;
  auditsCompleted: number;
  averageScore: number;
  nonConformitiesCount: number;
  complianceRate: number;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv';
  includeCharts: boolean;
  includeRawData: boolean;
  fileName?: string;
}

export interface AlertConfig {
  id: string;
  type: 'critical_nc' | 'overdue_audit' | 'low_compliance' | 'performance_drop';
  threshold: number;
  isActive: boolean;
  recipients: string[];
  message: string;
}

export interface CustomReportBuilder {
  selectedFields: string[];
  groupBy: string[];
  aggregations: {
    field: string;
    function: 'count' | 'sum' | 'avg' | 'min' | 'max';
  }[];
  filters: ReportFilter[];
  sorting: {
    field: string;
    direction: 'asc' | 'desc';
  }[];
}

// Interface para componentes de gráfico
export interface TrendChartProps {
  title: string;
  data: Record<string, unknown>; // Permite qualquer tipo de dados para compatibilidade com Chart.js
  height?: number;
  type?: 'line' | 'bar' | 'area';
}

// Tipos para localStorage
export interface LocalStorageSchema {
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
  reportConfigs: ReportConfig[];
  reportSchedules: ReportSchedule[];
  lastSync: Date;
}