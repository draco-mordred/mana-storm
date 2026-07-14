import type { CharacterPreset, Skill } from '../types';

// ============================================
// 🎭 CHARACTER PRESETS (Anime Style)
// ============================================
export const CHARACTER_PRESETS: Record<string, CharacterPreset> = {
  // Rudeus Greyrat - Default character (Mushoku Tensei)
  rudeus: {
    type: 'rudeus',
    name: 'Rudeus Greyrat',
    baseHealth: 100,
    baseMana: 150,
    baseAttack: 20,
    baseDefense: 15,
    baseSpeed: 10,
    skills: ['magic-missile', 'healing', 'water-blast', 'teleportation'],
    model: 'rudeus',
    color: 0x4169e1, // Royal blue
    hairColor: 0x1e90ff, // Dodger blue
    outfit: 'blue_robe',
    weapon: 'staff',
    description: 'A young magic prodigy with immense mana capacity. Specializes in all elements of magic.'
  },
  
  // Original classes (updated for anime style)
  warrior: {
    type: 'warrior',
    name: 'Sword Master',
    baseHealth: 120,
    baseMana: 60,
    baseAttack: 25,
    baseDefense: 20,
    baseSpeed: 8,
    skills: ['sword-slash', 'shield-block', 'power-strike'],
    model: 'warrior',
    color: 0xff4500, // Orange-red
    hairColor: 0x8b0000, // Dark red
    outfit: 'plate_armor',
    weapon: 'sword',
    description: 'A melee specialist with powerful sword techniques and high defense.'
  },
  mage: {
    type: 'mage',
    name: 'Elemental Mage',
    baseHealth: 80,
    baseMana: 180,
    baseAttack: 30,
    baseDefense: 5,
    baseSpeed: 7,
    skills: ['fireball', 'ice-shield', 'lightning-bolt', 'teleport'],
    model: 'mage',
    color: 0x9370db, // Medium purple
    hairColor: 0x9932cc, // Dark orchid
    outfit: 'robe',
    weapon: 'staff',
    description: 'A master of elemental magic with devastating spell power.'
  },
  rogue: {
    type: 'rogue',
    name: 'Shadow Assassin',
    baseHealth: 90,
    baseMana: 80,
    baseAttack: 22,
    baseDefense: 10,
    baseSpeed: 15,
    skills: ['backstab', 'stealth', 'poison-dagger', 'shadow-clone'],
    model: 'rogue',
    color: 0x228b22, // Forest green
    hairColor: 0x2e8b57, // Sea green
    outfit: 'leather_armor',
    weapon: 'dagger',
    description: 'A stealthy fighter who excels at critical hits and evasion.'
  },
  archer: {
    type: 'archer',
    name: 'Sniper',
    baseHealth: 95,
    baseMana: 70,
    baseAttack: 20,
    baseDefense: 8,
    baseSpeed: 12,
    skills: ['arrow-rain', 'snipe', 'trap', 'piercing-shot'],
    model: 'archer',
    color: 0xdaa520, // Goldenrod
    hairColor: 0xffd700, // Gold
    outfit: 'hunter_gear',
    weapon: 'bow',
    description: 'A ranged specialist with precise long-distance attacks.'
  },
  healer: {
    type: 'healer',
    name: 'Saint',
    baseHealth: 100,
    baseMana: 200,
    baseAttack: 8,
    baseDefense: 12,
    baseSpeed: 9,
    skills: ['heal', 'revive', 'bless', 'holy-barrier'],
    model: 'healer',
    color: 0xffd700, // Gold
    hairColor: 0xff69b4, // Hot pink
    outfit: 'priest_robe',
    weapon: 'holy_symbol',
    description: 'A support specialist who can heal allies and provide buffs.'
  },
};

