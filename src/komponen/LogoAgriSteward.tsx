import React, { useState } from 'react';
import logoGreenImage from '../assets/images/agri_steward_green_logo_1785221634759.jpg';

interface LogoAgriStewardProps {
  className?: string;
  size?: number | string;
  useImage?: boolean;
}

export const LogoAgriSteward: React.FC<LogoAgriStewardProps> = ({
  className = 'w-9 h-9',
  size,
  useImage = false,
}) => {
  const [imgError, setImgError] = useState(false);
  const styleObj = size ? { width: size, height: size } : undefined;

  if (useImage && !imgError) {
    return (
      <img
        src={logoGreenImage || '/assets/images/agri_steward_green_logo_1785221634759.jpg'}
        alt="AGRI STEWARD Logo"
        className={`object-cover rounded-xl shadow-xs border border-[#004532]/20 shrink-0 aspect-square ${className}`}
        style={styleObj}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 100 100"
      className={`select-none shrink-0 rounded-xl shadow-xs ${className}`}
      style={styleObj}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Logo AGRI STEWARD"
    >
      <defs>
        <linearGradient id="shieldGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#003525" />
          <stop offset="100%" stopColor="#004532" />
        </linearGradient>
        <linearGradient id="leafGradLeft" x1="20" y1="20" x2="60" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="leafGradRight" x1="80" y1="20" x2="50" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6ee7b7" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>

      {/* Rounded Container */}
      <rect x="2" y="2" width="96" height="96" rx="22" fill="url(#shieldGrad)" />
      <rect x="6" y="6" width="88" height="88" rx="18" fill="none" stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.4" />

      {/* Geometric Leaf Sprout / Letter A Emblem */}
      <path
        d="M50 20 C32 20 22 42 22 62 C22 76 34 82 50 82 C50 56 36 40 50 20 Z"
        fill="url(#leafGradLeft)"
      />
      <path
        d="M50 20 C68 20 78 42 78 62 C78 76 66 82 50 82 C50 56 64 40 50 20 Z"
        fill="url(#leafGradRight)"
      />

      {/* Pure Emerald Central Stem */}
      <path
        d="M50 82 V 34"
        stroke="#10b981"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      
      {/* Mint Green Beacon Node */}
      <circle cx="50" cy="22" r="4" fill="#a6f2d1" />
      <circle cx="50" cy="22" r="7" fill="none" stroke="#34d399" strokeWidth="1" opacity="0.6" />
    </svg>
  );
};




