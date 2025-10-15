import React from 'react';
import { TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number | string;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: number;
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple';
  isLoading?: boolean;
  onClick?: () => void;
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-blue-600',
    border: 'border-blue-200',
    trend: 'text-blue-600'
  },
  green: {
    bg: 'bg-green-50',
    icon: 'text-green-600',
    border: 'border-green-200',
    trend: 'text-green-600'
  },
  orange: {
    bg: 'bg-orange-50',
    icon: 'text-orange-600',
    border: 'border-orange-200',
    trend: 'text-orange-600'
  },
  red: {
    bg: 'bg-red-50',
    icon: 'text-red-600',
    border: 'border-red-200',
    trend: 'text-red-600'
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'text-purple-600',
    border: 'border-purple-200',
    trend: 'text-purple-600'
  }
};

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  trend,
  trendValue,
  icon: Icon,
  color = 'blue',
  isLoading = false,
  onClick
}) => {
  const colors = colorClasses[color];

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4" />;
      case 'down':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className={`p-4 sm:p-6 rounded-lg border ${colors.bg} ${colors.border} animate-pulse`}>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="h-4 bg-gray-300 rounded w-20 sm:w-24"></div>
          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${colors.bg} flex items-center justify-center`}>
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-300 rounded"></div>
          </div>
        </div>
        <div className="h-6 sm:h-8 bg-gray-300 rounded w-12 sm:w-16 mb-2"></div>
        <div className="h-3 sm:h-4 bg-gray-300 rounded w-16 sm:w-20"></div>
      </div>
    );
  }

  return (
    <div 
      className={`p-4 sm:p-6 rounded-lg border ${colors.bg} ${colors.border} transition-all duration-200 hover:shadow-md ${
        onClick ? 'cursor-pointer hover:scale-105' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-xs sm:text-sm font-medium text-gray-600 truncate pr-2">{title}</h3>
        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${colors.bg} flex items-center justify-center border ${colors.border} flex-shrink-0`}>
          <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${colors.icon}`} />
        </div>
      </div>
      
      <div className="flex items-baseline justify-between flex-wrap gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
            {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
            {unit && <span className="text-sm font-normal text-gray-500 ml-1">{unit}</span>}
          </p>
        </div>
        
        {trend && trendValue !== undefined && (
          <div className={`flex items-center space-x-1 ${getTrendColor()} flex-shrink-0`}>
            {getTrendIcon()}
            <span className="text-xs sm:text-sm font-medium">
              {Math.abs(trendValue).toFixed(1)}%
            </span>
          </div>
        )}
      </div>
      
      {trend && trendValue !== undefined && (
        <p className="text-xs text-gray-500 mt-2 leading-relaxed">
          {trend === 'up' ? 'Aumento' : trend === 'down' ? 'Diminuição' : 'Estável'} em relação ao período anterior
        </p>
      )}
    </div>
  );
};