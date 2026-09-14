// --- FINGER CLASH ARENA: Core Game Engine ---

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// --- Audio Synthesizer (Web Audio API) ---
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
  playDash() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(450, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
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
    gain.gain.setValueAtTime(Math.min(0.8, 0.25 * power), this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }
  playPowerup() {
    if (!this.ctx) return;
    const notes = [440, 554, 659, 880];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.05);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime + idx * 0.05);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + idx * 0.05 + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + idx * 0.05);
      osc.stop(this.ctx.currentTime + idx * 0.05 + 0.15);
    });
  }
  playExplosion() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(110, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(25, this.ctx.currentTime + 0.5);
    gain.gain.setValueAtTime(0.6, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.5);
  }
}
const sound = new SoundController();

// --- Screen & Dimension Setup ---
let width = window.innerWidth;
let height = window.innerHeight;
let arenaRadius = 200;
let arenaCenter = { x: width / 2, y: height / 2 };

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * window.devicePixelRatio;
  canvas.height = height * window.devicePixelRatio;
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  arenaCenter = { x: width / 2, y: height / 2 };
  arenaRadius = Math.min(width, height) * 0.44;
}
window.addEventListener('resize', resize);
resize();

// --- Particles & Screen Shake ---
let screenShake = 0;
const particles = [];
const shockwaves = [];

function triggerShake(amt) {
  screenShake = Math.max(screenShake, amt);
}

function spawnSparks(x, y, color, count = 15) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 6 + 2;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color,
      size: Math.random() * 4 + 2,
      alpha: 1,
      decay: Math.random() * 0.04 + 0.02
    });
  }
}

function spawnShockwave(x, y, color) {
  shockwaves.push({ x, y, r: 10, maxR: 70, alpha: 1, color });
}

// --- Game State & Players ---
const WIN_SCORE = 3;
let p1Score = 0;
let p2Score = 0;
let gameState = 'START'; // 'START', 'COUNTDOWN', 'PLAYING', 'ROUND_OVER', 'MATCH_OVER'
let roundCountdown = 3;
let countdownTimer = 0;

class Player {
  constructor(id, color, name, isP1) {
    this.id = id;
    this.isP1 = isP1;
    this.color = color;
    this.name = name;
    this.radius = 32;
    this.baseRadius = 32;
    this.mass = 1;
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.friction = 0.965;
    this.isDead = false;
    this.deadTimer = 0;
    
    // Aiming state
    this.isAiming = false;
    this.aimStart = { x: 0, y: 0 };
    this.aimCurrent = { x: 0, y: 0 };
    this.pointerId = null;

    // Powerup states
    this.hasShield = false;
    this.superSpeedTimer = 0;
  }

  reset(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.radius = this.baseRadius;
    this.mass = 1;
    this.isDead = false;
    this.deadTimer = 0;
    this.isAiming = false;
    this.pointerId = null;
    this.hasShield = false;
    this.superSpeedTimer = 0;
  }

  update() {
    if (this.isDead) {
      this.deadTimer += 0.05;
      this.radius = Math.max(0, this.baseRadius * (1 - this.deadTimer));
      return;
    }

    // Physics movement
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= this.friction;
    this.vy *= this.friction;

    if (this.superSpeedTimer > 0) {
      this.superSpeedTimer--;
      // Spawn trail
      if (Math.random() < 0.4) {
        particles.push({
          x: this.x, y: this.y,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          color: '#ffea00',
          size: 5,
          alpha: 0.8,
          decay: 0.05
        });
      }
    }

    // Check Fall off arena
    const distToCenter = Math.hypot(this.x - arenaCenter.x, this.y - arenaCenter.y);
    if (distToCenter > arenaRadius + this.radius * 0.6) {
      this.die();
    }
  }

  die() {
    if (this.isDead) return;
    this.isDead = true;
    sound.playExplosion();
    triggerShake(15);
    spawnSparks(this.x, this.y, this.color, 35);
    spawnShockwave(this.x, this.y, '#ff4444');
    handleRoundEnd(this.isP1 ? p2 : p1);
  }

  launch(dx, dy) {
    const maxDrag = 140;
    const len = Math.hypot(dx, dy);
    const clampedLen = Math.min(len, maxDrag);
    if (clampedLen < 15) return; // Too short drag

    const powerRatio = clampedLen / maxDrag;
    let launchForce = powerRatio * 22;
    if (this.superSpeedTimer > 0) launchForce *= 1.6;

    const angle = Math.atan2(dy, dx);
    this.vx = -Math.cos(angle) * launchForce;
    this.vy = -Math.sin(angle) * launchForce;

    sound.playDash();
    triggerShake(4 * powerRatio);
    spawnShockwave(this.x, this.y, this.color);
  }

