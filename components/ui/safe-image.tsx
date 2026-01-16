'use client';

import { useState } from 'react';
import Image from 'next/image';
import { fixSupabaseImageUrl } from '@/lib/utils';

interface SafeImageProps {
  src: string | undefined;
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
  forceRegularImg?: boolean; // Force l'utilisation d'une balise img classique
}

export function SafeImage({
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
  fallbackSrc,
  forceRegularImg = false
}: SafeImageProps) {
  const [error, setError] = useState(false);
  const [imgSrc, setImgSrc] = useState<string | undefined>(fixSupabaseImageUrl(src));

  // Utiliser une image de secours si l'URL est manquante ou en cas d'erreur
  const imageSrc = !imgSrc || error 
    ? (fallbackSrc || '/placeholder.svg')
    : imgSrc;
  
  // Ne pas afficher d'image de secours pour les URLs d'image génériques
  const isGenericPlaceholder = src === '/placeholder.svg' || src === '/placeholder-logo.svg' || src === '/placeholder-user.jpg';

  const handleError = () => {
    setError(true);
    if (!isGenericPlaceholder) {
      setImgSrc(fallbackSrc || '/placeholder.svg');
    }
    if (onError) {
      onError();
    }
  };

  // Détecter si c'est une image Supabase qui pourrait poser problème
  const isSupabaseImage = src?.includes('.supabase.co');
  const shouldUseRegularImg = forceRegularImg || (isSupabaseImage && (width || 0) <= 100 && (height || 0) <= 100);

  // Pour les petites images Supabase (avatars, etc.), utiliser une balise img classique
  if (shouldUseRegularImg) {
    return (
      <img
        src={imageSrc}
        alt={alt}
        className={`object-cover ${className}`}
        style={{
          width: width ? `${width}px` : 'auto',
          height: height ? `${height}px` : 'auto',
          ...style
        }}
        onError={handleError}
        onLoad={onLoad}
      />
    );
  }

  // Pour les autres images, utiliser le composant Next.js Image
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