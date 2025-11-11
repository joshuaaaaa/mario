# 🎮 Mario Game pro Home Assistant

Klasická Mario hra vytvořená pomocí teček/bodů jako custom karta pro Home Assistant.

## ✨ Funkce

- 🏃 Mario postavička vytvořená z barevných teček
- 🎯 Platformy a překážky
- 👾 Nepřátelé (Goomba)
- 🪙 Sbíratelné mince
- 🏆 Systém skóre
- ⌨️ Ovládání klávesnicí: **A/D** pro pohyb, **MEZERNÍK** pro skok
- 🎨 Vizuály z malých bodů/teček

## 📦 Instalace

### Metoda 1: HACS (Doporučeno) 🌟

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=joshuaaaaa&repository=mario&category=integration)

#### Krok za krokem:

1. **Ujistěte se, že máte nainstalovaný [HACS](https://hacs.xyz/)**

2. **Přidejte custom repository:**
   - Otevřete HACS v Home Assistant
   - Klikněte na **Integrations**
   - Klikněte na **⋮** (tři tečky) v pravém horním rohu
   - Vyberte **Custom repositories**
   - Přidejte:
     - **Repository**: `https://github.com/joshuaaaaa/mario`
     - **Category**: `Integration`
   - Klikněte **ADD**

3. **Stáhněte integraci:**
   - V HACS vyhledejte **"Mario Game"**
   - Klikněte na integraci
   - Klikněte **DOWNLOAD**
   - Klikněte **DOWNLOAD** znovu pro potvrzení

4. **Přidejte do configuration.yaml:**
   ```yaml
   mario_game:
   ```

5. **Restartujte Home Assistant:**
   - Nastavení → System → Restart

6. **Ověřte instalaci:**
   - V logu (Nastavení → System → Logs) hledejte:
     ```
     Mario Game integration loaded
     Mario Game card registered at /mario_game/mario-game-card.js
     ```

7. **Otestujte přístup k JS souboru:**
   - V prohlížeči otevřete: `http://VASE-HA-ADRESA:8123/mario_game/mario-game-card.js`
   - ✅ Měli byste vidět JavaScript kód (ne 404!)

8. **Přidejte Lovelace resource:**
   - **⚠️ KRITICKÝ KROK!**
   - Nastavení → Dashboardy → ⋮ → Zdroje → + Přidat zdroj
   - **URL**: `/mario_game/mario-game-card.js`
   - **Typ**: `JavaScript Module`
   - Klikněte VYTVOŘIT

9. **Vyčistěte cache prohlížeče:**
   - Stiskněte **Ctrl+Shift+R** (nebo Cmd+Shift+R na Mac)

10. **Přidejte kartu na dashboard:**
    - Dashboard → Upravit → + Přidat kartu
    - Scrollujte dolů do sekce **Custom**
    - Najděte **Mario Game Card**
    - NEBO přidejte manuálně: `type: custom:mario-game-card`

### Metoda 2: Manuální instalace

#### 1. Zjistěte cestu k Home Assistant config

Vaše Home Assistant config adresář je obvykle:
- **Home Assistant OS/Supervised**: `/config/`
- **Docker**: Mount point (např. `/home/user/homeassistant/`)
- **Core**: `~/.homeassistant/`
- **Přes Samba/SMB**: `\\homeassistant\config\`

#### 2. Zkopírujte soubory

Zkopírujte celý adresář `custom_components/mario_game/` do vašeho Home Assistant:

```
<VAŠ_CONFIG_ADRESÁŘ>/
└── custom_components/
    └── mario_game/
        ├── __init__.py
        ├── manifest.json
        ├── const.py
        └── mario-game-card.js   ← Tento soubor je kritický!
```

**Příklad kopírování (Linux/Mac):**
```bash
# Nahraďte /config/ vaší cestou
scp -r custom_components/mario_game/ root@homeassistant:/config/custom_components/
```

**Přes File Editor addon:**
1. Nainstalujte "File Editor" addon v Home Assistant
2. Vytvořte adresář `custom_components/mario_game/`
3. Zkopírujte všechny 4 soubory ručně

**Přes Samba/SMB (Windows):**
1. Připojte se k `\\homeassistant\config\`
2. Vytvořte složku `custom_components\mario_game\`
3. Zkopírujte všechny 4 soubory

#### 3. Ověřte instalaci

Zkontrolujte, že soubory jsou na správném místě:
```
<CONFIG>/custom_components/mario_game/__init__.py
<CONFIG>/custom_components/mario_game/mario-game-card.js  ← Musí existovat!
<CONFIG>/custom_components/mario_game/manifest.json
<CONFIG>/custom_components/mario_game/const.py
```

#### 4. Přidejte do configuration.yaml

Editujte `configuration.yaml` a přidejte:

```yaml
mario_game:
```

#### 5. Restartujte Home Assistant

**Nastavení** → **System** → **Restart**

#### 6. Zkontrolujte log

Po restartu jděte do **Nastavení** → **System** → **Logs** a hledejte:
```
Mario Game integration loaded
Registering Mario Game card from: ...
Mario Game card registered at /mario_game/mario-game-card.js
```

✅ Pokud vidíte tyto zprávy, komponenta je správně nainstalována!

❌ Pokud vidíte "Card file not found", soubory nejsou zkopírovány správně!

#### 7. Otestujte přístup k souboru

V prohlížeči otevřete:
```
http://VASE-HA-ADRESA:8123/mario_game/mario-game-card.js
```

Měli byste vidět JavaScript kód (ne 404 chybu)!

#### 8. Přidejte Lovelace resource

**⚠️ KRITICKÝ KROK - Bez tohoto nebude fungovat!**

1. **Nastavení** → **Dashboardy** → **⋮** (tři tečky) → **Zdroje**
2. Klikněte **+ PŘIDAT ZDROJ**
3. Vyplňte:
   - **URL**: `/mario_game/mario-game-card.js`
   - **Typ**: **JavaScript Module**
4. Klikněte **VYTVOŘIT** nebo **AKTUALIZOVAT**
5. Vyčistěte cache: **Ctrl+Shift+R**

#### 9. Přidejte kartu na dashboard

Nyní můžete přidat kartu:
1. Dashboard → **Upravit** → **+ Přidat kartu**
2. Scrollujte dolů do sekce **Custom**
3. Najděte **Mario Game Card**

Nebo manuálně:
```yaml
type: custom:mario-game-card
```

### Přidání karty do dashboardu

1. Jděte na váš dashboard
2. Klikněte na **Upravit dashboard**
3. Klikněte na **Přidat kartu**
4. V dolním menu najděte **Custom: Mario Game Card**
5. Přidejte kartu

Nebo použijte ruční konfiguraci:

```yaml
type: custom:mario-game-card
```

## 🎮 Ovládání

- **A** - Pohyb doleva
- **D** - Pohyb doprava
- **MEZERNÍK** - Skok

## 🎯 Herní mechaniky

- Skákejte na platformy a vyhýbejte se nepřátelům
- Sbírejte mince pro body (50 bodů za minci)
- Skákejte na nepřátele pro jejich eliminaci (100 bodů)
- Nespadněte ze spodní části obrazovky!

## 🛠️ Technické detaily

Hra je vytvořena pomocí:
- **HTML5 Canvas** pro vykreslení
- **Tečková grafika** - všechny objekty jsou vykresleny pomocí malých barevných teček
- **JavaScript** pro herní logiku
- **Home Assistant Custom Card API**

## 📝 Struktura projektu

```
mario/
├── custom_components/
│   └── mario_game/
│       ├── __init__.py           # Inicializace komponenty
│       ├── manifest.json         # Metadata komponenty
│       ├── const.py              # Konstanty
│       └── mario-game-card.js   # Lovelace karta s herní logikou
└── README.md                     # Tento soubor
```

## 🎨 Vzhled

Veškerá grafika je vytvořena z malých teček (pixelů):
- Mario: Červený a béžový
- Platformy: Hnědé s zelenou trávou
- Nepřátelé: Hnědí s očima
- Mince: Zlaté kruhové
- Mraky: Bílé průhledné

## 🚀 Budoucí vylepšení

- [ ] Více levelů
- [ ] Power-upy (houby, květiny)
- [ ] Zvukové efekty
- [ ] Více typů nepřátel
- [ ] Lepší animace
- [ ] Mobilní ovládání (dotykové)

## 📄 Licence

Tento projekt je open-source a volně použitelný.

## 🤝 Přispívání

Pull requesty jsou vítány! Pro větší změny prosím nejprve otevřete issue pro diskusi.

---

Vytvořeno s ❤️ pro Home Assistant komunitu
