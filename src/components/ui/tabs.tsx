"use client";

import React, { createContext, useContext, useState, useId } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type SemanticColor = "brand" | "accent" | "neutral" | "danger" | "success" | "warning";

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
  color: SemanticColor;
  layoutId: string;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

export function Tabs({ 
  defaultValue, 
  value, 
  onValueChange, 
  color = "brand",
  className, 
  children 
}: { 
  defaultValue?: string, 
  value?: string, 
  onValueChange?: (val: string) => void, 
  color?: SemanticColor,
  className?: string, 
  children: React.ReactNode 
}) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue || "");
  const currentValue = value !== undefined ? value : uncontrolledValue;
  const setValue = onValueChange || setUncontrolledValue;
  const layoutId = useId();

  return (
    <TabsContext.Provider value={{ value: currentValue, onValueChange: setValue, color, layoutId }}>
      <div className={cn("flex flex-col w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, children }: { className?: string, children: React.ReactNode }) {
  return (
    <div className={cn("inline-flex h-11 items-center justify-center rounded-full bg-surface-alt p-1 text-fg-3 border-[0.5px] border-border-default shadow-inner relative overflow-hidden", className)}>
      {children}
    </div>
  );
}

export function TabsTrigger({ value, className, children, disabled }: { value: string, className?: string, children: React.ReactNode, disabled?: boolean }) {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsTrigger must be used within Tabs");

  const isSelected = context.value === value;

  const colorStyles = {
    brand: "text-brand-blue-700",
    accent: "text-brand-orange-700",
    neutral: "text-fg-1",
    danger: "text-srm-danger-700",
    success: "text-srm-success-700",
    warning: "text-srm-warning-800",
  };

  const ringStyles = {
    brand: "focus-visible:ring-brand-blue-500",
    accent: "focus-visible:ring-brand-orange-500",
    neutral: "focus-visible:ring-border-strong",
    danger: "focus-visible:ring-srm-danger-500",
    success: "focus-visible:ring-srm-success-500",
    warning: "focus-visible:ring-srm-warning-500",
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => context.onValueChange(value)}
      className={cn(
        "relative flex h-full items-center justify-center gap-2 whitespace-nowrap rounded-full px-5 text-sm font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isSelected ? colorStyles[context.color] : "text-fg-3 hover:text-fg-1 hover:bg-surface-sunken/50",
        ringStyles[context.color],
        className
      )}
    >
      {isSelected && (
        <motion.div
          layoutId={context.layoutId}
          className="absolute inset-0 z-0 rounded-full bg-white shadow-xs border-[0.5px] border-border-default"
          initial={false}
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </button>
  );
}

export function TabsContent({ value, className, children }: { value: string, className?: string, children: React.ReactNode }) {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsContent must be used within Tabs");

  if (context.value !== value) return null;

  return (
    <div className={cn("mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue-500 focus-visible:ring-offset-2", className)}>
      {children}
    </div>
  );
}
