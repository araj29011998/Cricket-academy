import React, { useState } from 'react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  className = '',
  fallbackLabel = 'Apex Cricket Facility',
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#0b3b24] via-[#081425] to-[#061f13] border border-slate-700/40 p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <svg
          className="w-12 h-12 text-[#f59e0b]/70 mb-3"
          viewBox="0 0 48 48"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2" />
          <path d="M13 15C19 21 29 27 35 33" stroke="#d92d20" strokeWidth="2" strokeDasharray="3 3" />
          <path d="M15 13C21 19 31 25 37 31" stroke="#d92d20" strokeWidth="2" strokeDasharray="3 3" />
        </svg>
        <span className="font-label text-xs font-bold uppercase tracking-[0.08em] text-slate-300">
          {fallbackLabel}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
