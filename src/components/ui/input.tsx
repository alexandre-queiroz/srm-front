import React from "react";
import Icon from "./icon";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  icon?: string;
  iconRight?: string;
  prefixAddon?: React.ReactNode;
  suffixAddon?: React.ReactNode;
  color?: "brand" | "accent" | "neutral" | "danger" | "success" | "warning";
}

export default function Input({
  label,
  hint,
  error,
  icon,
  iconRight,
  prefixAddon,
  suffixAddon,
  disabled,
  className = "",
  color = "brand",
  ...props
}: InputProps) {
  const colorBorders = {
    brand: "focus-within:border focus-within:border-brand-blue-500 focus-within:hover:border-brand-blue-500",
    accent: "focus-within:border focus-within:border-brand-orange-500 focus-within:hover:border-brand-orange-500",
    neutral: "focus-within:border focus-within:border-fg-2 focus-within:hover:border-fg-2",
    danger: "focus-within:border focus-within:border-srm-danger-500 focus-within:hover:border-srm-danger-500",
    success: "focus-within:border focus-within:border-srm-success-500 focus-within:hover:border-srm-success-500",
    warning: "focus-within:border focus-within:border-srm-warning-500 focus-within:hover:border-srm-warning-500",
  };

  const borderClass = error
    ? "border-[0.5px] border-srm-danger-500"
    : `border-[0.5px] border-border-default shadow-xs hover:border-border-strong ${colorBorders[color]}`;

  return (
    <div className={`flex w-full flex-col ${className}`}>
      {/* Container fixo para o label não mudar a altura do bloco */}
      <div className="mb-1 min-h-[20px]">{label && <label className="text-fg-1 text-[13px] font-medium">{label}</label>}</div>

      <div
        className={cn(
          "flex h-10 items-stretch overflow-hidden rounded-full transition-colors duration-200",
          disabled ? "bg-surface-sunken cursor-not-allowed opacity-60" : "bg-white",
          borderClass,
        )}
      >
        {prefixAddon && <div className="text-fg-3 flex items-center pr-1.5 pl-4 text-[13px] select-none">{prefixAddon}</div>}
        {icon && !prefixAddon && (
          <div className="text-fg-3 flex items-center pr-1.5 pl-4 select-none">
            <Icon name={icon} size={15} stroke={2} />
          </div>
        )}

        <input
          {...props}
          disabled={disabled}
          className={cn(
            "text-fg-1 placeholder:text-fg-disabled flex-1 bg-transparent text-sm outline-none disabled:cursor-not-allowed",
            props.type === "number" && "t-num",
            icon || prefixAddon ? "pl-1.5" : "pl-4",
            iconRight || suffixAddon ? "pr-1.5" : "pr-4",
          )}
        />

        {suffixAddon && <div className="text-fg-3 flex items-center pr-4 pl-1.5 text-[13px] select-none">{suffixAddon}</div>}
        {iconRight && !suffixAddon && (
          <div className="text-fg-3 flex items-center pr-4 pl-1.5 select-none">
            <Icon name={iconRight} size={15} stroke={2} />
          </div>
        )}
      </div>

      <div className="mt-1 min-h-[18px]">
        {error ? (
          <div className="text-srm-danger-600 flex items-center gap-1 text-[11.5px] font-medium">
            <Icon name="alertCircle" size={12} stroke={2} />
            {error}
          </div>
        ) : hint ? (
          <p className="text-fg-3 text-[11.5px]">{hint}</p>
        ) : null}
      </div>
    </div>
  );
}
