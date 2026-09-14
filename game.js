// --- FINGER CLASH ARCADE: Multi-Game Engine ---

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let width = window.innerWidth;
let height = window.innerHeight;

function resizeCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// ==========================================================================
// 🔊 PROCEDURAL AUDIO SYNTHESIZER (Web Audio API)
// ==========================================================================
class SoundController {
  constructor() {
    this.ctx = null;
  }
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }
  playClick() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }
  playDash() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(450, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }
  playHit(power = 1) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.25);
    gain.gain.setValueAtTime(Math.min(0.7, 0.25 * power), this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }
  playGoal() {
    if (!this.ctx) return;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.08);
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + i * 0.08 + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + i * 0.08);
      osc.stop(this.ctx.currentTime + i * 0.08 + 0.35);
    });
  }
  playLaser() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }
  playRicochet() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }
  playTapSignal() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }
  playFault() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(80, this.ctx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }
  playExplosion() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(100, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.4);
    gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.4);
  }
  playWin() {
    if (!this.ctx) return;
    const chords = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    chords.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.12);
      gain.gain.setValueAtTime(0.25, this.ctx.currentTime + idx * 0.12);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + idx * 0.12 + 0.5);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + idx * 0.12);
      osc.stop(this.ctx.currentTime + idx * 0.12 + 0.5);
    });
  }
}

const sounds = new SoundController();

// ==========================================================================
// 🌟 VISUAL FX ENGINE (PARTICLES, SHAKES, SHOCKWAVES)
// ==========================================================================
let particles = [];
let shockwaves = [];
let screenShake = 0;

function addScreenShake(amount) {
  screenShake = Math.max(screenShake, amount);
}

function createShockwave(x, y, color = '#ffffff', maxRadius = 120) {
  shockwaves.push({ x, y, radius: 10, maxRadius, alpha: 0.6, color });
}

function createSparks(x, y, color = '#5eead4', count = 14, speed = 4.5) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const spd = (Math.random() * 0.7 + 0.3) * speed;
    particles.push({
      x, y,
      vx: Math.cos(angle) * spd,
      vy: Math.sin(angle) * spd,
      size: Math.random() * 2.8 + 1.8,
      color,
      alpha: 0.85,
      decay: Math.random() * 0.03 + 0.02
    });
  }
}

function updateAndDrawEffects() {
  // Shockwaves
  for (let i = shockwaves.length - 1; i >= 0; i--) {
    const sw = shockwaves[i];
    sw.radius += (sw.maxRadius - sw.radius) * 0.15 + 1.5;
    sw.alpha -= 0.035;
    if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
      shockwaves.splice(i, 1);
      continue;
    }
    ctx.save();
    ctx.beginPath();
    ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
    ctx.strokeStyle = sw.color;
    ctx.globalAlpha = Math.max(0, sw.alpha);
    ctx.lineWidth = 4 * sw.alpha;
    ctx.stroke();
    ctx.restore();
  }

  // Particles
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.96;
    p.vy *= 0.96;
    p.alpha -= p.decay;
    if (p.alpha <= 0) {
      particles.splice(i, 1);
      continue;
    }
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.alpha);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// ==========================================================================
// 🕹️ GAME STATE & TOURNAMENT MANAGER
// ==========================================================================
let currentGameId = null; // 'sumo' | 'soccer' | 'tanks' | 'tap'
let currentMiniGame = null;
let p1Wins = 0;
let p2Wins = 0;
let targetWins = 5;

// DOM Elements
const mainMenuEl = document.getElementById('main-menu');
const matchModalEl = document.getElementById('match-over-modal');
const matchWinnerNameEl = document.getElementById('match-winner-name');
const matchScoreSummaryEl = document.getElementById('match-score-summary');
const announcerEl = document.getElementById('round-announcer');
const p1ScoreEl = document.getElementById('p1-score');
const p2ScoreEl = document.getElementById('p2-score');
const p1HintEl = document.getElementById('p1-hint');
const p2HintEl = document.getElementById('p2-hint');
const menuBtnEl = document.getElementById('menu-btn');
const btnPlayAgain = document.getElementById('btn-play-again');
const btnBackToMenu = document.getElementById('btn-back-to-menu');
const randomGameBtn = document.getElementById('random-game-btn');

function updateScoreHUD() {
  p1ScoreEl.innerHTML = '';
  p2ScoreEl.innerHTML = '';
  for (let i = 0; i < targetWins; i++) {
    const d1 = document.createElement('span');
    d1.className = 'dot' + (i < p1Wins ? ' active' : '');
    p1ScoreEl.appendChild(d1);

    const d2 = document.createElement('span');
    d2.className = 'dot' + (i < p2Wins ? ' active' : '');
    p2ScoreEl.appendChild(d2);
  }
}

function announce(text, duration = 1200) {
  announcerEl.innerText = text;
  announcerEl.classList.remove('hidden');
  if (duration > 0) {
    setTimeout(() => {
      announcerEl.classList.add('hidden');
    }, duration);
  }
}

function openMainMenu() {
  sounds.playClick();
  if (currentMiniGame && currentMiniGame.destroy) {
    currentMiniGame.destroy();
  }
  currentMiniGame = null;
  currentGameId = null;
  mainMenuEl.classList.remove('hidden');
  matchModalEl.classList.add('hidden');
  announcerEl.classList.add('hidden');
}

function startMatch(gameId) {
  sounds.init();
  sounds.playClick();
  currentGameId = gameId;
  p1Wins = 0;
  p2Wins = 0;
  updateScoreHUD();
  mainMenuEl.classList.add('hidden');
  matchModalEl.classList.add('hidden');

  loadMiniGame(gameId);
}

function checkMatchOver() {
  if (p1Wins >= targetWins || p2Wins >= targetWins) {
    sounds.playWin();
    const winnerName = p1Wins >= targetWins ? 'PLAYER 1 ПОБЕДИЛ!' : 'PLAYER 2 ПОБЕДИЛ!';
    matchWinnerNameEl.innerText = winnerName;
    matchWinnerNameEl.style.color = p1Wins >= targetWins ? '#00e5ff' : '#ff4b2b';
    matchScoreSummaryEl.innerText = `${p1Wins} : ${p2Wins}`;
    matchModalEl.classList.remove('hidden');
    return true;
  }
  return false;
}

function onRoundWon(playerNum, title = '') {
  if (playerNum === 1) p1Wins++;
  else if (playerNum === 2) p2Wins++;

  updateScoreHUD();
  createShockwave(width / 2, height / 2, playerNum === 1 ? '#5eead4' : '#fda4af', 240);
  addScreenShake(12);

  const roundName = title || (playerNum === 1 ? 'РАУНД: ИГРОК 1 🎯' : 'РАУНД: ИГРОК 2 🎯');
  announce(roundName, 1300);

  setTimeout(() => {
    if (!checkMatchOver() && currentMiniGame) {
      currentMiniGame.resetRound();
    }
  }, 1400);
}

// Menu and selector listeners
menuBtnEl.addEventListener('click', () => {
  openMainMenu();
});

document.querySelectorAll('.round-chip').forEach(btn => {
  btn.addEventListener('click', (e) => {
    sounds.init();
    sounds.playClick();
    document.querySelectorAll('.round-chip').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    targetWins = parseInt(btn.dataset.target, 10);
    updateScoreHUD();
  });
});

document.querySelectorAll('.game-card').forEach(card => {
  card.addEventListener('click', () => {
    const gameId = card.dataset.game;
    startMatch(gameId);
  });
});

randomGameBtn.addEventListener('click', () => {
  const games = ['soccer', 'tanks', 'tug', 'pong', 'cowboy', 'knife', 'snake', 'bomb', 'tap', 'dobble'];
  const pick = games[Math.floor(Math.random() * games.length)];
  startMatch(pick);
});

btnPlayAgain.addEventListener('click', () => {
  if (currentGameId) startMatch(currentGameId);
});

btnBackToMenu.addEventListener('click', () => {
  openMainMenu();
});

// ==========================================================================
// ⚽ MINI-GAME 2: NEON SOCCER (Air-Hockey / Pong Style)
// ==========================================================================
class SoccerMiniGame {
  constructor() {
    this.name = 'soccer';
    p1HintEl.innerText = 'Веди фишку и забивай в верхние ворота! ⚽';
    p2HintEl.innerText = 'Веди фишку и забивай в нижние ворота! ⚽';

    this.isRoundOver = false;
    this.goalWidth = Math.min(width * 0.46, 220);
    this.initPitch();
    this.bindTouch();
    announce('МАТЧ НАЧАЛСЯ! ⚽', 1000);
  }

