import React from 'react';
import Card from './card';

interface KPIProps {
  label: string;
  value: string;
  delta?: string;
  deltaTone?: 'success' | 'danger' | 'neutral';
  meta?: string;
}

export default function KPI({ label, value, delta, deltaTone = 'success', meta }: KPIProps) {
  const tones = {
    success: 'text-srm-success-700 bg-srm-success-50',
    danger:  'text-srm-danger-700 bg-srm-danger-50',
    neutral: 'text-fg-2 bg-surface-alt',
  };

  return (
    <Card padding={20} className="flex flex-col gap-1.5">
      <div className="t-eyebrow">{label}</div>
      <div className="t-kpi mt-1">{value}</div>
      <div className="flex items-center gap-2 mt-0.5 min-h-5">
        {delta && (
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full t-num whitespace-nowrap ${tones[deltaTone]}`}>
            {delta}
          </span>
        )}
        {meta && <p className="text-xs text-fg-3 flex-1 truncate">{meta}</p>}
      </div>
    </Card>
  );
}
