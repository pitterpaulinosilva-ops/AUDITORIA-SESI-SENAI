import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  BarChart3, 
  ClipboardList, 
  CheckSquare, 
  AlertTriangle, 
  Calendar, 
  FileText, 
  Settings,
  Home,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuditProStore } from '../store';

const navigationItems = [
  { 
    name: 'Dashboard', 
    href: '/', 
    icon: Home,
    description: 'Visão geral e KPIs'
  },
  { 
    name: 'Auditorias', 
    href: '/audits', 
    icon: BarChart3,
    description: 'Gestão de auditorias'
  },
  { 
    name: 'Checklists', 
    href: '/checklists', 
    icon: CheckSquare,
    description: 'Editor de checklists'
  },
  { 
    name: 'Não Conformidades', 
    href: '/non-conformities', 
    icon: AlertTriangle,
    description: 'Gestão de NCs'
  },
  { 
    name: 'Planejamento', 
    href: '/planning', 
    icon: Calendar,
    description: 'Calendário e eventos'
  },
  { 
    name: 'Relatórios', 
    href: '/reports', 
    icon: FileText,
    description: 'Geração de relatórios'
  },
  { 
    name: 'Configurações', 
    href: '/settings', 
    icon: Settings,
    description: 'Configurações do sistema'
  }
];

export function Sidebar() {
  const location = useLocation();
  const { sidebarOpen, toggleSidebar } = useAuditProStore();

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`
        ${sidebarOpen ? 'w-64' : 'w-16'} 
        bg-white border-r border-gray-200 transition-all duration-300 
        hidden lg:flex lg:flex-col
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className={`flex items-center space-x-3 ${!sidebarOpen && 'justify-center'}`}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="text-lg font-semibold text-gray-900">AuditPro</h1>
                <p className="text-xs text-gray-500">Sistema de Auditoria</p>
              </div>
            )}
          </div>
          
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {sidebarOpen ? (
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            
            return (
              <a
                key={item.name}
                href={item.href}
                className={`
                  flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative
                  ${isActive 
                    ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }
                  ${!sidebarOpen && 'justify-center'}
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500'} group-hover:text-gray-700`} />
                {sidebarOpen && (
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{item.name}</div>
                    <div className="text-xs text-gray-500 truncate">{item.description}</div>
                  </div>
                )}
                
                {/* Tooltip para sidebar colapsada */}
                {!sidebarOpen && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </a>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className={`text-xs text-gray-500 ${!sidebarOpen && 'text-center'}`}>
            {sidebarOpen ? (
              <div>
                <div className="font-medium">AuditPro v1.0</div>
                <div>Sistema de Auditoria</div>
              </div>
            ) : (
              <div className="font-medium">v1.0</div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 z-50 lg:hidden
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
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
            
            return (
              <a
                key={item.name}
                href={item.href}
                onClick={toggleSidebar}
                className={`
                  flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{item.name}</div>
                  <div className="text-xs text-gray-500 truncate">{item.description}</div>
                </div>
              </a>
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