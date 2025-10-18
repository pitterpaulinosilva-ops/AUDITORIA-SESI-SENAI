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
  Home
} from 'lucide-react';
import { useAuditProStore } from '../store';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { sidebarOpen, toggleSidebar } = useAuditProStore();

  return (
    <div className="min-h-screen bg-theme-primary transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Overlay para todos os dispositivos */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Main Content - Ocupa toda a largura */}
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <Header />
        
        {/* Page Content */}
        <main className="flex-1 p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8 transition-all duration-300">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}