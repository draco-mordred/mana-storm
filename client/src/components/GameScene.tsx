import React, { useState, useRef, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { ContactShadows, Html } from '@react-three/drei';
import { Mesh, Group, Vector3, MeshToonMaterial, Texture, NearestFilter, RGBAFormat, UnsignedByteType, DataTexture, Fog, Color } from 'three';
import { TextureLoader } from 'three/src/textures/TextureLoader';
import { io, Socket } from 'socket.io-client';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import type { CharacterPreset, Skill, Player, CharacterType } from '../types';
import { CHARACTER_PRESETS, SKILLS, GAME_CONSTANTS, WORLD_SETTINGS, TOON_GRADIENT, BUENA_VILLAGE, ASURA_KINGDOM, MAGIC_CITY_SHARIA } from '../utils/constants';

// Import model components
import { AbieModel } from './AbieModel';
import { StormcallerBow, ZephyrBlade, TempestBlade, DualBlades } from './Weapons';

// Import background images
import homeMenuBg from '../assets/images/home-menu-bg.jpg';
import storySceneBg from '../assets/images/story-scene-bg.jpg';
import manaStormLogo from '../assets/images/mana-storm-logo.png';

// Mobile touch controls hook
function useMobileControls(canvasRef) {
  const [touchControls, setTouchControls] = useState({
    moveJoystick: { active: false, x: 0, y: 0 },
    attackButton: false,
    skillButton: false,
    jumpButton: false,
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent) || window.innerWidth <= 768);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const handleTouchStart = (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      for (let i = 0; i < e.touches.length; i++) {
        const t = e.touches[i];
        const x = ((t.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((t.clientY - rect.top) / rect.height) * 2 + 1;
        if (x < 0) setTouchControls(p => ({ ...p, moveJoystick: { active: true, x, y } }));
        else if (y > 0.3) setTouchControls(p => ({ ...p, jumpButton: true }));
        else if (y > -0.3) setTouchControls(p => ({ ...p, attackButton: true }));
        else setTouchControls(p => ({ ...p, skillButton: true }));
      }
    };
    const handleTouchMove = (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const t = e.touches[0];
      if (t) {
        const x = ((t.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((t.clientY - rect.top) / rect.height) * 2 + 1;
        if (x < 0) setTouchControls(p => ({ ...p, moveJoystick: { active: true, x, y } }));
      }
    };
    const handleTouchEnd = () => setTouchControls({ moveJoystick: { active: false, x: 0, y: 0 }, attackButton: false, skillButton: false, jumpButton: false });
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [canvasRef]);
  return { touchControls, isMobile };
}

// Toon shading material
function createToonMaterial(color, gradientTexture) {
  return new MeshToonMaterial({ color, gradientMap: gradientTexture, flatShading: false });
}

function createGradientTexture() {
  const size = 64;
  const data = new Uint8Array(size * 4);
  for (let i = 0; i < size; i++) {
    const stride = i / (size - 1);
    const level = Math.floor(stride * (TOON_GRADIENT.stops.length - 1));
    const stop = TOON_GRADIENT.stops[level];
    data[i * 4] = (stop.color >> 16) & 0xff;
    data[i * 4 + 1] = (stop.color >> 8) & 0xff;
    data[i * 4 + 2] = stop.color & 0xff;
    data[i * 4 + 3] = 255;
  }
  const texture = new DataTexture(data, size, 1, RGBAFormat, UnsignedByteType);
  texture.minFilter = NearestFilter;
  texture.magFilter = NearestFilter;
  texture.needsUpdate = true;
  return texture;
}

// Background component with image
function BackgroundImage({ imageUrl }) {
  const texture = useLoader(TextureLoader, imageUrl);
  return (
    <mesh>
      <planeGeometry args={[50, 50]} />
      <meshBasicMaterial map={texture} transparent />
    </mesh>
  );
}

// Honkai Character Component (for non-abie characters)
function HonkaiCharacter({ player, gradientTexture }) {
  const groupRef = useRef(null);
  const preset = CHARACTER_PRESETS[player.characterType] || CHARACTER_PRESETS.rudeus;
  const healthPercent = (player.health / player.maxHealth) * 100;
  const healthBarColor = healthPercent > 50 ? '#10b981' : healthPercent > 25 ? '#f59e0b' : '#ef4444';

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.set(player.position[0], player.position[1] + Math.sin(state.clock.elapsedTime * 2 + player.id) * 0.01, player.position[2]);
      groupRef.current.rotation.set(player.rotation[0], player.rotation[1], player.rotation[2]);
    }
  });

  const getOutfitColor = () => {
    switch (preset.outfit) {
      case 'cyber_armor': return 0x222233;
      case 'quantum_robe': return 0x0066ff;
      case 'stealth_suit': return 0x003322;
      case 'tactical_gear': return 0x330066;
      case 'medical_armor': return 0x00ffff;
      case 'ranger_coat': return 0x8b4513;
      case 'leather_corset': return 0xA0522D;
      default: return preset.color || 0x444455;
    }
  };

  const skinMaterial = useMemo(() => createToonMaterial(0xf5e6d3, gradientTexture), [gradientTexture]);
  const outfitMaterial = useMemo(() => createToonMaterial(getOutfitColor(), gradientTexture), [gradientTexture]);
  const hairMaterial = useMemo(() => createToonMaterial(preset.hairColor || 0x4a90d9, gradientTexture), [gradientTexture, preset.hairColor]);

  return (
    <group ref={groupRef}>
      <group position={[0, 1.7, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.3, 0.35, 0.3]} />
          {skinMaterial}
        </mesh>
        <mesh position={[0, 0.15, 0.05]} castShadow receiveShadow>
          <boxGeometry args={[0.4, 0.25, 0.4]} />
          {hairMaterial}
        </mesh>
        <mesh position={[0.07, 0.05, 0.15]} castShadow>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshToonMaterial color={0xffffff} gradientMap={gradientTexture} emissive={0x00aaff} emissiveIntensity={0.3} />
        </mesh>
        <mesh position={[-0.07, 0.05, 0.15]} castShadow>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshToonMaterial color={0xffffff} gradientMap={gradientTexture} emissive={0x00aaff} emissiveIntensity={0.3} />
        </mesh>
      </group>
      <group position={[0, 1.3, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.45, 0.5, 0.25]} />
          {outfitMaterial}
        </mesh>
      </group>
      <group position={[-0.3, 1.25, 0]}>
        <mesh castShadow receiveShadow><boxGeometry args={[0.12, 0.4, 0.12]} />{outfitMaterial}</mesh>
      </group>
      <group position={[0.3, 1.25, 0]}>
        <mesh castShadow receiveShadow><boxGeometry args={[0.12, 0.4, 0.12]} />{outfitMaterial}</mesh>
      </group>
      <group position={[-0.12, 0.65, 0]}>
        <mesh castShadow receiveShadow><boxGeometry args={[0.13, 0.55, 0.13]} />{outfitMaterial}</mesh>
      </group>
      <group position={[0.12, 0.65, 0]}>
        <mesh castShadow receiveShadow><boxGeometry args={[0.13, 0.55, 0.13]} />{outfitMaterial}</mesh>
      </group>
      <Html position={[0, 2.2, 0]} center>
        <div style={{ background: 'rgba(0,0,0,0.7)', color: '#00ffff', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', border: '1px solid #00aaff' }}>
          {player.name}
        </div>
      </Html>
      <Html position={[0, 2.05, 0]} center>
        <div style={{ width: '80px', height: '6px', background: 'rgba(0,0,0,0.7)', border: '1px solid #333', borderRadius: '3px' }}>
          <div style={{ width: healthPercent + '%', height: '100%', background: healthBarColor, borderRadius: '2px', transition: 'width 0.2s ease' }} />
        </div>
      </Html>
    </group>
  );
}

// Abie Character Component with 3D model
function AbieCharacter({ player, gradientTexture }) {
  const groupRef = useRef<THREE.Group>(null);
  const preset = CHARACTER_PRESETS[player.characterType] || CHARACTER_PRESETS.abie;
  const healthPercent = (player.health / player.maxHealth) * 100;
  const healthBarColor = healthPercent > 50 ? '#10b981' : healthPercent > 25 ? '#f59e0b' : '#ef4444';
  
  // Determine animation based on player state
  const [animation, setAnimation] = useState<'Idle' | 'Run' | 'Attack_Bow' | 'Attack_Blades'>('Idle');
  const [weapon, setWeapon] = useState<'bow' | 'blades'>('bow');

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.set(player.position[0], player.position[1], player.position[2]);
      groupRef.current.rotation.set(player.rotation[0], player.rotation[1], player.rotation[2]);
    }
  });

  // Update animation based on player actions (you can expand this)
  useEffect(() => {
    // This would be connected to your game state
    // For now, we'll keep it simple
    setAnimation('Idle');
    setWeapon('bow');
  }, [player]);

  return (
    <group ref={groupRef}>
      <Suspense fallback={null}>
        <AbieModel
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
          scale={1}
          animation={animation}
          weapon={weapon}
          castShadow
          receiveShadow
        />
        {weapon === 'bow' && (
          <StormcallerBow
            position={[0.3, 0.2, -0.3]}
            rotation={[0, 0, -Math.PI / 4]}
            scale={0.8}
            castShadow
            receiveShadow
          />
        )}
        {weapon === 'blades' && (
          <DualBlades
            position={[0, 0.1, -0.2]}
            rotation={[0, 0, 0]}
            scale={0.8}
            bladeSpacing={0.4}
            castShadow
            receiveShadow
          />
        )}
      </Suspense>
      <Html position={[0, 2.2, 0]} center>
        <div style={{ background: 'rgba(0,0,0,0.7)', color: '#00ffff', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', border: '1px solid #00aaff' }}>
          {player.name}
        </div>
      </Html>
      <Html position={[0, 2.05, 0]} center>
        <div style={{ width: '80px', height: '6px', background: 'rgba(0,0,0,0.7)', border: '1px solid #333', borderRadius: '3px' }}>
          <div style={{ width: healthPercent + '%', height: '100%', background: healthBarColor, borderRadius: '2px', transition: 'width 0.2s ease' }} />
        </div>
      </Html>
    </group>
  );
}

// Menu Component
function MainMenu({ onStartGame }) {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: 'url(' + homeMenuBg + ')',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <img src={manaStormLogo} alt="Mana Storm" style={{
        width: '60%',
        maxWidth: '600px',
        marginBottom: '40px'
      }} />
      <button onClick={onStartGame} style={{
        padding: '15px 40px',
        fontSize: '24px',
        background: 'rgba(0, 170, 255, 0.8)',
        color: '#ffffff',
        border: '2px solid #00aaff',
        borderRadius: '10px',
        cursor: 'pointer',
        fontWeight: 'bold',
        boxShadow: '0 0 20px rgba(0, 170, 255, 0.5)'
      }}>
        START GAME
      </button>
    </div>
  );
}

interface GameSceneProps {
  onBackToMenu: () => void;
  playerName: string;
  serverUrl: string;
  characterType?: CharacterType;
}

export function GameScene({ onBackToMenu, playerName, serverUrl, characterType }: GameSceneProps) {
  const canvasRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [gameState, setGameState] = useState({
    players: {},
    currentArea: BUENA_VILLAGE,
    localPlayerId: '',
    isConnected: false
  });
  const [cameraMode, setCameraMode] = useState('third-person');
  const [inMenu, setInMenu] = useState(true);
  const gradientTexture = useMemo(() => createGradientTexture(), []);
  const { touchControls, isMobile } = useMobileControls(canvasRef);

  const startGame = () => setInMenu(false);

  useEffect(() => {
    const newSocket = io(serverUrl);
    setSocket(newSocket);
    newSocket.on('connect', () => {
      newSocket.emit('join', { playerName, characterType: characterType || 'rudeus', area: 'Buena Village' });
    });
    newSocket.on('gameState', (state) => setGameState(state));
    newSocket.on('disconnect', () => setGameState(p => ({ ...p, isConnected: false })));
    return () => newSocket.disconnect();
  }, [serverUrl, playerName, characterType]);

  useEffect(() => {
    if (!socket || !gameState.localPlayerId) return;
    const handleKeyDown = (e) => {
      const action = { type: 'input', inputType: e.code, playerId: gameState.localPlayerId };
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          action.direction = { x: 0, y: 0, z: -1 };
          break;
        case 'KeyS':
        case 'ArrowDown':
          action.direction = { x: 0, y: 0, z: 1 };
          break;
        case 'KeyA':
        case 'ArrowLeft':
          action.direction = { x: -1, y: 0, z: 0 };
          break;
        case 'KeyD':
        case 'ArrowRight':
          action.direction = { x: 1, y: 0, z: 0 };
          break;
        case 'Space':
          action.action = 'jump';
          break;
        case 'KeyF':
          action.action = 'attack';
          break;
        case 'Digit1':
          action.action = 'skill1';
          break;
        case 'Tab':
        case 'KeyV':
          setCameraMode(p => (p === 'third-person' ? 'first-person' : 'third-person'));
          return;
        case 'Escape':
          setInMenu(true);
          return;
      }
      if (action.direction || action.action) socket.emit('playerAction', action);
    };
    const handleKeyUp = (e) => {
      socket.emit('playerAction', { type: 'inputEnd', inputType: e.code, playerId: gameState.localPlayerId });
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [socket, gameState.localPlayerId]);

  useEffect(() => {
    if (!socket || !gameState.localPlayerId || !isMobile) return;
    const interval = setInterval(() => {
      if (touchControls.moveJoystick.active) {
        socket.emit('playerAction', {
          type: 'input',
          inputType: 'touchMove',
          playerId: gameState.localPlayerId,
          direction: { x: touchControls.moveJoystick.x * 2, y: 0, z: touchControls.moveJoystick.y * 2 }
        });
      }
      if (touchControls.attackButton)
        socket.emit('playerAction', { type: 'input', inputType: 'attack', playerId: gameState.localPlayerId, action: 'attack' });
      if (touchControls.skillButton)
        socket.emit('playerAction', { type: 'input', inputType: 'skill', playerId: gameState.localPlayerId, action: 'skill1' });
      if (touchControls.jumpButton)
        socket.emit('playerAction', { type: 'input', inputType: 'jump', playerId: gameState.localPlayerId, action: 'jump' });
    }, 100);
    return () => clearInterval(interval);
  }, [socket, gameState.localPlayerId, touchControls, isMobile]);

  function CameraSetup() {
    const { camera } = useThree();
    const localPlayer = gameState.players[gameState.localPlayerId];
    useFrame(() => {
      if (localPlayer && cameraMode === 'third-person') {
        camera.position.set(
          localPlayer.position[0] + GAME_CONSTANTS.CAMERA_OFFSET.x,
          localPlayer.position[1] + GAME_CONSTANTS.CAMERA_OFFSET.y,
          localPlayer.position[2] + GAME_CONSTANTS.CAMERA_OFFSET.z
        );
        camera.lookAt(localPlayer.position[0], localPlayer.position[1] + 1, localPlayer.position[2]);
      } else if (localPlayer && cameraMode === 'first-person') {
        camera.position.set(localPlayer.position[0], localPlayer.position[1] + 1.6, localPlayer.position[2]);
        camera.rotation.set(localPlayer.rotation[0], localPlayer.rotation[1], localPlayer.rotation[2]);
      }
      camera.updateProjectionMatrix();
    });
    return null;
  }

  function LightingSetup() {
    return (
      <>
        <ambientLight intensity={0.4} color={WORLD_SETTINGS.ambientLight} />
        <directionalLight position={[10, 20, 10]} intensity={0.8} color={WORLD_SETTINGS.directionalLight} castShadow shadow-mapSize={[2048, 2048]} />
        <pointLight position={[0, 10, 0]} color={0x00aaff} intensity={0.3} distance={50} />
        <pointLight position={[20, 10, 20]} color={0xff00aa} intensity={0.2} distance={50} />
      </>
    );
  }

  function PostProcessingEffects() {
    return (
      <EffectComposer>
        <Bloom blendFunction={BlendFunction.ADD} intensity={WORLD_SETTINGS.bloomIntensity} kernelSize={5} luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
      </EffectComposer>
    );
  }

  function FogSetup() {
    const { scene } = useThree();
    useEffect(() => {
      scene.fog = new Fog(WORLD_SETTINGS.fogColor, 1, GAME_CONSTANTS.WORLD_SIZE * 0.8);
      scene.background = new Color(WORLD_SETTINGS.skyColor);
    }, [scene]);
    return null;
  }

  const handleAreaChange = (areaName) => {
    if (socket) socket.emit('changeArea', { playerId: gameState.localPlayerId, area: areaName });
  };

  const playersArray = Object.values(gameState.players);
  const currentArea = gameState.currentArea || BUENA_VILLAGE;

  if (inMenu) {
    return <MainMenu onStartGame={startGame} />;
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas ref={canvasRef} shadows camera={{ fov: 60, near: 0.1, far: 1000 }}>
        <FogSetup />
        <LightingSetup />
        <CameraSetup />
        <Suspense fallback={null}>
          <BackgroundImage imageUrl={storySceneBg} />
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[GAME_CONSTANTS.WORLD_SIZE, GAME_CONSTANTS.WORLD_SIZE]} />
            <meshToonMaterial color={WORLD_SETTINGS.groundColor} gradientMap={gradientTexture} />
          </mesh>

          {currentArea.buildings && currentArea.buildings.map((b) => (
            <group key={b.id} position={[b.position.x, b.position.y || 0, b.position.z]}>
              <mesh castShadow receiveShadow>
                <boxGeometry args={[b.size.width, b.size.height, b.size.depth]} />
                <meshStandardMaterial color={b.color} emissive={b.emissive} emissiveIntensity={b.emissiveIntensity || 0.1} metalness={0.3} />
              </mesh>
              <Html position={[0, b.size.height / 2 + 0.5, 0]} center>
                <div style={{ background: 'rgba(0,0,0,0.6)', color: '#00ffff', padding: '2px 6px', borderRadius: '3px', fontSize: '10px' }}>{b.name}</div>
              </Html>
            </group>
          ))}
          {currentArea.trees && currentArea.trees.map((t, i) => (
            <group key={i} position={[t.position.x, t.position.y || 0, t.position.z]}>
              <mesh castShadow receiveShadow>
                <cylinderGeometry args={[t.radius * 0.3, t.radius * 0.2, t.height * 0.3, 8]} />
                <meshToonMaterial color={0x1a1a2e} gradientMap={gradientTexture} />
              </mesh>
              <mesh position={[0, t.height * 0.5, 0]} castShadow receiveShadow>
                <sphereGeometry args={[t.radius, 16, 16]} />
                <meshStandardMaterial color={t.color} emissive={t.emissive} emissiveIntensity={0.2} transparent opacity={0.8} />
              </mesh>
              {t.emissive && <pointLight position={[0, t.height * 0.5, 0]} color={t.emissive} intensity={0.5} distance={t.height * 2} />}
            </group>
          ))}
          {currentArea.sciFiDecorations && currentArea.sciFiDecorations.map((d, i) => {
            if (d.type === 'hologram') {
              return (
                <group key={i} position={[d.position.x, d.position.y, d.position.z]}>
                  <Html center>
                    <div style={{ color: 'rgb(' + ((d.color >> 16) & 0xff) + ', ' + ((d.color >> 8) & 0xff) + ', ' + (d.color & 0xff) + ')', fontSize: (d.size * 10) + 'px', fontWeight: 'bold', textShadow: '0 0 10px rgba(0, 255, 255, 0.8)' }}>
                      {d.text}
                    </div>
                  </Html>
                  <pointLight position={[0, 0, 0]} color={d.color} intensity={0.5} distance={20} />
                </group>
              );
            }
            if (d.type === 'energy-crystal') {
              return (
                <group key={i} position={[d.position.x, d.position.y, d.position.z]}>
                  <mesh castShadow receiveShadow>
                    <dodecahedronGeometry args={[d.size]} />
                    <meshStandardMaterial color={d.color} emissive={d.color} emissiveIntensity={d.glow ? 0.8 : 0.3} metalness={0.6} roughness={0.2} transparent opacity={0.9} />
                  </mesh>
                  <pointLight position={[0, 0, 0]} color={d.color} intensity={1} distance={15} />
                </group>
              );
            }
            return null;
          })}
          {playersArray.map((p) => {
            // Use AbieCharacter for abie type, HonkaiCharacter for others
            if (p.characterType === 'abie') {
              return <AbieCharacter key={p.id} player={p} gradientTexture={gradientTexture} />;
            }
            return <HonkaiCharacter key={p.id} player={p} gradientTexture={gradientTexture} />;
          })}
        </Suspense>
        <PostProcessingEffects />
        <ContactShadows frames={1} position={[0, -0.01, 0]} width={GAME_CONSTANTS.WORLD_SIZE} height={GAME_CONSTANTS.WORLD_SIZE} scale={10} resolution={512} far={45} />
      </Canvas>

      <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 1000 }}>
        <button onClick={onBackToMenu} style={{ padding: '8px 12px', background: 'rgba(255,0,0,0.4)', color: '#ff0000', border: '1px solid #ff0000', borderRadius: '4px', cursor: 'pointer' }}>Menu</button>
      </div>
      <div style={{ position: 'absolute', top: '60px', left: '20px', zIndex: 1000 }}>
        <button onClick={() => setCameraMode(p => p === 'third-person' ? 'first-person' : 'third-person')} style={{ padding: '8px 12px', background: 'rgba(0,170,255,0.4)', color: '#00aaff', border: '1px solid #00aaff', borderRadius: '4px', cursor: 'pointer' }}>
          {cameraMode === 'third-person' ? '1st Person' : '3rd Person'}
        </button>
      </div>
      <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '10px', zIndex: 1000 }}>
        {[BUENA_VILLAGE, ASURA_KINGDOM, MAGIC_CITY_SHARIA].map((area) => (
          <button key={area.name} onClick={() => handleAreaChange(area.name)} style={{
            padding: '8px 12px',
            background: currentArea.name === area.name ? 'rgba(0,170,255,0.6)' : 'rgba(0,0,0,0.6)',
            color: '#00ffff',
            border: '1px solid #00aaff',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            {area.name}
          </button>
        ))}
      </div>
      <div style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.7)', color: '#00ffff', padding: '10px 20px', borderRadius: '5px', fontSize: '14px', zIndex: 1000 }}>
        {currentArea?.name || 'Loading...'}
      </div>

      {isMobile && (
        <>
          <div style={{ position: 'absolute', bottom: '20px', left: '20px', width: '100px', height: '100px', background: 'rgba(0,0,0,0.3)', borderRadius: '50%', border: '2px solid #00aaff', zIndex: 1000 }}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', width: '20px', height: '20px', background: 'rgba(0,170,255,0.5)', borderRadius: '50%', transform: 'translate(-50%, -50%)' }} />
          </div>
          <div style={{ position: 'absolute', bottom: '20px', right: '20px', display: 'flex', flexDirection: 'column', gap: '10px', zIndex: 1000 }}>
            <button style={{ width: '50px', height: '50px', background: 'rgba(255,0,0,0.4)', border: '2px solid #ff0000', borderRadius: '50%', color: 'white', pointerEvents: 'none' }}>ATK</button>
            <button style={{ width: '50px', height: '50px', background: 'rgba(0,170,255,0.4)', border: '2px solid #00aaff', borderRadius: '50%', color: 'white', pointerEvents: 'none' }}>SKILL</button>
            <button style={{ width: '50px', height: '50px', background: 'rgba(0,255,0,0.4)', border: '2px solid #00ff00', borderRadius: '50%', color: 'white', pointerEvents: 'none' }}>JUMP</button>
          </div>
        </>
      )}

      {!gameState.isConnected && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(0,0,0,0.8)', color: '#00ffff', padding: '20px', borderRadius: '8px', fontSize: '16px', zIndex: 2000 }}>
          Connecting to server...
        </div>
      )}
    </div>
  );
}

export default GameScene;