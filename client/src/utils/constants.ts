import type { CharacterPreset, Skill, CharacterType } from '../types';

export type GameMap = {
  name: string;
  description: string;
  spawnPoint: { x: number; y: number; z: number };
  size: { width: number; height: number };
  groundColor: number;
  skyColor: number;
  fogColor: number;
  ambientLight: number;
  directionalLight: number;
  objects: MapObject[];
};

export interface MapObject {
  id: string;
  name: string;
  type: string;
  position: { x: number; y: number; z: number };
  rotation?: { x: number; y: number; z: number };
  scale?: { x: number; y: number; z: number };
  size?: { width: number; height: number; depth: number };
  color?: number;
  roofColor?: number;
  emissive?: number;
  emissiveIntensity?: number;
}

export const DEFAULT_CHARACTER: CharacterType = 'rudeus';

export const ANIME_COLORS = {
  rudeusBlue: 0x4a90d9,
  warriorBlack: 0x222233,
  mageBlue: 0x0066ff,
  rogueGreen: 0x003322,
  archerGold: 0xdaa520,
  healerCyan: 0x00ffff,
  skin: 0xffccaa,
  accent: 0x00aaff,
  abieBrown: 0x8B4513,
  abieLeather: 0xA0522D,
};

// ============================================
// 🎭 CHARACTER PRESETS (Honkai Sci-Fi Style)
// ============================================
export const CHARACTER_PRESETS: Record<string, CharacterPreset> = {
  rudeus: {
    type: 'rudeus',
    name: 'Rudeus Greyrat',
    baseHealth: 100,
    baseMana: 150,
    baseAttack: 25,
    baseDefense: 15,
    baseSpeed: 10,
    skills: ['fireball', 'ice-shield', 'heal', 'teleport'],
    model: 'rudeus',
    color: 0x4a90d9,
    description: 'The reincarnated prodigy mage with vast magical knowledge',
    outfit: 'blue_robe',
    hairColor: 0x4a90d9,
    hairStyle: 'medium',
    age: 'teen',
  },
  warrior: {
    type: 'warrior',
    name: 'Cyber Knight',
    baseHealth: 120,
    baseMana: 60,
    baseAttack: 25,
    baseDefense: 25,
    baseSpeed: 8,
    skills: ['plasma-slash', 'energy-shield', 'ion-cannon', 'overcharge'],
    model: 'warrior',
    color: 0x222233,
    description: 'A cybernetically enhanced warrior with energy weapons',
    outfit: 'cyber_armor',
    hairColor: 0x444455,
    hairStyle: 'short',
    age: 'adult',
  },
  mage: {
    type: 'mage',
    name: 'Quantum Mage',
    baseHealth: 80,
    baseMana: 150,
    baseAttack: 30,
    baseDefense: 10,
    baseSpeed: 7,
    skills: ['quantum-blast', 'void-shield', 'gravity-well', 'phase-shift'],
    model: 'mage',
    color: 0x0066ff,
    description: 'A master of quantum energies and spatial manipulation',
    outfit: 'quantum_robe',
    hairColor: 0xffffff,
    hairStyle: 'long',
    age: 'adult',
  },
  rogue: {
    type: 'rogue',
    name: 'Phantom Agent',
    baseHealth: 90,
    baseMana: 80,
    baseAttack: 25,
    baseDefense: 15,
    baseSpeed: 14,
    skills: ['hologram-cloak', 'neural-disruptor', 'phase-dagger', 'quantum-blink'],
    model: 'rogue',
    color: 0x003322,
    description: 'A stealth operative with quantum cloaking technology',
    outfit: 'stealth_suit',
    hairColor: 0x228b22,
    hairStyle: 'short',
    age: 'adult',
  },
  archer: {
    type: 'archer',
    name: 'Stellar Sniper',
    baseHealth: 95,
    baseMana: 70,
    baseAttack: 25,
    baseDefense: 10,
    baseSpeed: 10,
    skills: ['photon-arrow', 'black-hole-trap', 'precision-strike', 'orbital-barrage'],
    model: 'archer',
    color: 0x330066,
    description: 'A long-range specialist with energy-based weaponry',
    outfit: 'tactical_gear',
    hairColor: 0xdaa520,
    hairStyle: 'ponytail',
    age: 'adult',
  },
  healer: {
    type: 'healer',
    name: 'Bio-Synth',
    baseHealth: 100,
    baseMana: 180,
    baseAttack: 10,
    baseDefense: 12,
    baseSpeed: 9,
    skills: ['nano-regeneration', 'stasis-field', 'neural-boost', 'bio-purge'],
    model: 'healer',
    color: 0x00ffff,
    description: 'A bio-engineered support specialist with healing nanites',
    outfit: 'medical_armor',
    hairColor: 0xffd700,
    hairStyle: 'long',
    age: 'adult',
  },
  abie: {
    type: 'abie',
    name: 'Draco Abielle',
    baseHealth: 95,
    baseMana: 140,
    baseAttack: 30,
    baseDefense: 12,
    baseSpeed: 15,
    skills: [
      'gale-arrow',
      'thunder-fang',
      'sky-piercer',
      'tempest-volley',
      'cyclone-shot',
      'storm-rain',
      'falcon-dive',
      'gale-dance',
      'lightning-cross',
      'phantom-step',
      'aqua-shot',
      'hydro-blast',
      'wind-rush',
      'storm-barrage'
    ],
    model: 'abie',
    color: 0x8B4513,
    description: 'High-mobility marksman with Wind, Lightning, and Water mana affinities. Twin sister of Draco Noir. Wields Stormcaller bow and Zephyr & Tempest dual blades.',
    outfit: 'leather_corset_marksman',
    hairColor: 0x8B4513,
    hairStyle: 'short',
    age: 'adult',
    class: 'Marksman',
    manaAffinity: { wind: 5, lightning: 5, water: 4 },
    equipment: {
      primary: 'Stormcaller Bow',
      secondary: 'Zephyr & Tempest Dual Blades',
      armor: 'Leather Corset Outfit'
    },
  },
};

