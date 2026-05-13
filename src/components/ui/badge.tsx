import { cn } from "@/lib/utils";
import React from "react";
import Icon from "./icon";

interface BadgeProps {
  color?: "brand" | "accent" | "neutral" | "danger" | "success" | "warning";
  variant?: "solid" | "soft" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  dot?: boolean;
  isLoading?: boolean;
  className?: string;
}

export default function Badge({
  color = "neutral",
  variant = "soft",
  size = "sm",
  children,
  dot = false,
  isLoading = false,
  className = "",
}: BadgeProps) {
  const variants = {
    solid: {
      brand: "bg-brand-blue-500 text-white border-transparent",
      accent: "bg-brand-orange-500 text-white border-transparent",
      neutral: "bg-fg-2 text-white border-transparent",
      danger: "bg-srm-danger-500 text-white border-transparent",
      success: "bg-srm-success-500 text-white border-transparent",
      warning: "bg-srm-warning-500 text-white border-transparent",
    },
    soft: {
      brand: "bg-brand-blue-50 border-brand-blue-200/60 text-brand-blue-700",
      accent: "bg-brand-orange-50 border-brand-orange-200/60 text-brand-orange-700",
      neutral: "bg-surface-alt border-border-default text-fg-2",
      danger: "bg-srm-danger-50 border-srm-danger-100 text-srm-danger-700",
      success: "bg-srm-success-50 border-srm-success-100 text-srm-success-700",
      warning: "bg-srm-warning-50 border-srm-warning-100 text-srm-warning-700",
    },
    outline: {
      brand: "bg-transparent border-[0.5px] border-brand-blue-500 text-brand-blue-600",
      accent: "bg-transparent border-[0.5px] border-brand-orange-500 text-brand-orange-600",
      neutral: "bg-transparent border-[0.5px] border-border-strong text-fg-2",
      danger: "bg-transparent border-[0.5px] border-srm-danger-500 text-srm-danger-600",
      success: "bg-transparent border-[0.5px] border-srm-success-500 text-srm-success-600",
      warning: "bg-transparent border-[0.5px] border-srm-warning-500 text-srm-warning-600",
    },
  };

  const dotColors = {
    solid: "bg-white/70",
    soft: {
      brand: "bg-brand-blue-500",
      accent: "bg-brand-orange-500",
      neutral: "bg-fg-3",
      danger: "bg-srm-danger-500",
      success: "bg-srm-success-500",
      warning: "bg-srm-warning-500",
    },
    outline: {
      brand: "bg-brand-blue-500",
      accent: "bg-brand-orange-500",
      neutral: "bg-fg-3",
      danger: "bg-srm-danger-500",
      success: "bg-srm-success-500",
      warning: "bg-srm-warning-500",
    },
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[11px] gap-1.5",
    md: "px-2.5 py-0.5 text-xs gap-1.5",
    lg: "px-3 py-1 text-[13px] gap-2",
  };

  const dotSizes = {
    sm: "h-1.5 w-1.5",
    md: "h-1.5 w-1.5",
    lg: "h-2 w-2",
  };

  const iconSizes = {
    sm: 10,
    md: 12,
    lg: 14,
  };

  const activeVariant = variants[variant][color];
  const activeDotColor = variant === "solid" ? dotColors.solid : dotColors[variant][color];

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-medium tracking-wide",
        variant !== "outline" && "border",
        sizes[size],
        activeVariant,
        className
      )}
    >
      {isLoading ? (
        <Icon name="loader2" size={iconSizes[size]} stroke={2.5} className="animate-spin shrink-0" />
      ) : dot ? (
        <span className={cn("shrink-0 rounded-full", dotSizes[size], activeDotColor)} />
      ) : null}
      {children}
    </span>
  );
}
