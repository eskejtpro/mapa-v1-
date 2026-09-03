/**
 * LightboxModal - Fullscreen photo/video viewer with EXIF metadata sidebar and keyboard navigation
 */

import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Camera,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  Copy,
  Download,
  Eye,
  FileText,
  Film,
  HardDrive,
  Info,
  Layers,
  MapPin,
  Maximize2,
  Minimize2,
  Play,
  RotateCw,
  Share2,
  Sparkles,
  Tag,
  Volume2,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { MediaItem, MemoryLocation } from '../../types';
import { getSceneSvgDataUri } from '../../utils/svgPlaceholders';
import { formatCoordinates } from '../Map/mapProjection';

interface LightboxModalProps {
  location: MemoryLocation;
  initialIndex: number;
  onClose: () => void;
  onJumpToMap?: (locationId: string) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  location,
  initialIndex,
  onClose,
  onJumpToMap,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [showMetadata, setShowMetadata] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  const currentMedia: MediaItem = location.media[currentIndex] || location.media[0];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'i' || e.key === 'I') setShowMetadata((prev) => !prev);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, location.media.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % location.media.length);
    setZoomLevel(1);
    setRotation(0);
    setIsPlayingVideo(false);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + location.media.length) % location.media.length);
    setZoomLevel(1);
    setRotation(0);
    setIsPlayingVideo(false);
  };

  const coordsFmt = formatCoordinates(location.coordinates);
  const dataUri = getSceneSvgDataUri(
    currentMedia.sceneType,
    currentMedia.title,
    `${location.id}-${currentMedia.id}`
  );

  return (
    <div
      id="lightbox-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col select-none animate-in fade-in duration-200"
    >
      {/* 1. Lightbox Header */}
      <div className="h-14 bg-stone-950/80 border-b border-stone-800 px-4 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <button
            id="lightbox-close-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-800 transition-colors"
            title="Zamknij podgląd (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
          <div>
            <h3 className="text-sm font-semibold text-stone-100 truncate max-w-md">
              {currentMedia.title}
            </h3>
            <p className="text-[11px] text-stone-400">
              {location.title} • {currentIndex + 1} z {location.media.length}
            </p>
          </div>
        </div>

        {/* Toolbar Controls: Zoom, Rotate, Metadata Toggle */}
        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div className="hidden sm:flex items-center bg-stone-900 border border-stone-800 rounded-xl p-0.5">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.25))}
              className="p-1.5 text-stone-400 hover:text-stone-200"
              title="Oddal"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono px-2 text-stone-400">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(3, z + 0.25))}
              className="p-1.5 text-stone-400 hover:text-stone-200"
              title="Przybliż"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Rotate */}
          <button
            onClick={() => setRotation((r) => (r + 90) % 360)}
            className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-800 transition-colors"
            title="Obróć o 90°"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          {/* Metadata Inspector Toggle */}
          <button
            onClick={() => setShowMetadata(!showMetadata)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              showMetadata
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-stone-900 hover:bg-stone-800 text-stone-400 border-stone-800'
            }`}
            title="Szczegóły EXIF i GPS (I)"
          >
            <Info className="w-4 h-4" />
            <span className="hidden md:inline">Dane EXIF & GPS</span>
          </button>
        </div>
      </div>

      {/* 2. Main Stage (Image/Video + Navigation Buttons + Metadata Drawer) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Arrow Button */}
        <button
          id="lightbox-prev-btn"
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-2xl bg-stone-950/70 hover:bg-stone-900 text-stone-300 hover:text-white border border-stone-800 flex items-center justify-center shadow-2xl transition-all"
          title="Poprzednie (Strzałka w lewo)"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Center Viewer Canvas */}
        <div className="flex-1 h-full flex items-center justify-center p-6 overflow-hidden relative">
          <div
            className="relative max-w-full max-h-full flex items-center justify-center transition-transform duration-200"
            style={{
              transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
            }}
          >
            <img
              src={dataUri}
              alt={currentMedia.title}
              className="max-h-[82vh] max-w-[85vw] object-contain rounded-xl shadow-2xl border border-stone-800/80 pointer-events-none"
            />

            {/* Video Play Simulation Overlay */}
            {currentMedia.type === 'video' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 rounded-xl">
                <button
                  onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                  className="w-16 h-16 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 flex items-center justify-center shadow-2xl transition-transform transform hover:scale-110 pointer-events-auto"
                >
                  <Play className="w-8 h-8 fill-stone-950 ml-1" />
                </button>
                <div className="mt-4 px-3 py-1 bg-stone-950/90 rounded-full border border-stone-700 text-xs text-amber-300 font-mono">
                  {isPlayingVideo ? 'Odtwarzanie symulacji...' : `Wideo: ${currentMedia.duration || '0:45'}`}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Arrow Button */}
        <button
          id="lightbox-next-btn"
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-2xl bg-stone-950/70 hover:bg-stone-900 text-stone-300 hover:text-white border border-stone-800 flex items-center justify-center shadow-2xl transition-all"
          title="Następne (Strzałka w prawo)"
          style={{ right: showMetadata ? '340px' : '16px' }}
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* 3. Metadata & EXIF Sidebar Drawer */}
        {showMetadata && (
          <aside
            id="lightbox-exif-drawer"
            className="w-80 bg-stone-950 border-l border-stone-800 p-5 flex flex-col gap-5 overflow-y-auto z-20 shadow-2xl custom-scrollbar"
          >
            <div>
              <div className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider mb-1">
                Informacje o pliku
              </div>
              <h4 className="text-sm font-bold text-stone-100">{currentMedia.fileName}</h4>
              <p className="text-xs text-stone-400 font-mono mt-0.5">
                {currentMedia.fileSizeFormatted} • {currentMedia.type === 'video' ? 'Wideo MP4' : 'Obraz JPEG'}
              </p>
            </div>

            {/* Location & GPS Card */}
            <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-200">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{location.title}</span>
              </div>
              <div className="text-[11px] text-stone-400">{location.region}</div>
              <div className="font-mono text-xs text-amber-400/90 pt-1 border-t border-stone-800">
                {coordsFmt.decimal}
              </div>

              {onJumpToMap && (
                <button
                  onClick={() => {
                    onClose();
                    onJumpToMap(location.id);
                  }}
                  className="w-full mt-2 py-1.5 px-2.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-amber-500/30"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Pokaż na mapie</span>
                </button>
              )}
            </div>

            {/* EXIF Data Parameters */}
            <div className="space-y-3">
              <div className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                Metadane Aparatu (EXIF)
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-stone-900/60 p-2.5 rounded-xl border border-stone-800">
                  <div className="text-[10px] text-stone-500">Aparat</div>
                  <div className="font-semibold text-stone-200 truncate">
                    {currentMedia.exif?.cameraModel || 'Sony A7 IV'}
                  </div>
                </div>

                <div className="bg-stone-900/60 p-2.5 rounded-xl border border-stone-800">
                  <div className="text-[10px] text-stone-500">Ogniskowa</div>
                  <div className="font-semibold text-stone-200">
                    {currentMedia.exif?.focalLength || '35 mm'}
                  </div>
                </div>

                <div className="bg-stone-900/60 p-2.5 rounded-xl border border-stone-800">
                  <div className="text-[10px] text-stone-500">Przysłona</div>
                  <div className="font-semibold text-stone-200 font-mono">
                    {currentMedia.exif?.aperture || 'f/5.6'}
                  </div>
                </div>

                <div className="bg-stone-900/60 p-2.5 rounded-xl border border-stone-800">
                  <div className="text-[10px] text-stone-500">Czas naśw.</div>
                  <div className="font-semibold text-stone-200 font-mono">
                    {currentMedia.exif?.shutterSpeed || '1/500s'}
                  </div>
                </div>

                <div className="bg-stone-900/60 p-2.5 rounded-xl border border-stone-800">
                  <div className="text-[10px] text-stone-500">ISO</div>
                  <div className="font-semibold text-stone-200 font-mono">
                    {currentMedia.exif?.iso || 100}
                  </div>
                </div>

                <div className="bg-stone-900/60 p-2.5 rounded-xl border border-stone-800">
                  <div className="text-[10px] text-stone-500">Data zrobienia</div>
                  <div className="font-semibold text-stone-200 truncate">
                    {currentMedia.timestamp}
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            {currentMedia.tags && currentMedia.tags.length > 0 && (
              <div className="space-y-1.5">
                <div className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                  Tagi pliku
                </div>
                <div className="flex flex-wrap gap-1">
                  {currentMedia.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-md bg-stone-900 text-stone-300 text-[10px] border border-stone-800"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </aside>
        )}
      </div>

      {/* 3. Bottom Filmstrip Thumbnail Bar */}
      <div className="h-20 bg-stone-950/90 border-t border-stone-800 px-4 flex items-center justify-center gap-2 overflow-x-auto z-10 shrink-0 custom-scrollbar">
        {location.media.map((item, idx) => {
          const thumbUri = getSceneSvgDataUri(item.sceneType, item.title, `${location.id}-${idx}`);
          const isActive = idx === currentIndex;

          return (
            <button
              key={item.id}
              onClick={() => {
                setCurrentIndex(idx);
                setZoomLevel(1);
                setRotation(0);
              }}
              className={`relative h-14 aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                isActive
                  ? 'border-amber-500 scale-105 shadow-lg shadow-amber-500/20'
                  : 'border-transparent opacity-50 hover:opacity-100'
              }`}
            >
              <img src={thumbUri} alt={item.title} className="w-full h-full object-cover" />
              {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Play className="w-3.5 h-3.5 fill-white text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
