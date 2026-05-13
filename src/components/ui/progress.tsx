import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  color?: "brand" | "accent" | "neutral" | "danger" | "success" | "warning";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Progress({ value, color = "brand", size = "md", className = "" }: ProgressProps) {
  const normalizedValue = Math.min(Math.max(value, 0), 100);

  const colors = {
    brand: "bg-brand-blue-500",
    accent: "bg-brand-orange-500",
    neutral: "bg-fg-3",
    danger: "bg-srm-danger-500",
    success: "bg-srm-success-500",
    warning: "bg-srm-warning-500",
  };

  const sizes = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  return (
    <div className={cn("bg-surface-sunken w-full overflow-hidden rounded-full shadow-inner", sizes[size], className)}>
      <div
        className={cn("h-full rounded-full transition-all duration-500 ease-[cubic-bezier(0.2,0,0,1)]", colors[color])}
        style={{ width: `${normalizedValue}%` }}
      />
    </div>
  );
}
