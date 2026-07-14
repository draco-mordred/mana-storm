import type { CharacterPreset, Skill } from '../types';

// ============================================
// 🎭 CHARACTER PRESETS (Anime-Style)
// ============================================
// Rudeus Greyrat - Main protagonist from Mushoku Tensei
// Visual: Blue hair, young mage appearance, robe outfit
export const CHARACTER_PRESETS: Record<string, CharacterPreset> = {
  // Default character - Rudeus Greyrat
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
    color: 0x4a90d9, // Blue color for Rudeus
    description: 'The reincarnated prodigy mage with vast magical knowledge',
    outfit: 'blue_robe',
    hairColor: 0x4a90d9,
    hairStyle: 'medium',
    age: 'teen',
  },
  
  // Warrior class
  warrior: {
    type: 'warrior',
    name: 'Warrior',
    baseHealth: 120,
    baseMana: 60,
    baseAttack: 18,
    baseDefense: 20,
    baseSpeed: 8,
    skills: ['sword-slash', 'shield-block', 'war-cry', 'ground-stomp'],
    model: 'warrior',
    color: 0xff3333,
    description: 'A powerful melee fighter with high defense',
    outfit: 'plate_armor',
    hairColor: 0x8b4513,
    hairStyle: 'short',
    age: 'adult',
  },
  
  // Mage class
  mage: {
    type: 'mage',
    name: 'Mage',
    baseHealth: 80,
    baseMana: 120,
    baseAttack: 25,
    baseDefense: 5,
    baseSpeed: 7,
    skills: ['fireball', 'ice-shield', 'lightning-bolt', 'teleport'],
    model: 'mage',
    color: 0x0066ff,
    description: 'A spellcaster with powerful magical abilities',
    outfit: 'robe',
    hairColor: 0xffffff,
    hairStyle: 'long',
    age: 'adult',
  },
  
  // Rogue class
  rogue: {
    type: 'rogue',
    name: 'Rogue',
    baseHealth: 90,
    baseMana: 80,
    baseAttack: 20,
    baseDefense: 10,
    baseSpeed: 12,
    skills: ['backstab', 'stealth', 'poison-dagger', 'smoke-bomb'],
    model: 'rogue',
    color: 0x00aa00,
    description: 'A stealthy attacker with high speed and critical hits',
    outfit: 'leather_armor',
    hairColor: 0x228b22,
    hairStyle: 'short',
    age: 'adult',
  },
  
  // Archer class
  archer: {
    type: 'archer',
    name: 'Archer',
    baseHealth: 95,
    baseMana: 70,
    baseAttack: 18,
    baseDefense: 8,
    baseSpeed: 10,
    skills: ['arrow-rain', 'snipe', 'trap', 'piercing-shot'],
    model: 'archer',
    color: 0xffaa00,
    description: 'A ranged attacker with precise long-distance shots',
    outfit: 'hunter_gear',
    hairColor: 0xdaa520,
    hairStyle: 'ponytail',
    age: 'adult',
  },
  
  // Healer class
  healer: {
    type: 'healer',
    name: 'Healer',
    baseHealth: 100,
    baseMana: 150,
    baseAttack: 5,
    baseDefense: 12,
    baseSpeed: 9,
    skills: ['heal', 'revive', 'bless', 'cleanse'],
    model: 'healer',
    color: 0xff69b4,
    description: 'A supportive class with healing and buff abilities',
    outfit: 'priest_robe',
    hairColor: 0xffd700,
    hairStyle: 'long',
    age: 'adult',
  },
};

