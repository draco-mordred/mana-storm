const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

// ============================================
// ✅ MANA STORM GAME SERVER
// ============================================
// Socket.io Multiplayer Game Server
// Features: Character customization, skills, parties, quests, user accounts
// ============================================

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// ============================================
// 👤 USER ACCOUNTS (In-memory storage for demo)
// ============================================
const userAccounts = new Map(); // username -> { password, character, createdAt, lastLogin }
const saveData = new Map(); // userId -> save data

// Create user account
function createUser(username, password, characterType) {
  if (userAccounts.has(username)) {
    return { success: false, error: 'Username already exists' };
  }
  
  const userId = uuidv4();
  userAccounts.set(username, {
    id: userId,
    password,
    character: characterType,
    createdAt: Date.now(),
    lastLogin: Date.now(),
    playtime: 0,
    achievements: [],
  });
  
  return { success: true, userId };
}

// Authenticate user
function authenticateUser(username, password) {
  const user = userAccounts.get(username);
  if (!user || user.password !== password) {
    return { success: false, error: 'Invalid username or password' };
  }
  
  user.lastLogin = Date.now();
  return { success: true, userId: user.id, character: user.character };
}

// Save game data
function saveGame(userId, data) {
  saveData.set(userId, {
    ...data,
    timestamp: Date.now(),
  });
  return { success: true };
}

// Load game data
function loadGame(userId) {
  return saveData.get(userId) || null;
}

// Get user save slots
function getSaveSlots(userId) {
  const userSaves = Array.from(saveData.entries())
    .filter(([id]) => id.startsWith(userId))
    .map(([id, data]) => ({
      id,
      name: data.name || 'Untitled Save',
      characterType: data.characterType,
      level: data.level || 1,
      lastPlayed: data.timestamp,
    }));
  return userSaves;
}

// ============================================
// 🎭 CHARACTER PRESETS (Mana Storm)
// ============================================
const CHARACTER_PRESETS = {
  // Rudeus Greyrat - Default character
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
    color: 0x4a90e2,
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
  },
};

// ============================================
// 🎯 SKILLS DATABASE
// ============================================
const SKILLS = {
  // Rudeus Skills
  'magic-missile': { id: 'magic-missile', name: 'Magic Missile', type: 'attack', damage: 30, manaCost: 15, cooldown: 1500, range: 20 },
  'water-bullet': { id: 'water-bullet', name: 'Water Bullet', type: 'attack', damage: 35, manaCost: 20, cooldown: 2000, range: 15 },
  'fire-ball': { id: 'fire-ball', name: 'Fire Ball', type: 'attack', damage: 40, manaCost: 25, cooldown: 3000, range: 25 },
  
  // Warrior Skills
  'sword-slash': { id: 'sword-slash', name: 'Sword Slash', type: 'attack', damage: 25, manaCost: 10, cooldown: 2000, range: 2 },
  'shield-block': { id: 'shield-block', name: 'Shield Block', type: 'defense', manaCost: 15, cooldown: 5000, range: 1 },
  'war-cry': { id: 'war-cry', name: 'War Cry', type: 'utility', manaCost: 20, cooldown: 10000, range: 10 },
  
  // Mage Skills
  'fireball': { id: 'fireball', name: 'Fireball', type: 'attack', damage: 40, manaCost: 25, cooldown: 3000, range: 15 },
  'ice-shield': { id: 'ice-shield', name: 'Ice Shield', type: 'defense', manaCost: 20, cooldown: 8000, range: 1 },
  'teleport': { id: 'teleport', name: 'Teleport', type: 'utility', manaCost: 30, cooldown: 15000, range: 20 },
  
  // Rogue Skills
  'backstab': { id: 'backstab', name: 'Backstab', type: 'attack', damage: 50, manaCost: 20, cooldown: 5000, range: 1 },
  'stealth': { id: 'stealth', name: 'Stealth', type: 'utility', manaCost: 15, cooldown: 12000, range: 1 },
  'poison-dagger': { id: 'poison-dagger', name: 'Poison Dagger', type: 'attack', damage: 15, manaCost: 10, cooldown: 2000, range: 10 },
  
  // Archer Skills
  'arrow-rain': { id: 'arrow-rain', name: 'Arrow Rain', type: 'attack', damage: 20, manaCost: 25, cooldown: 4000, range: 20 },
  'snipe': { id: 'snipe', name: 'Snipe', type: 'attack', damage: 60, manaCost: 35, cooldown: 8000, range: 30 },
  'trap': { id: 'trap', name: 'Trap', type: 'utility', manaCost: 20, cooldown: 10000, range: 5 },
  
  // Healer Skills
  'heal': { id: 'heal', name: 'Heal', type: 'heal', healAmount: 40, manaCost: 25, cooldown: 3000, range: 10 },
  'revive': { id: 'revive', name: 'Revive', type: 'heal', healAmount: 100, manaCost: 50, cooldown: 30000, range: 5 },
  'bless': { id: 'bless', name: 'Bless', type: 'utility', manaCost: 30, cooldown: 15000, range: 10 },
};

