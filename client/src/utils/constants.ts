import type { CharacterPreset, Skill } from '../types';

// ============================================
// 🎭 CHARACTER PRESETS (Mana Storm)
// ============================================
export const CHARACTER_PRESETS: Record<string, CharacterPreset> = {
  // Rudeus Greyrat - Default character (from Mushoku Tensei)
  rudeus: {
    type: 'rudeus',
    name: 'Rudeus Greyrat',
    baseHealth: 100,
    baseMana: 150,
    baseAttack: 20,
    baseDefense: 15,
    baseSpeed: 10,
    skills: ['magic-missile', 'heal', 'water-bullet', 'fire-ball'],
    model: 'rudeus',
    color: 0x4a90e2, // Blue color for Rudeus
    description: 'A young prodigy mage with immense magical power',
    outfit: 'White robe with blue accents, carries a magical staff',
    hairColor: 0x4a90e2,
    hairStyle: 'short blue',
  },
  
  warrior: {
    type: 'warrior',
    name: 'Warrior',
    baseHealth: 120,
    baseMana: 60,
    baseAttack: 15,
    baseDefense: 20,
    baseSpeed: 8,
    skills: ['sword-slash', 'shield-block', 'war-cry'],
    model: 'warrior',
    color: 0xff0000,
    description: 'A powerful melee fighter with high defense',
    outfit: 'Heavy armor with sword and shield',
    hairColor: 0x8b4513,
    hairStyle: 'short brown',
  },
  
  mage: {
    type: 'mage',
    name: 'Mage',
    baseHealth: 80,
    baseMana: 120,
    baseAttack: 25,
    baseDefense: 5,
    baseSpeed: 7,
    skills: ['fireball', 'ice-shield', 'teleport'],
    model: 'mage',
    color: 0x0000ff,
    description: 'A spellcaster with powerful magical attacks',
    outfit: 'Robes with arcane symbols, carries a spellbook',
    hairColor: 0xffffff,
    hairStyle: 'long white',
  },
  
  rogue: {
    type: 'rogue',
    name: 'Rogue',
    baseHealth: 90,
    baseMana: 80,
    baseAttack: 20,
    baseDefense: 10,
    baseSpeed: 12,
    skills: ['backstab', 'stealth', 'poison-dagger'],
    model: 'rogue',
    color: 0x00ff00,
    description: 'A stealthy fighter who strikes from the shadows',
    outfit: 'Dark leather armor with twin daggers',
    hairColor: 0x000000,
    hairStyle: 'short black',
  },
  
  archer: {
    type: 'archer',
    name: 'Archer',
    baseHealth: 95,
    baseMana: 70,
    baseAttack: 18,
    baseDefense: 8,
    baseSpeed: 10,
    skills: ['arrow-rain', 'snipe', 'trap'],
    model: 'archer',
    color: 0xffff00,
    description: 'A ranged attacker with precision shots',
    outfit: 'Light armor with bow and quiver',
    hairColor: 0x8b4513,
    hairStyle: 'long brown',
  },
  
  healer: {
    type: 'healer',
    name: 'Healer',
    baseHealth: 100,
    baseMana: 150,
    baseAttack: 5,
    baseDefense: 12,
    baseSpeed: 9,
    skills: ['heal', 'revive', 'bless'],
    model: 'healer',
    color: 0xff00ff,
    description: 'A support class that heals and buffs allies',
    outfit: 'White robes with healing symbols, carries a holy staff',
    hairColor: 0xffd700,
    hairStyle: 'long blonde',
  },
};

