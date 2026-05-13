import React from 'react';

interface IconProps {
  /** Name of the icon to render (e.g., 'home', 'file', 'wallet') */
  name: string;
  /** Size in pixels (width and height) */
  size?: number;
  /** Stroke width for the icon paths */
  stroke?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * SRM Icon component using inline SVG paths.
 * Aligned with Lucide style (1.5px default stroke).
 */
export default function Icon({ 
  name, 
  size = 20, 
  stroke = 1.5, 
  className = '' 
}: IconProps) {
  const paths: Record<string, string> = {
    home:        '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    file:        '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
    wallet:      '<path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>',
    trending:    '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
    chart:       '<line x1="3" y1="3" x2="3" y2="21"/><line x1="3" y1="21" x2="21" y2="21"/><rect x="7" y="13" width="3" height="6"/><rect x="13" y="9" width="3" height="10"/>',
    alertCircle: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
    arrowRight:  '<path d="M5 12h14M13 5l7 7-7 7"/>',
    building:    '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4M10 10h4M10 14h4M10 18h4"/>',
    helpCircle:  '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  };
  
  const d = paths[name] || paths.helpCircle;
  
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size} 
      height={size}
      fill="none" 
      stroke="currentColor" 
      strokeWidth={stroke}
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
      dangerouslySetInnerHTML={{ __html: d }}
    />
  );
}
