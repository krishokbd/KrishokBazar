import React, { useState, useEffect, useRef } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
  onError?: () => void;
  onClick?: () => void;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  referrerPolicy = 'no-referrer',
  onError,
  onClick
}) => {
  const [isIntersected, setIsIntersected] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset state if src changes
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  useEffect(() => {
    if (isIntersected) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersected(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '120px', // start loading slightly before it comes into view
        threshold: 0.01
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [isIntersected, src]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    if (onError) {
      onError();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-gray-100/80 ${className}`}
      onClick={onClick}
    >
      {/* Blurred, Pulsating Placeholder Grid */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 z-5 flex items-center justify-center bg-radial from-slate-50 to-slate-200/50">
          {/* Real-time elegant abstract vector silhouette blurred in canvas */}
          <div className="absolute inset-x-0 inset-y-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-50 via-slate-100 to-amber-50/40 animate-pulse blur-[18px]" />
          
          {/* Soft spinning loading circle */}
          <div className="relative flex flex-col items-center justify-center gap-1.5 p-4 z-10">
            <svg 
              className="animate-spin h-5 w-5 text-emerald-600/70" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="3"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="text-[9px] font-mono font-bold tracking-wider text-emerald-700/60 animate-bounce">
              KB SOTEZ
            </span>
          </div>
        </div>
      )}

      {/* Actual Image loaded lazily */}
      {isIntersected && (
        <img
          src={src}
          alt={alt}
          referrerPolicy={referrerPolicy}
          onLoad={handleLoad}
          onError={handleError}
          className={`h-full w-full object-cover object-center transition-all duration-700 ${
            isLoaded ? 'opacity-100 scale-100 blur-none' : 'opacity-0 scale-95 blur-md'
          }`}
        />
      )}
    </div>
  );
};
