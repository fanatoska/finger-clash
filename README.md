# 💥 Finger Clash Arena

> **Same-device 2-player sumo bumper duel for Android & Mobile Web.**

Two players clash on a single phone screen in intense, fast-paced rounds! Drag back to aim, unleash high-speed dash physics, collect power-ups, and knock your rival into the void.

---

## 🎮 Features
- **Local 2-Player (Split-Screen)**: Player 1 on bottom, Player 2 on top (with automatically rotated HUD so both players can read comfortably).
- **Smooth Physics**: Momentum transfer, elastic bounces, friction, and responsive slingshot controls.
- **Juicy Game Feel**: Screen shake, dynamic shockwaves, spark particles, and real-time procedural Web Audio sound synthesis (no external audio assets needed).
- **Wild Power-Ups**:
  - ⚡ **Speed Boost**: Super-charged dashes with fire trails.
  - 💣 **Shockwave Bomb**: Launches the opponent violently when detonated.
  - 🛡️ **Shield**: Absorbs impact without knockback.
- **Responsive Viewport**: Adapts to any smartphone resolution in portrait mode.
- **Cross-Platform**: Plays seamlessly in any mobile browser or converted to Android APK (via Capacitor / TWA).

---

## 🚀 How to Run Locally

### Option 1: Python Simple HTTP Server
Open your terminal inside this folder:
```bash
python -m http.server 8080
```
Then open:
- On your computer: `http://localhost:8080`
- On your phone (same Wi-Fi): `http://<YOUR_PC_LOCAL_IP>:8080`

### Option 2: Controls on PC (Testing)
- **Player 1 (Cyan)**: WASD or drag mouse on bottom half of screen
- **Player 2 (Orange/Red)**: Arrow keys or drag mouse on top half of screen

---

## 📱 Packaging for Android APK
You can wrap this directly into an Android app with Capacitor:
```bash
npm init -y
npm i @capacitor/core @capacitor/cli @capacitor/android
npx cap init "Finger Clash" "com.fingerclash.game"
npx cap add android
npx cap open android
```
