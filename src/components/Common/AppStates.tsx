/**
 * AppStates - State components for Empty, Loading, Error, and Offline Map Missing scenarios
 */

import React from 'react';
import {
  AlertTriangle,
  Compass,
  Download,
  HardDrive,
  Loader2,
  MapPin,
  Plus,
  RefreshCw,
  Sparkles,
  WifiOff,
} from 'lucide-react';

export const LoadingState: React.FC = () => {
  return (
    <div
      id="app-state-loading"
      className="flex-1 h-full flex flex-col items-center justify-center p-8 text-center select-none bg-stone-900"
    >
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-stone-950 border border-stone-800 flex items-center justify-center">
          <HardDrive className="w-3.5 h-3.5 text-stone-400" />
        </div>
      </div>
      <h3 className="text-lg font-bold text-stone-100 font-serif mb-1.5">
        Wczytywanie bazy wspomnień...
      </h3>
      <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
        Ładowanie lokalnych wektorów kartograficznych i indeksu fotografii GPS.
      </p>
    </div>
  );
};

export const EmptyState: React.FC<{ onAddMemory: () => void }> = ({ onAddMemory }) => {
  return (
    <div
      id="app-state-empty"
      className="flex-1 h-full flex flex-col items-center justify-center p-8 text-center select-none bg-stone-900"
    >
      <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-5 shadow-xl shadow-amber-500/5">
        <Compass className="w-10 h-10 stroke-[1.5]" />
      </div>
      <h3 className="text-xl font-bold text-stone-100 font-serif mb-2">
        Twoja mapa czeka na pierwsze wspomnienia
      </h3>
      <p className="text-xs text-stone-400 max-w-md leading-relaxed mb-6">
        Nie dodano jeszcze żadnych lokalizacji ze zdjęciami. Możesz dodać nowe miejsce ręcznie lub kliknąć prawym przyciskiem myszy w dowolnym punkcie mapy.
      </p>
      <button
        onClick={onAddMemory}
        className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all transform hover:-translate-y-0.5"
      >
        <Plus className="w-4 h-4 stroke-[2.5]" />
        <span>Dodaj pierwsze wspomnienie</span>
      </button>
    </div>
  );
};

export const ErrorState: React.FC<{ error?: string; onRetry: () => void }> = ({
  error,
  onRetry,
}) => {
  return (
    <div
      id="app-state-error"
      className="flex-1 h-full flex flex-col items-center justify-center p-8 text-center select-none bg-stone-900"
    >
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-stone-100 font-serif mb-1.5">
        Wystąpił błąd odczytu danych
      </h3>
      <p className="text-xs text-stone-400 max-w-sm leading-relaxed mb-6 font-mono bg-stone-950 p-3 rounded-xl border border-stone-800 text-rose-300">
        {error || 'Nie można zainicjalizować lokalnego magazynu bazy SQLite/PySide6.'}
      </p>
      <button
        onClick={onRetry}
        className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs flex items-center gap-2 transition-colors border border-stone-700"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        <span>Spróbuj ponownie</span>
      </button>
    </div>
  );
};

export const OfflineMapMissingState: React.FC<{ onDownloadOrRetry: () => void }> = ({
  onDownloadOrRetry,
}) => {
  return (
    <div
      id="app-state-offline-missing"
      className="flex-1 h-full flex flex-col items-center justify-center p-8 text-center select-none bg-stone-950"
    >
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
        <WifiOff className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-stone-100 font-serif mb-1.5">
        Brak lokalnego pakietu mapy offline
      </h3>
      <p className="text-xs text-stone-400 max-w-md leading-relaxed mb-6">
        Pakiet wektorowy mapy Polski nie został wykryty w katalogu danych aplikacji. Twoje zdjęcia i punkty GPS są bezpieczne w bazie lokalnej.
      </p>
      <button
        onClick={onDownloadOrRetry}
        className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/10 transition-colors"
      >
        <Download className="w-4 h-4" />
        <span>Zainstaluj wbudowany pakiet wektorowy</span>
      </button>
    </div>
  );
};
