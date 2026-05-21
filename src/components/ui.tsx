import React from 'react';

export const Card = ({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`bg-[var(--color-card)] shadow-sm border border-gray-200 rounded-xl overflow-hidden ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2 ${className}`}>
    {children}
  </div>
);

export const Badge = ({ children, variant = 'gray', className = '' }: { children: React.ReactNode, variant?: 'green' | 'amber' | 'red' | 'blue' | 'purple' | 'gray', className?: string }) => {
  const variants = {
    green: 'bg-green-100 text-green-700',
    amber: 'bg-yellow-100 text-yellow-700',
    red: 'bg-red-100 text-red-700',
    blue: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
    gray: 'bg-gray-100 text-gray-700'
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export const Button = ({ children, variant = 'primary', size='md', onClick, className = '' }: { children: React.ReactNode, variant?: 'primary' | 'ghost' | 'amber' | 'red' | 'dark', size?: 'sm' | 'md', onClick?: (e: any) => void, className?: string }) => {
  const variants = {
    primary: 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-gray-900 font-bold tracking-wider uppercase',
    dark: 'bg-[#1A1A1A] hover:bg-[#000000] text-white font-bold tracking-wider uppercase',
    ghost: 'bg-gray-100 text-gray-700 hover:bg-gray-200 font-bold tracking-wider uppercase',
    amber: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 font-bold tracking-wider uppercase',
    red: 'bg-red-100 text-red-700 hover:bg-red-200 font-bold tracking-wider uppercase',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-[10px] rounded',
    md: 'px-4 py-2 text-[10px] rounded'
  };
  return (
    <button 
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap shadow-sm ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
};

export const Alert = ({ children, variant = 'amber', className = '' }: { children: React.ReactNode, variant?: 'red' | 'amber' | 'green' | 'blue', className?: string }) => {
  const variants = {
    red: 'bg-red-50 border-red-100 text-red-800',
    amber: 'bg-yellow-50 border-yellow-100 text-yellow-800',
    green: 'bg-green-50 border-green-100 text-green-800',
    blue: 'bg-blue-50 border-blue-100 text-blue-800',
  };
  return (
    <div className={`flex items-start gap-2.5 px-4 py-3 rounded-lg border text-xs font-medium leading-relaxed mb-4 ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};
