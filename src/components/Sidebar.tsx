import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  ClipboardCheck, 
  CheckSquare, 
  AlertCircle, 
  CalendarDays, 
  BarChart2, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuditProStore } from '../store';

const navigationItems = [
  { 
    name: 'Dashboard', 
    href: '/', 
    icon: LayoutDashboard,
    description: 'Visão geral e KPIs',
    color: 'blue'
  },
  { 
    name: 'Auditorias', 
    href: '/audits', 
    icon: ClipboardCheck,
    description: 'Gestão de auditorias',
    color: 'emerald'
  },
  { 
    name: 'Checklists', 
    href: '/checklists', 
    icon: CheckSquare,
    description: 'Editor de checklists',
    color: 'purple'
  },
  { 
    name: 'Não Conformidades', 
    href: '/non-conformities', 
    icon: AlertCircle,
    description: 'Gestão de NCs',
    color: 'orange'
  },
  { 
    name: 'Planejamento', 
    href: '/planning', 
    icon: CalendarDays,
    description: 'Calendário e eventos',
    color: 'indigo'
  },
  { 
    name: 'Relatórios', 
    href: '/reports', 
    icon: BarChart2,
    description: 'Geração de relatórios',
    color: 'teal'
  },
  { 
    name: 'Configurações', 
    href: '/settings', 
    icon: Settings,
    description: 'Configurações do sistema',
    color: 'gray'
  }
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { sidebarOpen, toggleSidebar } = useAuditProStore();

  // Função para navegar e fechar a sidebar automaticamente
  const handleNavigation = (href: string) => {
    navigate(href);
    toggleSidebar(); // Fecha a sidebar após a navegação
  };

  return (
    <>
      {/* Sidebar - Unified for all devices */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 z-50
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden bg-white shadow-sm border border-gray-100">
              <img 
                src="/logo.png" 
                alt="AuditPro Logo" 
                className="w-6 h-6 object-contain"
              />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">AuditPro</h1>
              <p className="text-xs text-gray-500">Sistema de Auditoria</p>
            </div>
          </div>
          
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            
            // Função para obter as classes de cor baseadas no estado e cor do item (mobile)
            const getColorClasses = () => {
              if (isActive) {
                switch (item.color) {
                  case 'blue': return 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200 shadow-sm';
                  case 'emerald': return 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 border border-emerald-200 shadow-sm';
                  case 'purple': return 'bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border border-purple-200 shadow-sm';
                  case 'orange': return 'bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 border border-orange-200 shadow-sm';
                  case 'indigo': return 'bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-700 border border-indigo-200 shadow-sm';
                  case 'teal': return 'bg-gradient-to-r from-teal-50 to-teal-100 text-teal-700 border border-teal-200 shadow-sm';
                  case 'gray': return 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border border-gray-200 shadow-sm';
                  default: return 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200 shadow-sm';
                }
              }
              return 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm';
            };

            const getIconColorClasses = () => {
              if (isActive) {
                switch (item.color) {
                  case 'blue': return 'text-blue-600';
                  case 'emerald': return 'text-emerald-600';
                  case 'purple': return 'text-purple-600';
                  case 'orange': return 'text-orange-600';
                  case 'indigo': return 'text-indigo-600';
                  case 'teal': return 'text-teal-600';
                  case 'gray': return 'text-gray-600';
                  default: return 'text-blue-600';
                }
              } else {
                // Cores suaves para ícones inativos
                switch (item.color) {
                  case 'blue': return 'text-blue-500 hover:text-blue-600';
                  case 'emerald': return 'text-emerald-500 hover:text-emerald-600';
                  case 'purple': return 'text-purple-500 hover:text-purple-600';
                  case 'orange': return 'text-orange-500 hover:text-orange-600';
                  case 'indigo': return 'text-indigo-500 hover:text-indigo-600';
                  case 'teal': return 'text-teal-500 hover:text-teal-600';
                  case 'gray': return 'text-gray-500 hover:text-gray-600';
                  default: return 'text-blue-500 hover:text-blue-600';
                }
              }
            };
            
            return (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href)}
                className={`
                  flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-300 w-full text-left
                  ${getColorClasses()}
                `}
              >
                <Icon className={`w-5.5 h-5.5 ${getIconColorClasses()} transition-all duration-300`} />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{item.name}</div>
                  <div className="text-xs text-gray-500 truncate">{item.description}</div>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            <div className="font-medium">AuditPro v1.0</div>
            <div>Sistema de Auditoria</div>
          </div>
        </div>
      </div>
    </>
  );
}