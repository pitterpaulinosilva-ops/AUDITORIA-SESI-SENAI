import { Link, useLocation } from 'react-router-dom';
import { 
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
import { cn } from '../lib/utils';

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: BarChart3,
    description: 'Visão geral e KPIs'
  },
  {
    name: 'Auditorias',
    href: '/audits',
    icon: ClipboardList,
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
    description: 'Calendário e recursos'
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
      {/* Sidebar Desktop */}
      <div className={cn(
        "fixed left-0 top-0 z-50 h-full bg-white border-r border-gray-200 transition-all duration-300",
        sidebarOpen ? "w-64" : "w-16"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className={cn(
            "flex items-center space-x-3 transition-opacity duration-300",
            sidebarOpen ? "opacity-100" : "opacity-0"
          )}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">AuditPro</h1>
              <p className="text-xs text-gray-500">Sistema de Auditoria</p>
            </div>
          </div>
          
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {sidebarOpen ? (
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                  isActive 
                    ? "bg-blue-50 text-blue-700 border border-blue-200" 
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon className={cn(
                  "w-5 h-5 flex-shrink-0",
                  isActive ? "text-blue-600" : "text-gray-500 group-hover:text-gray-700"
                )} />
                
                <div className={cn(
                  "transition-opacity duration-300 min-w-0",
                  sidebarOpen ? "opacity-100" : "opacity-0"
                )}>
                  <div className="font-medium text-sm truncate">
                    {item.name}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {item.description}
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={cn(
          "absolute bottom-4 left-4 right-4 transition-opacity duration-300",
          sidebarOpen ? "opacity-100" : "opacity-0"
        )}>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-600">
              <div className="font-medium">Sistema AuditPro</div>
              <div>Versão 1.0.0</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 lg:hidden",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">AuditPro</h1>
              <p className="text-xs text-gray-500">Sistema de Auditoria</p>
            </div>
          </div>
          
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={toggleSidebar}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                  isActive 
                    ? "bg-blue-50 text-blue-700 border border-blue-200" 
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon className={cn(
                  "w-5 h-5 flex-shrink-0",
                  isActive ? "text-blue-600" : "text-gray-500"
                )} />
                
                <div className="min-w-0">
                  <div className="font-medium text-sm truncate">
                    {item.name}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {item.description}
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}