// ============================================
// ⚔️ SKILLS DATABASE (Anime Style)
// ============================================
export const SKILLS: Record<string, Skill> = {
  // Rudeus Skills
  'magic-missile': {
    id: 'magic-missile',
    name: 'Magic Missile',
    description: 'Fires multiple homing magic projectiles',
    type: 'attack',
    damage: 35,
    manaCost: 20,
    cooldown: 2500,
    range: 20,
    animation: 'cast_magic'
  },
  'healing': {
    id: 'healing',
    name: 'Healing Magic',
    description: 'Restores a large amount of health',
    type: 'heal',
    healAmount: 50,
    manaCost: 30,
    cooldown: 4000,
    range: 15,
    animation: 'cast_heal'
  },
  'water-blast': {
    id: 'water-blast',
    name: 'Water Blast',
    description: 'Unleashes a powerful jet of water',
    type: 'attack',
    damage: 45,
    manaCost: 25,
    cooldown: 3500,
    range: 18,
    animation: 'cast_water'
  },
  'teleportation': {
    id: 'teleportation',
    name: 'Teleportation',
    description: 'Instantly move to a target location',
    type: 'utility',
    manaCost: 40,
    cooldown: 10000,
    range: 30,
    animation: 'teleport'
  },
  
  // Warrior Skills
  'sword-slash': {
    id: 'sword-slash',
    name: 'Sword Slash',
    description: 'A powerful melee attack that cleaves through enemies',
    type: 'attack',
    damage: 40,
    manaCost: 10,
    cooldown: 1500,
    range: 2,
    animation: 'slash'
  },
  'shield-block': {
    id: 'shield-block',
    name: 'Shield Block',
    description: 'Raises shield to reduce incoming damage by 50%',
    type: 'defense',
    manaCost: 15,
    cooldown: 6000,
    range: 1,
    animation: 'block'
  },
  'power-strike': {
    id: 'power-strike',
    name: 'Power Strike',
    description: 'A charged attack that deals massive damage',
    type: 'attack',
    damage: 70,
    manaCost: 25,
    cooldown: 5000,
    range: 2,
    animation: 'charge_attack'
  },
  
  // Mage Skills
  'fireball': {
    id: 'fireball',
    name: 'Fireball',
    description: 'Launches an explosive ball of fire',
    type: 'attack',
    damage: 60,
    manaCost: 30,
    cooldown: 4000,
    range: 25,
    animation: 'cast_fire'
  },
  'ice-shield': {
    id: 'ice-shield',
    name: 'Ice Shield',
    description: 'Creates a protective barrier of ice',
    type: 'defense',
    manaCost: 20,
    cooldown: 7000,
    range: 1,
    animation: 'cast_ice'
  },
  'lightning-bolt': {
    id: 'lightning-bolt',
    name: 'Lightning Bolt',
    description: 'Strikes enemies with a powerful lightning bolt',
    type: 'attack',
    damage: 55,
    manaCost: 35,
    cooldown: 5000,
    range: 20,
    animation: 'cast_lightning'
  },
  
  // Rogue Skills
  'backstab': {
    id: 'backstab',
    name: 'Backstab',
    description: 'Deals critical damage when attacking from behind',
    type: 'attack',
    damage: 80,
    manaCost: 20,
    cooldown: 6000,
    range: 1,
    animation: 'backstab'
  },
  'stealth': {
    id: 'stealth',
    name: 'Stealth',
    description: 'Become invisible to enemies for a short time',
    type: 'utility',
    manaCost: 25,
    cooldown: 12000,
    range: 1,
    animation: 'stealth'
  },
  'poison-dagger': {
    id: 'poison-dagger',
    name: 'Poison Dagger',
    description: 'Throws a dagger that poisons the target',
    type: 'attack',
    damage: 25,
    manaCost: 15,
    cooldown: 3000,
    range: 12,
    animation: 'throw'
  },
  'shadow-clone': {
    id: 'shadow-clone',
    name: 'Shadow Clone',
    description: 'Creates a temporary clone that mimics your actions',
    type: 'utility',
    manaCost: 50,
    cooldown: 15000,
    range: 1,
    animation: 'clone'
  },
  
  // Archer Skills
  'arrow-rain': {
    id: 'arrow-rain',
    name: 'Arrow Rain',
    description: 'Fires multiple arrows in an area',
    type: 'attack',
    damage: 30,
    manaCost: 25,
    cooldown: 4000,
    range: 25,
    animation: 'arrow_rain'
  },
  'snipe': {
    id: 'snipe',
    name: 'Snipe',
    description: 'A precise long-range shot that deals high damage',
    type: 'attack',
    damage: 90,
    manaCost: 40,
    cooldown: 8000,
    range: 40,
    animation: 'snipe'
  },
  'trap': {
    id: 'trap',
    name: 'Bear Trap',
    description: 'Places a trap that roots enemies',
    type: 'utility',
    manaCost: 20,
    cooldown: 10000,
    range: 8,
    animation: 'place_trap'
  },
  'piercing-shot': {
    id: 'piercing-shot',
    name: 'Piercing Shot',
    description: 'An arrow that pierces through multiple enemies',
    type: 'attack',
    damage: 45,
    manaCost: 30,
    cooldown: 5000,
    range: 30,
    animation: 'piercing_shot'
  },
  
  // Healer Skills
  'heal': {
    id: 'heal',
    name: 'Heal',
    description: 'Restores health to a target ally',
    type: 'heal',
    healAmount: 40,
    manaCost: 25,
    cooldown: 3000,
    range: 15,
    animation: 'heal'
  },
  'revive': {
    id: 'revive',
    name: 'Revive',
    description: 'Brings a fallen ally back to life',
    type: 'heal',
    healAmount: 100,
    manaCost: 60,
    cooldown: 30000,
    range: 8,
    animation: 'revive'
  },
  'bless': {
    id: 'bless',
    name: 'Bless',
    description: 'Increases ally attack and defense temporarily',
    type: 'utility',
    manaCost: 35,
    cooldown: 15000,
    range: 20,
    animation: 'bless'
  },
  'holy-barrier': {
    id: 'holy-barrier',
    name: 'Holy Barrier',
    description: 'Creates a protective barrier that absorbs damage',
    type: 'defense',
    manaCost: 40,
    cooldown: 10000,
    range: 10,
    animation: 'barrier'
  },
};

