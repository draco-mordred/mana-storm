const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  pingInterval: 10000,
  pingTimeout: 5000,
  transports: ['websocket', 'polling'],
});

const GAME_CONSTANTS = {
  WORLD_SIZE: 1000,
  GRAVITY: -9.8,
  PLAYER_SPEED: 0.25,
  PLAYER_HEIGHT: 1.8,
  PLAYER_RADIUS: 0.5,
  CAMERA_OFFSET: { x: 0, y: 2.5, z: -5 },
  MAX_PLAYERS: 50,
  TICK_RATE: 30,
  DEFAULT_HEALTH: 100,
  DEFAULT_MANA: 100,
};

const AREAS = {
  'Buena Village': { name: 'Buena Village', description: 'A peaceful village retrofitted with advanced technology', spawnPoint: { x: 0, y: 0, z: 0 } },
  'Asura Kingdom': { name: 'Asura Kingdom', description: 'A high-tech kingdom with towering spires and energy shields', spawnPoint: { x: 0, y: 0, z: 0 } },
  'Magic City Sharia': { name: 'Magic City Sharia', description: 'A futuristic city of advanced magic and technology', spawnPoint: { x: 0, y: 0, z: 0 } },
};

const CHARACTER_PRESETS = {
  rudeus: { type: 'rudeus', name: 'Rudeus Greyrat', baseHealth: 100, baseMana: 150, baseAttack: 25, baseDefense: 15, baseSpeed: 10, skills: ['fireball', 'ice-shield', 'heal', 'teleport'], model: 'rudeus', color: 0x4a90d9, description: 'The reincarnated prodigy mage', outfit: 'blue_robe', hairColor: 0x4a90d9, hairStyle: 'medium', age: 'teen' },
  warrior: { type: 'warrior', name: 'Cyber Knight', baseHealth: 120, baseMana: 60, baseAttack: 25, baseDefense: 25, baseSpeed: 8, skills: ['plasma-slash', 'energy-shield', 'ion-cannon', 'overcharge'], model: 'warrior', color: 0x222233, description: 'A cybernetically enhanced warrior', outfit: 'cyber_armor', hairColor: 0x444455, hairStyle: 'short', age: 'adult' },
  mage: { type: 'mage', name: 'Quantum Mage', baseHealth: 80, baseMana: 150, baseAttack: 30, baseDefense: 10, baseSpeed: 7, skills: ['quantum-blast', 'void-shield', 'gravity-well', 'phase-shift'], model: 'mage', color: 0x0066ff, description: 'A master of quantum energies', outfit: 'quantum_robe', hairColor: 0xffffff, hairStyle: 'long', age: 'adult' },
  rogue: { type: 'rogue', name: 'Phantom Agent', baseHealth: 90, baseMana: 80, baseAttack: 25, baseDefense: 15, baseSpeed: 14, skills: ['hologram-cloak', 'neural-disruptor', 'phase-dagger', 'quantum-blink'], model: 'rogue', color: 0x003322, description: 'A stealth operative', outfit: 'stealth_suit', hairColor: 0x228b22, hairStyle: 'short', age: 'adult' },
  archer: { type: 'archer', name: 'Stellar Sniper', baseHealth: 95, baseMana: 70, baseAttack: 25, baseDefense: 10, baseSpeed: 10, skills: ['photon-arrow', 'black-hole-trap', 'precision-strike', 'orbital-barrage'], model: 'archer', color: 0x330066, description: 'A long-range specialist', outfit: 'tactical_gear', hairColor: 0xdaa520, hairStyle: 'ponytail', age: 'adult' },
  healer: { type: 'healer', name: 'Bio-Synth', baseHealth: 100, baseMana: 180, baseAttack: 10, baseDefense: 12, baseSpeed: 9, skills: ['nano-regeneration', 'stasis-field', 'neural-boost', 'bio-purge'], model: 'healer', color: 0x00ffff, description: 'A bio-engineered support specialist', outfit: 'medical_armor', hairColor: 0xffd700, hairStyle: 'long', age: 'adult' },
};

