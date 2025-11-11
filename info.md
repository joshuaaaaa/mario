# 🎮 Mario Game

Klasická Mario hra vytvořená pomocí teček/bodů jako custom karta pro Home Assistant.

## ✨ Funkce

- 🏃 Mario postavička vytvořená z barevných teček
- 🎯 Platformy a překážky
- 👾 Nepřátelé (Goomba) - můžete na ně skákat!
- 🪙 Sbíratelné mince pro body
- 🏆 Systém skóre
- ⌨️ Ovládání klávesnicí: **A/D** pro pohyb, **MEZERNÍK** pro skok
- 🎨 Veškerá grafika z malých bodů/teček

## 🎮 Ovládání

- **A** - Pohyb doleva
- **D** - Pohyb doprava
- **MEZERNÍK** - Skok

## 🎯 Herní mechaniky

- Skákejte na platformy a vyhýbejte se nepřátelům
- Sbírejte mince pro body (50 bodů za minci)
- Skákejte na nepřátele pro jejich eliminaci (100 bodů)
- Nespadněte ze spodní části obrazovky!

## 📝 Konfigurace

Po instalaci přes HACS:

1. Přidejte do `configuration.yaml`:
```yaml
mario_game:
```

2. Restartujte Home Assistant

3. Přidejte kartu do dashboardu:
   - Jděte na dashboard a klikněte **Upravit**
   - Klikněte **Přidat kartu**
   - Najděte **Custom: Mario Game Card**

Nebo použijte YAML konfiguraci:
```yaml
type: custom:mario-game-card
```

## 🎨 Screenshot

Hra obsahuje:
- Mario postavičku z teček
- Hnědé platformy se zelenou trávou
- Pohybující se nepřátele
- Zlaté mince
- Bílé mraky na pozadí

---

**Verze**: 1.0.0
**Autor**: Home Assistant Community
**Licence**: Open Source
