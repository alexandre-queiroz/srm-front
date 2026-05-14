"use client";

import React, { useState, useEffect } from "react";
import { type LucideProps } from "lucide-react";
import dynamicIconImports from "lucide-react/dynamicIconImports";

const toKebabCase = (str: string) => str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

const nameOverrides: Record<string, string> = {
  file: "file-text",
  trending: "trending-up",
  chart: "bar-chart-2",
  loader2: "loader-circle",
  notEqual: "ban",
};

// Module-level cache stores the resolved component, not a new lazy wrapper.
// This avoids creating components during render on subsequent uses of the same icon.
const componentCache = new Map<string, React.ComponentType<LucideProps>>();

export interface IconProps extends Omit<LucideProps, "ref" | "stroke"> {
  name: string;
  stroke?: number | string;
}

export default function Icon({ name, color, size = 20, stroke = 1.5, className, ...rest }: IconProps) {
  const normalizedName = (nameOverrides[name] ?? toKebabCase(name)) as keyof typeof dynamicIconImports;

  const [IconComponent, setIconComponent] = useState<React.ComponentType<LucideProps> | null>(
    () => componentCache.get(normalizedName) ?? null,
  );

  useEffect(() => {
    if (componentCache.has(normalizedName)) {
      const cached = componentCache.get(normalizedName)!;
      Promise.resolve().then(() => setIconComponent(() => cached));
      return;
    }

    const loader = dynamicIconImports[normalizedName];
    if (!loader) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`Icon "${name}" (normalized: "${normalizedName}") not found in lucide-react`);
      }
      return;
    }

    loader().then((mod) => {
      // mod.default is the official public API — not __iconNode
      const Component = (mod as unknown as { default: React.ComponentType<LucideProps> }).default;
      componentCache.set(normalizedName, Component);
      setIconComponent(() => Component);
    });
  }, [normalizedName, name]);

  if (!IconComponent) {
    return (
      <span className={`bg-surface-alt/40 inline-block animate-pulse rounded ${className ?? ""}`} style={{ width: size, height: size }} />
    );
  }

  return <IconComponent color={color} size={size} strokeWidth={stroke} className={className} {...rest} />;
}
