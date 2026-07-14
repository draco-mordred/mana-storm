import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { io, Socket } from 'socket.io-client';
import MainMenu from './MainMenu';
import GameHUD from './ui/GameHUD';
import type { CharacterType, Player, GameState } from '../types';
import { CHARACTER_PRESETS } from '../utils/constants';

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
    scene.background = new THREE.Color(0x87ceeb);
    scene.fog = new THREE.Fog(0x87ceeb, 1, 1000);
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

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(1000, 1000);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a5fb4,
      roughness: 0.8,
      metalness: 0.2,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Grid helper
    const gridHelper = new THREE.GridHelper(100, 100, 0x333333, 0x333333);
    scene.add(gridHelper);

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
        // Create new character mesh
        const group = new THREE.Group();
        group.name = id;
        group.position.set(player.position.x, player.position.y, player.position.z);
        
        // Body
        const bodyGeometry = new THREE.CapsuleGeometry(0.3, 0.8, 4, 8);
        const preset = CHARACTER_PRESETS[player.character];
        const bodyMaterial = new THREE.MeshStandardMaterial({
          color: preset.color,
          roughness: 0.7,
          metalness: 0.1,
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.castShadow = true;
        body.receiveShadow = true;
        body.position.y = 0.4;
        group.add(body);

        // Head
        const headGeometry = new THREE.SphereGeometry(0.25, 16, 16);
        const headMaterial = new THREE.MeshStandardMaterial({
          color: 0xffccaa,
          roughness: 0.8,
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 1.05;
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