// ============================================
// 🎭 CHARACTER TYPES
// ============================================

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
  description: string;
  outfit: string;
  hairColor: number;
  hairStyle: string;
}

// ============================================
// 👤 PLAYER TYPE
// ============================================

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
  stats: {
    attack: number;
    defense: number;
    speed: number;
  };
  animation?: string;
  hairColor?: number;
  hairStyle?: string;
  eyeColor?: number;
}

// ============================================
// ⚔️ SKILL TYPE
// ============================================

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

// ============================================
// 🎒 EQUIPMENT TYPE
// ============================================

export interface Equipment {
  weapon?: string;
  armor?: string;
  accessory?: string;
}

// ============================================
// 🗺️ MAP TYPES
// ============================================

export interface MapObject {
  type: 'house' | 'tree' | 'path' | 'well' | 'fence' | 'sign' | 'npc' | 'rock' | 'bush';
  position: { x: number; y: number; z: number };
  rotation?: { x: number; y: number; z: number };
  scale?: { x: number; y: number; z: number };
  color?: number;
  size?: number;
  texture?: string;
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
  backgroundMusic?: string;
  ambientSounds?: string[];
}

// ============================================
// 🎮 GAME STATE
// ============================================

export interface GameState {
  players: Record<string, Player>;
  currentPlayerId: string;
  world: {
    time: number;
    weather: string;
    currentMap: string;
  };
  parties: Party[];
  quests: Quest[];
}

// ============================================
// 👥 PARTY SYSTEM
// ============================================

export interface Party {
  id: string;
  name: string;
  leaderId: string;
  memberIds: string[];
  createdAt: number;
}

// ============================================
// 📜 QUEST SYSTEM
// ============================================

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
  type: 'kill' | 'collect' | 'reach' | 'talk' | 'use';
  target: string;
  required: number;
  current: number;
  description?: string;
}

// ============================================
// 💬 CHAT MESSAGE
// ============================================

export interface ChatMessage {
  playerId: string;
  playerName: string;
  message: string;
  timestamp: number;
  type: 'global' | 'party' | 'whisper' | 'system';
}

// ============================================
// 📡 NETWORK MESSAGES
// ============================================

export interface ServerMessage {
  type: 'init' | 'update' | 'chat' | 'party' | 'quest' | 'error' | 'player-joined' | 'player-left' | 'player-moved' | 'player-action' | 'world-update';
  data: any;
}

export interface ClientMessage {
  type: 'join' | 'move' | 'action' | 'chat' | 'party' | 'quest' | 'save' | 'load';
  data: any;
  playerId?: string;
}

// ============================================
// 📍 POSITION UPDATE
// ============================================

export interface PositionUpdate {
  x: number;
  y: number;
  z: number;
  rotation?: { x: number; y: number; z: number };
  animation?: string;
}

// ============================================
// 👤 USER ACCOUNT
// ============================================

export interface UserAccount {
  id: string;
  username: string;
  password?: string; // Only for local storage, not sent to server
  character: CharacterType;
  hairColor: number;
  hairStyle: string;
  eyeColor: number;
  createdAt: number;
  lastLogin: number;
  playtime: number; // in seconds
  achievements: string[];
}

// ============================================
// 💾 SAVE DATA
// ============================================

export interface SaveData {
  id: string;
  name: string;
  player: Player;
  timestamp: number;
  mapId: string;
  position: { x: number; y: number; z: number };
  inventory: string[];
  equipment: Equipment;
  quests: string[];
  level: number;
  xp: number;
}

export interface SaveSlot {
  id: string;
  name: string;
  characterType: CharacterType;
  level: number;
  lastPlayed: number;
  previewImage?: string;
}

// ============================================
// 🎨 GRAPHIC SETTINGS
// ============================================

export interface GraphicSettings {
  useCellShading: boolean;
  cellShadingLevels: number;
  useOutlines: boolean;
  outlineColor: number;
  outlineWidth: number;
  rimLightColor: number;
  rimLightIntensity: number;
  saturation: number;
  useBloom: boolean;
  bloomIntensity: number;
  useDOF: boolean;
  useMotionBlur: boolean;
  shadowQuality: 'low' | 'medium' | 'high';
  textureQuality: 'low' | 'medium' | 'high';
}

// ============================================
// ⚙️ GAME SETTINGS
// ============================================

export interface GameSettings {
  graphics: GraphicSettings;
  audio: {
    masterVolume: number;
    musicVolume: number;
    sfxVolume: number;
    voiceVolume: number;
  };
  controls: {
    sensitivity: number;
    invertY: boolean;
    keybindings: Record<string, string>;
  };
  language: string;
}