  initPitch() {
    const pr = Math.min(width, height) * 0.056;
    this.p1 = { x: width / 2, y: height * 0.8, vx: 0, vy: 0, radius: pr, color: '#5eead4', touchId: null };
    this.p2 = { x: width / 2, y: height * 0.2, vx: 0, vy: 0, radius: pr, color: '#fda4af', touchId: null };
    this.ball = {
      x: width / 2, y: height / 2,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() > 0.5 ? 1 : -1) * 5,
      radius: Math.min(width, height) * 0.038,
      color: '#f8fafc'
    };
  }

  resetRound() {
    this.isRoundOver = false;
    this.initPitch();
  }

  bindTouch() {
    this.handleStart = (e) => {
      sounds.init();
      const touches = e.changedTouches ? Array.from(e.changedTouches) : [e];
      touches.forEach(t => {
        const id = t.identifier !== undefined ? t.identifier : 'mouse';
        if (t.clientY > height / 2 && this.p1.touchId === null) {
          this.p1.touchId = id;
          this.p1.targetX = t.clientX;
          this.p1.targetY = t.clientY;
        } else if (t.clientY <= height / 2 && this.p2.touchId === null) {
          this.p2.touchId = id;
          this.p2.targetX = t.clientX;
          this.p2.targetY = t.clientY;
        }
      });
    };

    this.handleMove = (e) => {
      const touches = e.changedTouches ? Array.from(e.changedTouches) : [e];
      touches.forEach(t => {
        const id = t.identifier !== undefined ? t.identifier : 'mouse';
        if (this.p1.touchId === id) {
          this.p1.targetX = t.clientX;
          this.p1.targetY = Math.max(height * 0.52, t.clientY);
        }
        if (this.p2.touchId === id) {
          this.p2.targetX = t.clientX;
          this.p2.targetY = Math.min(height * 0.48, t.clientY);
        }
      });
    };

    this.handleEnd = (e) => {
      const touches = e.changedTouches ? Array.from(e.changedTouches) : [e];
      touches.forEach(t => {
        const id = t.identifier !== undefined ? t.identifier : 'mouse';
        if (this.p1.touchId === id) this.p1.touchId = null;
        if (this.p2.touchId === id) this.p2.touchId = null;
      });
    };

    window.addEventListener('touchstart', this.handleStart, { passive: false });
    window.addEventListener('touchmove', this.handleMove, { passive: false });
    window.addEventListener('touchend', this.handleEnd, { passive: false });
    window.addEventListener('mousedown', this.handleStart);
    window.addEventListener('mousemove', this.handleMove);
    window.addEventListener('mouseup', this.handleEnd);
  }

  destroy() {
    window.removeEventListener('touchstart', this.handleStart);
    window.removeEventListener('touchmove', this.handleMove);
    window.removeEventListener('touchend', this.handleEnd);
    window.removeEventListener('mousedown', this.handleStart);
    window.removeEventListener('mousemove', this.handleMove);
    window.removeEventListener('mouseup', this.handleEnd);
  }

  update() {
    if (this.isRoundOver) return;

    // Smooth movement towards touch position
    [this.p1, this.p2].forEach(p => {
      if (p.targetX !== undefined) {
        const dx = p.targetX - p.x;
        const dy = p.targetY - p.y;
        p.vx = dx * 0.28;
        p.vy = dy * 0.28;
        p.x += p.vx;
        p.y += p.vy;
      }
      p.x = Math.max(p.radius, Math.min(width - p.radius, p.x));
    });

    // P1 restricted to bottom, P2 to top
    this.p1.y = Math.max(height * 0.52, Math.min(height - this.p1.radius - 8, this.p1.y));
    this.p2.y = Math.min(height * 0.48, Math.max(this.p2.radius + 8, this.p2.y));

    // Ball physics
    const b = this.ball;
    b.x += b.vx;
    b.y += b.vy;
    b.vx *= 0.988;
    b.vy *= 0.988;

    // Ball side walls
    if (b.x - b.radius < 10) {
      b.x = 10 + b.radius;
      b.vx = Math.abs(b.vx) * 0.95;
      sounds.playRicochet();
      createSparks(b.x, b.y, '#fff', 6, 4);
    } else if (b.x + b.radius > width - 10) {
      b.x = width - 10 - b.radius;
      b.vx = -Math.abs(b.vx) * 0.95;
      sounds.playRicochet();
      createSparks(b.x, b.y, '#fff', 6, 4);
    }

    // Ball collision with players
    [this.p1, this.p2].forEach(p => {
      const dx = b.x - p.x;
      const dy = b.y - p.y;
      const dist = Math.hypot(dx, dy);
      const minDist = b.radius + p.radius;

      if (dist < minDist && dist > 0) {
        const nx = dx / dist;
        const ny = dy / dist;
        b.x = p.x + nx * minDist;
        b.y = p.y + ny * minDist;

        const impulse = 12 + Math.hypot(p.vx, p.vy) * 0.8;
        b.vx = nx * impulse;
        b.vy = ny * impulse;

        sounds.playHit(1.2);
        createSparks(b.x, b.y, p.color, 12, 6);
        addScreenShake(6);
      }
    });

    // Top / Bottom walls & Goal checking
    const goalLeft = (width - this.goalWidth) / 2;
    const goalRight = (width + this.goalWidth) / 2;

    // Top goal (P2 side) -> P1 scores
    if (b.y - b.radius <= 10) {
      if (b.x >= goalLeft && b.x <= goalRight) {
        this.isRoundOver = true;
        sounds.playGoal();
        createShockwave(b.x, b.y, '#00e5ff', 240);
        onRoundWon(1, 'ГОЛ! ИГРОК 1 ⚽🔥');
      } else {
        b.y = 10 + b.radius;
        b.vy = Math.abs(b.vy) * 0.9;
        sounds.playRicochet();
      }
    }

    // Bottom goal (P1 side) -> P2 scores
    if (b.y + b.radius >= height - 10) {
      if (b.x >= goalLeft && b.x <= goalRight) {
        this.isRoundOver = true;
        sounds.playGoal();
        createShockwave(b.x, b.y, '#ff4b2b', 240);
        onRoundWon(2, 'ГОЛ! ИГРОК 2 ⚽🔥');
      } else {
        b.y = height - 10 - b.radius;
        b.vy = -Math.abs(b.vy) * 0.9;
        sounds.playRicochet();
      }
    }
  }

  draw() {
    // Pitch lines
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    // Center circle
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, Math.min(width, height) * 0.2, 0, Math.PI * 2);
    ctx.stroke();

    // Goals
    const gw = this.goalWidth;
    const gl = (width - gw) / 2;
    // Top goal (Peach side)
    ctx.fillStyle = 'rgba(253, 164, 175, 0.2)';
    ctx.fillRect(gl, 4, gw, 14);
    ctx.strokeStyle = '#fda4af';
    ctx.lineWidth = 3;
    ctx.strokeRect(gl, 4, gw, 14);

    // Bottom goal (Mint side)
    ctx.fillStyle = 'rgba(94, 234, 212, 0.2)';
    ctx.fillRect(gl, height - 18, gw, 14);
    ctx.strokeStyle = '#5eead4';
    ctx.lineWidth = 3;
    ctx.strokeRect(gl, height - 18, gw, 14);
    ctx.restore();

    // Ball
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#00e5ff';
    ctx.shadowBlur = 18;
    ctx.fill();

    ctx.font = `${Math.floor(this.ball.radius * 1.5)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⚽', this.ball.x, this.ball.y);
    ctx.restore();

    // Players
    [this.p1, this.p2].forEach(p => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 20;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * 0.55, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.restore();
    });
  }
}

// ==========================================================================
// 🔫 MINI-GAME 3: LASER TANKS (Tactical ricocheting bullets)
// ==========================================================================
class TanksMiniGame {
  constructor() {
    this.name = 'tanks';
    p1HintEl.innerText = 'Тапай для движения, кнопка ОГОНЬ 💥';
    p2HintEl.innerText = 'Тапай для движения, кнопка ОГОНЬ 💥';

    this.isRoundOver = false;
    this.bullets = [];
    this.obstacles = [];
    this.initMap();
    this.initTanks();
    this.bindTouch();
    announce('БОЙ НАЧАЛСЯ! 🔫', 1000);
  }

  initMap() {
    this.obstacles = [
      { x: width * 0.25, y: height * 0.42, w: width * 0.18, h: height * 0.16 },
      { x: width * 0.57, y: height * 0.42, w: width * 0.18, h: height * 0.16 }
    ];
  }

  initTanks() {
    const size = Math.min(width, height) * 0.08;
    this.p1 = {
      x: width / 2, y: height * 0.82, angle: -Math.PI / 2, size,
      color: '#5eead4', reload: 0, touchId: null
    };
    this.p2 = {
      x: width / 2, y: height * 0.18, angle: Math.PI / 2, size,
      color: '#fda4af', reload: 0, touchId: null
    };
  }

  resetRound() {
    this.isRoundOver = false;
    this.bullets = [];
    this.initTanks();
  }

  bindTouch() {
    this.fireButtons = {
      p1: { x: width - 60, y: height - 60, r: 42 },
      p2: { x: 60, y: 60, r: 42 }
    };

    this.handleStart = (e) => {
      sounds.init();
      const touches = e.changedTouches ? Array.from(e.changedTouches) : [e];
      touches.forEach(t => {
        const id = t.identifier !== undefined ? t.identifier : 'mouse';
        const tx = t.clientX;
        const ty = t.clientY;

        // Check P1 fire button
        if (Math.hypot(tx - this.fireButtons.p1.x, ty - this.fireButtons.p1.y) < this.fireButtons.p1.r + 15) {
          this.shoot(this.p1);
          return;
        }
        // Check P2 fire button
        if (Math.hypot(tx - this.fireButtons.p2.x, ty - this.fireButtons.p2.y) < this.fireButtons.p2.r + 15) {
          this.shoot(this.p2);
          return;
        }

        // Otherwise drive tank
        if (ty > height / 2) {
          this.p1.targetX = tx;
          this.p1.targetY = ty;
          this.p1.isMoving = true;
          this.p1.touchId = id;
        } else {
          this.p2.targetX = tx;
          this.p2.targetY = ty;
          this.p2.isMoving = true;
          this.p2.touchId = id;
        }
      });
    };

    this.handleMove = (e) => {
      const touches = e.changedTouches ? Array.from(e.changedTouches) : [e];
      touches.forEach(t => {
        const id = t.identifier !== undefined ? t.identifier : 'mouse';
        if (this.p1.touchId === id) {
          this.p1.targetX = t.clientX;
          this.p1.targetY = t.clientY;
        }
        if (this.p2.touchId === id) {
          this.p2.targetX = t.clientX;
          this.p2.targetY = t.clientY;
        }
      });
    };

    this.handleEnd = (e) => {
      const touches = e.changedTouches ? Array.from(e.changedTouches) : [e];
      touches.forEach(t => {
        const id = t.identifier !== undefined ? t.identifier : 'mouse';
        if (this.p1.touchId === id) { this.p1.isMoving = false; this.p1.touchId = null; }
        if (this.p2.touchId === id) { this.p2.isMoving = false; this.p2.touchId = null; }
      });
    };

    window.addEventListener('touchstart', this.handleStart, { passive: false });
    window.addEventListener('touchmove', this.handleMove, { passive: false });
    window.addEventListener('touchend', this.handleEnd, { passive: false });
    window.addEventListener('mousedown', this.handleStart);
    window.addEventListener('mousemove', this.handleMove);
    window.addEventListener('mouseup', this.handleEnd);
  }

  destroy() {
    window.removeEventListener('touchstart', this.handleStart);
    window.removeEventListener('touchmove', this.handleMove);
    window.removeEventListener('touchend', this.handleEnd);
    window.removeEventListener('mousedown', this.handleStart);
    window.removeEventListener('mousemove', this.handleMove);
    window.removeEventListener('mouseup', this.handleEnd);
  }

  shoot(tank) {
    if (tank.reload > 0 || this.isRoundOver) return;
    tank.reload = 22; // cooldown frames
    const barrelLen = tank.size * 0.7;
    const bx = tank.x + Math.cos(tank.angle) * barrelLen;
    const by = tank.y + Math.sin(tank.angle) * barrelLen;
    const spd = 9;

    this.bullets.push({
      x: bx, y: by,
      vx: Math.cos(tank.angle) * spd,
      vy: Math.sin(tank.angle) * spd,
      bounces: 2,
      owner: tank,
      color: tank.color,
      radius: 5
    });

    sounds.playLaser();
    createSparks(bx, by, tank.color, 8, 4);
  }

  update() {
    if (this.isRoundOver) return;

    // Update tanks
    [this.p1, this.p2].forEach(p => {
      if (p.reload > 0) p.reload--;
      if (p.isMoving && p.targetX !== undefined) {
        const dx = p.targetX - p.x;
        const dy = p.targetY - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 10) {
          const targetAngle = Math.atan2(dy, dx);
          // Smooth rotation
          let diff = targetAngle - p.angle;
          while (diff < -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;
          p.angle += diff * 0.18;

          p.x += Math.cos(p.angle) * 3.8;
          p.y += Math.sin(p.angle) * 3.8;
        }
      }

      p.x = Math.max(p.size, Math.min(width - p.size, p.x));
      p.y = Math.max(p.size, Math.min(height - p.size, p.y));
    });

    // Update bullets
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      b.x += b.vx;
      b.y += b.vy;

      // Screen border ricochets
      if (b.x < b.radius || b.x > width - b.radius) {
        b.vx *= -1;
        b.bounces--;
        sounds.playRicochet();
        createSparks(b.x, b.y, b.color, 6, 3);
      }
      if (b.y < b.radius || b.y > height - b.radius) {
        b.vy *= -1;
        b.bounces--;
        sounds.playRicochet();
        createSparks(b.x, b.y, b.color, 6, 3);
      }

      // Obstacle ricochets
      this.obstacles.forEach(obs => {
        if (b.x > obs.x && b.x < obs.x + obs.w && b.y > obs.y && b.y < obs.y + obs.h) {
          b.vx *= -1;
          b.vy *= -1;
          b.bounces--;
          sounds.playRicochet();
          createSparks(b.x, b.y, '#fff', 8, 4);
        }
      });

      if (b.bounces < 0) {
        this.bullets.splice(i, 1);
        continue;
      }

      // Check hit tanks
      const d1 = Math.hypot(b.x - this.p1.x, b.y - this.p1.y);
      const d2 = Math.hypot(b.x - this.p2.x, b.y - this.p2.y);

      if (d1 < this.p1.size * 0.6) {
        this.isRoundOver = true;
        sounds.playExplosion();
        createShockwave(this.p1.x, this.p1.y, '#ff4b2b', 200);
        createSparks(this.p1.x, this.p1.y, '#ff4b2b', 30, 8);
        onRoundWon(2, 'ПОПАДАНИЕ! ИГРОК 2 💥');
        break;
      }
      if (d2 < this.p2.size * 0.6) {
        this.isRoundOver = true;
        sounds.playExplosion();
        createShockwave(this.p2.x, this.p2.y, '#00e5ff', 200);
        createSparks(this.p2.x, this.p2.y, '#00e5ff', 30, 8);
        onRoundWon(1, 'ПОПАДАНИЕ! ИГРОК 1 💥');
        break;
      }
    }
  }

  draw() {
    // Obstacles
    ctx.save();
    this.obstacles.forEach(obs => {
      ctx.fillStyle = '#161c2e';
      ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2;
      ctx.strokeRect(obs.x, obs.y, obs.w, obs.h);
    });
    ctx.restore();

    // Fire buttons
    ctx.save();
    // P1 Fire Button (bottom right)
    ctx.beginPath();
    ctx.arc(this.fireButtons.p1.x, this.fireButtons.p1.y, this.fireButtons.p1.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(94, 234, 212, 0.18)';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#5eead4';
    ctx.stroke();
    ctx.font = '22px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🔥', this.fireButtons.p1.x, this.fireButtons.p1.y);

    // P2 Fire Button (top left - rotated)
    ctx.beginPath();
    ctx.arc(this.fireButtons.p2.x, this.fireButtons.p2.y, this.fireButtons.p2.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(253, 164, 175, 0.18)';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#fda4af';
    ctx.stroke();
    ctx.fillText('🔥', this.fireButtons.p2.x, this.fireButtons.p2.y);
    ctx.restore();

    // Bullets
    this.bullets.forEach(b => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fillStyle = b.color;
      ctx.shadowColor = b.color;
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.restore();
    });

    // Draw Tanks
    [this.p1, this.p2].forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);

      // Tank Body
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 14;
      ctx.fillRect(-p.size * 0.45, -p.size * 0.35, p.size * 0.9, p.size * 0.7);

      // Tracks
      ctx.fillStyle = '#0e1320';
      ctx.fillRect(-p.size * 0.5, -p.size * 0.45, p.size, p.size * 0.15);
      ctx.fillRect(-p.size * 0.5, p.size * 0.3, p.size, p.size * 0.15);

      // Barrel
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, -p.size * 0.1, p.size * 0.65, p.size * 0.2);

      ctx.restore();
    });
  }
}

// ==========================================================================
// ⚡ MINI-GAME 4: FAST TAP DUEL (Reaction speed battle)
// ==========================================================================
class TapMiniGame {
  constructor() {
    this.name = 'tap';
    p1HintEl.innerText = 'Жди зелёный свет! Фальстарт = проигрыш ⚠️';
    p2HintEl.innerText = 'Жди зелёный свет! Фальстарт = проигрыш ⚠️';

    this.isRoundOver = false;
    this.state = 'WAITING'; // 'WAITING' | 'READY' | 'FINISHED'
    this.timer = null;
    this.scheduleSignal();
    this.bindTouch();
  }

  scheduleSignal() {
    this.state = 'WAITING';
    announce('ВНИМАНИЕ... 🛑', 0);
    // Random delay between 1.8s and 4.2s
    const delay = 1800 + Math.random() * 2400;
    this.timer = setTimeout(() => {
      if (this.state === 'WAITING') {
        this.state = 'READY';
        sounds.playTapSignal();
        addScreenShake(8);
        announce('БЕЙ! ⚡⚡⚡', 0);
      }
    }, delay);
  }

  resetRound() {
    this.isRoundOver = false;
    if (this.timer) clearTimeout(this.timer);
    this.scheduleSignal();
  }

  bindTouch() {
    this.handleTap = (e) => {
      sounds.init();
      if (this.isRoundOver) return;
      const touches = e.changedTouches ? Array.from(e.changedTouches) : [e];

      touches.forEach(t => {
        const isP1 = t.clientY > height / 2;
        const playerNum = isP1 ? 1 : 2;

        if (this.state === 'WAITING') {
          // False start! Opponent gets the point
          this.isRoundOver = true;
          if (this.timer) clearTimeout(this.timer);
          sounds.playFault();
          createShockwave(t.clientX, t.clientY, '#ff0055', 180);
          const rival = playerNum === 1 ? 2 : 1;
          onRoundWon(rival, `ФАЛЬСТАРТ! ИГРОК ${rival} +1 🚫`);
        } else if (this.state === 'READY') {
          // Winner of the reaction!
          this.isRoundOver = true;
          this.state = 'FINISHED';
          sounds.playHit(1.5);
          createShockwave(t.clientX, t.clientY, playerNum === 1 ? '#00e5ff' : '#ff4b2b', 250);
          createSparks(t.clientX, t.clientY, '#fff', 25, 8);
          onRoundWon(playerNum, `РЕАКЦИЯ! ИГРОК ${playerNum} ⚡`);
        }
      });
    };

    window.addEventListener('touchstart', this.handleTap, { passive: false });
    window.addEventListener('mousedown', this.handleTap);
  }

  destroy() {
    if (this.timer) clearTimeout(this.timer);
    window.removeEventListener('touchstart', this.handleTap);
    window.removeEventListener('mousedown', this.handleTap);
  }

  update() {
    // Dynamic animations if needed
  }

  draw() {
    // Fill halves based on state with soft translucent colors
    if (this.state === 'WAITING') {
      ctx.fillStyle = 'rgba(244, 63, 94, 0.08)';
      ctx.fillRect(0, 0, width, height);
    } else if (this.state === 'READY') {
      ctx.fillStyle = 'rgba(16, 185, 129, 0.16)';
      ctx.fillRect(0, 0, width, height);
    }

    // Huge center reaction symbol
    ctx.save();
    ctx.font = `${Math.min(width, height) * 0.28}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.state === 'READY' ? '⚡' : '🛑', width / 2, height / 2);
    ctx.restore();
  }
}

