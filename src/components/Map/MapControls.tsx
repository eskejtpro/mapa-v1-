/**
 * MapControls - Floating Desktop Map Control Suite (Windows 10 Desktop Optimized)
 * Scoped cleanly within the map viewport (z-20) to prevent overlapping TopBar or Modals:
 * - Top Floating Bar: Live Search on map with auto-suggest, category chips, GPS & Zoom HUD
 * - Right Floating Toolbar: Zoom presets (Buildings 18x, Streets 15x, Poland, World), 8 Theme Switcher,
 *   3D Layers toggle, and Side Panel toggle.
 * - Bottom Floating Bar: Quick "Dodaj wspomnienie na mapie" action and memory counter.
 */

import React, { useState } from 'react';
import {
  Building2,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  Compass,
  Eye,
  EyeOff,
  Film,
  Globe,
  Heart,
  Layers,
  MapPin,
  Maximize2,
  Minimize2,
  Minus,
  Navigation,
  PanelRightClose,
  PanelRightOpen,
  Plus,
  Play,
  RotateCcw,
  Search,
  Sliders,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';
import { MapStyle, MemoryLocation } from '../../types';

interface MapControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onZoomToBuildings?: () => void;
  onZoomToStreets?: () => void;
  onZoomToWorld?: () => void;
  currentStyle: MapStyle;
  onStyleChange: (style: MapStyle) => void;
  coordinatesHUD?: string;
  totalMemoriesCount: number;
  isDropPinMode?: boolean;
  onToggleDropPinMode?: () => void;
  locations?: MemoryLocation[];
  selectedLocationId?: string | null;
  onSelectLocation?: (location: MemoryLocation) => void;
  isSidePanelOpen?: boolean;
  onToggleSidePanel?: () => void;
  // Category quick filter
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
  // Layer toggles
  show3DBuildings?: boolean;
  onToggle3DBuildings?: () => void;
  showStreetLabels?: boolean;
  onToggleStreetLabels?: () => void;
  onOpenSlideshow?: () => void;
}

