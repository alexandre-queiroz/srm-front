import React from "react";
import { cn } from "@/lib/utils";

interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "color"> {
  label?: string;
  hint?: string;
  color?: "brand" | "accent" | "neutral" | "danger" | "success" | "warning";
}

export function Switch({ disabled, className, label, hint, color = "brand", ...props }: SwitchProps) {
  const colorStyles = {
    brand: "peer-checked:bg-brand-blue-500 peer-focus-visible:ring-brand-blue-500",
    accent: "peer-checked:bg-brand-orange-500 peer-focus-visible:ring-brand-orange-500",
    neutral: "peer-checked:bg-fg-2 peer-focus-visible:ring-fg-2",
    danger: "peer-checked:bg-srm-danger-500 peer-focus-visible:ring-srm-danger-500",
    success: "peer-checked:bg-srm-success-500 peer-focus-visible:ring-srm-success-500",
    warning: "peer-checked:bg-srm-warning-500 peer-focus-visible:ring-srm-warning-500",
  };

  return (
    <label className={cn("group flex gap-3 items-start", disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer", className)}>
      <div className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors mt-[3px]">
        <input 
          type="checkbox" 
          disabled={disabled} 
          className="peer sr-only" 
          {...props} 
        />
        <div className={cn("h-6 w-11 rounded-full bg-border-strong border-[0.5px] border-border-default shadow-inner transition-colors duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2", colorStyles[color])} />
        <div className="absolute left-[2px] h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 peer-checked:translate-x-5" />
      </div>

      {(label || hint) && (
        <div className="flex flex-col">
          {label && <span className="text-fg-1 text-sm leading-snug font-medium">{label}</span>}
          {hint && <span className="text-fg-3 mt-0.5 text-[11.5px]">{hint}</span>}
        </div>
      )}
    </label>
  );
}
