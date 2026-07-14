import type { CharacterPreset, Skill, CharacterType } from '../types';

// ============================================
// 🎭 CHARACTER PRESETS (Anime-Style)
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
// ⚔️ SKILLS DATABASE
// ============================================
export const SKILLS: Record<string, Skill> = {
  'fireball': { id: 'fireball', name: 'Fireball', description: 'Launches a ball of fire at enemies', type: 'attack', damage: 40, manaCost: 25, cooldown: 3000, range: 15 },
  'ice-shield': { id: 'ice-shield', name: 'Ice Shield', description: 'Creates a protective ice barrier', type: 'defense', manaCost: 20, cooldown: 8000, range: 1 },
  'heal': { id: 'heal', name: 'Heal', description: 'Restores health to a target', type: 'heal', healAmount: 40, manaCost: 25, cooldown: 3000, range: 10 },
  'teleport': { id: 'teleport', name: 'Teleport', description: 'Instantly move to a nearby location', type: 'utility', manaCost: 30, cooldown: 15000, range: 20 },
  'sword-slash': { id: 'sword-slash', name: 'Sword Slash', description: 'A powerful melee attack', type: 'attack', damage: 25, manaCost: 10, cooldown: 2000, range: 2 },
  'shield-block': { id: 'shield-block', name: 'Shield Block', description: 'Reduces incoming damage', type: 'defense', manaCost: 15, cooldown: 5000, range: 1 },
  'war-cry': { id: 'war-cry', name: 'War Cry', description: 'Increases attack power temporarily', type: 'utility', manaCost: 20, cooldown: 10000, range: 10 },
  'ground-stomp': { id: 'ground-stomp', name: 'Ground Stomp', description: 'Stuns nearby enemies', type: 'utility', manaCost: 25, cooldown: 12000, range: 8 },
  'lightning-bolt': { id: 'lightning-bolt', name: 'Lightning Bolt', description: 'Strikes enemies with lightning', type: 'attack', damage: 50, manaCost: 35, cooldown: 4000, range: 20 },
  'backstab': { id: 'backstab', name: 'Backstab', description: 'Deals massive damage from behind', type: 'attack', damage: 50, manaCost: 20, cooldown: 5000, range: 1 },
  'stealth': { id: 'stealth', name: 'Stealth', description: 'Become invisible for a short time', type: 'utility', manaCost: 15, cooldown: 12000, range: 1 },
  'poison-dagger': { id: 'poison-dagger', name: 'Poison Dagger', description: 'Applies damage over time', type: 'attack', damage: 15, manaCost: 10, cooldown: 2000, range: 10 },
  'smoke-bomb': { id: 'smoke-bomb', name: 'Smoke Bomb', description: 'Creates a smoke screen to escape', type: 'utility', manaCost: 20, cooldown: 15000, range: 5 },
  'arrow-rain': { id: 'arrow-rain', name: 'Arrow Rain', description: 'Fires multiple arrows at once', type: 'attack', damage: 20, manaCost: 25, cooldown: 4000, range: 20 },
  'snipe': { id: 'snipe', name: 'Snipe', description: 'A precise long-range shot', type: 'attack', damage: 60, manaCost: 35, cooldown: 8000, range: 30 },
  'trap': { id: 'trap', name: 'Trap', description: 'Places a damaging trap on the ground', type: 'utility', manaCost: 20, cooldown: 10000, range: 5 },
  'piercing-shot': { id: 'piercing-shot', name: 'Piercing Shot', description: 'Arrow that pierces through multiple enemies', type: 'attack', damage: 35, manaCost: 30, cooldown: 6000, range: 25 },
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
// 🎨 WORLD SETTINGS
// ============================================
export const WORLD_SETTINGS = {
  groundColor: 0x1a5fb4,
  skyColor: 0x87ceeb,
  fogColor: 0x87ceeb,
  fogDensity: 0.0005,
  ambientLight: 0x404040,
  directionalLight: 0xffffff,
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
      color: 0x8b4513,
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
  gates: [
    { position: { x: 0, z: 25 }, width: 4, height: 3, color: 0x8b4513 },
    { position: { x: 25, z: 0 }, width: 4, height: 3, color: 0x8b4513 },
  ],
};

// ============================================
// 🏰 ASURA KINGDOM MAP DATA
// ============================================
export const ASURA_KINGDOM = {
  name: 'Asura Kingdom',
  description: 'The grand capital of the Asura race with towering castles and noble architecture',
  spawnPoint: { x: 0, y: 0, z: 0 },
  buildings: [
    {
      id: 'asura-castle',
      name: 'Asura Castle',
      type: 'castle',
      position: { x: 0, y: 0, z: 0 },
      size: { width: 50, depth: 40, height: 30 },
      color: 0xffffff,
      roofColor: 0x000080,
    },
    {
      id: 'noble-mansion-1',
      name: 'Noble Mansion',
      type: 'mansion',
      position: { x: 30, y: 0, z: 20 },
      size: { width: 15, depth: 12, height: 8 },
      color: 0xf5f5dc,
      roofColor: 0x800000,
    },
    {
      id: 'noble-mansion-2',
      name: 'Noble Mansion',
      type: 'mansion',
      position: { x: -30, y: 0, z: 20 },
      size: { width: 15, depth: 12, height: 8 },
      color: 0xf5f5dc,
      roofColor: 0x800000,
    },
    {
      id: 'training-grounds',
      name: 'Training Grounds',
      type: 'arena',
      position: { x: 0, y: 0, z: -40 },
      size: { width: 60, depth: 60, height: 1 },
      color: 0x8b4513,
    },
    {
      id: 'temple',
      name: 'Asura Temple',
      type: 'temple',
      position: { x: 0, y: 0, z: 40 },
      size: { width: 25, depth: 25, height: 15 },
      color: 0xffd700,
      roofColor: 0xff8c00,
    },
  ],
  trees: [
    { position: { x: 40, y: 0, z: 0 }, type: 'pine', height: 10, radius: 1.5 },
    { position: { x: -40, y: 0, z: 0 }, type: 'pine', height: 10, radius: 1.5 },
    { position: { x: 0, y: 0, z: 50 }, type: 'pine', height: 10, radius: 1.5 },
    { position: { x: 50, y: 0, z: 30 }, type: 'pine', height: 10, radius: 1.5 },
    { position: { x: -50, y: 0, z: 30 }, type: 'pine', height: 10, radius: 1.5 },
    { position: { x: 30, y: 0, z: -30 }, type: 'pine', height: 10, radius: 1.5 },
    { position: { x: -30, y: 0, z: -30 }, type: 'pine', height: 10, radius: 1.5 },
  ],
  paths: [
    { start: { x: 0, z: 0 }, end: { x: 30, z: 20 }, width: 3, color: 0xc0c0c0 },
    { start: { x: 0, z: 0 }, end: { x: -30, z: 20 }, width: 3, color: 0xc0c0c0 },
    { start: { x: 0, z: 0 }, end: { x: 0, z: 40 }, width: 3, color: 0xc0c0c0 },
    { start: { x: 0, z: 0 }, end: { x: 0, z: -40 }, width: 3, color: 0xc0c0c0 },
    { start: { x: 30, z: 20 }, end: { x: 50, z: 30 }, width: 2, color: 0xc0c0c0 },
    { start: { x: -30, z: 20 }, end: { x: -50, z: 30 }, width: 2, color: 0xc0c0c0 },
  ],
  fences: [],
  gates: [
    { position: { x: 0, z: 60 }, width: 5, height: 4, color: 0xffd700 },
    { position: { x: 60, z: 0 }, width: 5, height: 4, color: 0xffd700 },
  ],
};

// ============================================
// 🏙️ MAGIC CITY SHARIA MAP DATA
// ============================================
export const MAGIC_CITY_SHARIA = {
  name: 'Magic City Sharia',
  description: 'A bustling city of magic with towering spires and mystical energy',
  spawnPoint: { x: 0, y: 0, z: 0 },
  buildings: [
    {
      id: 'magic-academy',
      name: 'Magic Academy',
      type: 'academy',
      position: { x: 0, y: 0, z: -30 },
      size: { width: 40, depth: 30, height: 20 },
      color: 0x000080,
      roofColor: 0x4169e1,
    },
    {
      id: 'magic-guild',
      name: 'Magic Guild',
      type: 'guild',
      position: { x: 25, y: 0, z: 0 },
      size: { width: 20, depth: 15, height: 10 },
      color: 0x9370db,
      roofColor: 0x663399,
    },
    {
      id: 'library',
      name: 'Great Library',
      type: 'library',
      position: { x: -25, y: 0, z: 0 },
      size: { width: 20, depth: 15, height: 12 },
      color: 0x8b4513,
      roofColor: 0x228b22,
    },
    {
      id: 'market',
      name: 'Magic Market',
      type: 'market',
      position: { x: 0, y: 0, z: 30 },
      size: { width: 30, depth: 20, height: 8 },
      color: 0xdaa520,
      roofColor: 0x8b4513,
    },
    {
      id: 'magic-tower',
      name: 'Magic Tower',
      type: 'tower',
      position: { x: 0, y: 0, z: -60 },
      size: { width: 10, depth: 10, height: 40 },
      color: 0xffffff,
      roofColor: 0x000080,
    },
  ],
  trees: [
    { position: { x: 35, y: 0, z: -20 }, type: 'oak', height: 8, radius: 1.2 },
    { position: { x: -35, y: 0, z: -20 }, type: 'oak', height: 8, radius: 1.2 },
    { position: { x: 0, y: 0, z: 40 }, type: 'oak', height: 8, radius: 1.2 },
    { position: { x: 40, y: 0, z: 10 }, type: 'oak', height: 8, radius: 1.2 },
    { position: { x: -40, y: 0, z: 10 }, type: 'oak', height: 8, radius: 1.2 },
    { position: { x: 15, y: 0, z: -70 }, type: 'oak', height: 8, radius: 1.2 },
    { position: { x: -15, y: 0, z: -70 }, type: 'oak', height: 8, radius: 1.2 },
  ],
  paths: [
    { start: { x: 0, z: 0 }, end: { x: 25, z: 0 }, width: 3, color: 0xc0c0c0 },
    { start: { x: 0, z: 0 }, end: { x: -25, z: 0 }, width: 3, color: 0xc0c0c0 },
    { start: { x: 0, z: 0 }, end: { x: 0, z: 30 }, width: 3, color: 0xc0c0c0 },
    { start: { x: 0, z: 0 }, end: { x: 0, z: -30 }, width: 3, color: 0xc0c0c0 },
    { start: { x: 25, z: 0 }, end: { x: 0, z: -30 }, width: 2, color: 0xc0c0c0 },
    { start: { x: -25, z: 0 }, end: { x: 0, z: -30 }, width: 2, color: 0xc0c0c0 },
    { start: { x: 0, z: -30 }, end: { x: 0, z: -60 }, width: 2, color: 0xc0c0c0 },
  ],
  fences: [],
  gates: [
    { position: { x: 0, z: 70 }, width: 5, height: 4, color: 0x9370db },
    { position: { x: 70, z: 0 }, width: 5, height: 4, color: 0x9370db },
  ],
};

// ============================================
// 👥 NPCS
// ============================================
export const NPCS = [
  { id: 'zenith', name: 'Zenith Greyrat', characterType: 'healer', position: { x: 0, y: 0, z: -12 }, area: 'buena-village', dialogue: ['Hello traveler!', 'Rudeus is around here somewhere...', 'Be careful out there!'], type: 'villager' },
  { id: 'paul', name: 'Paul Greyrat', characterType: 'warrior', position: { x: -8, y: 0, z: -3 }, area: 'buena-village', dialogue: ['Training is important!', 'Have you seen my son Rudeus?'], type: 'villager' },
  { id: 'lilia', name: 'Lilia', characterType: 'healer', position: { x: 12, y: 0, z: 8 }, area: 'buena-village', dialogue: ['Welcome to Buena Village!', 'The well is in the center.'], type: 'villager' },
  { id: 'buena-shopkeeper', name: 'Shopkeeper', characterType: 'mage', position: { x: -12, y: 0, z: 8 }, area: 'buena-village', dialogue: ['Buy something!', 'Potions, weapons, armor!'], type: 'shopkeeper' },
  { id: 'asura-guard', name: 'Royal Guard', characterType: 'warrior', position: { x: 15, y: 0, z: 0 }, area: 'asura-kingdom', dialogue: ['Halt! State your business.', 'The King is not receiving visitors.'], type: 'guard' },
  { id: 'asura-noble', name: 'Lord Asura', characterType: 'mage', position: { x: 0, y: 0, z: 10 }, area: 'asura-kingdom', dialogue: ['Welcome to Asura Kingdom.', 'The finest magic in the land!'], type: 'villager' },
  { id: 'training-master', name: 'Training Master', characterType: 'warrior', position: { x: 0, y: 0, z: -35 }, area: 'asura-kingdom', dialogue: ['Train hard!', 'Only the strong survive!'], type: 'villager' },
  { id: 'magic-instructor', name: 'Magic Instructor', characterType: 'mage', position: { x: 0, y: 0, z: -25 }, area: 'magic-city-sharia', dialogue: ['Learn the ways of magic!', 'Practice makes perfect.'], type: 'villager' },
  { id: 'guild-master', name: 'Guild Master', characterType: 'warrior', position: { x: 25, y: 0, z: 5 }, area: 'magic-city-sharia', dialogue: ['Need a job?', 'We have quests for brave adventurers!'], type: 'quest-giver', quests: ['magic-city-quest-1'] },
  { id: 'librarian', name: 'Librarian', characterType: 'healer', position: { x: -22, y: 0, z: 5 }, area: 'magic-city-sharia', dialogue: ['Shhh... be quiet!', 'Knowledge is power.'], type: 'villager' },
  { id: 'merchant', name: 'Magic Merchant', characterType: 'rogue', position: { x: 0, y: 0, z: 35 }, area: 'magic-city-sharia', dialogue: ['Rare magical items for sale!', 'Come back often!'], type: 'shopkeeper' },
];

// ============================================
// 👹 MONSTERS
// ============================================
export const MONSTERS = [
  { id: 'goblin-1', name: 'Goblin', type: 'goblin', position: { x: 25, y: 0, z: 25 }, area: 'buena-village', color: 0x00aa00, health: 50, attack: 10, defense: 5, xpReward: 20, aggressive: true },
  { id: 'goblin-2', name: 'Goblin Archer', type: 'goblin', position: { x: -25, y: 0, z: 25 }, area: 'buena-village', color: 0x008800, health: 40, attack: 15, defense: 3, xpReward: 25, aggressive: true },
  { id: 'wolf-1', name: 'Forest Wolf', type: 'wolf', position: { x: 30, y: 0, z: -10 }, area: 'buena-village', color: 0x808080, health: 60, attack: 12, defense: 8, xpReward: 30, aggressive: true },
  { id: 'slime-1', name: 'Slime', type: 'slime', position: { x: -30, y: 0, z: -10 }, area: 'buena-village', color: 0x00ffff, health: 30, attack: 5, defense: 2, xpReward: 10, aggressive: false },
  { id: 'skeleton-1', name: 'Skeleton Warrior', type: 'skeleton', position: { x: 40, y: 0, z: 10 }, area: 'asura-kingdom', color: 0xffffff, health: 70, attack: 15, defense: 10, xpReward: 40, aggressive: true },
  { id: 'skeleton-2', name: 'Skeleton Mage', type: 'skeleton', position: { x: -40, y: 0, z: 10 }, area: 'asura-kingdom', color: 0x0000ff, health: 50, attack: 20, defense: 5, xpReward: 45, aggressive: true },
  { id: 'dragon-1', name: 'Young Dragon', type: 'dragon', position: { x: 0, y: 0, z: -50 }, area: 'asura-kingdom', color: 0xff0000, health: 200, attack: 30, defense: 20, xpReward: 100, aggressive: true },
  { id: 'demon-1', name: 'Lesser Demon', type: 'demon', position: { x: 35, y: 0, z: -25 }, area: 'magic-city-sharia', color: 0x800080, health: 90, attack: 20, defense: 10, xpReward: 50, aggressive: true },
  { id: 'demon-2', name: 'Magic Demon', type: 'demon', position: { x: -35, y: 0, z: -25 }, area: 'magic-city-sharia', color: 0xff00ff, health: 80, attack: 25, defense: 8, xpReward: 55, aggressive: true },
  { id: 'wolf-2', name: 'Shadow Wolf', type: 'wolf', position: { x: 0, y: 0, z: 45 }, area: 'magic-city-sharia', color: 0x000000, health: 70, attack: 15, defense: 10, xpReward: 35, aggressive: true },
];

// ============================================
// 🎯 QUEST MARKERS
// ============================================
export const QUEST_MARKERS = [
  { id: 'buena-quest-1', name: 'Find Rudeus', position: { x: 10, y: 0, z: -5 }, area: 'buena-village', type: 'main', completed: false, questId: 'find-rudeus' },
  { id: 'buena-quest-2', name: 'Defeat Goblins', position: { x: 25, y: 0, z: 25 }, area: 'buena-village', type: 'side', completed: false, questId: 'defeat-goblins' },
  { id: 'buena-quest-3', name: 'Explore Village', position: { x: 0, y: 0, z: 10 }, area: 'buena-village', type: 'side', completed: false, questId: 'explore-village' },
  { id: 'asura-quest-1', name: 'Meet the King', position: { x: 0, y: 0, z: 0 }, area: 'asura-kingdom', type: 'main', completed: false, questId: 'meet-the-king' },
  { id: 'asura-quest-2', name: 'Defeat Skeleton Warriors', position: { x: 40, y: 0, z: 10 }, area: 'asura-kingdom', type: 'side', completed: false, questId: 'defeat-skeletons' },
  { id: 'asura-quest-3', name: 'Train at Grounds', position: { x: 0, y: 0, z: -40 }, area: 'asura-kingdom', type: 'side', completed: false, questId: 'train-at-grounds' },
  { id: 'magic-quest-1', name: 'Join the Guild', position: { x: 25, y: 0, z: 0 }, area: 'magic-city-sharia', type: 'main', completed: false, questId: 'join-the-guild' },
  { id: 'magic-quest-2', name: 'Defeat Demons', position: { x: 35, y: 0, z: -25 }, area: 'magic-city-sharia', type: 'side', completed: false, questId: 'defeat-demons' },
  { id: 'magic-quest-3', name: 'Visit the Tower', position: { x: 0, y: 0, z: -60 }, area: 'magic-city-sharia', type: 'side', completed: false, questId: 'visit-the-tower' },
];

// ============================================
// 👤 CHARACTER VISUAL PRESETS
// ============================================
export const CHARACTER_VISUALS = {
  rudeus: {
    head: { geometry: 'sphere', radius: 0.25, color: 0xffccaa, position: { x: 0, y: 1.05, z: 0 } },
    hair: { geometry: 'capsule', radius: 0.3, height: 0.4, color: 0x4a90d9, position: { x: 0, y: 1.2, z: 0 } },
    body: { geometry: 'capsule', radius: 0.3, height: 0.8, color: 0x4a90d9, position: { x: 0, y: 0.4, z: 0 } },
    sleeves: { left: { geometry: 'capsule', radius: 0.15, height: 0.6, color: 0x4a90d9, position: { x: -0.35, y: 0.7, z: 0 }, rotation: { x: 0, y: 0, z: Math.PI / 2 } }, right: { geometry: 'capsule', radius: 0.15, height: 0.6, color: 0x4a90d9, position: { x: 0.35, y: 0.7, z: 0 }, rotation: { x: 0, y: 0, z: Math.PI / 2 } } },
    staff: { geometry: 'capsule', radius: 0.05, height: 1.5, color: 0x8b4513, position: { x: 0.2, y: 0.2, z: 0 }, rotation: { x: 0.2, y: 0, z: 0 } },
    cameraOffset: { x: 0, y: 1.6, z: 3 },
  },
  warrior: {
    head: { geometry: 'sphere', radius: 0.25, color: 0xffccaa, position: { x: 0, y: 1.05, z: 0 } },
    hair: { geometry: 'capsule', radius: 0.3, height: 0.3, color: 0x8b4513, position: { x: 0, y: 1.2, z: 0 } },
    body: { geometry: 'capsule', radius: 0.35, height: 0.85, color: 0x808080, position: { x: 0, y: 0.425, z: 0 } },
    armor: { chest: { geometry: 'box', width: 0.5, height: 0.4, depth: 0.3, color: 0x696969, position: { x: 0, y: 0.6, z: 0 } }, shoulders: { geometry: 'box', width: 0.4, height: 0.2, depth: 0.3, color: 0x696969, position: { x: 0, y: 0.85, z: 0 } } },
    weapon: { geometry: 'box', width: 0.1, height: 0.8, depth: 0.3, color: 0xc0c0c0, position: { x: 0.25, y: 0.2, z: 0 }, rotation: { x: 0, y: 0, z: Math.PI / 4 } },
    cameraOffset: { x: 0, y: 1.7, z: 3 },
  },
  mage: {
    head: { geometry: 'sphere', radius: 0.25, color: 0xffccaa, position: { x: 0, y: 1.05, z: 0 } },
    hair: { geometry: 'capsule', radius: 0.3, height: 0.4, color: 0xffffff, position: { x: 0, y: 1.2, z: 0 } },
    body: { geometry: 'capsule', radius: 0.3, height: 0.8, color: 0x000080, position: { x: 0, y: 0.4, z: 0 } },
    robe: { geometry: 'cone', radius: 0.4, height: 0.6, color: 0x000080, position: { x: 0, y: 0.4, z: 0 } },
    staff: { geometry: 'capsule', radius: 0.05, height: 1.8, color: 0x8b4513, position: { x: 0.15, y: -0.3, z: 0 }, rotation: { x: 0.1, y: 0, z: 0 } },
    cameraOffset: { x: 0, y: 1.6, z: 3 },
  },
  rogue: {
    head: { geometry: 'sphere', radius: 0.23, color: 0xffccaa, position: { x: 0, y: 1.0, z: 0 } },
    hair: { geometry: 'capsule', radius: 0.25, height: 0.25, color: 0x228b22, position: { x: 0, y: 1.15, z: 0 } },
    body: { geometry: 'capsule', radius: 0.28, height: 0.75, color: 0x222222, position: { x: 0, y: 0.375, z: 0 } },
    cloak: { geometry: 'plane', width: 0.6, height: 0.8, color: 0x333333, position: { x: 0, y: 0.4, z: -0.3 }, rotation: { x: 0.3, y: 0, z: 0 } },
    daggerLeft: { geometry: 'box', width: 0.05, height: 0.2, depth: 0.3, color: 0xc0c0c0, position: { x: -0.2, y: 0.2, z: 0 }, rotation: { x: 0, y: 0, z: Math.PI / 4 } },
    daggerRight: { geometry: 'box', width: 0.05, height: 0.2, depth: 0.3, color: 0xc0c0c0, position: { x: 0.2, y: 0.2, z: 0 }, rotation: { x: 0, y: 0, z: -Math.PI / 4 } },
    cameraOffset: { x: 0, y: 1.5, z: 2.5 },
  },
  archer: {
    head: { geometry: 'sphere', radius: 0.25, color: 0xffccaa, position: { x: 0, y: 1.05, z: 0 } },
    hair: { geometry: 'capsule', radius: 0.3, height: 0.35, color: 0xdaa520, position: { x: 0, y: 1.2, z: 0 } },
    body: { geometry: 'capsule', radius: 0.3, height: 0.8, color: 0x228b22, position: { x: 0, y: 0.4, z: 0 } },
    quiver: { geometry: 'capsule', radius: 0.15, height: 0.4, color: 0x8b4513, position: { x: -0.2, y: 0.6, z: 0 }, rotation: { x: 0, y: 0, z: Math.PI / 2 } },
    bow: { geometry: 'box', width: 0.8, height: 0.05, depth: 0.1, color: 0x8b4513, position: { x: 0.3, y: 0.3, z: 0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 } },
    cameraOffset: { x: 0, y: 1.6, z: 4 },
  },
  healer: {
    head: { geometry: 'sphere', radius: 0.25, color: 0xffccaa, position: { x: 0, y: 1.05, z: 0 } },
    hair: { geometry: 'capsule', radius: 0.3, height: 0.45, color: 0xffd700, position: { x: 0, y: 1.225, z: 0 } },
    body: { geometry: 'capsule', radius: 0.3, height: 0.8, color: 0xffffff, position: { x: 0, y: 0.4, z: 0 } },
    robe: { geometry: 'cone', radius: 0.4, height: 0.65, color: 0xffffff, position: { x: 0, y: 0.4, z: 0 } },
    staff: { geometry: 'capsule', radius: 0.04, height: 1.6, color: 0xffd700, position: { x: 0.1, y: -0.2, z: 0 }, rotation: { x: 0.15, y: 0, z: 0 } },
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
