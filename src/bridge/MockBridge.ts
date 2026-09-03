/**
 * MockBridge - Deterministic In-Memory Bridge for "Mapa Wspomnień"
 * Provides realistic Polish travel memories and full simulation of all CRUD,
 * filter, settings, and media querying operations without any network dependencies.
 */

import {
  AppSettings,
  FilterState,
  IAppBridge,
  MediaItem,
  MemoryLocation,
  NewMemoryPayload,
  OfflineMapStatus,
  TimelineDateGroup,
} from '../types';

const INITIAL_MEMORIES: MemoryLocation[] = [
  {
    id: 'loc-tatry-morskie-oko',
    title: 'Morskie Oko i Szczyt Rysy',
    region: 'Tatry Wysokie, Małopolska',
    country: 'Polska',
    coordinates: { lat: 49.2007, lng: 20.0711, altitude: 1395 },
    dateRange: '12–15 Sierpnia 2024',
    primaryDate: '2024-08-14',
    description:
      'Wyprawa o świcie znad Czarnego Stawu na Rysy przy krystalicznym niebie. Widok na słowackie szczyty i błękitną taflę jeziora w dole.',
    tags: ['Góry', 'Szlak', 'Tatry', 'Wędrówka', 'Lato 2024'],
    coverMediaId: 'media-tatry-1',
    isFavorite: true,
    pinColor: '#f59e0b',
    createdAt: '2024-08-16T19:30:00Z',
    updatedAt: '2024-08-16T19:30:00Z',
    mediaCount: { photos: 5, videos: 1 },
    media: [
      {
        id: 'media-tatry-1',
        locationId: 'loc-tatry-morskie-oko',
        type: 'photo',
        title: 'Poranne odbicie Mnicha w Morskim Oku',
        timestamp: '2024-08-14 06:24',
        fileName: 'DSC_4821_Tatry.jpg',
        fileSizeFormatted: '14.2 MB',
        aspectRatio: '16/9',
        sceneType: 'mountains',
        colorPalette: { from: '#0f172a', to: '#1e293b', accent: '#f59e0b' },
        description: 'Tafla wody przed pierwszymi podmuchami wiatru, oświetlona złotym słońcem.',
        tags: ['Morskie Oko', 'Wschód słońca', 'Tatry'],
        exif: {
          cameraMake: 'Sony',
          cameraModel: 'ILCE-7M4 (A7 IV)',
          lens: 'FE 24-70mm F2.8 GM II',
          focalLength: '35mm',
          aperture: 'f/8.0',
          shutterSpeed: '1/320s',
          iso: 100,
          dateTimeOriginal: '2024-08-14 06:24:12',
          gpsLatitude: 49.2007,
          gpsLongitude: 20.0711,
          gpsAltitude: 1395,
          fileSizeBytes: 14890000,
          fileName: 'DSC_4821_Tatry.jpg',
          dimensions: { width: 6000, height: 4000 },
        },
      },
      {
        id: 'media-tatry-2',
        locationId: 'loc-tatry-morskie-oko',
        type: 'photo',
        title: 'Łańcuchy pod wierzchołkiem Rysów',
        timestamp: '2024-08-14 10:15',
        fileName: 'DSC_4890_Rysy.jpg',
        fileSizeFormatted: '18.6 MB',
        aspectRatio: '4/3',
        sceneType: 'mountains',
        colorPalette: { from: '#1e293b', to: '#334155', accent: '#38bdf8' },
        description: 'Eksponowany odcinek graniowy, 2499 m n.p.m.',
        tags: ['Rysy', 'Wspinaczka', 'Szlak'],
        exif: {
          cameraMake: 'Sony',
          cameraModel: 'ILCE-7M4 (A7 IV)',
          lens: 'FE 24-70mm F2.8 GM II',
          focalLength: '24mm',
          aperture: 'f/5.6',
          shutterSpeed: '1/1000s',
          iso: 160,
          dateTimeOriginal: '2024-08-14 10:15:40',
          gpsLatitude: 49.1794,
          gpsLongitude: 20.0881,
          gpsAltitude: 2499,
          fileSizeBytes: 19500000,
          fileName: 'DSC_4890_Rysy.jpg',
        },
      },
      {
        id: 'media-tatry-3',
        locationId: 'loc-tatry-morskie-oko',
        type: 'video',
        title: 'Panorama 360 ze słowackiego i polskiego wierzchołka',
        timestamp: '2024-08-14 10:45',
        fileName: 'VID_20240814_Rysy_360.mp4',
        fileSizeFormatted: '84.5 MB',
        aspectRatio: '16/9',
        duration: '0:48',
        sceneType: 'mountains',
        colorPalette: { from: '#0f172a', to: '#0284c7', accent: '#fbbf24' },
        description: 'Chmury przelewające się przez przełęcz Waga i Mięguszowieckie Szczyty.',
        tags: ['Wideo', 'Panorama', 'Szczyt'],
      },
      {
        id: 'media-tatry-4',
        locationId: 'loc-tatry-morskie-oko',
        type: 'photo',
        title: 'Kolejka kozic przy Kotle pod Rysami',
        timestamp: '2024-08-14 12:30',
        fileName: 'DSC_4945_Kozice.jpg',
        fileSizeFormatted: '12.8 MB',
        aspectRatio: '3/4',
        sceneType: 'mountains',
        colorPalette: { from: '#334155', to: '#475569', accent: '#a3e635' },
        tags: ['Przyroda', 'Fauna', 'Kozice'],
      },
      {
        id: 'media-tatry-5',
        locationId: 'loc-tatry-morskie-oko',
        type: 'photo',
        title: 'Popołudniowa mgła nad Schroniskiem',
        timestamp: '2024-08-14 16:50',
        fileName: 'DSC_5012_Schronisko.jpg',
        fileSizeFormatted: '15.1 MB',
        aspectRatio: '16/9',
        sceneType: 'mountains',
        colorPalette: { from: '#1e293b', to: '#0f172a', accent: '#f59e0b' },
        tags: ['Schronisko', 'Zmierzch', 'Odpoczynek'],
      },
      {
        id: 'media-tatry-6',
        locationId: 'loc-tatry-morskie-oko',
        type: 'photo',
        title: 'Nocne niebo nad Czarnym Stawem',
        timestamp: '2024-08-14 22:15',
        fileName: 'DSC_5088_Astro.jpg',
        fileSizeFormatted: '24.3 MB',
        aspectRatio: '16/9',
        sceneType: 'camp',
        colorPalette: { from: '#090d16', to: '#1e1b4b', accent: '#818cf8' },
        description: 'Droga Mleczna wisząca pionowo nad Kazalnicą Mengusowiecką.',
        tags: ['Astrofoto', 'Droga Mleczna', 'Noc'],
      },
    ],
  },
  {
    id: 'loc-sopot-molo',
    title: 'Molo i Plaża w Sopocie',
    region: 'Trójmiasto, Pomorskie',
    country: 'Polska',
    coordinates: { lat: 54.4447, lng: 18.5708, altitude: 2 },
    dateRange: '20–23 Lipca 2024',
    primaryDate: '2024-07-22',
    description:
      'Spacer najdłuższym drewnianym molo w Europie o zachodzie słońca. Szum Bałtyku, mewy i wieczorny koncert na skwerze Kuracyjnym.',
    tags: ['Bałtyk', 'Morze', 'Plaża', 'Zachód słońca', 'Wakacje'],
    coverMediaId: 'media-sopot-1',
    isFavorite: true,
    pinColor: '#0ea5e9',
    createdAt: '2024-07-24T12:00:00Z',
    updatedAt: '2024-07-24T12:00:00Z',
    mediaCount: { photos: 4, videos: 1 },
    media: [
      {
        id: 'media-sopot-1',
        locationId: 'loc-sopot-molo',
        type: 'photo',
        title: 'Zachód słońca nad Mariną Sopot',
        timestamp: '2024-07-22 21:05',
        fileName: 'IMG_7701_SopotMarina.jpg',
        fileSizeFormatted: '11.4 MB',
        aspectRatio: '16/9',
        sceneType: 'sea',
        colorPalette: { from: '#0c4a6e', to: '#7c2d12', accent: '#f97316' },
        description: 'Złota godzina odbijająca się w masztach jachtów zacumowanych w marinie.',
        tags: ['Marina', 'Zachód słońca', 'Sopot'],
        exif: {
          cameraMake: 'Fujifilm',
          cameraModel: 'X-T5',
          lens: 'XF 16-55mm F2.8 R LM WR',
          focalLength: '23mm',
          aperture: 'f/4.0',
          shutterSpeed: '1/250s',
          iso: 200,
          dateTimeOriginal: '2024-07-22 21:05:32',
          gpsLatitude: 54.4447,
          gpsLongitude: 18.5708,
          fileSizeBytes: 11954000,
          fileName: 'IMG_7701_SopotMarina.jpg',
        },
      },
      {
        id: 'media-sopot-2',
        locationId: 'loc-sopot-molo',
        type: 'photo',
        title: 'Drewniana perspektywa desek molo',
        timestamp: '2024-07-22 17:30',
        fileName: 'IMG_7640_MoloDeski.jpg',
        fileSizeFormatted: '9.8 MB',
        aspectRatio: '4/3',
        sceneType: 'sea',
        colorPalette: { from: '#0369a1', to: '#0284c7', accent: '#fed7aa' },
        tags: ['Detal', 'Architektura', 'Molo'],
      },
      {
        id: 'media-sopot-3',
        locationId: 'loc-sopot-molo',
        type: 'video',
        title: 'Szum fal u stóp latarni morskiej',
        timestamp: '2024-07-22 19:15',
        fileName: 'VID_Sopot_Waves.mp4',
        fileSizeFormatted: '52.1 MB',
        aspectRatio: '16/9',
        duration: '0:34',
        sceneType: 'sea',
        colorPalette: { from: '#082f49', to: '#075985', accent: '#38bdf8' },
        tags: ['Dźwięk', 'Fale', 'Relaks'],
      },
      {
        id: 'media-sopot-4',
        locationId: 'loc-sopot-molo',
        type: 'photo',
        title: 'Grand Hotel w wieczornym oświetleniu',
        timestamp: '2024-07-22 22:10',
        fileName: 'IMG_7810_GrandHotel.jpg',
        fileSizeFormatted: '13.2 MB',
        aspectRatio: '16/9',
        sceneType: 'city',
        colorPalette: { from: '#0f172a', to: '#1e293b', accent: '#fbbf24' },
        tags: ['Grand Hotel', 'Noc', 'Iluminacja'],
      },
      {
        id: 'media-sopot-5',
        locationId: 'loc-sopot-molo',
        type: 'photo',
        title: 'Mewy nad brzegiem Bałtyku o poranku',
        timestamp: '2024-07-23 06:10',
        fileName: 'IMG_7855_Mewy.jpg',
        fileSizeFormatted: '8.7 MB',
        aspectRatio: '1/1',
        sceneType: 'sea',
        colorPalette: { from: '#0284c7', to: '#bae6fd', accent: '#ffffff' },
        tags: ['Mewy', 'Poranek', 'Plaża'],
      },
    ],
  },
  {
    id: 'loc-bieszczady-tarnica',
    title: 'Tarnica i Połonina Caryńska',
    region: 'Bieszczady, Podkarpackie',
    country: 'Polska',
    coordinates: { lat: 49.0747, lng: 22.7264, altitude: 1346 },
    dateRange: '5–8 Października 2024',
    primaryDate: '2024-10-06',
    description:
      'Złota polska jesień w Bieszczadzkim Parku Narodowym. Rdzawe trawy połonin, zapach buczyny i ognisko pod bezkresnym rozgwieżdżonym niebem w Wetlinie.',
    tags: ['Bieszczady', 'Połoniny', 'Jesień', 'Ognisko', 'Przygoda'],
    coverMediaId: 'media-bieszczady-1',
    isFavorite: true,
    pinColor: '#d97706',
    createdAt: '2024-10-09T08:00:00Z',
    updatedAt: '2024-10-09T08:00:00Z',
    mediaCount: { photos: 5, videos: 0 },
    media: [
      {
        id: 'media-bieszczady-1',
        locationId: 'loc-bieszczady-tarnica',
        type: 'photo',
        title: 'Złote trawy na Połoninie Caryńskiej',
        timestamp: '2024-10-06 14:20',
        fileName: 'RAW_8812_Carynska.jpg',
        fileSizeFormatted: '16.5 MB',
        aspectRatio: '16/9',
        sceneType: 'sunset',
        colorPalette: { from: '#78350f', to: '#451a03', accent: '#f59e0b' },
        description: 'Niesamowity odcień jesiennych traw falujących na wietrze pod słońce.',
        tags: ['Caryńska', 'Jesień', 'Panorama'],
      },
      {
        id: 'media-bieszczady-2',
        locationId: 'loc-bieszczady-tarnica',
        type: 'photo',
        title: 'Żelazny Krzyż na szczycie Tarnicy',
        timestamp: '2024-10-06 11:45',
        fileName: 'RAW_8780_TarnicaKrzyz.jpg',
        fileSizeFormatted: '14.1 MB',
        aspectRatio: '4/3',
        sceneType: 'monument',
        colorPalette: { from: '#334155', to: '#1e293b', accent: '#38bdf8' },
        tags: ['Tarnica', 'Szczyt', '1346m'],
      },
      {
        id: 'media-bieszczady-3',
        locationId: 'loc-bieszczady-tarnica',
        type: 'photo',
        title: 'Stary bukowy las w dolinie potoku Wołosaty',
        timestamp: '2024-10-07 09:30',
        fileName: 'RAW_8902_Buczyna.jpg',
        fileSizeFormatted: '19.2 MB',
        aspectRatio: '3/4',
        sceneType: 'forest',
        colorPalette: { from: '#713f12', to: '#14532d', accent: '#eab308' },
        tags: ['Buk', 'Las', 'Mgła'],
      },
      {
        id: 'media-bieszczady-4',
        locationId: 'loc-bieszczady-tarnica',
        type: 'photo',
        title: 'Wieczorne ognisko w Wetlinie z herbatą z pędów sosny',
        timestamp: '2024-10-07 20:15',
        fileName: 'RAW_8955_Ognisko.jpg',
        fileSizeFormatted: '12.0 MB',
        aspectRatio: '16/9',
        sceneType: 'camp',
        colorPalette: { from: '#1c1917', to: '#0c0a09', accent: '#ea580c' },
        tags: ['Ognisko', 'Baza', 'Ciepło'],
      },
      {
        id: 'media-bieszczady-5',
        locationId: 'loc-bieszczady-tarnica',
        type: 'photo',
        title: 'Cerkiew w Smolniku o poranku',
        timestamp: '2024-10-08 07:40',
        fileName: 'RAW_9011_Cerkiew.jpg',
        fileSizeFormatted: '15.8 MB',
        aspectRatio: '16/9',
        sceneType: 'castle',
        colorPalette: { from: '#451a03', to: '#1c1917', accent: '#fde047' },
        tags: ['Zabytki', 'Cerkiew', 'UNESCO'],
      },
    ],
  },
  {
    id: 'loc-krakow-rynek',
    title: 'Rynek Główny i Sukiennice',
    region: 'Kraków, Małopolska',
    country: 'Polska',
    coordinates: { lat: 50.0619, lng: 19.9368, altitude: 219 },
    dateRange: '18–20 Maja 2024',
    primaryDate: '2024-05-19',
    description:
      'Weekend w sercu dawnej stolicy. Hejnał z wieży Mariackiej, zapach obwarzanków, podziemia Sukiennic i wieczorny spacer klimatycznymi uliczkami Kazimierza.',
    tags: ['Miasto', 'Zabytki', 'Architektura', 'Kawiarnie', 'Weekend'],
    coverMediaId: 'media-krakow-1',
    isFavorite: false,
    pinColor: '#ef4444',
    createdAt: '2024-05-21T15:00:00Z',
    updatedAt: '2024-05-21T15:00:00Z',
    mediaCount: { photos: 6, videos: 1 },
    media: [
      {
        id: 'media-krakow-1',
        locationId: 'loc-krakow-rynek',
        type: 'photo',
        title: 'Sukiennice i Wieża Ratuszowa w porannym słońcu',
        timestamp: '2024-05-19 08:30',
        fileName: 'KRK_3010_Sukiennice.jpg',
        fileSizeFormatted: '13.7 MB',
        aspectRatio: '16/9',
        sceneType: 'city',
        colorPalette: { from: '#334155', to: '#0f172a', accent: '#f59e0b' },
        description: 'Pusty jeszcze Rynek Główny przed przybyciem wycieczek.',
        tags: ['Rynek', 'Sukiennice', 'Rano'],
      },
      {
        id: 'media-krakow-2',
        locationId: 'loc-krakow-rynek',
        type: 'photo',
        title: 'Błękitny ołtarz Wita Stwosza w Kościele Mariackim',
        timestamp: '2024-05-19 11:20',
        fileName: 'KRK_3075_Mariacki.jpg',
        fileSizeFormatted: '18.4 MB',
        aspectRatio: '3/4',
        sceneType: 'monument',
        colorPalette: { from: '#1e1b4b', to: '#312e81', accent: '#fbbf24' },
        tags: ['Kościół Mariacki', 'Gotyk', 'Sztuka'],
      },
      {
        id: 'media-krakow-3',
        locationId: 'loc-krakow-rynek',
        type: 'video',
        title: 'Trębacz grający hejnał z Wieży Mariackiej',
        timestamp: '2024-05-19 12:00',
        fileName: 'VID_Hejnal_Mariacki.mp4',
        fileSizeFormatted: '68.9 MB',
        aspectRatio: '16/9',
        duration: '1:05',
        sceneType: 'city',
        colorPalette: { from: '#1e293b', to: '#475569', accent: '#f59e0b' },
        tags: ['Hejnał', 'Tradycja', 'Wideo'],
      },
      {
        id: 'media-krakow-4',
        locationId: 'loc-krakow-rynek',
        type: 'photo',
        title: 'Dziedziniec arkadowy Zamku Królewskiego na Wawelu',
        timestamp: '2024-05-19 15:40',
        fileName: 'KRK_3150_Wawel.jpg',
        fileSizeFormatted: '14.9 MB',
        aspectRatio: '16/9',
        sceneType: 'castle',
        colorPalette: { from: '#78350f', to: '#451a03', accent: '#fde047' },
        tags: ['Wawel', 'Renesans', 'Dziedziniec'],
      },
      {
        id: 'media-krakow-5',
        locationId: 'loc-krakow-rynek',
        type: 'photo',
        title: 'Kawiarnia na placu Nowym na Kazimierzu',
        timestamp: '2024-05-19 20:10',
        fileName: 'KRK_3210_Kazimierz.jpg',
        fileSizeFormatted: '10.2 MB',
        aspectRatio: '4/3',
        sceneType: 'city',
        colorPalette: { from: '#1c1917', to: '#292524', accent: '#ea580c' },
        tags: ['Kazimierz', 'Klimat', 'Wieczór'],
      },
      {
        id: 'media-krakow-6',
        locationId: 'loc-krakow-rynek',
        type: 'photo',
        title: 'Planty krakowskie obsypane kasztanowcami',
        timestamp: '2024-05-20 10:00',
        fileName: 'KRK_3290_Planty.jpg',
        fileSizeFormatted: '11.8 MB',
        aspectRatio: '16/9',
        sceneType: 'forest',
        colorPalette: { from: '#14532d', to: '#166534', accent: '#86efac' },
        tags: ['Park', 'Wiosna', 'Spacer'],
      },
      {
        id: 'media-krakow-7',
        locationId: 'loc-krakow-rynek',
        type: 'photo',
        title: 'Dorożki konne przed kościołem św. Wojciecha',
        timestamp: '2024-05-20 14:15',
        fileName: 'KRK_3340_Dorozka.jpg',
        fileSizeFormatted: '12.6 MB',
        aspectRatio: '1/1',
        sceneType: 'city',
        colorPalette: { from: '#334155', to: '#1e293b', accent: '#fbbf24' },
        tags: ['Dorożka', 'Konie', 'Rynek'],
      },
    ],
  },
  {
    id: 'loc-mazury-sniardwy',
    title: 'Jezioro Śniardwy i Mikołajki',
    region: 'Kraina Wielkich Jezior, Warmińsko-Mazurskie',
    country: 'Polska',
    coordinates: { lat: 53.7542, lng: 21.7247, altitude: 116 },
    dateRange: '1–6 Sierpnia 2024',
    primaryDate: '2024-08-03',
    description:
      'Rejs żaglówką po „Mazurskim Morzu”. Cisza w trzcinowiskach, cumowanie na dziko przy wyspie Czarci Ostrów i kąpiele w nagrzanej słońcem wodzie.',
    tags: ['Mazury', 'Żagle', 'Jezioro', 'Woda', 'Lato', 'Przygoda'],
    coverMediaId: 'media-mazury-1',
    isFavorite: true,
    pinColor: '#10b981',
    createdAt: '2024-08-08T18:00:00Z',
    updatedAt: '2024-08-08T18:00:00Z',
    mediaCount: { photos: 5, videos: 1 },
    media: [
      {
        id: 'media-mazury-1',
        locationId: 'loc-mazury-sniardwy',
        type: 'photo',
        title: 'Białe żagle na błękicie Śniardw',
        timestamp: '2024-08-03 15:30',
        fileName: 'MAZ_1102_Zagle.jpg',
        fileSizeFormatted: '15.4 MB',
        aspectRatio: '16/9',
        sceneType: 'lake',
        colorPalette: { from: '#0f766e', to: '#115e59', accent: '#2dd4bf' },
        description: 'Trójka jachtów płynąca baksztagiem w kierunku Popielna.',
        tags: ['Śniardwy', 'Żeglarstwo', 'Wiatr'],
      },
      {
        id: 'media-mazury-2',
        locationId: 'loc-mazury-sniardwy',
        type: 'video',
        title: 'Zachód słońca z pokładu jachtu na kotwicy',
        timestamp: '2024-08-03 20:45',
        fileName: 'VID_Mazury_Sunset_Kotwica.mp4',
        fileSizeFormatted: '77.2 MB',
        aspectRatio: '16/9',
        duration: '0:52',
        sceneType: 'sunset',
        colorPalette: { from: '#7c2d12', to: '#1e1b4b', accent: '#f97316' },
        tags: ['Zachód', 'Kotwica', 'Wideo'],
      },
      {
        id: 'media-mazury-3',
        locationId: 'loc-mazury-sniardwy',
        type: 'photo',
        title: 'Wyspa Pajęcza w porannej mgle',
        timestamp: '2024-08-04 05:50',
        fileName: 'MAZ_1180_Mgla.jpg',
        fileSizeFormatted: '13.1 MB',
        aspectRatio: '16/9',
        sceneType: 'lake',
        colorPalette: { from: '#134e4a', to: '#042f2e', accent: '#fde047' },
        tags: ['Wyspa', 'Mgła', 'Spokój'],
      },
      {
        id: 'media-mazury-4',
        locationId: 'loc-mazury-sniardwy',
        type: 'photo',
        title: 'Wioska Żeglarska w Mikołajkach nocą',
        timestamp: '2024-08-04 22:30',
        fileName: 'MAZ_1230_Mikolajki.jpg',
        fileSizeFormatted: '10.8 MB',
        aspectRatio: '4/3',
        sceneType: 'city',
        colorPalette: { from: '#0f172a', to: '#1e293b', accent: '#38bdf8' },
        tags: ['Mikołajki', 'Marina', 'Noc'],
      },
      {
        id: 'media-mazury-5',
        locationId: 'loc-mazury-sniardwy',
        type: 'photo',
        title: 'Kormorany suszące skrzydła na gałęzi',
        timestamp: '2024-08-05 11:10',
        fileName: 'MAZ_1295_Kormorany.jpg',
        fileSizeFormatted: '16.7 MB',
        aspectRatio: '3/4',
        sceneType: 'forest',
        colorPalette: { from: '#166534', to: '#14532d', accent: '#ca8a04' },
        tags: ['Ptaki', 'Przyroda', 'Kormorany'],
      },
      {
        id: 'media-mazury-6',
        locationId: 'loc-mazury-sniardwy',
        type: 'photo',
        title: 'Klarowanie pokładu w blasku południa',
        timestamp: '2024-08-05 13:00',
        fileName: 'MAZ_1340_Poklad.jpg',
        fileSizeFormatted: '11.0 MB',
        aspectRatio: '1/1',
        sceneType: 'lake',
        colorPalette: { from: '#0f766e', to: '#042f2e', accent: '#ffffff' },
        tags: ['Jacht', 'Liny', 'Słońce'],
      },
    ],
  },
  {
    id: 'loc-walbrzych-ksiaz',
    title: 'Zamek Książ i Wąwóz Pełcznicy',
    region: 'Wałbrzych, Dolny Śląsk',
    country: 'Polska',
    coordinates: { lat: 50.8428, lng: 16.2925, altitude: 395 },
    dateRange: '14–16 Czerwca 2024',
    primaryDate: '2024-06-15',
    description:
      'Perła Śląska zawieszona na skale nad zalesionym wąwozem. Zwiedzanie Sali Maksymiliana, tarasów kwiatowych i spacer ścieżką Hochbergów.',
    tags: ['Zamki', 'Historia', 'Dolny Śląsk', 'Tajemnice', 'Architektura'],
    coverMediaId: 'media-ksiaz-1',
    isFavorite: false,
    pinColor: '#8b5cf6',
    createdAt: '2024-06-18T10:00:00Z',
    updatedAt: '2024-06-18T10:00:00Z',
    mediaCount: { photos: 4, videos: 0 },
    media: [
      {
        id: 'media-ksiaz-1',
        locationId: 'loc-walbrzych-ksiaz',
        type: 'photo',
        title: 'Majestatyczna bryła Zamku Książ nad urwiskiem',
        timestamp: '2024-06-15 14:00',
        fileName: 'KSZ_4401_Glowny.jpg',
        fileSizeFormatted: '17.3 MB',
        aspectRatio: '16/9',
        sceneType: 'castle',
        colorPalette: { from: '#312e81', to: '#1e1b4b', accent: '#a855f7' },
        description: 'Widok z punktu widokowego Grób Księżnej Daisy.',
        tags: ['Książ', 'Zamek', 'Śląsk'],
      },
      {
        id: 'media-ksiaz-2',
        locationId: 'loc-walbrzych-ksiaz',
        type: 'photo',
        title: 'Barokowy splendor Sali Maksymiliana',
        timestamp: '2024-06-15 15:30',
        fileName: 'KSZ_4480_Maksymilian.jpg',
        fileSizeFormatted: '19.8 MB',
        aspectRatio: '4/3',
        sceneType: 'castle',
        colorPalette: { from: '#78350f', to: '#451a03', accent: '#fbbf24' },
        tags: ['Wnętrza', 'Barok', 'Złoto'],
      },
      {
        id: 'media-ksiaz-3',
        locationId: 'loc-walbrzych-ksiaz',
        type: 'photo',
        title: 'Kwitnące rododendrony na tarasie bogini Flory',
        timestamp: '2024-06-15 17:15',
        fileName: 'KSZ_4520_Tarasy.jpg',
        fileSizeFormatted: '14.6 MB',
        aspectRatio: '16/9',
        sceneType: 'forest',
        colorPalette: { from: '#15803d', to: '#166534', accent: '#f43f5e' },
        tags: ['Ogród', 'Tarasy', 'Kwiaty'],
      },
      {
        id: 'media-ksiaz-4',
        locationId: 'loc-walbrzych-ksiaz',
        type: 'photo',
        title: 'Cisza i mchy w Przełomie Pełcznicy',
        timestamp: '2024-06-16 10:45',
        fileName: 'KSZ_4601_Pelcznica.jpg',
        fileSizeFormatted: '13.0 MB',
        aspectRatio: '3/4',
        sceneType: 'forest',
        colorPalette: { from: '#064e3b', to: '#022c22', accent: '#86efac' },
        tags: ['Wąwóz', 'Natura', 'Szlak'],
      },
    ],
  },
  {
    id: 'loc-wroclaw-ostrow',
    title: 'Ostrów Tumski i Most Tumski',
    region: 'Wrocław, Dolny Śląsk',
    country: 'Polska',
    coordinates: { lat: 51.1143, lng: 17.0464, altitude: 118 },
    dateRange: '28–30 Września 2024',
    primaryDate: '2024-09-29',
    description:
      'Wieczorny spacer w poszukiwaniu legendarnego wrocławskiego latarnika w cylindrze i pelerynie ręcznie zapalającego gazowe latarnie na Ostrowie Tumskim.',
    tags: ['Wrocław', 'Mosty', 'Miasto', 'Latarnik', 'Noc', 'Architektura'],
    coverMediaId: 'media-wroclaw-1',
    isFavorite: false,
    pinColor: '#3b82f6',
    createdAt: '2024-10-01T14:00:00Z',
    updatedAt: '2024-10-01T14:00:00Z',
    mediaCount: { photos: 5, videos: 1 },
    media: [
      {
        id: 'media-wroclaw-1',
        locationId: 'loc-wroclaw-ostrow',
        type: 'photo',
        title: 'Latarnik zapalający latarnię gazową pod Katedrą',
        timestamp: '2024-09-29 19:10',
        fileName: 'WRO_8801_Latarnik.jpg',
        fileSizeFormatted: '16.0 MB',
        aspectRatio: '3/4',
        sceneType: 'city',
        colorPalette: { from: '#0f172a', to: '#1e293b', accent: '#f59e0b' },
        description: 'Unikalny moment zmierzchu na brukowanej uliczce Kanonii.',
        tags: ['Latarnik', 'Tradycja', 'Ostrów Tumski'],
      },
      {
        id: 'media-wroclaw-2',
        locationId: 'loc-wroclaw-ostrow',
        type: 'video',
        title: 'Płomień w zabytkowej latarni i dzwony Katedry',
        timestamp: '2024-09-29 19:25',
        fileName: 'VID_Wroclaw_Latarnik_Katedra.mp4',
        fileSizeFormatted: '45.8 MB',
        aspectRatio: '16/9',
        duration: '0:38',
        sceneType: 'city',
        colorPalette: { from: '#1e293b', to: '#0f172a', accent: '#fbbf24' },
        tags: ['Wideo', 'Dźwięk', 'Gaz'],
      },
      {
        id: 'media-wroclaw-3',
        locationId: 'loc-wroclaw-ostrow',
        type: 'photo',
        title: 'Podświetlony Most Tumski nad Odrą',
        timestamp: '2024-09-29 20:30',
        fileName: 'WRO_8890_MostTumski.jpg',
        fileSizeFormatted: '14.3 MB',
        aspectRatio: '16/9',
        sceneType: 'city',
        colorPalette: { from: '#0c4a6e', to: '#0f172a', accent: '#38bdf8' },
        tags: ['Odra', 'Most', 'Noc'],
      },
      {
        id: 'media-wroclaw-4',
        locationId: 'loc-wroclaw-ostrow',
        type: 'photo',
        title: 'Wrocławskie krasnale przy Ratuszu',
        timestamp: '2024-09-30 11:15',
        fileName: 'WRO_8950_Krasnal.jpg',
        fileSizeFormatted: '9.2 MB',
        aspectRatio: '1/1',
        sceneType: 'monument',
        colorPalette: { from: '#334155', to: '#475569', accent: '#eab308' },
        tags: ['Krasnale', 'Humor', 'Detal'],
      },
      {
        id: 'media-wroclaw-5',
        locationId: 'loc-wroclaw-ostrow',
        type: 'photo',
        title: 'Ogród Botaniczny Uniwersytetu Wrocławskiego',
        timestamp: '2024-09-30 14:00',
        fileName: 'WRO_9012_Botaniczny.jpg',
        fileSizeFormatted: '15.7 MB',
        aspectRatio: '16/9',
        sceneType: 'forest',
        colorPalette: { from: '#14532d', to: '#166534', accent: '#a3e635' },
        tags: ['Ogród Botaniczny', 'Lilie wodne', 'Jesień'],
      },
      {
        id: 'media-wroclaw-6',
        locationId: 'loc-wroclaw-ostrow',
        type: 'photo',
        title: 'Hala Stulecia i Pergola z fontanną multimedialną',
        timestamp: '2024-09-30 17:40',
        fileName: 'WRO_9099_HalaStulecia.jpg',
        fileSizeFormatted: '18.1 MB',
        aspectRatio: '16/9',
        sceneType: 'city',
        colorPalette: { from: '#1e293b', to: '#334155', accent: '#60a5fa' },
        tags: ['UNESCO', 'Modernizm', 'Pergola'],
      },
    ],
  },
  {
    id: 'loc-bialowieza-puszcza',
    title: 'Puszcza Białowieska i Rezerwat Żubrów',
    region: 'Podlasie, Podlaskie',
    country: 'Polska',
    coordinates: { lat: 52.7008, lng: 23.8647, altitude: 155 },
    dateRange: '10–13 Listopada 2024',
    primaryDate: '2024-11-11',
    description:
      'Ostatni pierwotny nizinny las Europy. Prastare dęby, wilgotny chłód mchów, poranne tropienie stada żubrów w oparach mgły na polanie Batorówka.',
    tags: ['Puszcza', 'Przyroda', 'Zwierzęta', 'Las', 'Jesień', 'UNESCO'],
    coverMediaId: 'media-puszcza-1',
    isFavorite: true,
    pinColor: '#059669',
    createdAt: '2024-11-15T09:00:00Z',
    updatedAt: '2024-11-15T09:00:00Z',
    mediaCount: { photos: 4, videos: 0 },
    media: [
      {
        id: 'media-puszcza-1',
        locationId: 'loc-bialowieza-puszcza',
        type: 'photo',
        title: 'Samotny żubr w gęstej porannej mgle',
        timestamp: '2024-11-11 07:15',
        fileName: 'PBI_2010_ZubrMgla.jpg',
        fileSizeFormatted: '21.5 MB',
        aspectRatio: '16/9',
        sceneType: 'forest',
        colorPalette: { from: '#14532d', to: '#052e16', accent: '#ca8a04' },
        description: 'Potężny byk wyłaniający się z lasu na skraju polany.',
        tags: ['Żubr', 'Król Puszczy', 'Mgła'],
      },
      {
        id: 'media-puszcza-2',
        locationId: 'loc-bialowieza-puszcza',
        type: 'photo',
        title: 'Dąb Jagiełły i martwe prastare drewno',
        timestamp: '2024-11-11 11:30',
        fileName: 'PBI_2080_Dab.jpg',
        fileSizeFormatted: '18.9 MB',
        aspectRatio: '4/3',
        sceneType: 'forest',
        colorPalette: { from: '#2e1a07', to: '#14532d', accent: '#86efac' },
        tags: ['Dąb', 'Drzewo', 'Starodrzew'],
      },
      {
        id: 'media-puszcza-3',
        locationId: 'loc-bialowieza-puszcza',
        type: 'photo',
        title: 'Kładka Żebra Żubra w szronie',
        timestamp: '2024-11-12 08:45',
        fileName: 'PBI_2140_Kladka.jpg',
        fileSizeFormatted: '15.2 MB',
        aspectRatio: '16/9',
        sceneType: 'winter',
        colorPalette: { from: '#1e293b', to: '#0f172a', accent: '#93c5fd' },
        tags: ['Szlak', 'Szron', 'Bagna'],
      },
      {
        id: 'media-puszcza-4',
        locationId: 'loc-bialowieza-puszcza',
        type: 'photo',
        title: 'Tradycyjna podlaska chata z okiennicami w Teremiskach',
        timestamp: '2024-11-12 14:20',
        fileName: 'PBI_2200_Chata.jpg',
        fileSizeFormatted: '12.4 MB',
        aspectRatio: '16/9',
        sceneType: 'city',
        colorPalette: { from: '#451a03', to: '#1c1917', accent: '#38bdf8' },
        tags: ['Architektura drewniana', 'Kraina Otwartych Okiennic', 'Podlasie'],
      },
    ],
  },
  {
    id: 'loc-hel-cypel',
    title: 'Cypel Rewski i Półwysep Helski',
    region: 'Zatoka Pucka, Pomorskie',
    country: 'Polska',
    coordinates: { lat: 54.6322, lng: 18.5147, altitude: 1 },
    dateRange: '8–12 Czerwca 2024',
    primaryDate: '2024-06-10',
    description:
      'Wąski pas lądu rozcinający dwie wody: Zatokę Pucką i otwarty Bałtyk. Mewy, szum wiatru w trawach wydmowych i barwne latawce kitesurferów.',
    tags: ['Półwysep', 'Kitesurfing', 'Bałtyk', 'Wydmy', 'Wiatr', 'Lato'],
    coverMediaId: 'media-hel-1',
    isFavorite: false,
    pinColor: '#06b6d4',
    createdAt: '2024-06-14T11:00:00Z',
    updatedAt: '2024-06-14T11:00:00Z',
    mediaCount: { photos: 4, videos: 0 },
    media: [
      {
        id: 'media-hel-1',
        locationId: 'loc-hel-cypel',
        type: 'photo',
        title: 'Szpica Cypla Rewskiego wbijająca się w błękit Zatoki',
        timestamp: '2024-06-10 13:00',
        fileName: 'HEL_5011_Cypel.jpg',
        fileSizeFormatted: '16.8 MB',
        aspectRatio: '16/9',
        sceneType: 'sea',
        colorPalette: { from: '#082f49', to: '#0c4a6e', accent: '#38bdf8' },
        description: 'Piaszczysty cypel zbiegający się z mielizną Rybitwią.',
        tags: ['Rewa', 'Cypel', 'Zatoka Pucka'],
      },
      {
        id: 'media-hel-2',
        locationId: 'loc-hel-cypel',
        type: 'photo',
        title: 'Dziesiątki kolorowych latawców nad Chałupami',
        timestamp: '2024-06-10 16:30',
        fileName: 'HEL_5090_Kite.jpg',
        fileSizeFormatted: '14.0 MB',
        aspectRatio: '16/9',
        sceneType: 'sea',
        colorPalette: { from: '#0284c7', to: '#0369a1', accent: '#f43f5e' },
        tags: ['Kitesurfing', 'Chałupy', 'Sport'],
      },
      {
        id: 'media-hel-3',
        locationId: 'loc-hel-cypel',
        type: 'photo',
        title: 'Ścieżka na wydmie wśród sosnowego lasu',
        timestamp: '2024-06-11 10:15',
        fileName: 'HEL_5150_Wydma.jpg',
        fileSizeFormatted: '13.5 MB',
        aspectRatio: '4/3',
        sceneType: 'forest',
        colorPalette: { from: '#15803d', to: '#0f766e', accent: '#fed7aa' },
        tags: ['Wydmy', 'Sosny', 'Plaża'],
      },
      {
        id: 'media-hel-4',
        locationId: 'loc-hel-cypel',
        type: 'photo',
        title: 'Latarnia Morska na Helu o zmroku',
        timestamp: '2024-06-11 21:40',
        fileName: 'HEL_5220_Latarnia.jpg',
        fileSizeFormatted: '15.1 MB',
        aspectRatio: '3/4',
        sceneType: 'sea',
        colorPalette: { from: '#0c4a6e', to: '#020617', accent: '#fbbf24' },
        tags: ['Latarnia', 'Hel', 'Zmierzch'],
      },
    ],
  },
  {
    id: 'loc-tatry-koscieliska',
    title: 'Dolina Kościeliska i Wąwóz Kraków',
    region: 'Tatry Zachodnie, Małopolska',
    country: 'Polska',
    coordinates: { lat: 49.2572, lng: 19.8681, altitude: 960 },
    dateRange: '20–22 Lutego 2024',
    primaryDate: '2024-02-21',
    description:
      'Zimowa bajka w Tatrach Zachodnich. Ośnieżone świerki uginające się pod puchem, lodowe formacje w Wąwozie Kraków i gorąca szarlotka w Schronisku Ornak.',
    tags: ['Tatry', 'Doliny', 'Zima', 'Śnieg', 'Góry', 'Jaskinie'],
    coverMediaId: 'media-koscieliska-1',
    isFavorite: false,
    pinColor: '#6366f1',
    createdAt: '2024-02-24T16:00:00Z',
    updatedAt: '2024-02-24T16:00:00Z',
    mediaCount: { photos: 4, videos: 0 },
    media: [
      {
        id: 'media-koscieliska-1',
        locationId: 'loc-tatry-koscieliska',
        type: 'photo',
        title: 'Zimowa Dolina Kościeliska otulona świeżym puchem',
        timestamp: '2024-02-21 10:20',
        fileName: 'TAT_0901_ZimaKoscieliska.jpg',
        fileSizeFormatted: '17.9 MB',
        aspectRatio: '16/9',
        sceneType: 'winter',
        colorPalette: { from: '#1e293b', to: '#0f172a', accent: '#93c5fd' },
        description: 'Potok Kościeliski płynący wśród białych lodowych rzeźb.',
        tags: ['Zima', 'Kościeliska', 'Śnieg'],
      },
      {
        id: 'media-koscieliska-2',
        locationId: 'loc-tatry-koscieliska',
        type: 'photo',
        title: 'Sopel lodu w Smoczej Jamie w Wąwozie Kraków',
        timestamp: '2024-02-21 13:45',
        fileName: 'TAT_0955_WawozKrakow.jpg',
        fileSizeFormatted: '19.4 MB',
        aspectRatio: '3/4',
        sceneType: 'winter',
        colorPalette: { from: '#334155', to: '#1e293b', accent: '#bae6fd' },
        tags: ['Wąwóz Kraków', 'Lód', 'Skały'],
      },
      {
        id: 'media-koscieliska-3',
        locationId: 'loc-tatry-koscieliska',
        type: 'photo',
        title: 'Schronisko na Hali Ornak pod śnieżną pierzyną',
        timestamp: '2024-02-21 15:30',
        fileName: 'TAT_1012_Ornak.jpg',
        fileSizeFormatted: '14.8 MB',
        aspectRatio: '16/9',
        sceneType: 'winter',
        colorPalette: { from: '#78350f', to: '#1e293b', accent: '#fbbf24' },
        tags: ['Schronisko Ornak', 'Szarlotka', 'Zima'],
      },
      {
        id: 'media-koscieliska-4',
        locationId: 'loc-tatry-koscieliska',
        type: 'photo',
        title: 'Konie z saniami przy wejściu w Kirach',
        timestamp: '2024-02-22 09:00',
        fileName: 'TAT_1080_Sanie.jpg',
        fileSizeFormatted: '11.6 MB',
        aspectRatio: '4/3',
        sceneType: 'winter',
        colorPalette: { from: '#334155', to: '#0f172a', accent: '#f87171' },
        tags: ['Kiry', 'Sanie', 'Konie'],
      },
    ],
  },
  {
    id: 'loc-italy-dolomites',
    title: 'Tre Cime di Lavaredo i Lago di Braies',
    region: 'Dolomity, Tyrol Południowy',
    country: 'Włochy',
    coordinates: { lat: 46.6186, lng: 12.3014, altitude: 2450 },
    dateRange: '5–10 Września 2024',
    primaryDate: '2024-09-08',
    description:
      'Wyprawa w serce wapiennych ścian Dolomitów. Różowe światło Enrosadira o zachodzie słońca i szmaragdowa woda jeziora Braies z drewnianymi łódkami.',
    tags: ['Dolomity', 'Alpy', 'Włochy', 'Jezioro', 'Wspinaczka'],
    coverMediaId: 'media-dolomites-1',
    isFavorite: true,
    pinColor: '#f59e0b',
    createdAt: '2024-09-12T14:00:00Z',
    updatedAt: '2024-09-12T14:00:00Z',
    mediaCount: { photos: 4, videos: 1 },
    media: [
      {
        id: 'media-dolomites-1',
        locationId: 'loc-italy-dolomites',
        type: 'photo',
        title: 'Złote ściany Tre Cime o zachodzie Enrosadira',
        timestamp: '2024-09-08 19:15',
        fileName: 'DOL_3012_TreCime.jpg',
        fileSizeFormatted: '18.4 MB',
        aspectRatio: '16/9',
        sceneType: 'sunset',
        colorPalette: { from: '#7c2d12', to: '#451a03', accent: '#fbbf24' },
        description: 'Trzy monumentalne wieże skalne płonące w promieniach zachodzącego słońca.',
        tags: ['Tre Cime', 'Alpy', 'Zachód'],
      },
      {
        id: 'media-dolomites-2',
        locationId: 'loc-italy-dolomites',
        type: 'photo',
        title: 'Drewniana przystań nad Lago di Braies',
        timestamp: '2024-09-09 08:30',
        fileName: 'DOL_3100_LagoBraies.jpg',
        fileSizeFormatted: '16.2 MB',
        aspectRatio: '4/3',
        sceneType: 'lake',
        colorPalette: { from: '#0f766e', to: '#115e59', accent: '#99f6e4' },
        tags: ['Lago di Braies', 'Jezioro', 'Łódki'],
      },
      {
        id: 'media-dolomites-3',
        locationId: 'loc-italy-dolomites',
        type: 'video',
        title: 'Przelot chmur nad przełęczą Passo Giau',
        timestamp: '2024-09-09 16:40',
        fileName: 'VID_PassoGiau_CloudLapse.mp4',
        fileSizeFormatted: '62.0 MB',
        aspectRatio: '16/9',
        duration: '0:42',
        sceneType: 'mountains',
        colorPalette: { from: '#1e293b', to: '#334155', accent: '#38bdf8' },
        tags: ['Wideo', 'Passo Giau', 'Chmury'],
      },
      {
        id: 'media-dolomites-4',
        locationId: 'loc-italy-dolomites',
        type: 'photo',
        title: 'Alpejska chatka z widokiem na Seceda',
        timestamp: '2024-09-10 11:20',
        fileName: 'DOL_3250_Seceda.jpg',
        fileSizeFormatted: '15.0 MB',
        aspectRatio: '16/9',
        sceneType: 'mountains',
        colorPalette: { from: '#15803d', to: '#166534', accent: '#facc15' },
        tags: ['Seceda', 'Panorama', 'Hala'],
      },
      {
        id: 'media-dolomites-5',
        locationId: 'loc-italy-dolomites',
        type: 'photo',
        title: 'Poranna kawa z widokiem na Marmoladę',
        timestamp: '2024-09-10 07:45',
        fileName: 'DOL_3300_KawaMarmolada.jpg',
        fileSizeFormatted: '12.8 MB',
        aspectRatio: '1/1',
        sceneType: 'camp',
        colorPalette: { from: '#292524', to: '#1c1917', accent: '#f97316' },
        tags: ['Kawa', 'Marmolada', 'Poranek'],
      },
    ],
  },
  {
    id: 'loc-norway-lofoten',
    title: 'Lofoty, Reine i Geirangerfjord',
    region: 'Nordland & Møre og Romsdal',
    country: 'Norwegia',
    coordinates: { lat: 67.9333, lng: 13.0894, altitude: 450 },
    dateRange: '1–7 Lipca 2024',
    primaryDate: '2024-07-04',
    description:
      'Czerwone domki rorbuer na palach, ostre granie wyrastające prosto z arktycznego oceanu i białe noce pod kołem podbiegunowym.',
    tags: ['Norwegia', 'Fiordy', 'Lofoty', 'Ocean', 'Północ', 'Lato'],
    coverMediaId: 'media-norway-1',
    isFavorite: true,
    pinColor: '#0284c7',
    createdAt: '2024-07-09T20:00:00Z',
    updatedAt: '2024-07-09T20:00:00Z',
    mediaCount: { photos: 4, videos: 1 },
    media: [
      {
        id: 'media-norway-1',
        locationId: 'loc-norway-lofoten',
        type: 'photo',
        title: 'Czerwone domki Rorbuer w Reine pod szczytem Reinebringen',
        timestamp: '2024-07-04 14:00',
        fileName: 'NOR_8010_Reine.jpg',
        fileSizeFormatted: '19.8 MB',
        aspectRatio: '16/9',
        sceneType: 'sea',
        colorPalette: { from: '#0f172a', to: '#0369a1', accent: '#ef4444' },
        description: 'Klasyczna pocztówka z archipelagu Lofotów.',
        tags: ['Reine', 'Lofoty', 'Rorbuer'],
      },
      {
        id: 'media-norway-2',
        locationId: 'loc-norway-lofoten',
        type: 'video',
        title: 'Wodospad Siedem Sióstr w Geirangerfjord',
        timestamp: '2024-07-05 11:30',
        fileName: 'VID_Geiranger_SevenSisters.mp4',
        fileSizeFormatted: '74.5 MB',
        aspectRatio: '16/9',
        duration: '0:50',
        sceneType: 'lake',
        colorPalette: { from: '#0c4a6e', to: '#082f49', accent: '#38bdf8' },
        tags: ['Wideo', 'Geirangerfjord', 'Wodospad'],
      },
      {
        id: 'media-norway-3',
        locationId: 'loc-norway-lofoten',
        type: 'photo',
        title: 'Północne słońce nad plażą Uttakleiv',
        timestamp: '2024-07-05 23:55',
        fileName: 'NOR_8120_MidnightSun.jpg',
        fileSizeFormatted: '17.3 MB',
        aspectRatio: '16/9',
        sceneType: 'sunset',
        colorPalette: { from: '#7c2d12', to: '#0f172a', accent: '#f59e0b' },
        tags: ['Białe noce', 'Uttakleiv', 'Plaża'],
      },
      {
        id: 'media-norway-4',
        locationId: 'loc-norway-lofoten',
        type: 'photo',
        title: 'Krystaliczne wody fiordu Reinefjorden',
        timestamp: '2024-07-06 10:15',
        fileName: 'NOR_8205_FiordWoda.jpg',
        fileSizeFormatted: '14.1 MB',
        aspectRatio: '4/3',
        sceneType: 'sea',
        colorPalette: { from: '#0e7490', to: '#155e75', accent: '#a5f3fc' },
        tags: ['Woda', 'Kajaki', 'Arktyka'],
      },
      {
        id: 'media-norway-5',
        locationId: 'loc-norway-lofoten',
        type: 'photo',
        title: 'Tradycyjne suszarnie dorsza w Henningsvær',
        timestamp: '2024-07-06 16:40',
        fileName: 'NOR_8310_Stockfish.jpg',
        fileSizeFormatted: '13.0 MB',
        aspectRatio: '3/4',
        sceneType: 'city',
        colorPalette: { from: '#334155', to: '#1e293b', accent: '#fbbf24' },
        tags: ['Henningsvær', 'Tradycja', 'Rybacy'],
      },
    ],
  },
  {
    id: 'loc-spain-mallorca',
    title: 'Cap de Formentor i Valldemossa',
    region: 'Majorka, Baleary',
    country: 'Hiszpania',
    coordinates: { lat: 39.9619, lng: 3.2125, altitude: 210 },
    dateRange: '15–20 Maja 2024',
    primaryDate: '2024-05-18',
    description:
      'Dzikie wapienne klify Sierra de Tramuntana wpadające pionowo w szafir Morza Śródziemnego i kamienne uliczki Valldemossy.',
    tags: ['Majorka', 'Hiszpania', 'Klify', 'Morze', 'Śródziemnomorskie', 'Słońce'],
    coverMediaId: 'media-spain-1',
    isFavorite: false,
    pinColor: '#ea580c',
    createdAt: '2024-05-22T12:00:00Z',
    updatedAt: '2024-05-22T12:00:00Z',
    mediaCount: { photos: 4, videos: 0 },
    media: [
      {
        id: 'media-spain-1',
        locationId: 'loc-spain-mallorca',
        type: 'photo',
        title: 'Przylądek Cap de Formentor o wschodzie słońca',
        timestamp: '2024-05-18 06:40',
        fileName: 'ESP_1010_Formentor.jpg',
        fileSizeFormatted: '18.9 MB',
        aspectRatio: '16/9',
        sceneType: 'sea',
        colorPalette: { from: '#0369a1', to: '#7c2d12', accent: '#f97316' },
        description: 'Klify oświetlone pierwszymi promieniami śródziemnomorskiego słońca.',
        tags: ['Formentor', 'Klify', 'Wschód słońca'],
      },
      {
        id: 'media-spain-2',
        locationId: 'loc-spain-mallorca',
        type: 'photo',
        title: 'Kamienne uliczki z donicami kwiatów w Valldemossie',
        timestamp: '2024-05-18 11:30',
        fileName: 'ESP_1090_Valldemossa.jpg',
        fileSizeFormatted: '16.5 MB',
        aspectRatio: '3/4',
        sceneType: 'city',
        colorPalette: { from: '#78350f', to: '#15803d', accent: '#f43f5e' },
        tags: ['Valldemossa', 'Chopin', 'Kwiaty'],
      },
      {
        id: 'media-spain-3',
        locationId: 'loc-spain-mallorca',
        type: 'photo',
        title: 'Turkusowa zatoczka Cala Deia',
        timestamp: '2024-05-19 14:20',
        fileName: 'ESP_1150_CalaDeia.jpg',
        fileSizeFormatted: '15.2 MB',
        aspectRatio: '16/9',
        sceneType: 'sea',
        colorPalette: { from: '#0d9488', to: '#0f766e', accent: '#2dd4bf' },
        tags: ['Zatoka', 'Cala Deia', 'Turkus'],
      },
      {
        id: 'media-spain-4',
        locationId: 'loc-spain-mallorca',
        type: 'photo',
        title: 'Gaje oliwne w dolinie Soller',
        timestamp: '2024-05-19 17:00',
        fileName: 'ESP_1220_SollerOliwki.jpg',
        fileSizeFormatted: '14.0 MB',
        aspectRatio: '4/3',
        sceneType: 'forest',
        colorPalette: { from: '#3f6212', to: '#166534', accent: '#ca8a04' },
        tags: ['Oliwki', 'Soller', 'Dolina'],
      },
    ],
  },
];

