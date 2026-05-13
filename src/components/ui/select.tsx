"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import Icon from "./icon";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  hint?: string;
  error?: string;
  icon?: string;
  options?: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  color?: "brand" | "accent" | "neutral" | "danger" | "success" | "warning";
}

export default function Select({
  label,
  hint,
  error,
  icon,
  options = [],
  value,
  onChange,
  disabled,
  className = "",
  placeholder = "Selecione...",
  color = "brand",
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const colorBorders = {
    brand: "border-brand-blue-500",
    accent: "border-brand-orange-500",
    neutral: "border-fg-2",
    danger: "border-srm-danger-500",
    success: "border-srm-success-500",
    warning: "border-srm-warning-500",
  };

  const selectedOption = options.find((opt) => opt.value === value);

  const borderClass = error
    ? "border-[0.5px] border-srm-danger-500"
    : isOpen
      ? `border-[0.5px] ${colorBorders[color]} shadow-xs`
      : "border-[0.5px] border-border-default shadow-xs hover:border-border-strong";

  return (
    <div className={`flex w-full flex-col ${className}`} ref={containerRef}>
      <div className="mb-1 min-h-[20px]">{label && <label className="text-fg-1 text-[13px] font-medium">{label}</label>}</div>

      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={cn(
            "flex h-10 w-full items-center justify-between overflow-hidden rounded-full px-4 transition-colors duration-200",
            disabled ? "bg-surface-sunken text-fg-disabled cursor-not-allowed opacity-60" : "text-fg-1 cursor-pointer bg-white",
            borderClass,
          )}
        >
          <div className="flex items-center truncate min-w-0">
            {icon && <Icon name={icon} size={15} stroke={2} className="mr-2 shrink-0 text-fg-3" />}
            <span className={cn("truncate text-sm", !selectedOption && "text-fg-disabled")}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>
          <Icon name="chevronDown" size={15} stroke={2} className={cn("text-fg-3 shrink-0 ml-2 transition-transform", isOpen && "rotate-180")} />
        </button>

        {isOpen && !disabled && (
          <div className="border-border-subtle absolute z-50 mt-1 max-h-60 w-full overflow-auto overflow-x-hidden rounded-2xl border-[0.5px] bg-white shadow-lg flex flex-col">
            {options.length === 0 ? (
              <div className="text-fg-3 px-4 py-3 text-sm">Nenhuma opção</div>
            ) : (
              options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={cn(
                    "hover:bg-surface-alt w-full px-4 py-2.5 text-left text-sm transition-colors",
                    value === opt.value ? "bg-surface-alt text-brand-blue-600 font-medium" : "text-fg-1",
                  )}
                  onClick={() => {
                    onChange?.(opt.value);
                    setIsOpen(false);
                  }}
                >
                  {opt.label}
                </button>
              ))
            )}
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
