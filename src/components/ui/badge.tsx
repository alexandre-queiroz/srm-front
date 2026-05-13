import React from 'react';

interface BadgeProps {
  tone?: 'neutral' | 'info' | 'success' | 'warning' | 'danger' | 'accent';
  children: React.ReactNode;
  dot?: boolean;
  className?: string;
}

export default function Badge({ tone = 'neutral', children, dot = true, className = '' }: BadgeProps) {
  const tones = {
    neutral: { bg: 'bg-srm-neutral-50 border-srm-neutral-200/60',    fg: 'text-fg-2',              dot: 'bg-srm-neutral-400' },
    info:    { bg: 'bg-brand-blue-50 border-brand-blue-200/60',       fg: 'text-brand-blue-700',    dot: 'bg-brand-blue-400' },
    success: { bg: 'bg-srm-success-50 border-srm-success-100',        fg: 'text-srm-success-700',   dot: 'bg-srm-success-500' },
    warning: { bg: 'bg-srm-warning-50 border-srm-warning-100',        fg: 'text-srm-warning-700',   dot: 'bg-srm-warning-500' },
    danger:  { bg: 'bg-srm-danger-50 border-srm-danger-100',          fg: 'text-srm-danger-700',    dot: 'bg-srm-danger-500' },
    accent:  { bg: 'bg-brand-orange-50 border-brand-orange-200/60',   fg: 'text-brand-orange-700',  dot: 'bg-brand-orange-400' },
  };

  const t = tones[tone];

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-0.5
        rounded-full text-[11px] font-medium tracking-wide
        border-[0.5px]
        ${t.bg} ${t.fg} ${className}
      `}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${t.dot}`} />}
      {children}
    </span>
  );
}
