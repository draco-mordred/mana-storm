import type { GameMap, MapObject, CharacterVisual, UserAccount } from '../utils/constants';

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
  animation?: string;
}

export type CharacterType = 'rudeus' | 'warrior' | 'mage' | 'rogue' | 'archer' | 'healer';

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
  hairColor?: number;
  outfit?: string;
  weapon?: string;
  description?: string;
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
  animation?: string;
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
  currentMap: string;
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
  type: 'init' | 'update' | 'chat' | 'party' | 'quest' | 'error' | 'player-joined' | 'player-left' | 'player-moved' | 'player-action' | 'world-update';
  data: any;
}

export interface ClientMessage {
  type: 'join' | 'move' | 'action' | 'chat' | 'party' | 'quest' | 'register' | 'login' | 'save' | 'load';
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

// Network Types
export interface SocketEvent {
  type: string;
  [key: string]: any;
}

// UI Types
export interface MenuState {
  currentScreen: 'main' | 'login' | 'register' | 'character-select' | 'settings';
  error?: string;
  loading?: boolean;
}

export interface LoginForm {
  username: string;
  password: string;
}

export interface RegisterForm extends LoginForm {
  email: string;
  characterName: string;
  characterType: CharacterType;
}

// Save/Load Types
export interface SaveGameData {
  playerId: string;
  playerName: string;
  characterType: CharacterType;
  position: { x: number; y: number; z: number };
  map: string;
  timestamp: number;
  level: number;
  xp: number;
  health: number;
  mana: number;
  equipment: Equipment;
  inventory: string[];
  questProgress: Record<string, number>;
}

// Authentication Types
export interface AuthState {
  isAuthenticated: boolean;
  user?: UserAccount;
  token?: string;
  loading: boolean;
  error?: string;
}

export interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<boolean>;
  register: (form: RegisterForm) => Promise<boolean>;
  logout: () => void;
  saveGame: (data: SaveGameData) => Promise<boolean>;
  loadGame: (playerId: string) => Promise<SaveGameData | null>;
}