// ==========================================================================
// 🃏 MINI-GAME 5: MEMORY (НАЙДИ ПАРУ - 20 КАРТОЧЕК, 10 ПАР)
// ==========================================================================
class DobbleMiniGame {
  constructor() {
    this.name = 'dobble';
    this.isRoundOver = false;

    this.symbolsPool = [
      '🍎', '🚀', '⭐', '🍕', '🐱', '🎸', '⚽', '💎', '🌈', '🌵',
      '🍩', '🎲', '🛸', '🍉', '🍄', '🍦', '🍒', '🦁', '⚡', '👑'
    ];

    this.currentTurn = 1; // 1 = Player 1, 2 = Player 2
    this.flippedIndices = [];
    this.matchedPairsCount = 0;
    this.lockBoard = false;

    this.initBoard();
    this.bindTouch();
    this.updateTurnHints();
    announce('ХОД: ИГРОК 1 🃏', 1000);
  }

  updateTurnHints() {
    if (this.currentTurn === 1) {
      p1HintEl.innerText = '👉 Твой ход! Открой 2 карточки';
      p2HintEl.innerText = 'Жди ход соперника...';
    } else {
      p1HintEl.innerText = 'Жди ход соперника...';
      p2HintEl.innerText = '👉 Твой ход! Открой 2 карточки';
    }
  }

