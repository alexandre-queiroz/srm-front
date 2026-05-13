import { cn } from "@/lib/utils";
import React from "react";
import Icon from "./icon";

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "color"> {
  label?: string;
  hint?: string;
  color?: "brand" | "accent" | "neutral" | "danger" | "success" | "warning";
}

export default function Checkbox({ label, hint, checked, disabled, className = "", color = "brand", ...props }: CheckboxProps) {
  const colorStyles = {
    brand: "peer-checked:bg-brand-blue-500 peer-checked:border-brand-blue-500",
    accent: "peer-checked:bg-brand-orange-500 peer-checked:border-brand-orange-500",
    neutral: "peer-checked:bg-fg-2 peer-checked:border-fg-2",
    danger: "peer-checked:bg-srm-danger-500 peer-checked:border-srm-danger-500",
    success: "peer-checked:bg-srm-success-500 peer-checked:border-srm-success-500",
    warning: "peer-checked:bg-srm-warning-500 peer-checked:border-srm-warning-500",
  };

  return (
    <label className={cn("group flex gap-3", disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer", className)}>
      <div className="relative mt-px flex h-5 items-center">
        <input {...props} type="checkbox" checked={checked} disabled={disabled} className="peer sr-only" />
        <div
          className={cn(
            "border-border-default peer-focus-visible:border-border-strong h-5 w-5 rounded-md border-[0.5px] bg-white shadow-xs transition-all duration-200",
            !disabled && "group-hover:border-border-strong",
            colorStyles[color],
          )}
        />
        <Icon
          name="check"
          size={14}
          stroke={3}
          className="absolute inset-0 m-auto text-white opacity-0 transition-opacity duration-200 peer-checked:opacity-100"
        />
      </div>

      {(label || hint) && (
        <div className="flex flex-col">
          {label && <span className="text-fg-1 text-sm leading-snug font-normal">{label}</span>}
          {hint && <span className="text-fg-3 mt-0.5 text-[11.5px]">{hint}</span>}
        </div>
      )}
    </label>
  );
}
