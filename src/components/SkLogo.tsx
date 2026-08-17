import React, { useState } from 'react';
import { SK_LOGO_BASE64, SK_LOGO_URL } from '../assets/logo';

interface SkLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  alt?: string;
  shape?: 'circle' | 'rounded' | 'square';
  border?: boolean;
}

const sizeClasses = {
  xs: 'w-5 h-5',
  sm: 'w-8 h-8',
  md: 'w-11 h-11',
  lg: 'w-14 h-14',
  xl: 'w-20 h-20',
  '2xl': 'w-28 h-28',
};

export const SkLogo: React.FC<SkLogoProps> = ({
  className = '',
  size = 'md',
  alt = 'Sharing Knowledge (Grupo SK) Logo Oficial',
  shape = 'rounded',
  border = true,
}) => {
  const [imgSrc, setImgSrc] = useState<string>(SK_LOGO_URL);

  const shapeClass = shape === 'circle' 
    ? 'rounded-full' 
    : shape === 'rounded' 
      ? 'rounded-xl' 
      : 'rounded-none';

  const borderClass = border 
    ? 'border border-white/20 shadow-sm' 
    : '';

  return (
    <div
      className={`relative overflow-hidden bg-[#0A1F33] flex items-center justify-center shrink-0 ${sizeClasses[size]} ${shapeClass} ${borderClass} ${className}`}
    >
      <img
        src={imgSrc}
        alt={alt}
        className="w-full h-full object-cover select-none"
        referrerPolicy="no-referrer"
        onError={() => {
          // If public URL fails for any reason, fallback immediately to embedded Base64
          if (imgSrc !== SK_LOGO_BASE64) {
            setImgSrc(SK_LOGO_BASE64);
          }
        }}
      />
    </div>
  );
};
