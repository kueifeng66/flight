// Thunder Loop - Stage Timeline Definitions & Parallax Background System
// Implements all 8 Stages + Loop 2 mechanics strictly according to the Game Design Document.

const STAGES = [
    // --- STAGE 1: Coastal Strike ---
    {
        number: 1,
        name: "Coastal Strike",
        subtitle: "Beaches & Patrol Boats",
        palette: {
            bgDeep: "#0284c7",    // Deep blue sea
            bgMid: "#06b6d4",     // Turquoise shallows
            terrain: "#fde047",   // Sandy beaches & atolls
            accent: "#ffffff",    // Sea foam & surf
            clouds: "rgba(255, 255, 255, 0.25)"
        },
        duration: 55, // seconds until boss
        boss: {
            type: "leviathan",
            name: "Gunboat Leviathan",
            title: "Heavy Naval Ironclad Dreadnought",
            maxHp: 380,
            phases: 2
        },
        // Timeline of enemy wave spawns (time in seconds)
        spawns: [
            // Wave 1: Intro scout waves
            { time: 2, type: 'scout_formation', count: 5, side: 'left' },
            { time: 5, type: 'scout_formation', count: 5, side: 'right' },
            // Wave 2: First ground gun emplacements on beach
            { time: 8, type: 'emplacement', xRatio: 0.3 },
            { time: 9, type: 'emplacement', xRatio: 0.7 },
            // Wave 3: Patrol boats (gunships)
            { time: 13, type: 'gunship', xRatio: 0.5 },
            // Wave 4: Flashing carrier dropping Vulcan (V) or Laser (L)
            { time: 17, type: 'carrier', xRatio: 0.5, drop: 'weapon', isFlashing: true },
            // Wave 5: Helicopters hovering & spraying
            { time: 22, type: 'helicopter', xRatio: 0.25 },
            { time: 23, type: 'helicopter', xRatio: 0.75 },
            // Wave 6: Scout pincers + medals
            { time: 27, type: 'scout_formation', count: 6, side: 'cross' },
            { time: 30, type: 'emplacement', xRatio: 0.2 },
            { time: 30, type: 'emplacement', xRatio: 0.8 },
            // Wave 7: Flashing carrier with Missile add-on (M)
            { time: 35, type: 'carrier', xRatio: 0.4, drop: 'missile', isFlashing: true },
            // Wave 8: Heavy bomber crossing screen
            { time: 40, type: 'bomber', xRatio: 0.3 },
            // Wave 9: Tank convoy along coastal roadway
            { time: 44, type: 'tank', xRatio: 0.4 },
            { time: 45, type: 'tank', xRatio: 0.6 },
            // Wave 10: Final carrier with Bomb (B)
            { time: 49, type: 'carrier', xRatio: 0.5, drop: 'bomb', isFlashing: true }
        ]
    },

    // --- STAGE 2: Desert Convoy ---
    {
        number: 2,
        name: "Desert Convoy",
        subtitle: "Supply Lines & Tank Columns",
        palette: {
            bgDeep: "#b45309",   // Canyon red rock
            bgMid: "#d97706",    // Sand dunes
            terrain: "#fef3c7",  // Desert sands
            accent: "#78350f",   // Roadways & tracks
            clouds: "rgba(254, 243, 199, 0.15)"
        },
        duration: 60,
        boss: {
            type: "sandstrider",
            name: "Sandstrider",
            title: "All-Terrain Walking Artillery Platform",
            maxHp: 480,
            phases: 2
        },
        spawns: [
            { time: 2, type: 'tank', xRatio: 0.3 },
            { time: 3, type: 'tank', xRatio: 0.5 },
            { time: 4, type: 'tank', xRatio: 0.7 },
            { time: 7, type: 'scout_formation', count: 6, side: 'left' },
            { time: 10, type: 'launcher', xRatio: 0.25 },
            { time: 10, type: 'launcher', xRatio: 0.75 },
            { time: 14, type: 'carrier', xRatio: 0.5, drop: 'weapon', isFlashing: true },
            { time: 19, type: 'helicopter', xRatio: 0.4 },
            { time: 21, type: 'helicopter', xRatio: 0.6 },
            { time: 25, type: 'tank', xRatio: 0.2 },
            { time: 26, type: 'tank', xRatio: 0.8 },
            { time: 30, type: 'carrier', xRatio: 0.5, drop: 'missile', isFlashing: true },
            { time: 35, type: 'scout_formation', count: 7, side: 'cross' },
            { time: 39, type: 'bomber', xRatio: 0.5 },
            { time: 43, type: 'launcher', xRatio: 0.5 },
            { time: 47, type: 'tank', xRatio: 0.35 },
            { time: 48, type: 'tank', xRatio: 0.65 },
            { time: 52, type: 'carrier', xRatio: 0.5, drop: 'bomb', isFlashing: true }
        ]
    },

    // --- STAGE 3: City Ruins ---
    {
        number: 3,
        name: "City Ruins",
        subtitle: "Rooftop Turrets & Sky Fortresses",
        palette: {
            bgDeep: "#0f172a",   // Dark streets
            bgMid: "#1e293b",    // Ruined skyscrapers
            terrain: "#334155",  // Concrete rooftops
            accent: "#38bdf8",   // City lights / glass
            clouds: "rgba(148, 163, 184, 0.2)"
        },
        duration: 62,
        boss: {
            type: "skyfortress",
            name: "Sky Fortress",
            title: "Multi-Panel Heavy Aerial Dreadnought",
            maxHp: 580,
            phases: 2
        },
        spawns: [
            { time: 2, type: 'emplacement', xRatio: 0.3 },
            { time: 3, type: 'emplacement', xRatio: 0.7 },
            { time: 6, type: 'scout_formation', count: 6, side: 'right' },
            { time: 10, type: 'bomber', xRatio: 0.3 },
            { time: 12, type: 'bomber', xRatio: 0.7 },
            { time: 16, type: 'carrier', xRatio: 0.5, drop: 'weapon', isFlashing: true },
            { time: 20, type: 'gunship', xRatio: 0.25 },
            { time: 21, type: 'gunship', xRatio: 0.75 },
            { time: 26, type: 'railgun', xRatio: 0.5 },
            { time: 32, type: 'scout_formation', count: 8, side: 'cross' },
            { time: 36, type: 'carrier', xRatio: 0.4, drop: 'missile', isFlashing: true },
            { time: 41, type: 'helicopter', xRatio: 0.3 },
            { time: 42, type: 'helicopter', xRatio: 0.7 },
            { time: 47, type: 'bomber', xRatio: 0.5 },
            { time: 51, type: 'emplacement', xRatio: 0.2 },
            { time: 51, type: 'emplacement', xRatio: 0.8 },
            { time: 54, type: 'carrier', xRatio: 0.5, drop: 'bomb', isFlashing: true }
        ]
    },

    // --- STAGE 4: Jungle Canopy ---
    {
        number: 4,
        name: "Jungle Canopy",
        subtitle: "Hidden Emplacements & River Ambush",
        palette: {
            bgDeep: "#064e3b",   // Deep jungle
            bgMid: "#047857",    // Thick canopy
            terrain: "#059669",  // Tree clusters
            accent: "#0ea5e9",   // Winding jungle river
            clouds: "rgba(16, 185, 129, 0.15)"
        },
        duration: 65,
        boss: {
            type: "hydrawalker",
            name: "Hydra Walker",
            title: "Multi-Limb Biomechanical Assault Mech",
            maxHp: 680,
            phases: 3 // Stages 4+ have Phase 3 desperation!
        },
        spawns: [
            { time: 2, type: 'scout_formation', count: 7, side: 'left' },
            { time: 5, type: 'emplacement', xRatio: 0.4 },
            { time: 8, type: 'gunship', xRatio: 0.6 },
            { time: 12, type: 'carrier', xRatio: 0.5, drop: 'weapon', isFlashing: true },
            { time: 17, type: 'helicopter', xRatio: 0.2 },
            { time: 18, type: 'helicopter', xRatio: 0.8 },
            { time: 23, type: 'launcher', xRatio: 0.3 },
            { time: 23, type: 'launcher', xRatio: 0.7 },
            { time: 28, type: 'carrier', xRatio: 0.5, drop: 'missile', isFlashing: true },
            { time: 33, type: 'scout_formation', count: 8, side: 'cross' },
            { time: 38, type: 'tank', xRatio: 0.5 },
            { time: 43, type: 'bomber', xRatio: 0.4 },
            { time: 48, type: 'emplacement', xRatio: 0.25 },
            { time: 48, type: 'emplacement', xRatio: 0.75 },
            { time: 53, type: 'carrier', xRatio: 0.5, drop: 'bomb', isFlashing: true }
        ]
    },

    // --- STAGE 5: Industrial Complex ---
    {
        number: 5,
        name: "Industrial Complex",
        subtitle: "Molten Slag & Fast Conveyors",
        palette: {
            bgDeep: "#292524",   // Dark iron floor
            bgMid: "#78350f",    // Rusty girders
            terrain: "#b45309",  // Factory structures
            accent: "#ea580c",   // Glowing molten iron conveyors
            clouds: "rgba(234, 88, 12, 0.12)"
        },
        duration: 65,
        boss: {
            type: "foundrycore",
            name: "Foundry Core",
            title: "Geothermal Smelting Engine",
            maxHp: 780,
            phases: 3
        },
        spawns: [
            { time: 2, type: 'tank', xRatio: 0.3 },
            { time: 3, type: 'tank', xRatio: 0.7 },
            { time: 6, type: 'scout_formation', count: 7, side: 'right' },
            { time: 10, type: 'railgun', xRatio: 0.5 },
            { time: 16, type: 'carrier', xRatio: 0.5, drop: 'weapon', isFlashing: true },
            { time: 21, type: 'launcher', xRatio: 0.25 },
            { time: 21, type: 'launcher', xRatio: 0.75 },
            { time: 26, type: 'gunship', xRatio: 0.5 },
            { time: 31, type: 'carrier', xRatio: 0.5, drop: 'missile', isFlashing: true },
            { time: 36, type: 'scout_formation', count: 8, side: 'cross' },
            { time: 41, type: 'bomber', xRatio: 0.3 },
            { time: 43, type: 'bomber', xRatio: 0.7 },
            { time: 48, type: 'tank', xRatio: 0.4 },
            { time: 49, type: 'tank', xRatio: 0.6 },
            { time: 54, type: 'carrier', xRatio: 0.5, drop: 'bomb', isFlashing: true }
        ]
    },

    // --- STAGE 6: Mountain Citadel ---
    {
        number: 6,
        name: "Mountain Citadel",
        subtitle: "Cliff Batteries & Dense Bullet Walls",
        palette: {
            bgDeep: "#1e293b",   // Mountain shadow
            bgMid: "#475569",    // Granite peaks
            terrain: "#cbd5e1",  // Snow caps & icy crags
            accent: "#f8fafc",   // Pure snow ridges
            clouds: "rgba(248, 250, 252, 0.3)"
        },
        duration: 68,
        boss: {
            type: "citadelguardian",
            name: "Citadel Guardian",
            title: "Cliff-Side Fortress Battery Cluster",
            maxHp: 880,
            phases: 3
        },
        spawns: [
            { time: 2, type: 'emplacement', xRatio: 0.2 },
            { time: 3, type: 'emplacement', xRatio: 0.8 },
            { time: 7, type: 'scout_formation', count: 8, side: 'cross' },
            { time: 12, type: 'railgun', xRatio: 0.5 },
            { time: 17, type: 'carrier', xRatio: 0.5, drop: 'weapon', isFlashing: true },
            { time: 22, type: 'helicopter', xRatio: 0.3 },
            { time: 23, type: 'helicopter', xRatio: 0.7 },
            { time: 28, type: 'gunship', xRatio: 0.5 },
            { time: 33, type: 'carrier', xRatio: 0.5, drop: 'missile', isFlashing: true },
            { time: 38, type: 'bomber', xRatio: 0.3 },
            { time: 40, type: 'bomber', xRatio: 0.7 },
            { time: 46, type: 'scout_formation', count: 9, side: 'cross' },
            { time: 51, type: 'launcher', xRatio: 0.3 },
            { time: 51, type: 'launcher', xRatio: 0.7 },
            { time: 56, type: 'carrier', xRatio: 0.5, drop: 'bomb', isFlashing: true }
        ]
    },

    // --- STAGE 7: Orbital Platform ---
    {
        number: 7,
        name: "Orbital Platform",
        subtitle: "Zero-Gravity Defense & Solar Arrays",
        palette: {
            bgDeep: "#020617",   // Deep space void
            bgMid: "#0369a1",    // Earth curvature glow
            terrain: "#0f172a",  // Station scaffolding
            accent: "#38bdf8",   // Cyan solar arrays & laser conduits
            clouds: "rgba(56, 189, 248, 0.1)" // Nebular dust
        },
        duration: 70,
        boss: {
            type: "satellitearray",
            name: "Satellite Array",
            title: "Orbital Defense Beam Station",
            maxHp: 980,
            phases: 3
        },
        spawns: [
            { time: 2, type: 'scout_formation', count: 8, side: 'left' },
            { time: 4, type: 'scout_formation', count: 8, side: 'right' },
            { time: 8, type: 'gunship', xRatio: 0.3 },
            { time: 8, type: 'gunship', xRatio: 0.7 },
            { time: 14, type: 'carrier', xRatio: 0.5, drop: 'weapon', isFlashing: true },
            { time: 19, type: 'bomber', xRatio: 0.5 },
            { time: 25, type: 'scout_formation', count: 9, side: 'cross' },
            { time: 30, type: 'carrier', xRatio: 0.5, drop: 'missile', isFlashing: true },
            { time: 36, type: 'gunship', xRatio: 0.25 },
            { time: 37, type: 'gunship', xRatio: 0.75 },
            { time: 43, type: 'helicopter', xRatio: 0.4 },
            { time: 44, type: 'helicopter', xRatio: 0.6 },
            { time: 50, type: 'bomber', xRatio: 0.3 },
            { time: 52, type: 'bomber', xRatio: 0.7 },
            { time: 58, type: 'carrier', xRatio: 0.5, drop: 'bomb', isFlashing: true }
        ]
    },

    // --- STAGE 8: Command Center ---
    {
        number: 8,
        name: "Command Center",
        subtitle: "Heart of the Hostile Network",
        palette: {
            bgDeep: "#1c1917",   // Dark military floor
            bgMid: "#450a0a",    // Crimson structural plating
            terrain: "#7f1d1d",  // Red defensive bastions
            accent: "#ef4444",   // Red warning alarms & laser gates
            clouds: "rgba(239, 68, 68, 0.15)"
        },
        duration: 75,
        boss: {
            type: "overlord",
            name: "Overlord Mk-II",
            title: "Supreme Autonomous War Machine",
            maxHp: 1200,
            phases: 3 // Full 3-phase epic battle!
        },
        spawns: [
            { time: 2, type: 'scout_formation', count: 8, side: 'cross' },
            { time: 6, type: 'railgun', xRatio: 0.3 },
            { time: 6, type: 'railgun', xRatio: 0.7 },
            { time: 12, type: 'carrier', xRatio: 0.5, drop: 'weapon', isFlashing: true },
            { time: 17, type: 'gunship', xRatio: 0.25 },
            { time: 18, type: 'gunship', xRatio: 0.75 },
            { time: 24, type: 'bomber', xRatio: 0.5 },
            { time: 29, type: 'tank', xRatio: 0.3 },
            { time: 30, type: 'tank', xRatio: 0.7 },
            { time: 35, type: 'carrier', xRatio: 0.5, drop: 'missile', isFlashing: true },
            { time: 40, type: 'scout_formation', count: 10, side: 'cross' },
            { time: 45, type: 'launcher', xRatio: 0.2 },
            { time: 45, type: 'launcher', xRatio: 0.8 },
            { time: 50, type: 'helicopter', xRatio: 0.4 },
            { time: 51, type: 'helicopter', xRatio: 0.6 },
            { time: 57, type: 'bomber', xRatio: 0.3 },
            { time: 58, type: 'bomber', xRatio: 0.7 },
            { time: 63, type: 'carrier', xRatio: 0.5, drop: 'bomb', isFlashing: true }
        ]
    }
];