// ============================================
// ⚔️ SKILLS DATABASE (Honkai Sci-Fi Style)
// ============================================
export const SKILLS: Record<string, Skill> = {
  // Rudeus Skills
  'fireball': { id: 'fireball', name: 'Plasma Fireball', description: 'Launches a ball of ionized plasma', type: 'attack', damage: 45, manaCost: 25, cooldown: 3000, range: 18 },
  'ice-shield': { id: 'ice-shield', name: 'Cryo Barrier', description: 'Creates a protective cryogenic shield', type: 'defense', manaCost: 20, cooldown: 8000, range: 1 },
  'heal': { id: 'heal', name: 'Nano Heal', description: 'Deploys healing nanobots to a target', type: 'heal', healAmount: 45, manaCost: 25, cooldown: 3000, range: 12 },
  'teleport': { id: 'teleport', name: 'Quantum Shift', description: 'Instantly teleport to a nearby location', type: 'utility', manaCost: 30, cooldown: 15000, range: 25 },
  
  // Warrior Skills
  'plasma-slash': { id: 'plasma-slash', name: 'Plasma Slash', description: 'A powerful energy-infused melee strike', type: 'attack', damage: 30, manaCost: 15, cooldown: 2000, range: 2.5 },
  'energy-shield': { id: 'energy-shield', name: 'Energy Shield', description: 'Creates a protective energy barrier', type: 'defense', manaCost: 20, cooldown: 6000, range: 1 },
  'ion-cannon': { id: 'ion-cannon', name: 'Ion Cannon', description: 'Fires a devastating ion beam', type: 'attack', damage: 50, manaCost: 35, cooldown: 8000, range: 20 },
  'overcharge': { id: 'overcharge', name: 'Overcharge', description: 'Boosts attack power temporarily', type: 'utility', manaCost: 25, cooldown: 12000, range: 1 },
  
  // Mage Skills
  'quantum-blast': { id: 'quantum-blast', name: 'Quantum Blast', description: 'Releases unstable quantum energy', type: 'attack', damage: 55, manaCost: 30, cooldown: 4000, range: 22 },
  'void-shield': { id: 'void-shield', name: 'Void Shield', description: 'Creates a shield that absorbs energy attacks', type: 'defense', manaCost: 25, cooldown: 7000, range: 1 },
  'gravity-well': { id: 'gravity-well', name: 'Gravity Well', description: 'Creates a gravity field that pulls enemies in', type: 'utility', manaCost: 40, cooldown: 10000, range: 15 },
  'phase-shift': { id: 'phase-shift', name: 'Phase Shift', description: 'Become intangible for a short period', type: 'utility', manaCost: 35, cooldown: 18000, range: 1 },
  
  // Rogue Skills
  'hologram-cloak': { id: 'hologram-cloak', name: 'Hologram Cloak', description: 'Creates a holographic decoy', type: 'utility', manaCost: 20, cooldown: 10000, range: 1 },
  'neural-disruptor': { id: 'neural-disruptor', name: 'Neural Disruptor', description: 'Disables enemy targeting systems', type: 'attack', damage: 25, manaCost: 20, cooldown: 6000, range: 10 },
  'phase-dagger': { id: 'phase-dagger', name: 'Phase Dagger', description: 'A dagger that phases through defenses', type: 'attack', damage: 40, manaCost: 15, cooldown: 3000, range: 2 },
  'quantum-blink': { id: 'quantum-blink', name: 'Quantum Blink', description: 'Short-range teleportation', type: 'utility', manaCost: 25, cooldown: 8000, range: 10 },
  
  // Archer Skills
  'photon-arrow': { id: 'photon-arrow', name: 'Photon Arrow', description: 'Fires a high-energy photon arrow', type: 'attack', damage: 35, manaCost: 20, cooldown: 2500, range: 30 },
  'black-hole-trap': { id: 'black-hole-trap', name: 'Black Hole Trap', description: 'Creates a gravity trap', type: 'utility', manaCost: 30, cooldown: 12000, range: 8 },
  'precision-strike': { id: 'precision-strike', name: 'Precision Strike', description: 'A perfectly aimed critical shot', type: 'attack', damage: 70, manaCost: 40, cooldown: 10000, range: 35 },
  'orbital-barrage': { id: 'orbital-barrage', name: 'Orbital Barrage', description: 'Calls down an orbital strike', type: 'attack', damage: 45, manaCost: 35, cooldown: 15000, range: 25 },
  
  // Healer Skills
  'nano-regeneration': { id: 'nano-regeneration', name: 'Nano Regeneration', description: 'Heals over time with nanobots', type: 'heal', healAmount: 60, manaCost: 30, cooldown: 5000, range: 15 },
  'stasis-field': { id: 'stasis-field', name: 'Stasis Field', description: 'Puts allies in protective stasis', type: 'defense', manaCost: 35, cooldown: 15000, range: 12 },
  'neural-boost': { id: 'neural-boost', name: 'Neural Boost', description: 'Enhances ally reflexes and speed', type: 'utility', manaCost: 25, cooldown: 10000, range: 15 },
  'bio-purge': { id: 'bio-purge', name: 'Bio Purge', description: 'Removes toxins and debuffs', type: 'utility', manaCost: 20, cooldown: 8000, range: 12 },
  
  // Draco Abielle Skills
  'gale-arrow': { id: 'gale-arrow', name: 'Gale Arrow', description: 'Wind compresses around an arrow, tripling speed and armor penetration', type: 'attack', damage: 45, manaCost: 20, cooldown: 3000, range: 35 },
  'thunder-fang': { id: 'thunder-fang', name: 'Thunder Fang', description: 'Lightning envelops an arrow before release, exploding on impact', type: 'attack', damage: 50, manaCost: 25, cooldown: 4000, range: 30 },
  'sky-piercer': { id: 'sky-piercer', name: 'Sky Piercer', description: 'An arrow accelerated beyond the speed of sound, producing a sonic shockwave', type: 'attack', damage: 65, manaCost: 35, cooldown: 8000, range: 40 },
  'tempest-volley': { id: 'tempest-volley', name: 'Tempest Volley', description: 'Hundreds of mana arrows rain across the battlefield', type: 'attack', damage: 35, manaCost: 40, cooldown: 12000, range: 30 },
  'cyclone-shot': { id: 'cyclone-shot', name: 'Cyclone Shot', description: 'Creates a miniature tornado on impact', type: 'attack', damage: 40, manaCost: 30, cooldown: 6000, range: 25 },
  'storm-rain': { id: 'storm-rain', name: 'Storm Rain', description: 'Fires dozens of arrows into the sky, redirected onto targets from impossible angles', type: 'attack', damage: 55, manaCost: 45, cooldown: 15000, range: 40 },
  'falcon-dive': { id: 'falcon-dive', name: 'Falcon Dive', description: 'Launches herself with Wind magic while firing continuously', type: 'utility', manaCost: 30, cooldown: 10000, range: 20 },
  'gale-dance': { id: 'gale-dance', name: 'Gale Dance', description: 'Extremely rapid slashes enhanced by Wind', type: 'attack', damage: 25, manaCost: 15, cooldown: 2000, range: 2 },
  'lightning-cross': { id: 'lightning-cross', name: 'Lightning Cross', description: 'Two crossing strikes infused with lightning', type: 'attack', damage: 35, manaCost: 20, cooldown: 4000, range: 2 },
  'phantom-step': { id: 'phantom-step', name: 'Phantom Step', description: 'Uses compressed wind for instantaneous repositioning', type: 'utility', manaCost: 20, cooldown: 5000, range: 10 },
  'aqua-shot': { id: 'aqua-shot', name: 'Aqua Shot', description: 'Water-infused arrow that creates splashing waves on impact', type: 'attack', damage: 38, manaCost: 22, cooldown: 3500, range: 30 },
  'hydro-blast': { id: 'hydro-blast', name: 'Hydro Blast', description: 'Creates a powerful water jet that pushes enemies back', type: 'attack', damage: 42, manaCost: 28, cooldown: 5000, range: 20 },
  'wind-rush': { id: 'wind-rush', name: 'Wind Rush', description: 'Dash forward with wind propulsion, damaging enemies in path', type: 'attack', damage: 30, manaCost: 18, cooldown: 4000, range: 15 },
  'storm-barrage': { id: 'storm-barrage', name: 'Storm Barrage', description: 'Unleashes a barrage of wind, lightning, and water arrows simultaneously', type: 'attack', damage: 50, manaCost: 40, cooldown: 12000, range: 35 },
};