// ============================================
// ⚔️ SKILLS DATABASE (Anime-Style)
// ============================================
export const SKILLS: Record<string, Skill> = {
  // Rudeus Skills
  'fireball': { id: 'fireball', name: 'Fireball', description: 'Launches a ball of fire at enemies', type: 'attack', damage: 40, manaCost: 25, cooldown: 3000, range: 15 },
  'ice-shield': { id: 'ice-shield', name: 'Ice Shield', description: 'Creates a protective ice barrier', type: 'defense', manaCost: 20, cooldown: 8000, range: 1 },
  'heal': { id: 'heal', name: 'Heal', description: 'Restores health to a target', type: 'heal', healAmount: 40, manaCost: 25, cooldown: 3000, range: 10 },
  'teleport': { id: 'teleport', name: 'Teleport', description: 'Instantly move to a nearby location', type: 'utility', manaCost: 30, cooldown: 15000, range: 20 },
  
  // Warrior Skills
  'sword-slash': { id: 'sword-slash', name: 'Sword Slash', description: 'A powerful melee attack', type: 'attack', damage: 25, manaCost: 10, cooldown: 2000, range: 2 },
  'shield-block': { id: 'shield-block', name: 'Shield Block', description: 'Reduces incoming damage', type: 'defense', manaCost: 15, cooldown: 5000, range: 1 },
  'war-cry': { id: 'war-cry', name: 'War Cry', description: 'Increases attack power temporarily', type: 'utility', manaCost: 20, cooldown: 10000, range: 10 },
  'ground-stomp': { id: 'ground-stomp', name: 'Ground Stomp', description: 'Stuns nearby enemies', type: 'utility', manaCost: 25, cooldown: 12000, range: 8 },
  
  // Mage Skills
  'lightning-bolt': { id: 'lightning-bolt', name: 'Lightning Bolt', description: 'Strikes enemies with lightning', type: 'attack', damage: 50, manaCost: 35, cooldown: 4000, range: 20 },
  
  // Rogue Skills
  'backstab': { id: 'backstab', name: 'Backstab', description: 'Deals massive damage from behind', type: 'attack', damage: 50, manaCost: 20, cooldown: 5000, range: 1 },
  'stealth': { id: 'stealth', name: 'Stealth', description: 'Become invisible for a short time', type: 'utility', manaCost: 15, cooldown: 12000, range: 1 },
  'poison-dagger': { id: 'poison-dagger', name: 'Poison Dagger', description: 'Applies damage over time', type: 'attack', damage: 15, manaCost: 10, cooldown: 2000, range: 10 },
  'smoke-bomb': { id: 'smoke-bomb', name: 'Smoke Bomb', description: 'Creates a smoke screen to escape', type: 'utility', manaCost: 20, cooldown: 15000, range: 5 },
  
  // Archer Skills
  'arrow-rain': { id: 'arrow-rain', name: 'Arrow Rain', description: 'Fires multiple arrows at once', type: 'attack', damage: 20, manaCost: 25, cooldown: 4000, range: 20 },
  'snipe': { id: 'snipe', name: 'Snipe', description: 'A precise long-range shot', type: 'attack', damage: 60, manaCost: 35, cooldown: 8000, range: 30 },
  'trap': { id: 'trap', name: 'Trap', description: 'Places a damaging trap on the ground', type: 'utility', manaCost: 20, cooldown: 10000, range: 5 },
  'piercing-shot': { id: 'piercing-shot', name: 'Piercing Shot', description: 'Arrow that pierces through multiple enemies', type: 'attack', damage: 35, manaCost: 30, cooldown: 6000, range: 25 },
  
  // Healer Skills
  'revive': { id: 'revive', name: 'Revive', description: 'Brings a fallen ally back to life', type: 'heal', healAmount: 100, manaCost: 50, cooldown: 30000, range: 5 },
  'bless': { id: 'bless', name: 'Bless', description: 'Increases ally stats temporarily', type: 'utility', manaCost: 30, cooldown: 15000, range: 10 },
  'cleanse': { id: 'cleanse', name: 'Cleanse', description: 'Removes debuffs from allies', type: 'utility', manaCost: 25, cooldown: 10000, range: 8 },
};

// ============================================
// 🗺️ WORLD CONSTANTS
// ============================================
export const GAME_CONSTANTS = {
  WORLD_SIZE: 1000,
  GRAVITY: -9.8,
  PLAYER_SPEED: 0.2,
  PLAYER_HEIGHT: 1.8,
  PLAYER_RADIUS: 0.5,
  CAMERA_OFFSET: { x: 0, y: 2, z: 5 },
  MAX_PLAYERS: 50,
  TICK_RATE: 30,
  DEFAULT_HEALTH: 100,
  DEFAULT_MANA: 100,
};

