console.info('%c🎮 MARIO-GAME-CARD %cLoading Enhanced Version...', 'color: red; font-weight: bold', 'color: green');

class MarioGameCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.gameState = {
      player: {
        x: 50, y: 300, width: 20, height: 20,
        velocityY: 0, velocityX: 0, onGround: false,
        powered: false,
        canShoot: false,
        invincible: 0,
        animFrame: 0
      },
      keys: { left: false, right: false, jump: false, shoot: false },
      camera: { x: 0 },
      platforms: [],
      enemies: [],
      coins: [],
      powerUps: [],
      projectiles: [],
      particles: [],
      flag: null,
      levelWidth: 3200,
      score: 0,
      lives: 3,
      gameOver: false,
      level: 1,
      levelComplete: false,
      coinsCollected: 0,
      enemiesKilled: 0,
      animCounter: 0
    };
    this.canvas = null;
    this.ctx = null;
    this.animationId = null;
    this.sounds = this.initSounds();
    this.touchStartX = 0;
    this.touchStartY = 0;
  }

  initSounds() {
    const audioContext = typeof AudioContext !== 'undefined' ? new AudioContext() : null;

    const createSound = (frequency, duration, type = 'sine') => {
      return () => {
        if (!audioContext) return;
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = type;

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
      };
    };

    return {
      jump: createSound(523.25, 0.1),
      coin: createSound(1046.50, 0.1),
      powerUp: createSound(659.25, 0.2),
      stomp: createSound(196.00, 0.15, 'square'),
      shoot: createSound(880.00, 0.1, 'square'),
      die: createSound(164.81, 0.3),
      levelComplete: createSound(783.99, 0.5)
    };
  }

  setConfig(config) {
    this.config = config || {};
    if (this.shadowRoot) {
      this.render();
    }
  }

  static getStubConfig() {
    return {};
  }

  static getConfigElement() {
    return undefined;
  }

  getCardSize() {
    return 6;
  }

  set hass(hass) {
    this._hass = hass;
  }

  connectedCallback() {
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
          touch-action: none;
        }
        .game-info {
          display: flex;
          gap: 24px;
          color: #fff;
          font-family: 'Courier New', monospace;
          font-size: 18px;
          font-weight: bold;
          flex-wrap: wrap;
          justify-content: center;
        }
        .controls {
          color: #aaa;
          font-size: 12px;
          text-align: center;
          font-family: 'Courier New', monospace;
        }
        .game-over, .level-complete {
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
          z-index: 10;
        }
        .restart-btn, .next-level-btn {
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
        .restart-btn:hover, .next-level-btn:hover {
          background: #357abd;
        }
        .touch-controls {
          display: none;
          margin-top: 10px;
          gap: 10px;
          justify-content: center;
          flex-wrap: wrap;
        }
        @media (max-width: 900px) {
          .touch-controls {
            display: flex;
          }
        }
        .touch-btn {
          padding: 15px 20px;
          background: #4a90e2;
          border: none;
          border-radius: 8px;
          color: #fff;
          font-size: 20px;
          cursor: pointer;
          user-select: none;
          touch-action: manipulation;
        }
        .touch-btn:active {
          background: #357abd;
        }
      </style>
      <ha-card>
        <div class="game-container">
          <div class="game-info">
            <div>🏆 Skóre: <span id="score">0</span></div>
            <div>❤️ Životy: <span id="lives">3</span></div>
            <div>📍 Level: <span id="level">1</span></div>
            <div>🪙 Mince: <span id="coinsCollected">0</span></div>
          </div>
          <div style="position: relative;">
            <canvas id="gameCanvas" width="800" height="400"></canvas>
            <div id="gameOverScreen" style="display: none;" class="game-over">
              <div>💀 GAME OVER 💀</div>
              <div style="font-size: 16px; margin-top: 10px;">Skóre: <span id="finalScore">0</span></div>
              <div style="font-size: 14px; margin-top: 5px;">Level: <span id="finalLevel">1</span></div>
              <button class="restart-btn" id="restartBtn">🔄 Restart</button>
            </div>
            <div id="levelCompleteScreen" style="display: none;" class="level-complete">
              <div>🎉 LEVEL COMPLETE! 🎉</div>
              <div style="font-size: 16px; margin-top: 10px;">Bonus: <span id="levelBonus">0</span> bodů</div>
              <button class="next-level-btn" id="nextLevelBtn">➡️ Další Level</button>
            </div>
          </div>
          <div class="controls">
            ⌨️ PC: K/L = pohyb vlevo/vpravo | MEZERNÍK/W = skok | X/SHIFT = střelba<br>
            📱 Mobil: Použijte tlačítka níže
          </div>
          <div class="touch-controls">
            <button class="touch-btn" id="touchLeft">◀️</button>
            <button class="touch-btn" id="touchJump">⬆️</button>
            <button class="touch-btn" id="touchRight">▶️</button>
            <button class="touch-btn" id="touchShoot">🔥</button>
          </div>
        </div>
      </ha-card>
    `;

    this.canvas = this.shadowRoot.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.scoreElement = this.shadowRoot.getElementById('score');
    this.livesElement = this.shadowRoot.getElementById('lives');
    this.levelElement = this.shadowRoot.getElementById('level');
    this.coinsCollectedElement = this.shadowRoot.getElementById('coinsCollected');
    this.gameOverScreen = this.shadowRoot.getElementById('gameOverScreen');
    this.levelCompleteScreen = this.shadowRoot.getElementById('levelCompleteScreen');
    this.finalScoreElement = this.shadowRoot.getElementById('finalScore');
    this.finalLevelElement = this.shadowRoot.getElementById('finalLevel');
    this.levelBonusElement = this.shadowRoot.getElementById('levelBonus');

    this.shadowRoot.getElementById('restartBtn').addEventListener('click', () => this.restartGame());
    this.shadowRoot.getElementById('nextLevelBtn').addEventListener('click', () => this.nextLevel());

    this.setupTouchControls();
    this.initGame();
    this.setupControls();
    this.gameLoop();
  }

  setupTouchControls() {
    const touchLeft = this.shadowRoot.getElementById('touchLeft');
    const touchRight = this.shadowRoot.getElementById('touchRight');
    const touchJump = this.shadowRoot.getElementById('touchJump');
    const touchShoot = this.shadowRoot.getElementById('touchShoot');

    touchLeft.addEventListener('touchstart', (e) => { e.preventDefault(); this.gameState.keys.left = true; });
    touchLeft.addEventListener('touchend', (e) => { e.preventDefault(); this.gameState.keys.left = false; });

    touchRight.addEventListener('touchstart', (e) => { e.preventDefault(); this.gameState.keys.right = true; });
    touchRight.addEventListener('touchend', (e) => { e.preventDefault(); this.gameState.keys.right = false; });

    touchJump.addEventListener('touchstart', (e) => { e.preventDefault(); this.gameState.keys.jump = true; });
    touchJump.addEventListener('touchend', (e) => { e.preventDefault(); this.gameState.keys.jump = false; });

    touchShoot.addEventListener('touchstart', (e) => { e.preventDefault(); this.gameState.keys.shoot = true; });
    touchShoot.addEventListener('touchend', (e) => { e.preventDefault(); this.gameState.keys.shoot = false; });

    this.canvas.addEventListener('touchstart', (e) => {
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
    });

    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
    });

    this.canvas.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const diffX = touchEndX - this.touchStartX;
      const diffY = touchEndY - this.touchStartY;

      if (Math.abs(diffY) > Math.abs(diffX) && diffY < -30) {
        this.gameState.keys.jump = true;
        setTimeout(() => this.gameState.keys.jump = false, 100);
      }
    });
  }

  initGame() {
    this.gameState.player = {
      x: 50, y: 100, width: 20, height: 20,
      velocityY: 0, velocityX: 0, onGround: false,
      powered: false,
      canShoot: false,
      invincible: 0,
      animFrame: 0
    };
    this.gameState.keys = { left: false, right: false, jump: false, shoot: false };
    this.gameState.camera = { x: 0 };
    this.gameState.levelWidth = 3200;
    this.gameState.platforms = this.generateLevel(this.gameState.level);
    this.gameState.enemies = this.generateEnemies(this.gameState.level);
    this.gameState.coins = this.generateCoins(this.gameState.level);
    this.gameState.powerUps = this.generatePowerUps(this.gameState.level);
    this.gameState.flag = { x: this.gameState.levelWidth - 100, y: 280, height: 100 };
    this.gameState.projectiles = [];
    this.gameState.particles = [];
    this.gameState.gameOver = false;
    this.gameState.levelComplete = false;
    this.gameState.coinsCollected = 0;
    this.gameState.enemiesKilled = 0;
    this.gameState.animCounter = 0;
    this.gameOverScreen.style.display = 'none';
    this.levelCompleteScreen.style.display = 'none';
  }

  generateLevel(level) {
    const platforms = [];
    const levelWidth = 3200;

    // Ground
    platforms.push({ x: 0, y: 380, width: levelWidth, height: 20 });

    // Generate platforms going right
    for (let x = 200; x < levelWidth - 200; x += 180) {
      const height = 340 - Math.random() * 100;
      const width = 80 + Math.random() * 70;

      // Add platform
      platforms.push({
        x: x,
        y: height,
        width: width,
        height: 15
      });

      // Sometimes add a higher platform nearby
      if (Math.random() > 0.5 && x < levelWidth - 400) {
        platforms.push({
          x: x + 150,
          y: height - 80,
          width: 60,
          height: 15
        });
      }
    }

    // Add some gaps platforms for jumping
    for (let x = 800; x < levelWidth - 300; x += 400) {
      platforms.push({
        x: x,
        y: 280,
        width: 100,
        height: 15
      });
    }

    return platforms;
  }

  generateEnemies(level) {
    const enemies = [];
    const types = ['goomba', 'koopa', 'piranha'];
    const levelWidth = this.gameState.levelWidth;

    // Spread enemies across the level
    for (let x = 300; x < levelWidth - 200; x += 250) {
      const type = types[Math.floor(Math.random() * Math.min(level, 3))];
      enemies.push({
        x: x + Math.random() * 100,
        y: type === 'piranha' ? 320 : 340,
        width: 16,
        height: type === 'piranha' ? 24 : 16,
        velocityX: 0.8 + level * 0.1,
        direction: Math.random() > 0.5 ? 1 : -1,
        type: type,
        animFrame: 0,
        pipeY: 360
      });
    }

    return enemies;
  }

  generateCoins(level) {
    const coins = [];
    const levelWidth = this.gameState.levelWidth;
    const platforms = this.gameState.platforms;

    // Place coins on or near platforms
    for (const platform of platforms) {
      if (platform.y < 350 && platform.width > 50) {
        // Coins above the platform
        const numCoins = Math.floor(platform.width / 40);
        for (let i = 0; i < numCoins; i++) {
          coins.push({
            x: platform.x + 20 + i * 40,
            y: platform.y - 40,
            collected: false,
            animFrame: 0
          });
        }
      }
    }

    // Add some coin trails in the air (but reachable)
    for (let x = 400; x < levelWidth - 300; x += 200) {
      for (let i = 0; i < 5; i++) {
        coins.push({
          x: x + i * 30,
          y: 250,
          collected: false,
          animFrame: 0
        });
      }
    }

    return coins;
  }

  generatePowerUps(level) {
    const powerUps = [];
    const levelWidth = this.gameState.levelWidth;

    // Mushroom early in the level
    powerUps.push({
      x: 500,
      y: 330,
      type: 'mushroom',
      collected: false
    });

    // Flower in the middle
    if (level >= 1) {
      powerUps.push({
        x: levelWidth / 2,
        y: 250,
        type: 'flower',
        collected: false
      });
    }

    return powerUps;
  }

  setupControls() {
    document.addEventListener('keydown', (e) => {
      if (this.gameState.gameOver) return;

      if (e.key === 'k' || e.key === 'K') {
        this.gameState.keys.left = true;
      }

      if (e.key === 'l' || e.key === 'L') {
        this.gameState.keys.right = true;
      }

      if (e.key === ' ' || e.key === 'Spacebar' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        this.gameState.keys.jump = true;
      }

      if (e.key === 'x' || e.key === 'X' || e.key === 'Shift') {
        this.gameState.keys.shoot = true;
      }
    });

    document.addEventListener('keyup', (e) => {
      if (e.key === 'k' || e.key === 'K') {
        this.gameState.keys.left = false;
      }
      if (e.key === 'l' || e.key === 'L') {
        this.gameState.keys.right = false;
      }
      if (e.key === ' ' || e.key === 'Spacebar' || e.key === 'w' || e.key === 'W') {
        this.gameState.keys.jump = false;
      }
      if (e.key === 'x' || e.key === 'X' || e.key === 'Shift') {
        this.gameState.keys.shoot = false;
      }
    });
  }

  update() {
    if (this.gameState.gameOver || this.gameState.levelComplete) return;

    this.gameState.animCounter++;
    const player = this.gameState.player;
    const gravity = 0.5;
    const moveSpeed = 5;
    const airMoveSpeed = 4; // Better air control
    const jumpStrength = 12;

    // Shooting
    if (this.gameState.keys.shoot && player.canShoot && this.gameState.animCounter % 15 === 0) {
      this.shoot();
    }

    // Horizontal movement with better air control
    if (this.gameState.keys.left) {
      const speed = player.onGround ? -moveSpeed : -airMoveSpeed;
      player.velocityX = speed;
      player.animFrame = Math.floor(this.gameState.animCounter / 5) % 4;
    } else if (this.gameState.keys.right) {
      const speed = player.onGround ? moveSpeed : airMoveSpeed;
      player.velocityX = speed;
      player.animFrame = Math.floor(this.gameState.animCounter / 5) % 4;
    } else {
      // Friction (more on ground, less in air)
      player.velocityX *= player.onGround ? 0.7 : 0.9;
      player.animFrame = 0;
    }

    // Jumping
    if (this.gameState.keys.jump && player.onGround) {
      player.velocityY = -jumpStrength;
      player.onGround = false;
      this.sounds.jump();
    }

    // Apply gravity
    player.velocityY += gravity;

    // Update position
    player.x += player.velocityX;
    player.y += player.velocityY;

    // Boundary checks (left side)
    if (player.x < 0) player.x = 0;

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
      this.loseLife();
    }

    // Camera follows player (smooth)
    const targetCameraX = player.x - this.canvas.width / 3;
    this.gameState.camera.x += (targetCameraX - this.gameState.camera.x) * 0.1;

    // Camera bounds
    if (this.gameState.camera.x < 0) this.gameState.camera.x = 0;
    if (this.gameState.camera.x > this.gameState.levelWidth - this.canvas.width) {
      this.gameState.camera.x = this.gameState.levelWidth - this.canvas.width;
    }

    // Decrease invincibility
    if (player.invincible > 0) {
      player.invincible--;
    }

    // Update enemies
    for (const enemy of this.gameState.enemies) {
      if (enemy.type === 'piranha') {
        enemy.animFrame = (enemy.animFrame + 0.05) % (Math.PI * 2);
        enemy.y = enemy.pipeY - 20 + Math.sin(enemy.animFrame) * 15;
      } else {
        enemy.x += enemy.velocityX * enemy.direction;
        enemy.animFrame = Math.floor(this.gameState.animCounter / 10) % 2;

        // Bounce off platforms and edges
        if (enemy.x < 0 || enemy.x + enemy.width > this.gameState.levelWidth) {
          enemy.direction *= -1;
        }

        // Check platform edges
        for (const platform of this.gameState.platforms) {
          if (enemy.y + enemy.height >= platform.y - 5 && enemy.y + enemy.height <= platform.y + 5) {
            const atLeftEdge = enemy.x <= platform.x;
            const atRightEdge = enemy.x + enemy.width >= platform.x + platform.width;
            if (atLeftEdge || atRightEdge) {
              enemy.direction *= -1;
            }
          }
        }
      }

      // Check collision with player
      if (this.checkCollision(player, enemy) && player.invincible === 0) {
        if (player.velocityY > 0 && player.y + player.height - player.velocityY <= enemy.y + 5) {
          this.killEnemy(enemy);
          player.velocityY = -8;
        } else {
          this.playerHit();
        }
      }
    }

    // Update projectiles
    for (let i = this.gameState.projectiles.length - 1; i >= 0; i--) {
      const proj = this.gameState.projectiles[i];
      proj.x += proj.velocityX;
      proj.life--;

      if (proj.life <= 0 || proj.x < 0 || proj.x > this.gameState.levelWidth) {
        this.gameState.projectiles.splice(i, 1);
        continue;
      }

      for (const enemy of this.gameState.enemies) {
        if (this.checkCollision(proj, enemy)) {
          this.killEnemy(enemy);
          this.gameState.projectiles.splice(i, 1);
          break;
        }
      }
    }

    // Update particles
    for (let i = this.gameState.particles.length - 1; i >= 0; i--) {
      const p = this.gameState.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.3;
      p.life--;
      if (p.life <= 0) {
        this.gameState.particles.splice(i, 1);
      }
    }

    // Check coin collection
    for (const coin of this.gameState.coins) {
      if (!coin.collected) {
        coin.animFrame = (coin.animFrame + 0.1) % (Math.PI * 2);
        if (this.checkCollision(player, { x: coin.x - 8, y: coin.y - 8, width: 16, height: 16 })) {
          coin.collected = true;
          this.gameState.score += 50;
          this.gameState.coinsCollected++;
          this.sounds.coin();
          this.createParticles(coin.x, coin.y, '#FFD700', 5);
        }
      }
    }

    // Check power-up collection
    for (const powerUp of this.gameState.powerUps) {
      if (!powerUp.collected && this.checkCollision(player, { x: powerUp.x - 10, y: powerUp.y - 10, width: 20, height: 20 })) {
        powerUp.collected = true;
        this.sounds.powerUp();

        if (powerUp.type === 'mushroom') {
          player.powered = true;
          player.height = 30;
          this.gameState.score += 200;
          this.createParticles(powerUp.x, powerUp.y, '#FF0000', 10);
        } else if (powerUp.type === 'flower') {
          player.canShoot = true;
          this.gameState.score += 300;
          this.createParticles(powerUp.x, powerUp.y, '#FFA500', 10);
        }
      }
    }

    // Check flag collision (level completion)
    const flag = this.gameState.flag;
    if (player.x + player.width >= flag.x && player.x <= flag.x + 20) {
      if (player.y + player.height >= flag.y && player.y <= flag.y + flag.height) {
        this.completeLevel();
      }
    }

    // Update UI
    this.scoreElement.textContent = this.gameState.score;
    this.livesElement.textContent = this.gameState.lives;
    this.levelElement.textContent = this.gameState.level;
    this.coinsCollectedElement.textContent = this.gameState.coinsCollected;
  }

  shoot() {
    const player = this.gameState.player;
    this.gameState.projectiles.push({
      x: player.x + player.width,
      y: player.y + player.height / 2,
      width: 8,
      height: 8,
      velocityX: 8,
      life: 60
    });
    this.sounds.shoot();
  }

  killEnemy(enemy) {
    enemy.x = -100;
    this.gameState.score += 100;
    this.gameState.enemiesKilled++;
    this.sounds.stomp();
    this.createParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, '#8B4513', 8);
  }

  playerHit() {
    if (this.gameState.player.powered) {
      this.gameState.player.powered = false;
      this.gameState.player.height = 20;
      this.gameState.player.invincible = 120;
    } else if (this.gameState.player.canShoot) {
      this.gameState.player.canShoot = false;
      this.gameState.player.invincible = 120;
    } else {
      this.loseLife();
    }
  }

  loseLife() {
    this.gameState.lives--;
    this.sounds.die();

    if (this.gameState.lives <= 0) {
      this.endGame();
    } else {
      this.gameState.player.x = 50;
      this.gameState.player.y = 100;
      this.gameState.player.velocityX = 0;
      this.gameState.player.velocityY = 0;
      this.gameState.player.invincible = 120;
      this.gameState.camera.x = 0;
    }
  }

  createParticles(x, y, color, count) {
    for (let i = 0; i < count; i++) {
      this.gameState.particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        color: color,
        life: 30
      });
    }
  }

  completeLevel() {
    this.gameState.levelComplete = true;
    const bonus = this.gameState.lives * 500 + this.gameState.coinsCollected * 50;
    this.gameState.score += bonus;
    this.levelBonusElement.textContent = bonus;
    this.levelCompleteScreen.style.display = 'block';
    this.sounds.levelComplete();
  }

  nextLevel() {
    this.gameState.level++;
    this.gameState.levelComplete = false;
    this.levelCompleteScreen.style.display = 'none';
    this.gameState.camera = { x: 0 };
    this.gameState.platforms = this.generateLevel(this.gameState.level);
    this.gameState.enemies = this.generateEnemies(this.gameState.level);
    this.gameState.coins = this.generateCoins(this.gameState.level);
    this.gameState.powerUps = this.generatePowerUps(this.gameState.level);
    this.gameState.flag = { x: this.gameState.levelWidth - 100, y: 280, height: 100 };
    this.gameState.projectiles = [];
    this.gameState.particles = [];
    this.gameState.player.x = 50;
    this.gameState.player.y = 100;
    this.gameState.player.velocityX = 0;
    this.gameState.player.velocityY = 0;
  }

  checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  }

  draw() {
    const camera = this.gameState.camera;

    // Clear canvas
    this.ctx.fillStyle = '#87CEEB';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw clouds (parallax effect)
    this.drawCloud(100 - camera.x * 0.3, 50);
    this.drawCloud(400 - camera.x * 0.3, 80);
    this.drawCloud(700 - camera.x * 0.3, 40);
    this.drawCloud(1000 - camera.x * 0.3, 60);
    this.drawCloud(1400 - camera.x * 0.3, 90);

    // Save context and apply camera offset
    this.ctx.save();
    this.ctx.translate(-camera.x, 0);

    // Draw platforms
    for (const platform of this.gameState.platforms) {
      this.drawPlatform(platform);
    }

    // Draw flag
    this.drawFlag(this.gameState.flag);

    // Draw power-ups
    for (const powerUp of this.gameState.powerUps) {
      if (!powerUp.collected) {
        this.drawPowerUp(powerUp);
      }
    }

    // Draw coins
    for (const coin of this.gameState.coins) {
      if (!coin.collected) {
        this.drawCoin(coin.x, coin.y, coin.animFrame);
      }
    }

    // Draw enemies
    for (const enemy of this.gameState.enemies) {
      if (enemy.x > -50) {
        this.drawEnemy(enemy);
      }
    }

    // Draw projectiles
    for (const proj of this.gameState.projectiles) {
      this.drawProjectile(proj);
    }

    // Draw particles
    for (const p of this.gameState.particles) {
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(p.x, p.y, 3, 3);
    }

    // Draw player
    if (this.gameState.player.invincible === 0 || this.gameState.animCounter % 4 < 2) {
      this.drawPlayer(this.gameState.player);
    }

    // Restore context
    this.ctx.restore();
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

    this.ctx.fillStyle = '#8B4513';
    for (let x = platform.x; x < platform.x + platform.width; x += spacing) {
      for (let y = platform.y; y < platform.y + platform.height; y += spacing) {
        this.ctx.beginPath();
        this.ctx.arc(x + dotSize, y + dotSize, dotSize, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }

    this.ctx.fillStyle = '#228B22';
    for (let x = platform.x; x < platform.x + platform.width; x += spacing) {
      this.ctx.beginPath();
      this.ctx.arc(x + dotSize, platform.y + dotSize, dotSize, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  drawFlag(flag) {
    const dotSize = 2;
    const spacing = 3;

    // Pole
    this.ctx.fillStyle = '#654321';
    for (let y = flag.y; y < flag.y + flag.height; y += spacing) {
      this.ctx.beginPath();
      this.ctx.arc(flag.x + 10, y, dotSize, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // Flag
    this.ctx.fillStyle = '#FF0000';
    for (let x = flag.x + 12; x < flag.x + 50; x += spacing) {
      for (let y = flag.y; y < flag.y + 30; y += spacing) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, dotSize, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }

    // Checkered pattern
    this.ctx.fillStyle = '#FFFFFF';
    for (let x = flag.x + 12; x < flag.x + 50; x += spacing * 2) {
      for (let y = flag.y; y < flag.y + 30; y += spacing * 2) {
        if ((Math.floor((x - flag.x) / 6) + Math.floor((y - flag.y) / 6)) % 2 === 0) {
          this.ctx.beginPath();
          this.ctx.arc(x, y, dotSize, 0, Math.PI * 2);
          this.ctx.fill();
        }
      }
    }
  }

  drawPlayer(player) {
    const dotSize = 2;
    const spacing = 3;
    const bodyColor = player.canShoot ? '#FFA500' : '#FF0000';
    const height = player.powered ? 30 : 20;

    // Body
    this.ctx.fillStyle = bodyColor;
    for (let x = player.x + 4; x < player.x + player.width - 4; x += spacing) {
      for (let y = player.y + 8; y < player.y + height - 4; y += spacing) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, dotSize, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }

    // Head
    this.ctx.fillStyle = '#FFDBAC';
    for (let x = player.x + 6; x < player.x + player.width - 6; x += spacing) {
      for (let y = player.y + 2; y < player.y + 10; y += spacing) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, dotSize, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }

    // Hat
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

    if (enemy.type === 'goomba') {
      this.ctx.fillStyle = '#8B4513';
      for (let x = enemy.x; x < enemy.x + enemy.width; x += spacing) {
        for (let y = enemy.y; y < enemy.y + enemy.height; y += spacing) {
          this.ctx.beginPath();
          this.ctx.arc(x, y, dotSize, 0, Math.PI * 2);
          this.ctx.fill();
        }
      }

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
    } else if (enemy.type === 'koopa') {
      this.ctx.fillStyle = '#228B22';
      for (let x = enemy.x; x < enemy.x + enemy.width; x += spacing) {
        for (let y = enemy.y + 4; y < enemy.y + enemy.height; y += spacing) {
          this.ctx.beginPath();
          this.ctx.arc(x, y, dotSize, 0, Math.PI * 2);
          this.ctx.fill();
        }
      }

      this.ctx.fillStyle = '#FFFF00';
      for (let x = enemy.x + 4; x < enemy.x + 12; x += spacing) {
        for (let y = enemy.y; y < enemy.y + 8; y += spacing) {
          this.ctx.beginPath();
          this.ctx.arc(x, y, dotSize, 0, Math.PI * 2);
          this.ctx.fill();
        }
      }
    } else if (enemy.type === 'piranha') {
      this.ctx.fillStyle = '#228B22';
      for (let x = enemy.x - 4; x < enemy.x + enemy.width + 4; x += spacing) {
        for (let y = enemy.pipeY; y < 400; y += spacing) {
          this.ctx.beginPath();
          this.ctx.arc(x, y, dotSize, 0, Math.PI * 2);
          this.ctx.fill();
        }
      }

      this.ctx.fillStyle = '#FF0000';
      for (let x = enemy.x; x < enemy.x + enemy.width; x += spacing) {
        for (let y = enemy.y; y < enemy.y + 12; y += spacing) {
          this.ctx.beginPath();
          this.ctx.arc(x, y, dotSize, 0, Math.PI * 2);
          this.ctx.fill();
        }
      }

      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.beginPath();
      this.ctx.arc(enemy.x + 4, enemy.y + 4, 2, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.arc(enemy.x + 12, enemy.y + 4, 2, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  drawCoin(x, y, animFrame) {
    const dotSize = 2;
    const spacing = 3;
    const scale = 0.8 + Math.abs(Math.sin(animFrame)) * 0.4;

    this.ctx.fillStyle = '#FFD700';
    for (let dx = -6; dx <= 6; dx += spacing) {
      for (let dy = -6; dy <= 6; dy += spacing) {
        if (dx * dx + dy * dy <= 36) {
          this.ctx.beginPath();
          this.ctx.arc(x + dx * scale, y + dy, dotSize, 0, Math.PI * 2);
          this.ctx.fill();
        }
      }
    }

    this.ctx.fillStyle = '#FFA500';
    this.ctx.beginPath();
    this.ctx.arc(x, y, 2, 0, Math.PI * 2);
    this.ctx.fill();
  }

  drawPowerUp(powerUp) {
    const dotSize = 2;
    const spacing = 3;

    if (powerUp.type === 'mushroom') {
      this.ctx.fillStyle = '#FF0000';
      for (let x = powerUp.x - 8; x < powerUp.x + 8; x += spacing) {
        for (let y = powerUp.y - 8; y < powerUp.y; y += spacing) {
          this.ctx.beginPath();
          this.ctx.arc(x, y, dotSize, 0, Math.PI * 2);
          this.ctx.fill();
        }
      }

      this.ctx.fillStyle = '#FFDBAC';
      for (let x = powerUp.x - 3; x < powerUp.x + 3; x += spacing) {
        for (let y = powerUp.y; y < powerUp.y + 8; y += spacing) {
          this.ctx.beginPath();
          this.ctx.arc(x, y, dotSize, 0, Math.PI * 2);
          this.ctx.fill();
        }
      }

      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.beginPath();
      this.ctx.arc(powerUp.x - 4, powerUp.y - 4, 2, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.arc(powerUp.x + 4, powerUp.y - 4, 2, 0, Math.PI * 2);
      this.ctx.fill();
    } else if (powerUp.type === 'flower') {
      const petals = 6;
      this.ctx.fillStyle = '#FFA500';
      for (let i = 0; i < petals; i++) {
        const angle = (i / petals) * Math.PI * 2;
        const px = powerUp.x + Math.cos(angle) * 8;
        const py = powerUp.y + Math.sin(angle) * 8;

        for (let r = 0; r < 4; r++) {
          this.ctx.beginPath();
          this.ctx.arc(px, py, dotSize, 0, Math.PI * 2);
          this.ctx.fill();
        }
      }

      this.ctx.fillStyle = '#FFFF00';
      this.ctx.beginPath();
      this.ctx.arc(powerUp.x, powerUp.y, 4, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  drawProjectile(proj) {
    this.ctx.fillStyle = '#FFA500';
    this.ctx.beginPath();
    this.ctx.arc(proj.x, proj.y, 4, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = 'rgba(255, 165, 0, 0.5)';
    this.ctx.beginPath();
    this.ctx.arc(proj.x - 4, proj.y, 3, 0, Math.PI * 2);
    this.ctx.fill();
  }

  endGame() {
    this.gameState.gameOver = true;
    this.finalScoreElement.textContent = this.gameState.score;
    this.finalLevelElement.textContent = this.gameState.level;
    this.gameOverScreen.style.display = 'block';
  }

  restartGame() {
    this.gameState.level = 1;
    this.gameState.score = 0;
    this.gameState.lives = 3;
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
console.info('%c🎮 MARIO-GAME-CARD %cEnhanced version registered!', 'color: red; font-weight: bold', 'color: green');

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'mario-game-card',
  name: 'Mario Game Card',
  description: 'Klasická Mario hra s horizontálním scrollováním, power-upy, zvuky a mobilním ovládáním'
});
console.info('%c🎮 MARIO-GAME-CARD %cRegistered in window.customCards', 'color: red; font-weight: bold', 'color: green');