const DEFAULT_SETTINGS: AppSettings = {
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
};

const DEFAULT_OFFLINE_STATUS: OfflineMapStatus = {
  isAvailable: true,
  packName: 'Polska & Europa Środkowa (Wektor Topo v2.4)',
  version: '2024.10-OFFLINE',
  sizeOnDiskFormatted: '142 MB',
  coverage: 'Polska, Karpaty, Bałtyk, Czechy, Słowacja',
  lastUpdated: '2024-11-01',
};

export class MockBridge implements IAppBridge {
  private memories: MemoryLocation[];
  private settings: AppSettings;
  private offlineStatus: OfflineMapStatus;

  constructor() {
    this.memories = [...INITIAL_MEMORIES];
    this.settings = { ...DEFAULT_SETTINGS };
    this.offlineStatus = { ...DEFAULT_OFFLINE_STATUS };
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedMemories = localStorage.getItem('mapa_wspomnien_data');
        if (savedMemories) {
          const parsed = JSON.parse(savedMemories);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.memories = parsed;
          }
        }
        const savedSettings = localStorage.getItem('mapa_wspomnien_settings');
        if (savedSettings) {
          this.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) };
        }
      }
    } catch {
      // Ignore fallback to memory
    }
  }

  private saveToLocalStorage() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('mapa_wspomnien_data', JSON.stringify(this.memories));
        localStorage.setItem('mapa_wspomnien_settings', JSON.stringify(this.settings));
      }
    } catch {
      // Ignore
    }
  }

  public async getLocations(filters?: FilterState): Promise<MemoryLocation[]> {
    // Artificial slight micro-delay for realistic UI reactivity
    await new Promise((r) => setTimeout(r, 40));

    let result = [...this.memories];

    if (!filters) {
      return result;
    }

    if (filters.searchQuery && filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      result = result.filter(
        (loc) =>
          loc.title.toLowerCase().includes(q) ||
          loc.region.toLowerCase().includes(q) ||
          loc.description.toLowerCase().includes(q) ||
          loc.tags.some((t) => t.toLowerCase().includes(q)) ||
          loc.media.some((m) => m.title.toLowerCase().includes(q))
      );
    }

    if (filters.selectedTags && filters.selectedTags.length > 0) {
      result = result.filter((loc) =>
        filters.selectedTags.some((tag) => loc.tags.includes(tag))
      );
    }

    if (filters.dateFrom) {
      result = result.filter((loc) => loc.primaryDate >= filters.dateFrom);
    }

    if (filters.dateTo) {
      result = result.filter((loc) => loc.primaryDate <= filters.dateTo);
    }

    if (filters.favoritesOnly) {
      result = result.filter((loc) => loc.isFavorite);
    }

    if (filters.mediaType === 'photos') {
      result = result.filter((loc) => loc.media.some((m) => m.type === 'photo'));
    } else if (filters.mediaType === 'videos') {
      result = result.filter((loc) => loc.media.some((m) => m.type === 'video'));
    }

    if (filters.regionFilter) {
      result = result.filter((loc) => loc.region.includes(filters.regionFilter!));
    }

    return result;
  }

  public async getLocationById(id: string): Promise<MemoryLocation | null> {
    await new Promise((r) => setTimeout(r, 20));
    return this.memories.find((m) => m.id === id) || null;
  }

  public async getAllTimelineMedia(filters?: FilterState): Promise<TimelineDateGroup[]> {
    const locations = await this.getLocations(filters);
    const flatItems: Array<{
      media: MediaItem;
      locationId: string;
      locationTitle: string;
      locationRegion: string;
      coordinates: { lat: number; lng: number };
    }> = [];

    for (const loc of locations) {
      for (const m of loc.media) {
        if (filters?.mediaType === 'photos' && m.type !== 'photo') continue;
        if (filters?.mediaType === 'videos' && m.type !== 'video') continue;
        flatItems.push({
          media: m,
          locationId: loc.id,
          locationTitle: loc.title,
          locationRegion: loc.region,
          coordinates: loc.coordinates,
        });
      }
    }

    // Sort descending by timestamp / date
    flatItems.sort((a, b) => b.media.timestamp.localeCompare(a.media.timestamp));

    // Group by Polish month & year (e.g. "Sierpień 2024", "Lipiec 2024")
    const polishMonths = [
      'Styczeń',
      'Luty',
      'Marzec',
      'Kwiecień',
      'Maj',
      'Czerwiec',
      'Lipiec',
      'Sierpień',
      'Wrzesień',
      'Październik',
      'Listopad',
      'Grudzień',
    ];

    const groupMap = new Map<
      string,
      {
        dateGroup: string;
        sortKey: string;
        items: typeof flatItems;
      }
    >();

    for (const item of flatItems) {
      const dateStr = item.media.timestamp.split(' ')[0]; // YYYY-MM-DD
      const [year, month] = dateStr.split('-');
      const monthIdx = parseInt(month, 10) - 1;
      const monthName = polishMonths[monthIdx] || month;
      const dateGroup = `${monthName} ${year}`;
      const sortKey = `${year}-${month}`;

      if (!groupMap.has(sortKey)) {
        groupMap.set(sortKey, {
          dateGroup,
          sortKey,
          items: [],
        });
      }

      groupMap.get(sortKey)!.items.push(item);
    }

    // Return groups sorted chronologically descending
    return Array.from(groupMap.values()).sort((a, b) => b.sortKey.localeCompare(a.sortKey));
  }

  public async getAllTags(): Promise<{ name: string; count: number }[]> {
    const counts = new Map<string, number>();
    for (const loc of this.memories) {
      for (const tag of loc.tags) {
        counts.set(tag, (counts.get(tag) || 0) + 1);
      }
    }
    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }

  public async getAllRegions(): Promise<{ name: string; count: number }[]> {
    const counts = new Map<string, number>();
    for (const loc of this.memories) {
      counts.set(loc.region, (counts.get(loc.region) || 0) + 1);
    }
    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }

  public async addMemory(payload: NewMemoryPayload): Promise<MemoryLocation> {
    await new Promise((r) => setTimeout(r, 60));

    const id = `loc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const media: MediaItem[] = payload.mediaItems.map((item, idx) => {
      const mediaId = `media-${id}-${idx + 1}`;
      return {
        id: mediaId,
        locationId: id,
        type: item.type,
        title: item.title || `${payload.title} #${idx + 1}`,
        timestamp: item.timestamp || `${payload.primaryDate} 12:00`,
        fileName: `IMG_${Math.floor(1000 + Math.random() * 9000)}_${payload.title.replace(/\s+/g, '_')}.${item.type === 'video' ? 'mp4' : 'jpg'}`,
        fileSizeFormatted: `${(8 + Math.random() * 12).toFixed(1)} MB`,
        aspectRatio: '16/9',
        duration: item.duration || (item.type === 'video' ? '0:45' : undefined),
        sceneType: item.sceneType,
        colorPalette: {
          from: '#1e293b',
          to: '#0f172a',
          accent: '#f59e0b',
        },
        description: item.description,
        tags: item.tags.length > 0 ? item.tags : payload.tags,
        exif: {
          cameraMake: 'Aparat Windows (Mock)',
          cameraModel: 'Lokalny Import',
          dateTimeOriginal: item.timestamp || `${payload.primaryDate} 12:00:00`,
          gpsLatitude: payload.coordinates.lat,
          gpsLongitude: payload.coordinates.lng,
          fileSizeBytes: 12000000,
          fileName: `IMG_${payload.title.replace(/\s+/g, '_')}.jpg`,
        },
      };
    });

    const newLoc: MemoryLocation = {
      id,
      title: payload.title,
      region: payload.region || 'Polska',
      country: 'Polska',
      coordinates: payload.coordinates,
      dateRange: payload.dateRange || payload.primaryDate,
      primaryDate: payload.primaryDate,
      description: payload.description,
      tags: payload.tags,
      coverMediaId: media.length > 0 ? media[0].id : '',
      mediaCount: {
        photos: media.filter((m) => m.type === 'photo').length,
        videos: media.filter((m) => m.type === 'video').length,
      },
      media,
      isFavorite: payload.isFavorite || false,
      pinColor: '#f59e0b',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.memories.unshift(newLoc);
    this.saveToLocalStorage();
    return newLoc;
  }

  public async updateMemory(id: string, updates: Partial<MemoryLocation>): Promise<MemoryLocation> {
    const idx = this.memories.findIndex((m) => m.id === id);
    if (idx === -1) {
      throw new Error(`Location with id ${id} not found`);
    }
    const updated = {
      ...this.memories[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.memories[idx] = updated;
    this.saveToLocalStorage();
    return updated;
  }

  public async deleteMemory(id: string): Promise<boolean> {
    const beforeLen = this.memories.length;
    this.memories = this.memories.filter((m) => m.id !== id);
    this.saveToLocalStorage();
    return this.memories.length < beforeLen;
  }

  public async toggleFavorite(id: string): Promise<boolean> {
    const loc = this.memories.find((m) => m.id === id);
    if (!loc) return false;
    loc.isFavorite = !loc.isFavorite;
    loc.updatedAt = new Date().toISOString();
    this.saveToLocalStorage();
    return loc.isFavorite;
  }

  public async getSettings(): Promise<AppSettings> {
    return { ...this.settings };
  }

  public async saveSettings(settings: AppSettings): Promise<AppSettings> {
    this.settings = { ...settings };
    this.saveToLocalStorage();
    return { ...this.settings };
  }

  public async getOfflineMapStatus(): Promise<OfflineMapStatus> {
    return { ...this.offlineStatus };
  }

  public async openInSystemFileManager(path: string): Promise<boolean> {
    console.info(`[AppBridge] Mock open in system file manager: ${path}`);
    return true;
  }

  public resetToDefaults() {
    this.memories = [...INITIAL_MEMORIES];
    this.settings = { ...DEFAULT_SETTINGS };
    this.offlineStatus = { ...DEFAULT_OFFLINE_STATUS };
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('mapa_wspomnien_data');
      localStorage.removeItem('mapa_wspomnien_settings');
    }
  }
}
