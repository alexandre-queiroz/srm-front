import React from 'react';

interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Text label displayed next to the radio button. */
  label?: string;
}

/**
 * SRM Radio component.
 * Custom-styled circle with a brand-blue center dot when selected.
 */
export default function Radio({
  label,
  checked,
  disabled,
  className = '',
  ...props
}: RadioProps) {
  return (
    <label className={`flex items-center gap-3 group ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} ${className}`}>
      <div className="relative flex items-center h-5">
        <input
          {...props}
          type="radio"
          checked={checked}
          disabled={disabled}
          className="peer sr-only"
        />
        <div className="w-5 h-5 border border-border-default rounded-full bg-white peer-checked:border-brand-blue transition-all duration-150 ease-standard peer-focus-visible:ring-2 peer-focus-visible:ring-brand-blue/20" />
        <div className="absolute inset-0 m-auto w-2.5 h-2.5 bg-brand-blue rounded-full opacity-0 scale-50 peer-checked:opacity-100 peer-checked:scale-100 transition-all duration-150" />
      </div>
      
      {label && <span className="text-sm font-medium text-fg-1">{label}</span>}
    </label>
  );
}
