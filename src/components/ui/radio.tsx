import { cn } from "@/lib/utils";
import React from "react";

interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "color"> {
  label?: string;
  hint?: string;
  color?: "brand" | "accent" | "neutral" | "danger" | "success" | "warning";
}

export default function Radio({ label, hint, checked, disabled, className = "", color = "brand", ...props }: RadioProps) {
  const colorBorders = {
    brand: "peer-checked:border-brand-blue-500",
    accent: "peer-checked:border-brand-orange-500",
    neutral: "peer-checked:border-fg-2",
    danger: "peer-checked:border-srm-danger-500",
    success: "peer-checked:border-srm-success-500",
    warning: "peer-checked:border-srm-warning-500",
  };

  const colorDots = {
    brand: "bg-brand-blue-500",
    accent: "bg-brand-orange-500",
    neutral: "bg-fg-2",
    danger: "bg-srm-danger-500",
    success: "bg-srm-success-500",
    warning: "bg-srm-warning-500",
  };

  return (
    <label className={cn("group flex gap-3", disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer", className)}>
      <div className="relative mt-px flex h-5 items-center">
        <input {...props} type="radio" checked={checked} disabled={disabled} className="peer sr-only" />
        <div
          className={cn(
            "border-border-default peer-focus-visible:border-border-strong h-5 w-5 rounded-full border bg-white shadow-xs transition-all duration-200",
            !disabled && "group-hover:border-border-strong",
            colorBorders[color],
          )}
        />
        <div
          className={cn(
            "absolute inset-0 m-auto size-3 scale-50 rounded-full opacity-0 transition-all duration-200 peer-checked:scale-100 peer-checked:opacity-100",
            colorDots[color],
          )}
        />
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
