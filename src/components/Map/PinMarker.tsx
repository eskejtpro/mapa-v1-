/**
 * PinMarker - Interactive Map Memory Pin
 */

import React, { useState } from 'react';
import { Camera, Heart, Image as ImageIcon, Video } from 'lucide-react';
import { MemoryLocation } from '../../types';
import { getSceneSvgDataUri } from '../../utils/svgPlaceholders';

interface PinMarkerProps {
  location: MemoryLocation;
  x: number;
  y: number;
  isSelected: boolean;
  zoom: number;
  onSelect: (location: MemoryLocation) => void;
}

export const PinMarker: React.FC<PinMarkerProps> = ({
  location,
  x,
  y,
  isSelected,
  zoom,
  onSelect,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Cover photo data URI
  const coverMedia = location.media.find((m) => m.id === location.coverMediaId) || location.media[0];
  const thumbUri = coverMedia
    ? getSceneSvgDataUri(coverMedia.sceneType, coverMedia.title, location.id)
    : '';

  // Scale marker inversely with zoom to keep constant pleasant physical size
  const scale = Math.max(0.65, Math.min(1.2, 1 / Math.sqrt(zoom)));

  return (
    <g
      id={`pin-${location.id}`}
      transform={`translate(${x}, ${y}) scale(${scale})`}
      className="cursor-pointer transition-transform duration-200 select-none group"
      onClick={(e) => {
        e.stopPropagation();
        onSelect(location);
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      aria-label={`Wspomnienie: ${location.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(location);
        }
      }}
    >
      {/* Selection Animated Halo */}
      {isSelected && (
        <circle
          cx="0"
          cy="-32"
          r="36"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="3"
          strokeDasharray="6 4"
          className="animate-spin"
          style={{ animationDuration: '10s' }}
        />
      )}

      {/* Pin Shadow */}
      <ellipse cx="0" cy="0" rx="14" ry="5" fill="#000000" opacity="0.4" />

      {/* Pin Stem & Pointer */}
      <path
        d="M 0,0 L -8,-24 Q 0,-28 8,-24 Z"
        fill={isSelected ? '#f59e0b' : '#1e293b'}
        stroke={isSelected ? '#d97706' : '#0f172a'}
        strokeWidth="1.5"
      />

      {/* Pin Circular Head Frame */}
      <circle
        cx="0"
        cy="-32"
        r="24"
        fill={isSelected ? '#f59e0b' : '#1e293b'}
        stroke={isSelected ? '#ffffff' : '#475569'}
        strokeWidth={isSelected ? '3' : '2'}
        filter="drop-shadow(0 4px 6px rgba(0,0,0,0.3))"
      />

      {/* Clip path for miniature image */}
      <clipPath id={`clip-${location.id}`}>
        <circle cx="0" cy="-32" r="21" />
      </clipPath>

      {/* Thumbnail artwork inside pin */}
      {thumbUri && (
        <image
          href={thumbUri}
          x="-21"
          y="-53"
          width="42"
          height="42"
          preserveAspectRatio="xMidYMid slice"
          clipPath={`url(#clip-${location.id})`}
        />
      )}

      {/* Favorite Star / Heart Badge */}
      {location.isFavorite && (
        <g transform="translate(14, -48)">
          <circle cx="0" cy="0" r="9" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
          <path
            d="M -4,-1 Q -4,-4 -1,-4 Q 0,-2 0,-1 Q 0,-2 1,-4 Q 4,-4 4,-1 Q 4,2 0,4 Q -4,2 -4,-1 Z"
            fill="#ffffff"
          />
        </g>
      )}

      {/* Photo / Video Count Pill */}
      <g transform="translate(0, -9)">
        <rect
          x="-16"
          y="-8"
          width="32"
          height="16"
          rx="8"
          fill={isSelected ? '#f59e0b' : '#0f172a'}
          stroke="#334155"
          strokeWidth="1"
        />
        <text
          x="0"
          y="3.5"
          fill="#ffffff"
          fontSize="10"
          fontWeight="700"
          textAnchor="middle"
          fontFamily="system-ui, sans-serif"
        >
          {location.media.length}
        </text>
      </g>

      {/* Hover Tooltip Overlay (rendered when hovering over pin) */}
      {isHovered && !isSelected && (
        <g transform="translate(0, -68)" className="pointer-events-none">
          <rect
            x="-110"
            y="-40"
            width="220"
            height="40"
            rx="6"
            fill="#0f172a"
            stroke="#334155"
            strokeWidth="1"
            filter="drop-shadow(0 8px 16px rgba(0,0,0,0.5))"
          />
          <path d="M -6,0 L 0,6 L 6,0 Z" fill="#0f172a" />
          <text
            x="0"
            y="-22"
            fill="#f8fafc"
            fontSize="12"
            fontWeight="600"
            textAnchor="middle"
            fontFamily="system-ui, sans-serif"
          >
            {location.title.length > 26 ? `${location.title.substring(0, 24)}…` : location.title}
          </text>
          <text
            x="0"
            y="-8"
            fill="#94a3b8"
            fontSize="10"
            textAnchor="middle"
            fontFamily="system-ui, sans-serif"
          >
            {location.region} • {location.media.length} zdjęć/filmów
          </text>
        </g>
      )}
    </g>
  );
};
