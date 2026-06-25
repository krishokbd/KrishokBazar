import React, { useState, useEffect } from 'react';

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
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Reset states when source changes
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

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
      className={`relative overflow-hidden bg-gray-50 ${className}`}
      onClick={onClick}
    >
      {/* Background soft placeholder with high-performance CSS shimmer while loading */}
      {!isLoaded && !hasError && (
        <>
          <style>{`
            @keyframes kb-shimmer-wave {
              0% { transform: translateX(-150%); }
              50% { transform: translateX(50%); }
              100% { transform: translateX(150%); }
            }
          `}</style>
          <div className="absolute inset-0 z-10 bg-gray-100 overflow-hidden">
            {/* Moving light shimmer beam */}
            <div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent" 
              style={{
                animation: 'kb-shimmer-wave 1.4s infinite ease-in-out',
                willChange: 'transform'
              }}
            />
            {/* Soft backdrop pulse */}
            <div className="absolute inset-0 bg-gray-200/25 animate-pulse" />
          </div>
        </>
      )}

      {/* Actual Image loaded immediately so the browser fetches it instantly */}
      <img
        src={src}
        alt={alt}
        referrerPolicy={referrerPolicy}
        onLoad={handleLoad}
        onError={handleError}
        className={`h-full w-full object-cover object-center transition-opacity duration-150 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};

