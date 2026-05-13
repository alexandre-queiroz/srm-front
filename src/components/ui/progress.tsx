import React from 'react';

interface ProgressProps {
  /** Current progress value (0-100). */
  value: number;
  /** Visual style variant. */
  variant?: 'brand' | 'accent';
  /** Additional CSS classes. */
  className?: string;
}

/**
 * SRM Progress component (Loading Bar).
 * Displays a horizontal bar representing task completion.
 */
export default function Progress({
  value,
  variant = 'brand',
  className = '',
}: ProgressProps) {
  const normalizedValue = Math.min(Math.max(value, 0), 100);
  
  const variants = {
    brand: 'bg-brand-blue',
    accent: 'bg-brand-orange',
  };

  return (
    <div className={`w-full h-2 bg-surface-sunken rounded-full overflow-hidden ${className}`}>
      <div
        className={`h-full transition-all duration-300 ease-standard ${variants[variant]}`}
        style={{ width: `${normalizedValue}%` }}
      />
    </div>
  );
}
