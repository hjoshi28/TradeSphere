import React from 'react';

const LoadingSpinner = ({ size = 'md', text = '' }) => {
  const sizes = {
    sm: 'w-4 h-4 border',
    md: 'w-6 h-6 border-2',
    lg: 'w-10 h-10 border-2',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizes[size]} border-surface-700 border-t-brand-500 rounded-full animate-spin`} />
      {text && <span className="text-xs font-medium text-surface-500 tracking-wide">{text}</span>}
    </div>
  );
};

export const SkeletonCard = ({ className = '' }) => (
  <div className={`skeleton h-32 ${className}`} />
);

export const SkeletonRow = ({ count = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="skeleton h-12 rounded-xl" style={{ animationDelay: `${i * 0.1}s` }} />
    ))}
  </div>
);

export const PageLoader = ({ text = 'Loading...' }) => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
    <div className="relative">
      <div className="w-12 h-12 border-2 border-surface-800 border-t-brand-500 rounded-full animate-spin" />
      <div className="absolute inset-0 w-12 h-12 border-2 border-transparent border-b-brand-300/30 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
    </div>
    <span className="text-sm font-medium text-surface-400">{text}</span>
  </div>
);

export default LoadingSpinner;
