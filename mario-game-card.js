console.info('%c🎮 MARIO-GAME-CARD %cLoading...', 'color: red; font-weight: bold', 'color: green');

class MarioGameCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.gameState = {
      player: { x: 50, y: 300, width: 20, height: 20, velocityY: 0, velocityX: 0, onGround: false },
      keys: { left: false, right: false, jump: false },
      platforms: [],
      enemies: [],
      coins: [],
      score: 0,
      gameOver: false,
      level: 1
    };
    this.canvas = null;
    this.ctx = null;
    this.animationId = null;
  }

  setConfig(config) {
    // Accept any config, including empty object
    this.config = config || {};
    // Only render if we have a shadow root
    if (this.shadowRoot) {
      this.render();
    }
  }

  static getStubConfig() {
    return {};
  }

  static getConfigElement() {
    // Return undefined to indicate no visual editor
    return undefined;
  }

  getCardSize() {
    return 6;
  }

  set hass(hass) {
    // Store hass object when Home Assistant provides it
    this._hass = hass;
  }

  connectedCallback() {
    // Render when element is connected to DOM, if we have config
    if (this.config && this.shadowRoot) {
      this.render();
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        ha-card {
          padding: 16px;
          background: #1a1a1a;
          border-radius: 8px;
        }
        .game-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }
        canvas {
          border: 3px solid #4a90e2;
          background: #87CEEB;
          border-radius: 4px;
          cursor: crosshair;
          image-rendering: pixelated;
        }
        .game-info {
          display: flex;
          gap: 24px;
          color: #fff;
          font-family: 'Courier New', monospace;
          font-size: 18px;
          font-weight: bold;
        }
        .controls {
          color: #aaa;
          font-size: 12px;
          text-align: center;
          font-family: 'Courier New', monospace;
        }
        .game-over {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(0, 0, 0, 0.9);
          color: #fff;
          padding: 20px 40px;
          border-radius: 8px;
          font-family: 'Courier New', monospace;
          font-size: 24px;
          text-align: center;
        }
        .restart-btn {
          margin-top: 16px;
          padding: 10px 20px;
          background: #4a90e2;
          border: none;
          border-radius: 4px;
          color: #fff;
          font-size: 16px;
          cursor: pointer;
          font-family: 'Courier New', monospace;
        }
        .restart-btn:hover {
          background: #357abd;
        }
      </style>
      <ha-card>
        <div class="game-container">
          <div class="game-info">
            <div>🏆 Skóre: <span id="score">0</span></div>
            <div>📍 Level: <span id="level">1</span></div>
          </div>
          <div style="position: relative;">
            <canvas id="gameCanvas" width="800" height="400"></canvas>
            <div id="gameOverScreen" style="display: none;" class="game-over">
              <div>💀 GAME OVER 💀</div>
              <div style="font-size: 16px; margin-top: 10px;">Skóre: <span id="finalScore">0</span></div>
              <button class="restart-btn" id="restartBtn">🔄 Restart</button>
            </div>
          </div>
          <div class="controls">
            ⌨️ Ovládání: A/D = pohyb vlevo/vpravo | MEZERNÍK = skok
          </div>
        </div>
      </ha-card>
    `;

    this.canvas = this.shadowRoot.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.scoreElement = this.shadowRoot.getElementById('score');
    this.levelElement = this.shadowRoot.getElementById('level');
    this.gameOverScreen = this.shadowRoot.getElementById('gameOverScreen');
    this.finalScoreElement = this.shadowRoot.getElementById('finalScore');

    this.shadowRoot.getElementById('restartBtn').addEventListener('click', () => this.restartGame());

    this.initGame();
    this.setupControls();
    this.gameLoop();
  }

  initGame() {
    this.gameState = {
      player: { x: 50, y: 100, width: 20, height: 20, velocityY: 0, velocityX: 0, onGround: false },
      keys: { left: false, right: false, jump: false },
      platforms: this.generateLevel(1),
      enemies: [],
      coins: [],
      score: 0,
      gameOver: false,
      level: 1
    };

    // Add enemies
    this.gameState.enemies = [
      { x: 300, y: 340, width: 16, height: 16, velocityX: 1, direction: 1 },
      { x: 500, y: 240, width: 16, height: 16, velocityX: 1, direction: 1 },
      { x: 650, y: 140, width: 16, height: 16, velocityX: 1, direction: 1 }
    ];

    // Add coins
    this.gameState.coins = [
      { x: 250, y: 320, collected: false },
      { x: 400, y: 220, collected: false },
      { x: 550, y: 120, collected: false },
      { x: 700, y: 220, collected: false },
      { x: 750, y: 50, collected: false }
    ];

    this.gameOverScreen.style.display = 'none';
  }

  generateLevel(level) {
    const platforms = [
      // Ground
      { x: 0, y: 380, width: 800, height: 20 },
      // Platforms
      { x: 200, y: 350, width: 150, height: 15 },
      { x: 400, y: 250, width: 120, height: 15 },
      { x: 550, y: 150, width: 100, height: 15 },
      { x: 680, y: 250, width: 120, height: 15 },
      { x: 700, y: 80, width: 100, height: 15 }
    ];
    return platforms;
  }

  setupControls() {
    document.addEventListener('keydown', (e) => {
      if (this.gameState.gameOver) return;

      if (e.key === 'a' || e.key === 'A') {
        this.gameState.keys.left = true;
      }
      if (e.key === 'd' || e.key === 'D') {
        this.gameState.keys.right = true;
      }
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        this.gameState.keys.jump = true;
      }
    });

    document.addEventListener('keyup', (e) => {
      if (e.key === 'a' || e.key === 'A') {
        this.gameState.keys.left = false;
      }
      if (e.key === 'd' || e.key === 'D') {
        this.gameState.keys.right = false;
      }
      if (e.key === ' ' || e.key === 'Spacebar') {
        this.gameState.keys.jump = false;
      }
    });
  }

  update() {
    if (this.gameState.gameOver) return;

    const player = this.gameState.player;
    const gravity = 0.5;
    const moveSpeed = 4;
    const jumpStrength = 12;

    // Horizontal movement
    if (this.gameState.keys.left) {
      player.velocityX = -moveSpeed;
    } else if (this.gameState.keys.right) {
      player.velocityX = moveSpeed;
    } else {
      player.velocityX *= 0.8; // Friction
    }

    // Jumping
    if (this.gameState.keys.jump && player.onGround) {
      player.velocityY = -jumpStrength;
      player.onGround = false;
    }

    // Apply gravity
    player.velocityY += gravity;

    // Update position
    player.x += player.velocityX;
    player.y += player.velocityY;

    // Boundary checks
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > this.canvas.width) player.x = this.canvas.width - player.width;

    // Platform collision
    player.onGround = false;
    for (const platform of this.gameState.platforms) {
      if (this.checkCollision(player, platform)) {
        if (player.velocityY > 0 && player.y + player.height - player.velocityY <= platform.y) {
          player.y = platform.y - player.height;
          player.velocityY = 0;
          player.onGround = true;
        }
      }
    }

    // Check if player fell off
    if (player.y > this.canvas.height) {
      this.endGame();
    }

    // Update enemies
    for (const enemy of this.gameState.enemies) {
      enemy.x += enemy.velocityX * enemy.direction;

      // Bounce off edges
      if (enemy.x < 0 || enemy.x + enemy.width > this.canvas.width) {
        enemy.direction *= -1;
      }

      // Check collision with player
      if (this.checkCollision(player, enemy)) {
        // Check if player jumped on enemy
        if (player.velocityY > 0 && player.y + player.height - player.velocityY <= enemy.y) {
          // Kill enemy
          enemy.x = -100; // Move off screen
          this.gameState.score += 100;
          player.velocityY = -8; // Bounce
        } else {
          this.endGame();
        }
      }
    }

    // Check coin collection
    for (const coin of this.gameState.coins) {
      if (!coin.collected && this.checkCollision(player, { x: coin.x - 8, y: coin.y - 8, width: 16, height: 16 })) {
        coin.collected = true;
        this.gameState.score += 50;
      }
    }

    // Update UI
    this.scoreElement.textContent = this.gameState.score;
    this.levelElement.textContent = this.gameState.level;
  }

  checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  }

  draw() {
    // Clear canvas with sky color
    this.ctx.fillStyle = '#87CEEB';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw clouds using dots
    this.drawCloud(100, 50);
    this.drawCloud(400, 80);
    this.drawCloud(650, 40);

    // Draw platforms using dots
    for (const platform of this.gameState.platforms) {
      this.drawPlatform(platform);
    }

    // Draw coins using dots
    for (const coin of this.gameState.coins) {
      if (!coin.collected) {
        this.drawCoin(coin.x, coin.y);
      }
    }

    // Draw enemies using dots
    for (const enemy of this.gameState.enemies) {
      if (enemy.x > 0) {
        this.drawEnemy(enemy);
      }
    }

    // Draw player (Mario) using dots
    this.drawPlayer(this.gameState.player);
  }

  drawCloud(x, y) {
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    const dotSize = 3;
    const spacing = 5;
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 3; j++) {
        this.ctx.beginPath();
        this.ctx.arc(x + i * spacing, y + j * spacing, dotSize, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }
  }

  drawPlatform(platform) {
    const dotSize = 3;
    const spacing = 6;

    // Brown/green platform
    this.ctx.fillStyle = '#8B4513';
    for (let x = platform.x; x < platform.x + platform.width; x += spacing) {
      for (let y = platform.y; y < platform.y + platform.height; y += spacing) {
        this.ctx.beginPath();
        this.ctx.arc(x + dotSize, y + dotSize, dotSize, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }

    // Green grass on top
    this.ctx.fillStyle = '#228B22';
    for (let x = platform.x; x < platform.x + platform.width; x += spacing) {
      this.ctx.beginPath();
      this.ctx.arc(x + dotSize, platform.y + dotSize, dotSize, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  drawPlayer(player) {
    const dotSize = 2;
    const spacing = 3;

    // Mario's body (red)
    this.ctx.fillStyle = '#FF0000';
    for (let x = player.x + 4; x < player.x + player.width - 4; x += spacing) {
      for (let y = player.y + 8; y < player.y + player.height - 4; y += spacing) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, dotSize, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }

    // Mario's head (skin tone)
    this.ctx.fillStyle = '#FFDBAC';
    for (let x = player.x + 6; x < player.x + player.width - 6; x += spacing) {
      for (let y = player.y + 2; y < player.y + 10; y += spacing) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, dotSize, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }

    // Mario's hat (red)
    this.ctx.fillStyle = '#FF0000';
    for (let x = player.x + 4; x < player.x + player.width - 4; x += spacing) {
      this.ctx.beginPath();
      this.ctx.arc(x, player.y + 2, dotSize, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // Eyes
    this.ctx.fillStyle = '#000000';
    this.ctx.beginPath();
    this.ctx.arc(player.x + 8, player.y + 6, 1, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.arc(player.x + 12, player.y + 6, 1, 0, Math.PI * 2);
    this.ctx.fill();
  }

  drawEnemy(enemy) {
    const dotSize = 2;
    const spacing = 3;

    // Goomba body (brown)
    this.ctx.fillStyle = '#8B4513';
    for (let x = enemy.x; x < enemy.x + enemy.width; x += spacing) {
      for (let y = enemy.y; y < enemy.y + enemy.height; y += spacing) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, dotSize, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }

    // Eyes
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.beginPath();
    this.ctx.arc(enemy.x + 4, enemy.y + 6, 2, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.arc(enemy.x + 12, enemy.y + 6, 2, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = '#000000';
    this.ctx.beginPath();
    this.ctx.arc(enemy.x + 5, enemy.y + 6, 1, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.arc(enemy.x + 11, enemy.y + 6, 1, 0, Math.PI * 2);
    this.ctx.fill();
  }

  drawCoin(x, y) {
    const dotSize = 2;
    const spacing = 3;

    // Gold coin
    this.ctx.fillStyle = '#FFD700';
    for (let dx = -6; dx <= 6; dx += spacing) {
      for (let dy = -6; dy <= 6; dy += spacing) {
        if (dx * dx + dy * dy <= 36) {
          this.ctx.beginPath();
          this.ctx.arc(x + dx, y + dy, dotSize, 0, Math.PI * 2);
          this.ctx.fill();
        }
      }
    }

    // Coin detail
    this.ctx.fillStyle = '#FFA500';
    this.ctx.beginPath();
    this.ctx.arc(x, y, 2, 0, Math.PI * 2);
    this.ctx.fill();
  }

  endGame() {
    this.gameState.gameOver = true;
    this.finalScoreElement.textContent = this.gameState.score;
    this.gameOverScreen.style.display = 'block';
  }

  restartGame() {
    this.initGame();
  }

  gameLoop() {
    this.update();
    this.draw();
    this.animationId = requestAnimationFrame(() => this.gameLoop());
  }

  disconnectedCallback() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}

customElements.define('mario-game-card', MarioGameCard);
console.info('%c🎮 MARIO-GAME-CARD %cCustom element registered!', 'color: red; font-weight: bold', 'color: green');

// Register the card with Home Assistant
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'mario-game-card',
  name: 'Mario Game Card',
  description: 'Klasická Mario hra vytvořená z teček - ovládání pomocí ASDW a mezerník'
});
console.info('%c🎮 MARIO-GAME-CARD %cRegistered in window.customCards', 'color: red; font-weight: bold', 'color: green');