// ============================================
// 🎨 WORLD SETTINGS (Naruto Storm Style)
// ============================================
export const WORLD_SETTINGS = {
  groundColor: 0x1a5fb4,
  skyColor: 0x87ceeb,
  fogColor: 0x87ceeb,
  fogDensity: 0.0005,
  ambientLight: 0x404040,
  directionalLight: 0xffffff,
  // Anime-style lighting
  animeShading: true,
  outlineColor: 0x000000,
  outlineWidth: 0.02,
};

// ============================================
// 🏡 BUENA VILLAGE MAP DATA
// ============================================
export const BUENA_VILLAGE = {
  name: 'Buena Village',
  description: 'A peaceful rural village from the world of Mushoku Tensei',
  spawnPoint: { x: 0, y: 0, z: 0 },
  buildings: [
    {
      id: 'rudeus-house',
      name: "Rudeus's House",
      type: 'house',
      position: { x: 10, y: 0, z: -5 },
      size: { width: 8, depth: 6, height: 4 },
      color: 0x8b4513, // Wood brown
      roofColor: 0x654321,
    },
    {
      id: 'paul-house',
      name: "Paul's House",
      type: 'house',
      position: { x: -10, y: 0, z: -5 },
      size: { width: 8, depth: 6, height: 4 },
      color: 0x8b4513,
      roofColor: 0x654321,
    },
    {
      id: 'zenith-house',
      name: "Zenith's House",
      type: 'house',
      position: { x: 0, y: 0, z: -15 },
      size: { width: 6, depth: 5, height: 3.5 },
      color: 0x8b4513,
      roofColor: 0x654321,
    },
    {
      id: 'village-center',
      name: 'Village Center',
      type: 'square',
      position: { x: 0, y: 0, z: 10 },
      size: { width: 20, depth: 20, height: 0.5 },
      color: 0xc0c0c0,
    },
    {
      id: 'well',
      name: 'Village Well',
      type: 'well',
      position: { x: 0, y: 0, z: 10 },
      size: { width: 3, depth: 3, height: 2 },
      color: 0x808080,
      roofColor: 0x8b4513,
    },
  ],
  trees: [
    { position: { x: 15, y: 0, z: 0 }, type: 'oak', height: 6, radius: 1 },
    { position: { x: -15, y: 0, z: 0 }, type: 'oak', height: 6, radius: 1 },
    { position: { x: 0, y: 0, z: 20 }, type: 'oak', height: 6, radius: 1 },
    { position: { x: 20, y: 0, z: 15 }, type: 'pine', height: 8, radius: 1.2 },
    { position: { x: -20, y: 0, z: 15 }, type: 'pine', height: 8, radius: 1.2 },
    { position: { x: 18, y: 0, z: -10 }, type: 'oak', height: 6, radius: 1 },
    { position: { x: -18, y: 0, z: -10 }, type: 'oak', height: 6, radius: 1 },
  ],
  paths: [
    { start: { x: 0, z: 0 }, end: { x: 10, z: -5 }, width: 2, color: 0xd2b48c },
    { start: { x: 0, z: 0 }, end: { x: -10, z: -5 }, width: 2, color: 0xd2b48c },
    { start: { x: 0, z: 0 }, end: { x: 0, z: -15 }, width: 2, color: 0xd2b48c },
    { start: { x: 10, z: -5 }, end: { x: 0, z: 10 }, width: 2, color: 0xd2b48c },
    { start: { x: -10, z: -5 }, end: { x: 0, z: 10 }, width: 2, color: 0xd2b48c },
  ],
  fences: [
    { start: { x: 25, z: 25 }, end: { x: -25, z: 25 }, height: 1.5, color: 0x8b4513 },
    { start: { x: -25, z: 25 }, end: { x: -25, z: -25 }, height: 1.5, color: 0x8b4513 },
    { start: { x: -25, z: -25 }, end: { x: 25, z: -25 }, height: 1.5, color: 0x8b4513 },
    { start: { x: 25, z: -25 }, end: { x: 25, z: 25 }, height: 1.5, color: 0x8b4513 },
  ],
  // Gates
  gates: [
    { position: { x: 0, z: 25 }, width: 4, height: 3, color: 0x8b4513 },
    { position: { x: 25, z: 0 }, width: 4, height: 3, color: 0x8b4513 },
  ],
};