  initBoard() {
    this.matchedPairsCount = 0;
    this.flippedIndices = [];
    this.lockBoard = false;
    this.isRoundOver = false;

    // Pick 10 unique symbols from pool
    const selected = [...this.symbolsPool].sort(() => Math.random() - 0.5).slice(0, 10);
    // Duplicate each to make 20 cards (10 pairs)
    const deck = [...selected, ...selected].sort(() => Math.random() - 0.5);

    // Layout: 4 columns x 5 rows = 20 cards
    this.cols = 4;
    this.rows = 5;

    // Calculate grid size to fit comfortably on screen
    const gridPaddingX = 20;
    const topMargin = height * 0.14;
    const bottomMargin = height * 0.14;
    const availableWidth = width - gridPaddingX * 2;
    const availableHeight = height - topMargin - bottomMargin;

    const cellW = availableWidth / this.cols;
    const cellH = availableHeight / this.rows;
    const cardW = Math.min(cellW * 0.86, 75);
    const cardH = Math.min(cellH * 0.86, 85);

    this.cards = deck.map((symbol, idx) => {
      const col = idx % this.cols;
      const row = Math.floor(idx / this.cols);
      const cx = gridPaddingX + col * cellW + cellW / 2;
      const cy = topMargin + row * cellH + cellH / 2;

      return {
        id: idx,
        symbol,
        x: cx - cardW / 2,
        y: cy - cardH / 2,
        w: cardW,
        h: cardH,
        isFlipped: false,
        isMatched: false,
        matchedBy: null,
        flipProgress: 0 // 0 = back, 1 = face
      };
    });
  }

  resetRound() {
    this.initBoard();
    this.updateTurnHints();
  }

  bindTouch() {
    this.handleTap = (e) => {
      sounds.init();
      if (this.isRoundOver || this.lockBoard) return;

      const touches = e.changedTouches ? Array.from(e.changedTouches) : [e];
      touches.forEach(t => {
        const tx = t.clientX;
        const ty = t.clientY;

        for (let i = 0; i < this.cards.length; i++) {
          const c = this.cards[i];
          if (tx >= c.x && tx <= c.x + c.w && ty >= c.y && ty <= c.y + c.h) {
            this.onCardClick(i);
            break;
          }
        }
      });
    };

    window.addEventListener('touchstart', this.handleTap, { passive: false });
    window.addEventListener('mousedown', this.handleTap);
  }

  destroy() {
    window.removeEventListener('touchstart', this.handleTap);
    window.removeEventListener('mousedown', this.handleTap);
  }

