/**
 * FiltersModal - Dialog for filtering memories by date, tags, media type, and favorites.
 */

import React, { useState } from 'react';
import {
  Calendar,
  Check,
  Heart,
  RotateCcw,
  SlidersHorizontal,
  Tag,
  X,
} from 'lucide-react';
import { FilterState } from '../../types';

interface FiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onApplyFilters: (filters: FilterState) => void;
  allTags: Array<{ name: string; count: number }>;
  allRegions: Array<{ name: string; count: number }>;
}

export const FiltersModal: React.FC<FiltersModalProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  allTags,
  allRegions,
}) => {
  const [localFilters, setLocalFilters] = useState<FilterState>({ ...filters });

  React.useEffect(() => {
    setLocalFilters({ ...filters });
  }, [filters, isOpen]);

  if (!isOpen) return null;

  const handleToggleTag = (tagName: string) => {
    const current = localFilters.selectedTags;
    if (current.includes(tagName)) {
      setLocalFilters({
        ...localFilters,
        selectedTags: current.filter((t) => t !== tagName),
      });
    } else {
      setLocalFilters({
        ...localFilters,
        selectedTags: [...current, tagName],
      });
    }
  };

  const handleReset = () => {
    const resetState: FilterState = {
      searchQuery: '',
      selectedTags: [],
      dateFrom: '',
      dateTo: '',
      mediaType: 'all',
      favoritesOnly: false,
      regionFilter: '',
    };
    setLocalFilters(resetState);
    onApplyFilters(resetState);
    onClose();
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  return (
    <div
      id="filters-modal-backdrop"
      className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="filters-modal-content"
        className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-lg flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-100 font-serif">
                Filtruj Wspomnienia
              </h3>
              <p className="text-xs text-stone-400">
                Wybierz kryteria wyświetlania na mapie i w galerii
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

        {/* Form Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {/* 1. Date Range */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-stone-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>Zakres dat</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] text-stone-400 block mb-1">Od daty</span>
                <input
                  type="date"
                  value={localFilters.dateFrom}
                  onChange={(e) =>
                    setLocalFilters({ ...localFilters, dateFrom: e.target.value })
                  }
                  className="w-full h-9 px-3 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <span className="text-[11px] text-stone-400 block mb-1">Do daty</span>
                <input
                  type="date"
                  value={localFilters.dateTo}
                  onChange={(e) =>
                    setLocalFilters({ ...localFilters, dateTo: e.target.value })
                  }
                  className="w-full h-9 px-3 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* 2. Media Type & Favorites */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-800">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Typ multimediów
              </label>
              <select
                value={localFilters.mediaType}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    mediaType: e.target.value as 'all' | 'photos' | 'videos',
                  })
                }
                className="w-full h-9 px-3 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
              >
                <option value="all">Wszystkie multimedia</option>
                <option value="photos">Tylko zdjęcia</option>
                <option value="videos">Tylko filmy wideo</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Wyróżnienia
              </label>
              <label className="flex items-center gap-2.5 h-9 px-3 rounded-xl bg-stone-950 border border-stone-800 cursor-pointer text-xs text-stone-200 hover:border-stone-700">
                <input
                  type="checkbox"
                  checked={localFilters.favoritesOnly}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      favoritesOnly: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded text-amber-500 focus:ring-0 bg-stone-900 border-stone-700"
                />
                <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
                <span>Tylko ulubione</span>
              </label>
            </div>
          </div>

          {/* 3. Tags Filter */}
          <div className="space-y-2 pt-2 border-t border-stone-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-stone-300 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-amber-400" />
                <span>Filtruj po tagach ({localFilters.selectedTags.length} wybrano)</span>
              </label>
              {localFilters.selectedTags.length > 0 && (
                <button
                  onClick={() => setLocalFilters({ ...localFilters, selectedTags: [] })}
                  className="text-[11px] text-amber-400 hover:underline"
                >
                  Odznacz wszystkie
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto custom-scrollbar p-1">
              {allTags.map((tag) => {
                const isSelected = localFilters.selectedTags.includes(tag.name);
                return (
                  <button
                    key={tag.name}
                    type="button"
                    onClick={() => handleToggleTag(tag.name)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-amber-500 text-stone-950 border-amber-500 font-bold shadow-md shadow-amber-500/10'
                        : 'bg-stone-950 hover:bg-stone-800 text-stone-300 border-stone-800'
                    }`}
                  >
                    <span>#{tag.name}</span>
                    <span className={`text-[10px] ${isSelected ? 'text-stone-900' : 'text-stone-500'}`}>
                      ({tag.count})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="px-6 py-4 border-t border-stone-800 bg-stone-950/60 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Wyczyść filtry</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold transition-colors"
            >
              Anuluj
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/10 transition-colors"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Zastosuj filtry</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
