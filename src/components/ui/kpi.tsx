import React from "react";
import Card from "./card";

interface KPIProps {
  label: string;
  value: string;
  delta?: string;
  deltaTone?: "success" | "danger" | "neutral";
  meta?: string;
}

export default function KPI({ label, value, delta, deltaTone = "success", meta }: KPIProps) {
  const tones = {
    success: "text-srm-success-700 bg-srm-success-50",
    danger: "text-srm-danger-700 bg-srm-danger-50",
    neutral: "text-fg-2 bg-surface-alt",
  };

  return (
    <Card padding={20} className="flex flex-col gap-1.5">
      <div className="t-eyebrow">{label}</div>
      <div className="t-kpi mt-1">{value}</div>
      <div className="mt-0.5 flex min-h-5 items-center gap-2">
        {delta && (
          <span className={`t-num rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap ${tones[deltaTone]}`}>{delta}</span>
        )}
        {meta && <p className="text-fg-3 flex-1 truncate text-xs">{meta}</p>}
      </div>
    </Card>
  );
}
