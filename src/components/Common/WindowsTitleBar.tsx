/**
 * WindowsTitleBar - Native Windows 10 style desktop title bar simulation
 */

import React from 'react';
import { Minus, Square, X, Monitor, ShieldCheck, MapPin } from 'lucide-react';
import { WindowResolution } from '../../types';

interface WindowsTitleBarProps {
  resolution: WindowResolution;
  onChangeResolution: (res: WindowResolution) => void;
  isOfflineAvailable: boolean;
}

export const WindowsTitleBar: React.FC<WindowsTitleBarProps> = ({
  resolution,
  onChangeResolution,
  isOfflineAvailable,
}) => {
  return (
    <div
      id="windows-title-bar"
      className="h-8 bg-stone-950 border-b border-stone-800/90 px-3 flex items-center justify-between text-xs text-stone-400 select-none z-40 shrink-0"
    >
      {/* Left: Window Icon & Title */}
      <div className="flex items-center gap-2">
        <div className="w-3.5 h-3.5 rounded bg-amber-500 flex items-center justify-center text-[9px] font-bold text-stone-950">
          M
        </div>
        <span className="text-[11px] font-medium text-stone-300">
          Mapa Wspomnień — Aplikacja Desktopowa Windows (PySide6 Ready)
        </span>
      </div>

      {/* Center: Resolution selector & Offline Badge */}
      <div className="hidden sm:flex items-center gap-3">
        {/* Offline Badge */}
        <div className="flex items-center gap-1.5 text-[10px] text-stone-400 bg-stone-900 px-2 py-0.5 rounded border border-stone-800">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isOfflineAvailable ? 'bg-emerald-500' : 'bg-rose-500'
            }`}
          />
          <span>{isOfflineAvailable ? 'Lokalna Baza (Offline)' : 'Brak Mapy'}</span>
        </div>

        {/* Quick Resolution Switcher */}
        <div className="flex items-center gap-1 text-[10px] text-stone-400">
          <Monitor className="w-3 h-3 text-stone-500" />
          <select
            id="titlebar-resolution-select"
            value={resolution}
            onChange={(e) => onChangeResolution(e.target.value as WindowResolution)}
            className="bg-stone-900 border border-stone-800 rounded px-1.5 py-0.5 text-stone-300 text-[10px] focus:outline-none cursor-pointer"
          >
            <option value="fit">Pełne Okno (Dopasowane)</option>
            <option value="1440x900">1440×900 (Desktop Standard)</option>
            <option value="1920x1080">1920×1080 (Full HD)</option>
            <option value="1280x800">1280×800 (Kompaktowy)</option>
          </select>
        </div>
      </div>

      {/* Right: Windows Standard Minimize, Maximize, Close Buttons */}
      <div className="flex items-center -mr-3">
        <button
          className="w-10 h-8 flex items-center justify-center hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition-colors"
          title="Minimalizuj"
          aria-label="Minimalizuj"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onChangeResolution(resolution === 'fit' ? '1440x900' : 'fit')}
          className="w-10 h-8 flex items-center justify-center hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition-colors"
          title="Zmień tryb okna"
          aria-label="Maksymalizuj"
        >
          <Square className="w-3 h-3" />
        </button>
        <button
          className="w-10 h-8 flex items-center justify-center hover:bg-rose-700 text-stone-400 hover:text-white transition-colors"
          title="Zamknij"
          aria-label="Zamknij"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