  draw() {
    if (this.radius <= 0) return;

    ctx.save();
    // Glow effect
    ctx.shadowColor = this.color;
    ctx.shadowBlur = this.superSpeedTimer > 0 ? 30 : 15;

    // Body
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();

    // Inner rim
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 0.72, 0, Math.PI * 2);
    ctx.fillStyle = '#0f1322';
    ctx.fill();

    // Center Core Gem
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 0.38, 0, Math.PI * 2);
    ctx.fillStyle = this.superSpeedTimer > 0 ? '#ffea00' : this.color;
    ctx.fill();

    // Shield
    if (this.hasShield) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius + 8, 0, Math.PI * 2);
      ctx.strokeStyle = '#00ffcc';
      ctx.lineWidth = 3.5;
      ctx.stroke();
    }

    ctx.restore();

    // Draw Aiming Slingshot Line
    if (this.isAiming && gameState === 'PLAYING') {
      const dx = this.aimCurrent.x - this.aimStart.x;
      const dy = this.aimCurrent.y - this.aimStart.y;
      const len = Math.hypot(dx, dy);
      if (len > 10) {
        const maxDrag = 140;
        const power = Math.min(len, maxDrag) / maxDrag;
        const angle = Math.atan2(dy, dx);

        ctx.save();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 4;
        ctx.setLineDash([8, 6]);

        // Trajectory points
        const targetX = this.x - Math.cos(angle) * (power * 160);
        const targetY = this.y - Math.sin(angle) * (power * 160);

        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(targetX, targetY);
        ctx.stroke();

        // Target reticle
        ctx.beginPath();
        ctx.arc(targetX, targetY, 8 + power * 6, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        ctx.restore();
      }
    }
  }
}

const p1 = new Player(1, '#00e5ff', 'PLAYER 1', true);
const p2 = new Player(2, '#ff4b2b', 'PLAYER 2', false);

// --- Powerups System ---
const powerupTypes = [
  { type: 'BOOST', icon: '⚡', color: '#ffea00' },
  { type: 'BOMB', icon: '💣', color: '#ff2a55' },
  { type: 'SHIELD', icon: '🛡️', color: '#00ffcc' }
];
let activePowerup = null;
let powerupSpawnTimer = 180;

function spawnPowerup() {
  const chosen = powerupTypes[Math.floor(Math.random() * powerupTypes.length)];
  const angle = Math.random() * Math.PI * 2;
  const dist = Math.random() * (arenaRadius * 0.6);
  activePowerup = {
    ...chosen,
    x: arenaCenter.x + Math.cos(angle) * dist,
    y: arenaCenter.y + Math.sin(angle) * dist,
    radius: 20,
    pulse: 0
  };
  sound.playPowerup();
  spawnShockwave(activePowerup.x, activePowerup.y, chosen.color);
}

// --- Collision Resolution ---
function resolvePlayerCollision(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.hypot(dx, dy);
  const minDist = a.radius + b.radius;

  if (dist < minDist && dist > 0) {
    // Overlap push
    const overlap = minDist - dist;
    const nx = dx / dist;
    const ny = dy / dist;
    a.x -= nx * overlap * 0.5;
    a.y -= ny * overlap * 0.5;
    b.x += nx * overlap * 0.5;
    b.y += ny * overlap * 0.5;

    // Normal velocity
    const kx = a.vx - b.vx;
    const ky = a.vy - b.vy;
    const p = 2 * (nx * kx + ny * ky) / (a.mass + b.mass);

    let impulseMultiplier = 1.35; // Bouncy elastic impact
    if (a.hasShield) { a.hasShield = false; impulseMultiplier = 0.5; }
    if (b.hasShield) { b.hasShield = false; impulseMultiplier = 0.5; }

    a.vx -= p * b.mass * nx * impulseMultiplier;
    a.vy -= p * b.mass * ny * impulseMultiplier;
    b.vx += p * a.mass * nx * impulseMultiplier;
    b.vy += p * a.mass * ny * impulseMultiplier;

    const hitImpact = Math.hypot(kx, ky);
    sound.playHit(hitImpact);
    triggerShake(Math.min(12, hitImpact * 1.5));
    spawnSparks((a.x + b.x) / 2, (a.y + b.y) / 2, '#ffffff', 20);
  }
}