// Background Parallax Renderer for each Stage
// High-Resolution Background Parallax Renderer for 720x1080 Display
// Hyper-Realistic Photorealistic Terrain & Volumetric Atmospheric Cloud Engine
class BackgroundRenderer {
    constructor() {
        this.scrollY = 0;
        this.animTimer = 0;

        // 1. Photorealistic Multi-Spectral Starfield (For Stage 7 Space)
        this.stars = [];
        for (let i = 0; i < 220; i++) {
            const temp = Math.random();
            let starColor = '#ffffff';
            if (temp < 0.2) starColor = '#93c5fd'; // O-type Blue giant
            else if (temp < 0.4) starColor = '#fde047'; // G-type Yellow star
            else if (temp < 0.55) starColor = '#fca5a5'; // M-type Red dwarf
            else if (temp < 0.7) starColor = '#67e8f9';  // Cyan star

            this.stars.push({
                x: Math.random() * 720,
                y: Math.random() * 1080,
                speed: 0.3 + Math.random() * 2.2,
                size: Math.random() > 0.88 ? 2.8 : (Math.random() > 0.5 ? 1.8 : 1.1),
                color: starColor,
                twinkle: Math.random() * Math.PI * 2
            });
        }

        // 2. Realistic Dynamic Specular Sun Glitter on Water (45 flickering sparkles)
        this.waterGlints = [];
        for (let i = 0; i < 45; i++) {
            this.waterGlints.push({
                x: Math.random() * 720,
                y: Math.random() * 1080,
                phase: Math.random() * Math.PI * 2,
                speed: 1.5 + Math.random() * 3.5,
                size: 2 + Math.random() * 4
            });
        }

        // 3. Realistic Volumetric Cumulus Clouds with Ground Shadows
        this.clouds = [];
        const cloudCount = 4;
        for (let i = 0; i < cloudCount; i++) {
            const puffs = [];
            const numPuffs = 7 + Math.floor(Math.random() * 5);
            for (let p = 0; p < numPuffs; p++) {
                puffs.push({
                    ox: (Math.random() - 0.5) * 110,
                    oy: (Math.random() - 0.5) * 55,
                    r: 20 + Math.random() * 24
                });
            }
            this.clouds.push({
                x: i % 2 === 0 ? 110 + Math.random() * 140 : 470 + Math.random() * 140,
                y: (i / cloudCount) * 1080 + Math.random() * 80,
                speed: 38 + Math.random() * 22, // Gentle natural cloud drift speed
                scale: 0.75 + Math.random() * 0.25,
                puffs: puffs
            });
        }

        // 4. High-Altitude Stratospheric Cirrus Ribbons
        this.cirrus = [];
        for (let i = 0; i < 5; i++) {
            this.cirrus.push({
                x: Math.random() * 720,
                y: (i / 5) * 1080,
                speed: 15 + Math.random() * 12,
                len: 260 + Math.random() * 200,
                width: 25 + Math.random() * 20,
                angle: -0.25 + (Math.random() - 0.5) * 0.1
            });
        }
    }

