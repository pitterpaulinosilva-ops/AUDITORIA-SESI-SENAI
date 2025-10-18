import React, { useState, forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { Eye, EyeOff, Search, X } from 'lucide-react';

// Base Input Component
interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'floating' | 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  variant = 'default',
  size = 'md',
  leftIcon,
  rightIcon,
  clearable = false,
  onClear,
  className,
  id,
  value,
  onChange,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const hasValue = value !== undefined && value !== '';

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-9 px-3 text-sm';
      case 'md':
        return 'h-11 px-4 text-base';
      case 'lg':
        return 'h-13 px-5 text-lg';
      default:
        return 'h-11 px-4 text-base';
    }
  };

  const getVariantClasses = () => {
    const baseClasses = 'w-full rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2';
    
    switch (variant) {
      case 'floating':
        return cn(
          baseClasses,
          'bg-white border-neutral-300 focus:border-primary-500 focus:ring-primary-500/20',
          error && 'border-error-500 focus:border-error-500 focus:ring-error-500/20'
        );
      case 'outlined':
        return cn(
          baseClasses,
          'bg-transparent border-2 border-neutral-300 focus:border-primary-500 focus:ring-primary-500/20',
          error && 'border-error-500 focus:border-error-500 focus:ring-error-500/20'
        );
      case 'filled':
        return cn(
          baseClasses,
          'bg-neutral-100 border-transparent focus:bg-white focus:border-primary-500 focus:ring-primary-500/20',
          error && 'bg-error-50 border-error-500 focus:border-error-500 focus:ring-error-500/20'
        );
      case 'default':
      default:
        return cn(
          baseClasses,
          'bg-white border-neutral-300 focus:border-primary-500 focus:ring-primary-500/20',
          error && 'border-error-500 focus:border-error-500 focus:ring-error-500/20'
        );
    }
  };

  const getLabelClasses = () => {
    if (variant === 'floating') {
      return cn(
        'absolute left-4 transition-all duration-200 pointer-events-none',
        'text-neutral-500',
        (isFocused || hasValue) 
          ? 'top-2 text-xs font-medium text-primary-600' 
          : 'top-1/2 -translate-y-1/2 text-base',
        error && (isFocused || hasValue) && 'text-error-600'
      );
    }
    
    return cn(
      'block text-sm font-medium text-neutral-700 mb-2',
      error && 'text-error-700'
    );
  };

  const handleClear = () => {
    if (onClear) {
      onClear();
    }
    if (onChange) {
      onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <div className="w-full">
      {label && variant !== 'floating' && (
        <label htmlFor={inputId} className={getLabelClasses()}>
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            getSizeClasses(),
            getVariantClasses(),
            leftIcon && 'pl-10',
            (rightIcon || clearable) && 'pr-10',
            className
          )}
          {...props}
        />
        
        {variant === 'floating' && label && (
          <label htmlFor={inputId} className={getLabelClasses()}>
            {label}
          </label>
        )}
        
        {clearable && hasValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <X size={16} />
          </button>
        )}
        
        {rightIcon && !clearable && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
            {rightIcon}
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <p className={cn(
          'mt-2 text-sm',
          error ? 'text-error-600' : 'text-neutral-500'
        )}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

// Password Input Component
interface PasswordInputProps extends Omit<InputProps, 'type' | 'rightIcon'> {
  showToggle?: boolean;
}

export function PasswordInput({ showToggle = true, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);

  return (
    <Input
      {...props}
      type={showPassword ? 'text' : 'password'}
      rightIcon={
        showToggle ? (
          <button
            type="button"
            onClick={togglePassword}
            className="text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        ) : undefined
      }
    />
  );
}

// Search Input Component
interface SearchInputProps extends Omit<InputProps, 'leftIcon' | 'type'> {
  onSearch?: (value: string) => void;
  searchOnType?: boolean;
}

export function SearchInput({ 
  onSearch, 
  searchOnType = false, 
  placeholder = "Pesquisar...",
  ...props 
}: SearchInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch && props.value) {
      onSearch(props.value.toString());
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (props.onChange) {
      props.onChange(e);
    }
    if (searchOnType && onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <Input
      {...props}
      type="search"
      placeholder={placeholder}
      leftIcon={<Search size={16} />}
      clearable
      onChange={handleChange}
      onKeyPress={handleKeyPress}
    />
  );
}

// Textarea Component
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'outlined' | 'filled';
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  helperText,
  variant = 'default',
  resize = 'vertical',
  className,
  id,
  ...props
}, ref) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  const getVariantClasses = () => {
    const baseClasses = 'w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2';
    
    switch (variant) {
      case 'outlined':
        return cn(
          baseClasses,
          'bg-transparent border-2 border-neutral-300 focus:border-primary-500 focus:ring-primary-500/20',
          error && 'border-error-500 focus:border-error-500 focus:ring-error-500/20'
        );
      case 'filled':
        return cn(
          baseClasses,
          'bg-neutral-100 border-transparent focus:bg-white focus:border-primary-500 focus:ring-primary-500/20',
          error && 'bg-error-50 border-error-500 focus:border-error-500 focus:ring-error-500/20'
        );
      case 'default':
      default:
        return cn(
          baseClasses,
          'bg-white border-neutral-300 focus:border-primary-500 focus:ring-primary-500/20',
          error && 'border-error-500 focus:border-error-500 focus:ring-error-500/20'
        );
    }
  };

  const getResizeClasses = () => {
    switch (resize) {
      case 'none':
        return 'resize-none';
      case 'vertical':
        return 'resize-y';
      case 'horizontal':
        return 'resize-x';
      case 'both':
        return 'resize';
      default:
        return 'resize-y';
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={textareaId} 
          className={cn(
            'block text-sm font-medium mb-2',
            error ? 'text-error-700' : 'text-neutral-700'
          )}
        >
          {label}
        </label>
      )}
      
      <textarea
        ref={ref}
        id={textareaId}
        className={cn(
          getVariantClasses(),
          getResizeClasses(),
          'min-h-[100px]',
          className
        )}
        {...props}
      />
      
      {(error || helperText) && (
        <p className={cn(
          'mt-2 text-sm',
          error ? 'text-error-600' : 'text-neutral-500'
        )}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';