// ============================================
// 🗺️ WORLD CONSTANTS
// ============================================
export const GAME_CONSTANTS = {
  WORLD_SIZE: 1000,
  GRAVITY: -9.8,
  PLAYER_SPEED: 0.25,
  PLAYER_HEIGHT: 1.8,
  PLAYER_RADIUS: 0.5,
  CAMERA_OFFSET: { x: 0, y: 2.5, z: -5 },
  MAX_PLAYERS: 50,
  TICK_RATE: 30,
  DEFAULT_HEALTH: 100,
  DEFAULT_MANA: 100,
};

// ============================================
// 🎨 WORLD SETTINGS (Honkai Sci-Fi Style)
// ============================================
export const WORLD_SETTINGS = {
  groundColor: 0x0a0a1a,
  skyColor: 0x000033,
  fogColor: 0x000022,
  fogDensity: 0.001,
  ambientLight: 0x1a1a33,
  directionalLight: 0x404066,
  animeShading: false,
  toonShading: true,
  bloomIntensity: 1.5,
  bloomThreshold: 0,
  bloomRadius: 0.4,
  toneMappingExposure: 1.2,
};

// Toon shading gradient texture for cel-shading
export const TOON_GRADIENT = {
  stops: [
    { position: 0.0, color: 0x000000 },
    { position: 0.25, color: 0x222244 },
    { position: 0.45, color: 0x444488 },
    { position: 0.65, color: 0x8888cc },
    { position: 0.85, color: 0xccccff },
    { position: 1.0, color: 0xffffff },
  ],
};