const SKILLS = {
  'fireball': { id: 'fireball', name: 'Plasma Fireball', description: 'Launches a ball of ionized plasma', type: 'attack', damage: 45, manaCost: 25, cooldown: 3000, range: 18 },
  'ice-shield': { id: 'ice-shield', name: 'Cryo Barrier', description: 'Creates a protective cryogenic shield', type: 'defense', manaCost: 20, cooldown: 8000, range: 1 },
  'heal': { id: 'heal', name: 'Nano Heal', description: 'Deploys healing nanobots', type: 'heal', healAmount: 45, manaCost: 25, cooldown: 3000, range: 12 },
  'teleport': { id: 'teleport', name: 'Quantum Shift', description: 'Instantly teleport', type: 'utility', manaCost: 30, cooldown: 15000, range: 25 },
  'plasma-slash': { id: 'plasma-slash', name: 'Plasma Slash', description: 'A powerful energy-infused melee strike', type: 'attack', damage: 30, manaCost: 15, cooldown: 2000, range: 2.5 },
  'energy-shield': { id: 'energy-shield', name: 'Energy Shield', description: 'Creates a protective energy barrier', type: 'defense', manaCost: 20, cooldown: 6000, range: 1 },
  'ion-cannon': { id: 'ion-cannon', name: 'Ion Cannon', description: 'Fires a devastating ion beam', type: 'attack', damage: 50, manaCost: 35, cooldown: 8000, range: 20 },
  'quantum-blast': { id: 'quantum-blast', name: 'Quantum Blast', description: 'Releases unstable quantum energy', type: 'attack', damage: 55, manaCost: 30, cooldown: 4000, range: 22 },
  'void-shield': { id: 'void-shield', name: 'Void Shield', description: 'Creates a shield that absorbs energy attacks', type: 'defense', manaCost: 25, cooldown: 7000, range: 1 },
  'hologram-cloak': { id: 'hologram-cloak', name: 'Hologram Cloak', description: 'Creates a holographic decoy', type: 'utility', manaCost: 20, cooldown: 10000, range: 1 },
  'photon-arrow': { id: 'photon-arrow', name: 'Photon Arrow', description: 'Fires a high-energy photon arrow', type: 'attack', damage: 35, manaCost: 20, cooldown: 2500, range: 30 },
  'nano-regeneration': { id: 'nano-regeneration', name: 'Nano Regeneration', description: 'Heals over time with nanobots', type: 'heal', healAmount: 60, manaCost: 30, cooldown: 5000, range: 15 },
};

function isMobileClient(userAgent) {
  if (!userAgent) return false;
  const mobileUserAgents = [/Android/i, /webOS/i, /iPhone/i, /iPad/i, /iPod/i, /BlackBerry/i, /IEMobile/i, /Opera Mini/i, /Windows Phone/i];
  return mobileUserAgents.some(agent => userAgent.match(agent));
}

function createMobilePayload(fullPayload) {
  return {
    players: Object.fromEntries(
      Object.entries(fullPayload.players).map(([id, player]) => [
        id,
        {
          id: player.id,
          name: player.name,
          characterType: player.characterType,
          position: player.position,
          rotation: player.rotation,
          animation: player.animation,
          health: player.health,
          maxHealth: player.maxHealth,
          skills: player.skills?.slice(0, 4) || [],
        }
      ])
    ),
    currentArea: { name: fullPayload.currentArea.name, description: fullPayload.currentArea.description },
    localPlayerId: fullPayload.localPlayerId,
    isConnected: fullPayload.isConnected,
  };
}

const rooms = {};
const players = {};
const areas = {};

