import React from "react";
import { cn } from "@/lib/utils";

interface BarData {
  label: string;
  value: number;
}

export function SimpleBarChart({ data, className }: { data: BarData[]; className?: string }) {
  const max = Math.max(...data.map((d) => d.value));

  // Calculate Y-axis steps (5 steps)
  const steps = [max, max * 0.75, max * 0.5, max * 0.25, 0];

  const formatValue = (val: number) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(0)}k`;
    return val.toString();
  };

  return (
    <div className={cn("flex h-48 w-full flex-col", className)}>
      <div className="flex flex-1 gap-6">
        {/* Y-Axis Labels */}
        <div className="mb-6 flex h-[calc(100%-24px)] flex-col justify-between pt-1">
          {steps.map((step, i) => (
            <span key={i} className="text-fg-3/40 w-12 text-right text-[10px] font-bold tabular-nums">
              {formatValue(step)}
            </span>
          ))}
        </div>

        {/* Chart Content Container */}
        <div className="relative flex-1">
          {/* Grid Lines - Clean & Flat */}
          <div className="pointer-events-none absolute inset-0 flex h-[calc(100%-24px)] flex-col justify-between pt-2">
            {steps.map((_, i) => (
              <div key={i} className="border-border-subtle/30 w-full border-t" />
            ))}
          </div>

          {/* Bars Container */}
          <div className="absolute inset-0 flex h-full items-end gap-1.5">
            {data.map((d, i) => {
              const height = `${(d.value / max) * 100}%`;
              return (
                <div key={i} className="group relative flex h-full w-full flex-col items-center justify-end">
                  {/* Bar Background Track */}
                  <div className="bg-surface-alt/40 relative flex w-full flex-1 flex-col justify-end overflow-hidden rounded-t-[2px]">
                    {/* The Actual Bar - Flat Color */}
                    <div
                      className="bg-brand-blue-500 group-hover:bg-brand-blue-400 absolute bottom-0 left-0 w-full rounded-t-[2px] transition-all duration-300"
                      style={{ height: `calc(${height} - 24px)` }}
                    />
                  </div>

                  {/* Tooltip on Hover */}
                  <div className="bg-fg-1 after:border-t-fg-1 pointer-events-none absolute -top-1 left-1/2 z-20 mb-2 -translate-x-1/2 -translate-y-full rounded-lg px-2.5 py-1.5 text-[10px] whitespace-nowrap text-white opacity-0 shadow-xl transition-all duration-200 group-hover:opacity-100 after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-8 after:border-transparent after:content-['']">
                    <span className="font-bold">R$ {d.value.toLocaleString("pt-BR")}</span>
                  </div>

                  {/* X-Axis Labels */}
                  <span className="text-fg-3/60 flex h-6 items-center text-[9px] font-bold tabular-nums">{d.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
