# Mana Storm - Honkai Sci-Fi Multiplayer Game

A complete multiplayer action RPG game with **Honkai sci-fi anime art style**, built with **React, Three.js, and Socket.io**.

![Mana Storm](https://img.shields.io/badge/Status-Active-brightgreen) ![License](https://img.shields.io/badge/License-MIT-blue) ![React](https://img.shields.io/badge/React-18.2.0-61DAFB) ![Three.js](https://img.shields.io/badge/Three.js-0.160.0-000000)

---

## Features

### Gameplay
- Third-person action RPG with visible character
- Multiplayer support via Socket.io
- Character customization with 6 unique sci-fi classes
- Skill system with 24 unique abilities
- Party system for team play
- Quest system with interactive markers
- Three unique areas: Buena Village, Asura Kingdom, Magic City Sharia

### Visual Style (Honkai Sci-Fi)
- Cel-shading / Toon shading using MeshToonMaterial
- Bloom post-processing effects for neon glow
- Sci-fi environment elements:
  - Holographic displays
  - Energy crystals
  - Neon tubes
  - Floating platforms
  - Energy shields
- Dark blue/purple color palette with neon accents
- Cybernetic character enhancements

### Mobile Support
- Touch controls with virtual joystick
- Tap-to-attack and tap-to-skill
- Optimized networking for mobile devices
- Dynamic asset loading for performance
- Responsive UI for all screen sizes

### Characters
1. **Rudeus Greyrat** - The reincarnated prodigy mage
2. **Cyber Knight** - Cybernetically enhanced warrior
3. **Quantum Mage** - Master of quantum energies
4. **Phantom Agent** - Stealth operative with quantum cloaking
5. **Stellar Sniper** - Long-range energy specialist
6. **Bio-Synth** - Bio-engineered support specialist

### Areas
- **Buena Village** - Peaceful village with advanced technology
- **Asura Kingdom** - High-tech kingdom with towering spires
- **Magic City Sharia** - Futuristic city of advanced magic

---

## Quick Start

### Prerequisites
- Node.js v18+
- npm or yarn
- Git
- Modern browser with WebGL2 support

### Installation

#### 1. Clone the repository
```bash
git clone https://github.com/draco-mordred/mana-storm.git
cd mana-storm
```

#### 2. Install dependencies
```bash
cd client
npm install
cd ../server
npm install
cd ..
```

#### 3. Install new dependencies for Honkai sci-fi features
```bash
cd client
npm install @react-three/postprocessing postprocessing
```

#### 4. Build the client
```bash
cd client
npm run build
```

#### 5. Start the server
```bash
cd server
npm start
```

#### 6. Access the game
Open your browser and navigate to: http://localhost:3001

---

## Project Structure

```
mana-storm/
├── client/                          # React + Three.js frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── GameScene.tsx       # Main game scene with all features
│   │   │   ├── MainMenu.tsx        # Anime-style main menu
│   │   │   └── ui/
│   │   │       └── GameHUD.tsx     # Heads-up display
│   │   ├── types/
│   │   │   └── index.ts            # TypeScript interfaces
│   │   ├── utils/
│   │   │   └── constants.ts        # Game constants & world data
│   │   ├── App.tsx                 # Main app component
│   │   └── main.tsx                # Entry point
│   ├── package.json                # Client dependencies
│   └── vite.config.ts              # Vite configuration
│
└── server/                          # Node.js + Socket.io backend
    ├── src/
    │   └── index.js                # Main server with mobile optimization
    └── package.json                # Server dependencies
```

---

## Controls

### Desktop Controls
| Key | Action |
|-----|--------|
| W / Up | Move Forward |
| S / Down | Move Backward |
| A / Left | Move Left |
| D / Right | Move Right |
| Space | Jump |
| F | Attack |
| 1-4 | Use Skill 1-4 |
| Tab / V | Toggle Camera Mode |

### Mobile Controls
- **Left side of screen**: Virtual joystick for movement
- **Right side of screen**:
  - Top button: Jump
  - Middle button: Attack
  - Bottom button: Use Skill
- **Top of screen**: Area navigation buttons

### Camera Modes
- **Third-person**: Follows character from behind (default)
- **First-person**: Character eye view

---

## Configuration

### Environment Variables

Create a .env file in the server directory:
```env
PORT=3001
NODE_ENV=development
```

---

## Deployment

### Local Development
1. Start the server: cd server && npm start
2. Start the client: cd client && npm run dev
3. Open http://localhost:3001 in your browser

### Production Deployment

#### Option 1: Docker
```dockerfile
FROM node:18
WORKDIR /app
COPY server/package*.json ./server/
RUN cd server && npm install
COPY client/package*.json ./client/
RUN cd client && npm install
COPY client/ ./client/
RUN cd client && npm run build
COPY server/src ./server/src
EXPOSE 3001
CMD ["node", "./server/src/index.js"]
```

#### Option 2: Separate Servers
1. Build client: cd client && npm run build
2. Serve client: Use any static file server
3. Run server: cd server && npm start
4. Configure CORS in server/src/index.js

---

## Troubleshooting

### Common Issues

**Black screen on startup**
- Ensure WebGL2 is enabled in your browser
- Check browser console for errors
- Try Chrome or Firefox

**Connection failed**
- Verify server is running
- Check firewall settings
- Ensure CORS is configured correctly

**Poor performance on mobile**
- Close other apps
- Reduce graphics quality
- Use WiFi instead of mobile data

---

## License

MIT License

---

## Acknowledgments

- Three.js - 3D rendering library
- React Three Fiber - React renderer for Three.js
- Socket.io - Real-time communication
- Honkai Impact - Inspiration for sci-fi anime style

---

**Enjoy the game!**

*Built with React, Three.js, and Socket.io*
