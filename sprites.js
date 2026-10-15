// Thunder Loop - High-Resolution Realistic Military & Sci-Fi Graphics Engine
// Features realistic metallic paneling, specular highlights, dynamic afterburner mach diamonds,
// volumetric thermobaric bomb explosion physics, and high-fidelity 8-stage bosses.

const Sprites = {
    // Utility: Draw smooth high-precision metallic bevel / panel line
    drawPanelLine(ctx, x1, y1, x2, y2, highlight = true) {
        ctx.save();
        ctx.strokeStyle = highlight ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.6)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.restore();
    },

    // 1. REALISTIC PLAYER FIGHTER (Thunder Interceptor - F-22 / SU-47 Hybrid)
    drawPlayer(ctx, x, y, invulnerableTimer, animTimer, roll = 0) {
        if (invulnerableTimer > 0 && Math.floor(invulnerableTimer * 20) % 2 === 0) {
            return;
        }

        ctx.save();
        ctx.translate(x, y);

        if (roll !== 0) {
            const bankAngle = Math.max(-0.25, Math.min(0.25, roll * 0.25));
            ctx.rotate(bankAngle);
            ctx.scale(1 - Math.abs(bankAngle) * 0.15, 1);
        }

        // --- REALISTIC DUAL SUPERSONIC AFTERBURNERS ---
        const flameLength = 38 + Math.sin(animTimer * 40) * 4;
        
        [-13, 13].forEach(engineX => {
            ctx.save();
            ctx.translate(engineX, 22);

            // Outer thermal glow plume
            const plumeGrad = ctx.createRadialGradient(0, flameLength * 0.4, 2, 0, flameLength * 0.4, flameLength * 0.8);
            plumeGrad.addColorStop(0, 'rgba(56, 189, 248, 0.6)');
            plumeGrad.addColorStop(0.5, 'rgba(249, 115, 22, 0.3)');
            plumeGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = plumeGrad;
            ctx.beginPath();
            ctx.ellipse(0, flameLength * 0.4, 10, flameLength * 0.6, 0, 0, Math.PI * 2);
            ctx.fill();

            // Main Supersonic Flame Core
            const flameGrad = ctx.createLinearGradient(0, 0, 0, flameLength);
            flameGrad.addColorStop(0, '#ffffff');
            flameGrad.addColorStop(0.2, '#38bdf8');
            flameGrad.addColorStop(0.5, '#ea580c');
            flameGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = flameGrad;

            ctx.beginPath();
            ctx.moveTo(-5, 0);
            ctx.lineTo(5, 0);
            ctx.lineTo(0, flameLength);
            ctx.closePath();
            ctx.fill();

            // Mach Shock Diamonds (Realistic supersonic shockwaves inside nozzle flame)
            ctx.fillStyle = '#ffffff';
            [0.2, 0.42, 0.65].forEach(pos => {
                const my = flameLength * pos;
                const mw = (1 - pos) * 3.5;
                ctx.beginPath();
                ctx.moveTo(0, my - 2);
                ctx.lineTo(mw, my);
                ctx.lineTo(0, my + 2);
                ctx.lineTo(-mw, my);
                ctx.closePath();
                ctx.fill();
            });

            // Ceramic Nozzle ring
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(-6, -3, 12, 4);
            ctx.fillStyle = '#64748b';
            ctx.fillRect(-5, -2, 10, 2);

            ctx.restore();
        });

        // --- AIRFRAME SHADOW & DEPTH ---
        ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
        ctx.shadowBlur = 12;
        ctx.shadowOffsetY = 6;

        // --- SWEPT WINGS & ADVANCED COMPOSITE FLIGHT SURFACES ---
        // Port & Starboard Wings (Forward-swept / cranked arrow)
        const wingGrad = ctx.createLinearGradient(0, -20, 0, 30);
        wingGrad.addColorStop(0, '#475569');
        wingGrad.addColorStop(0.4, '#334155');
        wingGrad.addColorStop(1, '#1e293b');
        ctx.fillStyle = wingGrad;

        ctx.beginPath();
        ctx.moveTo(0, -28);
        ctx.lineTo(38, 14);     // Wingtip starboard
        ctx.lineTo(36, 26);     // Aileron tip
        ctx.lineTo(16, 25);     // Inboard trailing edge
        ctx.lineTo(0, 20);      // Engine mount base
        ctx.lineTo(-16, 25);
        ctx.lineTo(-36, 26);
        ctx.lineTo(-38, 14);    // Wingtip port
        ctx.closePath();
        ctx.fill();

        // Metallic Leading Edge Slats (Titanium shine)
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.moveTo(0, -28);
        ctx.lineTo(38, 14);
        ctx.lineTo(35, 17);
        ctx.lineTo(0, -24);
        ctx.lineTo(-35, 17);
        ctx.lineTo(-38, 14);
        ctx.closePath();
        ctx.fill();

        // Wingtip Missile Rails & Navigation Strobes
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(36, 10, 3, 16);
        ctx.fillRect(-39, 10, 3, 16);

        // Green starboard / Red port navigation strobes
        const strobe = Math.floor(animTimer * 4) % 2 === 0;
        ctx.fillStyle = strobe ? '#22c55e' : '#15803d';
        ctx.fillRect(37, 10, 2, 4);
        ctx.fillStyle = strobe ? '#ef4444' : '#991b1b';
        ctx.fillRect(-39, 10, 2, 4);

        // --- MAIN FUSELAGE (Faceted Stealth Body) ---
        const fuseGrad = ctx.createLinearGradient(-14, 0, 14, 0);
        fuseGrad.addColorStop(0, '#334155');
        fuseGrad.addColorStop(0.3, '#64748b');
        fuseGrad.addColorStop(0.5, '#cbd5e1'); // Central specular ridge highlight
        fuseGrad.addColorStop(0.7, '#64748b');
        fuseGrad.addColorStop(1, '#334155');
        ctx.fillStyle = fuseGrad;

        ctx.beginPath();
        ctx.moveTo(0, -36);      // Radome nose needle
        ctx.lineTo(6, -26);
        ctx.lineTo(14, -6);
        ctx.lineTo(15, 20);
        ctx.lineTo(0, 22);
        ctx.lineTo(-15, 20);
        ctx.lineTo(-14, -6);
        ctx.lineTo(-6, -26);
        ctx.closePath();
        ctx.fill();

        // Radome Ceramic Cone
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.moveTo(0, -38);
        ctx.lineTo(3, -28);
        ctx.lineTo(-3, -28);
        ctx.closePath();
        ctx.fill();

        // Dual canted vertical twin stabilizers
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.moveTo(14, 2);
        ctx.lineTo(22, 22);
        ctx.lineTo(16, 23);
        ctx.lineTo(12, 6);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(-14, 2);
        ctx.lineTo(-22, 22);
        ctx.lineTo(-16, 23);
        ctx.lineTo(-12, 6);
        ctx.closePath();
        ctx.fill();

        // --- REALISTIC BUBBLE CANOPY WITH IRIDESCENT SPECULAR GLARE ---
        const canopyGrad = ctx.createLinearGradient(-5, -18, 5, 2);
        canopyGrad.addColorStop(0, '#38bdf8');
        canopyGrad.addColorStop(0.4, '#0369a1');
        canopyGrad.addColorStop(0.8, '#0f172a');
        canopyGrad.addColorStop(1, '#0284c7');
        ctx.fillStyle = canopyGrad;

        ctx.beginPath();
        ctx.ellipse(0, -6, 5.5, 14, 0, 0, Math.PI * 2);
        ctx.fill();

        // Cockpit Glass Specular Glare (Realistic curved reflection streak)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(-2, -9, 8, Math.PI * 0.7, Math.PI * 1.3);
        ctx.stroke();

        // Heads-up display (HUD) optic glare inside cockpit
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.arc(0, -12, 1.8, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    },

    // 2. REALISTIC PLAYER WEAPONS
    // Vulcan Incendiary Tracer Round
    drawVulcanBullet(ctx, x, y, vx, vy) {
        ctx.save();
        ctx.translate(x, y);
        const angle = Math.atan2(vy, vx) + Math.PI / 2;
        ctx.rotate(angle);

        // Outer Incendiary Plasma Bloom
        ctx.shadowColor = '#f97316';
        ctx.shadowBlur = 10;

        // Aerodynamic sabot projectile
        const bulletGrad = ctx.createLinearGradient(0, -14, 0, 10);
        bulletGrad.addColorStop(0, '#ffffff');  // White-hot tip
        bulletGrad.addColorStop(0.3, '#fde047'); // Incandescent yellow
        bulletGrad.addColorStop(0.7, '#ea580c'); // Deep incendiary red
        bulletGrad.addColorStop(1, 'rgba(239, 68, 68, 0)'); // Fading tracer streak

        ctx.fillStyle = bulletGrad;
        ctx.beginPath();
        ctx.moveTo(0, -14);
        ctx.lineTo(4, 2);
        ctx.lineTo(2, 12);
        ctx.lineTo(-2, 12);
        ctx.lineTo(-4, 2);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    },

    // Piercing Laser Beam (Photonic Particle Accelerator Beam)
    drawLaserBeam(ctx, x, y, width, height, level) {
        ctx.save();
        
        // Dynamic ripple pulses along beam
        const time = performance.now() * 0.01;
        
        // Outer Electromagnetic Ionization Glow
        const outerGrad = ctx.createLinearGradient(x - width, 0, x + width, 0);
        outerGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
        outerGrad.addColorStop(0.3, 'rgba(2, 132, 199, 0.4)');
        outerGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.8)');
        outerGrad.addColorStop(0.7, 'rgba(2, 132, 199, 0.4)');
        outerGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
        
        ctx.fillStyle = outerGrad;
        ctx.fillRect(x - width * 1.6, y, width * 3.2, height);

        // Core Hyper-Accelerated Beam
        const coreGrad = ctx.createLinearGradient(x - width / 2, 0, x + width / 2, 0);
        coreGrad.addColorStop(0, '#0284c7');
        coreGrad.addColorStop(0.3, '#38bdf8');
        coreGrad.addColorStop(0.5, '#ffffff'); // Ultra-white photon core
        coreGrad.addColorStop(0.7, '#38bdf8');
        coreGrad.addColorStop(1, '#0284c7');
        
        ctx.fillStyle = coreGrad;
        ctx.fillRect(x - width / 2, y, width, height);

        // Beam Emitter Flash Flare at base
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 24;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(x, y + height, width * 1.4, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    },

    // Homing Missile (AIM-120 Style Guided Missile)
    drawHomingMissile(ctx, x, y, angle) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle + Math.PI / 2);

        // Missile Airframe (Matte military white / grey)
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.moveTo(0, -12);      // Radar radome nose
        ctx.lineTo(4, -4);
        ctx.lineTo(4, 10);
        ctx.lineTo(-4, 10);
        ctx.lineTo(-4, -4);
        ctx.closePath();
        ctx.fill();

        // Radome seeker nose
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.moveTo(0, -12);
        ctx.lineTo(3, -5);
        ctx.lineTo(-3, -5);
        ctx.closePath();
        ctx.fill();

        // Forward canard steering fins
        ctx.fillStyle = '#334155';
        ctx.fillRect(-7, -2, 14, 2);

        // Tail stabilizing fins
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(-8, 5, 16, 4);

        // Solid Rocket Motor Nozzle Plume
        const plume = ctx.createLinearGradient(0, 10, 0, 24);
        plume.addColorStop(0, '#ffffff');
        plume.addColorStop(0.3, '#f59e0b');
        plume.addColorStop(1, 'transparent');
        ctx.fillStyle = plume;
        ctx.beginPath();
        ctx.moveTo(-3, 10);
        ctx.lineTo(3, 10);
        ctx.lineTo(0, 22);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    },

    // 3. REALISTIC ENEMY BULLETS (Glowing Plasma Spheres with High Contrast Corona)
    drawEnemyBullet(ctx, bullet) {
        ctx.save();
        const x = bullet.x;
        const y = bullet.y;
        const r = (bullet.radius || 5) * 1.2;
        const type = bullet.type || 'orange';

        let coreColor = '#ffffff';
        let midColor = '#fbbf24';
        let outerColor = '#ea580c';

        if (type === 'magenta' || type === 'spiral') {
            midColor = '#f472b6';
            outerColor = '#be185d';
        } else if (type === 'cyan' || type === 'laser') {
            midColor = '#38bdf8';
            outerColor = '#0369a1';
        } else if (type === 'molten') {
            midColor = '#f97316';
            outerColor = '#b91c1c';
        }

        // Intense Radial Energy Halo
        const glow = ctx.createRadialGradient(x, y, 0, x, y, r * 1.8);
        glow.addColorStop(0, coreColor);
        glow.addColorStop(0.35, midColor);
        glow.addColorStop(0.7, outerColor);
        glow.addColorStop(1, 'transparent');

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, r * 1.8, 0, Math.PI * 2);
        ctx.fill();

        // Incandescent Dense Core
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x, y, r * 0.45, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    },

    // 4. REALISTIC AIR-TO-GROUND SHADOW ENGINE
    // Projects realistic soft directional ambient occlusion drop shadows onto the terrain below
    drawAircraftShadow(ctx, x, y, type, angle = 0, rotorAngle = 0) {
        ctx.save();
        // High-altitude directional ground shadow offset (sun from top-left)
        const shadowX = x + 38;
        const shadowY = y + 58;
        ctx.translate(shadowX, shadowY);
        ctx.fillStyle = 'rgba(2, 6, 23, 0.32)'; // Soft atmospheric ground shadow

        if (type === 'player') {
            // Player Fighter Shadow
            if (angle !== 0) {
                const bank = Math.max(-0.25, Math.min(0.25, angle * 0.25));
                ctx.rotate(bank);
                ctx.scale(1 - Math.abs(bank) * 0.15, 1);
            }
            ctx.beginPath();
            ctx.moveTo(0, -32);
            ctx.lineTo(36, 14);
            ctx.lineTo(34, 24);
            ctx.lineTo(14, 22);
            ctx.lineTo(0, 20);
            ctx.lineTo(-14, 22);
            ctx.lineTo(-34, 24);
            ctx.lineTo(-36, 14);
            ctx.closePath();
            ctx.fill();
        } else if (type === 'scout') {
            // Stealth Drone Shadow
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.moveTo(0, 22);
            ctx.lineTo(26, -14);
            ctx.lineTo(16, -18);
            ctx.lineTo(0, -10);
            ctx.lineTo(-16, -18);
            ctx.lineTo(-26, -14);
            ctx.closePath();
            ctx.fill();
        } else if (type === 'gunship') {
            // Heavy VTOL Gunship Shadow
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.moveTo(0, 28);
            ctx.lineTo(16, -10);
            ctx.lineTo(14, -24);
            ctx.lineTo(-14, -24);
            ctx.lineTo(-16, -10);
            ctx.closePath();
            ctx.fill();
            // Engine nacelle shadows
            ctx.fillRect(-28, -16, 12, 34);
            ctx.fillRect(16, -16, 12, 34);
            ctx.fillRect(-34, -4, 68, 8);
        } else if (type === 'helicopter') {
            // Attack Helicopter Body Shadow
            ctx.beginPath();
            ctx.ellipse(0, 0, 16, 30, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillRect(-4, -44, 8, 22);
            ctx.fillRect(-16, -42, 32, 4);
            ctx.fillRect(-26, -4, 52, 6);

            // Spinning 4-Blade Rotor Shadow on Ground
            ctx.save();
            ctx.rotate(rotorAngle);
            for (let b = 0; b < 4; b++) {
                ctx.rotate(Math.PI / 2);
                ctx.fillRect(-3, 0, 6, 48);
            }
            ctx.restore();
        } else if (type === 'bomber') {
            // Heavy Stealth Flying Wing Shadow
            ctx.beginPath();
            ctx.moveTo(0, 32);
            ctx.lineTo(54, -22);
            ctx.lineTo(46, -34);
            ctx.lineTo(24, -20);
            ctx.lineTo(0, -28);
            ctx.lineTo(-24, -20);
            ctx.lineTo(-46, -34);
            ctx.lineTo(-54, -22);
            ctx.closePath();
            ctx.fill();
        } else if (type === 'carrier') {
            // Colossal Airborne Supercarrier Shadow
            ctx.beginPath();
            ctx.moveTo(0, 68);
            ctx.lineTo(65, -15);
            ctx.lineTo(55, -60);
            ctx.lineTo(-55, -60);
            ctx.lineTo(-65, -15);
            ctx.closePath();
            ctx.fill();
        } else if (type === 'missile') {
            // Fast Dart Missile Shadow
            ctx.rotate(angle + Math.PI / 2);
            ctx.fillRect(-3, -12, 6, 22);
        } else if (type === 'boss') {
            // Boss Colossus Ground Shadow
            ctx.beginPath();
            ctx.arc(0, 0, 75, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    },

    // 5. REALISTIC AIR UNITS
    // Scout (High-Speed Stealth Interceptor Drone - MQ-28 / X-47B Inspired)
    drawScout(ctx, x, y, angle) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        // Twin Mini Supersonic Afterburner Thruster Plumes
        const flameH = 14 + Math.sin(performance.now() * 0.05) * 4;
        [-7, 7].forEach(tx => {
            const thGrad = ctx.createLinearGradient(0, -18, 0, -18 - flameH);
            thGrad.addColorStop(0, '#ffffff');
            thGrad.addColorStop(0.3, '#38bdf8');
            thGrad.addColorStop(0.7, '#ea580c');
            thGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = thGrad;
            ctx.beginPath();
            ctx.moveTo(tx - 3, -18);
            ctx.lineTo(tx + 3, -18);
            ctx.lineTo(tx, -18 - flameH);
            ctx.closePath();
            ctx.fill();
        });

        // Main Stealth Delta Wings (Radar-absorbent matte charcoal)
        const wingGrad = ctx.createLinearGradient(0, 20, 0, -20);
        wingGrad.addColorStop(0, '#475569');
        wingGrad.addColorStop(0.5, '#334155');
        wingGrad.addColorStop(1, '#1e293b');
        ctx.fillStyle = wingGrad;

        ctx.beginPath();
        ctx.moveTo(0, 22);       // Sharp nose needle
        ctx.lineTo(26, -12);     // Starboard wingtip
        ctx.lineTo(22, -18);     // Aileron notch
        ctx.lineTo(10, -16);     // Trailing edge
        ctx.lineTo(0, -12);      // Engine fairing
        ctx.lineTo(-10, -16);
        ctx.lineTo(-22, -18);
        ctx.lineTo(-26, -12);    // Port wingtip
        ctx.closePath();
        ctx.fill();

        // Titanium Leading Edge Armor Plates
        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.moveTo(0, 22);
        ctx.lineTo(26, -12);
        ctx.lineTo(22, -10);
        ctx.lineTo(0, 18);
        ctx.lineTo(-22, -10);
        ctx.lineTo(-26, -12);
        ctx.closePath();
        ctx.fill();

        // Faceted Fuselage Ridge Specular Lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, 22); ctx.lineTo(0, -12);
        ctx.moveTo(0, 12); ctx.lineTo(16, -14);
        ctx.moveTo(0, 12); ctx.lineTo(-16, -14);
        ctx.stroke();

        // Wingtip Navigation LED Strobes (Green starboard / Red port)
        const strobe = Math.floor(performance.now() * 0.005) % 2 === 0;
        ctx.fillStyle = strobe ? '#22c55e' : '#14532d';
        ctx.fillRect(24, -14, 2, 4);
        ctx.fillStyle = strobe ? '#ef4444' : '#7f1d1d';
        ctx.fillRect(-26, -14, 2, 4);

        // Forward Optical Targeting Sensor Aperture (Infrared ruby lens)
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(0, 8, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.arc(0, 8, 1.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    },

    // Gunship (Heavily Armored VTOL Assault Gunship with Rotating Ducted Turbofans)
    drawGunship(ctx, x, y, angle) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        // Main Heavy Armor Fuselage
        const hullGrad = ctx.createLinearGradient(-16, 0, 16, 0);
        hullGrad.addColorStop(0, '#1e293b');
        hullGrad.addColorStop(0.3, '#334155');
        hullGrad.addColorStop(0.7, '#475569');
        hullGrad.addColorStop(1, '#1e293b');
        ctx.fillStyle = hullGrad;

        ctx.beginPath();
        ctx.moveTo(0, 28);       // Forward nose
        ctx.lineTo(16, -8);
        ctx.lineTo(14, -24);
        ctx.lineTo(-14, -24);
        ctx.lineTo(-16, -8);
        ctx.closePath();
        ctx.fill();

        // Twin Swiveling Ducted Turbofan Nacelles
        const fanAngle = performance.now() * 0.04;
        [-24, 16].forEach(engX => {
            // Outer armor nacelle pod
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(engX, -16, 12, 34);
            ctx.strokeStyle = '#64748b';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(engX, -16, 12, 34);

            // Intake fan disk & spinning titanium blades
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(engX + 2, -14, 8, 6);
            ctx.save();
            ctx.translate(engX + 6, -11);
            ctx.rotate(fanAngle);
            ctx.fillStyle = '#94a3b8';
            ctx.fillRect(-4, -1, 8, 2);
            ctx.fillRect(-1, -4, 2, 8);
            ctx.restore();

            // Turbofan thermal exhaust glow
            ctx.fillStyle = 'rgba(249, 115, 22, 0.4)';
            ctx.fillRect(engX + 2, 16, 8, 4);
        });

        // Weapon Wing Pylons & Rocket Pods
        ctx.fillStyle = '#475569';
        ctx.fillRect(-34, -4, 68, 7);

        // Rocket pod tubes with exposed red warhead tips
        [-32, 26].forEach(rx => {
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(rx, -2, 6, 10);
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.arc(rx + 3, -2, 2.5, Math.PI, 0);
            ctx.fill();
        });

        // Armored Cockpit Canopy with Amber Specular Glint
        const canopyGrad = ctx.createLinearGradient(-4, 4, 4, 16);
        canopyGrad.addColorStop(0, '#f59e0b');
        canopyGrad.addColorStop(0.5, '#b45309');
        canopyGrad.addColorStop(1, '#78350f');
        ctx.fillStyle = canopyGrad;
        ctx.fillRect(-4, 4, 8, 12);

        // Chin-Mounted 20mm Rotary Autocannon with Muzzle Flute
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-2, 24, 4, 14);
        ctx.fillStyle = '#475569';
        ctx.fillRect(-3, 34, 6, 4); // Muzzle compensator

        ctx.restore();
    },

    // Attack Helicopter (AH-64 Apache / Ka-52 Alligator Hybrid with Motion-Blurred Rotors)
    drawHelicopter(ctx, x, y, rotorAngle) {
        ctx.save();
        ctx.translate(x, y);

        // Stepped Armored Fuselage (Military olive-drab / slate)
        const fuseGrad = ctx.createLinearGradient(-12, 0, 12, 0);
        fuseGrad.addColorStop(0, '#1e293b');
        fuseGrad.addColorStop(0.5, '#334155');
        fuseGrad.addColorStop(1, '#1e293b');
        ctx.fillStyle = fuseGrad;

        ctx.beginPath();
        ctx.ellipse(0, 0, 16, 30, 0, 0, Math.PI * 2);
        ctx.fill();

        // Tandem Cockpit Glazing with Emerald Anti-Reflective Glare
        const glassGrad = ctx.createLinearGradient(0, 6, 0, 22);
        glassGrad.addColorStop(0, '#38bdf8');
        glassGrad.addColorStop(0.5, '#0284c7');
        glassGrad.addColorStop(1, '#0c4a6e');
        ctx.fillStyle = glassGrad;
        ctx.beginPath();
        ctx.ellipse(0, 14, 7, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        // Pilot and Gunner Headrests inside canopy
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-3, 8, 6, 4);
        ctx.fillRect(-3, 16, 6, 4);

        // Tail Boom, Vertical Fin & Horizontal Stabilizer
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(-4, -44, 8, 22);
        ctx.fillStyle = '#334155';
        ctx.fillRect(-16, -42, 32, 4);

        // Tail Rotor (Spinning high-speed disk)
        ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
        ctx.fillRect(-18, -46, 36, 3);
        ctx.fillStyle = '#eab308';
        ctx.fillRect(-18, -46, 4, 3);
        ctx.fillRect(14, -46, 4, 3);

        // Forward Nose FLIR Targeting Sensor Turret
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(0, 28, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(0, 29, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Chin 30mm Heavy Chain Gun Turret
        ctx.fillStyle = '#000000';
        ctx.fillRect(-2, 32, 4, 12);

        // Stub Wings with Hellfire Missile Racks & Hydra Rocket Pods
        ctx.fillStyle = '#475569';
        ctx.fillRect(-28, -4, 56, 6);
        // Rocket canisters
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(-26, 0, 6, 10);
        ctx.fillRect(20, 0, 6, 10);
        // Hellfire missiles
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(-18, 0, 3, 9);
        ctx.fillRect(15, 0, 3, 9);

        // High-Speed Rotor Mast & Motion-Blurred Composite Rotor Disk
        ctx.save();
        ctx.rotate(rotorAngle);

        // Blurred motion rotor disk
        const discGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, 52);
        discGrad.addColorStop(0, 'rgba(148, 163, 184, 0.45)');
        discGrad.addColorStop(0.8, 'rgba(100, 116, 139, 0.22)');
        discGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = discGrad;
        ctx.beginPath();
        ctx.arc(0, 0, 52, 0, Math.PI * 2);
        ctx.fill();

        // 4 Rigid Composite Rotor Blades with High-Visibility Yellow Tips
        for (let b = 0; b < 4; b++) {
            ctx.rotate(Math.PI / 2);
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(-3, 0, 6, 50);
            ctx.fillStyle = '#eab308'; // Safety yellow tips
            ctx.fillRect(-3, 44, 6, 6);
        }
        ctx.restore();

        // Central Titanium Swashplate Hub
        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.arc(0, 0, 7, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    },

    // Stealth Strategic Bomber (B-21 Raider / B-2 Spirit Flying Wing)
    drawBomber(ctx, x, y) {
        ctx.save();
        ctx.translate(x, y);

        // Flying Wing Stealth Airframe (Carbon-graphite radar absorbent material)
        const wingGrad = ctx.createLinearGradient(0, -35, 0, 35);
        wingGrad.addColorStop(0, '#1e293b');
        wingGrad.addColorStop(0.4, '#334155');
        wingGrad.addColorStop(1, '#0f172a');
        ctx.fillStyle = wingGrad;

        ctx.beginPath();
        ctx.moveTo(0, 34);       // Faceted nose apex
        ctx.lineTo(58, -20);     // Starboard wingtip
        ctx.lineTo(50, -34);     // Outer elevon
        ctx.lineTo(26, -22);     // Inboard serrated tooth
        ctx.lineTo(0, -30);      // Trailing centerline notch
        ctx.lineTo(-26, -22);
        ctx.lineTo(-50, -34);
        ctx.lineTo(-58, -20);    // Port wingtip
        ctx.closePath();
        ctx.fill();

        // Faceted Radar-Deflecting Ridges
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, 34); ctx.lineTo(26, -22);
        ctx.moveTo(0, 34); ctx.lineTo(-26, -22);
        ctx.stroke();

        // Low-Observable Dorsal Engine Intake Scoops & Heat-Shield Exhaust
        [-18, 10].forEach(ix => {
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(ix, -8, 8, 16);
            ctx.fillStyle = '#38bdf8';
            ctx.fillRect(ix + 1, 6, 6, 3); // Thermal glow
        });

        // Internal Weapons Rotary Bomb Bay (Illuminated ordnance bay)
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(-10, -6, 20, 22);
        ctx.fillStyle = '#7f1d1d';
        ctx.fillRect(-8, -4, 16, 18);
        // Smart bombs inside bay
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(-6, 0, 4, 12);
        ctx.fillRect(2, 0, 4, 12);

        ctx.restore();
    },

    // Airborne Supercarrier (Colossal Flying Fortress with Runway Deck & CIWS Guns)
    drawCarrier(ctx, x, y, isFlashing, animTimer) {
        ctx.save();
        ctx.translate(x, y);

        if (isFlashing) {
            ctx.shadowColor = Math.sin(animTimer * 12) > 0 ? '#facc15' : '#38bdf8';
            ctx.shadowBlur = 35;
        }

        // Heavy Reinforced Battleship Armor Hull
        const hullGrad = ctx.createLinearGradient(-65, 0, 65, 0);
        hullGrad.addColorStop(0, '#0f172a');
        hullGrad.addColorStop(0.3, '#1e293b');
        hullGrad.addColorStop(0.7, '#334155');
        hullGrad.addColorStop(1, '#0f172a');
        ctx.fillStyle = hullGrad;

        ctx.beginPath();
        ctx.moveTo(0, 72);
        ctx.lineTo(68, -15);
        ctx.lineTo(58, -65);
        ctx.lineTo(-58, -65);
        ctx.lineTo(-68, -15);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#020617';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Non-Skid Flight Deck
        ctx.fillStyle = '#334155';
        ctx.fillRect(-38, -56, 76, 104);

        // Angled Catapult Runway Markings & Centerline
        ctx.strokeStyle = '#f8fafc';
        ctx.setLineDash([12, 8]);
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, -52);
        ctx.lineTo(0, 42);
        ctx.stroke();
        ctx.setLineDash([]);

        // Deck Landing Number "01"
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 16px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('01', 0, 36);

        // 4 Steel Arresting Cables
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.5;
        [-42, -36, -30, -24].forEach(cy => {
            ctx.beginPath();
            ctx.moveTo(-34, cy);
            ctx.lineTo(34, cy);
            ctx.stroke();
        });

        // Command Superstructure Island & Radars
        ctx.fillStyle = '#64748b';
        ctx.fillRect(22, -44, 18, 32);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(24, -40, 14, 8); // Bridge glass

        // Rotating Phased-Array Radar Dome
        ctx.save();
        ctx.translate(31, -22);
        ctx.rotate(animTimer * 4);
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(-8, -2, 16, 4);
        ctx.restore();

        // Twin Plasma Propulsion Thrusters at Stern
        [-25, 13].forEach(ex => {
            const plume = ctx.createLinearGradient(0, -65, 0, -85);
            plume.addColorStop(0, '#ffffff');
            plume.addColorStop(0.3, '#38bdf8');
            plume.addColorStop(1, 'transparent');
            ctx.fillStyle = plume;
            ctx.fillRect(ex, -82, 12, 18);
        });

        ctx.restore();
    },

    // 5. REALISTIC GROUND UNITS
    // Main Battle Tank (Heavy Armored Treaded Tank)
    drawTank(ctx, x, y, headingAngle, turretAngle) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(headingAngle);

        // Dual Track Treads
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-22, -28, 10, 56);
        ctx.fillRect(12, -28, 10, 56);

        // Articulated Track Road Wheels
        ctx.fillStyle = '#475569';
        for (let ty = -24; ty <= 24; ty += 8) {
            ctx.beginPath();
            ctx.arc(-17, ty, 3.5, 0, Math.PI * 2);
            ctx.arc(17, ty, 3.5, 0, Math.PI * 2);
            ctx.fill();
        }

        // Armored Tank Hull with Reactive Armor Tiles
        ctx.fillStyle = '#57534e';
        ctx.fillRect(-13, -24, 26, 48);

        // Turret (Rotates independently toward target)
        ctx.save();
        ctx.rotate(turretAngle - headingAngle + Math.PI / 2);

        // Long Rifled Heavy Tank Cannon with Muzzle Brake
        ctx.fillStyle = '#1c1917';
        ctx.fillRect(-3, 0, 6, 32);
        ctx.fillStyle = '#44403c';
        ctx.fillRect(-5, 28, 10, 4); // Muzzle brake

        // Cast Steel Turret Mantlet & Cupola
        ctx.fillStyle = '#78716c';
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, Math.PI * 2);
        ctx.fill();

        // Commander optic sensor (Ruby anti-reflective glass)
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(-3, -3, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
        ctx.restore();
    },

    // Heavy Concrete Bunker Gun Emplacement
    drawGunEmplacement(ctx, x, y, turretAngle) {
        ctx.save();
        ctx.translate(x, y);

        // Hexagonal Reinforced Concrete Pillbox
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const a = (i * Math.PI) / 3;
            const px = Math.cos(a) * 22;
            const py = Math.sin(a) * 22;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 3;
        ctx.stroke();

        // 360-degree Rotating Heavy Armored Turret
        ctx.save();
        ctx.rotate(turretAngle + Math.PI / 2);

        // Twin Autocannon Barrels
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-4, 0, 3, 26);
        ctx.fillRect(1, 0, 3, 26);

        // Armored Cupola Dome
        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, Math.PI * 2);
        ctx.fill();

        // Targeting Radar / Infrared Optic
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(-3, 2, 6, 4);

        ctx.restore();
        ctx.restore();
    },

    // Railgun Fortress (Electromagnetic Linear Accelerator Bunker)
    drawRailgunFortress(ctx, x, y, animTimer) {
        ctx.save();
        ctx.translate(x, y);

        // Massive Ferroconcrete Base with Blast Scorch Marks
        ctx.fillStyle = '#334155';
        ctx.fillRect(-52, -44, 104, 88);
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 5;
        ctx.strokeRect(-52, -44, 104, 88);

        // Twin Massive Electromagnetic Rail Barrels
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-18, -62, 12, 65);
        ctx.fillRect(6, -62, 12, 65);

        // Superconducting Magnetic Coils Glowing with Plasma Arcs
        const pulse = Math.sin(animTimer * 12) * 0.4 + 0.6;
        ctx.fillStyle = `rgba(56, 189, 248, ${pulse})`;
        for (let cy = -58; cy <= -15; cy += 10) {
            ctx.fillRect(-20, cy, 16, 4);
            ctx.fillRect(4, cy, 16, 4);
        }

        // Heavy Hydraulic Recoil Absorbers
        ctx.fillStyle = '#64748b';
        ctx.fillRect(-22, 6, 44, 32);

        ctx.restore();
    },

    // Mobile Missile Launcher Platform
    drawGroundLauncher(ctx, x, y) {
        ctx.save();
        ctx.translate(x, y);

        ctx.fillStyle = '#334155';
        ctx.fillRect(-24, -18, 48, 38);

        // 4 Large Missile Launch Canisters
        [-18, -8, 2, 12].forEach(lx => {
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(lx, -24, 7, 36);
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.arc(lx + 3.5, -24, 3.5, Math.PI, 0);
            ctx.fill();
        });

        ctx.restore();
    },

    // 6. REALISTIC HIGH-RESOLUTION 8 STAGE BOSSES

    // Boss 1: Gunboat Leviathan (Heavy Naval Ironclad Dreadnought)
    drawBossLeviathan(ctx, x, y, hpRatio, phase, animTimer) {
        ctx.save();
        ctx.translate(x, y);

        // Hydrodynamic Bow Wake & Frothing Ocean Displacement
        ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
        for (let i = -45; i <= 45; i += 15) {
            const wakeLen = 35 + Math.sin(animTimer * 14 + i) * 12;
            ctx.beginPath();
            ctx.ellipse(i, -75, 8, wakeLen, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        // Battleship Armored Hull (Weathered Navy Battleship Grey)
        const hullGrad = ctx.createLinearGradient(-60, 0, 60, 0);
        hullGrad.addColorStop(0, '#1e293b');
        hullGrad.addColorStop(0.3, '#334155');
        hullGrad.addColorStop(0.5, '#475569');
        hullGrad.addColorStop(0.7, '#334155');
        hullGrad.addColorStop(1, '#1e293b');
        ctx.fillStyle = hullGrad;

        ctx.beginPath();
        ctx.moveTo(0, 95);      // Pointed armored bow ram
        ctx.lineTo(58, 25);
        ctx.lineTo(62, -75);
        ctx.lineTo(-62, -75);
        ctx.lineTo(-58, 25);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 4;
        ctx.stroke();

        // Teak & Iron Deck Plating
        ctx.fillStyle = '#475569';
        ctx.fillRect(-45, -65, 90, 100);

        // Forward Dual 16-Inch Heavy Naval Battery
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(0, 24, 22, 0, Math.PI * 2);
        ctx.fill();

        // Twin Naval Rifle Barrels
        ctx.fillStyle = '#020617';
        ctx.fillRect(-7, 30, 5, 42);
        ctx.fillRect(2, 30, 5, 42);

        // Command Superstructure & Navigation Mast
        ctx.fillStyle = '#64748b';
        ctx.fillRect(-18, -35, 36, 24);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(-14, -30, 28, 6); // Bridge glass

        if (phase === 3) {
            this.drawRealisticDamageSparks(ctx, 0, -20, animTimer);
        }

        ctx.restore();
    },

    // Boss 2: Sandstrider (Walking Siege Artillery Platform)
    drawBossSandstrider(ctx, x, y, hpRatio, phase, animTimer) {
        ctx.save();
        ctx.translate(x, y);

        // 4 Articulated Hydraulic Walking Legs
        const legSway = Math.sin(animTimer * 6) * 14;
        ctx.fillStyle = '#57534e';
        // Front Heavy Piston Legs
        ctx.fillRect(-78, -30 + legSway, 20, 65);
        ctx.fillRect(58, -30 - legSway, 20, 65);
        // Rear Stabilizing Legs
        ctx.fillRect(-85, -75 - legSway, 20, 65);
        ctx.fillRect(65, -75 + legSway, 20, 65);

        // Heavy Desert-Camouflage Armored Chassis
        const chassisGrad = ctx.createLinearGradient(-55, 0, 55, 0);
        chassisGrad.addColorStop(0, '#78350f');
        chassisGrad.addColorStop(0.5, '#d97706');
        chassisGrad.addColorStop(1, '#78350f');
        ctx.fillStyle = chassisGrad;

        ctx.fillRect(-55, -60, 110, 115);
        ctx.strokeStyle = '#451a03';
        ctx.lineWidth = 4;
        ctx.strokeRect(-55, -60, 110, 115);

        // Massive Twin 400mm Siege Howitzers
        ctx.fillStyle = '#1c1917';
        ctx.fillRect(-30, 25, 14, 65);
        ctx.fillRect(16, 25, 14, 65);

        // Rear Glowing Reactor Radiator Core (Primary Weak Point)
        const coreGlow = phase === 3 ? '#ef4444' : '#f59e0b';
        ctx.shadowColor = coreGlow;
        ctx.shadowBlur = 24;
        ctx.fillStyle = coreGlow;
        ctx.beginPath();
        ctx.arc(0, -42, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        if (phase === 3) {
            this.drawRealisticDamageSparks(ctx, 0, 0, animTimer);
        }

        ctx.restore();
    },

    // Boss 3: Sky Fortress (Multi-Panel Aerial Dreadnought)
    drawBossSkyFortress(ctx, x, y, hpRatio, phase, animTimer) {
        ctx.save();
        ctx.translate(x, y);

        // Colossal Flying Wing Airframe
        const wingGrad = ctx.createLinearGradient(0, -60, 0, 65);
        wingGrad.addColorStop(0, '#1e293b');
        wingGrad.addColorStop(1, '#334155');
        ctx.fillStyle = wingGrad;

        ctx.beginPath();
        ctx.moveTo(0, 70);
        ctx.lineTo(105, -35);
        ctx.lineTo(90, -70);
        ctx.lineTo(-90, -70);
        ctx.lineTo(-105, -35);
        ctx.closePath();
        ctx.fill();

        // Mechanically Deployable Armor Panels (Phase 2 & 3)
        const panelSlide = phase >= 2 ? 26 : 0;
        ctx.fillStyle = '#475569';
        ctx.fillRect(-75 - panelSlide, -25, 42, 42);
        ctx.fillRect(33 + panelSlide, -25, 42, 42);

        // Exposed Particle Battery Arrays
        if (phase >= 2) {
            ctx.fillStyle = '#38bdf8';
            ctx.fillRect(-62, -18, 16, 28);
            ctx.fillRect(46, -18, 16, 28);
        }

        // Central Supercharged Thermonuclear Core
        const coreColor = phase === 3 ? '#ef4444' : '#38bdf8';
        ctx.shadowColor = coreColor;
        ctx.shadowBlur = 25;
        ctx.fillStyle = coreColor;
        ctx.beginPath();
        ctx.arc(0, 14, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        if (phase === 3) {
            this.drawRealisticDamageSparks(ctx, 0, 14, animTimer);
        }

        ctx.restore();
    },

    // Boss 4: Hydra Walker (Jungle Biomechanical Walker)
    drawBossHydraWalker(ctx, x, y, hpRatio, phase, animTimer) {
        ctx.save();
        ctx.translate(x, y);

        // 4 Articulated Pneumatic Weapon Arms
        [-55, -28, 28, 55].forEach((armX, idx) => {
            const angle = Math.sin(animTimer * 5 + idx) * 0.45;
            ctx.save();
            ctx.translate(armX, -15);
            ctx.rotate(angle);
            ctx.fillStyle = '#14532d'; // Camo Green
            ctx.fillRect(-7, 0, 14, 58);
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(-4, 55, 8, 18);
            ctx.restore();
        });

        // Heavy Armored Central Chassis
        ctx.fillStyle = '#166534';
        ctx.beginPath();
        ctx.arc(0, 0, 48, 0, Math.PI * 2);
        ctx.fill();

        // Predatory Optical Compound Eye
        const eyeColor = phase === 3 ? '#ef4444' : '#22c55e';
        ctx.shadowColor = eyeColor;
        ctx.shadowBlur = 20;
        ctx.fillStyle = eyeColor;
        ctx.beginPath();
        ctx.ellipse(0, 12, 18, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        if (phase === 3) {
            this.drawRealisticDamageSparks(ctx, 0, 0, animTimer);
        }

        ctx.restore();
    },

    // Boss 5: Foundry Core (Geothermal Smelting Engine)
    drawBossFoundryCore(ctx, x, y, hpRatio, phase, animTimer) {
        ctx.save();
        ctx.translate(x, y);

        // Massive Foundry Frame
        ctx.fillStyle = '#292524';
        ctx.fillRect(-70, -60, 140, 125);

        // Rotating Heavy Industrial Slag Cogs
        ctx.save();
        ctx.rotate(animTimer * 2.5);
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 8;
        ctx.strokeRect(-35, -35, 70, 70);
        ctx.restore();

        // Boiling Molten Magma Core
        const moltenPulse = Math.sin(animTimer * 14) * 0.2 + 0.8;
        ctx.shadowColor = '#ea580c';
        ctx.shadowBlur = 30;
        ctx.fillStyle = `rgba(234, 88, 12, ${moltenPulse})`;
        ctx.beginPath();
        ctx.arc(0, 0, 34, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(0, 0, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        if (phase === 3) {
            this.drawRealisticDamageSparks(ctx, 0, 0, animTimer);
        }

        ctx.restore();
    },

    // Boss 6: Citadel Guardian (Cliff-Side Turret Fortress)
    drawBossCitadelGuardian(ctx, x, y, hpRatio, phase, animTimer) {
        ctx.save();
        ctx.translate(x, y);

        // Granite Mountain Battlement & Armored Wall
        ctx.fillStyle = '#334155';
        ctx.fillRect(-95, -55, 190, 105);
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 5;
        ctx.strokeRect(-95, -55, 190, 105);

        // 6 Automated Heavy Turret Batteries
        [-70, -35, 0, 35, 70].forEach((tx, idx) => {
            const rot = Math.sin(animTimer * 3.5 + idx) * 0.7 + Math.PI / 2;
            ctx.save();
            ctx.translate(tx, 30);
            ctx.rotate(rot);
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(-4, 0, 8, 28);
            ctx.fillStyle = '#64748b';
            ctx.beginPath();
            ctx.arc(0, 0, 12, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });

        // Central Missile Blast Bunker
        const coreAlert = phase === 3 ? '#ef4444' : '#38bdf8';
        ctx.fillStyle = coreAlert;
        ctx.fillRect(-25, -35, 50, 22);

        if (phase === 3) {
            this.drawRealisticDamageSparks(ctx, 0, 0, animTimer);
        }

        ctx.restore();
    },

    // Boss 7: Satellite Array (Orbital High-Energy Platform)
    drawBossSatelliteArray(ctx, x, y, hpRatio, phase, animTimer) {
        ctx.save();
        ctx.translate(x, y);

        // High-Resolution Gold Foil MLI & Silicon Photovoltaic Solar Arrays
        const panelLeft = hpRatio > 0.4;
        const panelRight = hpRatio > 0.6;

        if (panelLeft) {
            ctx.fillStyle = '#0369a1';
            ctx.fillRect(-105, -38, 48, 76);
            ctx.strokeStyle = '#38bdf8';
            ctx.strokeRect(-105, -38, 48, 76);
            // Solar Cell Silicon Grid Lines
            for (let px = -100; px < -60; px += 10) {
                ctx.fillStyle = '#0284c7';
                ctx.fillRect(px, -38, 3, 76);
            }
        }

        if (panelRight) {
            ctx.fillStyle = '#0369a1';
            ctx.fillRect(57, -38, 48, 76);
            ctx.strokeStyle = '#38bdf8';
            ctx.strokeRect(57, -38, 48, 76);
            for (let px = 62; px < 100; px += 10) {
                ctx.fillStyle = '#0284c7';
                ctx.fillRect(px, -38, 3, 76);
            }
        }

        // Central Station Module (Gold Thermal Insulation Foil)
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(0, 0, 36, 0, Math.PI * 2);
        ctx.fill();

        // Ion Particle Aperture Core
        const ionColor = phase === 3 ? '#ec4899' : '#06b6d4';
        ctx.shadowColor = ionColor;
        ctx.shadowBlur = 25;
        ctx.fillStyle = ionColor;
        ctx.beginPath();
        ctx.arc(0, 0, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        if (phase === 3) {
            this.drawRealisticDamageSparks(ctx, 0, 0, animTimer);
        }

        ctx.restore();
    },

    // Boss 8: Overlord Mk-II (Final Flagship - 3 Transformative Phases)
    drawBossOverlord(ctx, x, y, hpRatio, phase, animTimer) {
        ctx.save();
        ctx.translate(x, y);

        if (phase === 1) {
            // Phase 1: Heavy Dreadnought Armor
            ctx.fillStyle = '#450a0a';
            ctx.beginPath();
            ctx.moveTo(0, 85);
            ctx.lineTo(105, 10);
            ctx.lineTo(85, -60);
            ctx.lineTo(-85, -60);
            ctx.lineTo(-105, 10);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 4;
            ctx.stroke();

            // Heavy Twin Plasma Cannons
            ctx.fillStyle = '#1c1917';
            ctx.fillRect(-70, -15, 14, 52);
            ctx.fillRect(56, -15, 14, 52);

            ctx.fillStyle = '#dc2626';
            ctx.beginPath();
            ctx.arc(0, 8, 28, 0, Math.PI * 2);
            ctx.fill();
        } else if (phase === 2) {
            // Phase 2: Armor Shed, Internal Mechanical Frame Exposed
            ctx.fillStyle = '#18181b';
            ctx.beginPath();
            ctx.moveTo(0, 75);
            ctx.lineTo(70, -15);
            ctx.lineTo(50, -55);
            ctx.lineTo(-50, -55);
            ctx.lineTo(-70, -15);
            ctx.closePath();
            ctx.fill();

            ctx.shadowColor = '#f97316';
            ctx.shadowBlur = 30;
            ctx.fillStyle = '#f97316';
            ctx.beginPath();
            ctx.arc(0, 0, 25, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            this.drawRealisticDamageSparks(ctx, 0, -20, animTimer);
        } else {
            // Phase 3: Desperation Hyper-Core Mode
            ctx.fillStyle = '#020617';
            ctx.beginPath();
            ctx.moveTo(0, 65);
            ctx.lineTo(55, -35);
            ctx.lineTo(-55, -35);
            ctx.closePath();
            ctx.fill();

            const flash = Math.sin(animTimer * 25) > 0;
            const hyperColor = flash ? '#ffffff' : '#ef4444';
            ctx.shadowColor = '#ef4444';
            ctx.shadowBlur = 40;
            ctx.fillStyle = hyperColor;
            ctx.beginPath();
            ctx.arc(0, 0, 30, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            this.drawRealisticDamageSparks(ctx, 0, 0, animTimer);
            this.drawRealisticDamageSparks(ctx, -35, -15, animTimer + 1);
            this.drawRealisticDamageSparks(ctx, 35, -15, animTimer + 2);
        }

        ctx.restore();
    },

    // Damage sparks helper
    drawRealisticDamageSparks(ctx, x, y, animTimer) {
        ctx.save();
        for (let i = 0; i < 6; i++) {
            const angle = animTimer * 12 + i * (Math.PI / 3);
            const dist = 20 + Math.sin(animTimer * 18 + i) * 12;
            const sx = x + Math.cos(angle) * dist;
            const sy = y + Math.sin(angle) * dist;
            ctx.fillStyle = '#fef08a';
            ctx.fillRect(sx - 2, sy - 2, 4, 4);
        }
        ctx.restore();
    },

    // 7. REALISTIC PICKUPS (Tactical Nano-Containers & Polished Medals)
    drawPickup(ctx, pickup, animTimer) {
        ctx.save();
        ctx.translate(pickup.x, pickup.y);

        const type = pickup.type;

        if (type === 'medal') {
            // Realistic High-Polish Gold Coin with Shimmering Specular Rotation
            const scaleX = Math.cos(animTimer * 6);
            ctx.scale(scaleX, 1);

            // Gold Outer Bevel
            ctx.shadowColor = '#eab308';
            ctx.shadowBlur = 12;
            const goldGrad = ctx.createRadialGradient(-3, -3, 2, 0, 0, 14);
            goldGrad.addColorStop(0, '#fef08a');
            goldGrad.addColorStop(0.5, '#f59e0b');
            goldGrad.addColorStop(1, '#b45309');
            ctx.fillStyle = goldGrad;

            ctx.beginPath();
            ctx.arc(0, 0, 14, 0, Math.PI * 2);
            ctx.fill();

            // Inner Emblem Rim
            ctx.strokeStyle = '#fef08a';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(0, 0, 10, 0, Math.PI * 2);
            ctx.stroke();

            // Star Emblem
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(-3, -3, 6, 6);
        } else {
            // Tactical Holographic Supply Capsule
            let bgColor = '#ef4444';
            let label = 'V';
            if (type === 'L') { bgColor = '#0284c7'; label = 'L'; }
            else if (type === 'M') { bgColor = '#eab308'; label = 'M'; }
            else if (type === 'B') { bgColor = '#16a34a'; label = 'B'; }

            ctx.shadowColor = bgColor;
            ctx.shadowBlur = 16;

            // Rounded Metallic Case
            ctx.fillStyle = '#0f172a';
            ctx.beginPath();
            if (typeof ctx.roundRect === 'function') {
                ctx.roundRect(-16, -16, 32, 32, 8);
            } else {
                ctx.rect(-16, -16, 32, 32);
            }
            ctx.fill();
            ctx.strokeStyle = bgColor;
            ctx.lineWidth = 2.5;
            ctx.stroke();

            // Luminous Emblem
            ctx.fillStyle = bgColor;
            ctx.font = 'bold 16px "Courier New", monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(label, 0, 1);
        }

        ctx.restore();
    },

    // 8. HYPER-REALISTIC THERMOBARIC BOMB EXPLOSION & VFX
    drawRealisticBombExplosion(ctx, bomb) {
        ctx.save();
        const { x, y, progress, maxRadius } = bomb;

        // 1. Refractive Compression Blast Wave Ring
        const currentR = maxRadius * Math.pow(progress, 0.7);
        const waveAlpha = Math.max(0, 1 - progress);

        // Outer EMP shockwave boundary
        ctx.globalAlpha = waveAlpha * 0.9;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 8 * (1 - progress) + 3;
        ctx.beginPath();
        ctx.arc(x, y, currentR, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 18 * (1 - progress) + 4;
        ctx.beginPath();
        ctx.arc(x, y, Math.max(0, currentR - 10), 0, Math.PI * 2);
        ctx.stroke();

        // 2. Churning Volumetric Fireball (Turbulent Expanding Lobes)
        const fireballR = maxRadius * 0.65 * (1 - Math.pow(1 - progress, 3));
        const numLobes = 16;
        for (let i = 0; i < numLobes; i++) {
            const angle = (i / numLobes) * Math.PI * 2 + progress * 0.5;
            const dist = fireballR * (0.6 + Math.sin(i * 3 + progress * 10) * 0.3);
            const lobeX = x + Math.cos(angle) * dist;
            const lobeY = y + Math.sin(angle) * dist;
            const lobeRadius = (fireballR * 0.45) * (1 - progress * 0.6);

            // Volumetric Gradient: White-Hot Center -> Molten Orange -> Dark Charcoal Smoke
            const fireGrad = ctx.createRadialGradient(lobeX, lobeY, 0, lobeX, lobeY, Math.max(1, lobeRadius));
            if (progress < 0.35) {
                fireGrad.addColorStop(0, '#ffffff');
                fireGrad.addColorStop(0.3, '#fde047');
                fireGrad.addColorStop(0.7, '#ea580c');
                fireGrad.addColorStop(1, 'rgba(185, 28, 28, 0)');
            } else {
                fireGrad.addColorStop(0, '#f97316');
                fireGrad.addColorStop(0.4, '#dc2626');
                fireGrad.addColorStop(0.8, '#1e293b'); // Billowing dark soot
                fireGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
            }

            ctx.globalAlpha = Math.max(0, (1 - progress) * 0.85);
            ctx.fillStyle = fireGrad;
            ctx.beginPath();
            ctx.arc(lobeX, lobeY, Math.max(1, lobeRadius), 0, Math.PI * 2);
            ctx.fill();
        }

        // 3. Blinding Central Thermal Detonation Core
        if (progress < 0.45) {
            const coreAlpha = (1 - progress / 0.45);
            ctx.globalAlpha = coreAlpha;
            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = 40;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(x, y, fireballR * 0.55, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    },

    // Standard Particle Render
    drawExplosion(ctx, p) {
        ctx.save();
        ctx.translate(p.x, p.y);
        const progress = p.age / p.life;
        const radius = p.maxRadius * (1 - Math.pow(progress - 1, 2));
        const alpha = Math.max(0, 1 - progress);

        ctx.globalAlpha = alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(0, 0, Math.max(1, radius), 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
};

window.Sprites = Sprites;