// ============================================
// 🏡 BUENA VILLAGE MAP DATA (Sci-Fi Retrofit)
// ============================================
export const BUENA_VILLAGE = {
  name: 'Buena Village',
  description: 'A peaceful village retrofitted with advanced technology',
  spawnPoint: { x: 0, y: 0, z: 0 },
  size: { width: 80, height: 80 },
  groundColor: 0x0d1f2d,
  skyColor: 0x07121f,
  fogColor: 0x0b1324,
  ambientLight: 0x2b2b4a,
  directionalLight: 0x6d7bff,
  objects: [],
  buildings: [
    {
      id: 'rudeus-house',
      name: "Rudeus's Residence",
      type: 'house',
      position: { x: 10, y: 0, z: -5 },
      size: { width: 8, depth: 6, height: 4 },
      color: 0x333344,
      roofColor: 0x222233,
      emissive: 0x004488,
      emissiveIntensity: 0.1,
    },
    {
      id: 'paul-house',
      name: "Paul's Home",
      type: 'house',
      position: { x: -10, y: 0, z: -5 },
      size: { width: 8, depth: 6, height: 4 },
      color: 0x333344,
      roofColor: 0x222233,
      emissive: 0x004488,
      emissiveIntensity: 0.1,
    },
    {
      id: 'zenith-house',
      name: "Zenith's Clinic",
      type: 'house',
      position: { x: 0, y: 0, z: -15 },
      size: { width: 6, depth: 5, height: 3.5 },
      color: 0x444455,
      roofColor: 0x333344,
      emissive: 0x0088ff,
      emissiveIntensity: 0.15,
    },
    {
      id: 'village-center',
      name: 'Central Plaza',
      type: 'square',
      position: { x: 0, y: 0, z: 10 },
      size: { width: 20, depth: 20, height: 0.5 },
      color: 0x222233,
      emissive: 0x0066aa,
      emissiveIntensity: 0.2,
    },
    {
      id: 'well',
      name: 'Energy Well',
      type: 'well',
      position: { x: 0, y: 0, z: 10 },
      size: { width: 3, depth: 3, height: 2 },
      color: 0x333344,
      roofColor: 0x222233,
      emissive: 0x00ffff,
      emissiveIntensity: 0.3,
    },
  ],
  trees: [
    { position: { x: 15, y: 0, z: 0 }, type: 'cyber-tree', height: 6, radius: 1, color: 0x004422, emissive: 0x008844 },
    { position: { x: -15, y: 0, z: 0 }, type: 'cyber-tree', height: 6, radius: 1, color: 0x004422, emissive: 0x008844 },
    { position: { x: 0, y: 0, z: 20 }, type: 'cyber-tree', height: 6, radius: 1, color: 0x004422, emissive: 0x008844 },
    { position: { x: 20, y: 0, z: 15 }, type: 'crystal-tree', height: 8, radius: 1.2, color: 0x442266, emissive: 0x8844cc },
    { position: { x: -20, y: 0, z: 15 }, type: 'crystal-tree', height: 8, radius: 1.2, color: 0x442266, emissive: 0x8844cc },
    { position: { x: 18, y: 0, z: -10 }, type: 'cyber-tree', height: 6, radius: 1, color: 0x004422, emissive: 0x008844 },
    { position: { x: -18, y: 0, z: -10 }, type: 'cyber-tree', height: 6, radius: 1, color: 0x004422, emissive: 0x008844 },
  ],
  paths: [
    { start: { x: 0, z: 0 }, end: { x: 10, z: -5 }, width: 2, color: 0x1a1a2e, emissive: 0x004466, emissiveIntensity: 0.1 },
    { start: { x: 0, z: 0 }, end: { x: -10, z: -5 }, width: 2, color: 0x1a1a2e, emissive: 0x004466, emissiveIntensity: 0.1 },
    { start: { x: 0, z: 0 }, end: { x: 0, z: -15 }, width: 2, color: 0x1a1a2e, emissive: 0x004466, emissiveIntensity: 0.1 },
    { start: { x: 10, z: -5 }, end: { x: 0, z: 10 }, width: 2, color: 0x1a1a2e, emissive: 0x004466, emissiveIntensity: 0.1 },
    { start: { x: -10, z: -5 }, end: { x: 0, z: 10 }, width: 2, color: 0x1a1a2e, emissive: 0x004466, emissiveIntensity: 0.1 },
  ],
  fences: [
    { start: { x: 25, z: 25 }, end: { x: -25, z: 25 }, height: 1.5, color: 0x333344, emissive: 0x0066aa, emissiveIntensity: 0.1 },
    { start: { x: -25, z: 25 }, end: { x: -25, z: -25 }, height: 1.5, color: 0x333344, emissive: 0x0066aa, emissiveIntensity: 0.1 },
    { start: { x: -25, z: -25 }, end: { x: 25, z: -25 }, height: 1.5, color: 0x333344, emissive: 0x0066aa, emissiveIntensity: 0.1 },
    { start: { x: 25, z: -25 }, end: { x: 25, z: 25 }, height: 1.5, color: 0x333344, emissive: 0x0066aa, emissiveIntensity: 0.1 },
  ],
  gates: [
    { position: { x: 0, z: 25 }, width: 4, height: 3, color: 0x444455, emissive: 0x00aaff, emissiveIntensity: 0.2 },
    { position: { x: 25, z: 0 }, width: 4, height: 3, color: 0x444455, emissive: 0x00aaff, emissiveIntensity: 0.2 },
  ],
  sciFiDecorations: [
    { type: 'hologram', position: { x: 0, y: 5, z: 0 }, color: 0x00ffff, size: 2, text: 'BUENA VILLAGE', area: 'buena-village' },
    { type: 'energy-crystal', position: { x: 5, y: 1, z: 5 }, color: 0x00aaff, size: 1.5, glow: true, area: 'buena-village' },
    { type: 'energy-crystal', position: { x: -5, y: 1, z: 5 }, color: 0xff00aa, size: 1.5, glow: true, area: 'buena-village' },
    { type: 'neon-tube', start: { x: 10, y: 3, z: 0 }, end: { x: 10, y: 3, z: 10 }, color: 0x00ffff, width: 0.15, area: 'buena-village' },
    { type: 'neon-tube', start: { x: -10, y: 3, z: 0 }, end: { x: -10, y: 3, z: 10 }, color: 0x00ffff, width: 0.15, area: 'buena-village' },
    { type: 'floating-platform', position: { x: 8, y: 0.5, z: -8 }, size: { width: 4, depth: 4, height: 0.3 }, color: 0x222233, emissive: 0x0066aa, area: 'buena-village' },
    { type: 'floating-platform', position: { x: -8, y: 0.5, z: -8 }, size: { width: 4, depth: 4, height: 0.3 }, color: 0x222233, emissive: 0x0066aa, area: 'buena-village' },
  ],
};

