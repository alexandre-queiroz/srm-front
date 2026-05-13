import React from 'react';
import Icon from './icon';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
}

export default function Checkbox({
  label,
  hint,
  checked,
  disabled,
  className = '',
  ...props
}: CheckboxProps) {
  return (
    <label
      className={`flex gap-3 group ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${className}`}
    >
      <div className="relative flex items-center h-5 mt-px">
        <input
          {...props}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          className="peer sr-only"
        />
        <div
          className="
            w-[18px] h-[18px] rounded-md
            border-[0.5px] border-border-default bg-white
            peer-checked:bg-[linear-gradient(180deg,_var(--srm-blue-400)_0%,_var(--srm-blue-600)_100%)]
            peer-checked:border-brand-blue-600
            peer-focus-visible:ring-2 peer-focus-visible:ring-brand-blue-500/20
            transition-all duration-[160ms] ease-[cubic-bezier(0.2,0,0,1)]
          "
        />
        <Icon
          name="check"
          size={12}
          stroke={2.5}
          className="absolute inset-0 m-auto text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-[120ms]"
        />
      </div>

      {(label || hint) && (
        <div className="flex flex-col">
          {label && <span className="text-sm font-medium text-fg-1 leading-snug">{label}</span>}
          {hint && <span className="text-xs text-fg-3 mt-0.5">{hint}</span>}
        </div>
      )}
    </label>
  );
}
