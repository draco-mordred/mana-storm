// Game Types
export interface Player {
  id: string;
  name: string;
  character: CharacterType;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  level: number;
  xp: number;
  skills: Skill[];
  equipment: Equipment;
  partyId: string | null;
  activeQuests: string[];
}

export type CharacterType = 
  | 'rudeus'
  | 'warrior'
  | 'mage'
  | 'rogue'
  | 'archer'
  | 'healer';

export interface CharacterPreset {
  type: CharacterType;
  name: string;
  baseHealth: number;
  baseMana: number;
  baseAttack: number;
  baseDefense: number;
  baseSpeed: number;
  skills: string[];
  model: string;
  color: number;
  description?: string;
  outfit?: string;
  hairColor?: number;
  hairStyle?: string;
  age?: string;
}

export interface CharacterVisual {
  head?: { geometry: string; radius?: number; color: number; position: { x: number; y: number; z: number } };
  hair?: { geometry: string; radius?: number; height?: number; color: number; position: { x: number; y: number; z: number } };
  body?: { geometry: string; radius?: number; height?: number; color: number; position: { x: number; y: number; z: number } };
  [key: string]: any;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  type: 'attack' | 'defense' | 'heal' | 'utility';
  damage?: number;
  healAmount?: number;
  manaCost: number;
  cooldown: number;
  range: number;
}

export interface Equipment {
  weapon?: string;
  armor?: string;
  accessory?: string;
}

export interface GameState {
  players: Record<string, Player>;
  currentPlayerId: string;
  world: {
    time: number;
    weather: string;
  };
  parties: Party[];
  quests: Quest[];
}

export interface Party {
  id: string;
  name: string;
  leaderId: string;
  memberIds: string[];
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  objectives: QuestObjective[];
  reward: {
    gold: number;
    xp: number;
    items?: string[];
  };
  status: 'available' | 'in-progress' | 'completed';
}

export interface QuestObjective {
  type: 'kill' | 'collect' | 'reach' | 'talk';
  target: string;
  required: number;
  current: number;
}

export interface ServerMessage {
  type: 'init' | 'update' | 'chat' | 'party' | 'quest' | 'error';
  data: any;
}

export interface ClientMessage {
  type: 'join' | 'move' | 'action' | 'chat' | 'party' | 'quest';
  data: any;
  playerId?: string;
}

export interface PositionUpdate {
  x: number;
  y: number;
  z: number;
  rotation?: { x: number; y: number; z: number };
  animation?: string;
}

// User Account Types
export interface UserAccount {
  id: string;
  username: string;
  email?: string;
  passwordHash?: string; // Only for server-side
  characterType: CharacterType;
  characterName: string;
  level: number;
  xp: number;
  lastLogin: number;
  createdAt: number;
  savedGames: SavedGame[];
}

export interface SavedGame {
  id: string;
  characterType: CharacterType;
  characterName: string;
  position: { x: number; y: number; z: number };
  level: number;
  xp: number;
  health: number;
  mana: number;
  skills: string[];
  equipment: Equipment;
  activeQuests: string[];
  timestamp: number;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  email?: string;
  characterName: string;
  characterType: CharacterType;
}
