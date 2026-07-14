import type { CharacterPreset, Skill } from '../types';

export const CHARACTER_PRESETS: Record<string, CharacterPreset> = {
  warrior: { type: 'warrior', name: 'Warrior', baseHealth: 120, baseMana: 60, baseAttack: 15, baseDefense: 20, baseSpeed: 8, skills: ['sword-slash', 'shield-block', 'war-cry'], model: 'warrior', color: 0xff0000 },
  mage: { type: 'mage', name: 'Mage', baseHealth: 80, baseMana: 120, baseAttack: 25, baseDefense: 5, baseSpeed: 7, skills: ['fireball', 'ice-shield', 'teleport'], model: 'mage', color: 0x0000ff },
  rogue: { type: 'rogue', name: 'Rogue', baseHealth: 90, baseMana: 80, baseAttack: 20, baseDefense: 10, baseSpeed: 12, skills: ['backstab', 'stealth', 'poison-dagger'], model: 'rogue', color: 0x00ff00 },
  archer: { type: 'archer', name: 'Archer', baseHealth: 95, baseMana: 70, baseAttack: 18, baseDefense: 8, baseSpeed: 10, skills: ['arrow-rain', 'snipe', 'trap'], model: 'archer', color: 0xffff00 },
  healer: { type: 'healer', name: 'Healer', baseHealth: 100, baseMana: 150, baseAttack: 5, baseDefense: 12, baseSpeed: 9, skills: ['heal', 'revive', 'bless'], model: 'healer', color: 0xff00ff },
};

export const SKILLS: Record<string, Skill> = {
  'sword-slash': { id: 'sword-slash', name: 'Sword Slash', description: 'A powerful melee attack', type: 'attack', damage: 25, manaCost: 10, cooldown: 2000, range: 2 },
  'shield-block': { id: 'shield-block', name: 'Shield Block', description: 'Reduces incoming damage', type: 'defense', manaCost: 15, cooldown: 5000, range: 1 },
  'war-cry': { id: 'war-cry', name: 'War Cry', description: 'Increases attack power temporarily', type: 'utility', manaCost: 20, cooldown: 10000, range: 10 },
  'fireball': { id: 'fireball', name: 'Fireball', description: 'Launches a ball of fire at enemies', type: 'attack', damage: 40, manaCost: 25, cooldown: 3000, range: 15 },
  'ice-shield': { id: 'ice-shield', name: 'Ice Shield', description: 'Creates a protective ice barrier', type: 'defense', manaCost: 20, cooldown: 8000, range: 1 },
  'teleport': { id: 'teleport', name: 'Teleport', description: 'Instantly move to a nearby location', type: 'utility', manaCost: 30, cooldown: 15000, range: 20 },
  'backstab': { id: 'backstab', name: 'Backstab', description: 'Deals massive damage from behind', type: 'attack', damage: 50, manaCost: 20, cooldown: 5000, range: 1 },
  'stealth': { id: 'stealth', name: 'Stealth', description: 'Become invisible for a short time', type: 'utility', manaCost: 15, cooldown: 12000, range: 1 },
  'poison-dagger': { id: 'poison-dagger', name: 'Poison Dagger', description: 'Applies damage over time', type: 'attack', damage: 15, manaCost: 10, cooldown: 2000, range: 10 },
  'arrow-rain': { id: 'arrow-rain', name: 'Arrow Rain', description: 'Fires multiple arrows at once', type: 'attack', damage: 20, manaCost: 25, cooldown: 4000, range: 20 },
  'snipe': { id: 'snipe', name: 'Snipe', description: 'A precise long-range shot', type: 'attack', damage: 60, manaCost: 35, cooldown: 8000, range: 30 },
  'trap': { id: 'trap', name: 'Trap', description: 'Places a damaging trap on the ground', type: 'utility', manaCost: 20, cooldown: 10000, range: 5 },
  'heal': { id: 'heal', name: 'Heal', description: 'Restores health to a target', type: 'heal', healAmount: 40, manaCost: 25, cooldown: 3000, range: 10 },
  'revive': { id: 'revive', name: 'Revive', description: 'Brings a fallen ally back to life', type: 'heal', healAmount: 100, manaCost: 50, cooldown: 30000, range: 5 },
  'bless': { id: 'bless', name: 'Bless', description: 'Increases ally stats temporarily', type: 'utility', manaCost: 30, cooldown: 15000, range: 10 },
};

export const GAME_CONSTANTS = {
  WORLD_SIZE: 1000,
  GRAVITY: -9.8,
  PLAYER_SPEED: 0.2,
  PLAYER_HEIGHT: 1.8,
  PLAYER_RADIUS: 0.5,
  CAMERA_OFFSET: { x: 0, y: 2, z: 5 },
  MAX_PLAYERS: 50,
  TICK_RATE: 30,
};

export const WORLD_SETTINGS = {
  groundColor: 0x1a5fb4,
  skyColor: 0x87ceeb,
  fogColor: 0x87ceeb,
  fogDensity: 0.0005,
  ambientLight: 0x404040,
  directionalLight: 0xffffff,
};