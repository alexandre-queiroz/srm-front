import React from 'react';

interface SkeletonProps {
  /** Size variant or CSS classes for dimensions. */
  className?: string;
  /** Shape variant. */
  variant?: 'rect' | 'circle' | 'text';
}

/**
 * SRM Skeleton component.
 * Placeholder for loading states with a subtle pulse animation.
 */
export default function Skeleton({
  className = '',
  variant = 'rect',
}: SkeletonProps) {
  const base = 'animate-pulse bg-srm-neutral-100';
  
  const variants = {
    rect: 'rounded-md',
    circle: 'rounded-full',
    text: 'rounded h-3 w-full',
  };

  return (
    <div className={`${base} ${variants[variant]} ${className}`} />
  );
}