// ============================================
// 🌍 GAME WORLD STATE
// ============================================
const gameState = {
  players: {},
  parties: [],
  quests: [],
  world: { time: 0, weather: 'clear', currentMap: 'buena-village' },
};

// ============================================
// ⚔️ PARTY SYSTEM
// ============================================
function createParty(leaderId, name) {
  const party = { id: uuidv4(), name: name || `Party_${Date.now()}`, leaderId, memberIds: [leaderId], createdAt: Date.now() };
  gameState.parties.push(party);
  return party;
}

function joinParty(partyId, playerId) {
  const party = gameState.parties.find(p => p.id === partyId);
  if (party && !party.memberIds.includes(playerId)) {
    party.memberIds.push(playerId);
    return true;
  }
  return false;
}

function leaveParty(partyId, playerId) {
  const partyIndex = gameState.parties.findIndex(p => p.id === partyId);
  if (partyIndex !== -1) {
    const party = gameState.parties[partyIndex];
    party.memberIds = party.memberIds.filter(id => id !== playerId);
    if (party.memberIds.length === 0) gameState.parties.splice(partyIndex, 1);
    else if (party.leaderId === playerId) party.leaderId = party.memberIds[0];
    return true;
  }
  return false;
}

// ============================================
// 📜 QUEST SYSTEM
// ============================================
const QUESTS = [
  { id: 'quest-1', title: 'Defeat 10 Monsters', description: 'Clear the monster infestation in the Forest of Whispers', objectives: [{ type: 'kill', target: 'goblin', required: 10, current: 0 }], reward: { gold: 500, xp: 1000 }, status: 'available' },
  { id: 'quest-2', title: 'Collect Rare Herbs', description: 'Gather medicinal herbs for the village healer', objectives: [{ type: 'collect', target: 'mana-herb', required: 5, current: 0 }], reward: { gold: 300, xp: 800 }, status: 'available' },
  { id: 'quest-3', title: 'Escort the Merchant', description: 'Protect the merchant from bandits on the road to Capital City', objectives: [{ type: 'reach', target: 'capital-city', required: 1, current: 0 }], reward: { gold: 800, xp: 1500, items: ['merchant-token'] }, status: 'available' },
];

// ============================================
// 👤 CREATE PLAYER
// ============================================
function createPlayer(name, characterType, userId = null) {
  const preset = CHARACTER_PRESETS[characterType] || CHARACTER_PRESETS.rudeus;
  const skills = preset.skills.map(skillId => SKILLS[skillId]);
  
  // Get spawn point from current map
  const spawnPoints = [
    { x: Math.random() * 20 - 10, y: 0, z: Math.random() * 20 - 10 },
  ];
  const spawnPoint = spawnPoints[Math.floor(Math.random() * spawnPoints.length)];
  
  return {
    id: userId || uuidv4(),
    name: name || `Player_${Date.now()}`,
    character: characterType,
    position: { ...spawnPoint },
    rotation: { x: 0, y: 0, z: 0 },
    health: preset.baseHealth,
    maxHealth: preset.baseHealth,
    mana: preset.baseMana,
    maxMana: preset.baseMana,
    level: 1,
    xp: 0,
    skills,
    equipment: {},
    partyId: null,
    activeQuests: [],
    stats: { attack: preset.baseAttack, defense: preset.baseDefense, speed: preset.baseSpeed },
    lastAction: 0,
    cooldowns: {},
    animation: 'idle',
  };
}