export const BUena_VILLAGE = BUENA_VILLAGE;

// ============================================
// 🏰 ASURA KINGDOM MAP DATA (Sci-Fi)
// ============================================
export const ASURA_KINGDOM = {
  name: 'Asura Kingdom',
  description: 'A high-tech kingdom with towering spires and energy shields',
  spawnPoint: { x: 0, y: 0, z: 0 },
  buildings: [
    {
      id: 'asura-castle',
      name: 'Quantum Citadel',
      type: 'castle',
      position: { x: 0, y: 0, z: 0 },
      size: { width: 50, depth: 40, height: 30 },
      color: 0x1a1a2e,
      roofColor: 0x004488,
      emissive: 0x00aaff,
      emissiveIntensity: 0.2,
    },
    {
      id: 'noble-mansion-1',
      name: 'Noble Estate',
      type: 'mansion',
      position: { x: 30, y: 0, z: 20 },
      size: { width: 15, depth: 12, height: 8 },
      color: 0x222233,
      roofColor: 0x0066aa,
      emissive: 0x4488cc,
      emissiveIntensity: 0.15,
    },
    {
      id: 'noble-mansion-2',
      name: 'Noble Estate',
      type: 'mansion',
      position: { x: -30, y: 0, z: 20 },
      size: { width: 15, depth: 12, height: 8 },
      color: 0x222233,
      roofColor: 0x0066aa,
      emissive: 0x4488cc,
      emissiveIntensity: 0.15,
    },
    {
      id: 'training-grounds',
      name: 'Combat Simulator',
      type: 'arena',
      position: { x: 0, y: 0, z: -40 },
      size: { width: 60, depth: 60, height: 1 },
      color: 0x333344,
      emissive: 0x004488,
      emissiveIntensity: 0.1,
    },
    {
      id: 'temple',
      name: 'Data Temple',
      type: 'temple',
      position: { x: 0, y: 0, z: 40 },
      size: { width: 25, depth: 25, height: 15 },
      color: 0x222244,
      roofColor: 0xff4400,
      emissive: 0xff6600,
      emissiveIntensity: 0.2,
    },
  ],
  trees: [
    { position: { x: 40, y: 0, z: 0 }, type: 'crystal-tree', height: 10, radius: 1.5, color: 0x442266, emissive: 0x8844cc },
    { position: { x: -40, y: 0, z: 0 }, type: 'crystal-tree', height: 10, radius: 1.5, color: 0x442266, emissive: 0x8844cc },
    { position: { x: 0, y: 0, z: 50 }, type: 'crystal-tree', height: 10, radius: 1.5, color: 0x442266, emissive: 0x8844cc },
    { position: { x: 50, y: 0, z: 30 }, type: 'energy-spire', height: 12, radius: 0.8, color: 0x00aaff, emissive: 0x44ccff },
    { position: { x: -50, y: 0, z: 30 }, type: 'energy-spire', height: 12, radius: 0.8, color: 0x00aaff, emissive: 0x44ccff },
    { position: { x: 30, y: 0, z: -30 }, type: 'crystal-tree', height: 10, radius: 1.5, color: 0x442266, emissive: 0x8844cc },
    { position: { x: -30, y: 0, z: -30 }, type: 'crystal-tree', height: 10, radius: 1.5, color: 0x442266, emissive: 0x8844cc },
  ],
  paths: [
    { start: { x: 0, z: 0 }, end: { x: 30, z: 20 }, width: 3, color: 0x111122, emissive: 0x0066aa, emissiveIntensity: 0.15 },
    { start: { x: 0, z: 0 }, end: { x: -30, z: 20 }, width: 3, color: 0x111122, emissive: 0x0066aa, emissiveIntensity: 0.15 },
    { start: { x: 0, z: 0 }, end: { x: 0, z: 40 }, width: 3, color: 0x111122, emissive: 0x0066aa, emissiveIntensity: 0.15 },
    { start: { x: 0, z: 0 }, end: { x: 0, z: -40 }, width: 3, color: 0x111122, emissive: 0x0066aa, emissiveIntensity: 0.15 },
    { start: { x: 30, z: 20 }, end: { x: 50, z: 30 }, width: 2, color: 0x111122, emissive: 0x0066aa, emissiveIntensity: 0.1 },
    { start: { x: -30, z: 20 }, end: { x: -50, z: 30 }, width: 2, color: 0x111122, emissive: 0x0066aa, emissiveIntensity: 0.1 },
  ],
  fences: [],
  gates: [
    { position: { x: 0, z: 60 }, width: 5, height: 4, color: 0x333355, emissive: 0x00aaff, emissiveIntensity: 0.25 },
    { position: { x: 60, z: 0 }, width: 5, height: 4, color: 0x333355, emissive: 0x00aaff, emissiveIntensity: 0.25 },
  ],
  sciFiDecorations: [
    { type: 'hologram', position: { x: 0, y: 10, z: 0 }, color: 0xff00aa, size: 3, text: 'ASURA KINGDOM', area: 'asura-kingdom' },
    { type: 'energy-shield', position: { x: 0, y: 0, z: 0 }, radius: 60, height: 30, color: 0x00aaff, area: 'asura-kingdom' },
    { type: 'floating-platform', position: { x: 20, y: 2, z: 15 }, size: { width: 10, depth: 10, height: 0.5 }, color: 0x222233, emissive: 0x0088ff, area: 'asura-kingdom' },
    { type: 'energy-crystal', position: { x: 15, y: 1, z: -20 }, color: 0x00ffff, size: 2, glow: true, area: 'asura-kingdom' },
    { type: 'neon-tube', start: { x: -40, y: 5, z: 0 }, end: { x: 40, y: 5, z: 0 }, color: 0xff00aa, width: 0.2, area: 'asura-kingdom' },
  ],
};

