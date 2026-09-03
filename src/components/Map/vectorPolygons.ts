/**
 * Vector Polygons & Geographic Paths for Poland & Central Europe
 * Deterministic offline vector data.
 */

export interface CityLabel {
  name: string;
  lat: number;
  lng: number;
  isCapital?: boolean;
}

export const MAJOR_CITIES: CityLabel[] = [
  { name: 'Warszawa', lat: 52.2297, lng: 21.0122, isCapital: true },
  { name: 'Kraków', lat: 50.0647, lng: 19.945 },
  { name: 'Gdańsk', lat: 54.352, lng: 18.6466 },
  { name: 'Wrocław', lat: 51.1079, lng: 17.0385 },
  { name: 'Poznań', lat: 52.4064, lng: 16.9252 },
  { name: 'Szczecin', lat: 53.4285, lng: 14.5528 },
  { name: 'Olsztyn', lat: 53.7784, lng: 20.4801 },
  { name: 'Białystok', lat: 53.1325, lng: 23.1688 },
  { name: 'Lublin', lat: 51.2465, lng: 22.5684 },
  { name: 'Rzeszów', lat: 50.0412, lng: 21.9991 },
  { name: 'Zakopane', lat: 49.2992, lng: 19.9496 },
  { name: 'Toruń', lat: 53.0138, lng: 18.5984 },
  { name: 'Katowice', lat: 50.2649, lng: 19.0238 },
];

/**
 * Geometric SVG definitions for Poland boundary, rivers, and topography.
 */
export const POLAND_VECTOR_DATA = {
  // Approximate border contour of Poland transformed into SVG coordinates
  polandBoundary: `
    M 210,130
    C 280,105 380,120 460,110
    C 510,100 580,115 620,125
    C 660,140 710,130 760,165
    C 810,190 850,230 890,280
    C 920,330 945,390 960,450
    C 980,520 970,590 940,640
    C 910,690 870,730 830,760
    C 790,790 730,810 670,820
    C 610,830 550,835 480,820
    C 410,805 350,770 300,720
    C 260,670 230,610 205,550
    C 180,480 160,400 150,320
    C 140,250 160,180 210,130
    Z
  `,

  // Baltic Sea coastline path
  balticCoastline: `
    M 120,60
    L 120,140
    C 200,125 280,105 360,115
    C 420,120 480,110 540,115
    C 600,120 640,135 675,130
    C 700,125 720,105 760,100
    C 820,95 900,110 1000,120
    L 1080,60
    Z
  `,

  // Hel peninsula curve
  helPeninsula: `
    M 550,118
    C 570,100 610,90 640,102
    C 655,108 650,118 630,115
    C 600,110 570,115 550,118
    Z
  `,

  // Wisła River Path (Barania Góra -> Kraków -> Warszawa -> Toruń -> Gdańsk)
  wislaRiver: `
    M 580,780
    C 610,750 640,730 670,710
    C 710,690 735,660 740,600
    C 745,550 760,500 780,460
    C 800,420 780,380 750,360
    C 710,340 660,330 600,320
    C 560,310 530,280 520,240
    C 510,190 525,160 540,120
  `,

  // Odra River Path (Sudety -> Wrocław -> Szczecin -> Zalew Szczeciński)
  odraRiver: `
    M 440,760
    C 410,720 370,680 340,630
    C 310,580 290,520 280,450
    C 270,390 260,330 240,280
    C 220,220 210,180 200,140
  `,

  // Warta River
  wartaRiver: `
    M 560,650
    C 520,600 480,560 430,520
    C 380,480 340,460 290,440
    C 270,440 250,435 240,430
  `,

  // Bug & Narew
  bugRiver: `
    M 940,600
    C 920,530 890,480 850,430
    C 810,390 770,380 740,370
  `,

  // Mountain Shading Areas (Karpaty & Sudety)
  karpatyShading: `
    M 480,820
    C 540,830 600,835 670,820
    C 730,805 780,780 840,750
    C 810,710 740,730 670,740
    C 600,750 540,755 480,820
    Z
  `,

  sudetyShading: `
    M 280,710
    C 320,740 370,760 410,780
    C 420,750 390,720 360,690
    C 330,660 300,680 280,710
    Z
  `,

  // Mazury Lake District Region
  mazuryLakes: [
    { cx: 720, cy: 220, rx: 24, ry: 16, rotate: 20 }, // Śniardwy
    { cx: 690, cy: 190, rx: 18, ry: 10, rotate: -15 }, // Mamry
    { cx: 640, cy: 240, rx: 14, ry: 8, rotate: 45 },  // Jeziorak
    { cx: 750, cy: 260, rx: 12, ry: 7, rotate: 10 },  // Niegocin
    { cx: 780, cy: 210, rx: 15, ry: 9, rotate: -30 }, // Wigry
  ],

  // Graticule grid lines
  graticules: [
    { lat: 50, y: 700, label: '50°N' },
    { lat: 52, y: 440, label: '52°N' },
    { lat: 54, y: 190, label: '54°N' },
    { lng: 16, x: 260, label: '16°E' },
    { lng: 19, x: 570, label: '19°E' },
    { lng: 22, x: 880, label: '22°E' },
  ],
};
