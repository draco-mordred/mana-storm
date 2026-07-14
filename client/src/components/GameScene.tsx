import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { io, Socket } from 'socket.io-client';
import MainMenu from './MainMenu';
import GameHUD from './ui/GameHUD';
import Character from './game/Character';
import BuenaVillage from './game/BuenaVillage';
import type { CharacterType, Player, GameState } from '../types';
import { CHARACTER_PRESETS, BUena_VILLAGE } from '../utils/constants';

interface GameSceneProps {
  playerName: string;
  characterType: CharacterType;
  serverUrl: string;
  onBackToMenu: () => void;
}

// Store characters in a map for cleanup
const characterMeshes = new Map<string, THREE.Group>();

export default function GameScene({ playerName, characterType, serverUrl, onBackToMenu }: GameSceneProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [currentPlayerId, setCurrentPlayerId] = useState<string>('');
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [players, setPlayers] = useState<Record<string, Player>>({});
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const keysRef = useRef<Record<string, boolean>>({});
  const pointerLockRef = useRef(false);

  // Initialize Three.js scene and renderer
  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 10);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      if (cameraRef.current && sceneRef.current) {
        rendererRef.current?.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (cameraRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
      }
      rendererRef.current?.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      rendererRef.current?.dispose();
      // Cleanup character meshes
      characterMeshes.forEach((mesh, id) => {
        sceneRef.current?.remove(mesh);
      });
      characterMeshes.clear();
    };
  }, []);

  // Render Buena Village when scene is ready
  useEffect(() => {
    if (!sceneRef.current) return;
    
    // Add Buena Village to the scene
    // Note: BuenaVillage component handles its own rendering
    // We just need to make sure the scene is set up properly
  }, [sceneRef.current]);

  // Update character meshes when players change
  useEffect(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;

    // Remove old characters that no longer exist
    characterMeshes.forEach((mesh, id) => {
      if (!players[id]) {
        scene.remove(mesh);
        characterMeshes.delete(id);
      }
    });

    // Add/update new characters
    Object.entries(players).forEach(([id, player]) => {
      if (!characterMeshes.has(id)) {
        // Create Character component for each player
        // We use a div to mount the React component
        // But since we're in Three.js, we create the mesh directly
        const group = new THREE.Group();
        group.name = `character-${id}`;
        group.position.set(player.position.x, player.position.y, player.position.z);
        
        // For now, just create a simple placeholder
        // In a real implementation, we'd use the Character component
        const bodyGeometry = new THREE.CapsuleGeometry(0.3, 0.8, 4, 8);
        const preset = CHARACTER_PRESETS[player.character];
        const bodyMaterial = new THREE.MeshStandardMaterial({
          color: preset.color,
          roughness: 0.7,
          metalness: 0.1,
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.4;
        body.castShadow = true;
        body.receiveShadow = true;
        group.add(body);
        
        // Head
        const headGeometry = new THREE.SphereGeometry(0.25, 16, 16);
        const headMaterial = new THREE.MeshStandardMaterial({
          color: 0xffccaa,
          roughness: 0.8,
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 0.8 + 0.25;
        head.castShadow = true;
        group.add(head);
        
        scene.add(group);
        characterMeshes.set(id, group);
      }

      // Update position for all characters
      const mesh = characterMeshes.get(id);
      if (mesh) {
        const target = players[id];
        if (id === currentPlayerId) {
          // Local player - immediate update
          mesh.position.set(target.position.x, target.position.y, target.position.z);
        } else {
          // Remote player - smooth interpolation
          mesh.position.lerp(
            new THREE.Vector3(target.position.x, target.position.y, target.position.z),
            0.2
          );
        }
      }
    });
  }, [players, currentPlayerId]);

  // Initialize Socket.io connection
  useEffect(() => {
    const socket = io(serverUrl, {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to game server');
      socket.emit('join', { name: playerName, characterType });
    });

    socket.on('init', (initialState: GameState) => {
      console.log('Game initialized', initialState);
      setGameState(initialState);
      setPlayers(initialState.players);
      setCurrentPlayerId(initialState.currentPlayerId);
    });

    socket.on('update', (update: Partial<GameState>) => {
      setGameState(prev => prev ? { ...prev, ...update } : null);
      if (update.players) {
        setPlayers(update.players);
      }
    });

    socket.on('player-moved', (data: any) => {
      if (players[data.playerId]) {
        setPlayers(prev => ({
          ...prev,
          [data.playerId]: data.player
        }));
      }
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from game server');
    });

    socket.on('error', (error: string) => {
      console.error('Server error:', error);
    });

    return () => {
      socket.disconnect();
    };
  }, [playerName, characterType, serverUrl]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.code] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.code] = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Movement loop
  useEffect(() => {
    if (!socketRef.current || !players[currentPlayerId] || !pointerLockRef.current) return;
    const socket = socketRef.current;
    const player = players[currentPlayerId];
    const moveSpeed = 0.2;

    const moveLoop = setInterval(() => {
      const moveVector = { x: 0, y: 0, z: 0 };
      let isMoving = false;

      if (keysRef.current['KeyW'] || keysRef.current['ArrowUp']) {
        moveVector.z -= moveSpeed;
        isMoving = true;
      }
      if (keysRef.current['KeyS'] || keysRef.current['ArrowDown']) {
        moveVector.z += moveSpeed;
        isMoving = true;
      }
      if (keysRef.current['KeyA'] || keysRef.current['ArrowLeft']) {
        moveVector.x -= moveSpeed;
        isMoving = true;
      }
      if (keysRef.current['KeyD'] || keysRef.current['ArrowRight']) {
        moveVector.x += moveSpeed;
        isMoving = true;
      }
      if (keysRef.current['Space'] && player.position.y <= 0.1) {
        moveVector.y += 0.5;
        socket.emit('action', { type: 'jump' });
      }

      if (isMoving) {
        const newPosition = {
          x: player.position.x + moveVector.x,
          y: player.position.y + moveVector.y,
          z: player.position.z + moveVector.z,
        };
        socket.emit('move', { position: newPosition, animation: 'running' });
      } else {
        socket.emit('move', { animation: 'idle' });
      }
    }, 16);

    return () => clearInterval(moveLoop);
  }, [currentPlayerId, players]);

  // Mouse look
  useEffect(() => {
    if (!pointerLockRef.current || !cameraRef.current) return;
    const camera = cameraRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      camera.rotation.order = 'YXZ';
      camera.rotation.y -= e.movementX * 0.002;
      camera.rotation.x -= e.movementY * 0.002;
      camera.rotation.x = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, camera.rotation.x));
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [pointerLockRef.current, cameraRef.current]);

  // Pointer lock for first-person controls
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleClick = () => {
      if (!pointerLockRef.current) {
        canvas.requestPointerLock();
      }
    };

    const handlePointerLockChange = () => {
      pointerLockRef.current = document.pointerLockElement !== null;
    };

    canvas.addEventListener('click', handleClick);
    document.addEventListener('pointerlockchange', handlePointerLockChange);

    return () => {
      canvas.removeEventListener('click', handleClick);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      document.exitPointerLock();
    };
  }, []);

  const handleResumeGame = () => {
    setShowMenu(false);
  };

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (pointerLockRef.current) {
        document.exitPointerLock();
      }
      setShowMenu(!showMenu);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showMenu]);

  if (showMenu) {
    return (
      <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
        <canvas ref={canvasRef} style={{ display: 'block' }} />
        <MainMenu onResume={handleResumeGame} />
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <canvas ref={canvasRef} style={{ display: 'block' }} />
      {sceneRef.current && (
        <BuenaVillage scene={sceneRef.current} />
      )}
      {gameState && currentPlayerId && players[currentPlayerId] && (
        <GameHUD player={players[currentPlayerId]} onMenuClick={() => setShowMenu(true)} />
      )}
      <button
        onClick={() => onBackToMenu()}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          padding: '10px 20px',
          background: 'rgba(0, 0, 0, 0.7)',
          color: '#fff',
          border: '1px solid #00ffff',
          borderRadius: '5px',
          cursor: 'pointer',
          zIndex: 100,
        }}
      >
        Back to Menu
      </button>
    </div>
  );
}
