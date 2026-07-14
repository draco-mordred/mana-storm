const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

// ============================================
// 👤 ACCOUNT SYSTEM
// ============================================
const accounts = new Map();
const loggedInSockets = new Map();

app.post('/api/register', (req, res) => {
  try {
    const { username, password, email, characterName, characterType } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    if (accounts.has(username)) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    const account = {
      id: uuidv4(),
      username,
      password,
      email: email || null,
      characterName: characterName || username,
      characterType: characterType || 'rudeus',
      createdAt: Date.now(),
      lastLogin: null,
      savedGames: [],
    };
    accounts.set(username, account);
    res.json({
      success: true,
      message: 'Account created successfully',
      account: { id: account.id, username: account.username, characterName: account.characterName, characterType: account.characterType },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/login', (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    const account = accounts.get(username);
    if (!account) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    if (account.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    account.lastLogin = Date.now();
    res.json({
      success: true,
      message: 'Login successful',
      account: { id: account.id, username: account.username, characterName: account.characterName, characterType: account.characterType },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/save-game', (req, res) => {
  try {
    const { username, gameData } = req.body;
    if (!username || !gameData) {
      return res.status(400).json({ error: 'Username and game data are required' });
    }
    const account = accounts.get(username);
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }
    const existingIndex = account.savedGames.findIndex(g => g.id === gameData.id);
    if (existingIndex !== -1) {
      account.savedGames[existingIndex] = gameData;
    } else {
      account.savedGames.push(gameData);
    }
    res.json({ success: true, message: 'Game saved successfully' });
  } catch (error) {
    console.error('Save game error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/load-games/:username', (req, res) => {
  try {
    const { username } = req.params;
    const account = accounts.get(username);
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }
    res.json({ success: true, games: account.savedGames });
  } catch (error) {
    console.error('Load games error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/delete-game/:username/:gameId', (req, res) => {
  try {
    const { username, gameId } = req.params;
    const account = accounts.get(username);
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }
    account.savedGames = account.savedGames.filter(g => g.id !== gameId);
    res.json({ success: true, message: 'Game deleted successfully' });
  } catch (error) {
    console.error('Delete game error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// 🎭 CHARACTER PRESETS
// ============================================
const CHARACTER_PRESETS = {
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
  },
};

// ============================================
// 🎯 SKILLS DATABASE
// ============================================
const SKILLS = {
  'fireball': { id: 'fireball', name: 'Fireball', type: 'attack', damage: 40, manaCost: 25, cooldown: 3000, range: 15 },
  'ice-shield': { id: 'ice-shield', name: 'Ice Shield', type: 'defense', manaCost: 20, cooldown: 8000, range: 1 },
  'heal': { id: 'heal', name: 'Heal', type: 'heal', healAmount: 40, manaCost: 25, cooldown: 3000, range: 10 },
  'teleport': { id: 'teleport', name: 'Teleport', type: 'utility', manaCost: 30, cooldown: 15000, range: 20 },
  'sword-slash': { id: 'sword-slash', name: 'Sword Slash', type: 'attack', damage: 25, manaCost: 10, cooldown: 2000, range: 2 },
  'shield-block': { id: 'shield-block', name: 'Shield Block', type: 'defense', manaCost: 15, cooldown: 5000, range: 1 },
  'war-cry': { id: 'war-cry', name: 'War Cry', type: 'utility', manaCost: 20, cooldown: 10000, range: 10 },
  'ground-stomp': { id: 'ground-stomp', name: 'Ground Stomp', type: 'utility', manaCost: 25, cooldown: 12000, range: 8 },
  'lightning-bolt': { id: 'lightning-bolt', name: 'Lightning Bolt', type: 'attack', damage: 50, manaCost: 35, cooldown: 4000, range: 20 },
  'backstab': { id: 'backstab', name: 'Backstab', type: 'attack', damage: 50, manaCost: 20, cooldown: 5000, range: 1 },
  'stealth': { id: 'stealth', name: 'Stealth', type: 'utility', manaCost: 15, cooldown: 12000, range: 1 },
  'poison-dagger': { id: 'poison-dagger', name: 'Poison Dagger', type: 'attack', damage: 15, manaCost: 10, cooldown: 2000, range: 10 },
  'smoke-bomb': { id: 'smoke-bomb', name: 'Smoke Bomb', type: 'utility', manaCost: 20, cooldown: 15000, range: 5 },
  'arrow-rain': { id: 'arrow-rain', name: 'Arrow Rain', type: 'attack', damage: 20, manaCost: 25, cooldown: 4000, range: 20 },
  'snipe': { id: 'snipe', name: 'Snipe', type: 'attack', damage: 60, manaCost: 35, cooldown: 8000, range: 30 },
  'trap': { id: 'trap', name: 'Trap', type: 'utility', manaCost: 20, cooldown: 10000, range: 5 },
  'piercing-shot': { id: 'piercing-shot', name: 'Piercing Shot', type: 'attack', damage: 35, manaCost: 30, cooldown: 6000, range: 25 },
  'revive': { id: 'revive', name: 'Revive', type: 'heal', healAmount: 100, manaCost: 50, cooldown: 30000, range: 5 },
  'bless': { id: 'bless', name: 'Bless', type: 'utility', manaCost: 30, cooldown: 15000, range: 10 },
  'cleanse': { id: 'cleanse', name: 'Cleanse', type: 'utility', manaCost: 25, cooldown: 10000, range: 8 },
};

// ============================================
// 🌍 AREA DEFINITIONS
// ============================================
const AREAS = {
  'buena-village': { name: 'Buena Village', spawnPoint: { x: 0, y: 0, z: 0 } },
  'asura-kingdom': { name: 'Asura Kingdom', spawnPoint: { x: 0, y: 0, z: 0 } },
  'magic-city-sharia': { name: 'Magic City Sharia', spawnPoint: { x: 0, y: 0, z: 0 } },
};

// ============================================
// 🌍 GAME WORLD STATE
// ============================================
const gameState = {
  players: {},
  parties: [],
  quests: [],
  world: { time: 0, weather: 'clear' },
};

// ============================================
// ⚔️ PARTY SYSTEM
// ============================================
function createParty(leaderId, name) {
  const party = { id: uuidv4(), name: name || 'Party_' + Date.now(), leaderId, memberIds: [leaderId], createdAt: Date.now() };
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
  { id: 'quest-1', title: 'Defeat 10 Monsters', description: 'Clear the monster infestation', objectives: [{ type: 'kill', target: 'goblin', required: 10, current: 0 }], reward: { gold: 500, xp: 1000 }, status: 'available' },
  { id: 'quest-2', title: 'Collect Rare Herbs', description: 'Gather medicinal herbs', objectives: [{ type: 'collect', target: 'mana-herb', required: 5, current: 0 }, { type: 'collect', target: 'healing-root', required: 3, current: 0 }], reward: { gold: 300, xp: 800 }, status: 'available' },
  { id: 'quest-3', title: 'Escort the Merchant', description: 'Protect the merchant', objectives: [{ type: 'reach', target: 'capital-city', required: 1, current: 0 }], reward: { gold: 800, xp: 1500, items: ['merchant-token'] }, status: 'available' },
];

// ============================================
// 👤 CREATE PLAYER
// ============================================
function createPlayer(name, characterType, area = 'buena-village') {
  const preset = CHARACTER_PRESETS[characterType] || CHARACTER_PRESETS.rudeus;
  const skills = preset.skills.map(skillId => SKILLS[skillId]);
  const spawnPoint = AREAS[area]?.spawnPoint || { x: 0, y: 0, z: 0 };
  
  return {
    id: uuidv4(),
    name: name || 'Player_' + Date.now(),
    character: characterType,
    position: { x: spawnPoint.x, y: 0, z: spawnPoint.z },
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
    direction: 0,
    area: area,
  };
}

// Helper to get default skill for character type
function getDefaultSkill(characterType) {
  const preset = CHARACTER_PRESETS[characterType] || CHARACTER_PRESETS.rudeus;
  if (preset.skills && preset.skills.length > 0) {
    return SKILLS[preset.skills[0]];
  }
  // Fallback to a basic attack
  return { id: 'basic-attack', name: 'Basic Attack', type: 'attack', damage: 10, manaCost: 0, cooldown: 1000, range: 2 };
}

// ============================================
// 🎮 SOCKET.IO CONNECTION HANDLING
// ============================================
io.on('connection', (socket) => {
  console.log('Player connected: ' + socket.id);

  // PLAYER JOIN
  socket.on('join', ({ name, characterType, area }) => {
    console.log('Player joined: ' + name + ' as ' + characterType + ' in ' + area);
    const player = createPlayer(name, characterType, area || 'buena-village');
    gameState.players[socket.id] = player;
    
    const account = Array.from(accounts.values()).find(a => a.username === name);
    if (account) loggedInSockets.set(socket.id, account);
    
    socket.emit('init', {
      currentPlayerId: socket.id,
      players: gameState.players,
      parties: gameState.parties,
      quests: QUESTS,
      world: gameState.world,
      area: player.area,
    });
    
    socket.broadcast.emit('player-joined', player);
    io.emit('update', { players: gameState.players });
  });

  // PLAYER MOVEMENT
  socket.on('move', ({ position, animation, direction }) => {
    if (gameState.players[socket.id]) {
      const player = gameState.players[socket.id];
      if (position) {
        const worldSize = 500;
        player.position.x = Math.max(-worldSize, Math.min(worldSize, position.x));
        player.position.y = Math.max(0, Math.min(100, position.y));
        player.position.z = Math.max(-worldSize, Math.min(worldSize, position.z));
      }
      if (animation) player.animation = animation;
      if (direction !== undefined) player.direction = direction;
      io.emit('player-moved', { playerId: socket.id, player: gameState.players[socket.id] });
    }
  });

  // CHANGE AREA
  socket.on('change-area', ({ area }) => {
    if (gameState.players[socket.id]) {
      const player = gameState.players[socket.id];
      const newArea = AREAS[area];
      if (newArea) {
        player.area = area;
        player.position.x = newArea.spawnPoint.x;
        player.position.y = newArea.spawnPoint.y;
        player.position.z = newArea.spawnPoint.z;
        console.log(player.name + ' changed area to ' + area);
        io.emit('area-changed', { playerId: socket.id, area });
        io.emit('update', { players: gameState.players, area });
        socket.emit('area-changed', { area });
      } else {
        socket.emit('error', 'Area not found');
      }
    }
  });

  // PLAYER ACTIONS - FIXED to handle actions without skillId
  socket.on('action', ({ type, skillId, targetId }) => {
    const player = gameState.players[socket.id];
    if (!player) return;

    const now = Date.now();
    let skill = null;
    
    // If no skillId provided, use default skill for basic actions
    if (!skillId) {
      // For basic attack, use the first skill or a default
      if (type === 'attack' || type === 'jump') {
        skill = getDefaultSkill(player.character);
        skillId = skill.id;
      } else {
        socket.emit('error', 'Skill ID required for this action type');
        return;
      }
    } else {
      skill = player.skills.find(s => s.id === skillId);
    }
    
    if (!skill) {
      // Try to get default skill if specific one not found
      skill = getDefaultSkill(player.character);
      skillId = skill.id;
    }

    // Check cooldown
    if (player.cooldowns[skillId] && player.cooldowns[skillId] > now) {
      socket.emit('error', 'Skill on cooldown');
      return;
    }

    // Check mana (skip for jump)
    if (type !== 'jump' && player.mana < skill.manaCost) {
      socket.emit('error', 'Not enough mana');
      return;
    }

    // Consume mana (skip for jump)
    if (type !== 'jump') {
      player.mana -= skill.manaCost;
    }
    
    player.cooldowns[skillId] = now + skill.cooldown;
    player.animation = type === 'jump' ? 'jumping' : 'attacking';

    switch (type) {
      case 'attack':
        if (targetId && gameState.players[targetId]) {
          const target = gameState.players[targetId];
          const damage = skill.damage || player.stats.attack || 10;
          target.health -= damage;
          if (target.health < 0) target.health = 0;
          console.log(player.name + ' hit ' + target.name + ' for ' + damage + ' damage!');
          if (target.health <= 0) {
            io.emit('player-defeated', { attackerId: socket.id, targetId });
          }
        }
        break;
      case 'heal':
        if (targetId && gameState.players[targetId]) {
          const target = gameState.players[targetId];
          const healAmount = skill.healAmount || 20;
          target.health = Math.min(target.maxHealth, target.health + healAmount);
          console.log(player.name + ' healed ' + target.name + ' for ' + healAmount + ' HP!');
        }
        break;
      case 'jump':
        // Jump action - handled client-side, just update animation
        break;
      default:
        console.log(player.name + ' used ' + (skill ? skill.name : type));
    }

    io.emit('player-action', { playerId: socket.id, action: type, skillId, targetId });
    io.emit('update', { players: gameState.players });
  });

  // CHAT MESSAGES
  socket.on('chat', ({ message, type = 'global', targetId }) => {
    const player = gameState.players[socket.id];
    if (!player) return;
    const chatMessage = { playerId: socket.id, playerName: player.name, message, timestamp: Date.now(), type };
    switch (type) {
      case 'party':
        const party = gameState.parties.find(p => p.memberIds.includes(socket.id));
        if (party) party.memberIds.forEach(memberId => io.to(memberId).emit('chat', chatMessage));
        break;
      case 'whisper':
        if (targetId) { socket.to(targetId).emit('chat', chatMessage); socket.emit('chat', chatMessage); }
        break;
      default: io.emit('chat', chatMessage);
    }
  });

  // PARTY SYSTEM HANDLERS
  socket.on('party:create', ({ name }) => {
    const player = gameState.players[socket.id];
    if (!player || player.partyId) { socket.emit('error', 'Already in party'); return; }
    const party = createParty(socket.id, name);
    player.partyId = party.id;
    socket.emit('party-created', party);
    io.emit('update', { parties: gameState.parties, players: gameState.players });
  });

  socket.on('party:join', ({ partyId }) => {
    const player = gameState.players[socket.id];
    if (!player || player.partyId) { socket.emit('error', 'Already in party'); return; }
    if (joinParty(partyId, socket.id)) { player.partyId = partyId; socket.emit('party-joined', { partyId }); io.emit('update', { parties: gameState.parties, players: gameState.players }); }
  });

  socket.on('party:leave', () => {
    const player = gameState.players[socket.id];
    if (!player || !player.partyId) return;
    if (leaveParty(player.partyId, socket.id)) { player.partyId = null; socket.emit('party-left'); io.emit('update', { parties: gameState.parties, players: gameState.players }); }
  });

  // QUEST SYSTEM HANDLERS
  socket.on('quest:accept', ({ questId }) => {
    const player = gameState.players[socket.id];
    if (!player) return;
    const quest = QUESTS.find(q => q.id === questId);
    if (!quest) { socket.emit('error', 'Quest not found'); return; }
    if (player.activeQuests.includes(questId)) { socket.emit('error', 'Quest already accepted'); return; }
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
    const allComplete = quest.objectives.every(obj => obj.current >= obj.required);
    if (!allComplete) { socket.emit('error', 'Objectives not complete'); return; }
    player.activeQuests.splice(questIndex, 1);
    player.xp += quest.reward.xp;
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

  // PLAYER DISCONNECT
  socket.on('disconnect', () => {
    console.log('Player disconnected: ' + socket.id);
    const player = gameState.players[socket.id];
    if (player) {
      if (player.partyId) leaveParty(player.partyId, socket.id);
      delete gameState.players[socket.id];
      loggedInSockets.delete(socket.id);
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
    areas: Object.keys(AREAS).length,
    uptime: process.uptime(),
  });
});

app.get('/status', (req, res) => {
  res.json({
    players: Object.keys(gameState.players).length,
    parties: gameState.parties.length,
    quests: QUESTS.length,
    worldTime: gameState.world.time,
  });
});

// ============================================
// ⚡ START SERVER
// ============================================
httpServer.listen(PORT, () => {
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║                                                           ║');
  console.log('║   🎮 Mana Storm Game Server v2.0                          ║');
  console.log('║   🎯 Features: Multiplayer, Areas, Camera, Animations      ║');
  console.log('║   👤 Account System: Register, Login, Save Games        ║');
  console.log('║                                                           ║');
  console.log('║   📍 Server running on: http://localhost:' + PORT + '           ║');
  console.log('║                                                           ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
});

// GAME LOOP
setInterval(() => {
  gameState.world.time += 0.1;
  Object.values(gameState.players).forEach(player => {
    if (player.mana < player.maxMana) {
      player.mana += 0.5;
      if (player.mana > player.maxMana) player.mana = player.maxMana;
    }
    if (player.animation === 'attacking' && Math.random() < 0.1) {
      player.animation = 'idle';
    }
    if (player.animation === 'jumping' && Math.random() < 0.2) {
      player.animation = 'idle';
    }
  });
  io.emit('world-update', gameState.world);
}, 1000);

// ERROR HANDLING
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('❌ Unhandled Rejection:', reason);
});

module.exports = { app, httpServer, io, gameState, accounts };
