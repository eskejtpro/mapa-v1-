/**
 * App.tsx - Main Application Component for "Mapa Wspomnień"
 * Desktop-First Windows Memory Archiving Application (PySide6 Ready)
 */

import React, { useEffect, useMemo, useState } from 'react';
import { getAppBridge } from './bridge/AppBridge';
import { WindowsTitleBar } from './components/Common/WindowsTitleBar';
import { ResolutionContainer } from './components/Common/ResolutionContainer';
import { TopBar } from './components/Header/TopBar';
import { VectorMap } from './components/Map/VectorMap';
import { LocationPanel } from './components/LocationPanel/LocationPanel';
import { TimelineGalleryView } from './components/TimelineGallery/TimelineGalleryView';
import { LocationGalleryModal } from './components/Gallery/LocationGalleryModal';
import { LightboxModal } from './components/Lightbox/LightboxModal';
import { SlideshowModal } from './components/Slideshow/SlideshowModal';
import { AddMemoryModal } from './components/Modals/AddMemoryModal';
import { FiltersModal } from './components/Modals/FiltersModal';
import { SettingsModal } from './components/Modals/SettingsModal';
import {
  EmptyState,
  ErrorState,
  LoadingState,
  OfflineMapMissingState,
} from './components/Common/AppStates';
import {
  AppSettings,
  FilterState,
  GeoCoordinates,
  MemoryLocation,
  NewMemoryPayload,
  OfflineMapStatus,
  SimulatedAppState,
  TimelineDateGroup,
} from './types';
import { Sparkles, Check, AlertCircle } from 'lucide-react';

