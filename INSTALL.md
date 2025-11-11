# 🚀 Rychlá instalace Mario Game

## ❗ DŮLEŽITÉ: 404 chyba znamená, že soubory nejsou zkopírovány do Home Assistant!

## Krok za krokem:

### 1. Zkopírujte tyto 4 soubory do Home Assistant:

Z tohoto repozitáře:
```
custom_components/mario_game/__init__.py
custom_components/mario_game/manifest.json
custom_components/mario_game/const.py
custom_components/mario_game/mario-game-card.js  ← MUSÍ být zkopírován!
```

Do vašeho Home Assistant:
```
<CONFIG>/custom_components/mario_game/__init__.py
<CONFIG>/custom_components/mario_game/manifest.json
<CONFIG>/custom_components/mario_game/const.py
<CONFIG>/custom_components/mario_game/mario-game-card.js
```

Kde `<CONFIG>` je:
- Home Assistant OS: `/config/`
- Docker: Váš mount point
- Core: `~/.homeassistant/`
- Samba: `\\homeassistant\config\`

### 2. Přidejte do configuration.yaml:

```yaml
mario_game:
```

### 3. Restartujte Home Assistant

### 4. Zkontrolujte, že soubor je dostupný:

Otevřete v prohlížeči:
```
http://VASE-HA-ADRESA:8123/mario_game/mario-game-card.js
```

✅ Měli byste vidět JavaScript kód
❌ Pokud vidíte 404, soubory nejsou správně zkopírovány!

### 5. Přidejte Lovelace resource:

**Nastavení** → **Dashboardy** → **⋮** → **Zdroje** → **+ Přidat**

- URL: `/mario_game/mario-game-card.js`
- Typ: **JavaScript Module**

### 6. Vyčistěte cache: Ctrl+Shift+R

### 7. Přidejte kartu:

```yaml
type: custom:mario-game-card
```

---

## 🆘 Troubleshooting

**404 chyba při otevření `/mario_game/mario-game-card.js`:**
- Soubory nejsou zkopírovány do Home Assistant
- Zkontrolujte, že `mario-game-card.js` je v `<CONFIG>/custom_components/mario_game/`

**"Custom element not found: mario-game-card":**
- Resource není přidán v Lovelace (krok 5)
- Cache prohlížeče není vyčištěna (krok 6)

**Komponenta se nenačte:**
- Zkontrolujte Home Assistant log (Nastavení → System → Logs)
- Hledejte "mario" v logu
