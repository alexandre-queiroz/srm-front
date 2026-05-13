import React from 'react';
import Icon from './icon';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export default function Select({
  label,
  hint,
  error,
  children,
  disabled,
  className = '',
  ...props
}: SelectProps) {
  const borderClass = error
    ? 'border border-srm-danger-500 focus:ring-2 focus:ring-srm-danger-500/15'
    : 'border-[0.5px] border-border-default focus:border focus:border-brand-blue focus:ring-2 focus:ring-brand-blue-500/12';

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="text-xs font-medium text-fg-2 tracking-wide">
          {label}
        </label>
      )}

      <div className="relative group">
        <select
          {...props}
          disabled={disabled}
          className={`
            w-full py-2.5 pl-3.5 pr-10 text-sm text-fg-1 rounded-2xl appearance-none outline-none
            transition-all duration-[160ms] ease-[cubic-bezier(0.2,0,0,1)]
            ${disabled ? 'bg-surface-sunken opacity-60 cursor-not-allowed text-fg-disabled' : 'bg-white cursor-pointer'}
            ${borderClass}
          `}
        >
          {children}
        </select>

        <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-fg-3 transition-colors group-hover:text-fg-2">
          <Icon name="chevronDown" size={15} stroke={1.8} />
        </div>
      </div>

      {error ? (
        <div className="flex items-center gap-1 text-[11.5px] text-srm-danger-600 font-medium">
          <Icon name="alertCircle" size={12} stroke={2} />
          {error}
        </div>
      ) : hint ? (
        <p className="text-[11.5px] text-fg-3">{hint}</p>
      ) : null}
    </div>
  );
}