  onCardClick(idx) {
    const card = this.cards[idx];
    // Ignore already flipped or matched cards
    if (card.isFlipped || card.isMatched) return;

    sounds.playClick();
    card.isFlipped = true;
    this.flippedIndices.push(idx);

    if (this.flippedIndices.length === 2) {
      this.lockBoard = true;
      const [idx1, idx2] = this.flippedIndices;
      const c1 = this.cards[idx1];
      const c2 = this.cards[idx2];

      if (c1.symbol === c2.symbol) {
        // MATCH FOUND!
        setTimeout(() => {
          sounds.playHit(1.2);
          c1.isMatched = true;
          c2.isMatched = true;
          c1.matchedBy = this.currentTurn;
          c2.matchedBy = this.currentTurn;

          const color = this.currentTurn === 1 ? '#38bdf8' : '#fb7185';
          createShockwave(c1.x + c1.w / 2, c1.y + c1.h / 2, color, 140);
          createShockwave(c2.x + c2.w / 2, c2.y + c2.h / 2, color, 140);
          createSparks(c1.x + c1.w / 2, c1.y + c1.h / 2, color, 12, 4);
          createSparks(c2.x + c2.w / 2, c2.y + c2.h / 2, color, 12, 4);

          // Player who found match gets a point in the match!
          if (this.currentTurn === 1) p1Wins++;
          else p2Wins++;
          updateScoreHUD();

          this.matchedPairsCount++;
          this.flippedIndices = [];
          this.lockBoard = false;

          announce(`ИГРОК ${this.currentTurn}: ПАРА ${c1.symbol}! ✨`, 900);

          // Bonus: Player keeps the turn if they found a pair!
          this.updateTurnHints();

          // Check if all 10 pairs found or match won
          if (this.matchedPairsCount >= 10 || checkMatchOver()) {
            this.isRoundOver = true;
          }
        }, 350);
      } else {
        // NO MATCH -> Switch turn after brief preview
        setTimeout(() => {
          sounds.playFault();
          c1.isFlipped = false;
          c2.isFlipped = false;
          this.flippedIndices = [];
          this.currentTurn = this.currentTurn === 1 ? 2 : 1;
          this.updateTurnHints();
          this.lockBoard = false;
          announce(`ХОД: ИГРОК ${this.currentTurn}`, 700);
        }, 900);
      }
    }
  }

  update() {
    // Smooth card flip animations
    this.cards.forEach(c => {
      const target = c.isFlipped || c.isMatched ? 1 : 0;
      c.flipProgress += (target - c.flipProgress) * 0.22;
    });
  }

  draw() {
    this.cards.forEach(c => {
      ctx.save();
      const cx = c.x + c.w / 2;
      const cy = c.y + c.h / 2;

      // Card scale effect for 3D flip illusion
      const flipScaleX = Math.abs(Math.cos(c.flipProgress * Math.PI));
      ctx.translate(cx, cy);
      ctx.scale(Math.max(0.1, flipScaleX), 1);

      if (c.flipProgress > 0.5) {
        // FACE UP (Flipped or Matched)
        ctx.fillStyle = c.isMatched
          ? (c.matchedBy === 1 ? 'rgba(94, 234, 212, 0.22)' : 'rgba(253, 164, 175, 0.22)')
          : '#2d3345';

        ctx.strokeStyle = c.isMatched
          ? (c.matchedBy === 1 ? '#5eead4' : '#fda4af')
          : '#64748b';

        ctx.lineWidth = c.isMatched ? 3 : 2;
        ctx.beginPath();
        ctx.roundRect(-c.w / 2, -c.h / 2, c.w, c.h, 10);
        ctx.fill();
        ctx.stroke();

        // Symbol
        ctx.font = `${Math.floor(c.w * 0.55)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(c.symbol, 0, 0);
      } else {
        // FACE DOWN (Card Back)
        ctx.fillStyle = '#242938';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-c.w / 2, -c.h / 2, c.w, c.h, 10);
        ctx.fill();
        ctx.stroke();

        // Card back pattern
        ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.beginPath();
        ctx.arc(0, 0, Math.min(c.w, c.h) * 0.25, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = `${Math.floor(c.w * 0.3)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.fillText('❓', 0, 0);
      }

      ctx.restore();
    });
  }
}

// ==========================================================================
// 🪓 MINI-GAME 6: TUG OF WAR (ПЕРЕТЯГИВАНИЕ КАНАТА - ЯРОСТНЫЙ КЛИКЕР)
// ==========================================================================
class TugMiniGame {
  constructor() {
    this.name = 'tug';
    p1HintEl.innerText = 'Тапай как сумасшедший! ⚡';
    p2HintEl.innerText = 'Тапай как сумасшедший! ⚡';

    this.isRoundOver = false;
    this.ropePosition = 0; // -100 (P2 wins) to +100 (P1 wins)
    this.p1Taps = 0;
    this.p2Taps = 0;

    this.bindTouch();
    announce('ТЯНИ КАНАТ! 🪓', 1000);
  }

  resetRound() {
    this.isRoundOver = false;
    this.ropePosition = 0;
    this.p1Taps = 0;
    this.p2Taps = 0;
  }

  bindTouch() {
    this.handleTap = (e) => {
      sounds.init();
      if (this.isRoundOver) return;

      const touches = e.changedTouches ? Array.from(e.changedTouches) : [e];
      touches.forEach(t => {
        sounds.playClick();
        if (t.clientY > height / 2) {
          // Player 1 tap
          this.p1Taps++;
          this.ropePosition += 3.8;
          createSparks(t.clientX, t.clientY, '#5eead4', 6, 4);
        } else {
          // Player 2 tap
          this.p2Taps++;
          this.ropePosition -= 3.8;
          createSparks(t.clientX, t.clientY, '#fda4af', 6, 4);
        }
      });

      // Win condition
      if (this.ropePosition >= 100 && !this.isRoundOver) {
        this.isRoundOver = true;
        sounds.playWin();
        onRoundWon(1, 'ПЕРЕТЯНУЛ! ИГРОК 1 🪓🔥');
      } else if (this.ropePosition <= -100 && !this.isRoundOver) {
        this.isRoundOver = true;
        sounds.playWin();
        onRoundWon(2, 'ПЕРЕТЯНУЛ! ИГРОК 2 🪓🔥');
      }
    };

    window.addEventListener('touchstart', this.handleTap, { passive: false });
    window.addEventListener('mousedown', this.handleTap);
  }

  destroy() {
    window.removeEventListener('touchstart', this.handleTap);
    window.removeEventListener('mousedown', this.handleTap);
  }

  update() {
    // Gentle natural drift back to 0 if idle
    this.ropePosition *= 0.992;
  }

  draw() {
    const centerY = height / 2;
    const ropeOffset = (this.ropePosition / 100) * (height * 0.35);

    // Half screen backgrounds based on pressure
    ctx.save();
    ctx.fillStyle = 'rgba(56, 189, 248, 0.05)';
    ctx.fillRect(0, centerY, width, height / 2);
    ctx.fillStyle = 'rgba(251, 113, 133, 0.05)';
    ctx.fillRect(0, 0, width, height / 2);

    // Thick rope line
    ctx.beginPath();
    ctx.moveTo(width / 2, 40);
    ctx.lineTo(width / 2, height - 40);
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#d97706';
    ctx.stroke();

    // Rope coils effect
    ctx.setLineDash([10, 8]);
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 10;
    ctx.stroke();
    ctx.setLineDash([]);

    // Center win thresholds
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.strokeRect(width / 2 - 50, centerY + height * 0.35, 100, 4);
    ctx.strokeRect(width / 2 - 50, centerY - height * 0.35, 100, 4);

    // Center Flag / Knot
    const flagY = centerY + ropeOffset;
    ctx.beginPath();
    ctx.arc(width / 2, flagY, 26, 0, Math.PI * 2);
    ctx.fillStyle = '#f8fafc';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = this.ropePosition > 0 ? '#5eead4' : '#fda4af';
    ctx.stroke();

    ctx.font = '24px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🚩', width / 2, flagY);

    // Tap hints
    ctx.font = 'bold 15px sans-serif';
    ctx.fillStyle = '#5eead4';
    ctx.fillText('ТАПАЙ СЮДА! ⚡', width / 2, height * 0.85);
    ctx.save();
    ctx.translate(width / 2, height * 0.15);
    ctx.rotate(Math.PI);
    ctx.fillStyle = '#fda4af';
    ctx.fillText('ТАПАЙ СЮДА! ⚡', 0, 0);
    ctx.restore();

    ctx.restore();
  }
}

// ==========================================================================
// 🏓 MINI-GAME 7: PING PONG (ПИНГ-ПОНГ С ПОДКРУТКОЙ)
// ==========================================================================
class PongMiniGame {
  constructor() {
    this.name = 'pong';
    p1HintEl.innerText = 'Веди пальцем ракетку влево/вправо 🏓';
    p2HintEl.innerText = 'Веди пальцем ракетку влево/вправо 🏓';

    this.isRoundOver = false;
    this.paddleW = Math.min(width * 0.28, 120);
    this.paddleH = 14;

    this.initPaddles();
    this.bindTouch();
    announce('ПОДАЧА! 🏓', 1000);
  }

