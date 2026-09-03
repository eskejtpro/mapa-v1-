/**
 * AddMemoryModal - Modal dialog for adding a new memory with coordinates, date, tags, and multiple photos/videos.
 */

import React, { useState } from 'react';
import {
  Calendar,
  Camera,
  Check,
  Compass,
  Film,
  Image as ImageIcon,
  MapPin,
  Plus,
  Sparkles,
  Tag,
  Trash2,
  Upload,
  Video,
  X,
} from 'lucide-react';
import { GeoCoordinates, MediaType, NewMemoryPayload, SceneType } from '../../types';
import { getSceneSvgDataUri } from '../../utils/svgPlaceholders';
import { formatCoordinates } from '../Map/mapProjection';

interface AddMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: NewMemoryPayload) => Promise<void>;
  prefilledCoords?: GeoCoordinates | null;
  initialMediaType?: MediaType;
}

const PRESET_LOCATIONS: Array<{ label: string; region: string; country: string; lat: number; lng: number }> = [
  { label: 'Tatry (Morskie Oko)', region: 'Tatry Wysokie, Małopolska', country: 'Polska', lat: 49.2007, lng: 20.0711 },
  { label: 'Sopot (Molo)', region: 'Trójmiasto, Pomorskie', country: 'Polska', lat: 54.4447, lng: 18.5708 },
  { label: 'Bieszczady (Tarnica)', region: 'Bieszczady, Podkarpackie', country: 'Polska', lat: 49.0747, lng: 22.7264 },
  { label: 'Dolomity (Tre Cime)', region: 'Tyrol Południowy', country: 'Włochy', lat: 46.6186, lng: 12.3014 },
  { label: 'Lofoty (Reine)', region: 'Nordland', country: 'Norwegia', lat: 67.9333, lng: 13.0894 },
  { label: 'Majorka (Formentor)', region: 'Baleary', country: 'Hiszpania', lat: 39.9619, lng: 3.2125 },
];

const COUNTRY_OPTIONS = [
  { id: 'Polska', label: '🇵🇱 Polska' },
  { id: 'Włochy', label: '🇮🇹 Włochy' },
  { id: 'Norwegia', label: '🇳🇴 Norwegia' },
  { id: 'Hiszpania', label: '🇪🇸 Hiszpania' },
  { id: 'Chorwacja', label: '🇭🇷 Chorwacja' },
  { id: 'Grecja', label: '🇬🇷 Grecja' },
  { id: 'Francja', label: '🇫🇷 Francja' },
  { id: 'Niemcy', label: '🇩🇪 Niemcy' },
  { id: 'Inny', label: '🌍 Inny kraj' },
];

const SCENE_OPTIONS: Array<{ id: SceneType; label: string }> = [
  { id: 'mountains', label: 'Góry / Szczyty' },
  { id: 'sea', label: 'Morze / Plaża' },
  { id: 'lake', label: 'Jezioro / Woda' },
  { id: 'forest', label: 'Las / Puszcza' },
  { id: 'city', label: 'Miasto / Architektura' },
  { id: 'sunset', label: 'Zachód słońca' },
  { id: 'castle', label: 'Zamek / Pałac' },
  { id: 'winter', label: 'Zima / Śnieg' },
  { id: 'camp', label: 'Ognisko / Noc' },
];

