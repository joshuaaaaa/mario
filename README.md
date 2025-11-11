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

### 1. Zkopírujte soubory

Zkopírujte obsah tohoto repozitáře do vaší Home Assistant instalace:

```bash
# Custom komponenta
custom_components/mario_game/
├── __init__.py
├── manifest.json
└── const.py

# Lovelace karta
www/
└── mario-game-card.js
```

### 2. Přidejte do configuration.yaml

Přidejte následující řádek do vašeho `configuration.yaml`:

```yaml
mario_game:
```

### 3. Registrujte Lovelace kartu

V Home Assistant UI:

1. Jděte do **Nastavení** → **Dashboardy** → **Zdroje**
2. Klikněte na **Přidat zdroj**
3. URL: `/local/mario-game-card.js`
4. Typ zdroje: **JavaScript modul**
5. Klikněte na **Aktualizovat**

### 4. Restartujte Home Assistant

Restartujte Home Assistant aby se načetla custom komponenta.

### 5. Přidejte kartu do dashboardu

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
│       ├── __init__.py          # Inicializace komponenty
│       ├── manifest.json         # Metadata komponenty
│       └── const.py              # Konstanty
├── www/
│   └── mario-game-card.js       # Lovelace karta s herní logikou
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
