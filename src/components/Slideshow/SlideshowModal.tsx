/**
 * SlideshowModal - Fullscreen Immersive Country & Location Slideshow Presentation
 * Allows sequential presentation of photos & videos filtered by Country, Region, or specific Location.
 * Supports auto-play with smooth progress timer, speed selection (3s, 5s, 8s, 10s),
 * Ken Burns cinematic animation, video badges, thumbnail strip, and map jump.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  Film,
  Globe,
  Heart,
  Image as ImageIcon,
  MapPin,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  Sliders,
  Sparkles,
  Volume2,
  VolumeX,
  X,
  Zap,
} from 'lucide-react';
import { MediaItem, MemoryLocation } from '../../types';
import { getSceneSvgDataUri } from '../../utils/svgPlaceholders';
import { formatCoordinates } from '../Map/mapProjection';

interface SlideshowItem {
  media: MediaItem;
  location: MemoryLocation;
  indexInLocation: number;
}

interface SlideshowModalProps {
  isOpen: boolean;
  onClose: () => void;
  locations: MemoryLocation[];
  initialCountry?: string;
  initialLocationId?: string;
  onJumpToMap?: (locationId: string) => void;
}

export const SlideshowModal: React.FC<SlideshowModalProps> = ({
  isOpen,
  onClose,
  locations,
  initialCountry,
  initialLocationId,
  onJumpToMap,
}) => {
  // 1. Country & Location Filter State
  const [selectedCountry, setSelectedCountry] = useState<string>(
    initialCountry || (initialLocationId ? locations.find((l) => l.id === initialLocationId)?.country || 'all' : 'all')
  );
  const [selectedLocationFilter, setSelectedLocationFilter] = useState<string>(
    initialLocationId || 'all'
  );
  const [mediaTypeFilter, setMediaTypeFilter] = useState<'all' | 'photos' | 'videos'>('all');

  // 2. Playback State
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [intervalDuration, setIntervalDuration] = useState<number>(5000); // ms: 3000, 5000, 8000, 10000
  const [progress, setProgress] = useState<number>(0); // 0 to 100%
  const [transitionEffect, setTransitionEffect] = useState<'ken-burns' | 'fade' | 'slide'>('ken-burns');
  const [showThumbnails, setShowThumbnails] = useState<boolean>(true);
  const [showInfoOverlay, setShowInfoOverlay] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const progressTimerRef = useRef<number | null>(null);

  // Sync initial country/location when opened
  useEffect(() => {
    if (isOpen) {
      if (initialLocationId) {
        const found = locations.find((l) => l.id === initialLocationId);
        if (found) {
          setSelectedCountry(found.country);
          setSelectedLocationFilter(found.id);
        }
      } else if (initialCountry) {
        setSelectedCountry(initialCountry);
        setSelectedLocationFilter('all');
      } else {
        setSelectedCountry('all');
        setSelectedLocationFilter('all');
      }
      setCurrentIndex(0);
      setProgress(0);
      setIsPlaying(true);
    }
  }, [isOpen, initialCountry, initialLocationId, locations]);

  // Extract all distinct countries from locations
  const availableCountries = useMemo(() => {
    const map = new Map<string, number>();
    locations.forEach((loc) => {
      const c = loc.country || 'Polska';
      map.set(c, (map.get(c) || 0) + loc.media.length);
    });
    return Array.from(map.entries()).map(([country, count]) => ({
      country,
      count,
    }));
  }, [locations]);

  // Flatten and filter all media items matching the chosen criteria
  const slideshowItems: SlideshowItem[] = useMemo(() => {
    const items: SlideshowItem[] = [];

    locations.forEach((loc) => {
      const locCountry = loc.country || 'Polska';
      if (selectedCountry !== 'all' && locCountry !== selectedCountry) {
        return;
      }
      if (selectedLocationFilter !== 'all' && loc.id !== selectedLocationFilter) {
        return;
      }

      loc.media.forEach((media, idx) => {
        if (mediaTypeFilter === 'photos' && media.type !== 'photo') return;
        if (mediaTypeFilter === 'videos' && media.type !== 'video') return;

        items.push({
          media,
          location: loc,
          indexInLocation: idx,
        });
      });
    });

    return items;
  }, [locations, selectedCountry, selectedLocationFilter, mediaTypeFilter]);

  // Keep index within bounds if filtered items list changes
  useEffect(() => {
    if (currentIndex >= slideshowItems.length) {
      setCurrentIndex(0);
      setProgress(0);
    }
  }, [slideshowItems.length, currentIndex]);

  const currentItem = slideshowItems[currentIndex] || null;

  // Next and Prev handlers
  const handleNext = useCallback(() => {
    if (slideshowItems.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % slideshowItems.length);
    setProgress(0);
  }, [slideshowItems.length]);

  const handlePrev = useCallback(() => {
    if (slideshowItems.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + slideshowItems.length) % slideshowItems.length);
    setProgress(0);
  }, [slideshowItems.length]);

  // Auto-play timer & progress animation loop
  useEffect(() => {
    if (!isOpen || !isPlaying || slideshowItems.length <= 1) {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
      return;
    }

    const stepMs = 50; // update 20 times per sec
    const progressIncrement = (stepMs / intervalDuration) * 100;

    progressTimerRef.current = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + progressIncrement;
      });
    }, stepMs);

    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
    };
  }, [isOpen, isPlaying, intervalDuration, slideshowItems.length, handleNext]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'i' || e.key === 'I') {
        e.preventDefault();
        setShowInfoOverlay((v) => !v);
      } else if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        setShowThumbnails((v) => !v);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose]);

  if (!isOpen) return null;

  const currentMedia = currentItem?.media;
  const currentLocation = currentItem?.location;
  const currentSvgUri = currentMedia
    ? getSceneSvgDataUri(
        currentMedia.sceneType,
        currentMedia.title,
        `${currentLocation?.id}-${currentIndex}`
      )
    : '';

  const countryFlagMap: Record<string, string> = {
    Polska: '🇵🇱',
    Włochy: '🇮🇹',
    Norwegia: '🇳🇴',
    Hiszpania: '🇪🇸',
    Chorwacja: '🇭🇷',
    Grecja: '🇬🇷',
    Francja: '🇫🇷',
    Islandia: '🇮🇸',
    Niemcy: '🇩🇪',
  };

  return (
    <div
      ref={containerRef}
      id="slideshow-modal"
      className="fixed inset-0 z-[9999] bg-stone-950/98 backdrop-blur-2xl flex flex-col select-none text-stone-100 overflow-hidden animate-in fade-in duration-300"
    >
      {/* 1. TOP CONTROL BAR */}
      <header className="h-16 bg-stone-900/90 border-b border-stone-800/90 px-5 flex items-center justify-between gap-4 shrink-0 z-30">
        {/* Left: Brand & Country Selector */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold">
            <Play className="w-4 h-4 fill-current ml-0.5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-stone-100 tracking-tight flex items-center gap-1.5">
                <span>Pokaz Slajdów</span>
                <span className="text-stone-400 text-xs font-normal">
                  ({slideshowItems.length > 0 ? `${currentIndex + 1} z ${slideshowItems.length}` : '0'})
                </span>
              </h2>
            </div>
            <p className="text-[11px] text-stone-400">
              {selectedCountry === 'all'
                ? 'Wszystkie kraje i lokalizacje'
                : `Kraj: ${countryFlagMap[selectedCountry] || '🌍'} ${selectedCountry}`}
            </p>
          </div>
        </div>

        {/* Center: Country & Location Filter Pills */}
        <div className="hidden md:flex items-center gap-2 max-w-xl overflow-x-auto custom-scrollbar py-1">
          {/* All Countries button */}
          <button
            id="slideshow-country-all-btn"
            onClick={() => {
              setSelectedCountry('all');
              setSelectedLocationFilter('all');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 border ${
              selectedCountry === 'all'
                ? 'bg-amber-400 text-stone-950 border-amber-300 font-bold shadow-lg shadow-amber-500/20'
                : 'bg-stone-800/80 hover:bg-stone-700 text-stone-300 border-stone-700/60'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Wszystkie kraje</span>
          </button>

          {/* Specific Country Pills */}
          {availableCountries.map((c) => {
            const isSelected = selectedCountry === c.country;
            const flag = countryFlagMap[c.country] || '📍';
            return (
              <button
                key={c.country}
                id={`slideshow-country-btn-${c.country}`}
                onClick={() => {
                  setSelectedCountry(c.country);
                  setSelectedLocationFilter('all');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-amber-400 text-stone-950 border-amber-300 font-bold shadow-lg shadow-amber-500/20'
                    : 'bg-stone-800/80 hover:bg-stone-700 text-stone-300 border-stone-700/60'
                }`}
              >
                <span>{flag}</span>
                <span>{c.country}</span>
                <span className="text-[10px] opacity-75 font-mono">({c.count})</span>
              </button>
            );
          })}
        </div>

        {/* Right: Quick Settings & Close */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Speed Selector */}
          <div className="flex items-center bg-stone-950 border border-stone-800 rounded-xl p-0.5 text-xs">
            <span className="text-[10px] text-stone-400 px-2 flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>Czas:</span>
            </span>
            {[3000, 5000, 8000].map((duration) => (
              <button
                key={duration}
                onClick={() => setIntervalDuration(duration)}
                className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  intervalDuration === duration
                    ? 'bg-amber-500 text-stone-950'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {duration / 1000}s
              </button>
            ))}
          </div>

          {/* Media Type Filter */}
          <div className="hidden sm:flex items-center bg-stone-950 border border-stone-800 rounded-xl p-0.5 text-xs">
            <button
              onClick={() => setMediaTypeFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
                mediaTypeFilter === 'all'
                  ? 'bg-amber-500 text-stone-950'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Wszystko
            </button>
            <button
              onClick={() => setMediaTypeFilter('photos')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 ${
                mediaTypeFilter === 'photos'
                  ? 'bg-amber-500 text-stone-950'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Camera className="w-3 h-3" />
              <span>Zdj.</span>
            </button>
            <button
              onClick={() => setMediaTypeFilter('videos')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 ${
                mediaTypeFilter === 'videos'
                  ? 'bg-amber-500 text-stone-950'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Film className="w-3 h-3" />
              <span>Wideo</span>
            </button>
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700/80 transition-colors"
            title="Pełny ekran (F)"
            aria-label="Pełny ekran"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Close Slideshow */}
          <button
            id="slideshow-close-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-800 hover:bg-red-500/80 text-stone-300 hover:text-white border border-stone-700/80 transition-colors"
            title="Zamknij pokaz slajdów (Esc)"
            aria-label="Zamknij"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. AUTO-PLAY PROGRESS BAR */}
      <div className="w-full h-1 bg-stone-900 overflow-hidden relative">
        <div
          className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 transition-all ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 3. MAIN SLIDESHOW STAGE */}
      <main className="flex-1 relative flex items-center justify-center overflow-hidden bg-black/95">
        {slideshowItems.length === 0 ? (
          <div className="text-center p-8 max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-center mx-auto mb-4 text-stone-500">
              <Camera className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-stone-200 mb-2">Brak zdjęć dla wybranego filtru</h3>
            <p className="text-xs text-stone-400 mb-4 leading-relaxed">
              Zmień wybrany kraj lub rodzaj multimediów w górnym pasku, aby wyświetlić slajdy.
            </p>
            <button
              onClick={() => {
                setSelectedCountry('all');
                setMediaTypeFilter('all');
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs"
            >
              Pokaż wszystkie multimedia
            </button>
          </div>
        ) : (
          currentItem && (
            <div className="relative w-full h-full flex items-center justify-center p-4 md:p-8">
              {/* Media Image or Vector Scene Display with Animation */}
              <div className="relative max-w-6xl max-h-[82vh] w-full h-full flex items-center justify-center rounded-2xl overflow-hidden shadow-2xl bg-stone-950 border border-stone-800/80">
                <img
                  key={currentItem.media.id}
                  src={currentSvgUri}
                  alt={currentItem.media.title}
                  className={`w-full h-full object-contain ${
                    transitionEffect === 'ken-burns' && isPlaying ? 'animate-kenburns' : ''
                  }`}
                />

                {/* Video Play Overlay Indicator if Video */}
                {currentItem.media.type === 'video' && (
                  <div className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-stone-950/80 backdrop-blur-xl border border-amber-500/40 flex items-center gap-2 text-xs text-amber-300 font-mono shadow-2xl">
                    <Film className="w-4 h-4 text-amber-400" />
                    <span>Odtwarzanie wideo: {currentItem.media.duration || '0:45'}</span>
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  </div>
                )}

                {/* Bottom-left Location Caption Card */}
                {showInfoOverlay && (
                  <div className="absolute bottom-4 left-4 right-4 md:right-auto md:max-w-xl bg-stone-950/85 backdrop-blur-xl border border-stone-800/90 rounded-2xl p-4 shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-200">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/40 uppercase tracking-wider flex items-center gap-1">
                        <span>{countryFlagMap[currentLocation?.country || 'Polska'] || '📍'}</span>
                        <span>{currentLocation?.country || 'Polska'}</span>
                      </span>

                      <span className="text-[11px] text-stone-400 font-medium">
                        {currentLocation?.region}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-stone-100 font-serif leading-tight mb-1">
                      {currentItem.media.title}
                    </h3>

                    <div className="text-xs text-stone-300 flex items-center gap-2 mb-2 font-mono">
                      <span>{currentLocation?.title}</span>
                      <span className="text-stone-600">•</span>
                      <span className="text-stone-400">{currentItem.media.timestamp.split(' ')[0]}</span>
                    </div>

                    {currentItem.media.description && (
                      <p className="text-xs text-stone-300/90 italic line-clamp-2 leading-relaxed mb-3">
                        „{currentItem.media.description}”
                      </p>
                    )}

                    {/* Actions: Jump to Map */}
                    <div className="flex items-center justify-between pt-2 border-t border-stone-800/80">
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-stone-400">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        <span>
                          {currentLocation?.coordinates.lat.toFixed(4)}° N,{' '}
                          {currentLocation?.coordinates.lng.toFixed(4)}° E
                        </span>
                      </div>

                      {onJumpToMap && currentLocation && (
                        <button
                          onClick={() => {
                            onClose();
                            onJumpToMap(currentLocation.id);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 hover:text-amber-200 text-xs font-semibold flex items-center gap-1.5 border border-stone-700 transition-colors"
                        >
                          <Compass className="w-3.5 h-3.5" />
                          <span>Pokaż na mapie</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Left / Right Floating Buttons */}
              <button
                id="slideshow-prev-btn"
                onClick={handlePrev}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 rounded-2xl bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700/80 shadow-2xl transition-all transform hover:scale-110 active:scale-95"
                title="Poprzedni slajd (Strzałka w lewo)"
                aria-label="Poprzedni slajd"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                id="slideshow-next-btn"
                onClick={handleNext}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 rounded-2xl bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700/80 shadow-2xl transition-all transform hover:scale-110 active:scale-95"
                title="Następny slajd (Strzałka w prawo)"
                aria-label="Następny slajd"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )
        )}
      </main>

      {/* 4. BOTTOM PLAYBAR & THUMBNAIL STRIP */}
      <footer className="bg-stone-900/95 border-t border-stone-800/90 p-3 flex flex-col gap-2 shrink-0 z-30">
        {/* Playback Controls Strip */}
        <div className="flex items-center justify-between gap-4 px-2">
          {/* Left: Info toggle and Transition style */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowInfoOverlay(!showInfoOverlay)}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                showInfoOverlay
                  ? 'bg-stone-800 text-stone-200 border-stone-700'
                  : 'bg-stone-950 text-stone-400 border-stone-800'
              }`}
              title="Przełącz opis slajdu (Klawisz I)"
            >
              <span>Opis (I)</span>
            </button>

            <button
              onClick={() => setShowThumbnails(!showThumbnails)}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                showThumbnails
                  ? 'bg-stone-800 text-stone-200 border-stone-700'
                  : 'bg-stone-950 text-stone-400 border-stone-800'
              }`}
              title="Przełącz miniatury (Klawisz T)"
            >
              <span>Miniatury (T)</span>
            </button>
          </div>

          {/* Center: Play / Pause Button & Counter */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
              title="Poprzedni (←)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              id="slideshow-play-pause-btn"
              onClick={() => setIsPlaying(!isPlaying)}
              className="h-10 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all transform active:scale-95"
              title={isPlaying ? 'Pauza (Spacja)' : 'Wznów pokaz (Spacja)'}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-stone-950" />
                  <span>Pauza</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-stone-950" />
                  <span>Odtwarzaj</span>
                </>
              )}
            </button>

            <button
              onClick={handleNext}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
              title="Następny (→)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right: Slide Count and Keyboard Hint */}
          <div className="hidden lg:flex items-center gap-2 text-[11px] text-stone-400">
            <span className="font-mono bg-stone-950 px-2 py-1 rounded-lg border border-stone-800 text-stone-300">
              Spacja: Pauza | ← →: Nawigacja | F: Pełny ekran
            </span>
          </div>
        </div>

        {/* Thumbnail Filmstrip */}
        {showThumbnails && slideshowItems.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pt-1 pb-0.5">
            {slideshowItems.map((item, idx) => {
              const isSelected = idx === currentIndex;
              const thumbUri = getSceneSvgDataUri(
                item.media.sceneType,
                item.media.title,
                `${item.location.id}-${idx}`
              );

              return (
                <button
                  key={`${item.location.id}-${item.media.id}-${idx}`}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setProgress(0);
                  }}
                  className={`group relative h-14 w-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all transform hover:-translate-y-0.5 ${
                    isSelected
                      ? 'border-amber-400 ring-2 ring-amber-400/40 scale-105 shadow-lg'
                      : 'border-stone-800 opacity-60 hover:opacity-100'
                  }`}
                  title={`${item.media.title} (${item.location.title})`}
                >
                  <img src={thumbUri} alt={item.media.title} className="w-full h-full object-cover" />
                  {item.media.type === 'video' && (
                    <div className="absolute top-1 right-1 p-0.5 rounded bg-black/80 text-amber-300">
                      <Play className="w-2 h-2 fill-current" />
                    </div>
                  )}
                  <span className="absolute bottom-0 inset-x-0 bg-stone-950/80 text-[8px] font-mono text-center truncate px-1 text-stone-300">
                    {idx + 1}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </footer>
    </div>
  );
};