Object.keys(AREAS).forEach(areaName => {
  areas[areaName] = { ...AREAS[areaName], players: new Set() };
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  const userAgent = socket.handshake.headers['user-agent'];
  const clientIsMobile = isMobileClient(userAgent);
  console.log('Client', socket.id, 'is', clientIsMobile ? 'mobile' : 'desktop');

  socket.on('join', (data) => {
    const playerId = uuidv4();
    const characterPreset = CHARACTER_PRESETS[data.characterType] || CHARACTER_PRESETS.rudeus;
    const area = AREAS[data.area] || AREAS['Buena Village'];

    const player = {
      id: playerId,
      name: data.playerName || `Player-${playerId.slice(0, 4)}`,
      characterType: data.characterType || 'rudeus',
      preset: characterPreset,
      position: [...area.spawnPoint, 0],
      rotation: [0, 0, 0],
      velocity: [0, 0, 0],
      animation: 'idle',
      health: characterPreset.baseHealth,
      maxHealth: characterPreset.baseHealth,
      mana: characterPreset.baseMana,
      maxMana: characterPreset.baseMana,
      attack: characterPreset.baseAttack,
      defense: characterPreset.baseDefense,
      speed: characterPreset.baseSpeed,
      skills: characterPreset.skills,
      cooldowns: {},
      lastUpdate: Date.now(),
      isMobile: clientIsMobile,
      currentArea: area.name,
    };

    players[playerId] = player;
    socket.playerId = playerId;
    socket.isMobile = clientIsMobile;
    areas[area.name].players.add(playerId);

    const initialState = { players: { [playerId]: player }, currentArea: area, localPlayerId: playerId, isConnected: true };
    socket.emit('gameState', clientIsMobile ? createMobilePayload(initialState) : initialState);
    socket.to(area.name).emit('playerJoined', player);
    socket.join(area.name);
    console.log('Player', player.name, 'joined', area.name);
  });

  socket.on('playerAction', (action) => {
    if (!socket.playerId) return;
    const player = players[socket.playerId];
    if (!player) return;
    const area = areas[player.currentArea];
    if (!area) return;

    if (action.direction) {
      const speed = player.speed * 0.1;
      player.position[0] += action.direction.x * speed;
      player.position[2] += action.direction.z * speed;
      if (Math.abs(action.direction.x) > 0.01 || Math.abs(action.direction.z) > 0.01) {
        player.rotation[1] = Math.atan2(action.direction.x, action.direction.z);
        player.animation = 'walk';
      } else {
        player.animation = 'idle';
      }
      player.lastUpdate = Date.now();
    }

    if (action.action) {
      switch (action.action) {
        case 'jump': player.animation = 'jump'; setTimeout(() => { player.animation = 'idle'; }, 500); break;
        case 'attack': player.animation = 'attack'; setTimeout(() => { player.animation = 'idle'; }, 500); break;
        case 'skill1': case 'skill2': case 'skill3': case 'skill4':
          const skillIndex = parseInt(action.action.slice(-1)) - 1;
          if (player.skills && player.skills[skillIndex]) {
            const skillId = player.skills[skillIndex];
            const skill = SKILLS[skillId];
            if (skill && !player.cooldowns[skillId]) {
              player.animation = 'cast';
              player.cooldowns[skillId] = Date.now() + skill.cooldown;
              setTimeout(() => { player.animation = 'idle'; delete player.cooldowns[skillId]; }, skill.cooldown);
            }
          }
          break;
      }
    }
    socket.to(player.currentArea).emit('playerUpdated', player);
  });

  socket.on('changeArea', (data) => {
    if (!socket.playerId) return;
    const player = players[socket.playerId];
    if (!player) return;
    const newArea = AREAS[data.area];
    if (!newArea) return;

    if (areas[player.currentArea]) areas[player.currentArea].players.delete(player.id);
    player.currentArea = newArea.name;
    player.position = [...newArea.spawnPoint, 0];
    player.rotation = [0, 0, 0];
    player.animation = 'idle';
    areas[newArea.name].players.add(player.id);
    socket.leave(Object.keys(AREAS).find(a => a !== newArea.name) || '');
    socket.join(newArea.name);

    const gameState = { players, currentArea: newArea, localPlayerId: socket.playerId, isConnected: true };
    socket.emit('gameState', socket.isMobile ? createMobilePayload(gameState) : gameState);
    socket.to(newArea.name).emit('playerJoined', player);
    console.log('Player', player.name, 'changed to', newArea.name);
  });

  socket.on('disconnect', () => {
    if (!socket.playerId) return;
    const player = players[socket.playerId];
    if (!player) return;
    if (areas[player.currentArea]) areas[player.currentArea].players.delete(player.id);
    delete players[socket.playerId];
    socket.to(player.currentArea).emit('playerLeft', { playerId: socket.playerId });
    console.log('Player', player.name, 'disconnected');
  });
});

setInterval(() => {
  const now = Date.now();
  Object.values(players).forEach(player => {
    Object.keys(player.cooldowns).forEach(skillId => {
      if (player.cooldowns[skillId] <= now) delete player.cooldowns[skillId];
    });
  });
  Object.values(io.sockets.sockets).forEach((socket) => {
    if (socket.playerId) {
      const player = players[socket.playerId];
      if (player) {
        const gameState = { players, currentArea: AREAS[player.currentArea], localPlayerId: socket.playerId, isConnected: true };
        socket.emit('gameState', socket.isMobile ? createMobilePayload(gameState) : gameState);
      }
    }
  });
}, 1000 / GAME_CONSTANTS.TICK_RATE);

const PORT = process.env.PORT || 3001;
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../client/dist')));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

app.get('/info', (req, res) => {
  res.json({ name: 'Mana Storm Server', version: '1.0.0', players: Object.keys(players).length, areas: Object.keys(AREAS), tickRate: GAME_CONSTANTS.TICK_RATE });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

server.listen(PORT, () => {
  console.log('Mana Storm Server running on port', PORT);
});

module.exports = server;
