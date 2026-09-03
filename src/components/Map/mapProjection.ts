/**
 * Map Coordinate Projection & Vector Geometry for Poland / Central Europe
 * Transforms Latitude/Longitude (WGS84) to SVG ViewBox (x, y) coordinates with Mercator-like projection.
 */

import { GeoCoordinates } from '../../types';

// Bounding box for Poland & Central Europe
export const MAP_BOUNDS = {
  minLat: 48.5,
  maxLat: 55.4,
  minLng: 13.8,
  maxLng: 24.8,
};

export const SVG_VIEWBOX_WIDTH = 1200;
export const SVG_VIEWBOX_HEIGHT = 860;

/**
 * Converts GPS Coordinates to SVG X, Y coordinates
 */
export function geoToSvg(coords: GeoCoordinates): { x: number; y: number } {
  const { lat, lng } = coords;
  
  // Normalized 0 to 1
  const normX = (lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng);
  // Latitude is inverted in SVG (higher lat is lower Y)
  const normY = (MAP_BOUNDS.maxLat - lat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat);

  return {
    x: normX * SVG_VIEWBOX_WIDTH,
    y: normY * SVG_VIEWBOX_HEIGHT,
  };
}

/**
 * Converts SVG X, Y back to GPS Coordinates
 */
export function svgToGeo(x: number, y: number): GeoCoordinates {
  const normX = Math.max(0, Math.min(1, x / SVG_VIEWBOX_WIDTH));
  const normY = Math.max(0, Math.min(1, y / SVG_VIEWBOX_HEIGHT));

  const lng = MAP_BOUNDS.minLng + normX * (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng);
  const lat = MAP_BOUNDS.maxLat - normY * (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat);

  return {
    lat: Math.round(lat * 10000) / 10000,
    lng: Math.round(lng * 10000) / 10000,
  };
}

/**
 * Format coordinates nicely into Decimal and DMS strings
 */
export function formatCoordinates(coords: GeoCoordinates): {
  decimal: string;
  dms: string;
} {
  const latAbs = Math.abs(coords.lat);
  const lngAbs = Math.abs(coords.lng);

  const latHem = coords.lat >= 0 ? 'N' : 'S';
  const lngHem = coords.lng >= 0 ? 'E' : 'W';

  const latDeg = Math.floor(latAbs);
  const latMin = Math.floor((latAbs - latDeg) * 60);
  const latSec = Math.round(((latAbs - latDeg) * 60 - latMin) * 60);

  const lngDeg = Math.floor(lngAbs);
  const lngMin = Math.floor((lngAbs - lngDeg) * 60);
  const lngSec = Math.round(((lngAbs - lngDeg) * 60 - lngMin) * 60);

  return {
    decimal: `${coords.lat.toFixed(4)}° ${latHem}, ${coords.lng.toFixed(4)}° ${lngHem}`,
    dms: `${latDeg}°${latMin}'${latSec}"${latHem} ${lngDeg}°${lngMin}'${lngSec}"${lngHem}`,
  };
}
