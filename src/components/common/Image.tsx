import React, { useState, useEffect } from 'react';
import { ImageOff, Loader2 } from 'lucide-react';

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  aspectRatio?: string; // e.g. '1/1', '16/9', '4/3'
  fallbackSrc?: string;
  fallbackIcon?: React.ReactNode;
  showSkeleton?: boolean;
  blurPlaceholder?: boolean;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  priority?: boolean; // If true, loading='eager', fetchPriority='high'
}

export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  aspectRatio,
  fallbackSrc,
  fallbackIcon,
  showSkeleton = true,
  blurPlaceholder = false,
  objectFit = 'cover',
  priority = false,
  loading,
  decoding = 'async',
  referrerPolicy = 'no-referrer',
  style,
  onLoad,
  onError,
  ...rest
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(src);

  // Reset states when src changes
  useEffect(() => {
    setCurrentSrc(src);
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoaded(true);
    setHasError(false);
    if (onLoad) {
      onLoad(e);
    }
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
      setIsLoaded(false);
    } else {
      setHasError(true);
      setIsLoaded(true);
    }
    if (onError) {
      onError(e);
    }
  };

  const fitClass = {
    cover: 'object-cover',
    contain: 'object-contain',
    fill: 'object-fill',
    none: 'object-none',
    'scale-down': 'object-scale-down'
  }[objectFit];

  const aspectStyle: React.CSSProperties = aspectRatio
    ? { aspectRatio, ...style }
    : { ...style };

  // If missing or broken source
  if (!currentSrc || hasError) {
    return (
      <div
        className={`relative overflow-hidden bg-neutral-900 border border-neutral-800 flex flex-col items-center justify-center text-neutral-500 select-none ${containerClassName} ${className}`}
        style={aspectStyle}
        role="img"
        aria-label={alt || 'Image not available'}
      >
        {fallbackIcon || (
          <div className="flex flex-col items-center justify-center p-2 text-center">
            <ImageOff className="w-5 h-5 text-neutral-600 mb-1" />
            <span className="text-[10px] text-neutral-500 truncate max-w-full px-1">
              {alt || 'No Image'}
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden ${containerClassName}`}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Loading Skeleton Shimmer */}
      {!isLoaded && showSkeleton && (
        <div
          className={`absolute inset-0 bg-neutral-800/80 animate-pulse flex items-center justify-center z-10 ${
            blurPlaceholder ? 'backdrop-blur-sm' : ''
          }`}
          aria-hidden="true"
        >
          <Loader2 className="w-4 h-4 text-neutral-500 animate-spin opacity-40" />
        </div>
      )}

      {/* Main Image with Progressive Opacity Fade-in */}
      <img
        src={currentSrc}
        alt={alt}
        loading={priority ? 'eager' : (loading || 'lazy')}
        decoding={decoding}
        referrerPolicy={referrerPolicy}
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={handleLoad}
        onError={handleError}
        style={aspectStyle}
        className={`transition-opacity duration-300 ease-in-out ${fitClass} ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        {...rest}
      />
    </div>
  );
};

export default Image;
