import React from 'react';
import Icon from './icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'secondary' | 'ghost' | 'danger' | 'ghost-neutral';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  iconRight?: string;
  children: React.ReactNode;
  href?: string;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  children,
  className = '',
  href,
  ...props
}: ButtonProps) {
  const variantStyles = {
    primary:
      'bg-brand-blue-500 text-white shadow-brand hover:bg-brand-blue-600 active:bg-brand-blue-700',
    accent:
      'bg-brand-orange-500 text-white hover:bg-brand-orange-600 active:bg-brand-orange-700 shadow-[0_1px_2px_rgba(212,82,0,0.18),0_4px_12px_rgba(212,82,0,0.16)]',
    secondary:
      'bg-white text-fg-1 border-[0.5px] border-border-default shadow-[var(--shadow-xs)] hover:bg-surface-alt hover:border-border-strong active:bg-surface-sunken',
    ghost:
      'bg-transparent text-brand-blue-500 border-[0.5px] border-transparent hover:bg-brand-blue-50 hover:border-brand-blue-100 active:bg-brand-blue-100',
    danger:
      'bg-srm-danger-500 text-white shadow-[var(--shadow-sm)] hover:bg-srm-danger-600 active:bg-srm-danger-700',
    'ghost-neutral':
      'bg-transparent text-fg-2 border-[0.5px] border-transparent hover:bg-surface-alt hover:border-border-subtle active:bg-surface-sunken',
  };

  const sizeStyles = {
    sm: 'px-3.5 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3.5 text-[15px] gap-2',
  };

  const iconSize = { sm: 13, md: 15, lg: 16 };

  const sharedClasses = `
    inline-flex items-center justify-center rounded-full font-medium
    transition-all duration-[160ms] ease-[cubic-bezier(0.2,0,0,1)]
    disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
    hover:-translate-y-px active:translate-y-0
    ${variantStyles[variant]} ${sizeStyles[size]} ${className}
  `.trim();

  const content = (
    <>
      {icon && <Icon name={icon} size={iconSize[size]} stroke={1.8} />}
      {children}
      {iconRight && <Icon name={iconRight} size={iconSize[size]} stroke={1.8} />}
    </>
  );

  if (href) {
    return <a href={href} className={sharedClasses} {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>{content}</a>;
  }

  return <button {...props} className={sharedClasses}>{content}</button>;
}
