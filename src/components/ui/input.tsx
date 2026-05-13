import React from 'react';
import Icon from './icon';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  prefixAddon?: React.ReactNode;
  suffixAddon?: React.ReactNode;
}

export default function Input({
  label,
  hint,
  error,
  prefixAddon,
  suffixAddon,
  disabled,
  className = '',
  ...props
}: InputProps) {
  const borderClass = error
    ? 'border border-srm-danger-500 focus-within:ring-2 focus-within:ring-srm-danger-500/15'
    : 'border-[0.5px] border-border-default focus-within:border focus-within:border-brand-blue focus-within:ring-2 focus-within:ring-brand-blue-500/12';

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="text-xs font-medium text-fg-2 tracking-wide">
          {label}
        </label>
      )}

      <div
        className={`
          flex items-stretch overflow-hidden rounded-2xl
          transition-all duration-[160ms] ease-[cubic-bezier(0.2,0,0,1)]
          ${disabled ? 'bg-surface-sunken opacity-60 cursor-not-allowed' : 'bg-white'}
          ${borderClass}
        `}
      >
        {prefixAddon && (
          <div className="flex items-center px-3 bg-surface-alt text-fg-3 text-sm border-r border-[0.5px] border-border-default font-mono select-none">
            {prefixAddon}
          </div>
        )}

        <input
          {...props}
          disabled={disabled}
          className={`
            flex-1 py-2.5 px-3.5 text-sm text-fg-1 bg-transparent outline-none
            placeholder:text-fg-disabled disabled:cursor-not-allowed
            ${props.type === 'number' ? 't-num' : ''}
          `}
        />

        {suffixAddon && (
          <div className="flex items-center px-3 bg-surface-alt text-fg-3 text-sm border-l border-[0.5px] border-border-default font-mono select-none">
            {suffixAddon}
          </div>
        )}
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
