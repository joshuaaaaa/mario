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

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=joshuaaaaa&repository=mario&category=plugin)

#### Krok za krokem:

1. **Ujistěte se, že máte nainstalovaný [HACS](https://hacs.xyz/)**

2. **Přidejte custom repository:**
   - Otevřete HACS v Home Assistant
   - Klikněte na **Frontend** (ne Integrations!)
   - Klikněte na **⋮** (tři tečky) v pravém horním rohu
   - Vyberte **Custom repositories**
   - Přidejte:
     - **Repository**: `https://github.com/joshuaaaaa/mario`
     - **Category**: `Lovelace`
   - Klikněte **ADD**

3. **Stáhněte plugin:**
   - V HACS Frontend vyhledejte **"Mario Game Card"**
   - Klikněte na plugin
   - Klikněte **DOWNLOAD**
   - Klikněte **DOWNLOAD** znovu pro potvrzení

4. **Vyčistěte cache prohlížeče:**
   - Stiskněte **Ctrl+Shift+R** (nebo Cmd+Shift+R na Mac)

5. **Přidejte kartu na dashboard:**
   - Dashboard → Upravit → + Přidat kartu
   - Scrollujte dolů do sekce **Custom**
   - Najděte **Mario Game Card**
   - NEBO přidejte manuálně: `type: custom:mario-game-card`

### Metoda 2: Manuální instalace

#### 1. Stáhněte soubor

Stáhněte `mario-game-card.js` z [latest release](https://github.com/joshuaaaaa/mario/releases/latest)

#### 2. Zkopírujte do www adresáře

Zkopírujte soubor do adresáře `config/www/`:

```
<VAŠ_CONFIG_ADRESÁŘ>/
└── www/
    └── mario-game-card.js
```

**Příklad kopírování (Linux/Mac):**
```bash
# Nahraďte /config/ vaší cestou
scp mario-game-card.js root@homeassistant:/config/www/
```

**Přes File Editor addon:**
1. Nainstalujte "File Editor" addon v Home Assistant
2. Zkopírujte soubor do `www/mario-game-card.js`

**Přes Samba/SMB (Windows):**
1. Připojte se k `\\homeassistant\config\`
2. Zkopírujte soubor do složky `www\`

#### 3. Přidejte resource do configuration.yaml

Editujte `configuration.yaml` a přidejte:

```yaml
lovelace:
  resources:
    - url: /local/mario-game-card.js
      type: module
```

#### 4. Restartujte Home Assistant

**Nastavení** → **System** → **Restart**

#### 5. Přidejte kartu na dashboard

Nyní můžete přidat kartu:
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
