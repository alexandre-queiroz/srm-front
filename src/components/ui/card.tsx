import React from 'react';

interface CardProps {
  children: React.ReactNode;
  padding?: number;
  className?: string;
}

export default function Card({ children, padding = 24, className = '' }: CardProps) {
  return (
    <div
      style={{ padding }}
      className={`
        bg-[linear-gradient(160deg,_#ffffff_0%,_var(--srm-neutral-25)_100%)]
        border-[0.5px] border-border-subtle
        rounded-2xl
        shadow-[var(--shadow-sm)]
        ${className}
      `}
    >
      {children}
    </div>
  );
}
