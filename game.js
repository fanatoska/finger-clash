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
  vibrate(pattern = [12]) {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate(pattern); } catch (e) {}
    }
  }
  playClick() {
    this.vibrate([12]);
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      // High crisp snap
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1400, t);
      osc1.frequency.exponentialRampToValueAtTime(700, t + 0.04);
      gain1.gain.setValueAtTime(0.2, t);
      gain1.gain.linearRampToValueAtTime(0.001, t + 0.04);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(t);
      osc1.stop(t + 0.04);

      // Soft sub-body
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(320, t);
      osc2.frequency.exponentialRampToValueAtTime(120, t + 0.05);
      gain2.gain.setValueAtTime(0.25, t);
      gain2.gain.linearRampToValueAtTime(0.001, t + 0.05);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(t);
      osc2.stop(t + 0.05);
    } catch (err) {}
  }
  playSelect() {
    this.vibrate([14]);
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, t);
      osc.frequency.exponentialRampToValueAtTime(1040, t + 0.06);
      gain.gain.setValueAtTime(0.18, t);
      gain.gain.linearRampToValueAtTime(0.001, t + 0.06);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.06);
    } catch (err) {}
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
// 🌟 VISUAL FX ENGINE (PARTICLES, SHAKES, SHOCKWAVES, CONFETTI & HIT-STOP)
// ==========================================================================
let particles = [];
let shockwaves = [];
let confetti = [];
let screenShake = 0;
let hitStopFrames = 0;

function addScreenShake(amount) {
  screenShake = Math.max(screenShake, amount);
}

function triggerHitStop(frames = 6) {
  hitStopFrames = frames;
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

function createConfetti(x, y, count = 45) {
  const colors = ['#38bdf8', '#fda4af', '#facc15', '#4ade80', '#c084fc', '#f43f5e', '#ffffff'];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const spd = Math.random() * 8 + 3;
    confetti.push({
      x, y,
      vx: Math.cos(angle) * spd,
      vy: Math.sin(angle) * spd - 4,
      w: Math.random() * 8 + 5,
      h: Math.random() * 5 + 3,
      rot: Math.random() * Math.PI * 2,
      vrot: (Math.random() - 0.5) * 0.25,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      gravity: 0.16,
      decay: Math.random() * 0.012 + 0.008
    });
  }
}