// ============================================
// ⚔️ SKILLS DATABASE
// ============================================
export const SKILLS: Record<string, Skill> = {
  // Rudeus Skills
  'magic-missile': {
    id: 'magic-missile',
    name: 'Magic Missile',
    description: 'Fires a barrage of magical projectiles',
    type: 'attack',
    damage: 30,
    manaCost: 15,
    cooldown: 1500,
    range: 20,
  },
  'water-bullet': {
    id: 'water-bullet',
    name: 'Water Bullet',
    description: 'A powerful water-based attack',
    type: 'attack',
    damage: 35,
    manaCost: 20,
    cooldown: 2000,
    range: 15,
  },
  'fire-ball': {
    id: 'fire-ball',
    name: 'Fire Ball',
    description: 'A flaming sphere of destruction',
    type: 'attack',
    damage: 40,
    manaCost: 25,
    cooldown: 3000,
    range: 25,
  },
  
  // Warrior Skills
  'sword-slash': {
    id: 'sword-slash',
    name: 'Sword Slash',
    description: 'A powerful melee attack',
    type: 'attack',
    damage: 25,
    manaCost: 10,
    cooldown: 2000,
    range: 2,
  },
  'shield-block': {
    id: 'shield-block',
    name: 'Shield Block',
    description: 'Reduces incoming damage',
    type: 'defense',
    manaCost: 15,
    cooldown: 5000,
    range: 1,
  },
  'war-cry': {
    id: 'war-cry',
    name: 'War Cry',
    description: 'Increases attack power temporarily',
    type: 'utility',
    manaCost: 20,
    cooldown: 10000,
    range: 10,
  },
  
  // Mage Skills
  'fireball': {
    id: 'fireball',
    name: 'Fireball',
    description: 'Launches a ball of fire at enemies',
    type: 'attack',
    damage: 40,
    manaCost: 25,
    cooldown: 3000,
    range: 15,
  },
  'ice-shield': {
    id: 'ice-shield',
    name: 'Ice Shield',
    description: 'Creates a protective ice barrier',
    type: 'defense',
    manaCost: 20,
    cooldown: 8000,
    range: 1,
  },
  'teleport': {
    id: 'teleport',
    name: 'Teleport',
    description: 'Instantly move to a nearby location',
    type: 'utility',
    manaCost: 30,
    cooldown: 15000,
    range: 20,
  },
  
  // Rogue Skills
  'backstab': {
    id: 'backstab',
    name: 'Backstab',
    description: 'Deals massive damage from behind',
    type: 'attack',
    damage: 50,
    manaCost: 20,
    cooldown: 5000,
    range: 1,
  },
  'stealth': {
    id: 'stealth',
    name: 'Stealth',
    description: 'Become invisible for a short time',
    type: 'utility',
    manaCost: 15,
    cooldown: 12000,
    range: 1,
  },
  'poison-dagger': {
    id: 'poison-dagger',
    name: 'Poison Dagger',
    description: 'Applies damage over time',
    type: 'attack',
    damage: 15,
    manaCost: 10,
    cooldown: 2000,
    range: 10,
  },
  
  // Archer Skills
  'arrow-rain': {
    id: 'arrow-rain',
    name: 'Arrow Rain',
    description: 'Fires multiple arrows at once',
    type: 'attack',
    damage: 20,
    manaCost: 25,
    cooldown: 4000,
    range: 20,
  },
  'snipe': {
    id: 'snipe',
    name: 'Snipe',
    description: 'A precise long-range shot',
    type: 'attack',
    damage: 60,
    manaCost: 35,
    cooldown: 8000,
    range: 30,
  },
  'trap': {
    id: 'trap',
    name: 'Trap',
    description: 'Places a damaging trap on the ground',
    type: 'utility',
    manaCost: 20,
    cooldown: 10000,
    range: 5,
  },
  
  // Healer Skills
  'heal': {
    id: 'heal',
    name: 'Heal',
    description: 'Restores health to a target',
    type: 'heal',
    healAmount: 40,
    manaCost: 25,
    cooldown: 3000,
    range: 10,
  },
  'revive': {
    id: 'revive',
    name: 'Revive',
    description: 'Brings a fallen ally back to life',
    type: 'heal',
    healAmount: 100,
    manaCost: 50,
    cooldown: 30000,
    range: 5,
  },
  'bless': {
    id: 'bless',
    name: 'Bless',
    description: 'Increases ally stats temporarily',
    type: 'utility',
    manaCost: 30,
    cooldown: 15000,
    range: 10,
  },
};

