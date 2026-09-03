/**
 * LocationGalleryModal - Fullscreen gallery view for a single location
 */

import React, { useState } from 'react';
import {
  Calendar,
  Camera,
  ChevronLeft,
  Copy,
  Download,
  ExternalLink,
  Filter,
  Heart,
  Image as ImageIcon,
  MapPin,
  Maximize2,
  Play,
  Share2,
  Tag,
  Video,
  X,
} from 'lucide-react';
import { MediaItem, MemoryLocation } from '../../types';
import { getSceneSvgDataUri } from '../../utils/svgPlaceholders';
import { formatCoordinates } from '../Map/mapProjection';

interface LocationGalleryModalProps {
  location: MemoryLocation;
  onClose: () => void;
  onOpenLightbox: (location: MemoryLocation, index: number) => void;
  onToggleFavorite: (locationId: string) => void;
  onOpenSlideshow?: (location: MemoryLocation) => void;
}

export const LocationGalleryModal: React.FC<LocationGalleryModalProps> = ({
  location,
  onClose,
  onOpenLightbox,
  onToggleFavorite,
  onOpenSlideshow,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'photos' | 'videos'>('all');
  const [searchFilter, setSearchFilter] = useState('');

  const coordsFmt = formatCoordinates(location.coordinates);

  const filteredMedia = location.media.filter((m) => {
    if (filterType === 'photos' && m.type !== 'photo') return false;
    if (filterType === 'videos' && m.type !== 'video') return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      return (
        m.title.toLowerCase().includes(q) ||
        m.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div
      id="location-gallery-modal"
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col select-none animate-in fade-in duration-200"
    >
      {/* 1. Header Toolbar */}
      <div className="h-16 bg-stone-950 border-b border-stone-800 px-6 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-800 transition-colors"
            title="Powrót do mapy (Esc)"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-stone-100 font-serif">
                {location.title}
              </h2>
              {location.isFavorite && (
                <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-semibold border border-red-500/30">
                  Ulubione
                </span>
              )}
            </div>
            <p className="text-xs text-stone-400">
              {location.region} • {coordsFmt.decimal}
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Slideshow button */}
          {onOpenSlideshow && (
            <button
              id="gallery-slideshow-btn"
              onClick={() => onOpenSlideshow(location)}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/10 transition-colors"
              title="Uruchom pokaz slajdów dla tej lokalizacji i kraju"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Pokaz slajdów</span>
            </button>
          )}

          {/* Favorite toggle */}
          <button
            onClick={() => onToggleFavorite(location.id)}
            className={`p-2 rounded-xl border transition-colors ${
              location.isFavorite
                ? 'bg-red-500/20 text-red-400 border-red-500/40'
                : 'bg-stone-900 text-stone-400 hover:text-stone-200 border-stone-800'
            }`}
            title="Dodaj/usuń z ulubionych"
          >
            <Heart className={`w-4 h-4 ${location.isFavorite ? 'fill-red-400' : ''}`} />
          </button>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-800 transition-colors"
            title="Zamknij"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. Subheader Controls: Filter Tabs & Search */}
      <div className="bg-stone-900/90 border-b border-stone-800 px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
        {/* Type Tabs */}
        <div className="bg-stone-950 p-1 rounded-xl border border-stone-800 flex items-center gap-1">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              filterType === 'all'
                ? 'bg-amber-500 text-stone-950'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Wszystkie ({location.media.length})
          </button>
          <button
            onClick={() => setFilterType('photos')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              filterType === 'photos'
                ? 'bg-amber-500 text-stone-950'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Zdjęcia ({location.mediaCount.photos})</span>
          </button>
          <button
            onClick={() => setFilterType('videos')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              filterType === 'videos'
                ? 'bg-amber-500 text-stone-950'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Filmy ({location.mediaCount.videos})</span>
          </button>
        </div>

        {/* Search inside location */}
        <input
          type="text"
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          placeholder="Filtruj zdjęcia po nazwie lub tagu..."
          className="w-full sm:w-64 h-8 px-3 rounded-lg bg-stone-950 border border-stone-800 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500/80"
        />
      </div>

      {/* 3. Media Grid */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        {filteredMedia.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center text-stone-400">
            <ImageIcon className="w-12 h-12 text-stone-600 mb-3" />
            <p className="text-sm font-semibold text-stone-200">Brak pasujących elementów</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredMedia.map((item) => {
              const originalIndex = location.media.findIndex((m) => m.id === item.id);
              const dataUri = getSceneSvgDataUri(
                item.sceneType,
                item.title,
                `${location.id}-${item.id}`
              );

              return (
                <div
                  key={item.id}
                  onClick={() => onOpenLightbox(location, originalIndex)}
                  className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-900 border border-stone-800 hover:border-amber-500/70 shadow-lg cursor-pointer transition-all transform hover:-translate-y-1"
                >
                  <img
                    src={dataUri}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-black/30 opacity-80 group-hover:opacity-100 transition-opacity" />

                  {/* Badge */}
                  <div className="absolute top-2.5 right-2.5">
                    {item.type === 'video' ? (
                      <span className="px-1.5 py-0.5 rounded-md bg-stone-950/80 backdrop-blur-md border border-stone-700 text-[10px] text-amber-300 font-mono flex items-center gap-1">
                        <Play className="w-2.5 h-2.5 fill-amber-300" />
                        {item.duration || '0:45'}
                      </span>
                    ) : (
                      <span className="p-1 rounded-md bg-stone-950/80 backdrop-blur-md border border-stone-700 text-stone-300 block">
                        <Camera className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>

                  {/* Bottom Text */}
                  <div className="absolute bottom-2.5 inset-x-2.5">
                    <p className="text-xs font-semibold text-stone-100 truncate group-hover:text-amber-300">
                      {item.title}
                    </p>
                    <p className="text-[10px] text-stone-400 font-mono">
                      {item.timestamp}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
