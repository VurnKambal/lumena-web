import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
  colorClass?: string;
}

export function ProgressBar({ value, max, className = '', colorClass = 'bg-brand-primary' }: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={`w-full bg-slate-100 rounded-full h-2.5 overflow-hidden ${className}`}>
      <div
        className={`h-2.5 rounded-full transition-all duration-500 ease-out ${colorClass}`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
}
