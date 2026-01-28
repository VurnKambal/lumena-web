import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
  colorClass?: string;
}

export function ProgressBar({ value, max, className = '', colorClass = 'bg-brand-primary' }: ProgressBarProps) {
  const isOverdraft = value < 0;
  const percentage = isOverdraft ? 100 : Math.min(100, Math.max(0, (value / max) * 100));
  const finalColor = isOverdraft ? 'bg-rose-500' : colorClass;

  return (
    <div className={`w-full bg-slate-100 rounded-full h-2.5 overflow-hidden ${className}`}>
      <div
        className={`h-2.5 rounded-full transition-all duration-500 ease-out ${finalColor}`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
}
