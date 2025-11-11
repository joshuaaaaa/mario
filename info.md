# 🎮 Mario Game - Custom Lovelace Card

Klasická Mario hra vytvořená pomocí teček jako custom karta pro Home Assistant Dashboard.

## ✨ Funkce

- 🏃 Mario postavička vytvořená z barevných teček
- 🎯 Platformy a překážky
- 👾 Nepřátelé (Goomba)
- 🪙 Sbíratelné mince
- 🏆 Systém skóre
- ⌨️ Ovládání klávesnicí: **A/D** pro pohyb, **MEZERNÍK** pro skok

## 🎮 Ovládání

- **A** - Pohyb doleva
- **D** - Pohyb doprava
- **MEZERNÍK** - Skok

## ⚙️ Konfigurace po instalaci

### ⚠️ DŮLEŽITÉ: Po stažení přes HACS musíte:

1. **Přidat do configuration.yaml:**
   ```yaml
   mario_game:
   ```

2. **Restartovat Home Assistant**

3. **Přidat Lovelace Resource** (KRITICKÝ KROK!):
   - Nastavení → Dashboardy → ⋮ → Zdroje → + Přidat zdroj
   - **URL**: `/mario_game/mario-game-card.js`
   - **Typ**: `JavaScript Module`

4. **Vyčistit cache**: Ctrl+Shift+R

5. **Přidat kartu**:
   ```yaml
   type: custom:mario-game-card
   ```

## 🔍 Troubleshooting

**"Custom element not found: mario-game-card":**
- Nezapomněli jste přidat Lovelace Resource? (krok 3)
- Vyčistili jste cache? (Ctrl+Shift+R)
- Zkontrolujte, že URL `/mario_game/mario-game-card.js` je dostupná v prohlížeči

**404 chyba na `/mario_game/mario-game-card.js`:**
- Restartujte Home Assistant
- Zkontrolujte log, že integrace se načetla

## 🎯 Herní mechaniky

- Skákejte na platformy a vyhýbejte se nepřátelům
- Sbírejte mince pro body (50 bodů za minci)
- Skákejte na nepřátele pro jejich eliminaci (100 bodů)
- Nespadněte ze spodní části obrazovky!

---

💡 **Tip:** Po přidání karty na dashboard můžete měnit velikost karty. Doporučená výška je 6 jednotek.