// ============================================
// 🏙️ MAGIC CITY SHARIA MAP DATA (Sci-Fi)
// ============================================
export const MAGIC_CITY_SHARIA = {
  name: 'Magic City Sharia',
  description: 'A futuristic city of advanced magic and technology',
  spawnPoint: { x: 0, y: 0, z: 0 },
  buildings: [
    {
      id: 'magic-academy',
      name: 'Quantum Academy',
      type: 'academy',
      position: { x: 0, y: 0, z: -30 },
      size: { width: 40, depth: 30, height: 20 },
      color: 0x004488,
      roofColor: 0x0066cc,
      emissive: 0x44aacc,
      emissiveIntensity: 0.25,
    },
    {
      id: 'magic-guild',
      name: 'Arcane Syndicate',
      type: 'guild',
      position: { x: 25, y: 0, z: 0 },
      size: { width: 20, depth: 15, height: 10 },
      color: 0x442266,
      roofColor: 0x663399,
      emissive: 0xaa44ff,
      emissiveIntensity: 0.2,
    },
    {
      id: 'library',
      name: 'Data Archive',
      type: 'library',
      position: { x: -25, y: 0, z: 0 },
      size: { width: 20, depth: 15, height: 12 },
      color: 0x333344,
      roofColor: 0x008844,
      emissive: 0x00cc66,
      emissiveIntensity: 0.15,
    },
    {
      id: 'market',
      name: 'Tech Bazaar',
      type: 'market',
      position: { x: 0, y: 0, z: 30 },
      size: { width: 30, depth: 20, height: 8 },
      color: 0x443322,
      roofColor: 0x8b4513,
      emissive: 0xffaa44,
      emissiveIntensity: 0.15,
    },
    {
      id: 'magic-tower',
      name: 'Singularity Tower',
      type: 'tower',
      position: { x: 0, y: 0, z: -60 },
      size: { width: 10, depth: 10, height: 40 },
      color: 0xffffff,
      roofColor: 0x000088,
      emissive: 0x4444ff,
      emissiveIntensity: 0.3,
    },
  ],
  trees: [
    { position: { x: 35, y: 0, z: -20 }, type: 'energy-spire', height: 12, radius: 0.8, color: 0x00aaff, emissive: 0x44ccff },
    { position: { x: -35, y: 0, z: -20 }, type: 'energy-spire', height: 12, radius: 0.8, color: 0x00aaff, emissive: 0x44ccff },
    { position: { x: 0, y: 0, z: 40 }, type: 'energy-spire', height: 12, radius: 0.8, color: 0xff00aa, emissive: 0xff44cc },
    { position: { x: 40, y: 0, z: 10 }, type: 'crystal-tree', height: 10, radius: 1.2, color: 0x662288, emissive: 0xcc44aa },
    { position: { x: -40, y: 0, z: 10 }, type: 'crystal-tree', height: 10, radius: 1.2, color: 0x662288, emissive: 0xcc44aa },
    { position: { x: 15, y: 0, z: -70 }, type: 'energy-spire', height: 12, radius: 0.8, color: 0x00ffff, emissive: 0x44ffff },
    { position: { x: -15, y: 0, z: -70 }, type: 'energy-spire', height: 12, radius: 0.8, color: 0x00ffff, emissive: 0x44ffff },
  ],
  paths: [
    { start: { x: 0, z: 0 }, end: { x: 25, z: 0 }, width: 3, color: 0x1a1a2e, emissive: 0x4466aa, emissiveIntensity: 0.2 },
    { start: { x: 0, z: 0 }, end: { x: -25, z: 0 }, width: 3, color: 0x1a1a2e, emissive: 0x4466aa, emissiveIntensity: 0.2 },
    { start: { x: 0, z: 0 }, end: { x: 0, z: 30 }, width: 3, color: 0x1a1a2e, emissive: 0x4466aa, emissiveIntensity: 0.2 },
    { start: { x: 0, z: 0 }, end: { x: 0, z: -30 }, width: 3, color: 0x1a1a2e, emissive: 0x4466aa, emissiveIntensity: 0.2 },
    { start: { x: 25, z: 0 }, end: { x: 0, z: -30 }, width: 2, color: 0x1a1a2e, emissive: 0x4466aa, emissiveIntensity: 0.15 },
    { start: { x: -25, z: 0 }, end: { x: 0, z: -30 }, width: 2, color: 0x1a1a2e, emissive: 0x4466aa, emissiveIntensity: 0.15 },
    { start: { x: 0, z: -30 }, end: { x: 0, z: -60 }, width: 2, color: 0x1a1a2e, emissive: 0x4466aa, emissiveIntensity: 0.15 },
  ],
  fences: [],
  gates: [
    { position: { x: 0, z: 70 }, width: 5, height: 4, color: 0x444466, emissive: 0x8888ff, emissiveIntensity: 0.25 },
    { position: { x: 70, z: 0 }, width: 5, height: 4, color: 0x444466, emissive: 0x8888ff, emissiveIntensity: 0.25 },
  ],
  sciFiDecorations: [
    { type: 'hologram', position: { x: 0, y: 10, z: 0 }, color: 0x00ffff, size: 3, text: 'MAGIC CITY', area: 'magic-city-sharia' },
    { type: 'floating-platform', position: { x: 20, y: 3, z: -15 }, size: { width: 8, depth: 8, height: 0.3 }, color: 0x222244, emissive: 0x4466cc, area: 'magic-city-sharia' },
    { type: 'energy-crystal', position: { x: 0, y: 2, z: -50 }, color: 0xff00ff, size: 3, glow: true, area: 'magic-city-sharia' },
    { type: 'neon-tube', start: { x: -30, y: 4, z: 0 }, end: { x: 30, y: 4, z: 0 }, color: 0xff00ff, width: 0.2, area: 'magic-city-sharia' },
    { type: 'energy-shield', position: { x: 0, y: 0, z: -60 }, radius: 15, height: 45, color: 0x4400aa, area: 'magic-city-sharia' },
  ],
};