export const App: React.FC = () => {
  const bridge = useMemo(() => getAppBridge(), []);

  // Core Data State
  const [locations, setLocations] = useState<MemoryLocation[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'map' | 'timeline'>('map');
  const [offlineStatus, setOfflineStatus] = useState<OfflineMapStatus>({
    isAvailable: true,
    packName: 'Polska Wektory Topo v2024.10',
    sizeOnDiskFormatted: '142 MB',
    coverage: 'Polska (100% WGS84 Granice, Rzeki, Pojezierza, Szczyty)',
  });

  // Settings State
  const [settings, setSettings] = useState<AppSettings>({
    windowResolution: 'fit',
    mapStyle: 'atlas-calm',
    pinStyle: 'classic-pin',
    zoomSmoothness: 'natural',
    accentColor: 'amber',
    show3DBuildings: true,
    showStreetLabels: true,
    showCoordinatesHUD: true,
    autoPreviewVideoOnHover: true,
    highContrastMode: false,
    clusterRadius: 48,
    autoCenterOnSelect: true,
    simulatedState: 'ready',
    defaultZoom: 6,
    maxZoomLevel: 19,
  });

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    selectedTags: [],
    dateFrom: '',
    dateTo: '',
    mediaType: 'all',
    favoritesOnly: false,
    regionFilter: '',
  });

  // Map Category Filter & Side Panel Visibility State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isSidePanelOpen, setIsSidePanelOpen] = useState<boolean>(true);

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    if (cat === 'all') {
      setFilters((prev) => ({ ...prev, mediaType: 'all', favoritesOnly: false, selectedTags: [] }));
    } else if (cat === 'video') {
      setFilters((prev) => ({ ...prev, mediaType: 'videos', favoritesOnly: false, selectedTags: [] }));
    } else if (cat === 'favorite') {
      setFilters((prev) => ({ ...prev, favoritesOnly: true, mediaType: 'all', selectedTags: [] }));
    } else if (cat === 'mountains') {
      setFilters((prev) => ({ ...prev, favoritesOnly: false, mediaType: 'all', searchQuery: 'Tatry' }));
    } else if (cat === 'sea') {
      setFilters((prev) => ({ ...prev, favoritesOnly: false, mediaType: 'all', searchQuery: 'Bałtyk' }));
    } else if (cat === 'city') {
      setFilters((prev) => ({ ...prev, favoritesOnly: false, mediaType: 'all', searchQuery: 'Warszawa' }));
    } else if (cat === 'nature') {
      setFilters((prev) => ({ ...prev, favoritesOnly: false, mediaType: 'all', searchQuery: 'Natura' }));
    } else if (cat === 'monument') {
      setFilters((prev) => ({ ...prev, favoritesOnly: false, mediaType: 'all', searchQuery: 'Zamek' }));
    }
  };

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [fullGalleryLocation, setFullGalleryLocation] = useState<MemoryLocation | null>(null);
  const [lightboxData, setLightboxData] = useState<{
    location: MemoryLocation;
    index: number;
  } | null>(null);
  const [slideshowConfig, setSlideshowConfig] = useState<{
    isOpen: boolean;
    initialLocationId?: string;
    initialCountry?: string;
  }>({ isOpen: false });

  // Pre-filled coordinates and media type when user drops pin or right-clicks
  const [prefilledCoords, setPrefilledCoords] = useState<GeoCoordinates | null>(null);
  const [initialMediaType, setInitialMediaType] = useState<'photo' | 'video'>('photo');

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Initial Data Fetch
  useEffect(() => {
    const initData = async () => {
      try {
        const loaded = await bridge.getLocations();
        setLocations(loaded);
        const st = await bridge.getOfflineMapStatus();
        setOfflineStatus(st);
        const sett = await bridge.getSettings();
        setSettings(sett);
      } catch (err) {
        console.error('Failed to initialize bridge data', err);
      }
    };
    initData();
  }, [bridge]);

  // Keyboard Shortcuts (Desktop-first)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Ctrl+N or Alt+N -> Add memory
      if ((e.ctrlKey || e.metaKey) && (e.key === 'n' || e.key === 'N')) {
        e.preventDefault();
        setPrefilledCoords(null);
        setIsAddModalOpen(true);
      }
      // Ctrl+F -> Focus search
      if ((e.ctrlKey || e.metaKey) && (e.key === 'f' || e.key === 'F')) {
        e.preventDefault();
        const searchEl = document.getElementById('topbar-search-input') as HTMLInputElement;
        if (searchEl) searchEl.focus();
      }
      // Escape -> Close side panel / deselect if nothing else is open
      if (e.key === 'Escape') {
        if (!isAddModalOpen && !isFiltersModalOpen && !isSettingsModalOpen && !fullGalleryLocation && !lightboxData) {
          setSelectedLocationId(null);
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isAddModalOpen, isFiltersModalOpen, isSettingsModalOpen, fullGalleryLocation, lightboxData]);

  // Derived Filtered Locations
  const filteredLocations = useMemo(() => {
    return locations.filter((loc) => {
      // 1. Search query (title, region, tags, notes)
      if (filters.searchQuery && filters.searchQuery.trim().length > 0) {
        const q = filters.searchQuery.toLowerCase().trim();
        const matchesTitle = loc.title.toLowerCase().includes(q);
        const matchesRegion = loc.region.toLowerCase().includes(q);
        const matchesTags = loc.tags.some((t) => t.toLowerCase().includes(q));
        const matchesDesc = (loc.description || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesRegion && !matchesTags && !matchesDesc) {
          return false;
        }
      }

      // 2. Favorites only
      if (filters.favoritesOnly && !loc.isFavorite) {
        return false;
      }

      // 3. Selected Tags
      if (filters.selectedTags.length > 0) {
        const hasAllTags = filters.selectedTags.every((reqTag) =>
          loc.tags.includes(reqTag)
        );
        if (!hasAllTags) return false;
      }

      // 4. Date From / To
      if (filters.dateFrom && loc.primaryDate < filters.dateFrom) {
        return false;
      }
      if (filters.dateTo && loc.primaryDate > filters.dateTo) {
        return false;
      }

      // 5. Media type filter
      if (filters.mediaType === 'photos' && loc.mediaCount.photos === 0) {
        return false;
      }
      if (filters.mediaType === 'videos' && loc.mediaCount.videos === 0) {
        return false;
      }

      return true;
    });
  }, [locations, filters]);

  // Aggregated Tags & Regions for filter modal
  const allTagsWithCounts = useMemo(() => {
    const map = new Map<string, number>();
    locations.forEach((loc) => {
      loc.tags.forEach((t) => map.set(t, (map.get(t) || 0) + 1));
    });
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }, [locations]);

  const allRegionsWithCounts = useMemo(() => {
    const map = new Map<string, number>();
    locations.forEach((loc) => {
      map.set(loc.region, (map.get(loc.region) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }, [locations]);

  // Chronological timeline grouping
  const timelineGroups: TimelineDateGroup[] = useMemo(() => {
    const groupsMap = new Map<string, TimelineDateGroup>();

    filteredLocations.forEach((loc) => {
      loc.media.forEach((media) => {
        // Filter by mediaType
        if (filters.mediaType === 'photos' && media.type !== 'photo') return;
        if (filters.mediaType === 'videos' && media.type !== 'video') return;

        const dateParts = media.timestamp.split(' ')[0].split('-');
        const year = dateParts[0] || '2024';
        const month = dateParts[1] || '08';
        const sortKey = `${year}-${month}`;

        const monthNames: Record<string, string> = {
          '01': 'Styczeń',
          '02': 'Luty',
          '03': 'Marzec',
          '04': 'Kwiecień',
          '05': 'Maj',
          '06': 'Czerwiec',
          '07': 'Lipiec',
          '08': 'Sierpień',
          '09': 'Wrzesień',
          '10': 'Październik',
          '11': 'Listopad',
          '12': 'Grudzień',
        };
        const groupTitle = `${monthNames[month] || 'Miesiąc'} ${year}`;

        if (!groupsMap.has(sortKey)) {
          groupsMap.set(sortKey, {
            dateGroup: groupTitle,
            sortKey,
            items: [],
          });
        }

        groupsMap.get(sortKey)!.items.push({
          media,
          locationId: loc.id,
          locationTitle: loc.title,
          locationRegion: loc.region,
          coordinates: loc.coordinates,
        });
      });
    });

    // Sort descending by sortKey
    return Array.from(groupsMap.values()).sort((a, b) =>
      b.sortKey.localeCompare(a.sortKey)
    );
  }, [filteredLocations, filters.mediaType]);

  // Selected Location Object
  const selectedLocation = useMemo(() => {
    return locations.find((l) => l.id === selectedLocationId) || null;
  }, [locations, selectedLocationId]);

  // Handlers
  const handleToggleFavorite = async (locationId: string) => {
    const updated = await bridge.toggleFavorite(locationId);
    setLocations(updated);
    const item = updated.find((l) => l.id === locationId);
    if (item) {
      showToast(
        item.isFavorite
          ? `Dodano „${item.title}” do ulubionych`
          : `Usunięto „${item.title}” z ulubionych`
      );
    }
  };

  const handleAddMemorySubmit = async (payload: NewMemoryPayload) => {
    const newLocation = await bridge.addMemory(payload);
    const updatedList = await bridge.getLocations();
    setLocations(updatedList);
    setSelectedLocationId(newLocation.id);
    showToast(`Dodano nowe wspomnienie: „${newLocation.title}”!`);
  };

  const handleResetDemoData = async () => {
    const resetList = await bridge.resetDemoData();
    setLocations(resetList);
    setSelectedLocationId(resetList[0]?.id || null);
    showToast('Przywrócono domyślną demonstracyjną bazę wspomnień.');
  };

  const handleSaveSettings = async (newSettings: AppSettings) => {
    setSettings(newSettings);
    await bridge.saveSettings(newSettings);
  };

  const handleSelectSearchResult = (loc: MemoryLocation) => {
    setSelectedLocationId(loc.id);
    setCurrentView('map');
  };

  const handleMapRightClick = (coords: GeoCoordinates) => {
    setPrefilledCoords(coords);
    setInitialMediaType('photo');
    setIsAddModalOpen(true);
  };

  const handleAddPhotoAtCoords = (coords: GeoCoordinates) => {
    setPrefilledCoords(coords);
    setInitialMediaType('photo');
    setIsAddModalOpen(true);
  };

  const handleAddVideoAtCoords = (coords: GeoCoordinates) => {
    setPrefilledCoords(coords);
    setInitialMediaType('video');
    setIsAddModalOpen(true);
  };

  const handleOpenSlideshow = (locOrCountry?: MemoryLocation | string) => {
    if (typeof locOrCountry === 'string') {
      setSlideshowConfig({
        isOpen: true,
        initialCountry: locOrCountry,
      });
    } else if (locOrCountry && typeof locOrCountry === 'object') {
      setSlideshowConfig({
        isOpen: true,
        initialLocationId: locOrCountry.id,
        initialCountry: locOrCountry.country,
      });
    } else {
      setSlideshowConfig({
        isOpen: true,
      });
    }
  };

  // Simulated QA States Switcher
  const renderMainContent = () => {
    if (settings.simulatedState === 'loading') {
      return <LoadingState />;
    }
    if (settings.simulatedState === 'error') {
      return (
        <ErrorState
          error="ERR_SQLITE_IO: Nie można otworzyć pliku memories.db w lokalnym folderze."
          onRetry={() =>
            setSettings((s) => ({ ...s, simulatedState: 'ready' }))
          }
        />
      );
    }
    if (settings.simulatedState === 'offline_map_missing') {
      return (
        <OfflineMapMissingState
          onDownloadOrRetry={() =>
            setSettings((s) => ({ ...s, simulatedState: 'ready' }))
          }
        />
      );
    }
    if (settings.simulatedState === 'empty' || locations.length === 0) {
      return (
        <EmptyState
          onAddMemory={() => {
            setPrefilledCoords(null);
            setInitialMediaType('photo');
            setIsAddModalOpen(true);
          }}
        />
      );
    }

    if (currentView === 'timeline') {
      return (
        <TimelineGalleryView
          timelineGroups={timelineGroups}
          allLocations={locations}
          onOpenLightbox={(loc, index) => setLightboxData({ location: loc, index })}
          onJumpToMapLocation={(locId) => {
            setSelectedLocationId(locId);
            setCurrentView('map');
          }}
          filters={filters}
          onFilterChange={setFilters}
        />
      );
    }

    // Default Map View: Interactive Vector Map + Collapsible Location Panel
    return (
      <div className="flex-1 flex overflow-hidden relative">
        {/* 1. Main Vector Map Stage */}
        <main
          id="main-map-stage"
          className="flex-1 h-full relative overflow-hidden bg-stone-950 flex flex-col"
        >
          <VectorMap
            locations={filteredLocations}
            selectedLocationId={selectedLocationId}
            onSelectLocation={(loc) => {
              setSelectedLocationId(loc.id);
              setIsSidePanelOpen(true);
            }}
            onSelectCluster={(clusteredLocs) => {
              if (clusteredLocs.length > 0) {
                setSelectedLocationId(clusteredLocs[0].id);
                setIsSidePanelOpen(true);
              }
            }}
            mapStyle={settings.mapStyle}
            onChangeMapStyle={(style) =>
              handleSaveSettings({ ...settings, mapStyle: style })
            }
            clusterRadius={settings.clusterRadius}
            onRightClickAddMemory={handleMapRightClick}
            onAddPhotoAtCoords={handleAddPhotoAtCoords}
            onAddVideoAtCoords={handleAddVideoAtCoords}
            onOpenSlideshow={() => handleOpenSlideshow()}
            onAddMemorySubmit={handleAddMemorySubmit}
            isOfflineReady={offlineStatus.isAvailable}
            pinStyle={settings.pinStyle}
            show3DBuildings={settings.show3DBuildings}
            onToggle3DBuildings={() =>
              handleSaveSettings({ ...settings, show3DBuildings: !settings.show3DBuildings })
            }
            showStreetLabels={settings.showStreetLabels}
            onToggleStreetLabels={() =>
              handleSaveSettings({ ...settings, showStreetLabels: !settings.showStreetLabels })
            }
            autoPreviewVideoOnHover={settings.autoPreviewVideoOnHover}
            isSidePanelOpen={isSidePanelOpen}
            onToggleSidePanel={() => setIsSidePanelOpen(!isSidePanelOpen)}
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
          />
        </main>

        {/* 2. Collapsible Side Panel */}
        {isSidePanelOpen && (
          <LocationPanel
            location={selectedLocation}
            onClose={() => {
              setSelectedLocationId(null);
            }}
            onOpenFullGallery={(loc) => setFullGalleryLocation(loc)}
            onOpenLightbox={(loc, index) => setLightboxData({ location: loc, index })}
            onToggleFavorite={handleToggleFavorite}
            onOpenSlideshow={(loc) => handleOpenSlideshow(loc)}
            onAddMorePhotos={(loc) => {
              setPrefilledCoords(loc.coordinates);
              setInitialMediaType('photo');
              setIsAddModalOpen(true);
            }}
            onNavigateNext={() => {
              if (!locations.length) return;
              const currentIndex = locations.findIndex((l) => l.id === selectedLocationId);
              const nextIndex = (currentIndex + 1) % locations.length;
              setSelectedLocationId(locations[nextIndex].id);
            }}
            onNavigatePrev={() => {
              if (!locations.length) return;
              const currentIndex = locations.findIndex((l) => l.id === selectedLocationId);
              const prevIndex = (currentIndex - 1 + locations.length) % locations.length;
              setSelectedLocationId(locations[prevIndex].id);
            }}
          />
        )}
      </div>
    );
  };

  return (
    <ResolutionContainer resolution={settings.windowResolution}>
      {/* 1. Windows Native Titlebar */}
      <WindowsTitleBar
        resolution={settings.windowResolution}
        onChangeResolution={(res) =>
          handleSaveSettings({ ...settings, windowResolution: res })
        }
        isOfflineAvailable={offlineStatus.isAvailable}
      />

      {/* 2. Top Navigation Bar */}
      <TopBar
        currentView={currentView}
        onChangeView={setCurrentView}
        onOpenAddModal={() => {
          setPrefilledCoords(null);
          setInitialMediaType('photo');
          setIsAddModalOpen(true);
        }}
        onOpenFiltersModal={() => setIsFiltersModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onOpenSlideshow={() => handleOpenSlideshow()}
        filters={filters}
        onSearchChange={(q) => setFilters((f) => ({ ...f, searchQuery: q }))}
        allLocations={locations}
        onSelectSearchResult={handleSelectSearchResult}
      />

      {/* 3. Main Body */}
      {renderMainContent()}

      {/* 4. Toast Notification */}
      {toastMessage && (
        <div
          id="app-toast-notification"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-stone-900 border border-amber-500/40 text-stone-100 text-xs font-semibold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 5. Modals */}
      <AddMemoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddMemorySubmit}
        prefilledCoords={prefilledCoords}
        initialMediaType={initialMediaType}
      />

      <FiltersModal
        isOpen={isFiltersModalOpen}
        onClose={() => setIsFiltersModalOpen(false)}
        filters={filters}
        onApplyFilters={setFilters}
        allTags={allTagsWithCounts}
        allRegions={allRegionsWithCounts}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
        offlineStatus={offlineStatus}
        onResetDemoData={handleResetDemoData}
      />

      {/* Full Location Gallery Modal */}
      {fullGalleryLocation && (
        <LocationGalleryModal
          location={fullGalleryLocation}
          onClose={() => setFullGalleryLocation(null)}
          onOpenLightbox={(loc, index) => setLightboxData({ location: loc, index })}
          onToggleFavorite={handleToggleFavorite}
          onOpenSlideshow={(loc) => handleOpenSlideshow(loc)}
        />
      )}

      {/* Fullscreen Lightbox / Photo Viewer */}
      {lightboxData && (
        <LightboxModal
          location={lightboxData.location}
          initialIndex={lightboxData.index}
          onClose={() => setLightboxData(null)}
          onJumpToMap={(locId) => {
            setSelectedLocationId(locId);
            setCurrentView('map');
          }}
        />
      )}

      {/* Fullscreen Country & Location Slideshow Modal */}
      {slideshowConfig.isOpen && (
        <SlideshowModal
          isOpen={slideshowConfig.isOpen}
          onClose={() => setSlideshowConfig({ isOpen: false })}
          locations={locations}
          initialLocationId={slideshowConfig.initialLocationId}
          initialCountry={slideshowConfig.initialCountry}
          onJumpToMap={(locId) => {
            setSelectedLocationId(locId);
            setCurrentView('map');
            setSlideshowConfig({ isOpen: false });
          }}
        />
      )}
    </ResolutionContainer>
  );
};

export default App;