// ============================================
// 🗺️ BUENA VILLAGE MAP (From Mushoku Tensei)
// ============================================
export interface MapObject {
  type: 'house' | 'tree' | 'path' | 'well' | 'fence' | 'sign' | 'npc';
  position: { x: number; y: number; z: number };
  rotation?: { x: number; y: number; z: number };
  scale?: { x: number; y: number; z: number };
  color?: number;
  size?: number;
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
  ambientLight: number;
  objects: MapObject[];
  spawnPoints: { x: number; y: number; z: number }[];
}

export const BUENA_VILLAGE: GameMap = {
  id: 'buena-village',
  name: 'Buena Village',
  description: 'The peaceful village where Rudeus grew up. A quiet rural settlement surrounded by forests.',
  size: { width: 200, height: 200 },
  groundColor: 0x3a5f0b, // Dark green grass
  skyColor: 0x87ceeb, // Light blue sky
  fogColor: 0x87ceeb,
  fogDensity: 0.001,
  ambientLight: 0x404040,
  
  spawnPoints: [
    { x: 0, y: 0, z: 0 },
    { x: 10, y: 0, z: 10 },
    { x: -10, y: 0, z: -10 },
  ],
  
  objects: [
    // ========== HOUSES ==========
    // Rudeus's House (center)
    {
      type: 'house',
      position: { x: 0, y: 0, z: 0 },
      scale: { x: 8, y: 6, z: 6 },
      color: 0x8b4513, // Brown wood
    },
    // House 2
    {
      type: 'house',
      position: { x: 25, y: 0, z: 10 },
      rotation: { y: Math.PI / 4 },
      scale: { x: 6, y: 5, z: 5 },
      color: 0x654321,
    },
    // House 3
    {
      type: 'house',
      position: { x: -25, y: 0, z: 15 },
      rotation: { y: -Math.PI / 4 },
      scale: { x: 7, y: 5, z: 5 },
      color: 0x8b4513,
    },
    // House 4
    {
      type: 'house',
      position: { x: 15, y: 0, z: -20 },
      scale: { x: 6, y: 5, z: 5 },
      color: 0x654321,
    },
    // House 5
    {
      type: 'house',
      position: { x: -15, y: 0, z: -25 },
      scale: { x: 7, y: 5, z: 5 },
      color: 0x8b4513,
    },
    
    // ========== TREES ==========
    // Forest area 1
    { type: 'tree', position: { x: 30, y: 0, z: 30 }, size: 1.5 },
    { type: 'tree', position: { x: 35, y: 0, z: 25 }, size: 1.2 },
    { type: 'tree', position: { x: 40, y: 0, z: 35 }, size: 1.4 },
    { type: 'tree', position: { x: 25, y: 0, z: 40 }, size: 1.3 },
    
    // Forest area 2
    { type: 'tree', position: { x: -30, y: 0, z: 30 }, size: 1.5 },
    { type: 'tree', position: { x: -35, y: 0, z: 25 }, size: 1.2 },
    { type: 'tree', position: { x: -40, y: 0, z: 35 }, size: 1.4 },
    
    // Forest area 3
    { type: 'tree', position: { x: 30, y: 0, z: -30 }, size: 1.5 },
    { type: 'tree', position: { x: 35, y: 0, z: -25 }, size: 1.2 },
    { type: 'tree', position: { x: 25, y: 0, z: -35 }, size: 1.4 },
    
    // Forest area 4
    { type: 'tree', position: { x: -30, y: 0, z: -30 }, size: 1.5 },
    { type: 'tree', position: { x: -35, y: 0, z: -25 }, size: 1.2 },
    { type: 'tree', position: { x: -25, y: 0, z: -35 }, size: 1.4 },
    
    // ========== VILLAGE CENTER ==========
    // Well
    {
      type: 'well',
      position: { x: 0, y: 0, z: 20 },
      scale: { x: 2, y: 2, z: 2 },
      color: 0x808080,
    },
    
    // Village sign
    {
      type: 'sign',
      position: { x: 0, y: 0, z: -15 },
      rotation: { y: Math.PI },
      scale: { x: 1, y: 2, z: 0.2 },
      color: 0x8b4513,
    },
    
    // ========== FENCES ==========
    // Fence sections around village
    { type: 'fence', position: { x: 45, y: 0, z: 0 }, rotation: { y: Math.PI / 2 }, scale: { x: 10, y: 2, z: 0.5 }, color: 0x8b4513 },
    { type: 'fence', position: { x: -45, y: 0, z: 0 }, rotation: { y: Math.PI / 2 }, scale: { x: 10, y: 2, z: 0.5 }, color: 0x8b4513 },
    { type: 'fence', position: { x: 0, y: 0, z: 45 }, scale: { x: 10, y: 2, z: 0.5 }, color: 0x8b4513 },
    { type: 'fence', position: { x: 0, y: 0, z: -45 }, scale: { x: 10, y: 2, z: 0.5 }, color: 0x8b4513 },
    
    // ========== PATHS ==========
    // Main path through village
    { type: 'path', position: { x: 0, y: -0.1, z: 0 }, scale: { x: 50, y: 0.1, z: 2 }, color: 0xd2b48c },
    { type: 'path', position: { x: 0, y: -0.1, z: 20 }, rotation: { x: Math.PI / 2 }, scale: { x: 2, y: 0.1, z: 30 }, color: 0xd2b48c },
  ],
};