// ============================================
// 🎮 SOCKET.IO CONNECTION HANDLING
// ============================================
io.on('connection', (socket) => {
  console.log(`✅ Player connected: ${socket.id}`);

  // ==========================================
  // 👤 USER ACCOUNT HANDLERS
  // ==========================================
  socket.on('account:register', ({ username, password, characterType }) => {
    const result = createUser(username, password, characterType);
    if (result.success) {
      socket.emit('account:registered', { success: true, userId: result.userId });
    } else {
      socket.emit('account:registered', { success: false, error: result.error });
    }
  });

  socket.on('account:login', ({ username, password }) => {
    const result = authenticateUser(username, password);
    if (result.success) {
      socket.emit('account:logged-in', { success: true, userId: result.userId, character: result.character });
    } else {
      socket.emit('account:logged-in', { success: false, error: result.error });
    }
  });

  // ==========================================
  // 💾 SAVE/LOAD HANDLERS
  // ==========================================
  socket.on('save:request', ({ userId, data }) => {
    const result = saveGame(userId, data);
    socket.emit('save:response', result);
  });

  socket.on('load:request', ({ userId }) => {
    const data = loadGame(userId);
    socket.emit('load:response', { success: true, data: data || null });
  });

  socket.on('slots:request', ({ userId }) => {
    const slots = getSaveSlots(userId);
    socket.emit('slots:response', { success: true, slots });
  });

  // ==========================================
  // 🎮 PLAYER JOIN
  // ==========================================
  socket.on('join', ({ name, characterType, userId }) => {
    console.log(`🎮 Player joined: ${name} as ${characterType}`);
    
    // Create player
    const player = createPlayer(name, characterType, userId);
    gameState.players[socket.id] = player;
    
    // Send initial game state to new player
    socket.emit('init', {
      currentPlayerId: socket.id,
      players: gameState.players,
      parties: gameState.parties,
      quests: gameState.quests,
      world: gameState.world,
    });
    
    // Notify all players about new player
    socket.broadcast.emit('player-joined', player);
    
    // Send update to all players
    io.emit('update', { players: gameState.players });
  });

  // ==========================================
  // 🏃 PLAYER MOVEMENT
  // ==========================================
  socket.on('move', ({ position, animation }) => {
    if (gameState.players[socket.id]) {
      const player = gameState.players[socket.id];
      
      // Update position with validation
      if (position) {
        const worldSize = 500;
        player.position.x = Math.max(-worldSize, Math.min(worldSize, position.x));
        player.position.y = Math.max(0, Math.min(100, position.y));
        player.position.z = Math.max(-worldSize, Math.min(worldSize, position.z));
      }
      
      // Update animation
      if (animation) {
        player.animation = animation;
      }
      
      // Broadcast movement to all players
      io.emit('player-moved', { playerId: socket.id, player: gameState.players[socket.id] });
    }
  });

  // ==========================================
  // ⚔️ PLAYER ACTIONS
  // ==========================================
  socket.on('action', ({ type, skillId, targetId }) => {
    const player = gameState.players[socket.id];
    if (!player) return;

    const now = Date.now();
    const skill = player.skills.find(s => s.id === skillId);
    
    if (!skill) {
      socket.emit('error', 'Skill not found');
      return;
    }

    // Check cooldown
    if (player.cooldowns[skillId] && player.cooldowns[skillId] > now) {
      socket.emit('error', `Skill on cooldown. Wait ${Math.ceil((player.cooldowns[skillId] - now) / 1000)}s`);
      return;
    }

    // Check mana
    if (player.mana < skill.manaCost) {
      socket.emit('error', 'Not enough mana');
      return;
    }

    // Consume mana
    player.mana -= skill.manaCost;
    
    // Set cooldown
    player.cooldowns[skillId] = now + skill.cooldown;
    
    // Process action based on type
    switch (type) {
      case 'attack':
        if (targetId && gameState.players[targetId]) {
          const target = gameState.players[targetId];
          const damage = skill.damage || 0;
          
          target.health -= damage;
          if (target.health < 0) target.health = 0;
          
          console.log(`⚔️  ${player.name} hit ${target.name} for ${damage} damage!`);
          
          // Check if target died
          if (target.health <= 0) {
            io.emit('player-defeated', { attackerId: socket.id, targetId });
          }
        }
        break;

      case 'heal':
        if (targetId && gameState.players[targetId]) {
          const target = gameState.players[targetId];
          const healAmount = skill.healAmount || 0;
          
          target.health = Math.min(target.maxHealth, target.health + healAmount);
          console.log(`💚 ${player.name} healed ${target.name} for ${healAmount} HP!`);
        }
        break;

      case 'jump':
        // Jump action - handled client-side
        break;

      default:
        console.log(`✨ ${player.name} used ${skill.name}`);
    }

    // Broadcast action to all players
    io.emit('player-action', {
      playerId: socket.id,
      action: type,
      skillId,
      targetId,
    });

    // Send state update
    io.emit('update', { players: gameState.players });
  });

  // ==========================================
  // 💬 CHAT MESSAGES
  // ==========================================
  socket.on('chat', ({ message, type = 'global', targetId }) => {
    const player = gameState.players[socket.id];
    if (!player) return;

    const chatMessage = {
      playerId: socket.id,
      playerName: player.name,
      message,
      timestamp: Date.now(),
      type,
    };

    switch (type) {
      case 'party':
        // Send to party members only
        const party = gameState.parties.find(p => p.memberIds.includes(socket.id));
        if (party) {
          party.memberIds.forEach(memberId => {
            io.to(memberId).emit('chat', chatMessage);
          });
        }
        break;
      case 'whisper':
        // Private message
        if (targetId) {
          socket.to(targetId).emit('chat', chatMessage);
          socket.emit('chat', chatMessage); // Echo back to sender
        }
        break;
      default:
        // Global chat
        io.emit('chat', chatMessage);
    }
  });

  // ==========================================
  // 👥 PARTY SYSTEM HANDLERS
  // ==========================================
  socket.on('party:create', ({ name }) => {
    const player = gameState.players[socket.id];
    if (!player || player.partyId) {
      socket.emit('error', 'Already in party');
      return;
    }

    const party = createParty(socket.id, name);
    player.partyId = party.id;
    socket.emit('party-created', party);
    io.emit('update', { parties: gameState.parties, players: gameState.players });
  });

  socket.on('party:join', ({ partyId }) => {
    const player = gameState.players[socket.id];
    if (!player || player.partyId) {
      socket.emit('error', 'Already in party');
      return;
    }

    if (joinParty(partyId, socket.id)) {
      player.partyId = partyId;
      socket.emit('party-joined', { partyId });
      io.emit('update', { parties: gameState.parties, players: gameState.players });
    } else {
      socket.emit('error', 'Failed to join party');
    }
  });

  socket.on('party:leave', () => {
    const player = gameState.players[socket.id];
    if (!player || !player.partyId) return;

    if (leaveParty(player.partyId, socket.id)) {
      player.partyId = null;
      socket.emit('party-left');
      io.emit('update', { parties: gameState.parties, players: gameState.players });
    }
  });

  // ==========================================
  // 📜 QUEST SYSTEM HANDLERS
  // ==========================================
  socket.on('quest:accept', ({ questId }) => {
    const player = gameState.players[socket.id];
    if (!player) return;

    const quest = QUESTS.find(q => q.id === questId);
    if (!quest) {
      socket.emit('error', 'Quest not found');
      return;
    }

    if (player.activeQuests.includes(questId)) {
      socket.emit('error', 'Quest already accepted');
      return;
    }

    player.activeQuests.push(questId);
    socket.emit('quest-accepted', quest);
    io.emit('update', { players: gameState.players });
  });

  socket.on('quest:complete', ({ questId }) => {
    const player = gameState.players[socket.id];
    if (!player) return;

    const questIndex = player.activeQuests.indexOf(questId);
    if (questIndex === -1) return;

    const quest = QUESTS.find(q => q.id === questId);
    if (!quest) return;

    // Check if all objectives are complete
    const allComplete = quest.objectives.every(obj => obj.current >= obj.required);
    
    if (!allComplete) {
      socket.emit('error', 'Quest objectives not complete');
      return;
    }

    // Remove from active quests
    player.activeQuests.splice(questIndex, 1);
    
    // Give rewards
    player.xp += quest.reward.xp;
    
    // Check for level up
    if (player.xp >= player.level * 1000) {
      player.level++;
      player.xp = 0;
      player.maxHealth += 20;
      player.health = player.maxHealth;
      player.maxMana += 10;
      player.mana = player.maxMana;
    }

    quest.status = 'completed';
    socket.emit('quest-completed', { questId, rewards: quest.reward });
    io.emit('update', { players: gameState.players, quests: QUESTS });
  });

  // ==========================================
  // ❌ PLAYER DISCONNECT
  // ==========================================
  socket.on('disconnect', () => {
    console.log(`❌ Player disconnected: ${socket.id}`);
    
    // Remove player from game state
    const player = gameState.players[socket.id];
    if (player) {
      // Remove from party
      if (player.partyId) {
        leaveParty(player.partyId, socket.id);
      }
      
      delete gameState.players[socket.id];
      
      // Notify all players
      io.emit('player-left', socket.id);
      io.emit('update', { players: gameState.players, parties: gameState.parties });
    }
  });
});