  initPaddles() {
    this.p1 = { x: width / 2, y: height - 30, targetX: width / 2, vx: 0, color: '#5eead4', touchId: null };
    this.p2 = { x: width / 2, y: 30, targetX: width / 2, vx: 0, color: '#fda4af', touchId: null };

    const dir = Math.random() > 0.5 ? 1 : -1;
    this.ball = {
      x: width / 2,
      y: height / 2,
      vx: (Math.random() - 0.5) * 4,
      vy: dir * 6,
      speed: 6.5,
      r: 10
    };
  }

  resetRound() {
    this.isRoundOver = false;
    this.initPaddles();
  }

  bindTouch() {
    this.handleStart = (e) => {
      sounds.init();
      const touches = e.changedTouches ? Array.from(e.changedTouches) : [e];
      touches.forEach(t => {
        const id = t.identifier !== undefined ? t.identifier : 'mouse';
        if (t.clientY > height / 2 && this.p1.touchId === null) {
          this.p1.touchId = id;
          this.p1.targetX = t.clientX;
        } else if (t.clientY <= height / 2 && this.p2.touchId === null) {
          this.p2.touchId = id;
          this.p2.targetX = t.clientX;
        }
      });
    };

    this.handleMove = (e) => {
      const touches = e.changedTouches ? Array.from(e.changedTouches) : [e];
      touches.forEach(t => {
        const id = t.identifier !== undefined ? t.identifier : 'mouse';
        if (this.p1.touchId === id) this.p1.targetX = t.clientX;
        if (this.p2.touchId === id) this.p2.targetX = t.clientX;
      });
    };

    this.handleEnd = (e) => {
      const touches = e.changedTouches ? Array.from(e.changedTouches) : [e];
      touches.forEach(t => {
        const id = t.identifier !== undefined ? t.identifier : 'mouse';
        if (this.p1.touchId === id) this.p1.touchId = null;
        if (this.p2.touchId === id) this.p2.touchId = null;
      });
    };

    window.addEventListener('touchstart', this.handleStart, { passive: false });
    window.addEventListener('touchmove', this.handleMove, { passive: false });
    window.addEventListener('touchend', this.handleEnd, { passive: false });
    window.addEventListener('mousedown', this.handleStart);
    window.addEventListener('mousemove', this.handleMove);
    window.addEventListener('mouseup', this.handleEnd);
  }

  destroy() {
    window.removeEventListener('touchstart', this.handleStart);
    window.removeEventListener('touchmove', this.handleMove);
    window.removeEventListener('touchend', this.handleEnd);
    window.removeEventListener('mousedown', this.handleStart);
    window.removeEventListener('mousemove', this.handleMove);
    window.removeEventListener('mouseup', this.handleEnd);
  }

  update() {
    if (this.isRoundOver) return;

    // Move paddles with smooth easing
    [this.p1, this.p2].forEach(p => {
      const dx = p.targetX - p.x;
      p.vx = dx * 0.35;
      p.x += p.vx;
      p.x = Math.max(this.paddleW / 2, Math.min(width - this.paddleW / 2, p.x));
    });

    const b = this.ball;
    b.x += b.vx;
    b.y += b.vy;

    // Side walls bounce
    if (b.x < b.r) {
      b.x = b.r;
      b.vx = Math.abs(b.vx);
      sounds.playRicochet();
    } else if (b.x > width - b.r) {
      b.x = width - b.r;
      b.vx = -Math.abs(b.vx);
      sounds.playRicochet();
    }

    // Paddle 1 (Bottom) collision
    if (b.y + b.r >= this.p1.y - this.paddleH / 2 && b.y - b.r <= this.p1.y + this.paddleH / 2) {
      if (b.x >= this.p1.x - this.paddleW / 2 - b.r && b.x <= this.p1.x + this.paddleW / 2 + b.r) {
        b.y = this.p1.y - this.paddleH / 2 - b.r;
        b.speed = Math.min(13, b.speed + 0.3);
        const hitOffset = (b.x - this.p1.x) / (this.paddleW / 2); // -1 to 1
        b.vx = hitOffset * 7 + this.p1.vx * 0.3;
        b.vy = -b.speed;
        sounds.playHit(1);
        createSparks(b.x, b.y, this.p1.color, 8, 4);
      }
    }

    // Paddle 2 (Top) collision
    if (b.y - b.r <= this.p2.y + this.paddleH / 2 && b.y + b.r >= this.p2.y - this.paddleH / 2) {
      if (b.x >= this.p2.x - this.paddleW / 2 - b.r && b.x <= this.p2.x + this.paddleW / 2 + b.r) {
        b.y = this.p2.y + this.paddleH / 2 + b.r;
        b.speed = Math.min(13, b.speed + 0.3);
        const hitOffset = (b.x - this.p2.x) / (this.paddleW / 2);
        b.vx = hitOffset * 7 + this.p2.vx * 0.3;
        b.vy = b.speed;
        sounds.playHit(1);
        createSparks(b.x, b.y, this.p2.color, 8, 4);
      }
    }

    // Score checks
    if (b.y < -10) {
      this.isRoundOver = true;
      sounds.playGoal();
      createShockwave(b.x, 20, '#38bdf8', 200);
      onRoundWon(1, 'ГОЛ! ИГРОК 1 🏓🔥');
    } else if (b.y > height + 10) {
      this.isRoundOver = true;
      sounds.playGoal();
      createShockwave(b.x, height - 20, '#fb7185', 200);
      onRoundWon(2, 'ГОЛ! ИГРОК 2 🏓🔥');
    }
  }

  draw() {
    // Pitch net
    ctx.save();
    ctx.setLineDash([8, 8]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
    ctx.restore();

    // Paddles
    [this.p1, this.p2].forEach(p => {
      ctx.save();
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.roundRect(p.x - this.paddleW / 2, p.y - this.paddleH / 2, this.paddleW, this.paddleH, 7);
      ctx.fill();
      ctx.restore();
    });

    // Ball
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.ball.x, this.ball.y, this.ball.r, 0, Math.PI * 2);
    ctx.fillStyle = '#f8fafc';
    ctx.shadowColor = '#fff';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.restore();
  }
}

// ==========================================================================
// 🤠 MINI-GAME 8: WILD WEST (КОВБОЙСКАЯ ДУЭЛЬ)
// ==========================================================================
class CowboyMiniGame {
  constructor() {
    this.name = 'cowboy';
    p1HintEl.innerText = 'Держи палец у кобуры! Жди BANG! 🤠';
    p2HintEl.innerText = 'Держи палец у кобуры! Жди BANG! 🤠';

    this.isRoundOver = false;
    this.state = 'WAITING'; // 'WAITING' | 'BANG'
    this.timer = null;

    this.bindTouch();
    this.scheduleDraw();
  }

  scheduleDraw() {
    this.state = 'WAITING';
    announce('ГОТОВСЬ... ⏳', 0);
    const delay = 2000 + Math.random() * 3000;
    this.timer = setTimeout(() => {
      if (this.state === 'WAITING') {
        this.state = 'BANG';
        sounds.playTapSignal();
        addScreenShake(12);
        announce('💥 BANG! 💥', 0);
      }
    }, delay);
  }

  resetRound() {
    this.isRoundOver = false;
    if (this.timer) clearTimeout(this.timer);
    this.scheduleDraw();
  }

  bindTouch() {
    this.handleTap = (e) => {
      sounds.init();
      if (this.isRoundOver) return;

      const touches = e.changedTouches ? Array.from(e.changedTouches) : [e];
      touches.forEach(t => {
        const isP1 = t.clientY > height / 2;
        const player = isP1 ? 1 : 2;
        const rival = isP1 ? 2 : 1;

        if (this.state === 'WAITING') {
          // False start
          this.isRoundOver = true;
          if (this.timer) clearTimeout(this.timer);
          sounds.playFault();
          createShockwave(t.clientX, t.clientY, '#f43f5e', 140);
          onRoundWon(rival, `ФАЛЬСТАРТ! ИГРОК ${rival} 🤠`);
        } else if (this.state === 'BANG') {
          // Quickest draw!
          this.isRoundOver = true;
          sounds.playLaser();
          createShockwave(t.clientX, t.clientY, isP1 ? '#38bdf8' : '#fb7185', 260);
          createSparks(t.clientX, t.clientY, '#fbbf24', 25, 8);
          onRoundWon(player, `ТОЧНО В ЦЕЛЬ! ИГРОК ${player} 🤠🔫`);
        }
      });
    };

    window.addEventListener('touchstart', this.handleTap, { passive: false });
    window.addEventListener('mousedown', this.handleTap);
  }

