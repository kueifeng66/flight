// Thunder Loop - Core Game Engine (High-Resolution 720x1080 Arcade & Mobile Edition)
// Fixed 60 FPS loop, Entity Management, Bullet Pooling, Boss State Machine, Realistic Bomb Physics

class GameEngine {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        // High-Definition Virtual Resolution (2:3 Aspect Ratio)
        this.virtualWidth = 720;
        this.virtualHeight = 1080;
        this.canvas.width = this.virtualWidth;
        this.canvas.height = this.virtualHeight;

        this.bgRenderer = new BackgroundRenderer();

        // Game state: 'title', 'playing', 'paused', 'stage_clear', 'game_over', 'credits'
        this.state = 'title';
        this.difficulty = 'normal'; // 'easy', 'normal', 'hard'
        this.isPracticeMode = false;
        this.practiceStage = 1;

        // Stage & Loop progression
        this.currentStageIndex = 0; // 0 to 7
        this.currentLoop = 1; // 1 or 2
        this.stageTimer = 0;
        this.spawnIndex = 0;
        this.bossActive = false;
        this.currentBoss = null;
        this.bossWarningTimer = 0;

        // Player statistics & scoring
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('thunderloop_highscore') || '50000', 10);
        this.nextLifeScore = 200000;
        this.continuesUsed = 0;
        this.stageDeaths = 0;
        this.medalChain = 0;
        this.medalValues = [100, 200, 500, 1000, 2000, 5000, 10000];
        this.rank = 0.5; // 0.0 to 1.0 dynamic rank

        // Player ship object (Scaled for 720x1080 high definition)
        this.player = {
            x: 360,
            y: 920,
            radius: 4.5, // Tiny cockpit hitbox from GDD
            speed: 390,
            lives: 3,
            bombs: 3,
            maxBombs: 5,
            weaponType: 'V', // 'V' (Vulcan spread) or 'L' (Laser piercing)
            weaponLevel: 1,  // 1 to 4
            missileLevel: 0, // 0 to 3
            invulnerableTimer: 2.5,
            fireCooldown: 0,
            missileCooldown: 0,
            isDead: false,
            respawnTimer: 0
        };

        // Entities
        this.playerBullets = [];
        this.enemyBullets = [];
        this.enemies = [];
        this.pickups = [];
        this.particles = [];
        this.floatingTexts = [];
        this.activeBombs = [];

        // Screen shake & flash
        this.screenShakeTimer = 0;
        this.screenShakeIntensity = 0;
        this.screenFlashTimer = 0;
        this.animTimer = 0;

        // Input state
        this.keys = {};
        this.touchActive = false;
        this.touchPos = { x: 360, y: 920 };
        this.touchOffset = 70; // Calibrated offset so ship stays above finger
        this.autoFire = true;  // Enabled by default on mobile

        // Options
        this.scanlinesEnabled = true;

        this.lastTime = performance.now();

        this.initInput();
        this.updateHUD();
    }

    initInput() {
        // Keyboard listeners
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;

            // Audio unlock on user input
            if (window.audio) window.audio.resume();

            if (e.code === 'KeyP' || e.code === 'Escape') {
                if (this.state === 'playing') this.pauseGame();
                else if (this.state === 'paused') this.resumeGame();
            }

            // TRIGGER BOMB WITH 'B', 'X', OR 'K'!
            if (e.code === 'KeyB' || e.key === 'b' || e.key === 'B' || e.code === 'KeyX' || e.code === 'KeyK') {
                if (this.state === 'playing') this.triggerBomb();
            }

            // Prevent spacebar or arrows scrolling browser page
            if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
                e.preventDefault();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        // Desktop Right-Click triggers Bomb
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if (this.state === 'playing') this.triggerBomb();
        });

        // Touch Listeners for iPhone / Mobile
        const canvasContainer = document.getElementById('canvasWrapper');

        const getTouchCanvasPos = (touch) => {
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.virtualWidth / rect.width;
            const scaleY = this.virtualHeight / rect.height;
            return {
                x: (touch.clientX - rect.left) * scaleX,
                y: (touch.clientY - rect.top) * scaleY
            };
        };

        this.lastTouchTime = 0;

        canvasContainer.addEventListener('touchstart', (e) => {
            if (window.audio) window.audio.resume();
            if (this.state !== 'playing') return;
            e.preventDefault();

            // Multi-touch gesture: 2 or more fingers taps screen to trigger bomb
            if (e.touches.length >= 2) {
                this.triggerBomb();
                return;
            }

            // Quick double-tap gesture to trigger bomb
            const now = performance.now();
            if (this.lastTouchTime && (now - this.lastTouchTime < 320)) {
                this.triggerBomb();
                this.lastTouchTime = 0;
            } else {
                this.lastTouchTime = now;
            }

            const touch = e.touches[0];
            this.touchActive = true;
            const pos = getTouchCanvasPos(touch);
            this.touchPos = pos;
        }, { passive: false });

        canvasContainer.addEventListener('touchmove', (e) => {
            if (this.state !== 'playing') return;
            e.preventDefault();
            const touch = e.touches[0];
            const pos = getTouchCanvasPos(touch);
            this.touchPos = pos;
        }, { passive: false });

        canvasContainer.addEventListener('touchend', (e) => {
            if (e.touches.length === 0) {
                this.touchActive = false;
            }
        }, { passive: false });

        // Desktop Right-Click also drops bomb as convenient shortcut
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if (this.state === 'playing') {
                this.triggerBomb();
            }
        });

        const pauseBtn = document.getElementById('btnPause');
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                if (this.state === 'playing') this.pauseGame();
                else if (this.state === 'paused') this.resumeGame();
            });
        }
    }

    startNewGame(stageNum = 1) {
        if (window.audio) {
            window.audio.init();
            window.audio.resume();
        }

        this.currentStageIndex = stageNum - 1;
        this.currentLoop = 1;
        this.score = 0;
        this.nextLifeScore = 200000;
        this.continuesUsed = 0;
        this.stageDeaths = 0;
        this.medalChain = 0;
        this.rank = this.difficulty === 'easy' ? 0.3 : (this.difficulty === 'hard' ? 0.7 : 0.5);

        // Lives based on difficulty
        const initialLives = this.difficulty === 'easy' ? 5 : (this.difficulty === 'hard' ? 2 : 3);
        this.player.lives = initialLives;
        this.player.bombs = 3;
        this.player.weaponType = 'V';
        this.player.weaponLevel = 1;
        this.player.missileLevel = 0;
        this.player.x = 360;
        this.player.y = 920;
        this.player.invulnerableTimer = 2.5;
        this.player.isDead = false;

        this.loadStage(this.currentStageIndex);
        this.state = 'playing';

        document.getElementById('screenTitle').classList.add('hidden');
        document.getElementById('screenGameOver').classList.add('hidden');
        document.getElementById('screenStageClear').classList.add('hidden');
        document.getElementById('screenCredits').classList.add('hidden');
        document.getElementById('screenPause').classList.add('hidden');

        this.updateHUD();
    }

    loadStage(stageIndex) {
        this.currentStageIndex = stageIndex;
        this.stageTimer = 0;
        this.spawnIndex = 0;
        this.bossActive = false;
        this.currentBoss = null;
        this.bossWarningTimer = 0;
        this.stageDeaths = 0;

        // Clear battlefield
        this.enemies = [];
        this.playerBullets = [];
        this.enemyBullets = [];
        this.pickups = [];
        this.floatingTexts = [];
        this.activeBombs = [];

        // Save reached stage for Practice Mode
        const unlockedStages = parseInt(localStorage.getItem('thunderloop_unlocked') || '1', 10);
        if (stageIndex + 1 > unlockedStages) {
            localStorage.setItem('thunderloop_unlocked', (stageIndex + 1).toString());
        }

        const stage = STAGES[stageIndex % STAGES.length];
        this.showFloatingText(360, 480, `STAGE ${stage.number}`, '#38bdf8', 36);
        this.showFloatingText(360, 540, stage.name.toUpperCase(), '#f8fafc', 26);

        if (window.audio) {
            window.audio.startStageMusic(stage.number);
        }

        this.updateHUD();
    }

    // --- MAIN GAME LOOP ---
    run() {
        const loop = (timestamp) => {
            const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
            this.lastTime = timestamp;

            this.update(dt);
            this.render();

            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }

    update(dt) {
        this.animTimer += dt;

        // Screen shake decay
        if (this.screenShakeTimer > 0) {
            this.screenShakeTimer -= dt;
        }

        // Screen flash decay
        if (this.screenFlashTimer > 0) {
            this.screenFlashTimer -= dt;
        }

        if (this.state !== 'playing') {
            this.updateParticles(dt);
            return;
        }

        this.stageTimer += dt;

        // Parallax background scroll
        this.bgRenderer.update(dt, 90);

        // Update Player
        this.updatePlayer(dt);

        // Update Weapons & Projectiles
        this.updatePlayerWeapons(dt);

        // Spawn Stage Waves
        this.updateStageSpawns(dt);

        // Update Boss
        this.updateBoss(dt);

        // Update Enemies
        this.updateEnemies(dt);

        // Update Bullets
        this.updateBullets(dt);

        // Update Pickups
        this.updatePickups(dt);

        // Update Particles, Bombs, and Floats
        this.updateParticles(dt);
        this.updateActiveBombs(dt);
        this.updateFloatingTexts(dt);

        // Check Collisions
        this.checkCollisions();

        // Update HUD
        this.updateHUD();
    }

    // --- PLAYER UPDATE & CONTROLS ---
    updatePlayer(dt) {
        if (this.player.isDead) {
            this.player.respawnTimer -= dt;
            if (this.player.respawnTimer <= 0) {
                if (this.player.lives > 0) {
                    this.player.isDead = false;
                    this.player.x = 360;
                    this.player.y = 940;
                    this.player.invulnerableTimer = 3.0;
                    this.player.weaponLevel = Math.max(1, this.player.weaponLevel - 1);
                    this.player.missileLevel = Math.max(0, this.player.missileLevel - 1);
                    this.rank = Math.max(0.1, this.rank - 0.2);
                } else {
                    this.gameOver();
                }
            }
            return;
        }

        if (this.player.invulnerableTimer > 0) {
            this.player.invulnerableTimer -= dt;
        }

        // Movement Speed
        const currentSpeed = this.player.speed;

        // Keyboard Movement (8-directional)
        let dx = 0;
        let dy = 0;

        if (this.keys['ArrowLeft'] || this.keys['KeyA']) dx -= 1;
        if (this.keys['ArrowRight'] || this.keys['KeyD']) dx += 1;
        if (this.keys['ArrowUp'] || this.keys['KeyW']) dy -= 1;
        if (this.keys['ArrowDown'] || this.keys['KeyS']) dy += 1;

        if (dx !== 0 && dy !== 0) {
            dx *= 0.7071;
            dy *= 0.7071;
        }

        if (dx !== 0 || dy !== 0) {
            this.player.x += dx * currentSpeed * dt;
            this.player.y += dy * currentSpeed * dt;
        } else if (this.touchActive) {
            // Mobile Touch Drag: Smoothly follow finger with offset
            const targetX = this.touchPos.x;
            const targetY = this.touchPos.y - this.touchOffset;
            const touchSpeed = isFocus ? 20 : 30;
            this.player.x += (targetX - this.player.x) * touchSpeed * dt;
            this.player.y += (targetY - this.player.y) * touchSpeed * dt;
        }

        // Clamp to playfield boundaries
        this.player.x = Math.max(30, Math.min(this.virtualWidth - 30, this.player.x));
        this.player.y = Math.max(45, Math.min(this.virtualHeight - 45, this.player.y));

        this.checkGamepad(dt, currentSpeed);
    }

    checkGamepad(dt, speed) {
        if (!navigator.getGamepads) return;
        const gamepads = navigator.getGamepads();
        if (!gamepads || !gamepads[0]) return;

        const gp = gamepads[0];
        const stickX = gp.axes[0];
        const stickY = gp.axes[1];

        if (Math.abs(stickX) > 0.2) this.player.x += stickX * speed * dt;
        if (Math.abs(stickY) > 0.2) this.player.y += stickY * speed * dt;

        if (gp.buttons[0] && gp.buttons[0].pressed) {
            this.fireMainWeapon();
        }
        if (gp.buttons[1] && gp.buttons[1].pressed) {
            this.triggerBomb();
        }
        if ((gp.buttons[4] && gp.buttons[4].pressed) || (gp.buttons[5] && gp.buttons[5].pressed)) {
            this.player.isFocus = true;
        }
    }

    // --- WEAPONS FIRING & MANAGEMENT ---
    updatePlayerWeapons(dt) {
        if (this.player.isDead) return;

        this.player.fireCooldown -= dt;
        this.player.missileCooldown -= dt;

        const isFiring = this.autoFire || this.keys['KeyZ'] || this.keys['Space'] || this.keys['KeyJ'];

        if (isFiring && this.player.fireCooldown <= 0) {
            this.fireMainWeapon();
            this.player.fireCooldown = 0.085; // High rate of fire
        }

        if (this.player.missileLevel > 0 && this.player.missileCooldown <= 0) {
            this.fireHomingMissiles();
            this.player.missileCooldown = 0.52;
        }
    }

    fireMainWeapon() {
        if (this.player.isDead) return;

        const px = this.player.x;
        const py = this.player.y - 20;
        const lv = this.player.weaponLevel;

        if (this.player.weaponType === 'V') {
            // VULCAN INCENDIARY FAN
            if (window.audio) window.audio.playVulcan();
            const bulletSpeed = -1080;

            if (lv === 1) {
                this.playerBullets.push({ x: px, y: py, vx: 0, vy: bulletSpeed, damage: 22, type: 'vulcan' });
            } else if (lv === 2) {
                [-0.16, 0, 0.16].forEach(angle => {
                    const vx = Math.sin(angle) * Math.abs(bulletSpeed);
                    const vy = Math.cos(angle) * bulletSpeed;
                    this.playerBullets.push({ x: px, y: py, vx, vy, damage: 20, type: 'vulcan' });
                });
            } else if (lv === 3) {
                [-0.24, -0.08, 0.08, 0.24].forEach(angle => {
                    const vx = Math.sin(angle) * Math.abs(bulletSpeed);
                    const vy = Math.cos(angle) * bulletSpeed;
                    this.playerBullets.push({ x: px, y: py, vx, vy, damage: 20, type: 'vulcan' });
                });
            } else {
                [-0.36, -0.18, 0, 0.18, 0.36].forEach(angle => {
                    const vx = Math.sin(angle) * Math.abs(bulletSpeed);
                    const vy = Math.cos(angle) * bulletSpeed;
                    this.playerBullets.push({ x: px, y: py, vx, vy, damage: 22, type: 'vulcan' });
                });
            }
        } else {
            // PIERCING PHOTON LASER BEAM
            if (window.audio) window.audio.playLaser();
            const beamWidth = lv === 1 ? 12 : (lv === 2 ? 20 : (lv === 3 ? 30 : 42));
            const beamDamage = 20 + lv * 10;

            this.playerBullets.push({
                x: px,
                y: 0,
                width: beamWidth,
                height: py,
                damage: beamDamage,
                type: 'laser',
                level: lv,
                duration: 0.12
            });
        }
    }

    fireHomingMissiles() {
        if (this.player.isDead) return;
        if (window.audio) window.audio.playMissile();

        const lv = this.player.missileLevel;
        const count = lv * 2;
        const px = this.player.x;
        const py = this.player.y;

        for (let i = 0; i < count; i++) {
            const side = (i % 2 === 0) ? -1 : 1;
            const spread = (Math.floor(i / 2) + 1) * 18 * side;
            this.playerBullets.push({
                x: px + spread,
                y: py,
                vx: side * 140,
                vy: -220,
                angle: -Math.PI / 2 + (side * 0.4),
                speed: 550,
                turnSpeed: 5.2,
                damage: 26,
                type: 'missile',
                target: null,
                smokeTimer: 0
            });
        }
    }

    // --- HYPER-REALISTIC THERMOBARIC SUPER BOMB ---
    triggerBomb() {
        if (this.player.isDead || this.player.bombs <= 0) return;

        this.player.bombs--;
        if (window.audio) window.audio.playBomb();

        // Screen Flash & Seismic Rumble
        this.screenFlashTimer = 0.45;
        this.screenShakeTimer = 0.85;
        this.screenShakeIntensity = 28;
        this.player.invulnerableTimer = Math.max(this.player.invulnerableTimer, 2.2);

        // Cancel all enemy bullets into electric blue EMP spark bursts
        this.enemyBullets.forEach(b => {
            this.spawnExplosion(b.x, b.y, 'small', '#38bdf8');
        });
        this.enemyBullets = [];

        // Massive thermobaric shockwave damage to all active enemies
        this.enemies.forEach(e => {
            e.hp -= 350;
            this.spawnExplosion(e.x, e.y, 'heavy', '#ea580c');
        });

        // Add Active Expanding Thermobaric Explosion
        this.activeBombs.push({
            x: this.player.x,
            y: this.player.y,
            progress: 0,
            duration: 1.8,
            maxRadius: 850
        });

        // Erupt 80+ Incandescent High-Velocity Shrapnel Sparks
        for (let i = 0; i < 80; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 120 + Math.random() * 480;
            this.particles.push({
                x: this.player.x,
                y: this.player.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                maxRadius: 3 + Math.random() * 5,
                age: 0,
                life: 0.8 + Math.random() * 0.9,
                color: Math.random() > 0.35 ? '#fef08a' : '#f97316'
            });
        }

        this.updateHUD();
    }

    updateActiveBombs(dt) {
        for (let i = this.activeBombs.length - 1; i >= 0; i--) {
            const bomb = this.activeBombs[i];
            bomb.progress += dt / bomb.duration;
            if (bomb.progress >= 1.0) {
                this.activeBombs.splice(i, 1);
            }
        }
    }

    // --- STAGE SPAWNS & TIMELINE ---
    updateStageSpawns(dt) {
        if (this.bossActive) return;

        const stage = STAGES[this.currentStageIndex % STAGES.length];
        const spawns = stage.spawns;

        while (this.spawnIndex < spawns.length && this.stageTimer >= spawns[this.spawnIndex].time) {
            const spawn = spawns[this.spawnIndex];
            this.executeSpawn(spawn);
            this.spawnIndex++;
        }

        if (this.stageTimer >= stage.duration && !this.bossActive) {
            this.triggerBossEntrance(stage.boss);
        }
    }

    executeSpawn(spawn) {
        const w = this.virtualWidth;

        if (spawn.type === 'scout_formation') {
            const count = spawn.count || 5;
            for (let i = 0; i < count; i++) {
                setTimeout(() => {
                    if (this.state !== 'playing') return;
                    let startX = spawn.side === 'left' ? 90 : (spawn.side === 'right' ? w - 90 : (i % 2 === 0 ? 90 : w - 90));
                    this.enemies.push({
                        type: 'scout',
                        x: startX,
                        y: -40,
                        vx: spawn.side === 'left' ? 105 : -105,
                        vy: 240,
                        hp: 24,
                        maxHp: 24,
                        score: 300,
                        shootTimer: 0.8 + Math.random() * 0.6,
                        animTimer: 0,
                        isAir: true
                    });
                }, i * 220);
            }
        } else if (spawn.type === 'emplacement') {
            this.enemies.push({
                type: 'emplacement',
                x: spawn.xRatio * w,
                y: -60,
                vx: 0,
                vy: 90,
                hp: 65,
                maxHp: 65,
                score: 500,
                shootTimer: 1.2,
                turretAngle: 0,
                isAir: false
            });
        } else if (spawn.type === 'gunship') {
            this.enemies.push({
                type: 'gunship',
                x: spawn.xRatio * w,
                y: -75,
                vx: 0,
                vy: 180,
                hp: 120,
                maxHp: 120,
                score: 800,
                shootTimer: 1.0,
                burstCount: 3,
                animTimer: 0,
                isAir: true
            });
        } else if (spawn.type === 'helicopter') {
            this.enemies.push({
                type: 'helicopter',
                x: spawn.xRatio * w,
                y: -75,
                vx: (Math.random() - 0.5) * 60,
                vy: 135,
                hp: 110,
                maxHp: 110,
                score: 700,
                shootTimer: 1.4,
                rotorAngle: 0,
                isAir: true
            });
        } else if (spawn.type === 'bomber') {
            this.enemies.push({
                type: 'bomber',
                x: spawn.xRatio * w,
                y: -90,
                vx: (Math.random() - 0.5) * 45,
                vy: 105,
                hp: 240,
                maxHp: 240,
                score: 1200,
                shootTimer: 1.8,
                isAir: true
            });
        } else if (spawn.type === 'carrier') {
            this.enemies.push({
                type: 'carrier',
                x: spawn.xRatio * w,
                y: -130,
                vx: 0,
                vy: 65,
                hp: 420,
                maxHp: 420,
                score: 2500,
                shootTimer: 1.5,
                drop: spawn.drop,
                isFlashing: spawn.isFlashing || false,
                isAir: true
            });
        } else if (spawn.type === 'tank') {
            this.enemies.push({
                type: 'tank',
                x: spawn.xRatio * w,
                y: -60,
                vx: 0,
                vy: 80,
                hp: 90,
                maxHp: 90,
                score: 600,
                shootTimer: 1.1,
                headingAngle: 0,
                turretAngle: 0,
                isAir: false
            });
        } else if (spawn.type === 'railgun') {
            this.enemies.push({
                type: 'railgun',
                x: spawn.xRatio * w,
                y: -100,
                vx: 0,
                vy: 60,
                hp: 320,
                maxHp: 320,
                score: 1800,
                shootTimer: 2.2,
                animTimer: 0,
                isAir: false
            });
        } else if (spawn.type === 'launcher') {
            this.enemies.push({
                type: 'launcher',
                x: spawn.xRatio * w,
                y: -60,
                vx: 0,
                vy: 75,
                hp: 80,
                maxHp: 80,
                score: 550,
                shootTimer: 1.8,
                isAir: false
            });
        }
    }

    // --- BOSS BATTLE CONTROLLER ---
    triggerBossEntrance(bossData) {
        this.bossActive = true;
        this.bossWarningTimer = 3.5;
        if (window.audio) {
            window.audio.playWarningSiren();
            setTimeout(() => {
                if (this.state === 'playing') window.audio.startBossMusic();
            }, 2500);
        }

        const loopMultiplier = this.currentLoop === 2 ? 1.4 : 1.0;
        const totalHp = Math.round(bossData.maxHp * loopMultiplier);

        this.currentBoss = {
            type: bossData.type,
            name: bossData.name,
            title: bossData.title,
            maxHp: totalHp,
            hp: totalHp,
            phase: 1,
            maxPhases: bossData.phases,
            x: 360,
            y: -140,
            targetY: 210,
            vx: 90,
            attackTimer: 1.5,
            subTimer: 0,
            animTimer: 0
        };
    }

    updateBoss(dt) {
        if (!this.bossActive || !this.currentBoss) return;
        const boss = this.currentBoss;
        boss.animTimer += dt;

        if (boss.y < boss.targetY) {
            boss.y += 95 * dt;
            return;
        }

        boss.x += boss.vx * dt;
        if (boss.x < 180) {
            boss.x = 180;
            boss.vx = Math.abs(boss.vx);
        } else if (boss.x > this.virtualWidth - 180) {
            boss.x = this.virtualWidth - 180;
            boss.vx = -Math.abs(boss.vx);
        }

        const hpRatio = boss.hp / boss.maxHp;
        if (hpRatio <= 0.35 && boss.maxPhases >= 3 && boss.phase < 3) {
            boss.phase = 3;
            if (window.audio) window.audio.setBossDesperation(true);
            this.showFloatingText(360, 330, "DESPERATION MODE!", '#ef4444', 28);
            this.screenShakeTimer = 0.6;
            this.screenShakeIntensity = 16;
        } else if (hpRatio <= 0.65 && boss.phase < 2) {
            boss.phase = 2;
            this.showFloatingText(360, 330, "PHASE 2", '#f59e0b', 24);
        }

        boss.attackTimer -= dt;
        if (boss.attackTimer <= 0) {
            this.executeBossAttack(boss);
        }

        if (boss.hp <= 0) {
            this.defeatBoss(boss);
        }
    }

    executeBossAttack(boss) {
        const bx = boss.x;
        const by = boss.y + 30;
        const px = this.player.x;
        const py = this.player.y;
        const angleToPlayer = Math.atan2(py - by, px - bx);
        const bulletSpeed = (260 + this.rank * 90) * (this.currentLoop === 2 ? 1.35 : 1.0);

        if (boss.phase === 1) {
            for (let i = -2; i <= 2; i++) {
                const angle = angleToPlayer + i * 0.18;
                this.spawnEnemyBullet(bx, by, Math.cos(angle) * bulletSpeed, Math.sin(angle) * bulletSpeed, 'orange');
            }
            boss.attackTimer = 1.2;
        } else if (boss.phase === 2) {
            for (let i = 0; i < 10; i++) {
                const angle = (boss.animTimer * 2.2) + i * ((Math.PI * 2) / 10);
                this.spawnEnemyBullet(bx, by, Math.cos(angle) * bulletSpeed * 0.9, Math.sin(angle) * bulletSpeed * 0.9, 'magenta');
            }
            this.spawnEnemyBullet(bx - 50, by, 0, bulletSpeed * 1.1, 'orange');
            this.spawnEnemyBullet(bx + 50, by, 0, bulletSpeed * 1.1, 'orange');
            boss.attackTimer = 0.85;
        } else {
            // Desperation Phase 3 Bullet Storm
            for (let i = 0; i < 16; i++) {
                if (i === 4 || i === 5) continue; // Deliberate gap
                const angle = (boss.animTimer * 3.4) + i * ((Math.PI * 2) / 16);
                this.spawnEnemyBullet(bx, by, Math.cos(angle) * bulletSpeed, Math.sin(angle) * bulletSpeed, 'magenta');
            }
            this.spawnEnemyBullet(bx, by, Math.cos(angleToPlayer) * bulletSpeed * 1.3, Math.sin(angleToPlayer) * bulletSpeed * 1.3, 'molten');
            boss.attackTimer = 0.52;
        }
    }

    defeatBoss(boss) {
        if (window.audio) window.audio.playExplosion('boss');

        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const rx = boss.x + (Math.random() - 0.5) * 150;
                const ry = boss.y + (Math.random() - 0.5) * 120;
                this.spawnExplosion(rx, ry, 'heavy', '#ef4444');
                this.spawnExplosion(rx, ry, 'medium', '#facc15');
                if (window.audio) window.audio.playExplosion('medium');
            }, i * 90);
        }

        this.screenShakeTimer = 2.0;
        this.screenShakeIntensity = 28;

        const bossPoints = 50000 + (this.currentStageIndex + 1) * 10000;
        this.addScore(bossPoints);
        this.showFloatingText(boss.x, boss.y, `+${bossPoints}`, '#fde047', 32);

        this.bossActive = false;
        this.currentBoss = null;

        this.enemyBullets = [];

        setTimeout(() => {
            this.completeStage();
        }, 2200);
    }

    completeStage() {
        this.state = 'stage_clear';
        if (window.audio) window.audio.stopMusic();

        const noDeathBonus = this.stageDeaths === 0 ? 50000 : 0;
        const bombBonus = this.player.bombs * 10000;
        const totalStageBonus = noDeathBonus + bombBonus;

        this.addScore(totalStageBonus);

        document.getElementById('scStageName').textContent = `STAGE ${this.currentStageIndex + 1} CLEAR!`;
        document.getElementById('scNoDeathBonus').textContent = noDeathBonus > 0 ? `+${noDeathBonus.toLocaleString()}` : '0';
        document.getElementById('scBombBonus').textContent = `+${bombBonus.toLocaleString()} (${this.player.bombs} Bombs)`;
        document.getElementById('scTotalScore').textContent = this.score.toLocaleString();
        document.getElementById('screenStageClear').classList.remove('hidden');
    }

    advanceNextStage() {
        document.getElementById('screenStageClear').classList.add('hidden');

        if (this.currentStageIndex === 7) {
            if (this.currentLoop === 1) {
                this.currentLoop = 2;
                this.currentStageIndex = 0;
                this.showFloatingText(360, 450, "WAR LOOPS! LOOP 2 INITIATED!", '#ef4444', 34);
                this.loadStage(0);
                this.state = 'playing';
            } else {
                this.showCreditsScreen();
            }
        } else {
            this.currentStageIndex++;
            this.loadStage(this.currentStageIndex);
            this.state = 'playing';
        }
    }

    showCreditsScreen() {
        this.state = 'credits';
        if (window.audio) window.audio.stopMusic();

        const badgeElem = document.getElementById('cred1CCBadge');
        if (this.continuesUsed === 0) {
            badgeElem.textContent = "🏆 1CC BADGE EARNED! SUPREME ACE PILOT!";
            badgeElem.style.color = "#fde047";
        } else {
            badgeElem.textContent = "WAR CLEARED (WITH CONTINUES)";
            badgeElem.style.color = "#94a3b8";
        }

        document.getElementById('credFinalScore').textContent = this.score.toLocaleString();
        document.getElementById('screenCredits').classList.remove('hidden');
    }

    // --- ENEMY AI & BULLET SPRAY ---
    updateEnemies(dt) {
        const w = this.virtualWidth;
        const h = this.virtualHeight;

        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const e = this.enemies[i];

            e.x += e.vx * dt;
            e.y += e.vy * dt;

            if (e.animTimer !== undefined) e.animTimer += dt;
            if (e.rotorAngle !== undefined) e.rotorAngle += dt * 35;

            if (e.type === 'emplacement' || e.type === 'tank') {
                e.turretAngle = Math.atan2(this.player.y - e.y, this.player.x - e.x);
            }

            e.shootTimer -= dt;
            if (e.shootTimer <= 0 && e.y > 30 && e.y < h - 60) {
                this.enemyShoot(e);
            }

            if (e.y > h + 120 || e.y < -180 || e.x < -120 || e.x > w + 120) {
                this.enemies.splice(i, 1);
            }
        }
    }

    enemyShoot(e) {
        const bulletSpeed = (270 + this.rank * 75) * (this.currentLoop === 2 ? 1.35 : 1.0);
        const angleToPlayer = Math.atan2(this.player.y - e.y, this.player.x - e.x);

        if (e.type === 'scout') {
            this.spawnEnemyBullet(e.x, e.y, Math.cos(angleToPlayer) * bulletSpeed, Math.sin(angleToPlayer) * bulletSpeed, 'orange');
            e.shootTimer = 1.4;
        } else if (e.type === 'emplacement') {
            this.spawnEnemyBullet(e.x, e.y, Math.cos(e.turretAngle) * bulletSpeed, Math.sin(e.turretAngle) * bulletSpeed, 'orange');
            e.shootTimer = 1.8;
        } else if (e.type === 'gunship') {
            for (let b = 0; b < 3; b++) {
                setTimeout(() => {
                    if (this.state === 'playing') {
                        const curAngle = Math.atan2(this.player.y - e.y, this.player.x - e.x);
                        this.spawnEnemyBullet(e.x, e.y, Math.cos(curAngle) * bulletSpeed * 1.1, Math.sin(curAngle) * bulletSpeed * 1.1, 'orange');
                    }
                }, b * 140);
            }
            e.shootTimer = 2.4;
        } else if (e.type === 'helicopter') {
            for (let i = -2; i <= 2; i++) {
                const angle = angleToPlayer + i * 0.22;
                this.spawnEnemyBullet(e.x, e.y, Math.cos(angle) * bulletSpeed * 0.9, Math.sin(angle) * bulletSpeed * 0.9, 'magenta');
            }
            e.shootTimer = 2.0;
        } else if (e.type === 'bomber') {
            this.spawnEnemyBullet(e.x, e.y, 0, bulletSpeed * 0.7, 'molten');
            e.shootTimer = 2.2;
        } else if (e.type === 'tank') {
            this.spawnEnemyBullet(e.x - 9, e.y, Math.cos(e.turretAngle) * bulletSpeed, Math.sin(e.turretAngle) * bulletSpeed, 'orange');
            this.spawnEnemyBullet(e.x + 9, e.y, Math.cos(e.turretAngle) * bulletSpeed, Math.sin(e.turretAngle) * bulletSpeed, 'orange');
            e.shootTimer = 1.9;
        } else if (e.type === 'railgun') {
            this.spawnEnemyBullet(e.x - 12, e.y + 15, 0, bulletSpeed * 1.8, 'cyan');
            this.spawnEnemyBullet(e.x + 12, e.y + 15, 0, bulletSpeed * 1.8, 'cyan');
            e.shootTimer = 2.6;
        } else if (e.type === 'launcher') {
            this.spawnEnemyBullet(e.x, e.y, Math.cos(angleToPlayer) * bulletSpeed * 0.8, Math.sin(angleToPlayer) * bulletSpeed * 0.8, 'orange');
            e.shootTimer = 2.2;
        } else if (e.type === 'carrier') {
            this.spawnEnemyBullet(e.x - 36, e.y + 30, 0, bulletSpeed, 'orange');
            this.spawnEnemyBullet(e.x + 36, e.y + 30, 0, bulletSpeed, 'orange');
            e.shootTimer = 1.8;
        }
    }

    spawnEnemyBullet(x, y, vx, vy, type = 'orange') {
        if (window.audio) window.audio.playEnemyShot();
        this.enemyBullets.push({
            x,
            y,
            vx,
            vy,
            radius: type === 'molten' ? 12 : (type === 'cyan' ? 9 : 6.5),
            type
        });
    }

    // --- BULLETS & MISSILES UPDATE ---
    updateBullets(dt) {
        const w = this.virtualWidth;
        const h = this.virtualHeight;

        // Player Bullets
        for (let i = this.playerBullets.length - 1; i >= 0; i--) {
            const b = this.playerBullets[i];

            if (b.type === 'laser') {
                b.duration -= dt;
                if (b.duration <= 0) {
                    this.playerBullets.splice(i, 1);
                }
                continue;
            }

            if (b.type === 'missile') {
                if (!b.target || b.target.hp <= 0) {
                    b.target = this.findNearestEnemy(b.x, b.y);
                }

                if (b.target) {
                    const targetAngle = Math.atan2(b.target.y - b.y, b.target.x - b.x);
                    let diff = targetAngle - b.angle;
                    while (diff < -Math.PI) diff += Math.PI * 2;
                    while (diff > Math.PI) diff -= Math.PI * 2;
                    b.angle += Math.sign(diff) * Math.min(Math.abs(diff), b.turnSpeed * dt);
                }

                b.vx = Math.cos(b.angle) * b.speed;
                b.vy = Math.sin(b.angle) * b.speed;

                b.smokeTimer += dt;
                if (b.smokeTimer >= 0.04) {
                    this.particles.push({
                        x: b.x,
                        y: b.y,
                        vx: (Math.random() - 0.5) * 20,
                        vy: (Math.random() - 0.5) * 20,
                        maxRadius: 5,
                        age: 0,
                        life: 0.35,
                        color: 'rgba(203, 213, 225, 0.7)'
                    });
                    b.smokeTimer = 0;
                }
            }

            b.x += b.vx * dt;
            b.y += b.vy * dt;

            if (b.y < -30 || b.y > h + 30 || b.x < -30 || b.x > w + 30) {
                this.playerBullets.splice(i, 1);
            }
        }

        // Enemy Bullets
        for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
            const b = this.enemyBullets[i];
            b.x += b.vx * dt;
            b.y += b.vy * dt;

            if (b.y < -30 || b.y > h + 45 || b.x < -30 || b.x > w + 30) {
                this.enemyBullets.splice(i, 1);
            }
        }
    }

    findNearestEnemy(x, y) {
        if (this.bossActive && this.currentBoss && this.currentBoss.hp > 0) {
            return this.currentBoss;
        }

        let closest = null;
        let minDist = Infinity;
        this.enemies.forEach(e => {
            if (e.y > 0 && e.hp > 0) {
                const dist = Math.hypot(e.x - x, e.y - y);
                if (dist < minDist) {
                    minDist = dist;
                    closest = e;
                }
            }
        });
        return closest;
    }

    // --- PICKUPS MANAGEMENT ---
    updatePickups(dt) {
        const h = this.virtualHeight;
        for (let i = this.pickups.length - 1; i >= 0; i--) {
            const p = this.pickups[i];
            p.y += p.vy * dt;
            p.x += Math.sin(this.animTimer * 4 + p.phase) * 50 * dt;

            if (p.y > h + 30) {
                if (p.type === 'medal') {
                    this.medalChain = 0;
                }
                this.pickups.splice(i, 1);
            }
        }
    }

    spawnPickup(x, y, type) {
        this.pickups.push({
            x,
            y,
            vy: 95,
            phase: Math.random() * Math.PI * 2,
            type
        });
    }

    // --- COLLISION DETECTION ---
    checkCollisions() {
        const px = this.player.x;
        const py = this.player.y;
        const pr = this.player.radius;

        // 1. Enemy Bullets hitting Player
        if (!this.player.isDead && this.player.invulnerableTimer <= 0) {
            for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
                const b = this.enemyBullets[i];
                const dist = Math.hypot(px - b.x, py - b.y);
                if (dist < pr + b.radius) {
                    this.killPlayer();
                    this.enemyBullets.splice(i, 1);
                    break;
                }
            }
        }

        // 2. Player Bullets hitting Enemies
        for (let i = this.playerBullets.length - 1; i >= 0; i--) {
            const b = this.playerBullets[i];
            let bulletConsumed = false;

            // Check Boss
            if (this.bossActive && this.currentBoss && this.currentBoss.hp > 0) {
                const boss = this.currentBoss;
                const bossBox = { x: boss.x - 90, y: boss.y - 70, width: 180, height: 140 };

                if (b.type === 'laser') {
                    if (px >= bossBox.x && px <= bossBox.x + bossBox.width) {
                        boss.hp -= b.damage;
                        this.spawnExplosion(px, boss.y + 60, 'small', '#38bdf8');
                        if (window.audio) window.audio.playEnemyHit();
                    }
                } else {
                    if (b.x >= bossBox.x && b.x <= bossBox.x + bossBox.width &&
                        b.y >= bossBox.y && b.y <= bossBox.y + bossBox.height) {
                        boss.hp -= b.damage;
                        this.spawnExplosion(b.x, b.y, 'small', '#fde047');
                        if (window.audio) window.audio.playEnemyHit();
                        this.playerBullets.splice(i, 1);
                        continue;
                    }
                }
            }

            // Check Regular Enemies
            for (let j = this.enemies.length - 1; j >= 0; j--) {
                const e = this.enemies[j];
                const enemyRadius = e.type === 'carrier' ? 60 : (e.type === 'bomber' ? 45 : 28);

                if (b.type === 'laser') {
                    if (Math.abs(px - e.x) < enemyRadius + (b.width / 2)) {
                        e.hp -= b.damage;
                        this.spawnExplosion(e.x, e.y, 'small', '#38bdf8');
                        if (window.audio) window.audio.playEnemyHit();

                        if (e.hp <= 0) {
                            this.destroyEnemy(e, j);
                        }
                    }
                } else {
                    const dist = Math.hypot(b.x - e.x, b.y - e.y);
                    if (dist < enemyRadius + 6) {
                        e.hp -= b.damage;
                        this.spawnExplosion(b.x, b.y, 'small', '#fde047');
                        if (window.audio) window.audio.playEnemyHit();

                        if (e.hp <= 0) {
                            this.destroyEnemy(e, j);
                        }

                        bulletConsumed = true;
                        break;
                    }
                }
            }

            if (bulletConsumed) {
                this.playerBullets.splice(i, 1);
            }
        }

        // 3. Player collecting Pickups
        for (let i = this.pickups.length - 1; i >= 0; i--) {
            const p = this.pickups[i];
            const dist = Math.hypot(px - p.x, py - p.y);
            if (dist < 42) {
                this.collectPickup(p);
                this.pickups.splice(i, 1);
            }
        }
    }

    destroyEnemy(e, enemyIndex) {
        if (window.audio) window.audio.playExplosion(e.type === 'carrier' ? 'heavy' : 'small');
        this.spawnExplosion(e.x, e.y, e.type === 'carrier' ? 'heavy' : 'small', '#ea580c');

        if (this.currentLoop === 2 && Math.random() < 0.6) {
            const angle = Math.atan2(this.player.y - e.y, this.player.x - e.x);
            this.spawnEnemyBullet(e.x, e.y, Math.cos(angle) * 300, Math.sin(angle) * 300, 'orange');
        }

        if (e.drop) {
            if (e.drop === 'weapon') {
                const dropType = this.player.weaponType === 'V' ? 'L' : 'V';
                this.spawnPickup(e.x, e.y, dropType);
            } else if (e.drop === 'missile') {
                this.spawnPickup(e.x, e.y, 'M');
            } else if (e.drop === 'bomb') {
                this.spawnPickup(e.x, e.y, 'B');
            }
        } else if (Math.random() < 0.35 || e.type === 'gunship' || e.type === 'tank') {
            this.spawnPickup(e.x, e.y, 'medal');
        }

        this.addScore(e.score);
        this.showFloatingText(e.x, e.y, `+${e.score}`, '#ffffff', 20);

        this.rank = Math.min(1.0, this.rank + 0.015);
        this.enemies.splice(enemyIndex, 1);
    }

    collectPickup(p) {
        if (p.type === 'medal') {
            const val = this.medalValues[Math.min(this.medalChain, this.medalValues.length - 1)];
            if (window.audio) window.audio.playMedalChime(this.medalChain);
            this.addScore(val);
            this.showFloatingText(p.x, p.y, `+${val}`, '#fbbf24', 24);
            this.medalChain++;
        } else if (p.type === 'V') {
            if (window.audio) window.audio.playPowerup();
            if (this.player.weaponType === 'V') {
                this.player.weaponLevel = Math.min(4, this.player.weaponLevel + 1);
            } else {
                this.player.weaponType = 'V';
            }
            this.showFloatingText(p.x, p.y, `VULCAN Lv.${this.player.weaponLevel}`, '#ef4444', 26);
        } else if (p.type === 'L') {
            if (window.audio) window.audio.playPowerup();
            if (this.player.weaponType === 'L') {
                this.player.weaponLevel = Math.min(4, this.player.weaponLevel + 1);
            } else {
                this.player.weaponType = 'L';
            }
            this.showFloatingText(p.x, p.y, `LASER Lv.${this.player.weaponLevel}`, '#38bdf8', 26);
        } else if (p.type === 'M') {
            if (window.audio) window.audio.playPowerup();
            this.player.missileLevel = Math.min(3, this.player.missileLevel + 1);
            this.showFloatingText(p.x, p.y, `MISSILE Lv.${this.player.missileLevel}`, '#eab308', 26);
        } else if (p.type === 'B') {
            if (window.audio) window.audio.playPowerup();
            this.player.bombs = Math.min(this.player.maxBombs, this.player.bombs + 1);
            this.showFloatingText(p.x, p.y, `BOMB +1 (${this.player.bombs}/${this.player.maxBombs})`, '#22c55e', 26);
        }
        this.updateHUD();
    }

    killPlayer() {
        this.player.lives--;
        this.stageDeaths++;
        this.player.isDead = true;
        this.player.respawnTimer = 1.6;

        if (window.audio) window.audio.playPlayerDeath();

        this.spawnExplosion(this.player.x, this.player.y, 'heavy', '#ef4444');
        this.screenShakeTimer = 0.55;
        this.screenShakeIntensity = 18;

        this.updateHUD();
    }

    gameOver() {
        this.state = 'game_over';
        if (window.audio) window.audio.stopMusic();

        document.getElementById('goFinalScore').textContent = this.score.toLocaleString();
        document.getElementById('goStageReached').textContent = `Stage ${this.currentStageIndex + 1} (Loop ${this.currentLoop})`;

        const contBtn = document.getElementById('btnContinue');
        if (contBtn) {
            contBtn.style.display = (this.difficulty === 'easy' || this.continuesUsed < 3) ? 'inline-block' : 'none';
        }

        document.getElementById('screenGameOver').classList.remove('hidden');
    }

    continueGame() {
        this.continuesUsed++;
        this.player.lives = this.difficulty === 'easy' ? 5 : (this.difficulty === 'hard' ? 2 : 3);
        this.player.bombs = 3;
        this.player.weaponLevel = 1;
        this.player.missileLevel = 0;
        this.player.isDead = false;
        this.player.invulnerableTimer = 3.0;

        document.getElementById('screenGameOver').classList.add('hidden');
        this.state = 'playing';

        const stage = STAGES[this.currentStageIndex % STAGES.length];
        if (window.audio) {
            if (this.bossActive) window.audio.startBossMusic();
            else window.audio.startStageMusic(stage.number);
        }
        this.updateHUD();
    }

    pauseGame() {
        this.state = 'paused';
        document.getElementById('screenPause').classList.remove('hidden');
    }

    resumeGame() {
        this.state = 'playing';
        document.getElementById('screenPause').classList.add('hidden');
    }

    addScore(pts) {
        this.score += pts;
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('thunderloop_highscore', this.highScore.toString());
        }

        if (this.score >= this.nextLifeScore) {
            this.player.lives++;
            if (window.audio) window.audio.playExtraLife();
            this.showFloatingText(360, 390, "EXTEND! 1UP!", '#22c55e', 32);
            this.nextLifeScore += 500000;
        }
    }

    // --- PARTICLES & VFX ---
    spawnExplosion(x, y, type = 'small', color = '#ef4444') {
        const count = type === 'heavy' ? 24 : (type === 'medium' ? 16 : 8);
        const maxR = type === 'heavy' ? 36 : (type === 'medium' ? 22 : 11);

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 30 + Math.random() * (type === 'heavy' ? 180 : 90);
            this.particles.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                maxRadius: maxR * (0.5 + Math.random() * 0.5),
                age: 0,
                life: 0.4 + Math.random() * 0.35,
                color: Math.random() > 0.4 ? color : '#fef08a'
            });
        }
    }

    updateParticles(dt) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.age += dt;
            if (p.age >= p.life) {
                this.particles.splice(i, 1);
            }
        }
    }

    showFloatingText(x, y, text, color = '#ffffff', size = 22) {
        this.floatingTexts.push({
            x,
            y,
            text,
            color,
            size,
            age: 0,
            life: 1.2
        });
    }

    updateFloatingTexts(dt) {
        for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
            const ft = this.floatingTexts[i];
            ft.y -= 45 * dt;
            ft.age += dt;
            if (ft.age >= ft.life) {
                this.floatingTexts.splice(i, 1);
            }
        }
    }

    // --- HUD & UI UPDATES ---
    updateHUD() {
        const scoreEl = document.getElementById('hudScore');
        const hiScoreEl = document.getElementById('hudHighScore');
        const livesEl = document.getElementById('hudLives');
        const bombsEl = document.getElementById('hudBombs');
        const weaponEl = document.getElementById('hudWeapon');
        const stageEl = document.getElementById('hudStage');
        const rankEl = document.getElementById('hudRank');
        const medalEl = document.getElementById('hudMedal');

        if (scoreEl) scoreEl.textContent = this.score.toString().padStart(7, '0');
        if (hiScoreEl) hiScoreEl.textContent = this.highScore.toString().padStart(7, '0');
        if (livesEl) livesEl.textContent = '✈'.repeat(Math.max(0, this.player.lives));
        if (bombsEl) bombsEl.textContent = '💣'.repeat(Math.max(0, this.player.bombs));
        if (weaponEl) {
            const wName = this.player.weaponType === 'V' ? 'VULCAN' : 'LASER';
            const mName = this.player.missileLevel > 0 ? ` + M-Lv${this.player.missileLevel}` : '';
            weaponEl.textContent = `${wName} Lv.${this.player.weaponLevel}${mName}`;
        }
        if (stageEl) {
            stageEl.textContent = `STAGE ${this.currentStageIndex + 1} [LOOP ${this.currentLoop}]`;
        }
        if (rankEl) {
            rankEl.textContent = `RANK: ${Math.round(this.rank * 100)}%`;
        }
        if (medalEl) {
            const currentVal = this.medalValues[Math.min(this.medalChain, this.medalValues.length - 1)];
            medalEl.textContent = `MEDAL: ${currentVal} (${this.medalChain})`;
        }
    }

    // --- RENDERING ROUTINES (PHYSICAL MULTI-LAYER ALTITUDE SYSTEM) ---
    render() {
        const ctx = this.ctx;
        const w = this.virtualWidth;
        const h = this.virtualHeight;

        ctx.save();

        // Screen Shake
        if (this.screenShakeTimer > 0) {
            const shake = (Math.random() - 0.5) * this.screenShakeIntensity;
            ctx.translate(shake, shake);
        }

        // --- LAYER 1: SATELLITE TERRAIN & REALISTIC OCEAN/RIVER/LAND ---
        if (this.bgRenderer.drawGroundLevel) {
            this.bgRenderer.drawGroundLevel(ctx, w, h, this.currentStageIndex, this.currentLoop);
        } else {
            this.bgRenderer.draw(ctx, w, h, this.currentStageIndex, this.currentLoop);
        }

        // --- LAYER 2: CLOUD GROUND SHADOWS (Gliding over land & water) ---
        if (this.bgRenderer.drawCloudShadows) {
            this.bgRenderer.drawCloudShadows(ctx, w, h);
        }

        // --- LAYER 3: GROUND UNITS & BUNKERS ---
        this.enemies.forEach(e => {
            if (!e.isAir) {
                if (e.type === 'emplacement') Sprites.drawGunEmplacement(ctx, e.x, e.y, e.turretAngle);
                else if (e.type === 'tank') Sprites.drawTank(ctx, e.x, e.y, e.headingAngle, e.turretAngle);
                else if (e.type === 'railgun') Sprites.drawRailgunFortress(ctx, e.x, e.y, this.animTimer);
                else if (e.type === 'launcher') Sprites.drawGroundLauncher(ctx, e.x, e.y);
            }
        });

        // --- LAYER 4: AIR-TO-GROUND DIRECTIONAL DROP SHADOWS ---
        // Player Ship Drop Shadow
        if (!this.player.isDead) {
            Sprites.drawAircraftShadow(ctx, this.player.x, this.player.y, 'player');
        }

        // Air Enemies Drop Shadows (Scouts, Gunships, Helicopters with spinning rotor shadow, Bombers, Carriers)
        this.enemies.forEach(e => {
            if (e.isAir) {
                const angle = e.type === 'scout' ? Math.atan2(e.vy, e.vx) - Math.PI / 2 : 0;
                Sprites.drawAircraftShadow(ctx, e.x, e.y, e.type, angle, e.rotorAngle || 0);
            }
        });

        // Boss Capital Ship Drop Shadow
        if (this.bossActive && this.currentBoss) {
            Sprites.drawAircraftShadow(ctx, this.currentBoss.x, this.currentBoss.y, 'boss');
        }

        // Homing Missiles Drop Shadows
        this.playerBullets.forEach(b => {
            if (b.type === 'missile') {
                Sprites.drawAircraftShadow(ctx, b.x, b.y, 'missile', b.angle);
            }
        });

        // --- LAYER 5: COMBAT ALTITUDE ENTITIES & FLIGHT DOGFIGHT ---
        // 1. Pickups
        this.pickups.forEach(p => {
            Sprites.drawPickup(ctx, p, this.animTimer);
        });

        // 2. Air Enemies
        this.enemies.forEach(e => {
            if (e.isAir) {
                if (e.type === 'scout') Sprites.drawScout(ctx, e.x, e.y, Math.atan2(e.vy, e.vx) - Math.PI / 2);
                else if (e.type === 'gunship') Sprites.drawGunship(ctx, e.x, e.y, 0);
                else if (e.type === 'helicopter') Sprites.drawHelicopter(ctx, e.x, e.y, e.rotorAngle);
                else if (e.type === 'bomber') Sprites.drawBomber(ctx, e.x, e.y);
                else if (e.type === 'carrier') Sprites.drawCarrier(ctx, e.x, e.y, e.isFlashing, this.animTimer);
            }
        });

        // 3. Boss
        if (this.bossActive && this.currentBoss) {
            const b = this.currentBoss;
            const hpRatio = b.hp / b.maxHp;
            if (b.type === 'leviathan') Sprites.drawBossLeviathan(ctx, b.x, b.y, hpRatio, b.phase, b.animTimer);
            else if (b.type === 'sandstrider') Sprites.drawBossSandstrider(ctx, b.x, b.y, hpRatio, b.phase, b.animTimer);
            else if (b.type === 'skyfortress') Sprites.drawBossSkyFortress(ctx, b.x, b.y, hpRatio, b.phase, b.animTimer);
            else if (b.type === 'hydrawalker') Sprites.drawBossHydraWalker(ctx, b.x, b.y, hpRatio, b.phase, b.animTimer);
            else if (b.type === 'foundrycore') Sprites.drawBossFoundryCore(ctx, b.x, b.y, hpRatio, b.phase, b.animTimer);
            else if (b.type === 'citadelguardian') Sprites.drawBossCitadelGuardian(ctx, b.x, b.y, hpRatio, b.phase, b.animTimer);
            else if (b.type === 'satellitearray') Sprites.drawBossSatelliteArray(ctx, b.x, b.y, hpRatio, b.phase, b.animTimer);
            else if (b.type === 'overlord') Sprites.drawBossOverlord(ctx, b.x, b.y, hpRatio, b.phase, b.animTimer);
        }

        // 4. Player Ship (with Mach diamond afterburners)
        if (!this.player.isDead) {
            Sprites.drawPlayer(ctx, this.player.x, this.player.y, this.player.invulnerableTimer, this.animTimer);
        }

        // 5. Player Projectiles & Energy Beams
        this.playerBullets.forEach(b => {
            if (b.type === 'vulcan') {
                Sprites.drawVulcanBullet(ctx, b.x, b.y, b.vx, b.vy);
            } else if (b.type === 'laser') {
                Sprites.drawLaserBeam(ctx, b.x, b.y, b.width, b.height, b.level);
            } else if (b.type === 'missile') {
                Sprites.drawHomingMissile(ctx, b.x, b.y, b.angle);
            }
        });

        // 6. Enemy Bullets
        this.enemyBullets.forEach(b => {
            Sprites.drawEnemyBullet(ctx, b);
        });

        // 7. Hyper-Realistic Thermobaric Bomb Explosions
        this.activeBombs.forEach(bomb => {
            Sprites.drawRealisticBombExplosion(ctx, bomb);
        });

        // 8. Particles & Shrapnel
        this.particles.forEach(p => {
            Sprites.drawExplosion(ctx, p);
        });

        // --- LAYER 6: HIGH ATMOSPHERIC CLOUDS & CIRRUS (Drifting OVER the aircraft) ---
        if (this.bgRenderer.drawHighAtmosphereAndClouds) {
            this.bgRenderer.drawHighAtmosphereAndClouds(ctx, w, h);
        }

        // --- LAYER 7: HEADS-UP DISPLAY & CINEMATIC OVERLAYS ---
        // Floating Score & Alert Texts
        this.floatingTexts.forEach(ft => {
            ctx.save();
            const alpha = 1 - (ft.age / ft.life);
            ctx.globalAlpha = Math.max(0, alpha);
            ctx.fillStyle = ft.color;
            ctx.font = `bold ${ft.size}px "Courier New", monospace`;
            ctx.textAlign = 'center';
            ctx.shadowColor = '#000000';
            ctx.shadowBlur = 6;
            ctx.fillText(ft.text, ft.x, ft.y);
            ctx.restore();
        });

        // 12. Boss Warning Banner
        if (this.bossWarningTimer > 0) {
            this.bossWarningTimer -= 0.016;
            const blink = Math.floor(this.animTimer * 6) % 2 === 0;
            ctx.save();
            ctx.fillStyle = blink ? 'rgba(239, 68, 68, 0.5)' : 'rgba(0, 0, 0, 0.75)';
            ctx.fillRect(0, 420, w, 110);
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 4;
            ctx.strokeRect(0, 420, w, 110);

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 30px "Courier New", monospace';
            ctx.textAlign = 'center';
            ctx.shadowColor = '#ef4444';
            ctx.shadowBlur = 14;
            const bName = this.currentBoss ? this.currentBoss.name.toUpperCase() : "MASSIVE TARGET";
            ctx.fillText(`WARNING! ${bName}`, w / 2, 465);
            ctx.font = 'bold 20px "Courier New", monospace';
            ctx.fillText("HOSTILE CAPITAL SHIP APPROACHING", w / 2, 505);
            ctx.restore();
        }

        // 13. Full Screen Nuclear White Flash (Bomb)
        if (this.screenFlashTimer > 0) {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.screenFlashTimer * 2.2})`;
            ctx.fillRect(0, 0, w, h);
        }

        ctx.restore();
    }
}

// Global Game initialization
window.initGame = function() {
    if (!window.game) {
        window.game = new GameEngine();
        window.game.run();
    }
    return window.game;
};

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    window.initGame();
} else {
    document.addEventListener('DOMContentLoaded', window.initGame);
}
