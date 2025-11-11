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

## ⚙️ Použití

### Po instalaci přes HACS:

1. **Vyčistit cache**: Ctrl+Shift+R

2. **Přidat kartu na dashboard**:
   ```yaml
   type: custom:mario-game-card
   ```

## 🔍 Troubleshooting

**"Custom element not found: mario-game-card":**
- Vyčistili jste cache? (Ctrl+Shift+R)
- Zkontrolujte, že soubor je v `config/www/mario-game-card.js`
- Pokud jste instalovali manuálně, zkontrolujte `configuration.yaml` resources

**Soubor se nenačítá:**
- Restartujte Home Assistant
- Zkontrolujte, že URL `/local/mario-game-card.js` je dostupná v prohlížeči

## 🎯 Herní mechaniky

- Skákejte na platformy a vyhýbejte se nepřátelům
- Sbírejte mince pro body (50 bodů za minci)
- Skákejte na nepřátele pro jejich eliminaci (100 bodů)
- Nespadněte ze spodní části obrazovky!

---

💡 **Tip:** Po přidání karty na dashboard můžete měnit velikost karty. Doporučená výška je 6 jednotek.
