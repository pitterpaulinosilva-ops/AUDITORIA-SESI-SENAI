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
        "fixed left-0 top-0 z-50 h-full bg-white border-r border-gray-200/60 transition-all duration-300 shadow-lg",
        sidebarOpen ? "w-64" : "w-16"
      )}>
        {/* Header */}
        <div className={cn(
          "flex items-center border-b border-gray-200/60 bg-gradient-to-r from-blue-50 to-blue-100/50 transition-all duration-300",
          sidebarOpen ? "justify-between p-4" : "justify-center p-3"
        )}>
          {sidebarOpen ? (
            <>
              <div className="flex items-center space-x-3 transition-opacity duration-300 opacity-100">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md">
                  <Home className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">AuditPro</h1>
                  <p className="text-xs text-blue-600 font-medium">Sistema de Auditoria</p>
                </div>
              </div>
              
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-xl hover:bg-white/60 transition-all duration-200 hover:shadow-sm group"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors duration-200" />
              </button>
            </>
          ) : (
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-xl hover:bg-white/60 transition-all duration-200 hover:shadow-sm group"
              title="Expandir menu"
            >
              <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors duration-200" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className={cn(
          "space-y-2 transition-all duration-300",
          sidebarOpen ? "p-4" : "p-2"
        )}>
          {navigationItems.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            const Icon = item.icon;
            
            return (
              <div key={item.name} className="relative group">
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center rounded-xl transition-all duration-200 group hover:scale-105 active:scale-95 relative",
                    sidebarOpen 
                      ? "space-x-3 px-4 py-3" 
                      : "justify-center p-3 mx-1",
                    isActive 
                      ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200 shadow-sm" 
                      : "text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900 hover:shadow-sm"
                  )}
                >
                  <div className={cn(
                    "rounded-lg transition-all duration-200 flex items-center justify-center",
                    sidebarOpen ? "p-1.5" : "p-2",
                    isActive 
                      ? "bg-blue-100 shadow-sm" 
                      : "bg-gray-100 group-hover:bg-white group-hover:shadow-sm"
                  )}>
                    <Icon className={cn(
                      "w-5 h-5 flex-shrink-0 transition-colors duration-200",
                      isActive ? "text-blue-600" : "text-gray-500 group-hover:text-gray-700"
                    )} />
                  </div>
                  
                  {sidebarOpen && (
                    <div className="transition-opacity duration-300 min-w-0 opacity-100">
                      <div className="font-bold text-sm truncate">
                        {item.name}
                      </div>
                      <div className={cn(
                        "text-xs truncate transition-colors duration-200",
                        isActive ? "text-blue-600" : "text-gray-500"
                      )}>
                        {item.description}
                      </div>
                    </div>
                  )}
                </Link>
                
                {/* Tooltip para estado retraído */}
                {!sidebarOpen && (
                  <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-gray-300">{item.description}</div>
                    <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        {sidebarOpen && (
          <div className="absolute bottom-4 left-4 right-4 transition-opacity duration-300 opacity-100">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="text-xs text-gray-600">
                <div className="font-bold text-gray-800">Sistema AuditPro</div>
                <div className="text-gray-500 font-medium">Versão 1.0.0</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}