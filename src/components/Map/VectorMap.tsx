/**
 * VectorMap - Interactive Global Vector & High-Precision Mapping Engine
 * Supports deep multi-level zoom (Zoom 1 to 19 - from World to Buildings & Streets),
 * Clean desktop memory pins, Video & Photo markers, and 8 Visual Map Themes.
 * Scoped inside isolated container so it never blocks top navigation or modals.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Camera,
  Compass,
  Eye,
  Film,
  Layers,
  MapPin,
  Navigation,
  Plus,
  Sparkles,
  Zap,
} from 'lucide-react';
import {
  AppSettings,
  GeoCoordinates,
  MapStyle,
  MemoryLocation,
  NewMemoryPayload,
  PinStyle,
} from '../../types';
import { getSceneSvgDataUri } from '../../utils/svgPlaceholders';
import { MapControls } from './MapControls';

interface VectorMapProps {
  locations: MemoryLocation[];
  selectedLocationId: string | null;
  onSelectLocation: (location: MemoryLocation) => void;
  onSelectCluster?: (locations: MemoryLocation[]) => void;
  mapStyle?: MapStyle;
  onChangeMapStyle?: (style: MapStyle) => void;
  clusterRadius?: number;
  onRightClickAddMemory?: (coords: GeoCoordinates) => void;
  onAddPhotoAtCoords?: (coords: GeoCoordinates) => void;
  onAddVideoAtCoords?: (coords: GeoCoordinates) => void;
  onOpenSlideshow?: () => void;
  onAddMemorySubmit?: (payload: NewMemoryPayload) => Promise<void>;
  isOfflineReady?: boolean;
  pinStyle?: PinStyle;
  show3DBuildings?: boolean;
  onToggle3DBuildings?: () => void;
  showStreetLabels?: boolean;
  onToggleStreetLabels?: () => void;
  autoPreviewVideoOnHover?: boolean;
  isSidePanelOpen?: boolean;
  onToggleSidePanel?: () => void;
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
}

// Tile Layer URLs for the 8 map styles
const MAP_TILE_CONFIGS: Record<
  MapStyle,
  {
    url: string;
    attribution: string;
    maxZoom: number;
    className?: string;
    subdomains?: string[];
    labelsOverlay?: string;
  }
> = {
  'atlas-calm': {
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CartoDB &copy; OpenStreetMap contributors',
    maxZoom: 19,
    subdomains: ['a', 'b', 'c', 'd'],
  },
  'satellite-hybrid': {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{x}/{y}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 19,
    labelsOverlay: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png',
  },
  'osm-standard': {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
    subdomains: ['a', 'b', 'c'],
  },
  'carto-positron': {
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CartoDB &copy; OpenStreetMap contributors',
    maxZoom: 19,
    subdomains: ['a', 'b', 'c', 'd'],
  },
  'night-slate': {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CartoDB &copy; OpenStreetMap contributors',
    maxZoom: 19,
    className: 'map-tiles-night',
    subdomains: ['a', 'b', 'c', 'd'],
  },
  'paper-vintage': {
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CartoDB &copy; OpenStreetMap',
    maxZoom: 19,
    className: 'map-tiles-vintage',
    subdomains: ['a', 'b', 'c', 'd'],
  },
  'topo-light': {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: 'Kartendaten: &copy; OpenStreetMap-Mitwirkende, SRTM | Kartendarstellung: &copy; OpenTopoMap',
    maxZoom: 17,
    subdomains: ['a', 'b', 'c'],
  },
  'neon-cyber': {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CartoDB &copy; OpenStreetMap',
    maxZoom: 19,
    className: 'map-tiles-cyberpunk',
    subdomains: ['a', 'b', 'c', 'd'],
  },
};

export const VectorMap: React.FC<VectorMapProps> = ({
  locations,
  selectedLocationId,
  onSelectLocation,
  onSelectCluster,
  mapStyle = 'atlas-calm',
  onChangeMapStyle,
  clusterRadius = 48,
  onRightClickAddMemory,
  onAddPhotoAtCoords,
  onAddVideoAtCoords,
  onOpenSlideshow,
  onAddMemorySubmit,
  isOfflineReady = true,
  pinStyle = 'classic-pin',
  show3DBuildings = true,
  onToggle3DBuildings,
  showStreetLabels = true,
  onToggleStreetLabels,
  autoPreviewVideoOnHover = true,
  isSidePanelOpen = true,
  onToggleSidePanel,
  selectedCategory = 'all',
  onSelectCategory,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const labelsLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const buildingVectorLayerRef = useRef<L.LayerGroup | null>(null);
  const droppedPinMarkerRef = useRef<L.Marker | null>(null);

  // Viewport & HUD State
  const [currentZoom, setCurrentZoom] = useState<number>(6);
  const [cursorCoordsHUD, setCursorCoordsHUD] = useState<string>('52.0693° N, 19.4803° E');
  const [isDropPinMode, setIsDropPinMode] = useState<boolean>(false);

  // Active Click / Context Pin Menu
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    screenX: number;
    screenY: number;
    coords: GeoCoordinates;
    trigger: 'click' | 'rightclick';
  } | null>(null);

  // Selected Location object
  const selectedLocation = useMemo(() => {
    return locations.find((l) => l.id === selectedLocationId) || null;
  }, [locations, selectedLocationId]);

  // 1. Initialize Leaflet Map Instance
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center on Poland / Central Europe by default, initial zoom 6
    const map = L.map(mapContainerRef.current, {
      center: [52.0693, 19.4803],
      zoom: 6,
      minZoom: 2,
      maxZoom: 19,
      zoomControl: false,
      attributionControl: false,
      preferCanvas: true,
    });

    mapInstanceRef.current = map;

    // Initialize Markers Layer Group
    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;

    // Initialize 3D Buildings Vector Layer Group
    const buildingsGroup = L.layerGroup().addTo(map);
    buildingVectorLayerRef.current = buildingsGroup;

    // Event Listeners
    map.on('zoomend', () => {
      setCurrentZoom(map.getZoom());
    });

    map.on('mousemove', (e: L.LeafletMouseEvent) => {
      const lat = e.latlng.lat.toFixed(4);
      const lng = e.latlng.lng.toFixed(4);
      setCursorCoordsHUD(`${lat}° N, ${lng}° E`);
    });

    map.on('contextmenu', (e: L.LeafletMouseEvent) => {
      setContextMenu({
        visible: true,
        screenX: e.containerPoint.x,
        screenY: e.containerPoint.y,
        coords: { lat: e.latlng.lat, lng: e.latlng.lng },
        trigger: 'rightclick',
      });
    });

    map.on('click', (e: L.LeafletMouseEvent) => {
      if (isDropPinMode) {
        setIsDropPinMode(false);
        if (onRightClickAddMemory) {
          onRightClickAddMemory({ lat: e.latlng.lat, lng: e.latlng.lng });
        }
        setContextMenu(null);
      } else {
        // Open quick action pin menu at clicked location
        setContextMenu({
          visible: true,
          screenX: e.containerPoint.x,
          screenY: e.containerPoint.y,
          coords: { lat: e.latlng.lat, lng: e.latlng.lng },
          trigger: 'click',
        });
      }
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [isDropPinMode, onRightClickAddMemory]);

  // 2. Handle Map Style / Tile Layer Changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    const tileConfig = MAP_TILE_CONFIGS[mapStyle] || MAP_TILE_CONFIGS['atlas-calm'];

    // Remove old base layer
    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }
    // Remove old labels layer
    if (labelsLayerRef.current) {
      map.removeLayer(labelsLayerRef.current);
      labelsLayerRef.current = null;
    }

    // Add new base layer
    const newTileLayer = L.tileLayer(tileConfig.url, {
      attribution: tileConfig.attribution,
      maxZoom: tileConfig.maxZoom || 19,
      className: tileConfig.className || '',
      subdomains: tileConfig.subdomains || ['a', 'b', 'c'],
    }).addTo(map);

    tileLayerRef.current = newTileLayer;

    // If hybrid satellite and street labels enabled, add labels overlay
    if (tileConfig.labelsOverlay && showStreetLabels) {
      const labelsLayer = L.tileLayer(tileConfig.labelsOverlay, {
        maxZoom: 19,
        subdomains: ['a', 'b', 'c', 'd'],
      }).addTo(map);
      labelsLayerRef.current = labelsLayer;
    }
  }, [mapStyle, showStreetLabels]);

  // 3. Render 3D Building Outlines when zoomed in (Zoom 16-19)
  useEffect(() => {
    if (!mapInstanceRef.current || !buildingVectorLayerRef.current) return;
    const group = buildingVectorLayerRef.current;
    group.clearLayers();

    if (!show3DBuildings || currentZoom < 16) return;

    // High-fidelity vector building polygons around user memories
    locations.forEach((loc) => {
      const { lat, lng } = loc.coordinates;
      const offset = 0.00035;

      const buildingBounds: L.LatLngExpression[] = [
        [lat - offset, lng - offset],
        [lat - offset, lng + offset],
        [lat + offset, lng + offset],
        [lat + offset, lng - offset],
      ];

      const buildingPoly = L.polygon(buildingBounds, {
        color: '#f59e0b',
        weight: 1.5,
        fillColor: '#1e293b',
        fillOpacity: 0.5,
        className: 'building-3d-shadow',
      });

      group.addLayer(buildingPoly);
    });
  }, [locations, currentZoom, show3DBuildings]);

  // 4. Render Memory Pins & Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    const group = markersLayerRef.current;
    group.clearLayers();

    locations.forEach((loc) => {
      const isSelected = selectedLocationId === loc.id;
      const hasVideo = loc.media.some((m) => m.type === 'video');
      const coverMedia = loc.media.find((m) => m.id === loc.coverMediaId) || loc.media[0];
      const thumbUri = coverMedia
        ? getSceneSvgDataUri(coverMedia.sceneType, coverMedia.title, loc.id)
        : '';

      let markerHtml = '';

      if (pinStyle === 'minimal-neon') {
        markerHtml = `
          <div class="relative flex items-center justify-center cursor-pointer group" style="width: 32px; height: 32px;">
            <div class="w-4 h-4 rounded-full ${
              isSelected ? 'bg-amber-400 scale-125 ring-4 ring-amber-400/50' : 'bg-amber-500'
            } border-2 border-stone-950 shadow-xl transition-all group-hover:scale-125"></div>
            ${
              hasVideo
                ? `<div class="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-600 text-white text-[7px] flex items-center justify-center">🎬</div>`
                : ''
            }
          </div>
        `;
      } else if (pinStyle === 'bubble-preview') {
        markerHtml = `
          <div class="relative flex items-center gap-1.5 px-2 py-1 rounded-xl bg-stone-900/95 border ${
            isSelected ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-stone-700'
          } shadow-2xl cursor-pointer group hover:scale-105 transition-all">
            <div class="w-6 h-6 rounded-lg overflow-hidden bg-stone-950 shrink-0">
              <img src="${thumbUri}" alt="${loc.title}" class="w-full h-full object-cover" />
            </div>
            <div class="text-[11px] font-bold text-stone-100 whitespace-nowrap pr-1 max-w-[120px] truncate">
              ${loc.title}
            </div>
            ${
              loc.isFavorite
                ? `<span class="text-[9px]">❤️</span>`
                : ''
            }
          </div>
        `;
      } else {
        // Default: 'classic-pin'
        markerHtml = `
          <div class="relative flex items-center justify-center cursor-pointer group" style="width: 48px; height: 48px;">
            <!-- Outer Pin Frame -->
            <div class="w-10 h-10 rounded-2xl ${
              isSelected
                ? 'bg-amber-400 p-1 ring-4 ring-amber-400/40 rotate-45'
                : 'bg-stone-800 p-1 border border-stone-600 rotate-45'
            } shadow-2xl transition-all group-hover:scale-110">
              <div class="w-full h-full rounded-xl overflow-hidden bg-stone-950 -rotate-45 flex items-center justify-center">
                <img src="${thumbUri}" alt="${loc.title}" class="w-full h-full object-cover" />
              </div>
            </div>

            <!-- Video badge -->
            ${
              hasVideo
                ? `<div class="absolute -top-1 -right-1 px-1 py-0.2 rounded-full bg-red-600 text-white text-[9px] font-bold shadow-md flex items-center gap-0.5 border border-white/50 z-10">
                     <span>🎬</span>
                   </div>`
                : ''
            }

            <!-- Favorite badge -->
            ${
              loc.isFavorite
                ? `<div class="absolute -bottom-1 -left-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] flex items-center justify-center shadow-md border border-white z-10">
                     ❤️
                   </div>`
                : ''
            }

            <!-- Count Pill -->
            <div class="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full ${
              isSelected ? 'bg-amber-400 text-stone-950 font-bold' : 'bg-stone-900 text-amber-300 font-semibold'
            } text-[9px] border border-stone-700 shadow-md z-10">
              ${loc.media.length}
            </div>

            <!-- Hover Tooltip -->
            <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center pointer-events-none z-30">
              <div class="px-2.5 py-1 rounded-lg bg-stone-900/95 border border-stone-700 text-stone-100 text-[11px] font-bold whitespace-nowrap shadow-xl">
                ${loc.title}
                <span class="block text-[9px] text-amber-400 font-normal">${loc.region} • ${loc.media.length} zdjęć</span>
              </div>
              <div class="w-2 h-2 bg-stone-900 border-r border-b border-stone-700 transform rotate-45 -mt-1"></div>
            </div>
          </div>
        `;
      }

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-map-pin',
        iconSize: [48, 48],
        iconAnchor: [24, 24],
      });

      const marker = L.marker([loc.coordinates.lat, loc.coordinates.lng], {
        icon: customIcon,
        title: loc.title,
      });

      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        onSelectLocation(loc);
      });

      group.addLayer(marker);
    });
  }, [locations, selectedLocationId, pinStyle]);

  // 5. Auto-pan when selected location changes
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedLocation) return;
    const map = mapInstanceRef.current;
    map.flyTo([selectedLocation.coordinates.lat, selectedLocation.coordinates.lng], Math.max(map.getZoom(), 15), {
      duration: 1.2,
    });
  }, [selectedLocation?.id]);

  // Zoom control handlers
  const handleZoomIn = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  }, []);

  const handleResetView = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([52.0693, 19.4803], 6, { duration: 1.2 });
    }
  }, []);

  const handleZoomToBuildings = useCallback(() => {
    if (mapInstanceRef.current) {
      const center = selectedLocation
        ? [selectedLocation.coordinates.lat, selectedLocation.coordinates.lng]
        : mapInstanceRef.current.getCenter();
      mapInstanceRef.current.flyTo(center, 18, { duration: 1.4 });
    }
  }, [selectedLocation]);

  const handleZoomToStreets = useCallback(() => {
    if (mapInstanceRef.current) {
      const center = selectedLocation
        ? [selectedLocation.coordinates.lat, selectedLocation.coordinates.lng]
        : mapInstanceRef.current.getCenter();
      mapInstanceRef.current.flyTo(center, 15, { duration: 1.2 });
    }
  }, [selectedLocation]);

  const handleZoomToWorld = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([20, 0], 3, { duration: 1.5 });
    }
  }, []);

  return (
    <div
      id="main-vector-map-container"
      className={`relative w-full h-full overflow-hidden select-none bg-stone-950 focus:outline-none isolate ${
        isDropPinMode ? 'cursor-crosshair' : ''
      }`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === '+' || e.key === '=') handleZoomIn();
        if (e.key === '-' || e.key === '_') handleZoomOut();
        if (e.key === '0') handleResetView();
        if (e.key === 'Escape') {
          setIsDropPinMode(false);
          setContextMenu(null);
        }
      }}
    >
      {/* Leaflet Map DOM Canvas */}
      <div ref={mapContainerRef} id="leaflet-map-canvas" className="w-full h-full z-0" />

      {/* Floating Map Control Suite (z-20 inside isolated map container) */}
      <MapControls
        zoom={currentZoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetView={handleResetView}
        onZoomToBuildings={handleZoomToBuildings}
        onZoomToStreets={handleZoomToStreets}
        onZoomToWorld={handleZoomToWorld}
        currentStyle={mapStyle}
        onStyleChange={onChangeMapStyle || (() => {})}
        coordinatesHUD={cursorCoordsHUD}
        totalMemoriesCount={locations.length}
        isDropPinMode={isDropPinMode}
        onToggleDropPinMode={() => setIsDropPinMode(!isDropPinMode)}
        locations={locations}
        selectedLocationId={selectedLocationId}
        onSelectLocation={(loc) => {
          onSelectLocation(loc);
        }}
        isSidePanelOpen={isSidePanelOpen}
        onToggleSidePanel={onToggleSidePanel}
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
        show3DBuildings={show3DBuildings}
        onToggle3DBuildings={onToggle3DBuildings}
        showStreetLabels={showStreetLabels}
        onToggleStreetLabels={onToggleStreetLabels}
        onOpenSlideshow={onOpenSlideshow}
      />

      {/* Drop Pin Mode Floating Hint Bar */}
      {isDropPinMode && (
        <div
          id="drop-pin-banner"
          className="absolute top-16 left-1/2 -translate-x-1/2 z-30 px-4 py-2.5 rounded-xl bg-amber-400 text-stone-950 font-bold text-xs shadow-2xl flex items-center gap-2.5 animate-bounce pointer-events-auto border-2 border-stone-950"
        >
          <Zap className="w-4 h-4 fill-stone-950" />
          <span>TRYB PINEZKI: Kliknij w dowolny punkt na mapie, aby dodać wspomnienie!</span>
          <button
            onClick={() => setIsDropPinMode(false)}
            className="ml-2 px-2.5 py-1 rounded-lg bg-stone-950 text-amber-400 text-[11px] font-bold hover:bg-stone-900"
          >
            Anuluj (ESC)
          </button>
        </div>
      )}

      {/* Interactive Click & Context Pin Menu */}
      {contextMenu && contextMenu.visible && (
        <div
          id="map-context-menu"
          className="fixed bg-stone-900/95 backdrop-blur-2xl border border-stone-700/90 rounded-2xl shadow-2xl p-2 z-50 flex flex-col gap-1 min-w-[270px] animate-in fade-in zoom-in-95 duration-150"
          style={{
            left: `${Math.min(window.innerWidth - 290, Math.max(16, contextMenu.screenX))}px`,
            top: `${Math.min(window.innerHeight - 260, Math.max(70, contextMenu.screenY))}px`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-3 py-1.5 border-b border-stone-800 text-[11px] text-amber-400 font-mono flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-bold">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Punkt GPS</span>
            </span>
            <span>{contextMenu.coords.lat.toFixed(4)}°, {contextMenu.coords.lng.toFixed(4)}°</span>
          </div>

          {/* Action 1: Add Photo */}
          <button
            id="context-add-photo-btn"
            onClick={() => {
              if (onAddPhotoAtCoords) {
                onAddPhotoAtCoords(contextMenu.coords);
              } else if (onRightClickAddMemory) {
                onRightClickAddMemory(contextMenu.coords);
              }
              setContextMenu(null);
            }}
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-stone-200 hover:text-amber-300 hover:bg-stone-800 rounded-xl transition-colors text-left group"
          >
            <Camera className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <div className="flex flex-col">
              <span className="font-bold text-stone-100 group-hover:text-amber-300">Dodaj zdjęcie w tym miejscu</span>
              <span className="text-[10px] text-stone-400">Przypisz kadr z aparatu do współrzędnych</span>
            </div>
          </button>

          {/* Action 2: Add Video */}
          <button
            id="context-add-video-btn"
            onClick={() => {
              if (onAddVideoAtCoords) {
                onAddVideoAtCoords(contextMenu.coords);
              } else if (onRightClickAddMemory) {
                onRightClickAddMemory(contextMenu.coords);
              }
              setContextMenu(null);
            }}
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-stone-200 hover:text-amber-300 hover:bg-stone-800 rounded-xl transition-colors text-left group"
          >
            <Film className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
            <div className="flex flex-col">
              <span className="font-bold text-stone-100 group-hover:text-amber-300">Dodaj film / wideo tutaj</span>
              <span className="text-[10px] text-stone-400">Dodaj nagranie wideo z lokalizacji</span>
            </div>
          </button>

          {/* Action 3: Full Memory */}
          <button
            id="context-add-memory-btn"
            onClick={() => {
              if (onRightClickAddMemory) {
                onRightClickAddMemory(contextMenu.coords);
              }
              setContextMenu(null);
            }}
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-stone-300 hover:text-white hover:bg-stone-800 rounded-xl transition-colors text-left border-t border-stone-800/80"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Pełny formularz wspomnienia...</span>
          </button>

          {/* Action 4: Zoom Here */}
          <button
            onClick={() => {
              if (mapInstanceRef.current) {
                mapInstanceRef.current.flyTo([contextMenu.coords.lat, contextMenu.coords.lng], Math.min(currentZoom + 3, 18), {
                  duration: 0.8,
                });
              }
              setContextMenu(null);
            }}
            className="flex items-center gap-2.5 px-3 py-1.5 text-xs text-stone-400 hover:text-stone-200 hover:bg-stone-800/60 rounded-xl transition-colors text-left"
          >
            <Navigation className="w-3.5 h-3.5 text-stone-400" />
            <span>Przybliż mapę w tym punkcie</span>
          </button>

          <button
            onClick={() => setContextMenu(null)}
            className="px-3 py-1.5 text-xs text-stone-500 hover:text-stone-300 hover:bg-stone-800 rounded-xl transition-colors text-left"
          >
            Zamknij
          </button>
        </div>
      )}
    </div>
  );
};
