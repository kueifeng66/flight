# Thunder Loop — Vertical-Scrolling Arcade Shooter (Shmup)

A complete, self-contained implementation of the **Thunder Loop Game Design Document** inspired by the classic PC-Engine / Arcade vertical shooter *Raiden (PCE 雷電 一輪一道通關 / Raiden 1LOOP 1CC)*.

---

## 🚀 How to Play (Zero Web Server Required!)

This project is built as a **100% self-contained static web application**. You do **not** need to install Node.js, run Python, or host a web server.

### On Desktop (Windows / Mac / Linux):
1. Navigate to the `flight` directory.
2. Double-click [**`index.html`**](file:///c:/Users/USER/OneDrive/桌面/flight/index.html) to open it directly in Chrome, Edge, Safari, Firefox, or any modern web browser.
3. Click **"START MISSION"** to play!

### On iPhone (iOS Safari):
1. You can open `index.html` via the iOS Files app, AirDrop it, or open it from any static hosting service (e.g. GitHub Pages, Netlify).
2. Add to Home Screen (optional) for a full-screen borderless arcade experience.
3. Tap anywhere on screen to enable Web Audio, then drag with your finger to steer!

---

## 🕹️ Controls Guide

### Desktop Controls:
- **Movement (8 directions)**: `Arrow Keys` or `W`, `A`, `S`, `D`
- **Fire Main Cannon**: `Z` or `Space` or `J`
- **Screen-Clear Bomb**: `B` or `X` or `K` (also supports Right-Click!)
- **Precision Focus Mode**: Hold `Shift` (slows movement & reveals the cockpit hitbox)
- **Pause Mission**: `P` or `Esc`
- **Gamepad Support**: Plug in any standard USB/Bluetooth controller (D-Pad/Stick to move, `A` to fire, `B` to bomb, Bumpers to focus).

### iPhone & Touch Screen Controls:
- **Steer**: Touch and drag anywhere on the screen. Features an intelligent vertical touch offset so your thumb never obscures your ship or the cockpit hitbox.
- **Auto-Fire**: Enabled by default on mobile (can be toggled in the pause menu).
- **Bomb**: Tap the large green **BOMB** button on the bottom right.
- **Focus Mode**: Tap the blue **FOCUS** button on the bottom left to toggle micro-dodging mode.
- **Pause**: Tap the **⏸** button on the top right.

---

## ⚡ Game Systems & Features (From the GDD)

### 1. High-Resolution & Realistic Visual Design
- **720 x 1080 High-Definition Canvas**: Crisp sub-pixel anti-aliasing with 2.25x pixel count upgrade for razor-sharp visual clarity.
- **Realistic Military Stealth Fighter**: Matte titanium radar-absorbent fuselage, swept composite wings, bubble canopy with iridescent 3D glass reflections and HUD optic glare, and supersonic turbofans with real-time **Mach shock diamonds** and volumetric heat distortion.
- **Realistic Armored War Machines**: Main Battle Tanks with reactive armor tiles and rifled recoil cannons, attack helicopters with motion-blurred composite rotor discs, stealth bombers with opening payload bay doors, and battleships with bow water spray.

### 2. Hyper-Realistic Thermobaric Super Bomb
- **Trigger**: Press **`B`**, `X`, `K`, Right-Click, or tap the on-screen **BOMB** button.
- **Thermobaric Shockwave Physics**:
  1. **Detonation Flash**: Blinding nuclear-white exposure flash blowout.
  2. **Refractive Blast Wave**: Expanding blue EMP ionization ring that instantly vaporizes and converts all enemy bullets into electric sparks.
  3. **Volumetric Churning Fireball**: 16 turbulent boiling flame lobes expanding outward from white-hot plasma to molten amber and churning dark charcoal soot clouds.
  4. **Incandescent Shrapnel**: 80+ high-velocity burning magnesium sparks erupting radially with atmospheric drag and gravity.
  5. **Cinematic Acoustics**: Supersonic crack transient, seismic sub-bass boom (down to 18Hz), and cascading thunderous rumble.

### 2. Deep Weapon System
- **Red Vulcan Spread (`V`)**: Fires a wide fan of plasma shots (up to 5 streams at Level 4). Best against swarms and agile aircraft.
- **Blue Piercing Laser (`L`)**: Fires concentrated energy beams that pierce through multiple enemies and boss armor.
- **Switching Colors**: Switching between Vulcan and Laser **preserves your current weapon level**!
- **Homing Missiles (`M`)**: Micro-rockets that track off-axis enemies with smoke trails (Levels 1 to 3).
- **Death Penalty**: Losing a life drops your weapon and missile levels by 1, so staying alive is how you stay strong.

### 3. All 8 Stages & Unique Bosses
1. **Coastal Strike** (Beaches & patrol boats) — *Boss: Gunboat Leviathan*
2. **Desert Convoy** (Supply lines & tank columns) — *Boss: Sandstrider*
3. **City Ruins** (Rooftop turrets & skyscrapers) — *Boss: Sky Fortress*
4. **Jungle Canopy** (Hidden emplacements & rivers) — *Boss: Hydra Walker*
5. **Industrial Complex** (Conveyors & molten iron) — *Boss: Foundry Core*
6. **Mountain Citadel** (Cliff batteries & bullet corridors) — *Boss: Citadel Guardian*
7. **Orbital Platform** (Space debris & solar arrays) — *Boss: Satellite Array*
8. **Command Center** (Remix of hostile forces) — *Boss: Overlord Mk-II* (3-phase final encounter!)

### 4. Loop 2 Mechanics
Clearing Stage 8 restarts the war into **Loop 2**:
- Bullets travel ~35% faster.
- Enemies fire on death (**revenge / suicide bullets**).
- Bosses gain accelerated attack speeds and enhanced bullet patterns.
- Beating the game on a single credit awards the prestigious **1CC Badge**!

### 5. Scoring & Dynamic Rank System
- **Medal Chaining**: Gold medals dropped by key enemies scale: `100 ➔ 200 ➔ 500 ➔ 1,000 ➔ 2,000 ➔ 5,000 ➔ 10,000` points. If a medal falls off the bottom of the screen, the chain resets to 100!
- **End-of-Stage Bonuses**: No-Death bonus (+50,000) and Bomb Stock bonus (+10,000 per bomb).
- **Dynamic Rank**: Surviving and destroying enemies raises rank; dying lowers it.

### 6. Audio & Visuals
- **Pure Web Audio API**: 100% procedural chiptune synth music and retro SFX (no external audio files required, zero CORS errors).
- **Procedural Pixel Art**: Crisp canvas sprites and multi-layered parallax scrolling terrain.
- **CRT Filter**: Toggleable scanlines and CRT vignette effect.
