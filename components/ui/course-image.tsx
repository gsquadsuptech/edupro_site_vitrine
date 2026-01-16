'use client';

import { useState } from 'react';
import Image, { StaticImageData } from 'next/image';

interface CourseImageProps {
  src: string | StaticImageData | undefined;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  onLoad?: () => void;
  style?: React.CSSProperties;
  onError?: () => void;
  fallbackSrc?: string;
}

export function CourseImage({
  src,
  alt,
  className = '',
  width,
  height,
  fill = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
  quality = 90,
  onLoad,
  style,
  onError,
  fallbackSrc
}: CourseImageProps) {
  const [error, setError] = useState(false);
  const [imgSrc, setImgSrc] = useState<string | StaticImageData | undefined>(src);

  // Utiliser une image de secours si l'URL est manquante ou en cas d'erreur
  const imageSrc = !imgSrc || error
    ? '/placeholder.svg'
    : imgSrc;

  // Ne pas afficher d'image de secours pour les URLs d'image génériques
  const isGenericPlaceholder = src === '/placeholder.svg' || src === '/placeholder-logo.svg' || src === '/placeholder-user.jpg';

  const handleError = () => {
    if (!isGenericPlaceholder) {
      setImgSrc(fallbackSrc || '/placeholder.svg');
    }
    if (onError) {
      onError();
    }
  };

  return (
    <div className={`relative ${className} overflow-hidden`} style={style}>
      {fill ? (
        <Image
          src={imageSrc}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover"
          priority={priority}
          quality={quality}
          onError={handleError}
          onLoad={onLoad}
        />
      ) : (
        <Image
          src={imageSrc}
          alt={alt}
          width={width || 500}
          height={height || 300}
          className="object-cover w-full h-full"
          priority={priority}
          quality={quality}
          onError={handleError}
          onLoad={onLoad}
        />
      )}
    </div>
  );
} 