export const AddMemoryModal: React.FC<AddMemoryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  prefilledCoords,
  initialMediaType = 'photo',
}) => {
  const [title, setTitle] = useState('');
  const [region, setRegion] = useState('');
  const [country, setCountry] = useState('Polska');
  const [lat, setLat] = useState<number>(prefilledCoords ? prefilledCoords.lat : 52.0);
  const [lng, setLng] = useState<number>(prefilledCoords ? prefilledCoords.lng : 19.0);
  const [date, setDate] = useState('2024-08-15');
  const [dateRange, setDateRange] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>(['Wakacje', 'Polska']);
  const [newTagInput, setNewTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Photos & Videos list
  const [mediaItems, setMediaItems] = useState<
    Array<{
      title: string;
      type: MediaType;
      sceneType: SceneType;
      tags: string[];
      duration?: string;
    }>
  >([
    {
      title: initialMediaType === 'video' ? 'Nagranie wideo z miejsca' : 'Główny widok ze szlaku',
      type: initialMediaType,
      sceneType: 'mountains',
      tags: [initialMediaType === 'video' ? 'Wideo' : 'Krajobraz'],
      duration: initialMediaType === 'video' ? '0:45' : undefined,
    },
  ]);

  // Update coords if prefilledCoords changes
  React.useEffect(() => {
    if (prefilledCoords) {
      setLat(prefilledCoords.lat);
      setLng(prefilledCoords.lng);
    }
  }, [prefilledCoords]);

  // Reset or adjust media item if initialMediaType changes on open
  React.useEffect(() => {
    if (isOpen) {
      setMediaItems([
        {
          title: initialMediaType === 'video' ? 'Nowy plik wideo / nagranie' : 'Nowe zdjęcie / ujęcie',
          type: initialMediaType,
          sceneType: 'mountains',
          tags: [initialMediaType === 'video' ? 'Wideo' : 'Zdjęcie'],
          duration: initialMediaType === 'video' ? '0:45' : undefined,
        },
      ]);
    }
  }, [isOpen, initialMediaType]);

  if (!isOpen) return null;

  const handleAddTag = () => {
    if (newTagInput.trim() && !tags.includes(newTagInput.trim())) {
      setTags([...tags, newTagInput.trim()]);
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleAddMediaPlaceholder = (type: MediaType) => {
    setMediaItems([
      ...mediaItems,
      {
        title: `Zdjęcie #${mediaItems.length + 1}`,
        type,
        sceneType: 'forest',
        tags: [],
        duration: type === 'video' ? '0:45' : undefined,
      },
    ]);
  };

  const handleRemoveMedia = (index: number) => {
    setMediaItems(mediaItems.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        region: region.trim() || 'Polska',
        country: country.trim() || 'Polska',
        coordinates: { lat, lng },
        primaryDate: date,
        dateRange: dateRange.trim() || date,
        description: description.trim(),
        tags,
        isFavorite: false,
        mediaItems: mediaItems.map((m) => ({
          title: m.title,
          type: m.type,
          sceneType: m.sceneType,
          tags: m.tags.length > 0 ? m.tags : tags,
          duration: m.duration,
          timestamp: `${date} 12:00`,
        })),
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="add-memory-modal-backdrop"
      className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="add-memory-modal-content"
        className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              {initialMediaType === 'video' ? (
                <Film className="w-4 h-4 stroke-[2.5]" />
              ) : (
                <Camera className="w-4 h-4 stroke-[2.5]" />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-100 font-serif">
                {initialMediaType === 'video'
                  ? 'Dodaj Wideo / Film w tym punkcie'
                  : 'Dodaj Zdjęcie / Wspomnienie w tym punkcie'}
              </h3>
              <p className="text-xs text-stone-400">
                Współrzędne GPS: {lat.toFixed(4)}° N, {lng.toFixed(4)}° E
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-stone-800 text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
          {/* 1. Title & Country & Region */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Kraj *
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
              >
                {COUNTRY_OPTIONS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Nazwa miejsca / wycieczki *
              </label>
              <input
                id="add-memory-title-input"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="np. Dolina Pięciu Stawów Polskich"
                className="w-full h-10 px-3 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5">
              Region / Miejscowość
            </label>
            <input
              id="add-memory-region-input"
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="np. Tatry Wysokie, Małopolska"
              className="w-full h-10 px-3 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* 2. GPS Coordinates & Presets */}
          <div className="bg-stone-950/70 border border-stone-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5" />
                <span>Współrzędne GPS (WGS84)</span>
              </span>
              <span className="text-[11px] font-mono text-stone-400">
                {lat.toFixed(4)}° N, {lng.toFixed(4)}° E
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-stone-400 mb-1">
                  Szerokość geograficzna (Latitude °N)
                </label>
                <input
                  type="number"
                  step="0.0001"
                  required
                  value={lat}
                  onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
                  className="w-full h-9 px-3 rounded-lg bg-stone-900 border border-stone-800 text-xs text-stone-200 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-stone-400 mb-1">
                  Długość geograficzna (Longitude °E)
                </label>
                <input
                  type="number"
                  step="0.0001"
                  required
                  value={lng}
                  onChange={(e) => setLng(parseFloat(e.target.value) || 0)}
                  className="w-full h-9 px-3 rounded-lg bg-stone-900 border border-stone-800 text-xs text-stone-200 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Quick Presets */}
            <div className="pt-2 border-t border-stone-800/80">
              <span className="text-[10px] text-stone-400 block mb-1.5 font-medium">
                Szybki wybór przykładowych współrzędnych:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_LOCATIONS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setLat(preset.lat);
                      setLng(preset.lng);
                      if (!region) setRegion(preset.region);
                      if (!title) setTitle(preset.label);
                    }}
                    className="px-2 py-1 rounded-md bg-stone-900 hover:bg-stone-800 text-stone-300 text-[10px] border border-stone-800 transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Dates & Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Główna data *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Zakres dat (etykieta tekstowa)
              </label>
              <input
                type="text"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                placeholder="np. 12–16 Sierpnia 2024"
                className="w-full h-10 px-3 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5">
              Notatka / opis wspomnienia
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Zapisz swoje wrażenia, pogodę, towarzyszy wyprawy..."
              className="w-full p-3 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          {/* 4. Tags */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5">
              Tagi lokalizacji
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-[11px] font-medium border border-amber-500/30 flex items-center gap-1.5"
                >
                  <span>#{t}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Wpisz tag i kliknij Dodaj..."
                className="flex-1 h-9 px-3 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors"
              >
                Dodaj tag
              </button>
            </div>
          </div>

          {/* 5. Photos & Videos List */}
          <div className="space-y-3 pt-2 border-t border-stone-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-stone-200 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-amber-400" />
                <span>Załączone zdjęcia i filmy ({mediaItems.length})</span>
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAddMediaPlaceholder('photo')}
                  className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1 border border-stone-700 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                  <span>Dodaj zdjęcie</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddMediaPlaceholder('video')}
                  className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1 border border-stone-700 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                  <span>Dodaj wideo</span>
                </button>
              </div>
            </div>

            {/* Media Row Previews */}
            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
              {mediaItems.map((item, idx) => {
                const previewUri = getSceneSvgDataUri(item.sceneType, item.title, `new-${idx}`);

                return (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-2 bg-stone-950 border border-stone-800 rounded-xl"
                  >
                    <img
                      src={previewUri}
                      alt={item.title}
                      className="w-12 h-9 object-cover rounded-lg shrink-0 border border-stone-700"
                    />

                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          const updated = [...mediaItems];
                          updated[idx].title = e.target.value;
                          setMediaItems(updated);
                        }}
                        className="w-full bg-transparent text-xs font-semibold text-stone-200 focus:outline-none border-b border-transparent focus:border-amber-500 truncate"
                        placeholder="Tytuł zdjęcia..."
                      />
                      <div className="flex items-center gap-2 mt-1">
                        <select
                          value={item.sceneType}
                          onChange={(e) => {
                            const updated = [...mediaItems];
                            updated[idx].sceneType = e.target.value as SceneType;
                            setMediaItems(updated);
                          }}
                          className="bg-stone-900 border border-stone-800 rounded px-1.5 py-0.5 text-[10px] text-stone-300 focus:outline-none"
                        >
                          {SCENE_OPTIONS.map((opt) => (
                            <option key={opt.id} value={opt.id}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <span className="text-[10px] font-mono text-stone-500 uppercase">
                          {item.type}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveMedia(idx)}
                      className="p-1.5 text-stone-500 hover:text-red-400 transition-colors"
                      title="Usuń"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-4 border-t border-stone-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold transition-colors"
            >
              Anuluj
            </button>
            <button
              id="add-memory-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/10 transition-colors"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>{isSubmitting ? 'Zapisywanie...' : 'Zapisz Wspomnienie na Mapie'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
