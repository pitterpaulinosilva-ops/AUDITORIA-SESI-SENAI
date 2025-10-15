import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users,
  Calendar,
  FileText,
  Target,
  FileCheck
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { useAuditProStore } from '../store';
import { AuditStatus, NonConformityStatus, NonConformitySeverity } from '../types';
import { MetricCard } from '../components/reports/MetricCard';

// Dados mock para demonstração
const mockKPIs = [
  {
    id: '1',
    name: 'Auditorias Realizadas',
    value: 24,
    target: 30,
    unit: '',
    trend: 'up' as const,
    trendPercentage: 12,
    category: 'audit' as const,
    period: 'monthly' as const,
    lastUpdated: new Date()
  },
  {
    id: '2',
    name: 'Taxa de Conformidade',
    value: 87.5,
    target: 90,
    unit: '%',
    trend: 'down' as const,
    trendPercentage: -2.3,
    category: 'quality' as const,
    period: 'monthly' as const,
    lastUpdated: new Date()
  },
  {
    id: '3',
    name: 'NCs Abertas',
    value: 15,
    target: 10,
    unit: '',
    trend: 'up' as const,
    trendPercentage: 25,
    category: 'compliance' as const,
    period: 'monthly' as const,
    lastUpdated: new Date()
  },
  {
    id: '4',
    name: 'Tempo Médio de Resolução',
    value: 8.2,
    target: 7,
    unit: 'dias',
    trend: 'down' as const,
    trendPercentage: -5.8,
    category: 'efficiency' as const,
    period: 'monthly' as const,
    lastUpdated: new Date()
  }
];

const auditsByMonth = [
  { month: 'Jan', planned: 8, completed: 7, cancelled: 1 },
  { month: 'Fev', planned: 10, completed: 9, cancelled: 0 },
  { month: 'Mar', planned: 12, completed: 11, cancelled: 1 },
  { month: 'Abr', planned: 9, completed: 8, cancelled: 1 },
  { month: 'Mai', planned: 11, completed: 10, cancelled: 0 },
  { month: 'Jun', planned: 13, completed: 12, cancelled: 1 }
];

const nonConformitiesByType = [
  { name: 'Documentação', value: 35, color: '#ef4444' },
  { name: 'Processo', value: 28, color: '#f97316' },
  { name: 'Treinamento', value: 20, color: '#eab308' },
  { name: 'Equipamento', value: 12, color: '#22c55e' },
  { name: 'Outros', value: 5, color: '#6366f1' }
];

const complianceOverTime = [
  { month: 'Jan', compliance: 85 },
  { month: 'Fev', compliance: 88 },
  { month: 'Mar', compliance: 86 },
  { month: 'Abr', compliance: 89 },
  { month: 'Mai', compliance: 87 },
  { month: 'Jun', compliance: 90 }
];

const auditorPerformance = [
  { 
    name: 'Ana Silva', 
    auditorias: 8, 
    conformidade: 92, 
    tempoMedio: 4.2,
    color: '#3b82f6'
  },
  { 
    name: 'Carlos Santos', 
    auditorias: 6, 
    conformidade: 88, 
    tempoMedio: 3.8,
    color: '#10b981'
  },
  { 
    name: 'Maria Oliveira', 
    auditorias: 10, 
    conformidade: 95, 
    tempoMedio: 4.5,
    color: '#8b5cf6'
  },
  { 
    name: 'João Pereira', 
    auditorias: 7, 
    conformidade: 85, 
    tempoMedio: 5.1,
    color: '#f59e0b'
  },
  { 
    name: 'Fernanda Costa', 
    auditorias: 9, 
    conformidade: 91, 
    tempoMedio: 4.0,
    color: '#ef4444'
  },
  { 
    name: 'Roberto Lima', 
    auditorias: 5, 
    conformidade: 89, 
    tempoMedio: 4.8,
    color: '#06b6d4'
  }
];

export function Dashboard() {
  const { updateKPIs, kpis } = useAuditProStore();

  useEffect(() => {
    // Simular carregamento de KPIs
    updateKPIs(mockKPIs);
  }, [updateKPIs]);

  const displayKPIs = kpis.length > 0 ? kpis : mockKPIs;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600">Visão geral das auditorias e conformidades</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>Últimos 30 dias</option>
            <option>Últimos 90 dias</option>
            <option>Último ano</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
            Exportar Relatório
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <MetricCard
          title="Auditorias Realizadas"
          value={42}
          trend="up"
          trendValue={12.5}
          icon={FileCheck}
          color="blue"
        />
        <MetricCard
          title="Taxa de Conformidade"
          value={87.3}
          unit="%"
          trend="up"
          trendValue={2.1}
          icon={CheckCircle}
          color="green"
        />
        <MetricCard
          title="Não Conformidades"
          value={15}
          trend="down"
          trendValue={8.3}
          icon={AlertTriangle}
          color="orange"
        />
        <MetricCard
          title="Ações Pendentes"
          value={8}
          trend="stable"
          trendValue={0}
          icon={Clock}
          color="red"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Auditorias por Mês */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Auditorias por Mês</h3>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <span>Planejadas</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span>Concluídas</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span>Canceladas</span>
              </div>
            </div>
          </div>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={auditsByMonth} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  fontSize={12}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  fontSize={12}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    fontSize: '12px',
                    padding: '8px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }}
                />
                <Bar dataKey="planned" fill="#3b82f6" name="Planejadas" />
                <Bar dataKey="completed" fill="#22c55e" name="Concluídas" />
                <Bar dataKey="cancelled" fill="#ef4444" name="Canceladas" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Não Conformidades por Tipo */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Não Conformidades por Tipo</h3>
            <span className="text-xs sm:text-sm text-gray-500">Total: 100</span>
          </div>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <Pie
                  data={nonConformitiesByType}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {nonConformitiesByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    fontSize: '12px',
                    padding: '8px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {nonConformitiesByType.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs sm:text-sm text-gray-600 truncate">{item.name}</span>
                <span className="text-xs sm:text-sm font-medium text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {/* Taxa de Conformidade ao Longo do Tempo */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Taxa de Conformidade</h3>
            <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <span>Meta: 90%</span>
            </div>
          </div>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={complianceOverTime} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  fontSize={12}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  domain={[80, 95]} 
                  fontSize={12}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Conformidade']} 
                  contentStyle={{ 
                    fontSize: '12px',
                    padding: '8px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="compliance" 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Desempenho por Auditor */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Desempenho por Auditor</h3>
            <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
              <span>Mês atual</span>
            </div>
          </div>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={auditorPerformance} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  fontSize={12}
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  fontSize={12}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'auditorias') return [`${value}`, 'Auditorias'];
                    if (name === 'conformidade') return [`${value}%`, 'Conformidade'];
                    if (name === 'tempoMedio') return [`${value}h`, 'Tempo Médio'];
                    return [value, name];
                  }}
                  labelFormatter={(label) => `Auditor: ${label}`}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                          <p className="font-semibold text-gray-900 mb-2">{label}</p>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Auditorias:</span> {data.auditorias}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Conformidade:</span> {data.conformidade}%
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Tempo Médio:</span> {data.tempoMedio}h
                            </p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="auditorias" 
                  radius={[4, 4, 0, 0]}
                >
                  {auditorPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {auditorPerformance.map((auditor, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: auditor.color }}
                />
                <span className="text-xs sm:text-sm text-gray-600 truncate">{auditor.name}</span>
                <span className="text-xs sm:text-sm font-medium text-gray-900">{auditor.conformidade}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}