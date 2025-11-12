# 🎮 Mario Game for Home Assistant

> 🇨🇿 **[Česká verze / Czech version](README.cs.md)**

A classic Mario platformer game created with dots/pixels as a custom card for Home Assistant.

<img width="989" height="533" alt="image" src="https://github.com/user-attachments/assets/32edcfdd-82b3-44de-8343-666f3003f068" />

## ✨ Features

- 🏃 Mario character made from colored dots
- 🎯 Platforms and obstacles
- 👾 Enemies (Goomba, Koopa Troopa, Piranha Plant)
- 🪙 Collectible coins
- 🏆 Score system with multiple levels
- ⌨️ Keyboard controls: **K/L** for movement, **SPACEBAR/W** for jump
- 🎨 Pixel art visuals made from small dots
- 🍄 Power-ups (mushrooms, fire flowers)
- 🔊 Sound effects
- 📱 Mobile controls (touch)
- 🏁 Flag at the end of each level

## 📦 Installation

### Method 1: HACS (Recommended) 🌟

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=joshuaaaaa&repository=mario&category=plugin)

#### Step by Step:

1. **Make sure you have [HACS](https://hacs.xyz/) installed**

2. **Add custom repository:**
   - Open HACS in Home Assistant
   - Click on **Frontend** (not Integrations!)
   - Click on **⋮** (three dots) in the top right corner
   - Select **Custom repositories**
   - Add:
     - **Repository**: `https://github.com/joshuaaaaa/mario`
     - **Category**: `Lovelace`
   - Click **ADD**

3. **Clear browser cache:**
   - Press **Ctrl+Shift+R** (or Cmd+Shift+R on Mac)

4. **Add card to dashboard:**
   - Dashboard → Edit → + Add Card
   - Scroll down to the **Custom** section
   - Find **Mario Game Card**
   - OR add manually: `type: custom:mario-game-card`

### Method 2: Manual Installation

#### 1. Download the file

Download `mario-game-card.js` from [latest release](https://github.com/joshuaaaaa/mario/releases/latest)

#### 2. Copy to www directory

Copy the file to the `config/www/` directory:

```
<YOUR_CONFIG_DIR>/
└── www/
    └── mario-game-card.js
```

**Example copy (Linux/Mac):**
```bash
# Replace /config/ with your path
scp mario-game-card.js root@homeassistant:/config/www/
```

**Via File Editor addon:**
1. Install "File Editor" addon in Home Assistant
2. Copy the file to `www/mario-game-card.js`

**Via Samba/SMB (Windows):**
1. Connect to `\\homeassistant\config\`
2. Copy the file to the `www\` folder

#### 3. Add resource to configuration.yaml

Edit `configuration.yaml` and add:

```yaml
lovelace:
  resources:
    - url: /local/mario-game-card.js
      type: module
```

#### 4. Restart Home Assistant

**Settings** → **System** → **Restart**

#### 5. Add card to dashboard

Now you can add the card:
```yaml
type: custom:mario-game-card
```

## 🎮 Controls

**PC:**
- **K** - Move left
- **L** - Move right
- **SPACEBAR** or **W** - Jump
- **X** or **SHIFT** - Shoot (with flower power-up)

**Mobile:**
- Use touch buttons below the game
- Or swipe up on canvas to jump

## 🎯 Game Mechanics

- **Horizontal scrolling** - Mario runs to the right like in the classic game
- Camera follows Mario smoothly
- Jump on platforms and avoid enemies
- **Improved air control** - better control when jumping
- Collect coins for points (50 points per coin) - placed in reachable locations
- Jump on enemies to eliminate them (100 points) or shoot them
- Collect power-ups:
  - 🍄 **Mushroom** - makes Mario bigger and gives extra hit point (200 points)
  - 🌺 **Fire Flower** - allows shooting fireballs (300 points)
- **Reach the flag at the end of the level** to complete it! 🏁
- 3 lives - don't fall off the bottom of the screen!
- Level bonus: 500 points per life + 50 points per collected coin

## 🛠️ Technical Details

The game is built using:
- **HTML5 Canvas** for rendering
- **Dot graphics** - all objects are rendered using small colored dots
- **JavaScript** for game logic
- **Home Assistant Custom Card API**

## 📝 Project Structure

```
mario/
├── custom_components/
│   └── mario_game/
│       ├── __init__.py           # Component initialization
│       ├── manifest.json         # Component metadata
│       ├── const.py              # Constants
│       └── mario-game-card.js   # Lovelace card with game logic
└── README.md                     # This file
```

## 🎨 Visual Style

All graphics are created from small dots (pixels):
- Mario: Red and beige
- Platforms: Brown with green grass
- Enemies: Brown with eyes
- Coins: Golden circles
- Clouds: White transparent

## ✅ New Features (v1.2)

- ✅ **Horizontal scrolling** - Mario runs to the right like in the classic game!
- ✅ **Smooth camera** - follows Mario with parallax cloud effect
- ✅ **Improved controls** - better air control when jumping
- ✅ **Flag at the end of level** - reach the flag to complete (not collecting coins)
- ✅ **Longer levels** (3200px width) - you can run to the right
- ✅ Coins placed in reachable locations (above platforms)
- ✅ Multiple levels with progressive difficulty
- ✅ Power-ups (mushrooms for growth, flowers for shooting)
- ✅ Sound effects (jump, coin, power-up, stomp, etc.)
- ✅ 3 enemy types (Goomba, Koopa Troopa, Piranha Plant)
- ✅ Animations (coins, enemies, particles)
- ✅ Mobile controls (touch buttons + swipe)
- ✅ Life system and invincibility after hit

## 🚀 Future Improvements

- [ ] More power-up types (star, 1-UP mushroom)
- [ ] Hidden blocks and power-up boxes
- [ ] Boss fights at the end of levels
- [ ] Background music
- [ ] High score leaderboard

## 📄 License

This project is open-source and free to use.

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss.

## Support

If you like this card, please ⭐ star this repository!

Found a bug or have a feature request? Please open an issue.



## http://buymeacoffee.com/jakubhruby


<img width="150" height="150" alt="qr-code" src="https://github.com/user-attachments/assets/2581bf36-7f7d-4745-b792-d1abaca6e57d" />

---

Created with ❤️ for the Home Assistant community