// ============================================
// 🗺️ BUena VILLAGE MAP DATA
// ============================================
export interface MapObject {
  type: 'house' | 'tree' | 'rock' | 'well' | 'fence' | 'path' | 'sign';
  position: { x: number; y: number; z: number };
  rotation?: { x: number; y: number; z: number };
  scale?: { x: number; y: number; z: number };
  color?: number;
  model?: string;
}

export interface GameMap {
  id: string;
  name: string;
  description: string;
  size: { width: number; height: number };
  groundColor: number;
  skyColor: number;
  fogColor: number;
  fogDensity: number;
  objects: MapObject[];
  spawnPoints: { x: number; y: number; z: number }[];
  ambientLight: number;
  directionalLight: number;
}

export const BUena_VILLAGE: GameMap = {
  id: 'buena-village',
  name: 'Buena Village',
  description: 'A peaceful village from the world of Jobless Reincarnation. Home of Rudeus Greyrat.',
  size: { width: 200, height: 200 },
  groundColor: 0x1e3a1e, // Dark green grass
  skyColor: 0x87ceeb, // Sky blue
  fogColor: 0xa0c4e8,
  fogDensity: 0.001,
  ambientLight: 0x666666,
  directionalLight: 0xffffff,
  
  spawnPoints: [
    { x: 0, y: 0, z: 0 },
    { x: 10, y: 0, z: 0 },
    { x: -10, y: 0, z: 0 },
    { x: 0, y: 0, z: 10 },
    { x: 0, y: 0, z: -10 },
  ],
  
  objects: [
    // Central well
    {
      type: 'well',
      position: { x: 0, y: 0, z: 0 },
      scale: { x: 1.5, y: 1.5, z: 1.5 },
      model: 'well',
      color: 0x8b4513 // Saddle brown
    },
    
    // Rudeus's House (Greyrat House)
    {
      type: 'house',
      position: { x: -25, y: 0, z: -15 },
      rotation: { x: 0, y: Math.PI / 4, z: 0 },
      scale: { x: 2, y: 1.5, z: 2 },
      model: 'wooden_house',
      color: 0x8b4513 // Brown
    },
    
    // Paul's Workshop
    {
      type: 'house',
      position: { x: 25, y: 0, z: -15 },
      rotation: { x: 0, y: -Math.PI / 4, z: 0 },
      scale: { x: 1.5, y: 1.2, z: 1.5 },
      model: 'workshop',
      color: 0x654321 // Dark wood
    },
    
    // Zenith's Training Ground
    {
      type: 'house',
      position: { x: 0, y: 0, z: -30 },
      scale: { x: 3, y: 2, z: 3 },
      model: 'training_hall',
      color: 0x556b2f // Dark olive green
    },
    
    // Village Church
    {
      type: 'house',
      position: { x: -30, y: 0, z: 20 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
      scale: { x: 2.5, y: 2, z: 1.5 },
      model: 'church',
      color: 0xf5f5dc // Beige
    },
    
    // Trees - scattered around the village
    { type: 'tree', position: { x: -40, y: 0, z: -40 }, scale: { x: 1.5, y: 2, z: 1.5 }, model: 'oak_tree', color: 0x228b22 },
    { type: 'tree', position: { x: 40, y: 0, z: -40 }, scale: { x: 1.2, y: 1.8, z: 1.2 }, model: 'pine_tree', color: 0x228b22 },
    { type: 'tree', position: { x: -45, y: 0, z: 30 }, scale: { x: 1.4, y: 2.2, z: 1.4 }, model: 'oak_tree', color: 0x228b22 },
    { type: 'tree', position: { x: 45, y: 0, z: 30 }, scale: { x: 1.3, y: 2, z: 1.3 }, model: 'pine_tree', color: 0x228b22 },
    { type: 'tree', position: { x: -35, y: 0, z: 0 }, scale: { x: 1, y: 1.5, z: 1 }, model: 'oak_tree', color: 0x228b22 },
    { type: 'tree', position: { x: 35, y: 0, z: 0 }, scale: { x: 1.1, y: 1.7, z: 1.1 }, model: 'pine_tree', color: 0x228b22 },
    { type: 'tree', position: { x: 0, y: 0, z: 40 }, scale: { x: 1.6, y: 2.5, z: 1.6 }, model: 'oak_tree', color: 0x228b22 },
    { type: 'tree', position: { x: 0, y: 0, z: -45 }, scale: { x: 1.3, y: 2, z: 1.3 }, model: 'pine_tree', color: 0x228b22 },
    
    // Rocks
    { type: 'rock', position: { x: -30, y: 0, z: -35 }, scale: { x: 0.8, y: 0.8, z: 0.8 }, color: 0x808080 },
    { type: 'rock', position: { x: 30, y: 0, z: -35 }, scale: { x: 0.6, y: 0.6, z: 0.6 }, color: 0x808080 },
    { type: 'rock', position: { x: -25, y: 0, z: 35 }, scale: { x: 1, y: 1, z: 1 }, color: 0x808080 },
    { type: 'rock', position: { x: 25, y: 0, z: 35 }, scale: { x: 0.7, y: 0.7, z: 0.7 }, color: 0x808080 },
    
    // Fences
    { type: 'fence', position: { x: -15, y: 0, z: -20 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 5, y: 1, z: 0.2 }, color: 0x8b4513 },
    { type: 'fence', position: { x: 15, y: 0, z: -20 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 5, y: 1, z: 0.2 }, color: 0x8b4513 },
    { type: 'fence', position: { x: 0, y: 0, z: -25 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 10, y: 1, z: 0.2 }, color: 0x8b4513 },
    
    // Paths (using thin boxes as path markers)
    { type: 'path', position: { x: 0, y: -0.1, z: 0 }, scale: { x: 50, y: 0.1, z: 2 }, color: 0xd2b48c },
    { type: 'path', position: { x: 0, y: -0.1, z: 15 }, scale: { x: 2, y: 0.1, z: 40 }, color: 0xd2b48c },
    { type: 'path', position: { x: -20, y: -0.1, z: 0 }, scale: { x: 25, y: 0.1, z: 2 }, color: 0xd2b48c },
    { type: 'path', position: { x: 20, y: -0.1, z: 0 }, scale: { x: 25, y: 0.1, z: 2 }, color: 0xd2b48c },
    
    // Village sign
    { type: 'sign', position: { x: 0, y: 0, z: 25 }, rotation: { x: 0, y: Math.PI, z: 0 }, scale: { x: 1, y: 1.5, z: 0.1 }, model: 'sign', color: 0x8b4513 },
  ]
};

// ============================================
// 🎨 ANIME STYLE RENDERING SETTINGS
// ============================================
export const ANIME_RENDER_SETTINGS = {
  // Toon shading (cel-shading like Naruto Storm)
  useToonShading: true,
  
  // Outline settings
  useOutlines: true,
  outlineColor: 0x000000,
  outlineWidth: 0.02,
  
  // Character appearance
  characterScale: 1.0,
  headScale: 1.1, // Slightly larger heads for anime style
  
  // Animation settings
  idleAnimation: 'idle_anime',
  walkAnimation: 'walk_anime',
  runAnimation: 'run_anime',
  attackAnimation: 'attack_anime',
  
  // Camera settings for anime feel
  cameraFov: 75,
  cameraNear: 0.1,
  cameraFar: 1000,
  
  // Lighting for anime aesthetic
  ambientIntensity: 0.5,
  directionalIntensity: 0.8,
  
  // Post-processing effects
  bloomEnabled: true,
  bloomStrength: 0.5,
  bloomRadius: 0.5,
  
  // Color grading
  saturation: 1.2,
  contrast: 1.1,
  brightness: 1.0,
};

// ============================================
// 🎭 CHARACTER VISUAL DATA
// ============================================
export interface CharacterVisual {
  name: string;
  description: string;
  baseColor: number;
  hairColor: number;
  hairStyle: string;
  outfit: string;
  weapon: string;
  accessory?: string;
  height: number;
  build: 'slim' | 'average' | 'muscular';
  face: string;
  voice?: string;
}

export const CHARACTER_VISUALS: Record<string, CharacterVisual> = {
  rudeus: {
    name: 'Rudeus Greyrat',
    description: 'A young boy with blue hair and a magic staff. The reincarnation of a former NEET.',
    baseColor: 0xffffff, // White robe
    hairColor: 0x1e90ff, // Blue hair
    hairStyle: 'short_messy',
    outfit: 'blue_robe_with_hood',
    weapon: 'magic_staff',
    accessory: 'mana_crystal',
    height: 1.4, // Slightly shorter
    build: 'slim',
    face: 'young_boy'
  },
  warrior: {
    name: 'Sword Master',
    description: 'A muscular warrior with a mighty sword.',
    baseColor: 0xff4500,
    hairColor: 0x8b0000,
    hairStyle: 'short_spiky',
    outfit: 'plate_armor',
    weapon: 'greatsword',
    height: 1.8,
    build: 'muscular',
    face: 'rugged'
  },
  mage: {
    name: 'Elemental Mage',
    description: 'A wise mage with flowing robes.',
    baseColor: 0x9370db,
    hairColor: 0x9932cc,
    hairStyle: 'long_flowing',
    outfit: 'purple_robe',
    weapon: 'ornate_staff',
    height: 1.75,
    build: 'average',
    face: 'wise'
  },
  rogue: {
    name: 'Shadow Assassin',
    description: 'A stealthy rogue with dark clothing.',
    baseColor: 0x228b22,
    hairColor: 0x2e8b57,
    hairStyle: 'medium_messy',
    outfit: 'black_leather',
    weapon: 'twin_daggers',
    height: 1.7,
    build: 'slim',
    face: 'sharp'
  },
  archer: {
    name: 'Sniper',
    description: 'A skilled archer with a long bow.',
    baseColor: 0xdaa520,
    hairColor: 0xffd700,
    hairStyle: 'long_tied',
    outfit: 'hunter_gear',
    weapon: 'longbow',
    height: 1.75,
    build: 'average',
    face: 'focused'
  },
  healer: {
    name: 'Saint',
    description: 'A holy healer with divine powers.',
    baseColor: 0xffd700,
    hairColor: 0xff69b4,
    hairStyle: 'long_wavy',
    outfit: 'white_robe',
    weapon: 'holy_staff',
    accessory: 'halo',
    height: 1.7,
    build: 'average',
    face: 'kind'
  },
};

// ============================================
// 🎯 GAME CONSTANTS
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
  
  // Anime style specific
  ANIME_CAMERA_HEIGHT: 1.6,
  ANIME_CAMERA_DISTANCE: 4,
  
  // Default map
  DEFAULT_MAP: 'buena-village',
};

