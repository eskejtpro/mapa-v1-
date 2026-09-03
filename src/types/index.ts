/**
 * Mapa Wspomnień - Types Definition
 * Pure TypeScript interfaces for Desktop Map application & AppBridge communication.
 */

export type MediaType = 'photo' | 'video';

export type SceneType =
  | 'mountains'
  | 'sea'
  | 'lake'
  | 'forest'
  | 'city'
  | 'sunset'
  | 'castle'
  | 'monument'
  | 'winter'
  | 'camp';

export interface ExifData {
  cameraMake?: string;
  cameraModel?: string;
  lens?: string;
  focalLength?: string;
  aperture?: string;
  shutterSpeed?: string;
  iso?: number;
  dateTimeOriginal: string;
  gpsLatitude?: number;
  gpsLongitude?: number;
  gpsAltitude?: number;
  fileSizeBytes: number;
  fileName: string;
  dimensions?: { width: number; height: number };
}

export interface MediaItem {
  id: string;
  locationId: string;
  type: MediaType;
  title: string;
  timestamp: string; // ISO format or YYYY-MM-DD HH:mm
  fileName: string;
  fileSizeFormatted: string;
  aspectRatio: '4/3' | '16/9' | '1/1' | '3/4';
  duration?: string; // For videos (e.g. "0:42", "1:15")
  sceneType: SceneType;
  colorPalette: {
    from: string;
    to: string;
    accent: string;
  };
  description?: string;
  tags: string[];
  exif?: ExifData;
}

export interface GeoCoordinates {
  lat: number;
  lng: number;
  altitude?: number;
}

export interface MemoryLocation {
  id: string;
  title: string;
  region: string; // e.g. "Tatry Wysokie, Małopolska"
  country: string; // e.g. "Polska"
  coordinates: GeoCoordinates;
  dateRange: string; // e.g. "12–15 Sierpnia 2024"
  primaryDate: string; // YYYY-MM-DD for sorting
  description: string;
  tags: string[];
  coverMediaId: string;
  mediaCount: {
    photos: number;
    videos: number;
  };
  media: MediaItem[];
  isFavorite: boolean;
  pinColor?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FilterState {
  searchQuery: string;
  selectedTags: string[];
  dateFrom: string; // YYYY-MM-DD
  dateTo: string; // YYYY-MM-DD
  mediaType: 'all' | 'photos' | 'videos';
  favoritesOnly: boolean;
  regionFilter?: string;
}

export type WindowResolution = 'fit' | '1440x900' | '1920x1080' | '1280x800';

export type MapStyle =
  | 'atlas-calm'
  | 'satellite-hybrid'
  | 'osm-standard'
  | 'carto-positron'
  | 'topo-light'
  | 'paper-vintage'
  | 'night-slate'
  | 'neon-cyber';

export type PinStyle =
  | 'classic-pin'
  | 'bubble-preview'
  | 'minimal-neon';

export type ZoomSmoothness = 'fast' | 'natural' | 'cinematic';

export type AccentColor = 'amber' | 'blue' | 'emerald' | 'rose' | 'purple';

export type SimulatedAppState = 'ready' | 'loading' | 'empty' | 'error' | 'offline_map_missing';

export interface AppSettings {
  windowResolution: WindowResolution;
  mapStyle: MapStyle;
  pinStyle: PinStyle;
  zoomSmoothness: ZoomSmoothness;
  accentColor: AccentColor;
  show3DBuildings: boolean;
  showStreetLabels: boolean;
  showCoordinatesHUD: boolean;
  autoPreviewVideoOnHover: boolean;
  highContrastMode: boolean;
  clusterRadius: number;
  autoCenterOnSelect: boolean;
  simulatedState: SimulatedAppState;
  defaultZoom: number;
  maxZoomLevel: number;
}

export interface NewMemoryPayload {
  title: string;
  region: string;
  country?: string;
  coordinates: GeoCoordinates;
  primaryDate: string;
  dateRange?: string;
  description: string;
  tags: string[];
  isFavorite?: boolean;
  mediaItems: Array<{
    title: string;
    type: MediaType;
    sceneType: SceneType;
    tags: string[];
    description?: string;
    timestamp?: string;
    duration?: string;
  }>;
}

export interface OfflineMapStatus {
  isAvailable: boolean;
  packName: string;
  version: string;
  sizeOnDiskFormatted: string;
  coverage: string;
  lastUpdated: string;
}

export interface TimelineDateGroup {
  dateGroup: string; // e.g. "Sierpień 2024"
  sortKey: string; // YYYY-MM
  items: Array<{
    media: MediaItem;
    locationId: string;
    locationTitle: string;
    locationRegion: string;
    coordinates: GeoCoordinates;
  }>;
}

/**
 * AppBridge Contract
 * Used by UI components to query and mutate memory data.
 * Can be implemented by MockBridge (frontend prototype) or PySide6Bridge (QWebChannel/Python backend).
 */
export interface IAppBridge {
  getLocations(filters?: FilterState): Promise<MemoryLocation[]>;
  getLocationById(id: string): Promise<MemoryLocation | null>;
  getAllTimelineMedia(filters?: FilterState): Promise<TimelineDateGroup[]>;
  getAllTags(): Promise<{ name: string; count: number }[]>;
  getAllRegions(): Promise<{ name: string; count: number }[]>;
  addMemory(payload: NewMemoryPayload): Promise<MemoryLocation>;
  updateMemory(id: string, updates: Partial<MemoryLocation>): Promise<MemoryLocation>;
  deleteMemory(id: string): Promise<boolean>;
  toggleFavorite(id: string): Promise<boolean>;
  getSettings(): Promise<AppSettings>;
  saveSettings(settings: AppSettings): Promise<AppSettings>;
  getOfflineMapStatus(): Promise<OfflineMapStatus>;
  openInSystemFileManager?(path: string): Promise<boolean>;
}
