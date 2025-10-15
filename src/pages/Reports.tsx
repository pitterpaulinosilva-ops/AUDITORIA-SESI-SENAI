import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  FileText, 
  AlertTriangle, 
  TrendingUp, 
  Settings, 
  Calendar 
} from 'lucide-react';

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/reports',
    icon: BarChart3,
    description: 'Visão geral e KPIs principais'
  },
  {
    name: 'Auditorias',
    href: '/reports/audits',
    icon: FileText,
    description: 'Relatórios detalhados de auditorias'
  },
  {
    name: 'Não Conformidades',
    href: '/reports/non-conformities',
    icon: AlertTriangle,
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
    icon: Settings,
    description: 'Relatórios personalizados'
  },
  {
    name: 'Agendamentos',
    href: '/reports/schedule',
    icon: Calendar,
    description: 'Configurar envios automáticos'
  }
];

const quickStats = [
  { label: 'Relatórios Gerados', value: 247 },
  { label: 'Exportações', value: 89 },
  { label: 'Agendamentos', value: 12 }
];

export function Reports() {
  const navigate = useNavigate();

  const handleCardClick = (href: string) => {
    navigate(href);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <BarChart3 className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Módulo de Relatórios</h1>
          </div>
          <p className="text-gray-600">Análises e insights do sistema de auditoria</p>
        </div>

        {/* Navigation Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.name}
                onClick={() => handleCardClick(item.href)}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <Icon className="h-6 w-6 text-blue-600 group-hover:text-blue-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Statistics Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Estatísticas Rápidas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {quickStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}