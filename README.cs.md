# 🎮 Mario Game pro Home Assistant

> 🇬🇧 **[English version](README.md)**

Klasická Mario hra vytvořená pomocí teček/bodů jako custom karta pro Home Assistant.

## ✨ Funkce

- 🏃 Mario postavička vytvořená z barevných teček
- 🎯 Platformy a překážky
- 👾 Nepřátelé (Goomba, Koopa Troopa, Piranha Plant)
- 🪙 Sbíratelné mince
- 🏆 Systém skóre a více levelů
- ⌨️ Ovládání klávesnicí: **K/L** pro pohyb, **MEZERNÍK/W** pro skok
- 🎨 Vizuály z malých bodů/teček
- 🍄 Power-upy (houby, květiny)
- 🔊 Zvukové efekty
- 📱 Mobilní ovládání (dotykové)
- 🏁 Vlajka na konci každého levelu
- 💡 **Integrace se světlem** - připojte si světla z Home Assistant, která probliknou při sebrání mince!
- 🌍 **Podpora více jazyků** - automaticky se zobrazuje v angličtině nebo češtině podle jazykového nastavení vašeho Home Assistant

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

**Volitelně: Integrace se světlem** 💡

Můžete připojit světelnou entitu z Home Assistant, která problikne při sebrání mince:

```yaml
type: custom:mario-game-card
light_entity: light.vase_svetlo
```

Nahraďte `light.vase_svetlo` vaším skutečným ID světelné entity z Home Assistant.

## 🎮 Ovládání

**PC:**
- **K** - Pohyb doleva
- **L** - Pohyb doprava
- **MEZERNÍK** nebo **W** - Skok
- **X** nebo **SHIFT** - Střelba (s flower power-upem)

**Mobil:**
- Použijte dotykové tlačítka pod hrou
- Nebo swipněte nahoru na canvasu pro skok

## 🎯 Herní mechaniky

- **Horizontální scrolling** - Mario běží doprava jako v klasické hře
- Kamera sleduje Maria plynule
- Skákejte na platformy a vyhýbejte se nepřátelům
- **Zlepšené ovládání ve vzduchu** - lepší kontrola při skákání
- Sbírejte mince pro body (50 bodů za minci) - umístěné na dosažitelných místech
- Skákejte na nepřátele pro jejich eliminaci (100 bodů) nebo je sestřelte
- Sesbírejte power-upy:
  - 🍄 **Houba** - zvětší Mária a dá extra hit point (200 bodů)
  - 🌺 **Květina** - umožní střílet ohnivé koule (300 bodů)
- **Dosáhněte vlajky na konci levelu** pro dokončení! 🏁
- 3 životy - nespadněte ze spodní části obrazovky!
- Level bonus: 500 bodů za každý život + 50 bodů za sbíranou minci

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

## ✅ Nové funkce (v1.2)

- ✅ **Horizontální scrollování** - Mario běží doprava jako v klasické hře!
- ✅ **Plynulá kamera** - sleduje Maria s parallax efektem mraku
- ✅ **Zlepšené ovládání** - lepší kontrola ve vzduchu při skákání
- ✅ **Vlajka na konci levelu** - dosáhněte vlajky pro dokončení (ne sbírání mincí)
- ✅ **Delší levely** (3200px šířka) - můžete běžet doprava
- ✅ Mince umístěné na dosažitelných místech (nad platformami)
- ✅ Více levelů s postupnou obtížností
- ✅ Power-upy (houby pro zvětšení, květiny pro střelbu)
- ✅ Zvukové efekty (skok, mince, power-up, stomp, atd.)
- ✅ 3 typy nepřátel (Goomba, Koopa Troopa, Piranha Plant)
- ✅ Animace (mince, nepřátelé, částice)
- ✅ Mobilní ovládání (dotykové tlačítka + swipe)
- ✅ Systém životů a invincibility po zásahu

## 🚀 Budoucí vylepšení

- [ ] Více typů power-upů (hvězda, 1-UP houba)
- [ ] Skryté bloky a power-up boxy
- [ ] Boss fights na konci levelů
- [ ] Hudba na pozadí
- [ ] High score tabulka

## 📄 Licence

Tento projekt je open-source a volně použitelný.

## 🤝 Přispívání

Pull requesty jsou vítány! Pro větší změny prosím nejprve otevřete issue pro diskusi.

---

Vytvořeno s ❤️ pro Home Assistant komunitu
