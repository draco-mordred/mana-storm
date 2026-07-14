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
// 👤 USER ACCOUNT SYSTEM
// ============================================
const users = {};
const saveGames = {};

// Register new user
app.post('/api/register', (req, res) => {
  try {
    const { username, password, email, characterName, characterType } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    
    if (users[username]) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    
    const user = {
      id: uuidv4(),
      username,
      password, // In production, use bcrypt to hash passwords
      email: email || null,
      characterName: characterName || username,
      characterType: characterType || 'rudeus',
      createdAt: Date.now(),
      lastLogin: null,
    };
    
    users[username] = user;
    
    // Create initial save game
    saveGames[user.id] = {
      playerId: user.id,
      playerName: user.characterName,
      characterType: user.characterType,
      position: { x: 0, y: 0, z: 0 },
      map: 'buena-village',
      timestamp: Date.now(),
      level: 1,
      xp: 0,
      health: 100,
      mana: 100,
      equipment: {},
      inventory: ['health_potion', 'mana_potion'],
      questProgress: {},
    };
    
    res.json({ success: true, user: { id: user.id, username: user.username, characterName: user.characterName, characterType: user.characterType } });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login user
app.post('/api/login', (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    
    const user = users[username];
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    
    // Update last login
    user.lastLogin = Date.now();
    
    // Generate a simple token (in production, use JWT)
    const token = uuidv4();
    
    res.json({
      success: true,
      user: { id: user.id, username: user.username, characterName: user.characterName, characterType: user.characterType },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Save game
app.post('/api/save', (req, res) => {
  try {
    const { playerId, data } = req.body;
    
    if (!playerId || !data) {
      return res.status(400).json({ error: 'Player ID and data are required' });
    }
    
    saveGames[playerId] = {
      ...data,
      timestamp: Date.now(),
    };
    
    res.json({ success: true });
  } catch (error) {
    console.error('Save error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Load game
app.get('/api/load/:playerId', (req, res) => {
  try {
    const { playerId } = req.params;
    const saveData = saveGames[playerId];
    
    if (!saveData) {
      return res.status(404).json({ error: 'No save data found' });
    }
    
    res.json({ success: true, data: saveData });
  } catch (error) {
    console.error('Load error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// 🎭 CHARACTER PRESETS (Anime Style)
// ============================================
const CHARACTER_PRESETS = {
  rudeus: { type: 'rudeus', name: 'Rudeus Greyrat', baseHealth: 100, baseMana: 150, baseAttack: 20, baseDefense: 15, baseSpeed: 10, skills: ['magic-missile', 'healing', 'water-blast', 'teleportation'], model: 'rudeus', color: 0x4169e1, hairColor: 0x1e90ff },
  warrior: { type: 'warrior', name: 'Sword Master', baseHealth: 120, baseMana: 60, baseAttack: 25, baseDefense: 20, baseSpeed: 8, skills: ['sword-slash', 'shield-block', 'power-strike'], model: 'warrior', color: 0xff4500, hairColor: 0x8b0000 },
  mage: { type: 'mage', name: 'Elemental Mage', baseHealth: 80, baseMana: 180, baseAttack: 30, baseDefense: 5, baseSpeed: 7, skills: ['fireball', 'ice-shield', 'lightning-bolt', 'teleport'], model: 'mage', color: 0x9370db, hairColor: 0x9932cc },
  rogue: { type: 'rogue', name: 'Shadow Assassin', baseHealth: 90, baseMana: 80, baseAttack: 22, baseDefense: 10, baseSpeed: 15, skills: ['backstab', 'stealth', 'poison-dagger', 'shadow-clone'], model: 'rogue', color: 0x228b22, hairColor: 0x2e8b57 },
  archer: { type: 'archer', name: 'Sniper', baseHealth: 95, baseMana: 70, baseAttack: 20, baseDefense: 8, baseSpeed: 12, skills: ['arrow-rain', 'snipe', 'trap', 'piercing-shot'], model: 'archer', color: 0xdaa520, hairColor: 0xffd700 },
  healer: { type: 'healer', name: 'Saint', baseHealth: 100, baseMana: 200, baseAttack: 8, baseDefense: 12, baseSpeed: 9, skills: ['heal', 'revive', 'bless', 'holy-barrier'], model: 'healer', color: 0xffd700, hairColor: 0xff69b4 },
};

// ============================================
// ⚔️ SKILLS DATABASE
// ============================================
const SKILLS = {
  'magic-missile': { id: 'magic-missile', name: 'Magic Missile', type: 'attack', damage: 35, manaCost: 20, cooldown: 2500, range: 20 },
  'healing': { id: 'healing', name: 'Healing Magic', type: 'heal', healAmount: 50, manaCost: 30, cooldown: 4000, range: 15 },
  'water-blast': { id: 'water-blast', name: 'Water Blast', type: 'attack', damage: 45, manaCost: 25, cooldown: 3500, range: 18 },
  'teleportation': { id: 'teleportation', name: 'Teleportation', type: 'utility', manaCost: 40, cooldown: 10000, range: 30 },
  'sword-slash': { id: 'sword-slash', name: 'Sword Slash', type: 'attack', damage: 40, manaCost: 10, cooldown: 1500, range: 2 },
  'shield-block': { id: 'shield-block', name: 'Shield Block', type: 'defense', manaCost: 15, cooldown: 6000, range: 1 },
  'power-strike': { id: 'power-strike', name: 'Power Strike', type: 'attack', damage: 70, manaCost: 25, cooldown: 5000, range: 2 },
  'fireball': { id: 'fireball', name: 'Fireball', type: 'attack', damage: 60, manaCost: 30, cooldown: 4000, range: 25 },
  'ice-shield': { id: 'ice-shield', name: 'Ice Shield', type: 'defense', manaCost: 20, cooldown: 7000, range: 1 },
  'lightning-bolt': { id: 'lightning-bolt', name: 'Lightning Bolt', type: 'attack', damage: 55, manaCost: 35, cooldown: 5000, range: 20 },
  'backstab': { id: 'backstab', name: 'Backstab', type: 'attack', damage: 80, manaCost: 20, cooldown: 6000, range: 1 },
  'stealth': { id: 'stealth', name: 'Stealth', type: 'utility', manaCost: 25, cooldown: 12000, range: 1 },
  'poison-dagger': { id: 'poison-dagger', name: 'Poison Dagger', type: 'attack', damage: 25, manaCost: 15, cooldown: 3000, range: 12 },
  'shadow-clone': { id: 'shadow-clone', name: 'Shadow Clone', type: 'utility', manaCost: 50, cooldown: 15000, range: 1 },
  'arrow-rain': { id: 'arrow-rain', name: 'Arrow Rain', type: 'attack', damage: 30, manaCost: 25, cooldown: 4000, range: 25 },
  'snipe': { id: 'snipe', name: 'Snipe', type: 'attack', damage: 90, manaCost: 40, cooldown: 8000, range: 40 },
  'trap': { id: 'trap', name: 'Bear Trap', type: 'utility', manaCost: 20, cooldown: 10000, range: 8 },
  'piercing-shot': { id: 'piercing-shot', name: 'Piercing Shot', type: 'attack', damage: 45, manaCost: 30, cooldown: 5000, range: 30 },
  'heal': { id: 'heal', name: 'Heal', type: 'heal', healAmount: 40, manaCost: 25, cooldown: 3000, range: 15 },
  'revive': { id: 'revive', name: 'Revive', type: 'heal', healAmount: 100, manaCost: 60, cooldown: 30000, range: 8 },
  'bless': { id: 'bless', name: 'Bless', type: 'utility', manaCost: 35, cooldown: 15000, range: 20 },
  'holy-barrier': { id: 'holy-barrier', name: 'Holy Barrier', type: 'defense', manaCost: 40, cooldown: 10000, range: 10 },
};

// ============================================
// 🌍 GAME WORLD STATE
// ============================================
const gameState = {
  players: {},
  parties: [],
  quests: [],
  world: { time: 0, weather: 'clear' },
  currentMap: 'buena-village',
};

// ============================================
// 👥 PARTY SYSTEM
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
  { id: 'quest-1', title: 'Find Rudeus', description: 'Locate Rudeus Greyrat in Buena Village', objectives: [{ type: 'reach', target: 'rudeus-house', required: 1, current: 0 }], reward: { gold: 100, xp: 200 }, status: 'available' },
  { id: 'quest-2', title: 'Train with Zenith', description: 'Complete training with Zenith', objectives: [{ type: 'talk', target: 'zenith', required: 1, current: 0 }], reward: { gold: 150, xp: 300 }, status: 'available' },
  { id: 'quest-3', title: 'Explore Village', description: 'Visit all locations in Buena Village', objectives: [{ type: 'reach', target: 'well', required: 1, current: 0 }, { type: 'reach', target: 'church', required: 1, current: 0 }, { type: 'reach', target: 'workshop', required: 1, current: 0 }], reward: { gold: 200, xp: 500 }, status: 'available' },
  { id: 'quest-4', title: 'Defeat Monsters', description: 'Clear monsters near the village', objectives: [{ type: 'kill', target: 'goblin', required: 5, current: 0 }], reward: { gold: 250, xp: 400 }, status: 'available' },
  { id: 'quest-5', title: 'Collect Herbs', description: 'Gather medicinal herbs for the healer', objectives: [{ type: 'collect', target: 'mana-herb', required: 10, current: 0 }], reward: { gold: 180, xp: 350 }, status: 'available' },
];

// ============================================
// 👤 CREATE PLAYER
// ============================================
function createPlayer(name, characterType) {
  const preset = CHARACTER_PRESETS[characterType] || CHARACTER_PRESETS.rudeus;
  const skills = preset.skills.map(skillId => SKILLS[skillId]);
  
  // Check if there's saved game data for this player
  const user = Object.values(users).find(u => u.characterName === name);
  let position = { x: Math.random() * 20 - 10, y: 0, z: Math.random() * 20 - 10 };
  
  if (user) {
    const saveData = saveGames[user.id];
    if (saveData) {
      position = saveData.position || position;
    }
  }
  
  return {
    id: uuidv4(),
    name: name || 'Player_' + Date.now(),
    character: characterType,
    position: position,
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
  };
}

// ============================================
// 🎮 SOCKET.IO CONNECTION HANDLING
// ============================================
io.on('connection', (socket) => {
  console.log('Player connected: ' + socket.id);

  // Player Join
  socket.on('join', ({ name, characterType }) => {
    console.log('Player joined: ' + name + ' as ' + characterType);
    const player = createPlayer(name, characterType);
    gameState.players[socket.id] = player;
    
    socket.emit('init', {
      currentPlayerId: socket.id,
      players: gameState.players,
      parties: gameState.parties,
      quests: gameState.quests,
      world: gameState.world,
      currentMap: gameState.currentMap,
    });
    
    socket.broadcast.emit('player-joined', player);
    io.emit('update', { players: gameState.players });
  });

  // Player Movement
  socket.on('move', ({ position, animation }) => {
    if (gameState.players[socket.id]) {
      const player = gameState.players[socket.id];
      if (position) {
        const worldSize = 500;
        player.position.x = Math.max(-worldSize, Math.min(worldSize, position.x));
        player.position.y = Math.max(0, Math.min(100, position.y));
        player.position.z = Math.max(-worldSize, Math.min(worldSize, position.z));
      }
      if (animation) player.animation = animation;
      io.emit('player-moved', { playerId: socket.id, player: gameState.players[socket.id] });
    }
  });

  // Player Actions
  socket.on('action', ({ type, skillId, targetId }) => {
    const player = gameState.players[socket.id];
    if (!player) return;
    const now = Date.now();
    const skill = player.skills.find(s => s.id === skillId);
    if (!skill) { socket.emit('error', 'Skill not found'); return; }
    if (player.cooldowns[skillId] && player.cooldowns[skillId] > now) { socket.emit('error', 'Skill on cooldown'); return; }
    if (player.mana < skill.manaCost) { socket.emit('error', 'Not enough mana'); return; }
    player.mana -= skill.manaCost;
    player.cooldowns[skillId] = now + skill.cooldown;
    
    switch (type) {
      case 'attack':
        if (targetId && gameState.players[targetId]) {
          const target = gameState.players[targetId];
          const damage = skill.damage || 0;
          target.health -= damage;
          if (target.health < 0) target.health = 0;
          if (target.health <= 0) io.emit('player-defeated', { attackerId: socket.id, targetId });
        }
        break;
      case 'heal':
        if (targetId && gameState.players[targetId]) {
          const target = gameState.players[targetId];
          const healAmount = skill.healAmount || 0;
          target.health = Math.min(target.maxHealth, target.health + healAmount);
        }
        break;
      case 'jump':
        // Jump action handled client-side
        break;
    }
    
    io.emit('player-action', { playerId: socket.id, action: type, skillId, targetId });
    io.emit('update', { players: gameState.players });
  });

  // Chat
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

  // Party System
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

  // Quest System
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
    if (player.xp >= player.level * 1000) { player.level++; player.xp = 0; player.maxHealth += 20; player.health = player.maxHealth; player.maxMana += 10; player.mana = player.maxMana; }
    quest.status = 'completed';
    socket.emit('quest-completed', { questId, rewards: quest.reward });
    io.emit('update', { players: gameState.players, quests: QUESTS });
  });

  // Save Game
  socket.on('save', ({ playerId, data }) => {
    if (!playerId) playerId = socket.id;
    saveGames[playerId] = { ...data, timestamp: Date.now() };
    socket.emit('save-success', { saved: true });
  });

  // Load Game
  socket.on('load', ({ playerId }, callback) => {
    if (!playerId) playerId = socket.id;
    const saveData = saveGames[playerId];
    if (saveData) {
      callback({ success: true, data: saveData });
    } else {
      callback({ success: false, error: 'No save data found' });
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('Player disconnected: ' + socket.id);
    const player = gameState.players[socket.id];
    if (player) {
      if (player.partyId) leaveParty(player.partyId, socket.id);
      delete gameState.players[socket.id];
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
    version: '1.0.0',
    status: 'running',
    players: Object.keys(gameState.players).length,
    uptime: process.uptime(),
  });
});

app.get('/status', (req, res) => {
  res.json({
    players: Object.keys(gameState.players).length,
    parties: gameState.parties.length,
    quests: gameState.quests.length,
    worldTime: gameState.world.time,
    currentMap: gameState.currentMap,
  });
});

// ============================================
// ⚡ START SERVER
// ============================================
httpServer.listen(PORT, () => {
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║                                                           ║');
  console.log('║   🎮 Mana Storm Game Server                              ║');
  console.log('║                                                           ║');
  console.log('║   📍 Server running on: http://localhost:' + PORT + '           ║');
  console.log('║   🎯 Features: Multiplayer, Skills, Parties, Quests      ║');
  console.log('║   👤 User Accounts: Register, Login, Save/Load           ║');
  console.log('║   🗺️  Map: Buena Village (Jobless Reincarnation)       ║');
  console.log('║                                                           ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
});

// ============================================
// 🎒 GAME LOOP (World Updates)
// ============================================
setInterval(() => {
  gameState.world.time += 0.1;
  Object.values(gameState.players).forEach(player => {
    if (player.mana < player.maxMana) { player.mana += 0.5; if (player.mana > player.maxMana) player.mana = player.maxMana; }
  });
  io.emit('world-update', gameState.world);
}, 1000);

// ============================================
// 🛡️ ERROR HANDLING
// ============================================
process.on('uncaughtException', (err) => console.error('Uncaught Exception:', err));
process.on('unhandledRejection', (reason) => console.error('Unhandled Rejection:', reason));

module.exports = { app, httpServer, io, gameState, users, saveGames };