  destroy() {
    if (this.timer) clearTimeout(this.timer);
    window.removeEventListener('touchstart', this.handleTap);
    window.removeEventListener('mousedown', this.handleTap);
  }

  update() {}

  draw() {
    // Cowboy standoff visuals
    ctx.save();
    // P2 Cowboy Top
    ctx.translate(width / 2, height * 0.25);
    ctx.rotate(Math.PI);
    ctx.font = '64px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🤠', 0, 0);
    ctx.restore();

    // P1 Cowboy Bottom
    ctx.save();
    ctx.translate(width / 2, height * 0.75);
    ctx.font = '64px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🤠', 0, 0);
    ctx.restore();

    // Holster buttons
    ctx.save();
    ctx.font = '16px sans-serif';
    ctx.fillStyle = '#5eead4';
    ctx.textAlign = 'center';
    ctx.fillText('🔫 ЖМИ СЮДА', width / 2, height * 0.9);

    ctx.translate(width / 2, height * 0.1);
    ctx.rotate(Math.PI);
    ctx.fillStyle = '#fda4af';
    ctx.fillText('🔫 ЖМИ СЮДА', 0, 0);
    ctx.restore();
  }
}

// ==========================================================================
// 🎯 MINI-GAME 9: KNIFE HIT (БРОСОК НОЖЕЙ ВО ВРАЩАЮЩУЮСЯ МИШЕНЬ)
// ==========================================================================
class KnifeMiniGame {
  constructor() {
    this.name = 'knife';
    p1HintEl.innerText = 'Тапай снизу, чтобы метнуть нож! 🗡️';
    p2HintEl.innerText = 'Тапай сверху, чтобы метнуть нож! 🗡️';

    this.isRoundOver = false;
    this.targetAngle = 0;
    this.targetRadius = Math.min(width, height) * 0.2;
    this.targetSpeed = 0.035;

    this.knives = []; // { angle, owner: 1|2 }
    this.flyingKnives = []; // { x, y, vy, owner }

    this.bindTouch();
    announce('МЕТАЙ НОЖИ! 🎯', 1000);
  }

  resetRound() {
    this.isRoundOver = false;
    this.targetAngle = 0;
    this.knives = [];
    this.flyingKnives = [];
  }

  bindTouch() {
    this.handleTap = (e) => {
      sounds.init();
      if (this.isRoundOver) return;

      const touches = e.changedTouches ? Array.from(e.changedTouches) : [e];
      touches.forEach(t => {
        const isP1 = t.clientY > height / 2;
        const player = isP1 ? 1 : 2;

        sounds.playClick();
        if (isP1) {
          this.flyingKnives.push({ x: width / 2, y: height * 0.85, vy: -18, owner: 1 });
        } else {
          this.flyingKnives.push({ x: width / 2, y: height * 0.15, vy: 18, owner: 2 });
        }
      });
    };

    window.addEventListener('touchstart', this.handleTap, { passive: false });
    window.addEventListener('mousedown', this.handleTap);
  }

  destroy() {
    window.removeEventListener('touchstart', this.handleTap);
    window.removeEventListener('mousedown', this.handleTap);
  }

