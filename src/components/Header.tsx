import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Menu, 
  Bell, 
  Search, 
  User, 
  Settings,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useAuditProStore } from '../store';
import { cn } from '../lib/utils';

const pageNames: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/audits': 'Auditorias',
  '/checklists': 'Checklists',
  '/non-conformities': 'Não Conformidades',
  '/planning': 'Planejamento',
  '/reports': 'Relatórios',
  '/settings': 'Configurações'
};

export function Header() {
  const location = useLocation();
  const { sidebarOpen, toggleSidebar } = useAuditProStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Obter nome da página atual
  const currentPageName = pageNames[location.pathname] || 'AuditPro';

  // Mock de notificações
  const notifications = [
    {
      id: 1,
      title: 'Nova auditoria agendada',
      message: 'Auditoria de Qualidade ISO 9001 agendada para amanhã',
      time: '5 min atrás',
      unread: true
    },
    {
      id: 2,
      title: 'Não conformidade crítica',
      message: 'NC-2024-001 requer ação imediata',
      time: '1 hora atrás',
      unread: true
    },
    {
      id: 3,
      title: 'Relatório gerado',
      message: 'Relatório mensal de auditorias disponível',
      time: '2 horas atrás',
      unread: false
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="bg-gradient-to-r from-white via-white to-gray-50/30 border-b border-gray-200/80 sticky top-0 z-30 backdrop-blur-sm shadow-sm">
      <div className="flex items-center justify-between px-4 lg:px-6 py-4">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <button
            onClick={toggleSidebar}
            className="p-2.5 rounded-xl hover:bg-gray-100/80 transition-all duration-200 lg:hidden hover:scale-105 active:scale-95"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>

          {/* Page Title */}
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              {currentPageName}
            </h1>
            <p className="text-sm text-gray-500 hidden sm:block font-medium">
              {location.pathname === '/dashboard' && 'Visão geral do sistema de auditoria'}
              {location.pathname === '/audits' && 'Gerencie suas auditorias'}
              {location.pathname === '/checklists' && 'Crie e edite checklists'}
              {location.pathname === '/non-conformities' && 'Acompanhe não conformidades'}
              {location.pathname === '/planning' && 'Planeje recursos e cronogramas'}
              {location.pathname === '/reports' && 'Gere relatórios personalizados'}
              {location.pathname === '/settings' && 'Configure o sistema'}
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Search */}
          <div className="hidden md:flex items-center">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
              <input
                type="text"
                placeholder="Buscar..."
                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm w-64 transition-all duration-200 bg-white/80 backdrop-blur-sm hover:bg-white focus:bg-white shadow-sm"
              />
            </div>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-xl hover:bg-gray-100/80 transition-all duration-200 hover:scale-105 active:scale-95 group"
            >
              <Bell className="w-5 h-5 text-gray-600 group-hover:text-gray-700 transition-colors duration-200" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full flex items-center justify-center font-semibold shadow-lg animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/50 z-50 animate-in slide-in-from-top-2 duration-200">
                <div className="p-4 border-b border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-white rounded-t-2xl">
                  <h3 className="font-bold text-gray-900">Notificações</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-4 border-b border-gray-100/50 hover:bg-gray-50/50 cursor-pointer transition-all duration-200",
                        notification.unread && "bg-blue-50/50 hover:bg-blue-50/70"
                      )}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm text-gray-900">
                            {notification.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-2 font-medium">
                            {notification.time}
                          </p>
                        </div>
                        {notification.unread && (
                          <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full ml-2 mt-1 shadow-sm" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-gray-200/50 bg-gradient-to-r from-gray-50/30 to-white rounded-b-2xl">
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200 hover:underline">
                    Ver todas as notificações
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 rounded-xl hover:bg-gray-100/80 transition-all duration-200 hover:scale-105 active:scale-95 group"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-200">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-sm font-semibold text-gray-900">
                  Administrador
                </div>
                <div className="text-xs text-gray-500 font-medium">
                  admin@auditpro.com
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-gray-600 transition-all duration-200 group-hover:rotate-180" />
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-3 w-48 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/50 z-50 animate-in slide-in-from-top-2 duration-200">
                <div className="p-3 border-b border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-white rounded-t-2xl">
                  <div className="font-semibold text-sm text-gray-900">
                    Administrador
                  </div>
                  <div className="text-xs text-gray-500 font-medium">
                    admin@auditpro.com
                  </div>
                </div>
                <div className="py-2">
                  <button className="flex items-center space-x-2 w-full px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50/70 transition-all duration-200 font-medium">
                    <User className="w-4 h-4" />
                    <span>Perfil</span>
                  </button>
                  <button className="flex items-center space-x-2 w-full px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50/70 transition-all duration-200 font-medium">
                    <Settings className="w-4 h-4" />
                    <span>Configurações</span>
                  </button>
                </div>
                <div className="border-t border-gray-200/50 py-2 bg-gradient-to-r from-red-50/30 to-white rounded-b-2xl">
                  <button className="flex items-center space-x-2 w-full px-3 py-2.5 text-sm text-red-600 hover:bg-red-50/70 transition-all duration-200 font-semibold">
                    <LogOut className="w-4 h-4" />
                    <span>Sair</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-4">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all duration-200 bg-white/80 backdrop-blur-sm hover:bg-white focus:bg-white shadow-sm"
          />
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showUserMenu || showNotifications) && (
        <div
          className="fixed inset-0 z-40 bg-black/5 backdrop-blur-[1px]"
          onClick={() => {
            setShowUserMenu(false);
            setShowNotifications(false);
          }}
        />
      )}
    </header>
  );
}