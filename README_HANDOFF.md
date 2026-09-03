# Mapa Wspomnień — Dokumentacja Architektury & Integracji PySide6 (Windows 10 x64)

> **Frontendowy prototyp aplikacji desktopowej Windows do prywatnego przypisywania zdjęć i filmów do współrzędnych GPS.**  
> Zbudowany w TypeScript + React + Tailwind CSS, w 100% offline, z wektorowym silnikiem kartograficznym WGS84 i architekturą Bridge gotową do bezpośredniego podłączenia lokalnej aplikacji Python / PySide6.

---

## 1. Architektura Bridge (`IAppBridge`)

Aplikacja oddziela warstwę graficzną UI od dostawcy danych za pomocą interfejsu `IAppBridge` (`src/types/index.ts` i `src/bridge/AppBridge.ts`).

### Schemat Komunikacji:
```
┌────────────────────────────────────────────────────────┐
│               Frontend React (Web / UI)                │
│    VectorMap.tsx  │  LocationPanel.tsx  │ TopBar.tsx   │
└───────────────────────────┬────────────────────────────┘
                            │
               Interfejs `IAppBridge`
                            │
            ┌───────────────┴───────────────┐
            ▼                               ▼
 ┌──────────────────────┐       ┌──────────────────────┐
 │      MockBridge      │       │   PySide6 Bridge     │
 │ (Tryb prototypu Web) │       │ (`window.pyBridge` / │
 │ 10 wbudowanych miejsc│       │  Qt QWebChannel)     │
 └──────────────────────┘       └──────────┬───────────┘
                                           │
                                           ▼
                                ┌──────────────────────┐
                                │   Python / PySide6   │
                                │   Lokalny SQLite     │
                                │  %LOCALAPPDATA%\...  │
                                └──────────────────────┘
```

---

## 2. Kontrakt Danych (JSON Data Contracts)

### `MemoryLocation`
```json
{
  "id": "loc-1",
  "title": "Morskie Oko i Czarny Staw",
  "region": "Tatry Wysokie, Małopolska",
  "coordinates": {
    "lat": 49.2007,
    "lng": 20.0711,
    "altitude": 1395
  },
  "primaryDate": "2024-08-14",
  "dateRange": "14–16 Sierpnia 2024",
  "description": "Wędrówka szlakiem od Palenicy Białczańskiej...",
  "tags": ["Tatry", "Góry", "Wędrówka", "Jezioro"],
  "isFavorite": true,
  "mediaCount": {
    "photos": 5,
    "videos": 1
  },
  "coverMediaId": "media-1",
  "media": [
    {
      "id": "media-1",
      "locationId": "loc-1",
      "type": "photo",
      "title": "Tafla Morskiego Oka o poranku",
      "fileName": "DSC_8901.JPG",
      "fileSizeFormatted": "4.2 MB",
      "timestamp": "2024-08-14 07:15",
      "sceneType": "mountains",
      "tags": ["Tatry", "Woda", "Poranek"],
      "exif": {
        "cameraModel": "Sony Alpha A7 IV",
        "lens": "FE 24-70mm F2.8 GM",
        "focalLength": "24 mm",
        "aperture": "f/8.0",
        "shutterSpeed": "1/320s",
        "iso": 100
      }
    }
  ]
}
```

---

## 3. Przykładowy Backend PySide6 (`main.py` & `bridge.py`)

Poniższy kod demonstruje, jak podłączyć wygenerowany build (`dist/`) do okna desktopowego Windows 10 w PySide6:

### `requirements.txt`
```
PySide6>=6.5.0
```

### `bridge.py`
```python
import json
import sqlite3
from pathlib import Path
from PySide6.QtCore import QObject, Slot

class PyBridge(QObject):
    def __init__(self, db_path: Path):
        super().__init__()
        self.db_path = db_path
        self._init_db()

    def _init_db(self):
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS locations (
                    id TEXT PRIMARY KEY,
                    data_json TEXT NOT NULL
                )
            """)

    @Slot(result=str)
    def getLocations(self) -> str:
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            rows = cursor.execute("SELECT data_json FROM locations").fetchall()
            locations = [json.loads(r[0]) for r in rows]
            return json.dumps(locations)

    @Slot(str, result=str)
    def addMemory(self, payload_json: str) -> str:
        payload = json.loads(payload_json)
        # Zapisz do bazy i zwróć utworzoną lokalizację
        # ...
        return json.dumps(payload)

    @Slot(str, result=str)
    def toggleFavorite(self, location_id: str) -> str:
        # Przełącz status ulubionych w bazie SQLite
        # ...
        return self.getLocations()
```

### `main.py`
```python
import sys
from pathlib import Path
from PySide6.QtCore import QUrl
from PySide6.QtWidgets import QApplication, QMainWindow
from PySide6.QtWebEngineWidgets import QWebEngineView
from PySide6.QtWebChannel import QWebChannel
from bridge import PyBridge

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Mapa Wspomnień — Windows Desktop")
        self.resize(1440, 900)

        # Ścieżka danych w %LOCALAPPDATA%
        app_data = Path.home() / "AppData" / "Local" / "MapaWspomnien"
        app_data.mkdir(parents=True, exist_ok=True)
        db_path = app_data / "memories.db"

        # WebEngine + QWebChannel
        self.view = QWebEngineView()
        self.channel = QWebChannel()
        self.bridge = PyBridge(db_path)
        self.channel.registerObject("pyBridge", self.bridge)
        self.view.page().setWebChannel(self.channel)

        # Załaduj skompilowany frontend
        dist_html = Path(__file__).parent / "dist" / "index.html"
        self.view.load(QUrl.fromLocalFile(str(dist_html.resolve())))
        self.setCentralWidget(self.view)

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec())
```

---

## 4. Polecenia CMD do Uruchomienia i Budowania

```cmd
:: 1. Zbudowanie frontendu React
npm run build

:: 2. Uruchomienie PySide6 (gdy gotowe)
python main.py

:: 3. Budowanie pliku .exe dla Windows 10
pyinstaller --noconsole --onefile --add-data "dist;dist" main.py
```