function drawArenaBackground() {
  // Player 2 half (top, peach/coral ambient glow)
  const gradTop = ctx.createRadialGradient(width / 2, height * 0.2, 20, width / 2, height * 0.2, height * 0.4);
  gradTop.addColorStop(0, 'rgba(253, 164, 175, 0.06)');
  gradTop.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = gradTop;
  ctx.fillRect(0, 0, width, height / 2);

  // Player 1 half (bottom, mint/cyan ambient glow)
  const gradBottom = ctx.createRadialGradient(width / 2, height * 0.8, 20, width / 2, height * 0.8, height * 0.4);
  gradBottom.addColorStop(0, 'rgba(56, 189, 248, 0.06)');
  gradBottom.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = gradBottom;
  ctx.fillRect(0, height / 2, width, height / 2);

  // Corner neon accents
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 2;
  const bSize = 24;
  // Top left
  ctx.beginPath();
  ctx.moveTo(14, 14 + bSize);
  ctx.lineTo(14, 14);
  ctx.lineTo(14 + bSize, 14);
  ctx.stroke();
  // Top right
  ctx.beginPath();
  ctx.moveTo(width - 14 - bSize, 14);
  ctx.lineTo(width - 14, 14);
  ctx.lineTo(width - 14, 14 + bSize);
  ctx.stroke();
  // Bottom left
  ctx.beginPath();
  ctx.moveTo(14, height - 14 - bSize);
  ctx.lineTo(14, height - 14);
  ctx.lineTo(14 + bSize, height - 14);
  ctx.stroke();
  // Bottom right
  ctx.beginPath();
  ctx.moveTo(width - 14 - bSize, height - 14);
  ctx.lineTo(width - 14, height - 14);
  ctx.lineTo(width - 14, height - 14 - bSize);
  ctx.stroke();
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

  // Confetti
  for (let i = confetti.length - 1; i >= 0; i--) {
    const c = confetti[i];
    c.x += c.vx;
    c.y += c.vy;
    c.vy += c.gravity;
    c.vx *= 0.98;
    c.rot += c.vrot;
    c.alpha -= c.decay;
    if (c.alpha <= 0 || c.y > height + 20) {
      confetti.splice(i, 1);
      continue;
    }
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.rotate(c.rot);
    ctx.globalAlpha = Math.max(0, c.alpha);
    ctx.fillStyle = c.color;
    ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
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
    sounds.vibrate([40, 60, 40, 100]);
    createConfetti(width / 2, height / 2, 90);
    createConfetti(width * 0.25, height * 0.35, 50);
    createConfetti(width * 0.75, height * 0.65, 50);
    const winnerName = p1Wins >= targetWins ? 'PLAYER 1 ПОБЕДИЛ!' : 'PLAYER 2 ПОБЕДИЛ!';
    matchWinnerNameEl.innerText = winnerName;
    matchWinnerNameEl.style.color = p1Wins >= targetWins ? '#38bdf8' : '#fda4af';
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
  createShockwave(width / 2, height / 2, playerNum === 1 ? '#38bdf8' : '#fda4af', 260);
  createConfetti(width / 2, height / 2, 55);
  addScreenShake(14);
  triggerHitStop(7);
  sounds.vibrate([30, 40, 50]);

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
    sounds.playSelect();
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
  sounds.init();
  sounds.vibrate([25, 40, 35]);
  sounds.playClick();
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
    this.goalWidth = Math.min(width * 0.48, 230);
    this.initPitch();
    this.bindTouch();
    announce('МАТЧ НАЧАЛСЯ! ⚽', 1000);
  }

  initPitch() {
    const pr = Math.min(width, height) * 0.058;
    this.p1 = { x: width / 2, y: height * 0.8, vx: 0, vy: 0, radius: pr, color: '#38bdf8', touchId: null };
    this.p2 = { x: width / 2, y: height * 0.2, vx: 0, vy: 0, radius: pr, color: '#fda4af', touchId: null };
    this.ball = {
      x: width / 2, y: height / 2,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() > 0.5 ? 1 : -1) * 5,
      radius: Math.min(width, height) * 0.04,
      color: '#f8fafc'
    };
    this.trail = [];
    this.squash = 1;
    this.squashAngle = 0;
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
        p.vx = dx * 0.3;
        p.vy = dy * 0.3;
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
    this.trail.unshift({ x: b.x, y: b.y });
    if (this.trail.length > 8) this.trail.pop();

    b.x += b.vx;
    b.y += b.vy;
    b.vx *= 0.988;
    b.vy *= 0.988;

    // Squash recovery
    this.squash += (1 - this.squash) * 0.18;

    // Ball side walls
    if (b.x - b.radius < 10) {
      b.x = 10 + b.radius;
      b.vx = Math.abs(b.vx) * 0.95;
      this.squash = 0.72;
      this.squashAngle = 0;
      sounds.playRicochet();
      sounds.vibrate([14]);
      createSparks(b.x, b.y, '#fff', 6, 4);
    } else if (b.x + b.radius > width - 10) {
      b.x = width - 10 - b.radius;
      b.vx = -Math.abs(b.vx) * 0.95;
      this.squash = 0.72;
      this.squashAngle = 0;
      sounds.playRicochet();
      sounds.vibrate([14]);
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

        const impulse = 12 + Math.hypot(p.vx, p.vy) * 0.85;
        b.vx = nx * impulse;
        b.vy = ny * impulse;

        this.squash = 0.65;
        this.squashAngle = Math.atan2(ny, nx);

        sounds.playHit(1.3);
        sounds.vibrate([22]);
        createSparks(b.x, b.y, p.color, 14, 6);
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
        sounds.vibrate([40, 60, 80]);
        triggerHitStop(8);
        createShockwave(b.x, b.y, '#38bdf8', 260);
        onRoundWon(1, 'ГОЛ! ИГРОК 1 ⚽🔥');
      } else {
        b.y = 10 + b.radius;
        b.vy = Math.abs(b.vy) * 0.9;
        this.squash = 0.72;
        this.squashAngle = Math.PI / 2;
        sounds.playRicochet();
      }
    }

    // Bottom goal (P1 side) -> P2 scores
    if (b.y + b.radius >= height - 10) {
      if (b.x >= goalLeft && b.x <= goalRight) {
        this.isRoundOver = true;
        sounds.playGoal();
        sounds.vibrate([40, 60, 80]);
        triggerHitStop(8);
        createShockwave(b.x, b.y, '#fda4af', 260);
        onRoundWon(2, 'ГОЛ! ИГРОК 2 ⚽🔥');
      } else {
        b.y = height - 10 - b.radius;
        b.vy = -Math.abs(b.vy) * 0.9;
        this.squash = 0.72;
        this.squashAngle = Math.PI / 2;
        sounds.playRicochet();
      }
    }
  }

  draw() {
    // Pitch lines
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    // Center circle & center divider line
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, Math.min(width, height) * 0.2, 0, Math.PI * 2);
    ctx.stroke();

    // Goals with net pattern
    const gw = this.goalWidth;
    const gl = (width - gw) / 2;
    // Top goal (Peach side)
    ctx.fillStyle = 'rgba(253, 164, 175, 0.16)';
    ctx.fillRect(gl, 4, gw, 16);
    ctx.strokeStyle = '#fda4af';
    ctx.lineWidth = 3;
    ctx.strokeRect(gl, 4, gw, 16);

    // Bottom goal (Cyan side)
    ctx.fillStyle = 'rgba(56, 189, 248, 0.16)';
    ctx.fillRect(gl, height - 20, gw, 16);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.strokeRect(gl, height - 20, gw, 16);
    ctx.restore();

    // Ball speed trail
    for (let i = 0; i < this.trail.length; i++) {
      const t = this.trail[i];
      const r = this.ball.radius * (1 - i / this.trail.length) * 0.75;
      ctx.beginPath();
      ctx.arc(t.x, t.y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(56, 189, 248, ${(0.3 * (1 - i / this.trail.length)).toFixed(2)})`;
      ctx.fill();
    }

    // Procedural 3D Soccer Ball with Squash & Stretch
    ctx.save();
    ctx.translate(this.ball.x, this.ball.y);
    // Dynamic floor shadow
    ctx.beginPath();
    ctx.ellipse(3, 4, this.ball.radius, this.ball.radius * 0.85, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.38)';
    ctx.fill();

    // Rotate and apply squash & stretch
    ctx.rotate(this.squashAngle);
    ctx.scale(1 / this.squash, this.squash);
    ctx.rotate(-this.squashAngle);

    // 3D spherical radial gradient
    const grad = ctx.createRadialGradient(
      -this.ball.radius * 0.3, -this.ball.radius * 0.3, this.ball.radius * 0.1,
      0, 0, this.ball.radius
    );
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.7, '#e2e8f0');
    grad.addColorStop(1, '#94a3b8');

    ctx.beginPath();
    ctx.arc(0, 0, this.ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.shadowColor = 'rgba(56, 189, 248, 0.35)';
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Classic pentagon patch on ball
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    const pr = this.ball.radius * 0.42;
    for (let a = 0; a < 5; a++) {
      const ang = (a * 72 - 18) * Math.PI / 180;
      const px = Math.cos(ang) * pr;
      const py = Math.sin(ang) * pr;
      if (a === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();

    // Seam lines to edge
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.2;
    for (let a = 0; a < 5; a++) {
      const ang = (a * 72 - 18) * Math.PI / 180;
      ctx.beginPath();
      ctx.moveTo(Math.cos(ang) * pr, Math.sin(ang) * pr);
      ctx.lineTo(Math.cos(ang) * this.ball.radius * 0.88, Math.sin(ang) * this.ball.radius * 0.88);
      ctx.stroke();
    }
    ctx.restore();

    // Arcade Air-Hockey Mallet Striker for Players
    [this.p1, this.p2].forEach(p => {
      ctx.save();
      // Outer beveled ring with player glow
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 18;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Dark inner grip groove
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * 0.78, 0, Math.PI * 2);
      ctx.fillStyle = '#151924';
      ctx.fill();

      // Raised center glossy dome handle
      const hGrad = ctx.createRadialGradient(
        p.x - p.radius * 0.15, p.y - p.radius * 0.15, p.radius * 0.05,
        p.x, p.y, p.radius * 0.5
      );
      hGrad.addColorStop(0, '#ffffff');
      hGrad.addColorStop(0.7, p.color);
      hGrad.addColorStop(1, '#0f172a');
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = hGrad;
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
    const barrelLen = tank.size * 0.75;
    const bx = tank.x + Math.cos(tank.angle) * barrelLen;
    const by = tank.y + Math.sin(tank.angle) * barrelLen;
    const spd = 9.5;

    this.bullets.push({
      x: bx, y: by,
      vx: Math.cos(tank.angle) * spd,
      vy: Math.sin(tank.angle) * spd,
      bounces: 2,
      owner: tank,
      color: tank.color,
      radius: 4.5
    });

    sounds.playLaser();
    sounds.vibrate([18]);
    createSparks(bx, by, tank.color, 12, 5);
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
        if (dist > 6) {
          const targetAngle = Math.atan2(dy, dx);
          let diff = targetAngle - p.angle;
          while (diff < -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;
          p.angle += diff * 0.22;

          const spd = Math.min(dist * 0.1, 4.2);
          p.vx = Math.cos(p.angle) * spd;
          p.vy = Math.sin(p.angle) * spd;
          p.x += p.vx;
          p.y += p.vy;
        }
      }
      p.x = Math.max(p.size * 0.6, Math.min(width - p.size * 0.6, p.x));
      p.y = Math.max(p.size * 0.6, Math.min(height - p.size * 0.6, p.y));
    });

    // Update bullets
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      b.x += b.vx;
      b.y += b.vy;

      // Screen edge ricochets
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
        triggerHitStop(8);
        sounds.vibrate([40, 70, 90]);
        createShockwave(this.p1.x, this.p1.y, '#fda4af', 220);
        createSparks(this.p1.x, this.p1.y, '#fda4af', 35, 9);
        onRoundWon(2, 'ПОПАДАНИЕ! ИГРОК 2 💥');
        break;
      }
      if (d2 < this.p2.size * 0.6) {
        this.isRoundOver = true;
        sounds.playExplosion();
        triggerHitStop(8);
        sounds.vibrate([40, 70, 90]);
        createShockwave(this.p2.x, this.p2.y, '#38bdf8', 220);
        createSparks(this.p2.x, this.p2.y, '#38bdf8', 35, 9);
        onRoundWon(1, 'ПОПАДАНИЕ! ИГРОК 1 💥');
        break;
      }
    }
  }

  draw() {
    // Sci-fi obstacles with hazard diagonal lines
    ctx.save();
    this.obstacles.forEach(obs => {
      ctx.fillStyle = '#181e2e';
      ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
      ctx.lineWidth = 2;
      ctx.strokeRect(obs.x, obs.y, obs.w, obs.h);

      // Warning hazard stripes inside
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 3;
      for (let s = -obs.h; s < obs.w; s += 16) {
        ctx.beginPath();
        ctx.moveTo(obs.x + Math.max(0, s), obs.y);
        ctx.lineTo(obs.x + Math.min(obs.w, s + obs.h), obs.y + obs.h);
        ctx.stroke();
      }

      // Neon corner dots
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(obs.x + 2, obs.y + 2, 4, 4);
      ctx.fillRect(obs.x + obs.w - 6, obs.y + 2, 4, 4);
      ctx.fillRect(obs.x + 2, obs.y + obs.h - 6, 4, 4);
      ctx.fillRect(obs.x + obs.w - 6, obs.y + obs.h - 6, 4, 4);
    });
    ctx.restore();

    // Crosshair Fire Buttons
    const drawCrosshairBtn = (btn, color) => {
      ctx.save();
      // Outer translucent circle
      ctx.beginPath();
      ctx.arc(btn.x, btn.y, btn.r, 0, Math.PI * 2);
      ctx.fillStyle = color === '#38bdf8' ? 'rgba(56, 189, 248, 0.14)' : 'rgba(253, 164, 175, 0.14)';
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Inner target ring
      ctx.beginPath();
      ctx.arc(btn.x, btn.y, btn.r * 0.55, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Crosshair lines
      ctx.beginPath();
      ctx.moveTo(btn.x - btn.r * 0.75, btn.y);
      ctx.lineTo(btn.x - btn.r * 0.25, btn.y);
      ctx.moveTo(btn.x + btn.r * 0.25, btn.y);
      ctx.lineTo(btn.x + btn.r * 0.75, btn.y);
      ctx.moveTo(btn.x, btn.y - btn.r * 0.75);
      ctx.lineTo(btn.x, btn.y - btn.r * 0.25);
      ctx.moveTo(btn.x, btn.y + btn.r * 0.25);
      ctx.lineTo(btn.x, btn.y + btn.r * 0.75);
      ctx.stroke();

      // Center laser dot
      ctx.beginPath();
      ctx.arc(btn.x, btn.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.restore();
    };

    drawCrosshairBtn(this.fireButtons.p1, '#38bdf8');
    drawCrosshairBtn(this.fireButtons.p2, '#fda4af');

    // Laser bullets with glowing energy trail
    this.bullets.forEach(b => {
      ctx.save();
      const speed = Math.hypot(b.vx, b.vy);
      const ang = Math.atan2(b.vy, b.vx);
      ctx.translate(b.x, b.y);
      ctx.rotate(ang);

      // Trail
      ctx.beginPath();
      ctx.moveTo(-16, 0);
      ctx.lineTo(4, 0);
      ctx.strokeStyle = b.color;
      ctx.lineWidth = 3;
      ctx.shadowColor = b.color;
      ctx.shadowBlur = 14;
      ctx.stroke();

      // White core
      ctx.beginPath();
      ctx.arc(2, 0, b.radius * 0.75, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.restore();
    });

    // Draw Sci-Fi Tanks
    [this.p1, this.p2].forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);

      const sz = p.size;

      // Tread shadow
      ctx.beginPath();
      ctx.rect(-sz * 0.52, -sz * 0.46, sz * 1.04, sz * 0.92);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fill();

      // Treads (left & right)
      ctx.fillStyle = '#111622';
      ctx.fillRect(-sz * 0.5, -sz * 0.44, sz, sz * 0.16);
      ctx.fillRect(-sz * 0.5, sz * 0.28, sz, sz * 0.16);

      // Tread notches
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      for (let tx = -sz * 0.4; tx <= sz * 0.4; tx += sz * 0.18) {
        ctx.fillRect(tx, -sz * 0.44, 2, sz * 0.16);
        ctx.fillRect(tx, sz * 0.28, 2, sz * 0.16);
      }

      // Armored Hull
      ctx.fillStyle = '#1e2538';
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-sz * 0.42, -sz * 0.32, sz * 0.84, sz * 0.64, 4);
      ctx.fill();
      ctx.stroke();

      // Armor plate accent
      ctx.fillStyle = p.color;
      ctx.fillRect(-sz * 0.35, -sz * 0.26, sz * 0.7, 3);
      ctx.fillRect(-sz * 0.35, sz * 0.23, sz * 0.7, 3);

      // Cannon Barrel
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(0, -sz * 0.08, sz * 0.68, sz * 0.16);
      // Muzzle brake
      ctx.fillStyle = p.color;
      ctx.fillRect(sz * 0.58, -sz * 0.11, sz * 0.12, sz * 0.22);

      // Turret Dome
      ctx.beginPath();
      ctx.arc(0, 0, sz * 0.26, 0, Math.PI * 2);
      ctx.fillStyle = '#0f172a';
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Turret center light
      ctx.beginPath();
      ctx.arc(0, 0, sz * 0.11, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

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
    const cx = width / 2;
    const cy = height / 2;

    if (this.state === 'WAITING') {
      // Soft crimson danger glow
      const rGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, Math.min(width, height) * 0.5);
      rGrad.addColorStop(0, 'rgba(239, 68, 68, 0.16)');
      rGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = rGrad;
      ctx.fillRect(0, 0, width, height);

      // Warning Reactor Core
      ctx.save();
      const time = performance.now() * 0.003;
      const pulse = 1 + 0.06 * Math.sin(time * 3);

      // Outer hazard ring
      ctx.beginPath();
      ctx.arc(cx, cy, 54 * pulse, 0, Math.PI * 2);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 16;
      ctx.stroke();

      // Dashed inner barrier ring
      ctx.beginPath();
      ctx.arc(cx, cy, 42 * pulse, 0, Math.PI * 2);
      ctx.setLineDash([8, 6]);
      ctx.strokeStyle = 'rgba(254, 202, 202, 0.6)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.setLineDash([]);

      // Inner glowing core
      const coreGrad = ctx.createRadialGradient(cx - 6, cy - 6, 4, cx, cy, 28);
      coreGrad.addColorStop(0, '#fca5a5');
      coreGrad.addColorStop(0.6, '#ef4444');
      coreGrad.addColorStop(1, '#7f1d1d');
      ctx.beginPath();
      ctx.arc(cx, cy, 28 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();

      // Hand / Palm stop icon (vector)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(cx - 10, cy - 10, 20, 20);

      ctx.restore();
    } else if (this.state === 'READY') {
      // Emerald / Cyan High Voltage Flash
      const gGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, Math.min(width, height) * 0.6);
      gGrad.addColorStop(0, 'rgba(52, 211, 153, 0.35)');
      gGrad.addColorStop(1, 'rgba(16, 185, 129, 0.02)');
      ctx.fillStyle = gGrad;
      ctx.fillRect(0, 0, width, height);

      // Electric shockwave rings
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, 68, 0, Math.PI * 2);
      ctx.strokeStyle = '#4ade80';
      ctx.lineWidth = 4;
      ctx.shadowColor = '#4ade80';
      ctx.shadowBlur = 24;
      ctx.stroke();

      // Procedural Vector Lightning Bolt
      ctx.translate(cx, cy);
      ctx.scale(1.8, 1.8);
      ctx.beginPath();
      ctx.moveTo(3, -24);
      ctx.lineTo(-14, 0);
      ctx.lineTo(-2, 0);
      ctx.lineTo(-6, 24);
      ctx.lineTo(14, -2);
      ctx.lineTo(2, -2);
      ctx.closePath();

      ctx.fillStyle = '#fef08a';
      ctx.shadowColor = '#22c55e';
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    }
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
        // FACE DOWN (Premium Holographic Card Back)
        const bgGrad = ctx.createLinearGradient(-c.w / 2, -c.h / 2, c.w / 2, c.h / 2);
        bgGrad.addColorStop(0, '#1e2436');
        bgGrad.addColorStop(1, '#0f1320');
        ctx.fillStyle = bgGrad;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-c.w / 2, -c.h / 2, c.w, c.h, 10);
        ctx.fill();
        ctx.stroke();

        // Inner geometric border
        ctx.strokeStyle = 'rgba(250, 204, 21, 0.25)';
        ctx.lineWidth = 1;
        ctx.strokeRect(-c.w / 2 + 5, -c.h / 2 + 5, c.w - 10, c.h - 10);

        // Center holographic diamond star
        ctx.beginPath();
        ctx.moveTo(0, -c.h * 0.22);
        ctx.lineTo(c.w * 0.22, 0);
        ctx.lineTo(0, c.h * 0.22);
        ctx.lineTo(-c.w * 0.22, 0);
        ctx.closePath();
        ctx.fillStyle = 'rgba(250, 204, 21, 0.35)';
        ctx.fill();
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Central diamond core dot
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
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

    // Center Energy Battle Ring & Knot
    const flagY = centerY + ropeOffset;
    const activeColor = this.ropePosition > 0 ? '#38bdf8' : (this.ropePosition < 0 ? '#fda4af' : '#fbbf24');

    // Glowing tension aura
    ctx.beginPath();
    ctx.arc(width / 2, flagY, 28, 0, Math.PI * 2);
    ctx.fillStyle = activeColor;
    ctx.shadowColor = activeColor;
    ctx.shadowBlur = 18;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Dark core
    ctx.beginPath();
    ctx.arc(width / 2, flagY, 20, 0, Math.PI * 2);
    ctx.fillStyle = '#151a26';
    ctx.fill();

    // Directional Tension Arrow Indicator
    ctx.beginPath();
    if (this.ropePosition > 0) {
      // Pulling down (P1)
      ctx.moveTo(width / 2 - 8, flagY - 6);
      ctx.lineTo(width / 2 + 8, flagY - 6);
      ctx.lineTo(width / 2, flagY + 8);
    } else if (this.ropePosition < 0) {
      // Pulling up (P2)
      ctx.moveTo(width / 2 - 8, flagY + 6);
      ctx.lineTo(width / 2 + 8, flagY + 6);
      ctx.lineTo(width / 2, flagY - 8);
    } else {
      // Equilibrium pulse
      ctx.arc(width / 2, flagY, 6, 0, Math.PI * 2);
    }
    ctx.fillStyle = activeColor;
    ctx.fill();

    // Tap Ripple Pads
    const drawTapPad = (padY, color, label) => {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(width / 2 - 75, padY - 20, 150, 40, 20);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.stroke();

      ctx.font = '800 12.5px Outfit, sans-serif';
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, width / 2, padY);
      ctx.restore();
    };

    drawTapPad(height * 0.86, '#38bdf8', '⚡ ТАПАЙ БЫСТРЕЕ');
    ctx.save();
    ctx.translate(width, height);
    ctx.rotate(Math.PI);
    drawTapPad(height * 0.86, '#fda4af', '⚡ ТАПАЙ БЫСТРЕЕ');
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
    this.p1 = { x: width / 2, y: height - 42, targetX: width / 2, color: '#38bdf8', touchId: null, vx: 0 };
    this.p2 = { x: width / 2, y: 42, targetX: width / 2, color: '#fda4af', touchId: null, vx: 0 };
    this.ball = {
      x: width / 2,
      y: height / 2,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() > 0.5 ? 1 : -1) * 6,
      r: 10,
      speed: 6
    };
    this.trail = [];
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
    this.trail.unshift({ x: b.x, y: b.y });
    if (this.trail.length > 8) this.trail.pop();

    b.x += b.vx;
    b.y += b.vy;

    // Side walls bounce
    if (b.x < b.r) {
      b.x = b.r;
      b.vx = Math.abs(b.vx);
      sounds.playRicochet();
      sounds.vibrate([10]);
    } else if (b.x > width - b.r) {
      b.x = width - b.r;
      b.vx = -Math.abs(b.vx);
      sounds.playRicochet();
      sounds.vibrate([10]);
    }

    // Paddle 1 (Bottom) collision
    if (b.y + b.r >= this.p1.y - this.paddleH / 2 && b.y - b.r <= this.p1.y + this.paddleH / 2) {
      if (b.x >= this.p1.x - this.paddleW / 2 - b.r && b.x <= this.p1.x + this.paddleW / 2 + b.r) {
        b.y = this.p1.y - this.paddleH / 2 - b.r;
        b.speed = Math.min(13.5, b.speed + 0.35);
        const hitOffset = (b.x - this.p1.x) / (this.paddleW / 2); // -1 to 1
        b.vx = hitOffset * 7.5 + this.p1.vx * 0.3;
        b.vy = -b.speed;
        sounds.playHit(1.2);
        sounds.vibrate([18]);
        createSparks(b.x, b.y, this.p1.color, 12, 5);
        addScreenShake(4);
      }
    }

    // Paddle 2 (Top) collision
    if (b.y - b.r <= this.p2.y + this.paddleH / 2 && b.y + b.r >= this.p2.y - this.paddleH / 2) {
      if (b.x >= this.p2.x - this.paddleW / 2 - b.r && b.x <= this.p2.x + this.paddleW / 2 + b.r) {
        b.y = this.p2.y + this.paddleH / 2 + b.r;
        b.speed = Math.min(13.5, b.speed + 0.35);
        const hitOffset = (b.x - this.p2.x) / (this.paddleW / 2);
        b.vx = hitOffset * 7.5 + this.p2.vx * 0.3;
        b.vy = b.speed;
        sounds.playHit(1.2);
        sounds.vibrate([18]);
        createSparks(b.x, b.y, this.p2.color, 12, 5);
        addScreenShake(4);
      }
    }

    // Score checks
    if (b.y < -10) {
      this.isRoundOver = true;
      sounds.playGoal();
      sounds.vibrate([40, 70, 90]);
      triggerHitStop(8);
      createShockwave(b.x, 20, '#38bdf8', 240);
      onRoundWon(1, 'ГОЛ! ИГРОК 1 🏓🔥');
    } else if (b.y > height + 10) {
      this.isRoundOver = true;
      sounds.playGoal();
      sounds.vibrate([40, 70, 90]);
      triggerHitStop(8);
      createShockwave(b.x, height - 20, '#fda4af', 240);
      onRoundWon(2, 'ГОЛ! ИГРОК 2 🏓🔥');
    }
  }

  draw() {
    // Pitch net
    ctx.save();
    ctx.setLineDash([8, 8]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
    ctx.restore();

    // Ball motion trail
    for (let i = 0; i < this.trail.length; i++) {
      const t = this.trail[i];
      const r = this.ball.r * (1 - i / this.trail.length) * 0.75;
      ctx.beginPath();
      ctx.arc(t.x, t.y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(56, 189, 248, ${(0.35 * (1 - i / this.trail.length)).toFixed(2)})`;
      ctx.fill();
    }

    // Paddles
    [this.p1, this.p2].forEach(p => {
      ctx.save();
      // Outer capsule with glow
      ctx.beginPath();
      ctx.roundRect(p.x - this.paddleW / 2, p.y - this.paddleH / 2, this.paddleW, this.paddleH, 7);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 16;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Inner grip core
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(p.x - this.paddleW * 0.4, p.y - this.paddleH * 0.25, this.paddleW * 0.8, this.paddleH * 0.5, 3);
      ctx.fill();
      ctx.restore();
    });

    // Glowing Neon Ball
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.ball.x, this.ball.y, this.ball.r, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 16;
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
    // Draw procedural Cowboy duelist
    const drawCowboy = (color) => {
      ctx.save();
      // Hat shadow
      ctx.beginPath();
      ctx.ellipse(0, 16, 38, 14, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fill();

      // Shoulders / Poncho
      ctx.beginPath();
      ctx.moveTo(-36, 36);
      ctx.lineTo(36, 36);
      ctx.lineTo(26, 12);
      ctx.lineTo(-26, 12);
      ctx.closePath();
      ctx.fillStyle = '#1e2436';
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.fill();
      ctx.stroke();

      // Bandana
      ctx.beginPath();
      ctx.moveTo(-16, 14);
      ctx.lineTo(16, 14);
      ctx.lineTo(0, 26);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();

      // Face silhouette
      ctx.beginPath();
      ctx.arc(0, 2, 16, 0, Math.PI * 2);
      ctx.fillStyle = '#0f1422';
      ctx.fill();

      // Stetson Hat Crown
      ctx.beginPath();
      ctx.roundRect(-18, -24, 36, 26, [8, 8, 2, 2]);
      ctx.fillStyle = '#78350f';
      ctx.fill();

      // Hat Band
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(-18, -3, 36, 5);

      // Curved Hat Brim
      ctx.beginPath();
      ctx.ellipse(0, 2, 44, 11, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#92400e';
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 2;
      ctx.fill();
      ctx.stroke();

      ctx.restore();
    };

    // P2 Cowboy Top
    ctx.save();
    ctx.translate(width / 2, height * 0.28);
    ctx.rotate(Math.PI);
    drawCowboy('#fda4af');
    ctx.restore();

    // P1 Cowboy Bottom
    ctx.save();
    ctx.translate(width / 2, height * 0.72);
    drawCowboy('#38bdf8');
    ctx.restore();

    // Dueling Laser Sight when BANG triggers
    if (this.state === 'BANG') {
      ctx.save();
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 12;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.moveTo(width / 2, height * 0.32);
      ctx.lineTo(width / 2, height * 0.68);
      ctx.stroke();
      ctx.restore();
    }

    // High-noon Duelist Trigger Buttons
    const drawTriggerBtn = (y, color, text) => {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(width / 2 - 80, y - 22, 160, 44, 22);
      ctx.fillStyle = 'rgba(24, 30, 46, 0.85)';
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = color;
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.stroke();

      ctx.font = '800 13px Outfit, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, width / 2, y);
      ctx.restore();
    };

    drawTriggerBtn(height * 0.9, '#38bdf8', this.state === 'BANG' ? '🔥 ВЫСТРЕЛ!' : '🖐️ КОБУРА');
    ctx.save();
    ctx.translate(width, height);
    ctx.rotate(Math.PI);
    drawTriggerBtn(height * 0.9, '#fda4af', this.state === 'BANG' ? '🔥 ВЫСТРЕЛ!' : '🖐️ КОБУРА');
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

    // Helper to draw a detailed procedural Kunai Knife
    const drawKnifeShape = (color) => {
      // Blade
      ctx.beginPath();
      ctx.moveTo(0, -18);
      ctx.lineTo(5, -2);
      ctx.lineTo(4, 8);
      ctx.lineTo(-4, 8);
      ctx.lineTo(-5, -2);
      ctx.closePath();
      ctx.fillStyle = '#e2e8f0';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
      ctx.shadowBlur = 4;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Blade center ridge
      ctx.beginPath();
      ctx.moveTo(0, -17);
      ctx.lineTo(0, 8);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Crossguard
      ctx.fillStyle = '#334155';
      ctx.fillRect(-7, 8, 14, 3);

      // Wrapped Handle
      ctx.fillStyle = color;
      ctx.fillRect(-3.5, 11, 7, 14);

      // Handle wraps
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-3.5, 15); ctx.lineTo(3.5, 15);
      ctx.moveTo(-3.5, 19); ctx.lineTo(3.5, 19);
      ctx.moveTo(-3.5, 23); ctx.lineTo(3.5, 23);
      ctx.stroke();

      // Pommel Ring
      ctx.beginPath();
      ctx.arc(0, 27, 4, 0, Math.PI * 2);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.stroke();
    };

    // Draw central spinning wooden target log
    ctx.save();
    ctx.translate(width / 2, centerY);
    ctx.rotate(this.targetAngle);

    // Target shadow
    ctx.beginPath();
    ctx.arc(4, 6, this.targetRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fill();

    // Outer bark rim
    ctx.beginPath();
    ctx.arc(0, 0, this.targetRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#3f2212';
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#271406';
    ctx.stroke();

    // Metal band with rivets
    ctx.beginPath();
    ctx.arc(0, 0, this.targetRadius - 4, 0, Math.PI * 2);
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Concentric wood growth rings
    [0.82, 0.62, 0.42, 0.24].forEach((scale, idx) => {
      ctx.beginPath();
      ctx.arc(0, 0, this.targetRadius * scale, 0, Math.PI * 2);
      ctx.fillStyle = idx % 2 === 0 ? '#92400e' : '#78350f';
      ctx.fill();
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Central Bullseye
    ctx.beginPath();
    ctx.arc(0, 0, this.targetRadius * 0.16, 0, Math.PI * 2);
    ctx.fillStyle = '#dc2626';
    ctx.fill();
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw stuck knives
    this.knives.forEach(k => {
      ctx.save();
      ctx.rotate(k.angle);
      ctx.translate(this.targetRadius + 12, 0);
      ctx.rotate(Math.PI / 2);
      drawKnifeShape(k.owner === 1 ? '#38bdf8' : '#fda4af');
      ctx.restore();
    });

    ctx.restore();

    // Draw flying knives
    this.flyingKnives.forEach(fk => {
      ctx.save();
      ctx.translate(fk.x, fk.y);
      if (fk.vy > 0) ctx.rotate(Math.PI);
      drawKnifeShape(fk.owner === 1 ? '#38bdf8' : '#fda4af');
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
    // Tap Guide Indicators on each half
    ctx.save();
    ctx.font = '700 12px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillText('◀ ВЛЕВО', width * 0.25, height * 0.82);
    ctx.fillText('ВПРАВО ▶', width * 0.75, height * 0.82);

    ctx.save();
    ctx.translate(width, height);
    ctx.rotate(Math.PI);
    ctx.fillText('◀ ВЛЕВО', width * 0.25, height * 0.82);
    ctx.fillText('ВПРАВО ▶', width * 0.75, height * 0.82);
    ctx.restore();
    ctx.restore();

    // Tron Light Ribbons
    [this.p1, this.p2].forEach(s => {
      ctx.save();
      // Outer neon bloom
      ctx.strokeStyle = s.color;
      ctx.shadowColor = s.color;
      ctx.shadowBlur = 16;
      ctx.lineWidth = 7;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      s.trail.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.lineTo(s.x, s.y);
      ctx.stroke();

      // Inner intense core
      ctx.shadowBlur = 0;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Head / Light-cycle cockpit
      ctx.save();
      ctx.translate(s.x, s.y);
      const ang = Math.atan2(s.dir.y, s.dir.x);
      ctx.rotate(ang);

      // Cockpit body
      ctx.beginPath();
      ctx.roundRect(-8, -6, 16, 12, 4);
      ctx.fillStyle = s.color;
      ctx.shadowColor = s.color;
      ctx.shadowBlur = 14;
      ctx.fill();

      // Windshield
      ctx.beginPath();
      ctx.arc(2, 0, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      ctx.restore();
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
      sounds.vibrate([60, 100, 120]);
      triggerHitStop(10);
      addScreenShake(24);
      createShockwave(b.x, b.y, '#f87171', 300);
      createSparks(b.x, b.y, '#fbbf24', 45, 11);
      createConfetti(b.x, b.y, 60);

      // Loser is whoever has the bomb on their half!
      const loser = b.y > height / 2 ? 1 : 2;
      const winner = loser === 1 ? 2 : 1;
      onRoundWon(winner, `БАБАХ! ПОБЕДА: ИГРОК ${winner} 💣💥`);
    }
  }

  draw() {
    const b = this.bomb;
    const isPanic = this.timeLeft < 2.5;
    const pulseScale = isPanic ? (1 + 0.08 * Math.sin(performance.now() * 0.025)) : 1;

    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.scale(pulseScale, pulseScale);

    // Floor shadow
    ctx.beginPath();
    ctx.ellipse(3, b.r + 4, b.r * 0.85, b.r * 0.35, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fill();

    // Fuse Rope & Collar
    ctx.fillStyle = '#475569';
    ctx.fillRect(-6, -b.r - 8, 12, 8);

    ctx.beginPath();
    ctx.moveTo(0, -b.r - 8);
    ctx.quadraticCurveTo(8, -b.r - 20, 16, -b.r - 16);
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // Burning Sizzle Spark on Fuse Tip
    const tipX = 16;
    const tipY = -b.r - 16;
    ctx.beginPath();
    ctx.arc(tipX, tipY, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = '#fef08a';
    ctx.shadowColor = '#f97316';
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.shadowBlur = 0;

    // 3D Metallic Bomb Body
    const bGrad = ctx.createRadialGradient(-b.r * 0.35, -b.r * 0.35, b.r * 0.1, 0, 0, b.r);
    if (isPanic) {
      bGrad.addColorStop(0, '#fca5a5');
      bGrad.addColorStop(0.6, '#ef4444');
      bGrad.addColorStop(1, '#450a0a');
    } else {
      bGrad.addColorStop(0, '#64748b');
      bGrad.addColorStop(0.5, '#1e293b');
      bGrad.addColorStop(1, '#020617');
    }

    ctx.beginPath();
    ctx.arc(0, 0, b.r, 0, Math.PI * 2);
    ctx.fillStyle = bGrad;
    ctx.shadowColor = isPanic ? 'rgba(239, 68, 68, 0.6)' : 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = isPanic ? 22 : 12;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Skull / Hazard symbol on bomb center
    ctx.fillStyle = isPanic ? '#ffffff' : 'rgba(255, 255, 255, 0.45)';
    ctx.beginPath();
    ctx.arc(0, -2, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(-5, 4, 10, 4);

    // Timer display badge
    ctx.font = '800 15px Outfit, sans-serif';
    ctx.fillStyle = isPanic ? '#f87171' : '#f8fafc';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${Math.max(0, this.timeLeft).toFixed(1)}s`, 0, -b.r - 28);

    ctx.restore();

    // Players
    [this.p1, this.p2].forEach(p => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 18;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 0.72, 0, Math.PI * 2);
      ctx.fillStyle = '#111624';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
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

// Ambient floating dust / stars in Menu background
const menuParticles = Array.from({ length: 32 }, () => ({
  x: Math.random() * (window.innerWidth || 400),
  y: Math.random() * (window.innerHeight || 800),
  r: Math.random() * 2.5 + 0.8,
  speed: Math.random() * 0.45 + 0.2,
  sway: Math.random() * Math.PI * 2,
  swaySpeed: Math.random() * 0.02 + 0.01,
  color: Math.random() > 0.5 ? 'rgba(56, 189, 248,' : 'rgba(253, 164, 175,'
}));

function updateAndDrawMenuBackground() {
  ctx.fillStyle = '#0a0d16';
  ctx.fillRect(0, 0, width, height);

  // Soft cyber grid overlay
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
  ctx.lineWidth = 1;
  const step = 44;
  for (let x = 0; x < width; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Floating glowing particles
  for (let p of menuParticles) {
    p.y -= p.speed;
    p.sway += p.swaySpeed;
    p.x += Math.sin(p.sway) * 0.35;
    if (p.y < -10) {
      p.y = height + 10;
      p.x = Math.random() * width;
    }
    const alpha = (0.25 + 0.18 * Math.sin(p.sway * 1.5)).toFixed(2);
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.color + alpha + ')';
    ctx.shadowColor = p.color + '0.6)';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;
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
    drawArenaBackground();
    if (hitStopFrames > 0) {
      hitStopFrames--;
    } else {
      currentMiniGame.update();
    }
    currentMiniGame.draw();
    updateAndDrawEffects();
  } else {
    updateAndDrawMenuBackground();
  }

  ctx.restore();
  requestAnimationFrame(masterLoop);
}

// Start master loop
requestAnimationFrame(masterLoop);
updateScoreHUD();