function checkPowerupPickup(player) {
  if (!activePowerup) return;
  const dist = Math.hypot(player.x - activePowerup.x, player.y - activePowerup.y);
  if (dist < player.radius + activePowerup.radius) {
    sound.playPowerup();
    triggerShake(6);
    spawnSparks(activePowerup.x, activePowerup.y, activePowerup.color, 25);

    if (activePowerup.type === 'BOOST') {
      player.superSpeedTimer = 350;
    } else if (activePowerup.type === 'SHIELD') {
      player.hasShield = true;
    } else if (activePowerup.type === 'BOMB') {
      sound.playExplosion();
      triggerShake(18);
      const other = player === p1 ? p2 : p1;
      const bdx = other.x - activePowerup.x;
      const bdy = other.y - activePowerup.y;
      const blen = Math.hypot(bdx, bdy) || 1;
      other.vx += (bdx / blen) * 32;
      other.vy += (bdy / blen) * 32;
    }

    activePowerup = null;
    powerupSpawnTimer = 300;
  }
}

// --- Round & Match Flow ---
function startNewRound() {
  gameState = 'COUNTDOWN';
  roundCountdown = 3;
  countdownTimer = 60;
  activePowerup = null;
  powerupSpawnTimer = 180;

  // Position players on opposite ends
  const offset = arenaRadius * 0.58;
  p1.reset(arenaCenter.x, arenaCenter.y + offset);
  p2.reset(arenaCenter.x, arenaCenter.y - offset);

  const announcer = document.getElementById('round-announcer');
  announcer.classList.remove('hidden');
  announcer.innerText = 'READY...';
}

function handleRoundEnd(winner) {
  gameState = 'ROUND_OVER';
  if (winner === p1) {
    p1Score++;
    updateScores();
  } else if (winner === p2) {
    p2Score++;
    updateScores();
  }

  setTimeout(() => {
    if (p1Score >= WIN_SCORE || p2Score >= WIN_SCORE) {
      endMatch(p1Score >= WIN_SCORE ? p1 : p2);
    } else {
      startNewRound();
    }
  }, 1200);
}

function updateScores() {
  const p1Dots = document.querySelectorAll('#p1-score .dot');
  const p2Dots = document.querySelectorAll('#p2-score .dot');
  p1Dots.forEach((dot, idx) => {
    dot.classList.toggle('active', idx < p1Score);
  });
  p2Dots.forEach((dot, idx) => {
    dot.classList.toggle('active', idx < p2Score);
  });
}

function endMatch(champion) {
  gameState = 'MATCH_OVER';
  const modal = document.getElementById('modal-overlay');
  const winnerBox = document.getElementById('winner-box');
  const winnerName = document.getElementById('winner-name');
  const startBtn = document.getElementById('start-btn');

  winnerBox.classList.remove('hidden');
  winnerName.innerText = `${champion.name} WINS!`;
  winnerName.style.color = champion.color;
  startBtn.innerText = 'PLAY AGAIN 🔄';
  modal.classList.remove('hidden');
}

// --- Multi-touch & Mouse Controls ---
function getPlayerForPosition(y) {
  return y > height / 2 ? p1 : p2;
}

canvas.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  sound.init();
  if (gameState !== 'PLAYING') return;

  const rect = canvas.getBoundingClientRect();
  const px = e.clientX - rect.left;
  const py = e.clientY - rect.top;

  const targetPlayer = getPlayerForPosition(py);
  if (!targetPlayer.isAiming) {
    targetPlayer.isAiming = true;
    targetPlayer.pointerId = e.pointerId;
    targetPlayer.aimStart = { x: px, y: py };
    targetPlayer.aimCurrent = { x: px, y: py };
  }
});