// ============================================
// 🌍 WORLD SETTINGS
// ============================================
export const WORLD_SETTINGS = {
  groundColor: 0x1a5fb4,
  skyColor: 0x87ceeb,
  fogColor: 0x87ceeb,
  fogDensity: 0.0005,
  ambientLight: 0x404040,
  directionalLight: 0xffffff,
};

// ============================================
// 👤 USER ACCOUNT SYSTEM
// ============================================
export interface UserAccount {
  id: string;
  username: string;
  email?: string;
  passwordHash: string; // In real app, use proper hashing
  character: CharacterType;
  characterName: string;
  level: number;
  xp: number;
  lastLogin: number;
  createdAt: number;
  saveData: {
    lastPosition: { x: number; y: number; z: number };
    lastMap: string;
    questProgress: Record<string, number>;
    inventory: string[];
    equipment: Record<string, string>;
  };
}

// ============================================
// 🎨 COLOR PALETTES (Anime Style)
// ============================================
export const ANIME_COLORS = {
  // Rudeus colors
  rudeusBlue: 0x1e90ff,
  rudeusWhite: 0xffffff,
  rudeusGold: 0xffd700,
  
  // Fire colors
  fireRed: 0xff4500,
  fireOrange: 0xffa500,
  fireYellow: 0xffff00,
  
  // Water colors
  waterBlue: 0x00bfff,
  waterLight: 0x87ceeb,
  waterDark: 0x00008b,
  
  // Earth colors
  earthBrown: 0x8b4513,
  earthGreen: 0x228b22,
  earthGray: 0x808080,
  
  // Light colors
  lightWhite: 0xffffff,
  lightYellow: 0xffffe0,
  lightGold: 0xffd700,
  
  // Dark colors
  darkBlack: 0x000000,
  darkPurple: 0x4b0082,
  darkBlue: 0x00008b,
};
