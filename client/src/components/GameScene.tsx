import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { io, Socket } from 'socket.io-client';
import MainMenu from './MainMenu';
import GameHUD from './ui/GameHUD';
import type { CharacterType, Player, GameState } from '../types';
import { CHARACTER_PRESETS, BUENA_VILLAGE, DEFAULT_CHARACTER } from '../utils/constants';

interface GameSceneProps {
  playerName: string;
  characterType: CharacterType;
  serverUrl: string;
  onBackToMenu: () => void;
}

// Store characters and world objects in maps for cleanup
const characterMeshes = new Map<string, THREE.Group>();
const worldObjects: THREE.Object3D[] = [];

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
    scene.background = new THREE.Color(0x87ceeb); // Sky blue
    scene.fog = new THREE.Fog(0x87ceeb, 50, 200);
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
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // ============================================
    // 🌞 LIGHTING (Anime-style)
    // ============================================
    
    // Ambient light - base lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    // Main directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 100, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 200;
    directionalLight.shadow.camera.left = -100;
    directionalLight.shadow.camera.right = 100;
    directionalLight.shadow.camera.top = 100;
    directionalLight.shadow.camera.bottom = -100;
    scene.add(directionalLight);

    // Hemisphere light for sky/ground color
    const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.6);
    scene.add(hemisphereLight);

    // ============================================
    // 🌍 GROUND (Grassy terrain)
    // ============================================
    const groundGeometry = new THREE.PlaneGeometry(500, 500);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x3a5f0b, // Dark green
      roughness: 0.9,
      metalness: 0.1,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    worldObjects.push(ground);

    // ============================================
    // 🏡 BUENA VILLAGE BUILDINGS
    // ============================================
    BUENA_VILLAGE.buildings.forEach((building) => {
      createBuilding(building, scene);
    });

    // ============================================
    // 🌳 TREES
    // ============================================
    BUENA_VILLAGE.trees.forEach((tree) => {
      createTree(tree, scene);
    });

    // ============================================
    // 🛣️ PATHS
    // ============================================
    BUENA_VILLAGE.paths.forEach((path) => {
      createPath(path, scene);
    });

    // ============================================
    // 🪵 FENCES
    // ============================================
    BUENA_VILLAGE.fences.forEach((fence) => {
      createFence(fence, scene);
    });

    // ============================================
    // 🚪 GATES
    // ============================================
    BUENA_VILLAGE.gates.forEach((gate) => {
      createGate(gate, scene);
    });

    // ============================================
    // 💧 WELL (Village Center)
    // ============================================
    createWell(BUENA_VILLAGE.buildings.find(b => b.id === 'village-center'), scene);

    // ============================================
    // 🌿 DECORATIONS (Barrels, crates, etc.)
    // ============================================
    addVillageDecorations(scene);

    // ============================================
    // 🎭 SKYBOX (Simple gradient sky)
    // ============================================
    createSkybox(scene);

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
      // Cleanup world objects
      worldObjects.forEach(obj => {
        sceneRef.current?.remove(obj);
      });
      worldObjects.length = 0;
    };
  }, []);

  // Helper function to create buildings
  const createBuilding = (building: any, scene: THREE.Scene) => {
    const { position, size, color, roofColor, type } = building;
    const group = new THREE.Group();
    group.position.set(position.x, 0, position.z);
    
    // Walls
    const wallGeometry = new THREE.BoxGeometry(size.width, size.height, size.depth);
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.7,
      metalness: 0.2,
    });
    const walls = new THREE.Mesh(wallGeometry, wallMaterial);
    walls.castShadow = true;
    walls.receiveShadow = true;
    group.add(walls);

    // Roof (simple pyramid)
    const roofGeometry = new THREE.ConeGeometry(size.width * 0.7, size.height * 0.5, 4);
    const roofMaterial = new THREE.MeshStandardMaterial({
      color: roofColor,
      roughness: 0.8,
      metalness: 0.1,
    });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = size.height + size.height * 0.25;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    group.add(roof);

    // Door
    const doorGeometry = new THREE.BoxGeometry(1, 1.8, 0.2);
    const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const door = new THREE.Mesh(doorGeometry, doorMaterial);
    door.position.set(0, 0.9, size.depth / 2 + 0.1);
    group.add(door);

    // Windows
    const windowGeometry = new THREE.BoxGeometry(0.8, 0.6, 0.1);
    const windowMaterial = new THREE.MeshStandardMaterial({ color: 0xadd8e6 });
    const window1 = new THREE.Mesh(windowGeometry, windowMaterial);
    window1.position.set(size.width / 3, size.height / 2, size.depth / 2 + 0.1);
    group.add(window1);
    const window2 = new THREE.Mesh(windowGeometry, windowMaterial);
    window2.position.set(-size.width / 3, size.height / 2, size.depth / 2 + 0.1);
    group.add(window2);

    scene.add(group);
    worldObjects.push(group);
    
    return group;
  };

  // Helper function to create trees
  const createTree = (tree: any, scene: THREE.Scene) => {
    const { position, type, height, radius } = tree;
    const group = new THREE.Group();
    group.position.set(position.x, 0, position.z);
    
    // Trunk
    const trunkGeometry = new THREE.CylinderGeometry(radius * 0.4, radius * 0.3, height * 0.4, 8);
    const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.castShadow = true;
    group.add(trunk);
    
    // Leaves (conical shape for oak, more spherical for pine)
    const leavesGeometry = type === 'pine' 
      ? new THREE.ConeGeometry(radius * 1.5, height * 0.6, 16, 8)
      : new THREE.ConeGeometry(radius * 1.2, height * 0.5, 16, 8);
    const leavesMaterial = new THREE.MeshStandardMaterial({
      color: type === 'pine' ? 0x013220 : 0x228b22,
      roughness: 0.9,
      metalness: 0.1,
    });
    const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
    leaves.position.y = height * 0.4 + height * 0.3;
    leaves.castShadow = true;
    group.add(leaves);
    
    // Additional leaf layers for fuller trees
    if (type === 'oak') {
      const leaves2 = new THREE.Mesh(
        new THREE.ConeGeometry(radius * 1.5, height * 0.4, 16, 8),
        leavesMaterial
      );
      leaves2.position.y = height * 0.4 + height * 0.6;
      leaves2.scale.set(0.8, 0.8, 0.8);
      group.add(leaves2);
    }

    scene.add(group);
    worldObjects.push(group);
    
    return group;
  };

  // Helper function to create paths
  const createPath = (path: any, scene: THREE.Scene) => {
    const { start, end, width, color } = path;
    const direction = new THREE.Vector3(end.x - start.x, 0, end.z - start.z);
    const length = direction.length();
    const center = new THREE.Vector3(
      (start.x + end.x) / 2,
      0.01,
      (start.z + end.z) / 2
    );
    
    // Create path as a box
    const pathGeometry = new THREE.BoxGeometry(length, 0.05, width);
    const pathMaterial = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.9,
      metalness: 0.1,
    });
    const pathMesh = new THREE.Mesh(pathGeometry, pathMaterial);
    pathMesh.position.copy(center);
    pathMesh.rotation.y = Math.atan2(end.x - start.x, end.z - start.z);
    pathMesh.receiveShadow = true;
    
    scene.add(pathMesh);
    worldObjects.push(pathMesh);
  };

  // Helper function to create fences
  const createFence = (fence: any, scene: THREE.Scene) => {
    const { start, end, height, color } = fence;
    const direction = new THREE.Vector3(end.x - start.x, 0, end.z - start.z);
    const length = direction.length();
    const center = new THREE.Vector3(
      (start.x + end.x) / 2,
      height / 2,
      (start.z + end.z) / 2
    );
    
    // Create fence as a box
    const fenceGeometry = new THREE.BoxGeometry(length, height, 0.1);
    const fenceMaterial = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.7,
      metalness: 0.2,
    });
    const fenceMesh = new THREE.Mesh(fenceGeometry, fenceMaterial);
    fenceMesh.position.copy(center);
    fenceMesh.rotation.y = Math.atan2(end.x - start.x, end.z - start.z);
    fenceMesh.castShadow = true;
    
    scene.add(fenceMesh);
    worldObjects.push(fenceMesh);
  };

  // Helper function to create gates
  const createGate = (gate: any, scene: THREE.Scene) => {
    const { position, width, height, color } = gate;
    
    // Gate posts
    const postGeometry = new THREE.BoxGeometry(0.3, height, 0.3);
    const postMaterial = new THREE.MeshStandardMaterial({ color: color });
    
    const leftPost = new THREE.Mesh(postGeometry, postMaterial);
    leftPost.position.set(position.x - width / 2, height / 2, position.z);
    leftPost.castShadow = true;
    scene.add(leftPost);
    worldObjects.push(leftPost);
    
    const rightPost = new THREE.Mesh(postGeometry, postMaterial);
    rightPost.position.set(position.x + width / 2, height / 2, position.z);
    rightPost.castShadow = true;
    scene.add(rightPost);
    worldObjects.push(rightPost);
    
    // Gate crossbar
    const crossbarGeometry = new THREE.BoxGeometry(width, 0.2, 0.2);
    const crossbar = new THREE.Mesh(crossbarGeometry, postMaterial);
    crossbar.position.set(position.x, height - 0.1, position.z);
    crossbar.castShadow = true;
    scene.add(crossbar);
    worldObjects.push(crossbar);
  };

  // Helper function to create well
  const createWell = (building: any, scene: THREE.Scene) => {
    if (!building) return;
    
    const group = new THREE.Group();
    group.position.set(building.position.x, 0, building.position.z);
    
    // Well base (circular)
    const baseGeometry = new THREE.CylinderGeometry(1.5, 1.5, 0.5, 16);
    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.castShadow = true;
    group.add(base);
    
    // Well wall
    const wallGeometry = new THREE.CylinderGeometry(1.2, 1.2, 2, 16);
    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x696969 });
    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
    wall.position.y = 1.25;
    wall.castShadow = true;
    group.add(wall);
    
    // Well roof (conical)
    const roofGeometry = new THREE.ConeGeometry(1.5, 0.5, 16);
    const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 2.5;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    group.add(roof);
    
    // Rope and bucket
    const ropeGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 8);
    const ropeMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const rope = new THREE.Mesh(ropeGeometry, ropeMaterial);
    rope.position.set(0, 1.25, 0);
    group.add(rope);
    
    const bucketGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.2, 8);
    const bucketMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const bucket = new THREE.Mesh(bucketGeometry, bucketMaterial);
    bucket.position.set(0, 0.5, 0);
    group.add(bucket);
    
    scene.add(group);
    worldObjects.push(group);
  };

  // Helper function to add village decorations
  const addVillageDecorations = (scene: THREE.Scene) => {
    // Barrels
    const barrelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.5, 16);
    const barrelMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    
    const barrelPositions = [
      { x: 8, z: -3 },
      { x: -8, z: -3 },
      { x: 0, z: -12 },
      { x: 12, z: 8 },
      { x: -12, z: 8 },
    ];
    
    barrelPositions.forEach(pos => {
      const barrel = new THREE.Mesh(barrelGeometry, barrelMaterial);
      barrel.position.set(pos.x, 0.25, pos.z);
      barrel.castShadow = true;
      scene.add(barrel);
      worldObjects.push(barrel);
    });
    
    // Crates
    const crateGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const crateMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    
    const cratePositions = [
      { x: 6, z: -4 },
      { x: -6, z: -4 },
      { x: 2, z: -10 },
      { x: 10, z: 7 },
    ];
    
    cratePositions.forEach(pos => {
      const crate = new THREE.Mesh(crateGeometry, crateMaterial);
      crate.position.set(pos.x, 0.25, pos.z);
      crate.castShadow = true;
      scene.add(crate);
      worldObjects.push(crate);
    });
    
    // Hay bales
    const hayGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 8);
    const hayMaterial = new THREE.MeshStandardMaterial({ color: 0xdaa520 });
    
    const hayPositions = [
      { x: 14, z: -2 },
      { x: -14, z: -2 },
      { x: 4, z: -14 },
    ];
    
    hayPositions.forEach(pos => {
      const hay = new THREE.Mesh(hayGeometry, hayMaterial);
      hay.position.set(pos.x, 0.15, pos.z);
      hay.castShadow = true;
      scene.add(hay);
      worldObjects.push(hay);
    });
    
    // Torches/lanterns
    const torchGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 8);
    const torchMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    
    const torchPositions = [
      { x: 10, z: -7, side: 'left' },
      { x: -10, z: -7, side: 'right' },
      { x: 0, z: -17, side: 'front' },
    ];
    
    torchPositions.forEach(({ x, z, side }) => {
      const torch = new THREE.Mesh(torchGeometry, torchMaterial);
      const offset = side === 'left' ? -0.5 : side === 'right' ? 0.5 : 0;
      torch.position.set(x + offset, 1, z);
      torch.castShadow = true;
      scene.add(torch);
      worldObjects.push(torch);
      
      // Flame (glowing effect)
      const flameGeometry = new THREE.SphereGeometry(0.1, 8, 8);
      const flameMaterial = new THREE.MeshStandardMaterial({
        color: 0xff4500,
        emissive: 0xff4500,
        emissiveIntensity: 0.5,
      });
      const flame = new THREE.Mesh(flameGeometry, flameMaterial);
      flame.position.set(x + offset, 1.2, z);
      scene.add(flame);
      worldObjects.push(flame);
    });
  };

  // Helper function to create skybox
  const createSkybox = (scene: THREE.Scene) => {
    // Simple gradient sky using a large sphere
    const skyGeometry = new THREE.SphereGeometry(500, 32, 32);
    const skyMaterial = new THREE.MeshBasicMaterial({
      color: 0x87ceeb,
      side: THREE.BackSide,
    });
    const sky = new THREE.Mesh(skyGeometry, skyMaterial);
    scene.add(sky);
    worldObjects.push(sky);
  };

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
        
        // Get character preset
        const preset = CHARACTER_PRESETS[player.character] || CHARACTER_PRESETS[DEFAULT_CHARACTER];
        
        // Body (Rudeus has blue robe, others have their class colors)
        const bodyGeometry = new THREE.CapsuleGeometry(0.3, 0.8, 4, 8);
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

        // Hair (for Rudeus - blue hair)
        if (player.character === 'rudeus') {
          const hairGeometry = new THREE.BoxGeometry(0.35, 0.3, 0.35);
          const hairMaterial = new THREE.MeshStandardMaterial({
            color: 0x4a90d9,
            roughness: 0.8,
          });
          const hair = new THREE.Mesh(hairGeometry, hairMaterial);
          hair.position.set(0, 1.2, 0.05);
          hair.castShadow = true;
          group.add(hair);
        }

        // Class-specific accessories
        if (player.character === 'warrior') {
          const shieldGeometry = new THREE.BoxGeometry(0.4, 0.5, 0.1);
          const shieldMaterial = new THREE.MeshStandardMaterial({ color: 0xc0c0c0 });
          const shield = new THREE.Mesh(shieldGeometry, shieldMaterial);
          shield.position.set(-0.3, 0.6, 0);
          shield.rotation.y = Math.PI / 2;
          group.add(shield);
        } else if (player.character === 'mage') {
          const staffGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 8);
          const staffMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
          const staff = new THREE.Mesh(staffGeometry, staffMaterial);
          staff.position.set(0.2, 0.2, 0);
          staff.rotation.x = 0.2;
          group.add(staff);
        } else if (player.character === 'archer') {
          const bowGeometry = new THREE.BoxGeometry(0.6, 0.05, 0.1);
          const bowMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
          const bow = new THREE.Mesh(bowGeometry, bowMaterial);
          bow.position.set(0.25, 0.4, 0);
          group.add(bow);
        }

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
      
      {/* Village name display */}
      <div
        style={{
          position: 'absolute',
          top: '60px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0, 0, 0, 0.7)',
          padding: '10px 20px',
          borderRadius: '5px',
          border: '1px solid #00ffff',
          zIndex: 100,
        }}
      >
        <h2 style={{ margin: 0, color: '#00ffff', fontSize: '1.2rem' }}>
          {BUENA_VILLAGE.name}
        </h2>
        <p style={{ margin: '5px 0 0 0', color: '#aaaaaa', fontSize: '0.8rem' }}>
          {BUENA_VILLAGE.description}
        </p>
      </div>
    </div>
  );
}