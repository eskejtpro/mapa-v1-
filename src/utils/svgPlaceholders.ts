/**
 * Procedural SVG Placeholder & Art Generator
 * Creates offline vector landscape artworks without any external network calls.
 */

import { SceneType } from '../types';

interface ArtConfig {
  from: string;
  to: string;
  accent: string;
  elements: string;
}

export function generateSceneSvg(sceneType: SceneType, title: string, seed: string = '1'): string {
  const configs: Record<SceneType, ArtConfig> = {
    mountains: {
      from: '#1e293b',
      to: '#0f172a',
      accent: '#f59e0b',
      elements: `
        <!-- Sun -->
        <circle cx="280" cy="90" r="38" fill="#fbbf24" opacity="0.85" />
        <circle cx="280" cy="90" r="48" fill="#fbbf24" opacity="0.25" />
        <!-- Distant Mountains -->
        <polygon points="40,240 180,90 320,240" fill="#334155" opacity="0.9" />
        <polygon points="180,90 220,130 190,140 170,120" fill="#f8fafc" opacity="0.8" />
        <polygon points="200,240 340,60 480,240" fill="#1e293b" />
        <polygon points="340,60 375,105 345,120 320,95" fill="#ffffff" opacity="0.9" />
        <!-- Foreground Ridges -->
        <polygon points="-20,240 100,140 240,240" fill="#0f172a" />
        <polygon points="260,240 390,130 500,240" fill="#090d16" />
        <!-- Pines -->
        <polygon points="60,240 70,200 80,240" fill="#064e3b" />
        <polygon points="85,240 95,190 105,240" fill="#022c22" />
        <polygon points="380,240 390,195 400,240" fill="#064e3b" />
      `,
    },
    sea: {
      from: '#075985',
      to: '#0c4a6e',
      accent: '#38bdf8',
      elements: `
        <!-- Sunset horizon -->
        <circle cx="240" cy="140" r="50" fill="#fb923c" opacity="0.9" />
        <line x1="0" y1="140" x2="480" y2="140" stroke="#f97316" stroke-width="2" opacity="0.5" />
        <!-- Lighthouse silhouette -->
        <polygon points="380,140 385,80 395,80 400,140" fill="#082f49" />
        <polygon points="383,80 390,65 397,80" fill="#b91c1c" />
        <circle cx="390" cy="74" r="4" fill="#fef08a" />
        <!-- Light beam -->
        <polygon points="390,74 200,40 180,100" fill="#fef08a" opacity="0.2" />
        <!-- Sea Waves -->
        <path d="M0,150 Q120,140 240,150 T480,150 L480,240 L0,240 Z" fill="#0369a1" opacity="0.8" />
        <path d="M0,175 Q120,165 240,175 T480,175 L480,240 L0,240 Z" fill="#0284c7" opacity="0.6" />
        <path d="M0,205 Q120,195 240,205 T480,205 L480,240 L0,240 Z" fill="#075985" />
        <!-- Birds -->
        <path d="M120,80 Q125,75 130,80 Q135,75 140,80" stroke="#fed7aa" stroke-width="2" fill="none" />
        <path d="M150,90 Q154,86 158,90 Q162,86 166,90" stroke="#fed7aa" stroke-width="1.5" fill="none" />
      `,
    },
    lake: {
      from: '#134e4a',
      to: '#042f2e',
      accent: '#2dd4bf',
      elements: `
        <!-- Calm Lake Mirror -->
        <circle cx="240" cy="80" r="30" fill="#fde047" opacity="0.75" />
        <!-- Shoreline trees -->
        <path d="M0,130 Q120,110 240,125 T480,120 L480,140 L0,140 Z" fill="#115e59" />
        <polygon points="60,130 75,70 90,130" fill="#064e3b" />
        <polygon points="90,130 105,60 120,130" fill="#022c22" />
        <polygon points="350,130 365,75 380,130" fill="#064e3b" />
        <polygon points="380,130 395,65 410,130" fill="#022c22" />
        <!-- Water reflection -->
        <rect x="0" y="140" width="480" height="100" fill="#0f766e" opacity="0.85" />
        <ellipse cx="240" cy="180" rx="40" ry="8" fill="#fde047" opacity="0.3" />
        <ellipse cx="240" cy="205" rx="25" ry="4" fill="#fde047" opacity="0.2" />
        <!-- Wooden Pier / Boat -->
        <polygon points="210,240 225,180 245,180 260,240" fill="#78350f" />
        <line x1="210" y1="200" x2="260" y2="200" stroke="#451a03" stroke-width="2" />
        <line x1="218" y1="220" x2="252" y2="220" stroke="#451a03" stroke-width="2" />
      `,
    },
    forest: {
      from: '#14532d',
      to: '#052e16',
      accent: '#86efac',
      elements: `
        <!-- Mist and dense canopy -->
        <rect x="0" y="0" width="480" height="240" fill="#166534" opacity="0.4" />
        <!-- Tall Pine Trunks -->
        <rect x="60" y="40" width="14" height="200" fill="#451a03" opacity="0.9" />
        <rect x="140" y="20" width="18" height="220" fill="#3f2305" />
        <rect x="230" y="50" width="12" height="190" fill="#2e1a07" />
        <rect x="320" y="15" width="22" height="225" fill="#3f2305" />
        <rect x="410" y="35" width="16" height="205" fill="#2e1a07" />
        <!-- Foliage blobs -->
        <polygon points="30,120 67,40 104,120" fill="#15803d" />
        <polygon points="100,100 149,15 198,100" fill="#166534" />
        <polygon points="200,130 236,45 272,130" fill="#14532d" />
        <polygon points="270,90 331,10 392,90" fill="#15803d" />
        <polygon points="370,110 418,30 466,110" fill="#166534" />
        <!-- Sunbeams -->
        <polygon points="150,0 200,0 350,240 280,240" fill="#fef08a" opacity="0.12" />
        <polygon points="30,0 70,0 160,240 100,240" fill="#fef08a" opacity="0.08" />
      `,
    },
    city: {
      from: '#334155',
      to: '#0f172a',
      accent: '#f59e0b',
      elements: `
        <!-- Old town / historic architecture skyline -->
        <!-- Townhall Tower -->
        <rect x="210" y="60" width="45" height="180" fill="#1e293b" />
        <polygon points="205,60 232,15 260,60" fill="#b45309" />
        <circle cx="232" cy="100" r="10" fill="#fef3c7" stroke="#78350f" stroke-width="2" />
        <line x1="232" y1="100" x2="232" y2="94" stroke="#78350f" stroke-width="1.5" />
        <line x1="232" y1="100" x2="237" y2="100" stroke="#78350f" stroke-width="1.5" />
        <!-- Tenements with ornate roofs -->
        <rect x="40" y="110" width="60" height="130" fill="#475569" />
        <polygon points="35,110 70,75 105,110" fill="#c2410c" />
        <rect x="110" y="90" width="70" height="150" fill="#334155" />
        <polygon points="105,90 145,55 185,90" fill="#9a3412" />
        <rect x="270" y="100" width="75" height="140" fill="#475569" />
        <polygon points="265,100 307,65 350,100" fill="#ea580c" />
        <rect x="360" y="120" width="80" height="120" fill="#1e293b" />
        <polygon points="355,120 400,85 445,120" fill="#b45309" />
        <!-- Warm glowing windows -->
        <rect x="55" y="130" width="10" height="15" fill="#fef08a" opacity="0.85" rx="2" />
        <rect x="75" y="130" width="10" height="15" fill="#fef08a" opacity="0.85" rx="2" />
        <rect x="130" y="115" width="12" height="18" fill="#fef08a" opacity="0.9" rx="2" />
        <rect x="155" y="115" width="12" height="18" fill="#fed7aa" opacity="0.75" rx="2" />
        <rect x="290" y="125" width="12" height="16" fill="#fef08a" opacity="0.85" rx="2" />
        <rect x="315" y="125" width="12" height="16" fill="#fef08a" opacity="0.85" rx="2" />
        <!-- Street cobbles -->
        <rect x="0" y="225" width="480" height="15" fill="#0f172a" />
        <!-- Street lamp -->
        <line x1="195" y1="165" x2="195" y2="230" stroke="#020617" stroke-width="3" />
        <circle cx="195" cy="165" r="7" fill="#fef08a" />
        <circle cx="195" cy="165" r="16" fill="#fef08a" opacity="0.25" />
      `,
    },
    sunset: {
      from: '#7c2d12',
      to: '#1e1b4b',
      accent: '#fb923c',
      elements: `
        <!-- Dramatic Horizon Gradient -->
        <circle cx="240" cy="160" r="70" fill="#f97316" opacity="0.95" />
        <circle cx="240" cy="160" r="95" fill="#fbbf24" opacity="0.3" />
        <!-- Cloud ribbons -->
        <path d="M40,70 Q140,55 260,70 T440,65" stroke="#f43f5e" stroke-width="12" stroke-linecap="round" opacity="0.7" fill="none" />
        <path d="M100,105 Q220,95 340,110 T460,100" stroke="#fb923c" stroke-width="10" stroke-linecap="round" opacity="0.8" fill="none" />
        <path d="M20,135 Q120,125 240,135 T420,130" stroke="#fbbf24" stroke-width="8" stroke-linecap="round" opacity="0.85" fill="none" />
        <!-- Ground Silhouette -->
        <path d="M0,200 Q160,180 320,195 T480,190 L480,240 L0,240 Z" fill="#0f172a" />
        <!-- Distant Windmills / Antenna -->
        <line x1="380" y1="140" x2="380" y2="200" stroke="#020617" stroke-width="2" />
        <line x1="365" y1="130" x2="395" y2="150" stroke="#020617" stroke-width="1.5" />
        <line x1="365" y1="150" x2="395" y2="130" stroke="#020617" stroke-width="1.5" />
      `,
    },
    castle: {
      from: '#312e81',
      to: '#0f172a',
      accent: '#a855f7',
      elements: `
        <!-- Moon -->
        <circle cx="390" cy="65" r="28" fill="#e0e7ff" opacity="0.9" />
        <!-- Mountain Hillside -->
        <path d="M0,240 Q180,130 360,160 T480,240 Z" fill="#1e1b4b" />
        <!-- Castle Main Keep -->
        <rect x="140" y="80" width="80" height="90" fill="#312e81" />
        <polygon points="135,80 180,45 225,80" fill="#4338ca" />
        <!-- Battlements / Turrets -->
        <rect x="100" y="100" width="35" height="75" fill="#1e1b4b" />
        <polygon points="95,100 117,65 140,100" fill="#3730a3" />
        <rect x="225" y="95" width="40" height="80" fill="#1e1b4b" />
        <polygon points="220,95 245,60 270,95" fill="#3730a3" />
        <!-- Gateway Arch -->
        <path d="M165,170 A15,15 0 0,1 195,170 L195,175 L165,175 Z" fill="#0f172a" />
        <!-- Lit Windows -->
        <rect x="172" y="105" width="8" height="14" fill="#fbbf24" rx="2" />
        <rect x="112" y="120" width="6" height="10" fill="#fbbf24" rx="1" />
        <rect x="242" y="115" width="6" height="10" fill="#fbbf24" rx="1" />
      `,
    },
    monument: {
      from: '#475569',
      to: '#1e293b',
      accent: '#38bdf8',
      elements: `
        <!-- Dramatic Sky -->
        <circle cx="240" cy="100" r="140" fill="#64748b" opacity="0.3" />
        <!-- Plinth / Pedestal -->
        <polygon points="170,240 190,150 290,150 310,240" fill="#334155" />
        <rect x="180" y="140" width="120" height="12" fill="#475569" />
        <!-- Monument Figure / Cross / Column -->
        <rect x="232" y="50" width="16" height="90" fill="#1e293b" />
        <rect x="210" y="70" width="60" height="12" fill="#1e293b" />
        <!-- Decorative steps -->
        <rect x="140" y="225" width="200" height="8" fill="#1e293b" />
        <rect x="120" y="233" width="240" height="7" fill="#0f172a" />
      `,
    },
    winter: {
      from: '#1e293b',
      to: '#0f172a',
      accent: '#93c5fd',
      elements: `
        <!-- Pale Winter Sky -->
        <circle cx="120" cy="70" r="30" fill="#e2e8f0" opacity="0.9" />
        <!-- Snow Hills -->
        <path d="M0,240 Q160,140 320,180 T480,160 L480,240 Z" fill="#e2e8f0" />
        <path d="M-20,240 Q180,180 380,220 T500,200 L500,240 Z" fill="#f8fafc" />
        <!-- Snow-covered pines -->
        <polygon points="260,200 275,130 290,200" fill="#1e3a5f" />
        <polygon points="265,160 275,130 285,160" fill="#ffffff" />
        <polygon points="310,220 330,140 350,220" fill="#1e3a5f" />
        <polygon points="318,170 330,140 342,170" fill="#ffffff" />
        <!-- Small wooden cabin -->
        <rect x="100" y="165" width="45" height="30" fill="#78350f" />
        <polygon points="90,165 122,140 155,165" fill="#f8fafc" />
        <rect x="135" y="145" width="6" height="12" fill="#451a03" />
        <rect x="110" y="175" width="8" height="10" fill="#fbbf24" />
        <!-- Smoke puff -->
        <circle cx="138" cy="138" r="4" fill="#cbd5e1" opacity="0.6" />
        <circle cx="142" cy="128" r="6" fill="#cbd5e1" opacity="0.4" />
      `,
    },
    camp: {
      from: '#1c1917',
      to: '#0c0a09',
      accent: '#ea580c',
      elements: `
        <!-- Night stars -->
        <circle cx="70" cy="40" r="1.5" fill="#ffffff" />
        <circle cx="150" cy="65" r="2" fill="#ffffff" opacity="0.8" />
        <circle cx="280" cy="30" r="1.5" fill="#ffffff" />
        <circle cx="390" cy="50" r="2" fill="#ffffff" />
        <circle cx="430" cy="80" r="1.5" fill="#ffffff" />
        <!-- Tent silhouette -->
        <polygon points="90,220 150,130 210,220" fill="#047857" />
        <polygon points="150,130 150,220 180,220" fill="#065f46" />
        <!-- Campfire -->
        <!-- Logs -->
        <line x1="280" y1="215" x2="320" y2="215" stroke="#78350f" stroke-width="6" stroke-linecap="round" />
        <line x1="290" y1="220" x2="310" y2="208" stroke="#451a03" stroke-width="5" stroke-linecap="round" />
        <!-- Fire glow -->
        <circle cx="300" cy="200" r="45" fill="#ea580c" opacity="0.25" />
        <!-- Flames -->
        <polygon points="290,215 300,165 310,215" fill="#f97316" />
        <polygon points="295,215 300,180 305,215" fill="#fbbf24" />
        <!-- Sparks -->
        <circle cx="302" cy="155" r="1.5" fill="#fbbf24" />
        <circle cx="295" cy="145" r="1.5" fill="#f97316" />
      `,
    },
  };

  const cfg = configs[sceneType] || configs.mountains;
  const gradientId = `grad-${sceneType}-${seed.replace(/[^a-zA-Z0-9]/g, '')}`;

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 240" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" class="w-full h-full block">
      <defs>
        <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${cfg.from}" />
          <stop offset="100%" stop-color="${cfg.to}" />
        </linearGradient>
      </defs>
      <rect width="480" height="240" fill="url(#${gradientId})" />
      ${cfg.elements}
      <!-- Subtle bottom gradient for readability -->
      <rect x="0" y="160" width="480" height="80" fill="black" opacity="0.35" />
    </svg>
  `.trim();
}

/**
 * Returns a data URI containing the procedural SVG artwork
 */
export function getSceneSvgDataUri(sceneType: SceneType, title: string, seed: string = '1'): string {
  const svg = generateSceneSvg(sceneType, title, seed);
  const base64 = btoa(unescape(encodeURIComponent(svg)));
  return `data:image/svg+xml;base64,${base64}`;
}
