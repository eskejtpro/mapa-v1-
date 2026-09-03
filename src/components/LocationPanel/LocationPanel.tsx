/**
 * LocationPanel - Side panel displaying details, GPS data, and media thumbnails of the selected memory.
 * Occupies ~30% of the main application viewport.
 */

import React, { useState } from 'react';
import {
  Calendar,
  Camera,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  Check,
  ExternalLink,
  Heart,
  Image as ImageIcon,
  Layers,
  MapPin,
  Maximize2,
  Navigation,
  Play,
  Share2,
  Sparkles,
  Tag,
  Video,
  X,
} from 'lucide-react';
import { MediaItem, MemoryLocation } from '../../types';
import { getSceneSvgDataUri } from '../../utils/svgPlaceholders';
import { formatCoordinates } from '../Map/mapProjection';

interface LocationPanelProps {
  location: MemoryLocation | null;
  onClose: () => void;
  onOpenFullGallery: (location: MemoryLocation) => void;
  onOpenLightbox: (location: MemoryLocation, mediaIndex: number) => void;
  onToggleFavorite: (locationId: string) => void;
  onAddMorePhotos?: (location: MemoryLocation) => void;
  onOpenSlideshow?: (location: MemoryLocation) => void;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
}

export const LocationPanel: React.FC<LocationPanelProps> = ({
  location,
  onClose,
  onOpenFullGallery,
  onOpenLightbox,
  onToggleFavorite,
  onAddMorePhotos,
  onOpenSlideshow,
  onNavigateNext,
  onNavigatePrev,
}) => {
  const [copiedCoords, setCopiedCoords] = useState(false);
  const [useDmsFormat, setUseDmsFormat] = useState(false);

  if (!location) {
    return (
      <aside
        id="location-panel-empty"
        className="w-[380px] lg:w-[420px] h-full bg-stone-900 border-l border-stone-800 p-6 flex flex-col items-center justify-center text-center text-stone-400 select-none"
      >
        <div className="w-16 h-16 rounded-2xl bg-stone-800/80 border border-stone-700/60 flex items-center justify-center mb-4 text-stone-500">
          <MapPin className="w-8 h-8" />
        </div>
        <h3 className="text-base font-semibold text-stone-200 mb-1">Brak wybranej lokalizacji</h3>
        <p className="text-xs text-stone-400 max-w-xs leading-relaxed">
          Wybierz pinezkę na mapie lub skorzystaj z wyszukiwarki, aby wyświetlić szczegóły wspomnienia i zdjęcia.
        </p>
      </aside>
    );
  }

  const coordsFormatted = formatCoordinates(location.coordinates);

  const handleCopyCoords = () => {
    const textToCopy = `${location.coordinates.lat}, ${location.coordinates.lng}`;
    navigator.clipboard?.writeText(textToCopy);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2000);
  };

  return (
    <aside
      id="location-panel"
      className="w-[380px] lg:w-[430px] h-full bg-stone-900 border-l border-stone-800/80 flex flex-col z-20 shadow-2xl overflow-hidden transition-all"
    >
      {/* 1. Header Toolbar */}
      <div className="p-4 border-b border-stone-800 flex items-center justify-between bg-stone-900/90 backdrop-blur-md">
        <div className="flex items-center gap-1">
          {onNavigatePrev && (
            <button
              onClick={onNavigatePrev}
              className="p-1.5 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition-colors"
              title="Poprzednia lokalizacja"
              aria-label="Poprzednia lokalizacja"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          {onNavigateNext && (
            <button
              onClick={onNavigateNext}
              className="p-1.5 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition-colors"
              title="Następna lokalizacja"
              aria-label="Następna lokalizacja"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Favorite Toggle Button */}
          <button
            id="location-favorite-toggle-btn"
            onClick={() => onToggleFavorite(location.id)}
            className={`p-2 rounded-xl border transition-all ${
              location.isFavorite
                ? 'bg-red-500/15 text-red-400 border-red-500/30'
                : 'bg-stone-800/60 hover:bg-stone-800 text-stone-400 border-stone-700/60'
            }`}
            title={location.isFavorite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
            aria-label="Ulubione"
          >
            <Heart className={`w-4 h-4 ${location.isFavorite ? 'fill-red-400' : ''}`} />
          </button>

          {/* Close Panel Button */}
          <button
            id="location-panel-close-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-800/60 hover:bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-700/60 transition-colors"
            title="Zamknij panel"
            aria-label="Zamknij panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Scrollable Body Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
        {/* Title & Region */}
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1.5">
            <MapPin className="w-3.5 h-3.5" />
            <span>{location.region}</span>
          </div>
          <h2 className="text-xl font-bold text-stone-100 font-serif leading-tight">
            {location.title}
          </h2>
        </div>

        {/* GPS Coordinates Card */}
        <div className="bg-stone-950/60 border border-stone-800/90 rounded-2xl p-3.5 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
              Współrzędne GPS
            </span>
            <button
              onClick={() => setUseDmsFormat(!useDmsFormat)}
              className="text-[10px] text-amber-400 hover:underline font-mono"
            >
              {useDmsFormat ? 'Format DMS' : 'Format Dziesiętny'}
            </button>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="font-mono text-xs font-medium text-stone-200 truncate">
              {useDmsFormat ? coordsFormatted.dms : coordsFormatted.decimal}
            </div>

            <button
              id="copy-coords-btn"
              onClick={handleCopyCoords}
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors flex items-center gap-1 text-[11px]"
              title="Kopiuj współrzędne"
            >
              {copiedCoords ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Skopiowano</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Kopiuj</span>
                </>
              )}
            </button>
          </div>

          {location.coordinates.altitude && (
            <div className="text-[11px] text-stone-500 font-mono">
              Wysokość n.p.m.: ~{location.coordinates.altitude} m
            </div>
          )}
        </div>

        {/* Date & Media Counts Strip */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-stone-800/40 border border-stone-800 rounded-xl p-2.5 flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="truncate">
              <div className="text-[10px] text-stone-400 uppercase font-medium">Data</div>
              <div className="text-xs font-semibold text-stone-200 truncate">
                {location.dateRange}
              </div>
            </div>
          </div>

          <div className="bg-stone-800/40 border border-stone-800 rounded-xl p-2.5 flex items-center gap-2.5">
            <Camera className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <div className="text-[10px] text-stone-400 uppercase font-medium">Multimedia</div>
              <div className="text-xs font-semibold text-stone-200">
                {location.mediaCount.photos} zdj. • {location.mediaCount.videos} wid.
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {location.description && (
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
              Notatki & Wspomnienia
            </span>
            <p className="text-xs text-stone-300 leading-relaxed bg-stone-800/20 p-3 rounded-xl border border-stone-800/50 italic">
              „{location.description}”
            </p>
          </div>
        )}

        {/* Tags */}
        {location.tags && location.tags.length > 0 && (
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-3 h-3 text-stone-400" />
              <span>Tagi</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {location.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-lg bg-stone-800 text-stone-300 text-[11px] font-medium border border-stone-700/50"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Media Miniatures Grid (Photos & Videos) */}
        <div className="space-y-3 pt-2 border-t border-stone-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-200 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
              <span>Zdjęcia i filmy ({location.media.length})</span>
            </span>
            <button
              id="open-full-gallery-header-btn"
              onClick={() => onOpenFullGallery(location)}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition-colors"
            >
              <span>Pełny ekran</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          {/* Miniature Grid */}
          <div className="grid grid-cols-2 gap-2">
            {location.media.map((media, idx) => {
              const dataUri = getSceneSvgDataUri(media.sceneType, media.title, `${location.id}-${idx}`);
              return (
                <div
                  key={media.id}
                  id={`media-card-${media.id}`}
                  onClick={() => onOpenLightbox(location, idx)}
                  className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-stone-950 border border-stone-800 hover:border-amber-500/60 cursor-pointer shadow-md transition-all transform hover:-translate-y-0.5"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      onOpenLightbox(location, idx);
                    }
                  }}
                >
                  <img
                    src={dataUri}
                    alt={media.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-transparent to-black/20 opacity-80 group-hover:opacity-100 transition-opacity" />

                  {/* Media Type Badge (Video Play icon) */}
                  {media.type === 'video' ? (
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-stone-950/80 backdrop-blur-md border border-stone-700/60 flex items-center gap-1 text-[10px] text-amber-300 font-mono">
                      <Play className="w-2.5 h-2.5 fill-amber-300" />
                      <span>{media.duration || '0:45'}</span>
                    </div>
                  ) : (
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-stone-950/80 backdrop-blur-md border border-stone-700/60 flex items-center gap-1 text-[10px] text-stone-300">
                      <Camera className="w-2.5 h-2.5 text-stone-400" />
                    </div>
                  )}

                  {/* Caption */}
                  <div className="absolute bottom-2 inset-x-2">
                    <p className="text-[11px] font-semibold text-stone-100 truncate leading-tight">
                      {media.title}
                    </p>
                    <p className="text-[10px] text-stone-400 truncate">
                      {media.timestamp.split(' ')[0]}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Footer Action Button */}
      <div className="p-4 border-t border-stone-800 bg-stone-900/95 flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            id="location-open-gallery-primary-btn"
            onClick={() => onOpenFullGallery(location)}
            className="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/10 transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Galeria</span>
          </button>

          {onOpenSlideshow && (
            <button
              id="location-open-slideshow-btn"
              onClick={() => onOpenSlideshow(location)}
              className="py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-400 hover:text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-amber-500/30 hover:border-amber-400 transition-colors"
              title="Odtwórz pokaz slajdów dla tej lokalizacji i kraju"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Pokaz slajdów</span>
            </button>
          )}
        </div>

        {onAddMorePhotos && (
          <button
            onClick={() => onAddMorePhotos(location)}
            className="w-full py-2 px-4 rounded-xl bg-stone-800/80 hover:bg-stone-750 text-stone-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-stone-700/50"
          >
            <Camera className="w-3.5 h-3.5 text-amber-400" />
            <span>Dodaj zdjęcia / wideo do tej pinezki</span>
          </button>
        )}
      </div>
    </aside>
  );
};