canvas.addEventListener('pointermove', (e) => {
  e.preventDefault();
  [p1, p2].forEach(p => {
    if (p.isAiming && p.pointerId === e.pointerId) {
      const rect = canvas.getBoundingClientRect();
      p.aimCurrent = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
  });
});

function handlePointerUp(e) {
  [p1, p2].forEach(p => {
    if (p.isAiming && p.pointerId === e.pointerId) {
      const dx = p.aimCurrent.x - p.aimStart.x;
      const dy = p.aimCurrent.y - p.aimStart.y;
      p.launch(dx, dy);
      p.isAiming = false;
      p.pointerId = null;
    }
  });
}

canvas.addEventListener('pointerup', handlePointerUp);
canvas.addEventListener('pointercancel', handlePointerUp);

// Keyboard Controls for PC Testing
window.addEventListener('keydown', (e) => {
  sound.init();
  if (gameState !== 'PLAYING') return;
  const speed = 14;
  // P1: WASD
  if (e.key === 'w' || e.key === 'W') p1.vy -= speed;
  if (e.key === 's' || e.key === 'S') p1.vy += speed;
  if (e.key === 'a' || e.key === 'A') p1.vx -= speed;
  if (e.key === 'd' || e.key === 'D') p1.vx += speed;

  // P2: Arrows
  if (e.key === 'ArrowUp') p2.vy -= speed;
  if (e.key === 'ArrowDown') p2.vy += speed;
  if (e.key === 'ArrowLeft') p2.vx -= speed;
  if (e.key === 'ArrowRight') p2.vx += speed;
});

// --- UI Listeners ---
document.getElementById('start-btn').addEventListener('click', () => {
  sound.init();
  p1Score = 0;
  p2Score = 0;
  updateScores();
  document.getElementById('modal-overlay').classList.add('hidden');
  startNewRound();
});

// --- Main Render & Game Loop ---
function drawArena() {
  ctx.save();
  // Outer void glow
  ctx.beginPath();
  ctx.arc(arenaCenter.x, arenaCenter.y, arenaRadius + 14, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255, 75, 43, 0.25)';
  ctx.lineWidth = 14;
  ctx.stroke();

  // Arena platform border
  ctx.beginPath();
  ctx.arc(arenaCenter.x, arenaCenter.y, arenaRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#141829';
  ctx.fill();
  ctx.strokeStyle = '#394572';
  ctx.lineWidth = 6;
  ctx.stroke();

  // Cyber grid pattern on arena floor
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.lineWidth = 2;
  const step = 40;
  for (let x = arenaCenter.x - arenaRadius; x < arenaCenter.x + arenaRadius; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, arenaCenter.y - arenaRadius);
    ctx.lineTo(x, arenaCenter.y + arenaRadius);
    ctx.stroke();
  }
  for (let y = arenaCenter.y - arenaRadius; y < arenaCenter.y + arenaRadius; y += step) {
    ctx.beginPath();
    ctx.moveTo(arenaCenter.x - arenaRadius, y);
    ctx.lineTo(arenaCenter.x + arenaRadius, y);
    ctx.stroke();
  }

  // Inner decorative ring
  ctx.beginPath();
  ctx.arc(arenaCenter.x, arenaCenter.y, arenaRadius * 0.4, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(0, 229, 255, 0.15)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.restore();
}

function updateAndDrawEffects() {
  // Particles
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.alpha -= p.decay;
    if (p.alpha <= 0) {
      particles.splice(i, 1);
      continue;
    }
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Shockwaves
  for (let i = shockwaves.length - 1; i >= 0; i--) {
    const s = shockwaves[i];
    s.r += 3.5;
    s.alpha -= 0.04;
    if (s.alpha <= 0 || s.r >= s.maxR) {
      shockwaves.splice(i, 1);
      continue;
    }
    ctx.save();
    ctx.globalAlpha = s.alpha;
    ctx.strokeStyle = s.color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

function drawPowerup() {
  if (!activePowerup) return;
  activePowerup.pulse = (activePowerup.pulse + 0.08) % (Math.PI * 2);
  const scale = 1 + Math.sin(activePowerup.pulse) * 0.15;

  ctx.save();
  ctx.shadowColor = activePowerup.color;
  ctx.shadowBlur = 18;
  ctx.beginPath();
  ctx.arc(activePowerup.x, activePowerup.y, activePowerup.radius * scale, 0, Math.PI * 2);
  ctx.fillStyle = activePowerup.color;
  ctx.fill();

  ctx.font = '18px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(activePowerup.icon, activePowerup.x, activePowerup.y);
  ctx.restore();
}

function gameLoop() {
  // Screen shake calculation
  let sx = 0, sy = 0;
  if (screenShake > 0) {
    sx = (Math.random() - 0.5) * screenShake;
    sy = (Math.random() - 0.5) * screenShake;
    screenShake *= 0.9;
    if (screenShake < 0.2) screenShake = 0;
  }

  ctx.save();
  ctx.clearRect(0, 0, width, height);
  ctx.translate(sx, sy);

  drawArena();
  drawPowerup();

  if (gameState === 'COUNTDOWN') {
    countdownTimer--;
    const announcer = document.getElementById('round-announcer');
    if (countdownTimer <= 0) {
      roundCountdown--;
      countdownTimer = 50;
      if (roundCountdown > 0) {
        announcer.innerText = roundCountdown;
      } else if (roundCountdown === 0) {
        announcer.innerText = 'CLASH! 🔥';
      } else {
        announcer.classList.add('hidden');
        gameState = 'PLAYING';
      }
    }
  }

  if (gameState === 'PLAYING') {
    p1.update();
    p2.update();
    resolvePlayerCollision(p1, p2);
    checkPowerupPickup(p1);
    checkPowerupPickup(p2);

    powerupSpawnTimer--;
    if (powerupSpawnTimer <= 0 && !activePowerup) {
      spawnPowerup();
    }
  }

  p1.draw();
  p2.draw();
  updateAndDrawEffects();

  ctx.restore();
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