// ============================================
// 🌐 HTTP SERVER
// ============================================
const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => {
  res.json({
    name: 'Mana Storm Game Server',
    version: '2.0.0',
    status: 'running',
    players: Object.keys(gameState.players).length,
    uptime: process.uptime(),
    currentMap: gameState.world.currentMap,
  });
});

app.get('/status', (req, res) => {
  res.json({
    players: Object.keys(gameState.players).length,
    parties: gameState.parties.length,
    quests: gameState.quests.length,
    worldTime: gameState.world.time,
    currentMap: gameState.world.currentMap,
  });
});

// ============================================
// ⚡ START SERVER
// ============================================
httpServer.listen(PORT, () => {
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║                                                           ║');
  console.log('║   🎮 Mana Storm Game Server v2.0                        ║');
  console.log('║                                                           ║');
  console.log(`║   📍 Server running on: http://localhost:${PORT}           ║`);
  console.log('║   🎯 Features: Multiplayer, Skills, Parties, Quests      ║');
  console.log('║              User Accounts, Save/Load System              ║');
  console.log('║                                                           ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
});

// ============================================
// 🎒 GAME LOOP (World Updates)
// ============================================
setInterval(() => {
  // Update world time
  gameState.world.time += 0.1;
  
  // Regenerate mana for all players
  Object.values(gameState.players).forEach(player => {
    if (player.mana < player.maxMana) {
      player.mana += 0.5;
      if (player.mana > player.maxMana) player.mana = player.maxMana;
    }
  });
  
  // Broadcast periodic updates
  io.emit('world-update', gameState.world);
}, 1000);

// ============================================
// 🛡️ ERROR HANDLING
// ============================================
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('❌ Unhandled Rejection:', reason);
});

module.exports = { app, httpServer, io, gameState, userAccounts, saveData };
