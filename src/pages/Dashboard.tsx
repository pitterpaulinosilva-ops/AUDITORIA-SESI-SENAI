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
  Target
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

export function Dashboard() {
  const { updateKPIs, kpis } = useAuditProStore();

  useEffect(() => {
    // Simular carregamento de KPIs
    updateKPIs(mockKPIs);
  }, [updateKPIs]);

  const displayKPIs = kpis.length > 0 ? kpis : mockKPIs;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Visão geral do sistema de auditoria interna</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>Últimos 30 dias</option>
            <option>Últimos 90 dias</option>
            <option>Último ano</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
            Atualizar Dados
          </button>
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayKPIs.map((kpi) => (
          <div key={kpi.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {kpi.category === 'audit' && <BarChart3 className="w-5 h-5 text-blue-600" />}
                {kpi.category === 'quality' && <Target className="w-5 h-5 text-green-600" />}
                {kpi.category === 'compliance' && <AlertTriangle className="w-5 h-5 text-red-600" />}
                {kpi.category === 'efficiency' && <Clock className="w-5 h-5 text-purple-600" />}
                <span className="text-sm font-medium text-gray-600">{kpi.name}</span>
              </div>
              <div className="flex items-center space-x-1">
                {kpi.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-xs font-medium ${
                  kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {Math.abs(kpi.trendPercentage)}%
                </span>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-gray-900">
                  {kpi.value}
                </span>
                <span className="text-sm text-gray-500">{kpi.unit}</span>
                {kpi.target && (
                  <span className="text-sm text-gray-400">
                    / {kpi.target}{kpi.unit}
                  </span>
                )}
              </div>
              
              {kpi.target && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Progresso</span>
                    <span>{Math.round((kpi.value / kpi.target) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        kpi.value >= kpi.target ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${Math.min((kpi.value / kpi.target) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Auditorias por Mês */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Auditorias por Mês</h3>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <span className="text-gray-600">Planejadas</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-gray-600">Concluídas</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span className="text-gray-600">Canceladas</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={auditsByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="planned" fill="#3b82f6" name="Planejadas" />
              <Bar dataKey="completed" fill="#22c55e" name="Concluídas" />
              <Bar dataKey="cancelled" fill="#ef4444" name="Canceladas" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Não Conformidades por Tipo */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Não Conformidades por Tipo</h3>
            <span className="text-sm text-gray-500">Total: 100</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={nonConformitiesByType}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {nonConformitiesByType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {nonConformitiesByType.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600">{item.name}</span>
                <span className="text-sm font-medium text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 gap-6">
        {/* Taxa de Conformidade ao Longo do Tempo */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Taxa de Conformidade</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <span>Meta: 90%</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={complianceOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[80, 95]} />
              <Tooltip formatter={(value) => [`${value}%`, 'Conformidade']} />
              <Area 
                type="monotone" 
                dataKey="compliance" 
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.1}
              />
              <Line 
                type="monotone" 
                dataKey="compliance" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">Nova Auditoria</div>
              <div className="text-sm text-gray-500">Agendar auditoria</div>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">Registrar NC</div>
              <div className="text-sm text-gray-500">Nova não conformidade</div>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">Novo Checklist</div>
              <div className="text-sm text-gray-500">Criar checklist</div>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">Gerar Relatório</div>
              <div className="text-sm text-gray-500">Relatório personalizado</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}