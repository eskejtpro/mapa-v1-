/**
 * ClusterMarker - Groups nearby memories when zoomed out
 */

import React, { useState } from 'react';
import { MemoryLocation } from '../../types';

interface ClusterMarkerProps {
  locations: MemoryLocation[];
  x: number;
  y: number;
  zoom: number;
  onExpand: (locations: MemoryLocation[], center: { x: number; y: number }) => void;
}

export const ClusterMarker: React.FC<ClusterMarkerProps> = ({
  locations,
  x,
  y,
  zoom,
  onExpand,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const totalMedia = locations.reduce((sum, loc) => sum + loc.media.length, 0);

  const scale = Math.max(0.7, Math.min(1.2, 1 / Math.sqrt(zoom)));

  return (
    <g
      id={`cluster-${locations.map((l) => l.id).join('-')}`}
      transform={`translate(${x}, ${y}) scale(${scale})`}
      className="cursor-pointer transition-transform duration-200 select-none group"
      onClick={(e) => {
        e.stopPropagation();
        onExpand(locations, { x, y });
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      aria-label={`Klaster: ${locations.length} wspomnień, ${totalMedia} plików`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onExpand(locations, { x, y });
        }
      }}
    >
      {/* Outer Pulse Ring */}
      <circle
        cx="0"
        cy="0"
        r="32"
        fill="#f59e0b"
        opacity={isHovered ? '0.35' : '0.2'}
        className="transition-opacity duration-200"
      />

      {/* Middle Ring */}
      <circle
        cx="0"
        cy="0"
        r="24"
        fill="#d97706"
        opacity="0.5"
      />

      {/* Inner Solid Badge */}
      <circle
        cx="0"
        cy="0"
        r="18"
        fill="#b45309"
        stroke="#ffffff"
        strokeWidth="2.5"
        filter="drop-shadow(0 4px 6px rgba(0,0,0,0.4))"
      />

      {/* Memory Count */}
      <text
        x="0"
        y="5"
        fill="#ffffff"
        fontSize="12"
        fontWeight="800"
        textAnchor="middle"
        fontFamily="system-ui, sans-serif"
      >
        {locations.length}
      </text>

      {/* Cluster Label Pill below */}
      <g transform="translate(0, 26)">
        <rect
          x="-35"
          y="-6"
          width="70"
          height="14"
          rx="7"
          fill="#0f172a"
          stroke="#475569"
          strokeWidth="1"
        />
        <text
          x="0"
          y="4.5"
          fill="#e2e8f0"
          fontSize="9"
          fontWeight="600"
          textAnchor="middle"
          fontFamily="system-ui, sans-serif"
        >
          {totalMedia} plików
        </text>
      </g>

      {/* Tooltip on Hover */}
      {isHovered && (
        <g transform="translate(0, -42)" className="pointer-events-none">
          <rect
            x="-100"
            y="-34"
            width="200"
            height="34"
            rx="6"
            fill="#0f172a"
            stroke="#f59e0b"
            strokeWidth="1"
            filter="drop-shadow(0 8px 16px rgba(0,0,0,0.6))"
          />
          <path d="M -5,0 L 0,5 L 5,0 Z" fill="#0f172a" />
          <text
            x="0"
            y="-18"
            fill="#f8fafc"
            fontSize="11"
            fontWeight="600"
            textAnchor="middle"
            fontFamily="system-ui, sans-serif"
          >
            {locations.length} wspomnienia w tym rejonie
          </text>
          <text
            x="0"
            y="-6"
            fill="#fbbf24"
            fontSize="9.5"
            textAnchor="middle"
            fontFamily="system-ui, sans-serif"
          >
            Kliknij, aby przybliżyć
          </text>
        </g>
      )}
    </g>
  );
};
