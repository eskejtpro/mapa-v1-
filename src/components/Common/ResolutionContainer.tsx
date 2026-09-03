/**
 * ResolutionContainer - Provides exact Desktop Window dimensions simulation (1440x900, 1920x1080, 1280x800, or Fit)
 */

import React from 'react';
import { WindowResolution } from '../../types';

interface ResolutionContainerProps {
  resolution: WindowResolution;
  children: React.ReactNode;
}

export const ResolutionContainer: React.FC<ResolutionContainerProps> = ({
  resolution,
  children,
}) => {
  if (resolution === 'fit') {
    return (
      <div className="w-screen h-screen overflow-hidden flex flex-col bg-stone-900">
        {children}
      </div>
    );
  }

  // Dimensions mapping
  const dimensionsMap: Record<WindowResolution, { width: string; height: string }> = {
    '1440x900': { width: '1440px', height: '900px' },
    '1920x1080': { width: '1920px', height: '1080px' },
    '1280x800': { width: '1280px', height: '800px' },
    fit: { width: '100%', height: '100%' },
  };

  const dim = dimensionsMap[resolution] || dimensionsMap['1440x900'];

  return (
    <div className="w-screen h-screen overflow-auto bg-stone-950 flex items-center justify-center p-4">
      <div
        id="desktop-window-frame"
        style={{
          width: dim.width,
          height: dim.height,
          maxWidth: '100vw',
          maxHeight: '100vh',
        }}
        className="relative bg-stone-900 rounded-2xl shadow-2xl border border-stone-800 flex flex-col overflow-hidden ring-1 ring-white/10"
      >
        {children}
      </div>
    </div>
  );
};
