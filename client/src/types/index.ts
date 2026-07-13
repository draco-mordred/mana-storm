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
  skills: Skill[];
  equipment: Equipment;
}

export type CharacterType = 'warrior' | 'mage' | 'rogue' | 'archer' | 'healer';

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
  world: { time: number; weather: string };
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
  reward: { gold: number; xp: number; items?: string[] };
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