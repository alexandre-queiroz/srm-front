import React from "react";

interface AvatarProps {
  /** User name for generating initials. */
  name: string;
  /** Image source URL. */
  src?: string;
  /** Size in pixels (standard Tailwind scale recommended). */
  size?: "sm" | "md" | "lg" | "xl";
  /** Additional CSS classes. */
  className?: string;
}

/**
 * SRM Avatar component.
 * Displays user image or initials in a brand-blue circle.
 */
export default function Avatar({ name, src, size = "md", className = "" }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const sizes = {
    sm: "w-8 h-8 text-[11px]",
    md: "w-10 h-10 text-[13px]",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-xl",
  };

  return (
    <div
      className={`bg-brand-blue-50 text-brand-blue-700 border-brand-blue-100 relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border font-semibold ${sizes[size]} ${className} `}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      ) : null}
      <span className={src ? "sr-only" : ""}>{initials}</span>
    </div>
  );
}
