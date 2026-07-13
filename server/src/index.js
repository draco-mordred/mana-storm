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

const CHARACTER_PRESETS = {
  warrior: { type: 'warrior', name: 'Warrior', baseHealth: 120, baseMana: 60, baseAttack: 15, baseDefense: 20, baseSpeed: 8, skills: ['sword-slash', 'shield-block', 'war-cry'], color: 0xff0000 },
  mage: { type: 'mage', name: 'Mage', baseHealth: 80, baseMana: 120, baseAttack: 25, baseDefense: 5, baseSpeed: 7, skills: ['fireball', 'ice-shield', 'teleport'], color: 0x0000ff },
  rogue: { type: 'rogue', name: 'Rogue', baseHealth: 90, baseMana: 80, baseAttack: 20, baseDefense: 10, baseSpeed: 12, skills: ['backstab', 'stealth', 'poison-dagger'], color: 0x00ff00 },
  archer: { type: 'archer', name: 'Archer', baseHealth: 95, baseMana: 70, baseAttack: 18, baseDefense: 8, baseSpeed: 10, skills: ['arrow-rain', 'snipe', 'trap'], color: 0xffff00 },
  healer: { type: 'healer', name: 'Healer', baseHealth: 100, baseMana: 150, baseAttack: 5, baseDefense: 12, baseSpeed: 9, skills: ['heal', 'revive', 'bless'], color: 0xff00ff },
};

const SKILLS = {
  'sword-slash': { id: 'sword-slash', name: 'Sword Slash', type: 'attack', damage: 25, manaCost: 10, cooldown: 2000, range: 2 },
  'shield-block': { id: 'shield-block', name: 'Shield Block', type: 'defense', manaCost: 15, cooldown: 5000, range: 1 },
  'war-cry': { id: 'war-cry', name: 'War Cry', type: 'utility', manaCost: 20, cooldown: 10000, range: 10 },
  'fireball': { id: 'fireball', name: 'Fireball', type: 'attack', damage: 40, manaCost: 25, cooldown: 3000, range: 15 },
  'ice-shield': { id: 'ice-shield', name: 'Ice Shield', type: 'defense', manaCost: 20, cooldown: 8000, range: 1 },
  'teleport': { id: 'teleport', name: 'Teleport', type: 'utility', manaCost: 30, cooldown: 15000, range: 20 },
  'backstab': { id: 'backstab', name: 'Backstab', type: 'attack', damage: 50, manaCost: 20, cooldown: 5000, range: 1 },
  'stealth': { id: 'stealth', name: 'Stealth', type: 'utility', manaCost: 15, cooldown: 12000, range: 1 },
  'poison-dagger': { id: 'poison-dagger', name: 'Poison Dagger', type: 'attack', damage: 15, manaCost: 10, cooldown: 2000, range: 10 },
  'arrow-rain': { id: 'arrow-rain', name: 'Arrow Rain', type: 'attack', damage: 20, manaCost: 25, cooldown: 4000, range: 20 },
  'snipe': { id: 'snipe', name: 'Snipe', type: 'attack', damage: 60, manaCost: 35, cooldown: 8000, range: 30 },
  'trap': { id: 'trap', name: 'Trap', type: 'utility', manaCost: 20, cooldown: 10000, range: 5 },
  'heal': { id: 'heal', name: 'Heal', type: 'heal', healAmount: 40, manaCost: 25, cooldown: 3000, range: 10 },
  'revive': { id: 'revive', name: 'Revive', type: 'heal', healAmount: 100, manaCost: 50, cooldown: 30000, range: 5 },
  'bless': { id: 'bless', name: 'Bless', type: 'utility', manaCost: 30, cooldown: 15000, range: 10 },
};

const gameState = { players: {}, parties: [], quests: [], world: { time: 0, weather: 'clear' } };

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

const QUESTS = [
  { id: 'quest-1', title: 'Defeat 10 Monsters', description: 'Clear the monster infestation', objectives: [{ type: 'kill', target: 'goblin', required: 10, current: 0 }], reward: { gold: 500, xp: 1000 }, status: 'available' },
  { id: 'quest-2', title: 'Collect Herbs', description: 'Gather medicinal herbs', objectives: [{ type: 'collect', target: 'mana-herb', required: 5, current: 0 }], reward: { gold: 300, xp: 800 }, status: 'available' },
  { id: 'quest-3', title: 'Escort Merchant', description: 'Protect the merchant', objectives: [{ type: 'reach', target: 'capital-city', required: 1, current: 0 }], reward: { gold: 800, xp: 1500 }, status: 'available' },
];

function createPlayer(name, characterType) {
  const preset = CHARACTER_PRESETS[characterType] || CHARACTER_PRESETS.warrior;
  const skills = preset.skills.map(skillId => SKILLS[skillId]);
  return {
    id: uuidv4(),
    name: name || 'Player_' + Date.now(),
    character: characterType,
    position: { x: Math.random() * 20 - 10, y: 0, z: Math.random() * 20 - 10 },
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

io.on('connection', (socket) => {
  console.log('Player connected: ' + socket.id);

  socket.on('join', ({ name, characterType }) => {
    const player = createPlayer(name, characterType);
    gameState.players[socket.id] = player;
    socket.emit('init', { currentPlayerId: socket.id, players: gameState.players, parties: gameState.parties, quests: gameState.quests, world: gameState.world });
    socket.broadcast.emit('player-joined', player);
    io.emit('update', { players: gameState.players });
  });

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
    }
    io.emit('player-action', { playerId: socket.id, action: type, skillId, targetId });
    io.emit('update', { players: gameState.players });
  });

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

const PORT = process.env.PORT || 3001;
app.get('/', (req, res) => res.json({ name: 'Mana Storm Game Server', version: '1.0.0', status: 'running', players: Object.keys(gameState.players).length }));
app.get('/status', (req, res) => res.json({ players: Object.keys(gameState.players).length, parties: gameState.parties.length, quests: gameState.quests.length }));

httpServer.listen(PORT, () => {
  console.log('Mana Storm Game Server running on port ' + PORT);
  console.log('Features: Multiplayer, Skills, Parties, Quests');
});

setInterval(() => {
  gameState.world.time += 0.1;
  Object.values(gameState.players).forEach(player => {
    if (player.mana < player.maxMana) { player.mana += 0.5; if (player.mana > player.maxMana) player.mana = player.maxMana; }
  });
  io.emit('world-update', gameState.world);
}, 1000);

process.on('uncaughtException', (err) => console.error('Uncaught Exception:', err));
process.on('unhandledRejection', (reason) => console.error('Unhandled Rejection:', reason));

module.exports = { app, httpServer, io, gameState };