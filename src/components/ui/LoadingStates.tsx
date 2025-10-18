import React from 'react';
import { cn } from '../../lib/utils';

// Skeleton Loader Component
interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({ 
  className, 
  variant = 'rectangular', 
  width, 
  height, 
  animation = 'pulse' 
}: SkeletonProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'text':
        return 'h-4 rounded-md';
      case 'circular':
        return 'rounded-full aspect-square';
      case 'rectangular':
      default:
        return 'rounded-lg';
    }
  };

  const getAnimationClasses = () => {
    switch (animation) {
      case 'wave':
        return 'animate-shimmer bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 bg-[length:200%_100%]';
      case 'pulse':
        return 'animate-pulse bg-neutral-200';
      case 'none':
      default:
        return 'bg-neutral-200';
    }
  };

  const style = {
    width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
    height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
  };

  return (
    <div
      className={cn(
        getVariantClasses(),
        getAnimationClasses(),
        className
      )}
      style={style}
    />
  );
}

// Spinner Component
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral';
  className?: string;
}

export function Spinner({ size = 'md', color = 'primary', className }: SpinnerProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4 border-2';
      case 'md':
        return 'w-6 h-6 border-2';
      case 'lg':
        return 'w-8 h-8 border-3';
      case 'xl':
        return 'w-12 h-12 border-4';
      default:
        return 'w-6 h-6 border-2';
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case 'primary':
        return 'border-primary-200 border-t-primary-600';
      case 'secondary':
        return 'border-secondary-200 border-t-secondary-600';
      case 'success':
        return 'border-success-200 border-t-success-600';
      case 'warning':
        return 'border-warning-200 border-t-warning-600';
      case 'error':
        return 'border-error-200 border-t-error-600';
      case 'neutral':
        return 'border-neutral-200 border-t-neutral-600';
      default:
        return 'border-primary-200 border-t-primary-600';
    }
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full',
        getSizeClasses(),
        getColorClasses(),
        className
      )}
    />
  );
}

// Dots Loader Component
interface DotsLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral';
  className?: string;
}

export function DotsLoader({ size = 'md', color = 'primary', className }: DotsLoaderProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-1.5 h-1.5';
      case 'md':
        return 'w-2 h-2';
      case 'lg':
        return 'w-3 h-3';
      default:
        return 'w-2 h-2';
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case 'primary':
        return 'bg-primary-600';
      case 'secondary':
        return 'bg-secondary-600';
      case 'success':
        return 'bg-success-600';
      case 'warning':
        return 'bg-warning-600';
      case 'error':
        return 'bg-error-600';
      case 'neutral':
        return 'bg-neutral-600';
      default:
        return 'bg-primary-600';
    }
  };

  return (
    <div className={cn('flex space-x-1', className)}>
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={cn(
            'rounded-full animate-bounce',
            getSizeClasses(),
            getColorClasses()
          )}
          style={{
            animationDelay: `${index * 0.1}s`,
            animationDuration: '0.6s'
          }}
        />
      ))}
    </div>
  );
}

// Loading Button Component
interface LoadingButtonProps {
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingButton({ 
  loading = false, 
  children, 
  className, 
  disabled,
  onClick,
  variant = 'primary',
  size = 'md'
}: LoadingButtonProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'btn-primary';
      case 'secondary':
        return 'btn-secondary';
      case 'success':
        return 'btn-success';
      case 'warning':
        return 'btn-warning';
      case 'error':
        return 'btn-danger';
      case 'ghost':
        return 'btn-ghost';
      default:
        return 'btn-primary';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'btn-sm';
      case 'lg':
        return 'btn-lg';
      default:
        return '';
    }
  };

  return (
    <button
      className={cn(
        getVariantClasses(),
        getSizeClasses(),
        loading && 'btn-loading',
        className
      )}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading && (
        <Spinner 
          size="sm" 
          color={variant === 'secondary' || variant === 'ghost' ? 'neutral' : 'primary'} 
          className="mr-2" 
        />
      )}
      {children}
    </button>
  );
}

// Card Skeleton Component
interface CardSkeletonProps {
  className?: string;
  showAvatar?: boolean;
  lines?: number;
}

export function CardSkeleton({ className, showAvatar = false, lines = 3 }: CardSkeletonProps) {
  return (
    <div className={cn('p-6 bg-white rounded-xl border border-neutral-200 shadow-md', className)}>
      <div className="flex items-start space-x-4">
        {showAvatar && (
          <Skeleton variant="circular" width={48} height={48} />
        )}
        <div className="flex-1 space-y-3">
          <Skeleton variant="text" className="w-3/4" />
          {Array.from({ length: lines }).map((_, index) => (
            <Skeleton 
              key={index} 
              variant="text" 
              className={index === lines - 1 ? "w-1/2" : "w-full"} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Table Skeleton Component
interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function TableSkeleton({ rows = 5, columns = 4, className }: TableSkeletonProps) {
  return (
    <div className={cn('bg-white rounded-xl border border-neutral-200 shadow-md overflow-hidden', className)}>
      {/* Header */}
      <div className="p-4 border-b border-neutral-200 bg-neutral-50">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, index) => (
            <Skeleton key={index} variant="text" className="h-4" />
          ))}
        </div>
      </div>
      
      {/* Rows */}
      <div className="divide-y divide-neutral-200">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="p-4">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton key={colIndex} variant="text" className="h-4" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Page Loading Component
interface PageLoadingProps {
  message?: string;
  className?: string;
}

export function PageLoading({ message = "Carregando...", className }: PageLoadingProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center min-h-[400px] space-y-4',
      className
    )}>
      <Spinner size="lg" color="primary" />
      <p className="text-neutral-600 font-medium">{message}</p>
    </div>
  );
}