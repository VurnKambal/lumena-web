import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      className={`block w-full rounded-xl border-slate-200 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm p-3 border ${className}`}
      {...props}
    />
  );
}