    update(dt, scrollSpeed = 85) {
        this.scrollY += scrollSpeed * dt;
        this.animTimer += dt;

        // Update stars
        this.stars.forEach(s => {
            s.y += s.speed * scrollSpeed * 0.65 * dt;
            if (s.y > 1080) s.y = 0;
            s.twinkle += dt * 3.5;
        });

        // Update water glints
        this.waterGlints.forEach(g => {
            g.y += scrollSpeed * dt * 0.5;
            if (g.y > 1080) g.y = 0;
            g.phase += dt * g.speed;
        });

        // Update volumetric drifting clouds
        this.clouds.forEach(c => {
            c.y += c.speed * dt;
            c.x += Math.sin(this.animTimer * 0.2 + c.y * 0.005) * 12 * dt;
            if (c.y > 1250) {
                c.y = -250;
                c.x = Math.random() * 720;
            }
        });

        // Update high-altitude cirrus ribbons
        this.cirrus.forEach(cr => {
            cr.y += cr.speed * dt;
            if (cr.y > 1150) {
                cr.y = -120;
                cr.x = Math.random() * 720;
            }
        });
    }

    // Unified Fallback Render Method
    draw(ctx, width, height, stageIndex, loopNumber) {
        this.drawGroundLevel(ctx, width, height, stageIndex, loopNumber);
        this.drawCloudShadows(ctx, width, height);
        this.drawHighAtmosphereAndClouds(ctx, width, height);
    }

