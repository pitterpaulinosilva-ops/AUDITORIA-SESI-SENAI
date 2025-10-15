import React from 'react';
import { Outlet } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';

export const ReportsLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Módulo de Relatórios
                </h1>
                <p className="text-sm text-gray-500">
                  Análises e insights do sistema de auditoria
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Full Width */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};