  update() {
    if (this.isRoundOver) return;

    this.targetAngle += this.targetSpeed;
    const centerY = height / 2;

    // Update flying knives
    for (let i = this.flyingKnives.length - 1; i >= 0; i--) {
      const fk = this.flyingKnives[i];
      fk.y += fk.vy;

      // Check hit into target
      const dist = Math.abs(fk.y - centerY);
      if (dist <= this.targetRadius) {
        this.flyingKnives.splice(i, 1);

        // Angle on target when hitting
        const hitAngle = (fk.owner === 1 ? Math.PI / 2 : -Math.PI / 2) - this.targetAngle;
        const normHitAngle = ((hitAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);

        // Check collision with already embedded knives
        let clashed = false;
        for (let ek of this.knives) {
          const diff = Math.abs(normHitAngle - ek.angle);
          const circDiff = Math.min(diff, Math.PI * 2 - diff);
          if (circDiff < 0.22) { // Too close to another knife!
            clashed = true;
            break;
          }
        }

        if (clashed) {
          this.isRoundOver = true;
          sounds.playRicochet();
          createShockwave(fk.x, fk.y, '#f43f5e', 140);
          createSparks(fk.x, fk.y, '#f43f5e', 20, 6);
          const winner = fk.owner === 1 ? 2 : 1;
          onRoundWon(winner, `ПРОМАХ ПО НОЖУ! ИГРОК ${winner} 🎯`);
          return;
        } else {
          // Successfully stuck!
          sounds.playHit(1.2);
          createSparks(fk.x, fk.y, fk.owner === 1 ? '#5eead4' : '#fda4af', 10, 4);
          this.knives.push({ angle: normHitAngle, owner: fk.owner });

          // If reached 12 knives without fault -> owner of the knife gets extra point
          if (this.knives.length >= 12) {
            this.isRoundOver = true;
            onRoundWon(fk.owner, `МИШЕНЬ ЗАПОЛНЕНА! ИГРОК ${fk.owner} 🎯`);
          }
        }
      }
    }
  }

  draw() {
    const centerY = height / 2;

    // Draw central spinning log
    ctx.save();
    ctx.translate(width / 2, centerY);
    ctx.rotate(this.targetAngle);

    ctx.beginPath();
    ctx.arc(0, 0, this.targetRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#261c14';
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#78350f';
    ctx.stroke();

    ctx.font = `${Math.floor(this.targetRadius * 0.7)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🎯', 0, 0);

    // Draw stuck knives
    this.knives.forEach(k => {
      ctx.save();
      ctx.rotate(k.angle);
      ctx.fillStyle = k.owner === 1 ? '#5eead4' : '#fda4af';
      ctx.fillRect(this.targetRadius - 10, -5, 34, 10);
      ctx.restore();
    });

    ctx.restore();

    // Draw flying knives
    this.flyingKnives.forEach(fk => {
      ctx.save();
      ctx.fillStyle = fk.owner === 1 ? '#5eead4' : '#fda4af';
      ctx.fillRect(fk.x - 5, fk.y - 15, 10, 30);
      ctx.restore();
    });
  }
}

// ==========================================================================
// 🐍 MINI-GAME 10: TRON LIGHT CYCLES (БИТВА ЗМЕЕК)
// ==========================================================================
class SnakeMiniGame {
  constructor() {
    this.name = 'snake';
    p1HintEl.innerText = 'Тапай слева / справа для поворота 🐍';
    p2HintEl.innerText = 'Тапай слева / справа для поворота 🐍';

    this.isRoundOver = false;
    this.initSnakes();
    this.bindTouch();
    announce('СТАРТ ЗМЕЕК! 🐍', 1000);
  }

  initSnakes() {
    this.p1 = {
      x: width / 2, y: height * 0.82, dir: { x: 0, y: -1 }, trail: [],
      color: '#5eead4', id: 1
    };
    this.p2 = {
      x: width / 2, y: height * 0.18, dir: { x: 0, y: 1 }, trail: [],
      color: '#fda4af', id: 2
    };
    this.speed = 3.2;
  }

  resetRound() {
    this.isRoundOver = false;
    this.initSnakes();
  }

  bindTouch() {
    this.handleTap = (e) => {
      sounds.init();
      if (this.isRoundOver) return;

      const touches = e.changedTouches ? Array.from(e.changedTouches) : [e];
      touches.forEach(t => {
        const isP1 = t.clientY > height / 2;
        const snake = isP1 ? this.p1 : this.p2;
        const isLeft = t.clientX < width / 2;

        sounds.playClick();
        // Turn 90 degrees left or right relative to current direction
        const cur = snake.dir;
        let next = { x: 0, y: 0 };
        if (cur.y !== 0) {
          next.x = (isLeft ? -1 : 1) * (isP1 ? 1 : -1);
          next.y = 0;
        } else {
          next.x = 0;
          next.y = (isLeft ? 1 : -1) * (isP1 ? 1 : -1);
        }
        snake.dir = next;
      });
    };

    window.addEventListener('touchstart', this.handleTap, { passive: false });
    window.addEventListener('mousedown', this.handleTap);
  }

  destroy() {
    window.removeEventListener('touchstart', this.handleTap);
    window.removeEventListener('mousedown', this.handleTap);
  }

  update() {
    if (this.isRoundOver) return;

    [this.p1, this.p2].forEach(s => {
      s.trail.push({ x: s.x, y: s.y });
      if (s.trail.length > 250) s.trail.shift();

      s.x += s.dir.x * this.speed;
      s.y += s.dir.y * this.speed;
    });

    // Check boundary collisions
    [this.p1, this.p2].forEach(s => {
      const rival = s.id === 1 ? 2 : 1;
      if (s.x < 10 || s.x > width - 10 || s.y < 10 || s.y > height - 10) {
        this.isRoundOver = true;
        sounds.playExplosion();
        createShockwave(s.x, s.y, s.color, 180);
        onRoundWon(rival, `ВРЕЗАЛСЯ В СТЕНУ! ИГРОК ${rival} 🐍`);
      }
    });

    if (this.isRoundOver) return;

    // Check collision with trails
    const checkHitTrail = (head, trail, isSelf) => {
      const startIdx = isSelf ? trail.length - 15 : trail.length;
      for (let i = 0; i < startIdx; i++) {
        const pt = trail[i];
        if (Math.hypot(head.x - pt.x, head.y - pt.y) < 7) return true;
      }
      return false;
    };

    if (checkHitTrail(this.p1, this.p1.trail, true) || checkHitTrail(this.p1, this.p2.trail, false)) {
      this.isRoundOver = true;
      sounds.playExplosion();
      createShockwave(this.p1.x, this.p1.y, this.p1.color, 180);
      onRoundWon(2, 'ЗМЕЙКА РАЗБИТА! ИГРОК 2 🐍');
    } else if (checkHitTrail(this.p2, this.p2.trail, true) || checkHitTrail(this.p2, this.p1.trail, false)) {
      this.isRoundOver = true;
      sounds.playExplosion();
      createShockwave(this.p2.x, this.p2.y, this.p2.color, 180);
      onRoundWon(1, 'ЗМЕЙКА РАЗБИТА! ИГРОК 1 🐍');
    }
  }

  draw() {
    [this.p1, this.p2].forEach(s => {
      ctx.save();
      ctx.strokeStyle = s.color;
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      s.trail.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.lineTo(s.x, s.y);
      ctx.stroke();

      // Head
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(s.x, s.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }
}

// ==========================================================================
// 💣 MINI-GAME 11: HOT POTATO BOMB (ГОРЯЧАЯ БОМБА С ТАЙМЕРОМ)
// ==========================================================================
class BombMiniGame {
  constructor() {
    this.name = 'bomb';
    p1HintEl.innerText = 'Отбей бомбу на сторону врага до взрыва! 💣';
    p2HintEl.innerText = 'Отбей бомбу на сторону врага до взрыва! 💣';

    this.isRoundOver = false;
    this.timeLeft = 6.0; // Seconds to explosion
    this.initBomb();
    this.bindTouch();
    announce('БОМБА ТИКАЕТ! 💣', 1000);
  }

  initBomb() {
    this.bomb = {
      x: width / 2,
      y: height / 2,
      vx: (Math.random() - 0.5) * 6,
      vy: (Math.random() > 0.5 ? 1 : -1) * 7,
      r: 24
    };
    this.p1 = { x: width / 2, y: height * 0.8, r: 35, color: '#5eead4' };
    this.p2 = { x: width / 2, y: height * 0.2, r: 35, color: '#fda4af' };
    this.timeLeft = 6.5;
  }

  resetRound() {
    this.isRoundOver = false;
    this.initBomb();
  }

  bindTouch() {
    this.handleTouch = (e) => {
      sounds.init();
      const touches = e.changedTouches ? Array.from(e.changedTouches) : [e];
      touches.forEach(t => {
        if (t.clientY > height / 2) {
          this.p1.x = t.clientX;
          this.p1.y = t.clientY;
        } else {
          this.p2.x = t.clientX;
          this.p2.y = t.clientY;
        }
      });
    };

    window.addEventListener('touchstart', this.handleTouch, { passive: false });
    window.addEventListener('touchmove', this.handleTouch, { passive: false });
    window.addEventListener('mousedown', this.handleTouch);
    window.addEventListener('mousemove', this.handleTouch);
  }

  destroy() {
    window.removeEventListener('touchstart', this.handleTouch);
    window.removeEventListener('touchmove', this.handleTouch);
    window.removeEventListener('mousedown', this.handleTouch);
    window.removeEventListener('mousemove', this.handleTouch);
  }

  update() {
    if (this.isRoundOver) return;

    this.timeLeft -= 1 / 60;
    const b = this.bomb;
    b.x += b.vx;
    b.y += b.vy;

    // Walls
    if (b.x < b.r || b.x > width - b.r) {
      b.vx *= -1;
      sounds.playRicochet();
    }
    if (b.y < b.r || b.y > height - b.r) {
      b.vy *= -1;
      sounds.playRicochet();
    }

    // Bounce off players
    [this.p1, this.p2].forEach(p => {
      const d = Math.hypot(b.x - p.x, b.y - p.y);
      if (d < b.r + p.r) {
        const nx = (b.x - p.x) / d;
        const ny = (b.y - p.y) / d;
        b.vx = nx * 10;
        b.vy = ny * 10;
        sounds.playHit(1.2);
        createSparks(b.x, b.y, p.color, 12, 5);
      }
    });

    // Time's up -> EXPLOSION!
    if (this.timeLeft <= 0) {
      this.isRoundOver = true;
      sounds.playExplosion();
      addScreenShake(20);
      createShockwave(b.x, b.y, '#f87171', 280);
      createSparks(b.x, b.y, '#fbbf24', 40, 10);

      // Loser is whoever has the bomb on their half!
      const loser = b.y > height / 2 ? 1 : 2;
      const winner = loser === 1 ? 2 : 1;
      onRoundWon(winner, `БАБАХ! ПОБЕДА: ИГРОК ${winner} 💣💥`);
    }
  }

  draw() {
    // Bomb pulse
    const b = this.bomb;
    ctx.save();
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fillStyle = '#1e2436';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = this.timeLeft < 2 ? '#ef4444' : '#f59e0b';
    ctx.stroke();

    ctx.font = '28px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('💣', b.x, b.y);

    // Timer display
    ctx.font = 'bold 20px sans-serif';
    ctx.fillStyle = this.timeLeft < 2 ? '#ef4444' : '#fff';
    ctx.fillText(`${Math.max(0, this.timeLeft).toFixed(1)}s`, b.x, b.y - 36);
    ctx.restore();

    // Players
    [this.p1, this.p2].forEach(p => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.restore();
    });
  }
}

// ==========================================================================
// 🚀 ENGINE LOADER & MAIN RENDER LOOP
// ==========================================================================
function loadMiniGame(gameId) {
  if (currentMiniGame && currentMiniGame.destroy) {
    currentMiniGame.destroy();
  }
  particles = [];
  shockwaves = [];

  switch (gameId) {
    case 'soccer':
      currentMiniGame = new SoccerMiniGame();
      break;
    case 'tanks':
      currentMiniGame = new TanksMiniGame();
      break;
    case 'tug':
      currentMiniGame = new TugMiniGame();
      break;
    case 'pong':
      currentMiniGame = new PongMiniGame();
      break;
    case 'cowboy':
      currentMiniGame = new CowboyMiniGame();
      break;
    case 'knife':
      currentMiniGame = new KnifeMiniGame();
      break;
    case 'snake':
      currentMiniGame = new SnakeMiniGame();
      break;
    case 'bomb':
      currentMiniGame = new BombMiniGame();
      break;
    case 'tap':
      currentMiniGame = new TapMiniGame();
      break;
    case 'dobble':
      currentMiniGame = new DobbleMiniGame();
      break;
    default:
      currentMiniGame = new SoccerMiniGame();
  }
}

function masterLoop() {
  // Screen shake
  let sx = 0, sy = 0;
  if (screenShake > 0) {
    sx = (Math.random() - 0.5) * screenShake;
    sy = (Math.random() - 0.5) * screenShake;
    screenShake *= 0.88;
    if (screenShake < 0.2) screenShake = 0;
  }

  ctx.save();
  ctx.clearRect(0, 0, width, height);
  ctx.translate(sx, sy);

  if (currentMiniGame) {
    currentMiniGame.update();
    currentMiniGame.draw();
    updateAndDrawEffects();
  } else {
    // Menu background subtle animation
    ctx.fillStyle = '#080a10';
    ctx.fillRect(0, 0, width, height);
  }

  ctx.restore();
  requestAnimationFrame(masterLoop);
}

// Start master loop
requestAnimationFrame(masterLoop);
updateScoreHUD();