    // LAYER 1: Ground Satellite Terrain & Realistic Water
    drawGroundLevel(ctx, width, height, stageIndex, loopNumber) {
        const stage = STAGES[stageIndex % STAGES.length];
        const pal = stage.palette;

        // Base atmospheric scattering gradient
        const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, pal.bgDeep);
        bgGrad.addColorStop(1, pal.bgMid);
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Render realistic terrain for the stage
        if (stage.number === 1) {
            this.drawRealisticCoast(ctx, width, height, pal);
        } else if (stage.number === 2) {
            this.drawRealisticDesert(ctx, width, height, pal);
        } else if (stage.number === 3) {
            this.drawRealisticCity(ctx, width, height, pal);
        } else if (stage.number === 4) {
            this.drawRealisticJungleAndRiver(ctx, width, height, pal);
        } else if (stage.number === 5) {
            this.drawRealisticIndustrial(ctx, width, height, pal);
        } else if (stage.number === 6) {
            this.drawRealisticMountain(ctx, width, height, pal);
        } else if (stage.number === 7) {
            this.drawRealisticOrbitalEarth(ctx, width, height, pal);
        } else if (stage.number === 8) {
            this.drawRealisticCommandCenter(ctx, width, height, pal);
        }
    }

    // LAYER 2: Cloud Ground Shadows (Cast down onto land, river, and ocean from sun at top-left)
    drawCloudShadows(ctx, width, height) {
        ctx.save();
        // Directional shadow offset (sunlight from top-left)
        const shadowOffsetX = 45;
        const shadowOffsetY = 65;

        ctx.fillStyle = 'rgba(15, 23, 42, 0.18)'; // Soft natural ambient occlusion shadow

        this.clouds.forEach(c => {
            ctx.save();
            ctx.translate(c.x + shadowOffsetX, c.y + shadowOffsetY);
            ctx.scale(c.scale * 1.05, c.scale * 1.05);

            ctx.beginPath();
            c.puffs.forEach(p => {
                ctx.moveTo(p.ox + p.r, p.oy);
                ctx.arc(p.ox, p.oy, p.r, 0, Math.PI * 2);
            });
            ctx.fill();
            ctx.restore();
        });

        ctx.restore();
    }

    // LAYER 3: Realistic Sky, Sun Lens Flare, Cirrus Ribbons & High Volumetric Clouds
    drawHighAtmosphereAndClouds(ctx, width, height) {
        ctx.save();

        // 1. High Stratospheric Cirrus Ribbons (Wispy ice crystals)
        ctx.save();
        this.cirrus.forEach(cr => {
            ctx.save();
            ctx.translate(cr.x, cr.y);
            ctx.rotate(cr.angle);

            const cirGrad = ctx.createLinearGradient(-cr.len * 0.5, 0, cr.len * 0.5, 0);
            cirGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
            cirGrad.addColorStop(0.3, 'rgba(255, 255, 255, 0.18)');
            cirGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.28)');
            cirGrad.addColorStop(0.8, 'rgba(255, 255, 255, 0.15)');
            cirGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

            ctx.fillStyle = cirGrad;
            ctx.beginPath();
            ctx.ellipse(0, 0, cr.len * 0.5, cr.width * 0.5, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
        ctx.restore();

        // 2. Volumetric Cumulus Clouds Drifting Overhead
        this.clouds.forEach(c => {
            ctx.save();
            ctx.translate(c.x, c.y);
            ctx.scale(c.scale, c.scale);

            // Tier 1: Cool ambient shadow underside (ambient bounce)
            ctx.fillStyle = 'rgba(148, 163, 184, 0.35)';
            ctx.beginPath();
            c.puffs.forEach(p => {
                ctx.moveTo(p.ox + p.r, p.oy + 8);
                ctx.arc(p.ox, p.oy + 8, p.r, 0, Math.PI * 2);
            });
            ctx.fill();

            // Tier 2: Diffuse dense cloud core
            ctx.fillStyle = 'rgba(241, 245, 249, 0.50)';
            ctx.beginPath();
            c.puffs.forEach(p => {
                ctx.moveTo(p.ox + p.r * 0.94, p.oy + 2);
                ctx.arc(p.ox, p.oy + 2, p.r * 0.94, 0, Math.PI * 2);
            });
            ctx.fill();

            // Tier 3: Brilliant sunlit crests (sunlight from top-left)
            ctx.fillStyle = 'rgba(255, 255, 255, 0.68)';
            ctx.beginPath();
            c.puffs.forEach(p => {
                const hx = p.ox - p.r * 0.22;
                const hy = p.oy - p.r * 0.22;
                const hr = p.r * 0.68;
                ctx.moveTo(hx + hr, hy);
                ctx.arc(hx, hy, hr, 0, Math.PI * 2);
            });
            ctx.fill();

            // Tier 4: Glancing specular silver rim highlights
            ctx.fillStyle = 'rgba(255, 255, 255, 0.80)';
            ctx.beginPath();
            c.puffs.forEach(p => {
                const rx = p.ox - p.r * 0.32;
                const ry = p.oy - p.r * 0.32;
                const rr = p.r * 0.42;
                ctx.moveTo(rx + rr, ry);
                ctx.arc(rx, ry, rr, 0, Math.PI * 2);
            });
            ctx.fill();

            ctx.restore();
        });

        // 3. Photorealistic Sun Disc, Corona & God Rays (Top-Left Sun Position at x: 70, y: 70)
        const sunX = 70;
        const sunY = 70;

        // Broad atmospheric sky bloom
        const skyBloom = ctx.createRadialGradient(sunX, sunY, 30, sunX, sunY, 520);
        skyBloom.addColorStop(0, 'rgba(254, 240, 138, 0.24)');
        skyBloom.addColorStop(0.35, 'rgba(56, 189, 248, 0.10)');
        skyBloom.addColorStop(1, 'transparent');
        ctx.fillStyle = skyBloom;
        ctx.fillRect(0, 0, width, height);

        // Radiant Sun Core & Corona Flare
        const sunCore = ctx.createRadialGradient(sunX, sunY, 5, sunX, sunY, 65);
        sunCore.addColorStop(0, '#ffffff');
        sunCore.addColorStop(0.3, 'rgba(255, 255, 255, 0.95)');
        sunCore.addColorStop(0.65, 'rgba(254, 240, 138, 0.6)');
        sunCore.addColorStop(1, 'transparent');
        ctx.fillStyle = sunCore;
        ctx.beginPath();
        ctx.arc(sunX, sunY, 65, 0, Math.PI * 2);
        ctx.fill();

        // Atmospheric God Rays (Diagonal light streaks)
        ctx.save();
        ctx.translate(sunX, sunY);
        ctx.rotate(0.68);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
        for (let ray = -2; ray <= 2; ray++) {
            ctx.beginPath();
            ctx.moveTo(-15 + ray * 45, 0);
            ctx.lineTo(-45 + ray * 90, 950);
            ctx.lineTo(45 + ray * 90, 950);
            ctx.lineTo(15 + ray * 45, 0);
            ctx.closePath();
            ctx.fill();
        }
        ctx.restore();

        ctx.restore();
    }

    // --- REALISTIC TERRAIN STAGE IMPLEMENTATIONS ---

    // Helper: Draw organic natural island contour
    drawOrganicIslandPath(ctx, cx, cy, rx, ry, seed, factor = 0.16) {
        ctx.beginPath();
        const steps = 28;
        for (let i = 0; i <= steps; i++) {
            const angle = (i / steps) * Math.PI * 2;
            const distortion = 1 + Math.sin(angle * 3 + seed) * factor + Math.cos(angle * 5 + seed * 1.5) * (factor * 0.65);
            const x = cx + Math.cos(angle) * rx * distortion;
            const y = cy + Math.sin(angle) * ry * distortion;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
    }

    // 1. Realistic Coast: Satellite Coral Lagoon, Beaches, Breaking Surf & Sun Glints
    drawRealisticCoast(ctx, w, h, pal) {
        const yOffset = (this.scrollY * 0.45) % 650;

        // Dynamic Sun Glitter Sparkles on Ocean Surface
        this.waterGlints.forEach(g => {
            const intensity = Math.pow(Math.sin(g.phase), 2);
            if (intensity > 0.3) {
                ctx.save();
                ctx.globalAlpha = intensity * 0.8;
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(g.x, g.y, g.size, 0, Math.PI * 2);
                ctx.fill();
                // 4-point lens cross glint
                ctx.strokeStyle = 'rgba(254, 240, 138, 0.9)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(g.x - g.size * 2, g.y); ctx.lineTo(g.x + g.size * 2, g.y);
                ctx.moveTo(g.x, g.y - g.size * 2); ctx.lineTo(g.x, g.y + g.size * 2);
                ctx.stroke();
                ctx.restore();
            }
        });

        // Repeating archipelago island chain with organic satellite geometry
        for (let i = -1; i < 3; i++) {
            const y = yOffset + i * 650;
            const islands = [
                { cx: 160, cy: y + 170, rx: 185, ry: 118, seed: 1.4 },
                { cx: w - 170, cy: y + 470, rx: 195, ry: 128, seed: 3.8 }
            ];

            islands.forEach(isl => {
                // 1. Submerged Outer Coral Reef & Turquoise Lagoon
                ctx.fillStyle = '#0891b2';
                this.drawOrganicIslandPath(ctx, isl.cx, isl.cy, isl.rx, isl.ry, isl.seed, 0.18);
                ctx.fill();

                // 2. Shallows
                ctx.fillStyle = '#22d3ee';
                this.drawOrganicIslandPath(ctx, isl.cx, isl.cy, isl.rx * 0.88, isl.ry * 0.88, isl.seed, 0.18);
                ctx.fill();

                // 3. Ultra-Shallow Aqua Sandbar
                ctx.fillStyle = '#67e8f9';
                this.drawOrganicIslandPath(ctx, isl.cx, isl.cy, isl.rx * 0.78, isl.ry * 0.78, isl.seed, 0.18);
                ctx.fill();

                // 4. Foaming Surf Breaker Rim
                const surfW = Math.sin(this.animTimer * 2.8 + isl.seed) * 3;
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
                ctx.lineWidth = 3;
                this.drawOrganicIslandPath(ctx, isl.cx, isl.cy, isl.rx * 0.74 + surfW, isl.ry * 0.74 + surfW, isl.seed, 0.18);
                ctx.stroke();

                // 5. Wet Beach Sand (Dark Ochre)
                ctx.fillStyle = '#b45309';
                this.drawOrganicIslandPath(ctx, isl.cx, isl.cy, isl.rx * 0.68, isl.ry * 0.68, isl.seed, 0.16);
                ctx.fill();

                // 6. Dry Golden Sunlit Sand
                ctx.fillStyle = '#fde047';
                this.drawOrganicIslandPath(ctx, isl.cx, isl.cy, isl.rx * 0.60, isl.ry * 0.60, isl.seed, 0.16);
                ctx.fill();

                // 7. Dense Tropical Palm Canopy Interior
                ctx.fillStyle = '#14532d';
                this.drawOrganicIslandPath(ctx, isl.cx, isl.cy, isl.rx * 0.48, isl.ry * 0.48, isl.seed, 0.14);
                ctx.fill();

                ctx.fillStyle = '#16a34a';
                this.drawOrganicIslandPath(ctx, isl.cx - 6, isl.cy - 6, isl.rx * 0.40, isl.ry * 0.40, isl.seed, 0.14);
                ctx.fill();

                ctx.fillStyle = '#4ade80';
                this.drawOrganicIslandPath(ctx, isl.cx - 10, isl.cy - 10, isl.rx * 0.28, isl.ry * 0.28, isl.seed, 0.14);
                ctx.fill();
            });
        }
    }

    // 2. Realistic Desert: Barchan Sand Dunes with Razor-Sharp Crests, Wind Ripples & Highway
    drawRealisticDesert(ctx, w, h, pal) {
        const yOffset = (this.scrollY * 0.45) % 450;

        // 4-Lane Desert Military Highway
        ctx.fillStyle = '#1c1917';
        ctx.fillRect(w * 0.42, 0, w * 0.16, h);

        // Highway Shoulders & Desert Gravel Encroachment
        ctx.fillStyle = '#78716c';
        ctx.fillRect(w * 0.41, 0, 8, h);
        ctx.fillRect(w * 0.58, 0, 8, h);

        // Dashed Yellow Center Lines
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 3;
        ctx.setLineDash([26, 22]);
        ctx.beginPath();
        ctx.moveTo(w * 0.5, 0); ctx.lineTo(w * 0.5, h);
        ctx.stroke();
        ctx.setLineDash([]);

        // Undulating Crescent Barchan Sand Dunes with Fine Wind-Ripples
        for (let i = -1; i < 4; i++) {
            const y = yOffset + i * 450;
            const dunes = [
                { cx: 150, cy: y + 40, rw: 155, rh: 65, side: 'left' },
                { cx: w - 150, cy: y + 240, rw: 165, rh: 75, side: 'right' }
            ];

            dunes.forEach(d => {
                // 1. Deep Amber Slipface Shadow (Leeward side, sun from NW)
                ctx.fillStyle = '#78350f';
                ctx.beginPath();
                ctx.ellipse(d.cx, d.cy + 12, d.rw, d.rh * 0.6, 0.18, 0, Math.PI * 2);
                ctx.fill();

                // 2. Windward Sunlit Golden Slope
                const duneGrad = ctx.createLinearGradient(d.cx - d.rw, d.cy - d.rh, d.cx + d.rw, d.cy + d.rh);
                duneGrad.addColorStop(0, '#fde68a');
                duneGrad.addColorStop(0.4, '#f59e0b');
                duneGrad.addColorStop(1, '#d97706');
                ctx.fillStyle = duneGrad;
                ctx.beginPath();
                ctx.ellipse(d.cx, d.cy, d.rw, d.rh * 0.55, 0.18, 0, Math.PI * 2);
                ctx.fill();

                // 3. Razor-Sharp Wind Crest Line
                ctx.strokeStyle = '#fef3c7';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.ellipse(d.cx, d.cy, d.rw, d.rh * 0.55, 0.18, Math.PI, Math.PI * 2);
                ctx.stroke();

                // 4. Fine Wind-Ripple Striations across the sand
                ctx.strokeStyle = 'rgba(254, 243, 199, 0.22)';
                ctx.lineWidth = 1;
                for (let r = 1; r <= 3; r++) {
                    ctx.beginPath();
                    ctx.ellipse(d.cx, d.cy - r * 8, d.rw * (1 - r * 0.15), (d.rh * 0.55) * (1 - r * 0.15), 0.18, Math.PI * 1.05, Math.PI * 1.95);
                    ctx.stroke();
                }
            });
        }
    }

    // 3. Realistic City Ruins: High-Rise Towers with Directional Shadows & Helipads
    drawRealisticCity(ctx, w, h, pal) {
        const yOffset = (this.scrollY * 0.75) % 550;

        // Asphalt Street Grid with Lane Lines
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, w, h);

        // Cross Avenues
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(w * 0.28, 0, 48, h);
        ctx.fillRect(w * 0.68, 0, 48, h);

        for (let i = -1; i < 4; i++) {
            const y = yOffset + i * 550;

            // Street crossings
            ctx.fillRect(0, y + 100, w, 48);

            // Realistic Skyscraper Blocks casting SE Directional Shadows
            const towers = [
                { x: 30, y: y + 20, w: 155, h: 220, color: '#334155' },
                { x: w - 195, y: y + 60, w: 165, h: 240, color: '#1e293b' },
                { x: w * 0.38, y: y + 260, w: 180, h: 180, color: '#475569' }
            ];

            towers.forEach(t => {
                // Directional Building Drop Shadow (SE Offset)
                ctx.fillStyle = 'rgba(2, 6, 23, 0.65)';
                ctx.fillRect(t.x + 35, t.y + 45, t.w, t.h);

                // Main Roof Slab
                ctx.fillStyle = t.color;
                ctx.fillRect(t.x, t.y, t.w, t.h);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
                ctx.lineWidth = 2;
                ctx.strokeRect(t.x, t.y, t.w, t.h);

                // Rooftop HVAC units, Elevator Penthouses & Solar Panels
                ctx.fillStyle = '#0f172a';
                ctx.fillRect(t.x + 20, t.y + 20, 45, 30);
                ctx.fillRect(t.x + t.w - 55, t.y + 30, 35, 35);

                // Helipad on specific tower
                if (t.w > 160) {
                    ctx.strokeStyle = '#facc15';
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.arc(t.x + t.w * 0.5, t.y + t.h * 0.5, 34, 0, Math.PI * 2);
                    ctx.stroke();

                    ctx.fillStyle = '#facc15';
                    ctx.font = 'bold 26px monospace';
                    ctx.textAlign = 'center';
                    ctx.fillText('H', t.x + t.w * 0.5, t.y + t.h * 0.5 + 9);
                }
            });
        }
    }

    // 4. Realistic Jungle & Silt River: Amazonian Meanders with Dynamic Water Flow & Deep Canopy Shading
    drawRealisticJungleAndRiver(ctx, w, h, pal) {
        const yOffset = (this.scrollY * 0.5) % 650;

        // 1. Muddy Riverbed Trench & Cut Banks (Deep clay/sand outer shelf)
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 145;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        for (let y = -60; y <= h + 60; y += 30) {
            const rx = w * 0.5 + Math.sin((y + this.scrollY) * 0.0055) * 140 + Math.cos((y + this.scrollY) * 0.012) * 35;
            if (y === -60) ctx.moveTo(rx, y);
            else ctx.lineTo(rx, y);
        }
        ctx.stroke();

        // 2. Sandbars & Riverbank Silt (Golden-brown wet sediment)
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 125;
        ctx.beginPath();
        for (let y = -60; y <= h + 60; y += 30) {
            const rx = w * 0.5 + Math.sin((y + this.scrollY) * 0.0055) * 140 + Math.cos((y + this.scrollY) * 0.012) * 35;
            if (y === -60) ctx.moveTo(rx, y);
            else ctx.lineTo(rx, y);
        }
        ctx.stroke();

        // 3. Shallows & Emergent Vegetation Fringe (Murky teal-green shallows)
        ctx.strokeStyle = '#0f766e';
        ctx.lineWidth = 100;
        ctx.beginPath();
        for (let y = -60; y <= h + 60; y += 30) {
            const rx = w * 0.5 + Math.sin((y + this.scrollY) * 0.0055) * 140 + Math.cos((y + this.scrollY) * 0.012) * 35;
            if (y === -60) ctx.moveTo(rx, y);
            else ctx.lineTo(rx, y);
        }
        ctx.stroke();

        // 4. Deep Main River Channel (Deep tropical azure/emerald)
        ctx.strokeStyle = '#0369a1';
        ctx.lineWidth = 75;
        ctx.beginPath();
        for (let y = -60; y <= h + 60; y += 30) {
            const rx = w * 0.5 + Math.sin((y + this.scrollY) * 0.0055) * 140 + Math.cos((y + this.scrollY) * 0.012) * 35;
            if (y === -60) ctx.moveTo(rx, y);
            else ctx.lineTo(rx, y);
        }
        ctx.stroke();

        // Deepest Center Trench
        ctx.strokeStyle = '#0c4a6e';
        ctx.lineWidth = 42;
        ctx.beginPath();
        for (let y = -60; y <= h + 60; y += 30) {
            const rx = w * 0.5 + Math.sin((y + this.scrollY) * 0.0055) * 140 + Math.cos((y + this.scrollY) * 0.012) * 35;
            if (y === -60) ctx.moveTo(rx, y);
            else ctx.lineTo(rx, y);
        }
        ctx.stroke();

        // 5. Dynamic River Current Flow Ripple Lines (Water physically streams downstream!)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = 3;
        for (let stream = -1; stream <= 1; stream++) {
            ctx.beginPath();
            for (let y = -60; y <= h + 60; y += 35) {
                const rx = w * 0.5 + Math.sin((y + this.scrollY * 1.3) * 0.0055) * 140 + Math.cos((y + this.scrollY * 1.3) * 0.012) * 35 + stream * 18;
                if (y === -60) ctx.moveTo(rx, y);
                else ctx.lineTo(rx, y);
            }
            ctx.stroke();
        }

        // River Surface Specular Sun Glints
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        for (let i = 0; i < 18; i++) {
            const gy = ((this.scrollY * 1.5 + i * 65) % (h + 80)) - 40;
            const gx = w * 0.5 + Math.sin((gy + this.scrollY) * 0.0055) * 140 + (Math.sin(i * 3 + this.animTimer * 4) * 22);
            ctx.beginPath();
            ctx.arc(gx, gy, 2.5, 0, Math.PI * 2);
            ctx.fill();
        }

        // 6. Lush Overhanging Rainforest Canopy & Directional Canopy Shadows
        for (let i = -1; i < 4; i++) {
            const y = yOffset + i * 650;

            // Directional canopy shadow falling eastward into the water
            ctx.fillStyle = 'rgba(2, 44, 34, 0.55)';
            ctx.beginPath();
            ctx.arc(155, y + 120, 130, 0, Math.PI * 2);
            ctx.arc(w - 110, y + 380, 140, 0, Math.PI * 2);
            ctx.fill();

            // Base dense jungle canopy mass
            ctx.fillStyle = '#064e3b';
            ctx.beginPath();
            ctx.arc(140, y + 105, 125, 0, Math.PI * 2);
            ctx.arc(w - 125, y + 365, 135, 0, Math.PI * 2);
            ctx.fill();

            // Emergent tree crowns with sunlight
            ctx.fillStyle = '#047857';
            ctx.beginPath();
            ctx.arc(130, y + 95, 100, 0, Math.PI * 2);
            ctx.arc(w - 135, y + 355, 110, 0, Math.PI * 2);
            ctx.fill();

            // Top-level bright tropical sunlit foliage
            ctx.fillStyle = '#10b981';
            ctx.beginPath();
            ctx.arc(122, y + 85, 70, 0, Math.PI * 2);
            ctx.arc(w - 142, y + 345, 80, 0, Math.PI * 2);
            ctx.fill();

            // Specular canopy leaf crests
            ctx.fillStyle = '#34d399';
            ctx.beginPath();
            ctx.arc(116, y + 78, 40, 0, Math.PI * 2);
            ctx.arc(w - 148, y + 338, 48, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // 5. Realistic Industrial Complex: Slag Channels & Catwalks
    drawRealisticIndustrial(ctx, w, h, pal) {
        const yOffset = (this.scrollY * 0.65) % 360;

        // Heavy Steel Treadplate Grid
        ctx.strokeStyle = '#44403c';
        ctx.lineWidth = 12;
        for (let i = -1; i < 5; i++) {
            const y = yOffset + i * 360;
            ctx.strokeRect(50, y, w - 100, 220);
        }

        // Glowing Molten Slag Cascade
        const slagPulse = Math.sin(this.animTimer * 6) * 0.2 + 0.8;
        ctx.shadowColor = '#ea580c';
        ctx.shadowBlur = 25;
        ctx.fillStyle = `rgba(234, 88, 12, ${slagPulse})`;
        ctx.fillRect(w * 0.5 - 24, 0, 48, h);
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(w * 0.5 - 8, 0, 16, h);
        ctx.shadowBlur = 0;
    }

    // 6. Realistic Mountain Citadel: Alpine Granite Strata & Snowfields
    drawRealisticMountain(ctx, w, h, pal) {
        const yOffset = (this.scrollY * 0.55) % 550;

        for (let i = -1; i < 4; i++) {
            const y = yOffset + i * 550;

            // Left Granite Cliff Face with Stratification
            ctx.fillStyle = '#334155';
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(220, y + 160);
            ctx.lineTo(80, y + 310);
            ctx.lineTo(0, y + 440);
            ctx.closePath();
            ctx.fill();

            // Left Permanent Snow Cornice with Shadow Falloff
            ctx.fillStyle = '#f8fafc';
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(220, y + 160);
            ctx.lineTo(160, y + 180);
            ctx.lineTo(0, y + 60);
            ctx.closePath();
            ctx.fill();

            // Right Peak
            ctx.fillStyle = '#334155';
            ctx.beginPath();
            ctx.moveTo(w, y + 110);
            ctx.lineTo(w - 240, y + 280);
            ctx.lineTo(w - 60, y + 470);
            ctx.lineTo(w, y + 540);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = '#f8fafc';
            ctx.beginPath();
            ctx.moveTo(w, y + 110);
            ctx.lineTo(w - 240, y + 280);
            ctx.lineTo(w - 180, y + 310);
            ctx.lineTo(w, y + 180);
            ctx.closePath();
            ctx.fill();
        }
    }

    // 7. Realistic Orbital Platform: Photorealistic Blue Earth Curvature Below & Stars
    drawRealisticOrbitalEarth(ctx, w, h, pal) {
        // Deep Space Multi-Spectral Starfield
        this.stars.forEach(s => {
            const alpha = 0.4 + Math.sin(s.twinkle) * 0.6;
            ctx.globalAlpha = alpha;
            ctx.fillStyle = s.color;
            ctx.fillRect(s.x, s.y, s.size, s.size);
        });
        ctx.globalAlpha = 1.0;

        // Earth Curvature with Blue Atmospheric Rayleigh Scattering Halo
        const earthCenterY = h + 500;
        const earthRadius = 650;

        // Outer Atmospheric Halo
        const atmosphereGrad = ctx.createRadialGradient(w * 0.5, earthCenterY, earthRadius - 40, w * 0.5, earthCenterY, earthRadius + 60);
        atmosphereGrad.addColorStop(0, 'rgba(56, 189, 248, 0.85)');
        atmosphereGrad.addColorStop(0.5, 'rgba(3, 105, 161, 0.4)');
        atmosphereGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = atmosphereGrad;
        ctx.beginPath();
        ctx.arc(w * 0.5, earthCenterY, earthRadius + 60, 0, Math.PI * 2);
        ctx.fill();

        // Earth Ocean Surface
        const oceanGrad = ctx.createRadialGradient(w * 0.5, earthCenterY, 200, w * 0.5, earthCenterY, earthRadius);
        oceanGrad.addColorStop(0, '#0284c7');
        oceanGrad.addColorStop(0.8, '#0369a1');
        oceanGrad.addColorStop(1, '#075985');
        ctx.fillStyle = oceanGrad;
        ctx.beginPath();
        ctx.arc(w * 0.5, earthCenterY, earthRadius, 0, Math.PI * 2);
        ctx.fill();

        // Swirling Weather Cyclone Clouds over Earth
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        for (let a = 0; a < 5; a++) {
            const cx = w * 0.3 + a * 85;
            const cy = h - 60 + Math.sin(a * 2 + this.animTimer * 0.3) * 35;
            ctx.beginPath();
            ctx.ellipse(cx, cy, 75, 28, 0.3, 0, Math.PI * 2);
            ctx.fill();
        }

        // Modular Orbital Space Station Trusses
        const yOffset = (this.scrollY * 0.35) % 650;
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 4;
        for (let i = -1; i < 3; i++) {
            const y = yOffset + i * 650;
            ctx.strokeRect(70, y, 120, 120);
            ctx.strokeRect(w - 190, y + 300, 120, 120);
        }
    }

    // 8. Realistic Command Center: Fortified Subterranean Military Bunker
    drawRealisticCommandCenter(ctx, w, h, pal) {
        const yOffset = (this.scrollY * 0.7) % 300;

        // High-Tech Red Alert Bunker Floor Grids
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.35)';
        ctx.lineWidth = 2.5;
        for (let x = 50; x < w; x += 100) {
            ctx.beginPath();
            ctx.moveTo(x, 0); ctx.lineTo(x, h);
            ctx.stroke();
        }
        for (let y = yOffset - 300; y < h + 300; y += 100) {
            ctx.beginPath();
            ctx.moveTo(0, y); ctx.lineTo(w, y);
            ctx.stroke();
        }

        // Heavy Reinforced Bulkhead Armor Walls
        ctx.fillStyle = '#450a0a';
        ctx.fillRect(0, 0, 42, h);
        ctx.fillRect(w - 42, 0, 42, h);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(40, 0, 4, h);
        ctx.fillRect(w - 44, 0, 4, h);
    }
}

window.STAGES = STAGES;
window.BackgroundRenderer = BackgroundRenderer;

