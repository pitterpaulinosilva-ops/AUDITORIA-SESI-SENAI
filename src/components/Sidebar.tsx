import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Gauge, 
  Shield, 
  ListChecks, 
  AlertOctagon, 
  Calendar, 
  BarChart3, 
  Cog,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuditProStore } from '../store';

const navigationItems = [
  { 
    name: 'Dashboard', 
    href: '/', 
    icon: Gauge,
    description: 'Visão geral e KPIs',
    color: 'primary'
  },
  { 
    name: 'Auditorias', 
    href: '/audits', 
    icon: Shield,
    description: 'Gestão de auditorias',
    color: 'success'
  },
  { 
    name: 'Checklists', 
    href: '/checklists', 
    icon: ListChecks,
    description: 'Editor de checklists',
    color: 'secondary'
  },
  { 
    name: 'Não Conformidades', 
    href: '/non-conformities', 
    icon: AlertOctagon,
    description: 'Gestão de NCs',
    color: 'warning'
  },
  { 
    name: 'Execução de Auditoria', 
    href: '/planning', 
    icon: Calendar,
    description: 'Execução de auditorias',
    color: 'info'
  },
  { 
    name: 'Relatórios', 
    href: '/reports', 
    icon: BarChart3,
    description: 'Geração de relatórios',
    color: 'accent'
  },
  { 
    name: 'Configurações', 
    href: '/settings', 
    icon: Cog,
    description: 'Configurações do sistema',
    color: 'neutral'
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
        fixed top-0 left-0 h-full w-72 bg-theme-primary backdrop-blur-md border-r border-theme-primary transform transition-all duration-300 z-50 shadow-theme-xl flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-theme-primary bg-theme-secondary flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden bg-gradient-to-r from-primary-600 to-primary-700 shadow-glow-primary">
              <img
                src="/sesi-senai-logo.png"
                alt="SESI/SENAI Logo"
                className="w-6 h-6 object-contain"
              />
            </div>
            <div>
              <h1 className="text-lg font-bold text-theme-primary">AuditPro</h1>
              <p className="text-xs text-theme-tertiary font-medium">Sistema de Auditoria</p>
            </div>
          </div>
          
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-xl hover:bg-theme-tertiary transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-theme-md backdrop-blur-sm"
          >
            <X className="w-5 h-5 text-theme-secondary" />
          </button>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 p-6 space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-theme-tertiary scrollbar-track-transparent hover:scrollbar-thumb-theme-secondary max-h-[calc(100vh-200px)]">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            
            // Função para obter as classes de cor baseadas no estado e cor do item
            const getColorClasses = () => {
              if (isActive) {
                switch (item.color) {
                  case 'primary': return 'bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 border border-primary-200 shadow-glow-primary/30';
                  case 'success': return 'bg-gradient-to-r from-success-50 to-success-100 text-success-700 border border-success-200 shadow-glow-success/30';
                  case 'secondary': return 'bg-gradient-to-r from-secondary-50 to-secondary-100 text-secondary-700 border border-secondary-200 shadow-glow-secondary/30';
                  case 'warning': return 'bg-gradient-to-r from-warning-50 to-warning-100 text-warning-700 border border-warning-200 shadow-glow-warning/30';
                  case 'info': return 'bg-gradient-to-r from-info-50 to-info-100 text-info-700 border border-info-200 shadow-glow-info/30';
                  case 'accent': return 'bg-gradient-to-r from-accent-50 to-accent-100 text-accent-700 border border-accent-200 shadow-glow-accent/30';
                  case 'neutral': return 'bg-gradient-to-r from-neutral-50 to-neutral-100 text-neutral-700 border border-neutral-200 shadow-glow-neutral/30';
                  default: return 'bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 border border-primary-200 shadow-glow-primary/30';
                }
              }
              return 'text-theme-secondary hover:bg-theme-secondary hover:text-theme-primary hover:shadow-theme-md backdrop-blur-sm border border-transparent hover:border-theme-primary';
            };

            const getIconColorClasses = () => {
              if (isActive) {
                switch (item.color) {
                  case 'primary': return 'text-primary-600';
                  case 'success': return 'text-success-600';
                  case 'secondary': return 'text-secondary-600';
                  case 'warning': return 'text-warning-600';
                  case 'info': return 'text-info-600';
                  case 'accent': return 'text-accent-600';
                  case 'neutral': return 'text-neutral-600';
                  default: return 'text-primary-600';
                }
              } else {
                // Cores suaves para ícones inativos
                switch (item.color) {
                  case 'primary': return 'text-primary-500 hover:text-primary-600';
                  case 'success': return 'text-success-500 hover:text-success-600';
                  case 'secondary': return 'text-secondary-500 hover:text-secondary-600';
                  case 'warning': return 'text-warning-500 hover:text-warning-600';
                  case 'info': return 'text-info-500 hover:text-info-600';
                  case 'accent': return 'text-accent-500 hover:text-accent-600';
                  case 'neutral': return 'text-neutral-500 hover:text-neutral-600';
                  default: return 'text-primary-500 hover:text-primary-600';
                }
              }
            };
            
            return (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href)}
                className={`
                  flex items-center space-x-4 px-4 py-4 rounded-xl transition-all duration-300 w-full text-left hover:scale-[1.02] active:scale-[0.98]
                  ${getColorClasses()}
                `}
              >
                <Icon className={`w-6 h-6 ${getIconColorClasses()} transition-all duration-300`} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{item.name}</div>
                  <div className="text-xs text-theme-tertiary truncate mt-0.5">{item.description}</div>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-theme-primary bg-theme-secondary flex-shrink-0">
          <div className="text-xs text-theme-tertiary">
            <div className="font-semibold text-theme-secondary">AuditPro v1.0</div>
            <div className="mt-1">Sistema de Auditoria SESI/SENAI</div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}