// ============================================
// 👥 NPCS (Sci-Fi Style)
// ============================================
export const NPCS = [
  // Buena Village NPCs
  {
    id: 'zenith',
    name: 'Zenith Greyrat',
    characterType: 'healer',
    position: { x: 0, y: 0, z: -12 },
    area: 'buena-village',
    dialogue: ["Welcome to Buena Village, traveler!", 'Our village has embraced the new technologies.'],
    type: 'villager',
  },
  {
    id: 'paul',
    name: 'Paul Greyrat',
    characterType: 'warrior',
    position: { x: -8, y: 0, z: -3 },
    area: 'buena-village',
    dialogue: ["The world has changed since the old days.", 'Technology and magic now walk hand in hand.'],
    type: 'villager',
  },
  {
    id: 'lilia',
    name: 'Lilia',
    characterType: 'healer',
    position: { x: 12, y: 0, z: 8 },
    area: 'buena-village',
    dialogue: ["The energy well in the center powers our village.", "It's a gift from the Asura Kingdom."],
    type: 'villager',
  },
  {
    id: 'buena-tech',
    name: 'Tech Merchant',
    characterType: 'rogue',
    position: { x: -12, y: 0, z: 8 },
    area: 'buena-village',
    dialogue: ["Latest cybernetic enhancements!", 'Nano-tech, energy weapons, and more!'],
    type: 'shopkeeper',
  },
  // Asura Kingdom NPCs
  {
    id: 'asura-guard',
    name: 'Sentinel Droid',
    characterType: 'warrior',
    position: { x: 15, y: 0, z: 0 },
    area: 'asura-kingdom',
    dialogue: ["Access granted.", 'The Quantum Citadel is ahead.'],
    type: 'guard',
  },
  {
    id: 'asura-scientist',
    name: 'Dr. Asura',
    characterType: 'mage',
    position: { x: 0, y: 0, z: 10 },
    area: 'asura-kingdom',
    dialogue: ["Our energy shield protects the kingdom.", 'Quantum technology is the future.'],
    type: 'villager',
  },
  {
    id: 'training-droid',
    name: 'Combat Trainer',
    characterType: 'warrior',
    position: { x: 0, y: 0, z: -35 },
    area: 'asura-kingdom',
    dialogue: ["Test your skills in the Combat Simulator.", 'Only the strongest can join our ranks.'],
    type: 'villager',
  },
  // Magic City Sharia NPCs
  {
    id: 'magic-professor',
    name: 'Professor Sharia',
    characterType: 'mage',
    position: { x: 0, y: 0, z: -25 },
    area: 'magic-city-sharia',
    dialogue: ["The Quantum Academy teaches the latest in magic-tech fusion.", 'Knowledge is power in the new age.'],
    type: 'villager',
  },
  {
    id: 'guild-leader',
    name: 'Guild Master',
    characterType: 'warrior',
    position: { x: 25, y: 0, z: 5 },
    area: 'magic-city-sharia',
    dialogue: ["The Arcane Syndicate needs brave souls.", 'High-paying contracts available!'],
    type: 'quest-giver',
    quests: ['magic-city-quest-1'],
  },
  {
    id: 'archivist',
    name: 'Data Archivist',
    characterType: 'healer',
    position: { x: -22, y: 0, z: 5 },
    area: 'magic-city-sharia',
    dialogue: ["All knowledge is stored in the Data Archive.", 'From ancient spells to quantum algorithms.'],
    type: 'villager',
  },
  {
    id: 'merchant',
    name: 'Tech Trader',
    characterType: 'rogue',
    position: { x: 0, y: 0, z: 35 },
    area: 'magic-city-sharia',
    dialogue: ["Rare tech and magic artifacts!", 'Come see my wares from across the stars!'],
    type: 'shopkeeper',
  },
];

