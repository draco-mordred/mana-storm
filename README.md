Mana Storm - Multiplayer Game

Complete multiplayer game built with React, Three.js, and Socket.io.

## Project Structure

mana-storm/
├── client/           # React + TypeScript frontend with Three.js
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── index.css
│       ├── components/
│       │   ├── GameScene.tsx
│       │   ├── MainMenu.tsx
│       │   └── game/
│       │       ├── Character.tsx
│       │       ├── GameWorld.tsx
│       │       └── LocalPlayerController.tsx
│       │   └── ui/
│       │       └── GameHUD.tsx
│       ├── hooks/
│       │   ├── useGameSocket.ts
│       │   └── useGameState.ts
│       ├── types/
│       │   └── index.ts
│       └── utils/
│           └── constants.ts
└── server/           # Node.js + Socket.io backend
    ├── package.json
    └── src/
        └── index.js

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup

**Client Setup**
```bash
cd client
npm install
npm run dev
```

**Server Setup (in another terminal)**
```bash
cd server
npm install
node src/index.js
```

**Access the Game**
- Open browser to: http://localhost:3000
- Server runs on: http://localhost:3001

## Features

- Multiplayer Support - Real-time gameplay with Socket.io
- Character Customization - 5 unique classes (Warrior, Mage, Rogue, Archer, Healer)
- Skill System - 15+ unique skills with cooldowns
- Party System - Form teams with other players
- Quest System - Complete objectives for rewards
- 3D World - Three.js powered graphics
- First-Person Controls - WASD movement with mouse look
- Real-time Chat - Global, party, and whisper chat

## Available Scripts

### Client
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

### Server
```bash
node src/index.js    # Start server
```

## Customization

### Adding New Characters
Edit `client/src/utils/constants.ts` and `server/src/index.js` to add new character presets.

### Adding New Skills
Add to the `SKILLS` object in both client and server files.

### Creating New Quests
Edit the `QUESTS` array in `server/src/index.js`.

## License

MIT License - Free to use, modify, and distribute.