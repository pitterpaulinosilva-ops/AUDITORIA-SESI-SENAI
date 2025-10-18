import React from 'react';
import { cn } from '../../lib/utils';

// Base Card Component
interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'elevated' | 'outlined' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
  hover?: boolean;
}

export function Card({ 
  children, 
  className, 
  variant = 'default', 
  padding = 'md',
  onClick,
  hover = false
}: CardProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'glass':
        return 'bg-white/80 backdrop-blur-md border border-white/20 shadow-lg';
      case 'elevated':
        return 'bg-white border border-neutral-200 shadow-xl';
      case 'outlined':
        return 'bg-white border-2 border-neutral-300 shadow-sm';
      case 'interactive':
        return 'bg-white border border-neutral-200 shadow-md hover:shadow-xl hover:scale-[1.02] cursor-pointer transition-all duration-300';
      case 'default':
      default:
        return 'bg-white border border-neutral-200 shadow-md';
    }
  };

  const getPaddingClasses = () => {
    switch (padding) {
      case 'none':
        return '';
      case 'sm':
        return 'p-3';
      case 'md':
        return 'p-4';
      case 'lg':
        return 'p-6';
      case 'xl':
        return 'p-8';
      default:
        return 'p-4';
    }
  };

  const hoverClasses = hover && variant !== 'interactive' 
    ? 'hover:shadow-lg hover:-translate-y-1 transition-all duration-300' 
    : '';

  return (
    <div
      className={cn(
        'rounded-xl transition-all duration-300',
        getVariantClasses(),
        getPaddingClasses(),
        hoverClasses,
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

// Card Header Component
interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  divider?: boolean;
}

export function CardHeader({ children, className, divider = false }: CardHeaderProps) {
  return (
    <div className={cn(
      'mb-4',
      divider && 'pb-4 border-b border-neutral-200',
      className
    )}>
      {children}
    </div>
  );
}

// Card Title Component
interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function CardTitle({ children, className, size = 'md' }: CardTitleProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-lg font-semibold';
      case 'md':
        return 'text-xl font-semibold';
      case 'lg':
        return 'text-2xl font-bold';
      case 'xl':
        return 'text-3xl font-bold';
      default:
        return 'text-xl font-semibold';
    }
  };

  return (
    <h3 className={cn(
      'text-neutral-900 leading-tight',
      getSizeClasses(),
      className
    )}>
      {children}
    </h3>
  );
}

// Card Description Component
interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function CardDescription({ children, className }: CardDescriptionProps) {
  return (
    <p className={cn('text-neutral-600 mt-1', className)}>
      {children}
    </p>
  );
}

// Card Content Component
interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={cn('text-neutral-700', className)}>
      {children}
    </div>
  );
}

// Card Footer Component
interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
  divider?: boolean;
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
}

export function CardFooter({ 
  children, 
  className, 
  divider = false, 
  justify = 'end' 
}: CardFooterProps) {
  const getJustifyClasses = () => {
    switch (justify) {
      case 'start':
        return 'justify-start';
      case 'center':
        return 'justify-center';
      case 'end':
        return 'justify-end';
      case 'between':
        return 'justify-between';
      case 'around':
        return 'justify-around';
      default:
        return 'justify-end';
    }
  };

  return (
    <div className={cn(
      'flex items-center mt-4',
      divider && 'pt-4 border-t border-neutral-200',
      getJustifyClasses(),
      className
    )}>
      {children}
    </div>
  );
}

// Stat Card Component
interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
}

export function StatCard({ 
  title, 
  value, 
  description, 
  icon, 
  trend, 
  className,
  variant = 'default'
}: StatCardProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'border-primary-200 bg-gradient-to-br from-primary-50 to-primary-100';
      case 'success':
        return 'border-success-200 bg-gradient-to-br from-success-50 to-success-100';
      case 'warning':
        return 'border-warning-200 bg-gradient-to-br from-warning-50 to-warning-100';
      case 'error':
        return 'border-error-200 bg-gradient-to-br from-error-50 to-error-100';
      case 'default':
      default:
        return 'border-neutral-200 bg-white';
    }
  };

  return (
    <Card 
      className={cn(
        'relative overflow-hidden',
        getVariantClasses(),
        className
      )}
      hover
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-neutral-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-neutral-900 mb-1">{value}</p>
          {description && (
            <p className="text-sm text-neutral-500">{description}</p>
          )}
          {trend && (
            <div className={cn(
              'flex items-center mt-2 text-sm font-medium',
              trend.isPositive ? 'text-success-600' : 'text-error-600'
            )}>
              <span className={cn(
                'inline-flex items-center px-2 py-1 rounded-full text-xs',
                trend.isPositive 
                  ? 'bg-success-100 text-success-800' 
                  : 'bg-error-100 text-error-800'
              )}>
                {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 p-3 rounded-lg bg-white/50 backdrop-blur-sm">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}

// Feature Card Component
interface FeatureCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  disabled?: boolean;
}

export function FeatureCard({ 
  title, 
  description, 
  icon, 
  action, 
  className,
  disabled = false
}: FeatureCardProps) {
  return (
    <Card 
      className={cn(
        'group relative',
        disabled && 'opacity-50 cursor-not-allowed',
        !disabled && 'hover:border-primary-300',
        className
      )}
      variant="interactive"
      onClick={!disabled && action ? action.onClick : undefined}
    >
      <div className="flex items-start space-x-4">
        {icon && (
          <div className="flex-shrink-0 p-3 rounded-lg bg-primary-100 text-primary-600 group-hover:bg-primary-200 transition-colors duration-300">
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-neutral-900 mb-2 group-hover:text-primary-700 transition-colors duration-300">
            {title}
          </h3>
          <p className="text-neutral-600 leading-relaxed">
            {description}
          </p>
          {action && (
            <div className="mt-4">
              <span className="text-primary-600 font-medium group-hover:text-primary-700 transition-colors duration-300">
                {action.label} →
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}