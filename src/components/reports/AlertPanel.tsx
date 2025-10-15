import React from 'react';
import { AlertTriangle, AlertCircle, Info, CheckCircle, X } from 'lucide-react';
import { AlertConfig } from '../../types';

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  isRead?: boolean;
  config?: AlertConfig;
}

interface AlertPanelProps {
  alerts: Alert[];
  onDismiss?: (alertId: string) => void;
  onMarkAsRead?: (alertId: string) => void;
  maxAlerts?: number;
  showTimestamp?: boolean;
}

const alertStyles = {
  critical: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: 'text-red-600',
    title: 'text-red-800',
    message: 'text-red-700',
    IconComponent: AlertTriangle
  },
  warning: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    icon: 'text-orange-600',
    title: 'text-orange-800',
    message: 'text-orange-700',
    IconComponent: AlertCircle
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'text-blue-600',
    title: 'text-blue-800',
    message: 'text-blue-700',
    IconComponent: Info
  },
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: 'text-green-600',
    title: 'text-green-800',
    message: 'text-green-700',
    IconComponent: CheckCircle
  }
};

export const AlertPanel: React.FC<AlertPanelProps> = ({
  alerts,
  onDismiss,
  onMarkAsRead,
  maxAlerts = 5,
  showTimestamp = true
}) => {
  const displayAlerts = alerts.slice(0, maxAlerts);

  if (alerts.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertas</h3>
        <div className="text-center py-8">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <p className="text-gray-500">Nenhum alerta ativo</p>
          <p className="text-sm text-gray-400 mt-1">Tudo está funcionando normalmente</p>
        </div>
      </div>
    );
  }

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Agora';
    if (diffInMinutes < 60) return `${diffInMinutes}min atrás`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d atrás`;
    
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Alertas</h3>
        {alerts.length > maxAlerts && (
          <span className="text-sm text-gray-500">
            Mostrando {maxAlerts} de {alerts.length}
          </span>
        )}
      </div>
      
      <div className="space-y-3">
        {displayAlerts.map((alert) => {
          const style = alertStyles[alert.type];
          const IconComponent = style.IconComponent;
          
          return (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border ${style.bg} ${style.border} ${
                alert.isRead ? 'opacity-75' : ''
              } transition-all duration-200`}
            >
              <div className="flex items-start space-x-3">
                <IconComponent className={`w-5 h-5 ${style.icon} flex-shrink-0 mt-0.5`} />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className={`text-sm font-medium ${style.title}`}>
                        {alert.title}
                      </h4>
                      <p className={`text-sm ${style.message} mt-1`}>
                        {alert.message}
                      </p>
                      
                      {showTimestamp && (
                        <p className="text-xs text-gray-500 mt-2">
                          {formatTimestamp(alert.timestamp)}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {!alert.isRead && onMarkAsRead && (
                        <button
                          onClick={() => onMarkAsRead(alert.id)}
                          className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                          title="Marcar como lido"
                        >
                          Marcar como lido
                        </button>
                      )}
                      
                      {onDismiss && (
                        <button
                          onClick={() => onDismiss(alert.id)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          title="Dispensar alerta"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {alerts.length > maxAlerts && (
        <div className="mt-4 text-center">
          <button className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
            Ver todos os alertas ({alerts.length})
          </button>
        </div>
      )}
    </div>
  );
};