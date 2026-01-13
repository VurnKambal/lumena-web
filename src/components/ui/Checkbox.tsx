import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Checkbox({ label, className = '', ...props }: CheckboxProps) {
  return (
    <label className={`flex items-center space-x-3 cursor-pointer ${className}`}>
      <input
        type="checkbox"
        className="h-5 w-5 rounded border-slate-200 text-brand-primary focus:ring-brand-primary"
        {...props}
      />
      <span className="text-sm font-medium text-brand-text">{label}</span>
    </label>
  );
}
