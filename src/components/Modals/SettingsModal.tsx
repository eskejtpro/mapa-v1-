/**
 * SettingsModal - Application settings & Graphics configuration & PySide6 Diagnostics
 * Extended with rich graphical settings: 8 Map Styles, Snapchat Story Pins, 3D Buildings,
 * Video Previews, Zoom Smoothness, UI Accent Colors, and Windows Resolutions.
 */

import React, { useState } from 'react';
import {
  Activity,
  Building2,
  Check,
  Compass,
  Cpu,
  Eye,
  Film,
  HardDrive,
  Info,
  Layers,
  MapPin,
  Monitor,
  Palette,
  Play,
  RefreshCw,
  RotateCcw,
  Settings,
  ShieldCheck,
  Sliders,
  Sparkles,
  Sun,
  Video,
  X,
  Zap,
} from 'lucide-react';
import {
  AccentColor,
  AppSettings,
  MapStyle,
  OfflineMapStatus,
  PinStyle,
  SimulatedAppState,
  WindowResolution,
  ZoomSmoothness,
} from '../../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
  offlineStatus: OfflineMapStatus;
  onResetDemoData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  offlineStatus,
  onResetDemoData,
}) => {
  const [activeTab, setActiveTab] = useState<'graphics' | 'pins' | 'system' | 'qa'>('graphics');

  if (!isOpen) return null;

  const isPySideBridgeActive = typeof window !== 'undefined' && !!window.pyBridge;

  const mapStylesList: Array<{ id: MapStyle; label: string; desc: string; icon: string }> = [
    { id: 'atlas-calm', label: 'Atlas Spokojny', desc: 'Ciepły stonowany atlas wspomnień (Zalecany)', icon: '🗺️' },
    { id: 'satellite-hybrid', label: 'Satelita Hybrydowy', desc: 'Fotograficzne zdjęcia satelitarne Esri z nazwami ulic', icon: '🛰️' },
    { id: 'osm-standard', label: 'Wektor Topo & Ulice', desc: 'OpenStreetMap (budynki, ulice, numery domów)', icon: '🏙️' },
    { id: 'carto-positron', label: 'Jasny Positron', desc: 'Czysty, nowoczesny minimalistyczny jasny podkład', icon: '☀️' },
    { id: 'night-slate', label: 'Ciemny Łupkowy', desc: 'Ciemny motyw nocny o wysokim komforcie dla oczu', icon: '🌙' },
    { id: 'paper-vintage', label: 'Papier Vintage', desc: 'Archiwalna stylizacja dawnych map i rycin', icon: '📜' },
    { id: 'topo-light', label: 'Rzeźba OpenTopo', desc: 'Poziomice topograficzne i cienie form terenu', icon: '⛰️' },
    { id: 'neon-cyber', label: 'Nocny Neon Cyber', desc: 'Fluorescencyjny kontrast dla nocnych odkryć', icon: '⚡' },
  ];

  const pinStylesList: Array<{ id: PinStyle; label: string; desc: string; badge: string }> = [
    {
      id: 'classic-pin',
      label: 'Klasyczna Szpilka',
      desc: 'Elegancka szpilka z miniaturą zdjęcia i licznikiem mediów',
      badge: 'Domyślna',
    },
    {
      id: 'bubble-preview',
      label: 'Etykieta z Podglądem',
      desc: 'Powiększona miniatura z natychmiastowym tytułem i etykietą',
      badge: 'Szybki podgląd',
    },
    {
      id: 'minimal-neon',
      label: 'Minimalistyczny Punkt',
      desc: 'Subtelne neonowe punkty skupiające uwagę na mapie',
      badge: 'Dyskretny',
    },
  ];

  const accentColorsList: Array<{ id: AccentColor; label: string; bgClass: string }> = [
    { id: 'amber', label: 'Bursztynowy Złoty', bgClass: 'bg-amber-400' },
    { id: 'blue', label: 'Szafirowy Błękit', bgClass: 'bg-sky-400' },
    { id: 'emerald', label: 'Szmaragdowa Zieleń', bgClass: 'bg-emerald-400' },
    { id: 'rose', label: 'Różowa Fuksja', bgClass: 'bg-rose-400' },
    { id: 'purple', label: 'Ametystowy Fiolet', bgClass: 'bg-purple-400' },
  ];

  return (
    <div
      id="settings-modal-backdrop"
      className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="settings-modal-content"
        className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-2xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-100 font-serif">
                Ustawienia & Grafika
              </h3>
              <p className="text-xs text-stone-400">
                Konfiguracja silnika mapy, stylu pinezek, grafiki 3D i parametrów desktopu
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

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-800 bg-stone-950/50 px-6 gap-2">
          {[
            { id: 'graphics', label: 'Silnik & Styl Mapy', icon: Layers },
            { id: 'pins', label: 'Pinezki & Wygląd', icon: MapPin },
            { id: 'system', label: 'Okno & System', icon: Monitor },
            { id: 'qa', label: 'Diagnostyka & QA', icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
                  isActive
                    ? 'border-amber-400 text-amber-300 font-bold bg-amber-400/5'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          {/* TAB 1: Silnik & Styl Mapy */}
          {activeTab === 'graphics' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* 8 Map Styles */}
              <div className="space-y-2.5">
                <label className="block text-xs font-bold text-stone-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span>Podkład Wektorowy i Satelitarny Świata (8 Stylów)</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {mapStylesList.map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() =>
                        onSaveSettings({
                          ...settings,
                          mapStyle: style.id,
                        })
                      }
                      className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                        settings.mapStyle === style.id
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/50 shadow-md font-semibold'
                          : 'bg-stone-950 hover:bg-stone-800 text-stone-300 border-stone-800'
                      }`}
                    >
                      <span className="text-xl shrink-0">{style.icon}</span>
                      <div className="min-w-0">
                        <div className="text-xs font-bold flex items-center justify-between">
                          <span>{style.label}</span>
                          {settings.mapStyle === style.id && (
                            <span className="w-2 h-2 rounded-full bg-amber-400" />
                          )}
                        </div>
                        <div className="text-[10px] text-stone-400 font-normal mt-0.5 leading-snug">
                          {style.desc}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3D Buildings & Detail Toggles */}
              <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-3">
                <div className="text-xs font-bold text-stone-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Zaawansowane Opcje Renderowania Wektorów</span>
                </div>

                <div className="space-y-2 text-xs">
                  <label className="flex items-center justify-between p-2 rounded-lg bg-stone-900 hover:bg-stone-850 cursor-pointer">
                    <div>
                      <div className="font-semibold text-stone-200">
                        Rzutowanie cieni i obrysów 3D budynków
                      </div>
                      <div className="text-[10px] text-stone-400">
                        Wyświetla przestrzenne obrysy architektury przy zoomie 16-19x
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.show3DBuildings}
                      onChange={(e) =>
                        onSaveSettings({
                          ...settings,
                          show3DBuildings: e.target.checked,
                        })
                      }
                      className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded-lg bg-stone-900 hover:bg-stone-850 cursor-pointer">
                    <div>
                      <div className="font-semibold text-stone-200">
                        Wysoka gęstość etykiet ulic i numerów domów
                      </div>
                      <div className="text-[10px] text-stone-400">
                        Renderuje drobne ścieżki, alejki parkowe i nazwy ulic
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.showStreetLabels}
                      onChange={(e) =>
                        onSaveSettings({
                          ...settings,
                          showStreetLabels: e.target.checked,
                        })
                      }
                      className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded-lg bg-stone-900 hover:bg-stone-850 cursor-pointer">
                    <div>
                      <div className="font-semibold text-stone-200">
                        Pasek HUD ze współrzędnymi GPS i skalą
                      </div>
                      <div className="text-[10px] text-stone-400">
                        Wskaźnik szerokości i długości geograficznej w czasie rzeczywistym
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.showCoordinatesHUD}
                      onChange={(e) =>
                        onSaveSettings({
                          ...settings,
                          showCoordinatesHUD: e.target.checked,
                        })
                      }
                      className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Pinezki & Relacje */}
          {activeTab === 'pins' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Pin Styles */}
              <div className="space-y-2.5">
                <label className="block text-xs font-bold text-stone-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Styl Pinezek i Prezentacji Wspomnień</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {pinStylesList.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() =>
                        onSaveSettings({
                          ...settings,
                          pinStyle: p.id,
                        })
                      }
                      className={`p-3 rounded-xl border text-left transition-all ${
                        settings.pinStyle === p.id
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/50 shadow-md font-semibold'
                          : 'bg-stone-950 hover:bg-stone-800 text-stone-300 border-stone-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-bold">{p.label}</div>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-stone-800 text-amber-400 font-mono">
                          {p.badge}
                        </span>
                      </div>
                      <div className="text-[10px] text-stone-400 font-normal mt-1 leading-snug">
                        {p.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Video & Media Behavior Options */}
              <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-3">
                <div className="text-xs font-bold text-stone-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5 text-amber-400" />
                  <span>Opcje Prezentacji Mediów</span>
                </div>

                <div className="space-y-2 text-xs">
                  <label className="flex items-center justify-between p-2 rounded-lg bg-stone-900 hover:bg-stone-850 cursor-pointer">
                    <div>
                      <div className="font-semibold text-stone-200">
                        Automatyczny podgląd wideo po najechaniu myszą
                      </div>
                      <div className="text-[10px] text-stone-400">
                        Odtwarza miniatury wideo po wskazaniu kursorem
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.autoPreviewVideoOnHover}
                      onChange={(e) =>
                        onSaveSettings({
                          ...settings,
                          autoPreviewVideoOnHover: e.target.checked,
                        })
                      }
                      className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded-lg bg-stone-900 hover:bg-stone-850 cursor-pointer">
                    <div>
                      <div className="font-semibold text-stone-200">
                        Autocentrowanie mapy po wybraniu wspomnienia
                      </div>
                      <div className="text-[10px] text-stone-400">
                        Płynny przelot kamery do klikniętego punktu z zachowaniem powiększenia
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.autoCenterOnSelect}
                      onChange={(e) =>
                        onSaveSettings({
                          ...settings,
                          autoCenterOnSelect: e.target.checked,
                        })
                      }
                      className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Okno & System */}
          {activeTab === 'system' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Resolution selection */}
              <div className="space-y-2.5">
                <label className="block text-xs font-bold text-stone-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Monitor className="w-3.5 h-3.5 text-amber-400" />
                  <span>Rozdzielczość Okna Desktop (Symulacja ramki Windows)</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: '1440x900', label: '1440 × 900 px', desc: 'Standardowy desktop (Wymagany)' },
                    { id: '1920x1080', label: '1920 × 1080 px', desc: 'Pełne HD (Wysoka gęstość)' },
                    { id: '1280x800', label: '1280 × 800 px', desc: 'Kompaktowy laptop' },
                    { id: 'fit', label: 'Dopasuj do okna', desc: 'Responsywne 100% ekranu' },
                  ].map((res) => (
                    <button
                      key={res.id}
                      type="button"
                      onClick={() =>
                        onSaveSettings({
                          ...settings,
                          windowResolution: res.id as WindowResolution,
                        })
                      }
                      className={`p-3 rounded-xl border text-left transition-all ${
                        settings.windowResolution === res.id
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/50 font-semibold'
                          : 'bg-stone-950 hover:bg-stone-800 text-stone-300 border-stone-800'
                      }`}
                    >
                      <div className="text-xs font-bold">{res.label}</div>
                      <div className="text-[10px] text-stone-400 font-normal">{res.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Accent Color selection */}
              <div className="space-y-2.5 pt-2 border-t border-stone-800">
                <label className="block text-xs font-bold text-stone-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-amber-400" />
                  <span>Główny Akcent Kolorystyczny UI</span>
                </label>

                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {accentColorsList.map((ac) => (
                    <button
                      key={ac.id}
                      type="button"
                      onClick={() =>
                        onSaveSettings({
                          ...settings,
                          accentColor: ac.id,
                        })
                      }
                      className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                        settings.accentColor === ac.id
                          ? 'bg-stone-800 border-amber-400 font-bold text-stone-100'
                          : 'bg-stone-950 text-stone-400 border-stone-800 hover:bg-stone-850'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full ${ac.bgClass} shadow-md`} />
                      <span className="text-[10px] truncate">{ac.label.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Diagnostyka & QA */}
          {activeTab === 'qa' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* State Simulator */}
              <div className="bg-stone-950 border border-amber-500/30 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Symulator Stanów Aplikacji (Narzędzie QA)</span>
                  </label>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono">
                    {settings.simulatedState}
                  </span>
                </div>
                <p className="text-[11px] text-stone-400 leading-relaxed">
                  Przełącz stan, aby zweryfikować zachowanie interfejsu przy pustej bazie, ładowaniu, błędzie lub braku mapy offline:
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-1">
                  {[
                    { id: 'ready', label: 'Normalny (Dane)', desc: '10 wspomnień' },
                    { id: 'empty', label: 'Stan Pusty', desc: 'Brak wspomnień' },
                    { id: 'loading', label: 'Ładowanie', desc: 'Szkielet UI' },
                    { id: 'error', label: 'Błąd Bazy', desc: 'Ekran awarii' },
                    { id: 'offline_map_missing', label: 'Brak Mapy', desc: 'Brak kafelków' },
                  ].map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() =>
                        onSaveSettings({
                          ...settings,
                          simulatedState: st.id as SimulatedAppState,
                        })
                      }
                      className={`p-2 rounded-lg border text-left text-xs transition-all ${
                        settings.simulatedState === st.id
                          ? 'bg-amber-400 text-stone-950 font-bold border-amber-400'
                          : 'bg-stone-900 hover:bg-stone-800 text-stone-300 border-stone-800'
                      }`}
                    >
                      <div className="font-semibold">{st.label}</div>
                      <div
                        className={`text-[10px] ${
                          settings.simulatedState === st.id ? 'text-stone-950' : 'text-stone-400'
                        }`}
                      >
                        {st.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* PySide6 Diagnostics */}
              <div className="bg-stone-950 border border-stone-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-200 flex items-center gap-1.5 uppercase tracking-wider">
                    <Cpu className="w-3.5 h-3.5 text-stone-400" />
                    <span>Diagnostyka Systemu & PySide6</span>
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      isPySideBridgeActive
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-stone-800 text-stone-400'
                    }`}
                  >
                    {isPySideBridgeActive ? 'PySide6 QWebChannel Połączony' : 'MockBridge (Tryb Prototypu)'}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-stone-400 font-mono">
                  <div className="flex justify-between">
                    <span>Pakiet mapy offline:</span>
                    <span className="text-stone-200">{offlineStatus.packName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rozmiar wektorów:</span>
                    <span className="text-stone-200">{offlineStatus.sizeOnDiskFormatted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Zasięg danych:</span>
                    <span className="text-stone-200">{offlineStatus.coverage}</span>
                  </div>
                </div>
              </div>

              {/* Reset Demo Data */}
              <div className="pt-2 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-stone-300">Przywróć dane domyślne</div>
                  <div className="text-[11px] text-stone-400">
                    Resetuje dodane lokalizacje i przywraca 10 startowych miejsc ze zdjęciami i filmami
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onResetDemoData();
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1.5 border border-stone-700"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Resetuj bazę</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-stone-800 bg-stone-950/80 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs transition-colors shadow-lg shadow-amber-400/10"
          >
            Zamknij i Zastosuj
          </button>
        </div>
      </div>
    </div>
  );
};
