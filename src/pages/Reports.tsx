import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, 
  FileBarChart, 
  ShieldAlert, 
  TrendingUp, 
  Settings2, 
  CalendarCheck 
} from 'lucide-react';

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/reports',
    icon: Activity,
    description: 'Visão geral e KPIs principais'
  },
  {
    name: 'Auditorias',
    href: '/reports/audits',
    icon: FileBarChart,
    description: 'Relatórios detalhados de auditorias'
  },
  {
    name: 'Não Conformidades',
    href: '/reports/non-conformities',
    icon: ShieldAlert,
    description: 'Análise de não conformidades'
  },
  {
    name: 'Performance',
    href: '/reports/performance',
    icon: TrendingUp,
    description: 'Métricas de produtividade'
  },
  {
    name: 'Customizados',
    href: '/reports/custom',
    icon: Settings2,
    description: 'Relatórios personalizados'
  },
  {
    name: 'Agendamentos',
    href: '/reports/schedule',
    icon: CalendarCheck,
    description: 'Configurar envios automáticos'
  }
];

const quickStats = [
  { label: 'Relatórios Gerados', value: 247 },
  { label: 'Exportações', value: 89 },
  { label: 'Agendamentos', value: 12 }
];

const Reports: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Relatórios e Analytics
        </h1>
        <p className="text-gray-600">
          Acesse relatórios detalhados e análises de performance do sistema de auditoria
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <div
              key={item.name}
              onClick={() => navigate(item.href)}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group hover:border-primary-300"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 bg-primary-100 rounded-lg group-hover:bg-primary-200 transition-colors">
                  <IconComponent className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="ml-4 text-lg font-semibold text-gray-900 group-hover:text-primary-700">
                  {item.name}
                </h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Seção de estatísticas rápidas */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Auditorias</p>
              <p className="text-2xl font-bold text-gray-900">127</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileBarChart className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600 font-medium">+12%</span>
            <span className="text-sm text-gray-600 ml-1">vs mês anterior</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Não Conformidades</p>
              <p className="text-2xl font-bold text-gray-900">23</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <ShieldAlert className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-red-600 font-medium">-8%</span>
            <span className="text-sm text-gray-600 ml-1">vs mês anterior</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taxa de Conformidade</p>
              <p className="text-2xl font-bold text-gray-900">94.2%</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600 font-medium">+3.1%</span>
            <span className="text-sm text-gray-600 ml-1">vs mês anterior</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tempo Médio</p>
              <p className="text-2xl font-bold text-gray-900">2.4h</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Activity className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600 font-medium">-15min</span>
            <span className="text-sm text-gray-600 ml-1">vs mês anterior</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;