// ============================================
// 👹 MONSTERS (Sci-Fi Style)
// ============================================
export const MONSTERS = [
  // Buena Village area
  {
    id: 'drone-1',
    name: 'Rogue Drone',
    type: 'drone',
    position: { x: 25, y: 0, z: 25 },
    area: 'buena-village',
    color: 0x444466,
    health: 60,
    attack: 15,
    defense: 10,
    xpReward: 30,
    aggressive: true,
  },
  {
    id: 'cyber-wolf',
    name: 'Cyber Wolf',
    type: 'wolf',
    position: { x: 30, y: 0, z: -10 },
    area: 'buena-village',
    color: 0x333355,
    health: 80,
    attack: 20,
    defense: 12,
    xpReward: 40,
    aggressive: true,
  },
  {
    id: 'energy-slime',
    name: 'Energy Slime',
    type: 'slime',
    position: { x: -20, y: 0, z: 15 },
    area: 'buena-village',
    color: 0x00aaff,
    health: 40,
    attack: 10,
    defense: 5,
    xpReward: 20,
    aggressive: false,
  },
  // Asura Kingdom area
  {
    id: 'sentinel-drone',
    name: 'Sentinel Drone',
    type: 'drone',
    position: { x: 10, y: 0, z: 10 },
    area: 'asura-kingdom',
    color: 0x0066aa,
    health: 100,
    attack: 25,
    defense: 20,
    xpReward: 60,
    aggressive: true,
  },
  {
    id: 'quantum-beast',
    name: 'Quantum Beast',
    type: 'beast',
    position: { x: -25, y: 0, z: -15 },
    area: 'asura-kingdom',
    color: 0x4400aa,
    health: 120,
    attack: 30,
    defense: 18,
    xpReward: 80,
    aggressive: true,
  },
  // Magic City Sharia area
  {
    id: 'magic-golem',
    name: 'Magic Golem',
    type: 'golem',
    position: { x: 20, y: 0, z: -25 },
    area: 'magic-city-sharia',
    color: 0x664422,
    health: 150,
    attack: 35,
    defense: 25,
    xpReward: 100,
    aggressive: false,
  },
  {
    id: 'arcane-construct',
    name: 'Arcane Construct',
    type: 'construct',
    position: { x: -30, y: 0, z: 20 },
    area: 'magic-city-sharia',
    color: 0x4466aa,
    health: 90,
    attack: 20,
    defense: 15,
    xpReward: 50,
    aggressive: true,
  },
];