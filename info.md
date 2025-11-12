# 🎮 Mario Game - Custom Lovelace Card

Klasická Mario hra vytvořená pomocí teček jako custom karta pro Home Assistant Dashboard.

## ✨ Funkce

- 🏃 Mario postavička vytvořená z barevných teček
- 🎯 Více levelů s postupnou obtížností
- 👾 3 typy nepřátel (Goomba, Koopa, Piranha Plant)
- 🪙 Sbíratelné mince
- 🍄 Power-upy (houby, květiny)
- 🏆 Systém skóre a životů
- 🔊 Zvukové efekty
- ⌨️ Ovládání: **K/L** pohyb, **MEZERNÍK/W** skok, **X/SHIFT** střelba
- 📱 Mobilní ovládání (dotykové)

## 🎮 Ovládání

**PC:**
- **K** - Pohyb doleva
- **L** - Pohyb doprava
- **MEZERNÍK** nebo **W** - Skok
- **X** nebo **SHIFT** - Střelba (s flower power-upem)

**Mobil:**
- Dotykové tlačítka pod hrou

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

- **Běžte doprava** - horizontální scrollující level s kamerou
- Zlepšené ovládání ve vzduchu
- Sbírejte mince (50 bodů) a power-upy (200-300 bodů) - na dosažitelných místech
- Porazte nepřátele skokem (100 bodů) nebo střelbou
- 🍄 Houba = větší Mario + extra hit
- 🌺 Květina = schopnost střílet ohnivé koule
- **Dosáhněte vlajky 🏁 na konci levelu** pro dokončení!
- 3 životy
- Bonus: 500 bodů za život + 50 bodů za minci

---

💡 **Tip:** Po přidání karty na dashboard můžete měnit velikost karty. Doporučená výška je 6 jednotek.
