/**
 * TimelineGalleryView - Chronological Gallery of all photos and videos grouped by date.
 */

import React, { useState } from 'react';
import {
  Calendar,
  Camera,
  Compass,
  Filter,
  Image as ImageIcon,
  MapPin,
  Play,
  Search,
  Sparkles,
  Video,
} from 'lucide-react';
import { FilterState, MediaItem, MemoryLocation, TimelineDateGroup } from '../../types';
import { getSceneSvgDataUri } from '../../utils/svgPlaceholders';

interface TimelineGalleryViewProps {
  timelineGroups: TimelineDateGroup[];
  allLocations: MemoryLocation[];
  onOpenLightbox: (location: MemoryLocation, mediaIndex: number) => void;
  onJumpToMapLocation: (locationId: string) => void;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export const TimelineGalleryView: React.FC<TimelineGalleryViewProps> = ({
  timelineGroups,
  allLocations,
  onOpenLightbox,
  onJumpToMapLocation,
  filters,
  onFilterChange,
}) => {
  const [selectedMediaType, setSelectedMediaType] = useState<'all' | 'photos' | 'videos'>('all');

  const totalMediaCount = timelineGroups.reduce(
    (sum, group) => sum + group.items.length,
    0
  );

  return (
    <div
      id="timeline-gallery-view"
      className="flex-1 h-full overflow-y-auto bg-stone-950 p-6 select-none custom-scrollbar"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Summary Banner */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Chronologiczne Archiwum Wspomnień</span>
            </div>
            <h2 className="text-2xl font-bold text-stone-100 font-serif">
              Wszystkie Zdjęcia i Filmy
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              Łącznie <strong className="text-stone-200">{totalMediaCount}</strong> plików
              przypisanych do <strong className="text-stone-200">{allLocations.length}</strong> lokalizacji GPS
            </p>
          </div>

          {/* Quick Media Type Filter Tabs */}
          <div className="bg-stone-950 p-1 rounded-xl border border-stone-800 flex items-center gap-1 self-stretch md:self-auto">
            <button
              onClick={() => {
                setSelectedMediaType('all');
                onFilterChange({ ...filters, mediaType: 'all' });
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedMediaType === 'all'
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Wszystkie ({totalMediaCount})
            </button>
            <button
              onClick={() => {
                setSelectedMediaType('photos');
                onFilterChange({ ...filters, mediaType: 'photos' });
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                selectedMediaType === 'photos'
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Zdjęcia</span>
            </button>
            <button
              onClick={() => {
                setSelectedMediaType('videos');
                onFilterChange({ ...filters, mediaType: 'videos' });
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                selectedMediaType === 'videos'
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Filmy</span>
            </button>
          </div>
        </div>

        {/* Empty State in Timeline */}
        {timelineGroups.length === 0 ? (
          <div className="bg-stone-900/50 border border-stone-800/80 rounded-2xl p-12 text-center text-stone-400">
            <ImageIcon className="w-12 h-12 text-stone-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-stone-200">
              Brak multimediów dla wybranych filtrów
            </h3>
            <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
              Spróbuj wyczyścić filtry wyszukiwania lub dodać nowe wspomnienie na mapie.
            </p>
          </div>
        ) : (
          /* Chronological Date Groups */
          timelineGroups.map((group) => (
            <div key={group.sortKey} className="space-y-4">
              {/* Group Month/Year Header with Line */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-stone-200 font-serif">
                  {group.dateGroup}
                </h3>
                <span className="text-xs text-stone-500 font-mono">
                  ({group.items.length} {group.items.length === 1 ? 'plik' : 'plików'})
                </span>
                <div className="flex-1 h-px bg-stone-800" />
              </div>

              {/* Media Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                {group.items.map((item, idx) => {
                  const dataUri = getSceneSvgDataUri(
                    item.media.sceneType,
                    item.media.title,
                    `${item.locationId}-${item.media.id}`
                  );
                  const loc = allLocations.find((l) => l.id === item.locationId);

                  return (
                    <div
                      key={item.media.id}
                      id={`timeline-card-${item.media.id}`}
                      className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-900 border border-stone-800 hover:border-amber-500/70 shadow-lg transition-all transform hover:-translate-y-1"
                    >
                      <img
                        src={dataUri}
                        alt={item.media.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                        onClick={() => {
                          if (loc) {
                            const mediaIndex = loc.media.findIndex(
                              (m) => m.id === item.media.id
                            );
                            onOpenLightbox(loc, Math.max(0, mediaIndex));
                          }
                        }}
                      />

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-black/30 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity" />

                      {/* Type Badge */}
                      <div className="absolute top-2.5 right-2.5 pointer-events-none">
                        {item.media.type === 'video' ? (
                          <span className="px-1.5 py-0.5 rounded-md bg-stone-950/80 backdrop-blur-md border border-stone-700 text-[10px] text-amber-300 font-mono flex items-center gap-1">
                            <Play className="w-2.5 h-2.5 fill-amber-300" />
                            {item.media.duration || '0:45'}
                          </span>
                        ) : (
                          <span className="p-1 rounded-md bg-stone-950/80 backdrop-blur-md border border-stone-700 text-stone-300 block">
                            <Camera className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>

                      {/* Location Jump Button on Hover */}
                      <div className="absolute top-2.5 left-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onJumpToMapLocation(item.locationId);
                          }}
                          className="px-2 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-[10px] flex items-center gap-1 shadow-md"
                          title="Pokaż na mapie"
                        >
                          <Compass className="w-3 h-3" />
                          <span>Pokaż</span>
                        </button>
                      </div>

                      {/* Bottom Info */}
                      <div
                        className="absolute bottom-2.5 inset-x-2.5 cursor-pointer"
                        onClick={() => {
                          if (loc) {
                            const mediaIndex = loc.media.findIndex(
                              (m) => m.id === item.media.id
                            );
                            onOpenLightbox(loc, Math.max(0, mediaIndex));
                          }
                        }}
                      >
                        <p className="text-xs font-semibold text-stone-100 truncate group-hover:text-amber-300 transition-colors">
                          {item.media.title}
                        </p>
                        <div className="flex items-center gap-1 text-[10px] text-stone-400 truncate mt-0.5">
                          <MapPin className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                          <span className="truncate">{item.locationTitle}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