// ============================================
// 👤 CHARACTER VISUAL PRESETS
// ============================================
export const CHARACTER_VISUALS = {
  rudeus: {
    // Head
    head: {
      geometry: 'sphere',
      radius: 0.25,
      color: 0xffccaa, // Skin tone
      position: { x: 0, y: 1.05, z: 0 },
    },
    // Hair (blue, medium length)
    hair: {
      geometry: 'capsule',
      radius: 0.3,
      height: 0.4,
      color: 0x4a90d9, // Blue hair
      position: { x: 0, y: 1.2, z: 0 },
    },
    // Body
    body: {
      geometry: 'capsule',
      radius: 0.3,
      height: 0.8,
      color: 0x4a90d9, // Blue robe
      position: { x: 0, y: 0.4, z: 0 },
    },
    // Robe sleeves
    sleeves: {
      left: {
        geometry: 'capsule',
        radius: 0.15,
        height: 0.6,
        color: 0x4a90d9,
        position: { x: -0.35, y: 0.7, z: 0 },
        rotation: { x: 0, y: 0, z: Math.PI / 2 },
      },
      right: {
        geometry: 'capsule',
        radius: 0.15,
        height: 0.6,
        color: 0x4a90d9,
        position: { x: 0.35, y: 0.7, z: 0 },
        rotation: { x: 0, y: 0, z: Math.PI / 2 },
      },
    },
    // Staff (optional accessory)
    staff: {
      geometry: 'capsule',
      radius: 0.05,
      height: 1.5,
      color: 0x8b4513, // Wood
      position: { x: 0.2, y: 0.2, z: 0 },
      rotation: { x: 0.2, y: 0, z: 0 },
    },
    // Height offset for camera
    cameraOffset: { x: 0, y: 1.6, z: 3 },
  },
  warrior: {
    head: { geometry: 'sphere', radius: 0.25, color: 0xffccaa, position: { x: 0, y: 1.05, z: 0 } },
    hair: { geometry: 'capsule', radius: 0.3, height: 0.3, color: 0x8b4513, position: { x: 0, y: 1.2, z: 0 } },
    body: { geometry: 'capsule', radius: 0.35, height: 0.85, color: 0x808080, position: { x: 0, y: 0.425, z: 0 } },
    armor: {
      chest: { geometry: 'box', width: 0.5, height: 0.4, depth: 0.3, color: 0x696969, position: { x: 0, y: 0.6, z: 0 } },
      shoulders: { geometry: 'box', width: 0.4, height: 0.2, depth: 0.3, color: 0x696969, position: { x: 0, y: 0.85, z: 0 } },
    },
    weapon: {
      geometry: 'box',
      width: 0.1, height: 0.8, depth: 0.3,
      color: 0xc0c0c0,
      position: { x: 0.25, y: 0.2, z: 0 },
      rotation: { x: 0, y: 0, z: Math.PI / 4 },
    },
    cameraOffset: { x: 0, y: 1.7, z: 3 },
  },
  mage: {
    head: { geometry: 'sphere', radius: 0.25, color: 0xffccaa, position: { x: 0, y: 1.05, z: 0 } },
    hair: { geometry: 'capsule', radius: 0.3, height: 0.4, color: 0xffffff, position: { x: 0, y: 1.2, z: 0 } },
    body: { geometry: 'capsule', radius: 0.3, height: 0.8, color: 0x000080, position: { x: 0, y: 0.4, z: 0 } },
    robe: {
      geometry: 'cone',
      radius: 0.4,
      height: 0.6,
      color: 0x000080,
      position: { x: 0, y: 0.4, z: 0 },
    },
    staff: {
      geometry: 'capsule',
      radius: 0.05,
      height: 1.8,
      color: 0x8b4513,
      position: { x: 0.15, y: -0.3, z: 0 },
      rotation: { x: 0.1, y: 0, z: 0 },
    },
    cameraOffset: { x: 0, y: 1.6, z: 3 },
  },
  rogue: {
    head: { geometry: 'sphere', radius: 0.23, color: 0xffccaa, position: { x: 0, y: 1.0, z: 0 } },
    hair: { geometry: 'capsule', radius: 0.25, height: 0.25, color: 0x228b22, position: { x: 0, y: 1.15, z: 0 } },
    body: { geometry: 'capsule', radius: 0.28, height: 0.75, color: 0x222222, position: { x: 0, y: 0.375, z: 0 } },
    cloak: {
      geometry: 'plane',
      width: 0.6,
      height: 0.8,
      color: 0x333333,
      position: { x: 0, y: 0.4, z: -0.3 },
      rotation: { x: 0.3, y: 0, z: 0 },
    },
    daggerLeft: {
      geometry: 'box',
      width: 0.05, height: 0.2, depth: 0.3,
      color: 0xc0c0c0,
      position: { x: -0.2, y: 0.2, z: 0 },
      rotation: { x: 0, y: 0, z: Math.PI / 4 },
    },
    daggerRight: {
      geometry: 'box',
      width: 0.05, height: 0.2, depth: 0.3,
      color: 0xc0c0c0,
      position: { x: 0.2, y: 0.2, z: 0 },
      rotation: { x: 0, y: 0, z: -Math.PI / 4 },
    },
    cameraOffset: { x: 0, y: 1.5, z: 2.5 },
  },
  archer: {
    head: { geometry: 'sphere', radius: 0.25, color: 0xffccaa, position: { x: 0, y: 1.05, z: 0 } },
    hair: { geometry: 'capsule', radius: 0.3, height: 0.35, color: 0xdaa520, position: { x: 0, y: 1.2, z: 0 } },
    body: { geometry: 'capsule', radius: 0.3, height: 0.8, color: 0x228b22, position: { x: 0, y: 0.4, z: 0 } },
    quiver: {
      geometry: 'capsule',
      radius: 0.15,
      height: 0.4,
      color: 0x8b4513,
      position: { x: -0.2, y: 0.6, z: 0 },
      rotation: { x: 0, y: 0, z: Math.PI / 2 },
    },
    bow: {
      geometry: 'box',
      width: 0.8,
      height: 0.05,
      depth: 0.1,
      color: 0x8b4513,
      position: { x: 0.3, y: 0.3, z: 0 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
    },
    cameraOffset: { x: 0, y: 1.6, z: 4 },
  },
  healer: {
    head: { geometry: 'sphere', radius: 0.25, color: 0xffccaa, position: { x: 0, y: 1.05, z: 0 } },
    hair: { geometry: 'capsule', radius: 0.3, height: 0.45, color: 0xffd700, position: { x: 0, y: 1.225, z: 0 } },
    body: { geometry: 'capsule', radius: 0.3, height: 0.8, color: 0xffffff, position: { x: 0, y: 0.4, z: 0 } },
    robe: {
      geometry: 'cone',
      radius: 0.4,
      height: 0.65,
      color: 0xffffff,
      position: { x: 0, y: 0.4, z: 0 },
    },
    staff: {
      geometry: 'capsule',
      radius: 0.04,
      height: 1.6,
      color: 0xffd700,
      position: { x: 0.1, y: -0.2, z: 0 },
      rotation: { x: 0.15, y: 0, z: 0 },
    },
    cameraOffset: { x: 0, y: 1.6, z: 3 },
  },
};

// ============================================
// 🎯 DEFAULT CHARACTER
// ============================================
export const DEFAULT_CHARACTER: CharacterType = 'rudeus';

// ============================================
// 📦 EXPORT ALL
// ============================================
export { CHARACTER_PRESETS as PRESETS };
export { SKILLS as SKILLS_DB };