// ============================================
// 🎨 GRAPHIC STYLE SETTINGS (Naruto Ultimate Ninja Storm Style)
// ============================================
export const GRAPHIC_STYLE = {
  // Cell-shading effect
  useCellShading: true,
  cellShadingLevels: 4,
  
  // Outline effect for characters
  useOutlines: true,
  outlineColor: 0x000000,
  outlineWidth: 0.02,
  
  // Anime-style lighting
  rimLightColor: 0xffffff,
  rimLightIntensity: 0.5,
  
  // Color saturation
  saturation: 1.2,
  
  // Bloom effect
  useBloom: true,
  bloomIntensity: 0.3,
  
  // Depth of field
  useDOF: false,
  
  // Motion blur
  useMotionBlur: false,
};

// ============================================
// 🎮 GAME CONSTANTS
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
  
  // Default character
  DEFAULT_CHARACTER: 'rudeus',
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
  
  // Buena Village specific
  villageGroundColor: 0x3a5f0b,
  villageSkyColor: 0x87ceeb,
};

// ============================================
// 👤 CHARACTER CUSTOMIZATION OPTIONS
// ============================================
export const HAIR_STYLES = [
  { id: 'short', name: 'Short', description: 'Short, neat hair' },
  { id: 'long', name: 'Long', description: 'Long flowing hair' },
  { id: 'ponytail', name: 'Ponytail', description: 'Hair tied back' },
  { id: 'messy', name: 'Messy', description: 'Wild, unkempt hair' },
];

export const HAIR_COLORS = [
  { id: 'blue', name: 'Blue', value: 0x4a90e2 },
  { id: 'black', name: 'Black', value: 0x000000 },
  { id: 'brown', name: 'Brown', value: 0x8b4513 },
  { id: 'blonde', name: 'Blonde', value: 0xffd700 },
  { id: 'white', name: 'White', value: 0xffffff },
  { id: 'red', name: 'Red', value: 0xff0000 },
  { id: 'green', name: 'Green', value: 0x00ff00 },
  { id: 'silver', name: 'Silver', value: 0xc0c0c0 },
];

export const EYE_COLORS = [
  { id: 'blue', name: 'Blue', value: 0x4a90e2 },
  { id: 'brown', name: 'Brown', value: 0x8b4513 },
  { id: 'green', name: 'Green', value: 0x00ff00 },
  { id: 'black', name: 'Black', value: 0x000000 },
  { id: 'gold', name: 'Gold', value: 0xffd700 },
];

// ============================================
// 💾 SAVE SLOTS
// ============================================
export interface SaveSlot {
  id: string;
  name: string;
  characterType: string;
  level: number;
  lastPlayed: number;
  position: { x: number; y: number; z: number };
}

export const DEFAULT_SAVE_SLOTS: SaveSlot[] = [];
