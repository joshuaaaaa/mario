# 🚀 Rychlá instalace Mario Game

## Metoda 1: HACS (Nejjednodušší)

### 1. Přidejte repository do HACS:
- Otevřete **HACS** → **Frontend** (ne Integrations!)
- Klikněte **⋮** → **Custom repositories**
- Repository: `https://github.com/joshuaaaaa/mario`
- Category: **Lovelace**

### 2. Nainstalujte:
- Najděte "Mario Game Card" v HACS Frontend
- Klikněte **DOWNLOAD**

### 3. Vyčistěte cache: Ctrl+Shift+R

### 4. Přidejte kartu:
```yaml
type: custom:mario-game-card
```

---

## Metoda 2: Manuální instalace

### 1. Stáhněte soubor:
Stáhněte `mario-game-card.js` z [releases](https://github.com/joshuaaaaa/mario/releases/latest)

### 2. Zkopírujte do www:
```
<CONFIG>/www/mario-game-card.js
```

Kde `<CONFIG>` je:
- Home Assistant OS: `/config/`
- Docker: Váš mount point
- Core: `~/.homeassistant/`
- Samba: `\\homeassistant\config\`

### 3. Přidejte do configuration.yaml:
```yaml
lovelace:
  resources:
    - url: /local/mario-game-card.js
      type: module
```

### 4. Restartujte Home Assistant

### 5. Přidejte kartu:
```yaml
type: custom:mario-game-card
```

---

## 🆘 Troubleshooting

**"Custom element not found: mario-game-card":**
- Vyčistěte cache (Ctrl+Shift+R)
- Zkontrolujte, že soubor je v `<CONFIG>/www/mario-game-card.js`
- Pokud jste instalovali manuálně, zkontrolujte configuration.yaml

**404 chyba při otevření `/local/mario-game-card.js`:**
- Soubor není zkopírován do `www/` adresáře
- Restartujte Home Assistant
