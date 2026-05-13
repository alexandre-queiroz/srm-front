import { cn } from "@/lib/utils";
import React from "react";
import Icon from "./icon";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "outline" | "ghost" | "soft" | "link";
  color?: "brand" | "accent" | "neutral" | "danger" | "success" | "warning";
  size?: "sm" | "md" | "lg";
  icon?: string;
  iconRight?: string;
  isLoading?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant = "solid",
  color = "brand",
  size = "md",
  icon,
  iconRight,
  isLoading,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const variantColorStyles = {
    solid: {
      brand: "bg-brand-blue-500 text-white border border-transparent shadow-brand hover:bg-brand-blue-600 active:bg-brand-blue-700",
      accent:
        "bg-brand-orange-500 text-white border border-transparent shadow-[0_1px_2px_rgba(212,82,0,0.18),0_4px_12px_rgba(212,82,0,0.16)] hover:bg-brand-orange-600 active:bg-brand-orange-700",
      neutral: "bg-fg-1 text-white border border-transparent shadow-sm hover:bg-fg-2 active:bg-fg-3",
      danger: "bg-srm-danger-500 text-white border border-transparent shadow-sm hover:bg-srm-danger-600 active:bg-srm-danger-700",
      success: "bg-srm-success-500 text-white border border-transparent shadow-sm hover:bg-srm-success-600 active:bg-srm-success-700",
      warning: "bg-srm-warning-500 text-white border border-transparent shadow-sm hover:bg-srm-warning-600 active:bg-srm-warning-700",
    },
    outline: {
      brand: "bg-transparent text-brand-blue-500 border border-brand-blue-500 hover:bg-brand-blue-50 active:bg-brand-blue-100",
      accent: "bg-transparent text-brand-orange-500 border border-brand-orange-500 hover:bg-brand-orange-50 active:bg-brand-orange-100",
      neutral: "bg-white text-fg-1 border border-border-default shadow-xs hover:bg-surface-alt hover:border-border-strong active:bg-surface-sunken",
      danger: "bg-transparent text-srm-danger-500 border border-srm-danger-500 hover:bg-srm-danger-50 active:bg-srm-danger-100",
      success: "bg-transparent text-srm-success-500 border border-srm-success-500 hover:bg-srm-success-50 active:bg-srm-success-100",
      warning: "bg-transparent text-srm-warning-500 border border-srm-warning-500 hover:bg-srm-warning-50 active:bg-srm-warning-100",
    },
    ghost: {
      brand: "bg-transparent text-brand-blue-500 border border-transparent hover:bg-brand-blue-50 hover:border-brand-blue-100 active:bg-brand-blue-100",
      accent:
        "bg-transparent text-brand-orange-500 border border-transparent hover:bg-brand-orange-50 hover:border-brand-orange-100 active:bg-brand-orange-100",
      neutral:
        "bg-transparent text-fg-2 border border-transparent hover:bg-surface-alt hover:border-border-subtle active:bg-surface-sunken",
      danger:
        "bg-transparent text-srm-danger-500 border border-transparent hover:bg-srm-danger-50 hover:border-srm-danger-100 active:bg-srm-danger-100",
      success:
        "bg-transparent text-srm-success-500 border border-transparent hover:bg-srm-success-50 hover:border-srm-success-100 active:bg-srm-success-100",
      warning:
        "bg-transparent text-srm-warning-500 border border-transparent hover:bg-srm-warning-50 hover:border-srm-warning-100 active:bg-srm-warning-100",
    },
    soft: {
      brand: "bg-brand-blue-50 text-brand-blue-700 border border-transparent hover:bg-brand-blue-100 active:bg-brand-blue-200",
      accent: "bg-brand-orange-50 text-brand-orange-700 border border-transparent hover:bg-brand-orange-100 active:bg-brand-orange-200",
      neutral: "bg-surface-alt text-fg-1 border border-transparent hover:bg-surface-sunken active:bg-border-subtle",
      danger: "bg-srm-danger-50 text-srm-danger-700 border border-transparent hover:bg-srm-danger-100 active:bg-srm-danger-200",
      success: "bg-srm-success-50 text-srm-success-700 border border-transparent hover:bg-srm-success-100 active:bg-srm-success-200",
      warning: "bg-srm-warning-50 text-srm-warning-700 border border-transparent hover:bg-srm-warning-100 active:bg-srm-warning-200",
    },
    link: {
      brand: "bg-transparent text-brand-blue-500 hover:underline active:text-brand-blue-700 !p-0 !h-auto",
      accent: "bg-transparent text-brand-orange-500 hover:underline active:text-brand-orange-700 !p-0 !h-auto",
      neutral: "bg-transparent text-fg-2 hover:underline active:text-fg-1 !p-0 !h-auto",
      danger: "bg-transparent text-srm-danger-500 hover:underline active:text-srm-danger-700 !p-0 !h-auto",
      success: "bg-transparent text-srm-success-500 hover:underline active:text-srm-success-700 !p-0 !h-auto",
      warning: "bg-transparent text-srm-warning-500 hover:underline active:text-srm-warning-700 !p-0 !h-auto",
    },
  };

  const sizeStyles = {
    sm: "px-3.5 py-1.5 text-xs gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-7 py-3.5 text-[15px] gap-2",
  };

  const iconSize = { sm: 13, md: 15, lg: 16 };

  const buttonClasses = cn(
    "inline-flex items-center justify-center rounded-full font-medium cursor-pointer",
    "transition-all duration-[160ms] ease-[cubic-bezier(0.2,0,0,1)]",
    "disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none",
    "hover:-translate-y-px active:translate-y-0",
    variantColorStyles[variant][color],
    sizeStyles[size],
    className,
  );

  return (
    <button 
      {...props} 
      disabled={disabled || isLoading} 
      className={buttonClasses}
    >
      {isLoading ? (
        <Icon name="loader2" size={iconSize[size]} className="animate-spin" />
      ) : (
        <>
          {icon && <Icon name={icon} size={iconSize[size]} stroke={1.8} />}
          {children}
          {iconRight && <Icon name={iconRight} size={iconSize[size]} stroke={1.8} />}
        </>
      )}
    </button>
  );
}
