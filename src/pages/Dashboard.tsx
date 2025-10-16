import { useState, useEffect } from 'react';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  ShieldAlert, 
  CheckCircle2, 
  Timer, 
  Users2,
  CalendarCheck,
  FileBarChart,
  Target,
  ClipboardCheck
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
import { AuditStatus, NonConformityStatus, NonConformitySeverity, AuditType, NonConformity } from '../types';
import { MetricCard } from '../components/reports/MetricCard';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

export function Dashboard() {
  const { audits, nonConformities, auditors, sectors } = useAuditProStore();
  

  const [currentMonth] = useState(new Date());

  // Função para filtrar dados do mês atual
  const getCurrentMonthData = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);

    const currentMonthAudits = audits.filter(audit => 
      isWithinInterval(new Date(audit.scheduledDate), { start: monthStart, end: monthEnd })
    );

    const currentMonthNCs = nonConformities.filter(nc => 
      isWithinInterval(new Date(nc.createdAt), { start: monthStart, end: monthEnd })
    );

    return { currentMonthAudits, currentMonthNCs };
  };

  // Calcular KPIs do mês atual
  const calculateKPIs = () => {
    const { currentMonthAudits, currentMonthNCs } = getCurrentMonthData();

    // 1. Auditorias Realizadas no mês
    const auditoriasRealizadas = currentMonthAudits.filter(audit => 
      audit.status === AuditStatus.COMPLETED
    ).length;

    // 2. Taxa de Conformidade média do mês
    const completedAudits = currentMonthAudits.filter(audit => 
      audit.status === AuditStatus.COMPLETED && audit.score !== undefined
    );
    const taxaConformidade = completedAudits.length > 0 
      ? completedAudits.reduce((sum, audit) => sum + (audit.score || 0), 0) / completedAudits.length
      : 0;

    // 3. Não Conformidades encontradas no mês
    const naoConformidades = currentMonthNCs.length;

    // 4. Auditorias Pendentes no mês
    const auditoriasPendentes = currentMonthAudits.filter(audit => 
      audit.status === AuditStatus.PLANNED || audit.status === AuditStatus.IN_PROGRESS
    ).length;

    return {
      auditoriasRealizadas,
      taxaConformidade,
      naoConformidades,
      auditoriasPendentes
    };
  };

  // Dados para gráfico de Auditorias por Mês (últimos 6 meses)
  const getAuditsByMonth = () => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);

      const monthAudits = audits.filter(audit => 
        isWithinInterval(new Date(audit.scheduledDate), { start: monthStart, end: monthEnd })
      );

      const planned = monthAudits.length;
      const completed = monthAudits.filter(a => a.status === AuditStatus.COMPLETED).length;
      const cancelled = monthAudits.filter(a => a.status === AuditStatus.CANCELLED).length;

      months.push({
        month: format(date, 'MMM'),
        planned,
        completed,
        cancelled
      });
    }
    return months;
  };

  // Dados para gráfico de Não Conformidades por Processo/Subprocesso e Setor
  const getNonConformitiesByProcessAndSector = () => {
    const { currentMonthNCs } = getCurrentMonthData();
    const processMap = new Map();

    currentMonthNCs.forEach(nc => {
      const audit = audits.find(a => a.id === nc.auditId);
      if (audit) {
        const key = `${audit.department || 'Não Informado'} - ${nc.category || 'Geral'}`;
        processMap.set(key, (processMap.get(key) || 0) + 1);
      }
    });

    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#6366f1', '#8b5cf6', '#ec4899'];
    return Array.from(processMap.entries()).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length]
    }));
  };

  // Dados para gráfico de Taxa de Conformidade por Tipo de Auditoria
  const getComplianceByAuditType = () => {
    const typeMap = new Map();
    
    audits.filter(audit => audit.status === AuditStatus.COMPLETED && audit.score !== undefined)
      .forEach(audit => {
        const type = audit.type === AuditType.INTERNAL ? 'Interna' : 
                    audit.type === AuditType.EXTERNAL ? 'Externa' : 'Fornecedor';
        
        if (!typeMap.has(type)) {
          typeMap.set(type, { total: 0, sum: 0 });
        }
        
        const data = typeMap.get(type);
        data.total += 1;
        data.sum += audit.score || 0;
      });

    return Array.from(typeMap.entries()).map(([type, data]) => ({
      type,
      compliance: data.total > 0 ? data.sum / data.total : 0
    }));
  };

  // Dados para gráfico de Desempenho por Auditor (linha mensal)
  const getAuditorPerformance = () => {
    const months = [];
    const auditorMap = new Map();

    // Inicializar auditores
    auditors.forEach(auditor => {
      auditorMap.set(auditor.id, {
        name: auditor.name,
        data: []
      });
    });

    // Calcular dados dos últimos 6 meses
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      const monthName = format(date, 'MMM');

      const monthData = { month: monthName };

      auditorMap.forEach((auditorData, auditorId) => {
        const monthAudits = audits.filter(audit => 
          audit.auditorId === auditorId &&
          isWithinInterval(new Date(audit.scheduledDate), { start: monthStart, end: monthEnd })
        );

        const planned = monthAudits.length;
        const completed = monthAudits.filter(a => a.status === AuditStatus.COMPLETED).length;
        const performance = planned > 0 ? (completed / planned) * 100 : 0;

        monthData[auditorData.name] = performance;
      });

      months.push(monthData);
    }

    return months;
  };

  const auditsByMonth = getAuditsByMonth();
  const nonConformitiesByProcess = getNonConformitiesByProcessAndSector();
  const complianceByType = getComplianceByAuditType();
  const auditorPerformance = getAuditorPerformance();

  // Cores para o gráfico de linha dos auditores
  const auditorColors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];



  const [dashboardKPIs, setDashboardKPIs] = useState({
    auditoriasRealizadas: 0,
    taxaConformidade: 0,
    naoConformidades: 0,
    auditoriasPendentes: 0
  });

  useEffect(() => {
    const kpisData = calculateKPIs();
    setDashboardKPIs(kpisData);
  }, [audits, nonConformities, currentMonth]);

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
            <option>Mês atual</option>
            <option>Últimos 3 meses</option>
            <option>Último ano</option>
          </select>
          <button className="btn-primary">
            Exportar Relatório
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <MetricCard
          title="Auditorias Realizadas"
          value={dashboardKPIs.auditoriasRealizadas}
          trend="up"
          trendValue={12.5}
          icon={ClipboardCheck}
          color="blue"
        />
        <MetricCard
          title="Taxa de Conformidade"
          value={dashboardKPIs.taxaConformidade}
          unit="%"
          trend="up"
          trendValue={2.1}
          icon={CheckCircle2}
          color="green"
        />
        <MetricCard
          title="Não Conformidades"
          value={dashboardKPIs.naoConformidades}
          trend="down"
          trendValue={8.3}
          icon={ShieldAlert}
          color="orange"
        />
        <MetricCard
          title="Auditorias Pendentes"
          value={dashboardKPIs.auditoriasPendentes}
          trend="stable"
          trendValue={0}
          icon={Timer}
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
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="planned" fill="#3b82f6" name="Planejadas" />
                <Bar dataKey="completed" fill="#10b981" name="Concluídas" />
                <Bar dataKey="cancelled" fill="#ef4444" name="Canceladas" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Não Conformidades por Processo/Subprocesso e Setor */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">NCs por Processo/Setor</h3>
          </div>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={nonConformitiesByProcess}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {nonConformitiesByProcess.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Taxa de Conformidade por Tipo de Auditoria */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Taxa de Conformidade por Tipo</h3>
          </div>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={complianceByType} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" fontSize={12} />
                <YAxis fontSize={12} domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Taxa de Conformidade']} />
                <Bar dataKey="compliance" fill="#10b981" name="Taxa de Conformidade %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Desempenho por Auditor */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Desempenho por Auditor</h3>
            <p className="text-xs text-gray-500">% Realizadas/Planejadas</p>
          </div>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={auditorPerformance} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Performance']} />
                {auditors.map((auditor, index) => (
                  <Line
                    key={auditor.id}
                    type="monotone"
                    dataKey={auditor.name}
                    stroke={auditorColors[index % auditorColors.length]}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Resumo Executivo */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Resumo Executivo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total de Auditorias</p>
                <p className="text-2xl font-bold text-blue-900">{audits.length}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Taxa de Conclusão</p>
                <p className="text-2xl font-bold text-green-900">
                  {audits.length > 0 ? ((audits.filter(a => a.status === AuditStatus.COMPLETED).length / audits.length) * 100).toFixed(1) : 0}%
                </p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">NCs Abertas</p>
                <p className="text-2xl font-bold text-orange-900">
                  {nonConformities.filter(nc => nc.status !== NonConformityStatus.CLOSED).length}
                </p>
              </div>
              <ShieldAlert className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Seção de Não Conformidades */}

    </div>
  );
}