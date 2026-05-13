import React from 'react';
import { cn } from "@/lib/utils";

interface BarData {
  label: string;
  value: number;
}

export function SimpleBarChart({ data, className }: { data: BarData[], className?: string }) {
  const max = Math.max(...data.map(d => d.value));
  
  // Calculate Y-axis steps (5 steps)
  const steps = [max, max * 0.75, max * 0.5, max * 0.25, 0];
  
  const formatValue = (val: number) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(0)}k`;
    return val.toString();
  };

  return (
    <div className={cn("flex flex-col w-full h-48", className)}>
      <div className="flex flex-1 gap-6">
        {/* Y-Axis Labels */}
        <div className="flex flex-col justify-between h-[calc(100%-24px)] mb-6 pt-1">
          {steps.map((step, i) => (
            <span key={i} className="text-[10px] text-fg-3/40 font-bold text-right w-12 tabular-nums">
              {formatValue(step)}
            </span>
          ))}
        </div>

        {/* Chart Content Container */}
        <div className="flex-1 relative">
          {/* Grid Lines - Clean & Flat */}
          <div className="absolute inset-0 flex flex-col justify-between h-[calc(100%-24px)] pointer-events-none pt-2">
            {steps.map((_, i) => (
              <div key={i} className="w-full border-t border-border-subtle/30" />
            ))}
          </div>

          {/* Bars Container */}
          <div className="absolute inset-0 flex items-end gap-1.5 h-full">
            {data.map((d, i) => {
              const height = `${(d.value / max) * 100}%`;
              return (
                <div key={i} className="group relative flex w-full flex-col items-center justify-end h-full">
                  {/* Bar Background Track */}
                  <div className="w-full flex-1 flex flex-col justify-end bg-surface-alt/40 rounded-t-[2px] relative overflow-hidden">
                    {/* The Actual Bar - Flat Color */}
                    <div 
                      className="w-full rounded-t-[2px] bg-brand-blue-500 transition-all duration-300 group-hover:bg-brand-blue-400 absolute bottom-0 left-0"
                      style={{ height: `calc(${height} - 24px)` }}
                    />
                  </div>
                  
                  {/* Tooltip on Hover */}
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-all duration-200 bg-fg-1 text-white text-[10px] py-1.5 px-2.5 rounded-lg shadow-xl pointer-events-none z-20 whitespace-nowrap mb-2 after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-8 after:border-transparent after:border-t-fg-1">
                    <span className="font-bold">R$ {d.value.toLocaleString('pt-BR')}</span>
                  </div>
                  
                  {/* X-Axis Labels */}
                  <span className="text-[9px] text-fg-3/60 font-bold h-6 flex items-center tabular-nums">
                    {d.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