export const MapControls: React.FC<MapControlsProps> = ({
  zoom,
  onZoomIn,
  onZoomOut,
  onResetView,
  onZoomToBuildings,
  onZoomToStreets,
  onZoomToWorld,
  currentStyle,
  onStyleChange,
  coordinatesHUD,
  totalMemoriesCount,
  isDropPinMode = false,
  onToggleDropPinMode,
  locations = [],
  selectedLocationId,
  onSelectLocation,
  isSidePanelOpen = true,
  onToggleSidePanel,
  selectedCategory = 'all',
  onSelectCategory,
  show3DBuildings = true,
  onToggle3DBuildings,
  showStreetLabels = true,
  onToggleStreetLabels,
  onOpenSlideshow,
}) => {
  const [showStyleMenu, setShowStyleMenu] = useState(false);
  const [showLayersMenu, setShowLayersMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Zoom Level Description Badge
  const getZoomLevelDescription = (z: number) => {
    if (z >= 18) return { label: 'Budynki i obrysy (1:500)', icon: '🏢', badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    if (z >= 15) return { label: 'Ulice i numeracja (1:2500)', icon: '🛣️', badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    if (z >= 12) return { label: 'Miasto i dzielnice', icon: '🏙️', badgeColor: 'text-sky-400 bg-sky-500/10 border-sky-500/30' };
    if (z >= 8) return { label: 'Region / Województwo', icon: '🗺️', badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' };
    if (z >= 5) return { label: 'Polska (Kraj)', icon: '🇵🇱', badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30' };
    return { label: 'Świat / Kontynenty', icon: '🌍', badgeColor: 'text-stone-300 bg-stone-800 border-stone-700' };
  };

  const zoomInfo = getZoomLevelDescription(zoom);

  const styleOptions: Array<{ id: MapStyle; label: string; desc: string; icon: string; previewColor: string }> = [
    { id: 'atlas-calm', label: 'Atlas Spokojny', desc: 'Ciepły stonowany atlas wektorowy Carto', icon: '🗺️', previewColor: 'bg-[#d8d2c2]' },
    { id: 'satellite-hybrid', label: 'Satelita Hybrydowy', desc: 'Wysoka rozdzielczość Esri + etykiety ulic', icon: '🛰️', previewColor: 'bg-[#1b3022]' },
    { id: 'osm-standard', label: 'Wektor Topo & Ulice', desc: 'OpenStreetMap (ulice, budynki, ścieżki)', icon: '🏙️', previewColor: 'bg-[#aad3df]' },
    { id: 'carto-positron', label: 'Jasny Wektor Positron', desc: 'Minimalistyczny, czysty jasny styl', icon: '☀️', previewColor: 'bg-[#e8e8e8]' },
    { id: 'night-slate', label: 'Ciemny Łupkowy', desc: 'Nocna stylizacja o wysokim kontraście', icon: '🌙', previewColor: 'bg-[#1c222b]' },
    { id: 'paper-vintage', label: 'Papier Vintage', desc: 'Sepia dawnych map kartograficznych', icon: '📜', previewColor: 'bg-[#cfb997]' },
    { id: 'topo-light', label: 'Rzeźba Terenu OpenTopo', desc: 'Poziomice i cieniowanie wzgórz', icon: '⛰️', previewColor: 'bg-[#d6e2cf]' },
    { id: 'neon-cyber', label: 'Nocny Neon Cyber', desc: 'Fluorescencyjny kontrast dark mode', icon: '⚡', previewColor: 'bg-[#0f0e17]' },
  ];

  const categoryChips = [
    { id: 'all', label: 'Wszystkie', icon: '🗺️' },
    { id: 'video', label: 'Wideo 🎬', icon: '🎬' },
    { id: 'favorite', label: 'Ulubione ❤️', icon: '❤️' },
    { id: 'mountains', label: 'Góry ⛰️', icon: '⛰️' },
    { id: 'sea', label: 'Morze 🌊', icon: '🌊' },
    { id: 'city', label: 'Miasta 🏙️', icon: '🏙️' },
    { id: 'nature', label: 'Natura 🌲', icon: '🌲' },
    { id: 'monument', label: 'Zabytki 🏰', icon: '🏰' },
  ];

  // Filter locations for on-map search suggestions
  const searchResults = searchQuery.trim()
    ? locations.filter((loc) =>
        loc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5)
    : [];

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-3 select-none overflow-hidden">
      {/* ========================================================================= */}
      {/* 1. TOP FLOATING COMMAND BAR                                               */}
      {/* ========================================================================= */}
      <div className="flex flex-col gap-2 pointer-events-none">
        <div className="flex items-center justify-between gap-3 pointer-events-auto">
          {/* LEFT: Live Map Search with quick suggestions */}
          <div className="relative w-72 sm:w-80 md:w-96 shadow-2xl">
            <div className="relative flex items-center bg-stone-900/90 backdrop-blur-xl border border-stone-700/80 rounded-2xl px-3 py-2 shadow-2xl transition-all focus-within:border-amber-400 focus-within:bg-stone-900">
              <Search className="w-4 h-4 text-stone-400 mr-2 shrink-0" />
              <input
                id="map-floating-search-input"
                type="text"
                placeholder="Szukaj na mapie (np. Tatry, Gdańsk, Wideo)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                className="w-full bg-transparent text-xs text-stone-100 placeholder-stone-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 rounded-full text-stone-400 hover:text-stone-200 hover:bg-stone-800"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick search dropdown suggestions */}
            {isSearchFocused && searchResults.length > 0 && (
              <div
                id="map-search-autocomplete"
                className="absolute top-12 left-0 right-0 bg-stone-900/95 backdrop-blur-2xl border border-stone-700/90 rounded-2xl shadow-2xl overflow-hidden z-30 p-1 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="px-3 py-1.5 text-[10px] font-bold text-stone-400 uppercase tracking-wider border-b border-stone-800">
                  Pasujące miejsca na mapie ({searchResults.length})
                </div>
                {searchResults.map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => {
                      if (onSelectLocation) onSelectLocation(loc);
                      setSearchQuery('');
                    }}
                    className="w-full px-3 py-2 text-left text-xs text-stone-200 hover:bg-amber-400/15 hover:text-amber-300 rounded-xl flex items-center justify-between transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <div>
                        <div className="font-semibold text-stone-100 group-hover:text-amber-200">
                          {loc.title}
                        </div>
                        <div className="text-[10px] text-stone-400">{loc.region}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-stone-400 bg-stone-800 px-1.5 py-0.5 rounded">
                      {loc.media.length} {loc.media.length === 1 ? 'plik' : 'plików'}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: GPS Coordinate & Scale HUD */}
          <div className="hidden lg:flex items-center gap-2 bg-stone-900/90 backdrop-blur-xl border border-stone-700/80 rounded-2xl px-3 py-1.5 shadow-2xl text-xs">
            {/* GPS Coords Badge */}
            {coordinatesHUD && (
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-stone-300 border-r border-stone-800 pr-3">
                <Navigation className="w-3 h-3 text-amber-400 rotate-45" />
                <span>{coordinatesHUD}</span>
              </div>
            )}

            {/* Zoom Stage Badge */}
            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg border text-[11px] font-semibold ${zoomInfo.badgeColor}`}>
              <span>{zoomInfo.icon}</span>
              <span>{zoomInfo.label}</span>
              <span className="font-mono text-[10px] opacity-75">({zoom}x)</span>
            </div>

            {/* Total Memories counter */}
            <div className="flex items-center gap-1 text-[11px] text-stone-400 pl-1">
              <Camera className="w-3 h-3 text-stone-400" />
              <span className="font-bold text-stone-200">{totalMemoriesCount}</span>
              <span className="text-[10px]">miejsc</span>
            </div>

            {/* Side Panel Toggle */}
            {onToggleSidePanel && (
              <button
                id="map-toggle-side-panel-btn"
                onClick={onToggleSidePanel}
                className="ml-1 p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700 transition-colors"
                title={isSidePanelOpen ? 'Zwiń panel boczny (Pełna mapa)' : 'Otwórz panel boczny'}
              >
                {isSidePanelOpen ? (
                  <PanelRightClose className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <PanelRightOpen className="w-3.5 h-3.5 text-amber-400" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Chips Bar */}
        {onSelectCategory && (
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pointer-events-auto py-0.5">
            {categoryChips.map((chip) => {
              const isActive = selectedCategory === chip.id;
              return (
                <button
                  key={chip.id}
                  id={`map-category-chip-${chip.id}`}
                  onClick={() => onSelectCategory(chip.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 shadow-lg border backdrop-blur-xl transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-amber-400 text-stone-950 border-amber-300 font-bold scale-105 shadow-amber-500/20'
                      : 'bg-stone-900/85 hover:bg-stone-800 text-stone-300 hover:text-white border-stone-700/80'
                  }`}
                >
                  <span>{chip.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. BOTTOM ACTION BAR + RIGHT SUPER-TOOLBAR                                */}
      {/* ========================================================================= */}
      <div className="flex items-end justify-between gap-3 pointer-events-none">
        {/* BOTTOM LEFT: Pin Drop CTA & Info & Slideshow */}
        <div className="pointer-events-auto flex items-center gap-2 max-w-full flex-wrap">
          {onToggleDropPinMode && (
            <button
              id="map-toggle-drop-pin-btn"
              onClick={onToggleDropPinMode}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold shadow-2xl flex items-center gap-2 transition-all ${
                isDropPinMode
                  ? 'bg-amber-400 text-stone-950 ring-4 ring-amber-300/60 scale-105 animate-pulse'
                  : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 shadow-amber-400/25 hover:scale-105'
              }`}
              title="Wskaż punkt na mapie, aby dodać wideo lub zdjęcie"
            >
              <Zap className="w-4 h-4 fill-current text-stone-950" />
              <span>{isDropPinMode ? '⚡ Wskaż punkt na mapie...' : '⚡ Dodaj wspomnienie na mapie'}</span>
            </button>
          )}

          {/* Slideshow Button */}
          {onOpenSlideshow && (
            <button
              id="map-open-slideshow-btn"
              onClick={onOpenSlideshow}
              className="px-3.5 py-2.5 rounded-xl bg-stone-900/95 hover:bg-stone-800 text-amber-400 hover:text-amber-300 border border-amber-500/40 hover:border-amber-400 text-xs font-bold shadow-2xl flex items-center gap-2 transition-all hover:scale-105 backdrop-blur-xl"
              title="Uruchom pełnoekranowy pokaz slajdów ze zdjęciami i filmami z wybranego kraju lub lokalizacji"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Pokaz slajdów</span>
            </button>
          )}

          {/* Quick Info Badge */}
          <div className="hidden xl:flex items-center gap-2 bg-stone-900/90 backdrop-blur-xl border border-stone-800 rounded-xl px-3 py-2 text-[11px] text-stone-300 shadow-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Kliknij prawym przyciskiem myszy na mapie, aby dodać punkt GPS</span>
          </div>
        </div>

        {/* RIGHT SIDE FLOATING SUPER-TOOLBAR */}
        <div className="pointer-events-auto flex flex-col gap-2 shrink-0">
          {/* Style Switcher & Palette Drawer */}
          <div className="relative">
            <button
              id="map-style-toggle-btn"
              onClick={() => {
                setShowStyleMenu(!showStyleMenu);
                setShowLayersMenu(false);
              }}
              className={`w-11 h-11 bg-stone-900/95 hover:bg-stone-800 text-stone-200 border rounded-xl flex items-center justify-center shadow-2xl transition-all hover:scale-105 ${
                showStyleMenu ? 'border-amber-400 bg-stone-800 text-amber-300' : 'border-stone-700/80'
              }`}
              title="Wybierz styl mapy (8 wariantów wektorowych i satelitarnych)"
              aria-label="Styl mapy"
            >
              <Layers className="w-5 h-5 text-amber-400" />
            </button>

            {/* 8-Themes Drawer */}
            {showStyleMenu && (
              <div
                id="map-style-dropdown"
                className="absolute right-14 bottom-0 w-72 bg-stone-900/95 backdrop-blur-2xl border border-stone-700/90 rounded-2xl shadow-2xl p-2.5 flex flex-col gap-1.5 z-30 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="px-2.5 py-1.5 text-[11px] font-bold text-stone-300 uppercase tracking-wider flex items-center justify-between border-b border-stone-800">
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-amber-400" />
                    <span>Styl Podkładu Mapy</span>
                  </div>
                  <span className="text-[10px] text-amber-400 font-mono">8 stylów</span>
                </div>

                <div className="grid grid-cols-1 gap-1 max-h-72 overflow-y-auto custom-scrollbar pr-1">
                  {styleOptions.map((opt) => {
                    const isSelected = currentStyle === opt.id;
                    return (
                      <button
                        key={opt.id}
                        id={`map-style-option-${opt.id}`}
                        onClick={() => {
                          onStyleChange(opt.id);
                          setShowStyleMenu(false);
                        }}
                        className={`w-full p-2 rounded-xl text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                            : 'hover:bg-stone-800 text-stone-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">{opt.icon}</span>
                          <div>
                            <div className="text-xs leading-none font-semibold">
                              {opt.label}
                            </div>
                            <div
                              className={`text-[10px] mt-1 line-clamp-1 ${
                                isSelected ? 'text-stone-900 font-medium' : 'text-stone-400'
                              }`}
                            >
                              {opt.desc}
                            </div>
                          </div>
                        </div>

                        {isSelected ? (
                          <Check className="w-4 h-4 text-stone-950 shrink-0 stroke-[3]" />
                        ) : (
                          <div
                            className={`w-3.5 h-3.5 rounded-full border border-stone-600 ${opt.previewColor} shrink-0`}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Quick Zoom Presets Floating Stack */}
          <div className="bg-stone-900/95 backdrop-blur-xl border border-stone-700/80 rounded-2xl p-1 shadow-2xl flex flex-col gap-1 text-stone-200">
            {/* Zoom to 3D Buildings (18x) */}
            {onZoomToBuildings && (
              <button
                id="map-quick-zoom-buildings"
                onClick={onZoomToBuildings}
                className="w-9 h-9 hover:bg-stone-800 hover:text-amber-300 rounded-xl flex items-center justify-center text-xs font-bold transition-all relative group"
                title="Przybliż do poziomu budynków (Zoom 18x)"
              >
                <Building2 className="w-4 h-4 text-amber-400" />
                <span className="absolute right-12 bg-stone-950 text-stone-100 text-[10px] font-bold px-2 py-1 rounded-lg border border-stone-800 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  🏢 Budynki (18x)
                </span>
              </button>
            )}

            {/* Zoom to Streets (15x) */}
            {onZoomToStreets && (
              <button
                id="map-quick-zoom-streets"
                onClick={onZoomToStreets}
                className="w-9 h-9 hover:bg-stone-800 hover:text-amber-300 rounded-xl flex items-center justify-center text-xs font-bold transition-all relative group"
                title="Przybliż do poziomu ulic (Zoom 15x)"
              >
                <Compass className="w-4 h-4 text-emerald-400" />
                <span className="absolute right-12 bg-stone-950 text-stone-100 text-[10px] font-bold px-2 py-1 rounded-lg border border-stone-800 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  🛣️ Ulice (15x)
                </span>
              </button>
            )}

            {/* Reset to Poland Overview (6x) */}
            <button
              id="map-quick-zoom-poland"
              onClick={onResetView}
              className="w-9 h-9 hover:bg-stone-800 hover:text-amber-300 rounded-xl flex items-center justify-center text-xs font-bold transition-all relative group"
              title="Wycentruj na Polskę (Zoom 6x)"
            >
              <RotateCcw className="w-4 h-4 text-purple-400" />
              <span className="absolute right-12 bg-stone-950 text-stone-100 text-[10px] font-bold px-2 py-1 rounded-lg border border-stone-800 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                🇵🇱 Polska (6x)
              </span>
            </button>

            {/* Zoom to World (3x) */}
            {onZoomToWorld && (
              <button
                id="map-quick-zoom-world"
                onClick={onZoomToWorld}
                className="w-9 h-9 hover:bg-stone-800 hover:text-amber-300 rounded-xl flex items-center justify-center text-xs font-bold transition-all relative group"
                title="Widok globalny świata (Zoom 3x)"
              >
                <Globe className="w-4 h-4 text-sky-400" />
                <span className="absolute right-12 bg-stone-950 text-stone-100 text-[10px] font-bold px-2 py-1 rounded-lg border border-stone-800 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  🌍 Świat (3x)
                </span>
              </button>
            )}
          </div>

          {/* Standard Navigation Zoom Controls (+, -) */}
          <div className="bg-stone-900/95 backdrop-blur-xl border border-stone-700/80 rounded-2xl p-1 shadow-2xl flex flex-col gap-1 text-stone-200">
            <button
              id="map-zoom-in-btn"
              onClick={onZoomIn}
              className="w-9 h-9 hover:bg-stone-800 hover:text-white rounded-xl flex items-center justify-center transition-colors"
              title="Przybliż widok (+)"
              aria-label="Przybliż"
            >
              <Plus className="w-4 h-4" />
            </button>

            <div className="h-px bg-stone-800 mx-1" />

            <button
              id="map-zoom-out-btn"
              onClick={onZoomOut}
              className="w-9 h-9 hover:bg-stone-800 hover:text-white rounded-xl flex items-center justify-center transition-colors"
              title="Oddal widok (-)"
              aria-label="Oddal"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
