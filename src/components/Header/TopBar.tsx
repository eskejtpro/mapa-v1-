/**
 * TopBar - Primary Application Navigation & Control Header
 */

import React, { useRef, useState } from 'react';
import {
  Calendar,
  Compass,
  Filter,
  Image as ImageIcon,
  Layers,
  Map as MapIcon,
  MapPin,
  Play,
  Plus,
  Search,
  Settings,
  Sparkles,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { FilterState, MemoryLocation } from '../../types';

interface TopBarProps {
  currentView: 'map' | 'timeline';
  onChangeView: (view: 'map' | 'timeline') => void;
  onOpenAddModal: () => void;
  onOpenFiltersModal: () => void;
  onOpenSettingsModal: () => void;
  onOpenSlideshow?: () => void;
  filters: FilterState;
  onSearchChange: (query: string) => void;
  allLocations: MemoryLocation[];
  onSelectSearchResult: (location: MemoryLocation) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentView,
  onChangeView,
  onOpenAddModal,
  onOpenFiltersModal,
  onOpenSettingsModal,
  onOpenSlideshow,
  filters,
  onSearchChange,
  allLocations,
  onSelectSearchResult,
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Active filters count
  const activeFiltersCount =
    (filters.selectedTags.length > 0 ? 1 : 0) +
    (filters.dateFrom || filters.dateTo ? 1 : 0) +
    (filters.favoritesOnly ? 1 : 0) +
    (filters.mediaType !== 'all' ? 1 : 0);

  // Filtered dropdown matches for quick jump
  const searchMatches = React.useMemo(() => {
    if (!filters.searchQuery || filters.searchQuery.trim().length === 0) return [];
    const q = filters.searchQuery.toLowerCase().trim();
    return allLocations.filter(
      (loc) =>
        loc.title.toLowerCase().includes(q) ||
        loc.region.toLowerCase().includes(q) ||
        loc.tags.some((t) => t.toLowerCase().includes(q))
    ).slice(0, 5);
  }, [filters.searchQuery, allLocations]);

  return (
    <header className="h-16 bg-stone-900 border-b border-stone-800/80 px-4 flex items-center justify-between gap-4 z-30 shrink-0 select-none">
      {/* 1. Brand Logo & Title */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-stone-950 shadow-lg shadow-amber-500/20 font-bold">
          <MapIcon className="w-5 h-5" />
        </div>
        <div className="hidden sm:block">
          <h1 className="text-sm font-bold text-stone-100 tracking-tight flex items-center gap-2">
            <span>Mapa Wspomnień</span>
            <span className="px-1.5 py-0.5 rounded-md bg-stone-800 text-[10px] text-amber-400 font-medium border border-stone-700">
              Desktop
            </span>
          </h1>
          <p className="text-[11px] text-stone-400">Prywatne archiwum geograficzne</p>
        </div>
      </div>

      {/* 2. Center: View Mode Toggle & Live Search Bar */}
      <div className="flex-1 max-w-xl flex items-center gap-3">
        {/* View Switcher: Mapa vs Oś Czasu */}
        <div className="bg-stone-950 p-1 rounded-xl border border-stone-800 flex items-center gap-1 shrink-0">
          <button
            id="view-mode-map-btn"
            onClick={() => onChangeView('map')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              currentView === 'map'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/10'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Mapa</span>
          </button>
          <button
            id="view-mode-timeline-btn"
            onClick={() => onChangeView('timeline')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              currentView === 'timeline'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/10'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Galeria & Oś Czasu</span>
          </button>
        </div>

        {/* Live Search Input */}
        <div className="relative flex-1">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 pointer-events-none" />
            <input
              ref={searchInputRef}
              id="topbar-search-input"
              type="text"
              value={filters.searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              placeholder="Szukaj miejsc, regionów, tagów... (np. Tatry, Sopot)"
              className="w-full h-9 pl-9 pr-8 bg-stone-950 border border-stone-800 focus:border-amber-500/80 rounded-xl text-xs text-stone-200 placeholder-stone-500 focus:outline-none transition-colors"
            />
            {filters.searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 p-0.5 text-stone-400 hover:text-stone-200"
                title="Wyczyść wyszukiwanie"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Instant Search Dropdown */}
          {isSearchFocused && searchMatches.length > 0 && (
            <div
              id="search-autocomplete-dropdown"
              className="absolute left-0 right-0 top-11 bg-stone-900 border border-stone-700/90 rounded-xl shadow-2xl p-1.5 z-50 flex flex-col gap-1 max-h-64 overflow-y-auto"
            >
              <div className="px-2.5 py-1 text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                Znalezione lokalizacje ({searchMatches.length})
              </div>
              {searchMatches.map((match) => (
                <button
                  key={match.id}
                  onClick={() => onSelectSearchResult(match)}
                  className="flex items-center justify-between px-2.5 py-2 hover:bg-stone-800 rounded-lg text-left transition-colors group"
                >
                  <div className="flex items-center gap-2 truncate">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <div className="truncate">
                      <div className="text-xs font-semibold text-stone-200 group-hover:text-amber-300 truncate">
                        {match.title}
                      </div>
                      <div className="text-[10px] text-stone-400 truncate">
                        {match.region} • {match.dateRange}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-stone-500 bg-stone-950 px-1.5 py-0.5 rounded shrink-0">
                    {match.media.length} zdj.
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3. Action Buttons on Right: Add Memory, Filters, Settings, Slideshow */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Slideshow Button */}
        {onOpenSlideshow && (
          <button
            id="topbar-slideshow-btn"
            onClick={onOpenSlideshow}
            className="h-9 px-3 rounded-xl bg-stone-800/80 hover:bg-stone-800 text-amber-400 hover:text-amber-300 border border-amber-500/30 hover:border-amber-400 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            title="Uruchom pokaz slajdów ze zdjęciami i filmami z wybranego kraju lub lokalizacji"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span className="hidden md:inline">Pokaz slajdów</span>
          </button>
        )}

        {/* Filters Button */}
        <button
          id="topbar-filters-btn"
          onClick={onOpenFiltersModal}
          className={`h-9 px-3 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeFiltersCount > 0
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-stone-800/60 hover:bg-stone-800 text-stone-300 border-stone-700/60'
          }`}
          title="Filtruj wspomnienia"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Filtry</span>
          {activeFiltersCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-amber-500 text-stone-950 text-[10px] font-bold flex items-center justify-center ml-0.5">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {/* Add Memory Primary Button */}
        <button
          id="topbar-add-memory-btn"
          onClick={onOpenAddModal}
          className="h-9 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/10 transition-colors"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Dodaj wspomnienie</span>
        </button>

        {/* Settings Button */}
        <button
          id="topbar-settings-btn"
          onClick={onOpenSettingsModal}
          className="w-9 h-9 rounded-xl bg-stone-800/60 hover:bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-700/60 flex items-center justify-center transition-colors"
          title="Ustawienia i konfiguracja"
          aria-label="Ustawienia"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
