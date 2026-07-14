import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { io, Socket } from 'socket.io-client';
import MainMenu from './MainMenu';
import GameHUD from './ui/GameHUD';
import type { CharacterType, Player, GameState, MapObject, GameMap } from '../types';
import { CHARACTER_PRESETS, BUENA_VILLAGE, GAME_CONSTANTS, GRAPHIC_STYLE, WORLD_SETTINGS } from '../utils/constants';

interface GameSceneProps {
  playerName: string;
  characterType: CharacterType;
  serverUrl: string;
  onBackToMenu: () => void;
}

// Store map objects and characters for cleanup
const mapObjects = new Map<string, THREE.Object3D>();
const characterMeshes = new Map<string, THREE.Group>();

export default function GameScene({ playerName, characterType, serverUrl, onBackToMenu }: GameSceneProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [currentPlayerId, setCurrentPlayerId] = useState<string>('');
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [players, setPlayers] = useState<Record<string, Player>>({});
  const [currentMap, setCurrentMap] = useState<GameMap | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const keysRef = useRef<Record<string, boolean>>({});
  const pointerLockRef = useRef(false);
  const clockRef = useRef<THREE.Clock | null>(null);

  // ============================================
  // 🎨 CREATE CELL-SHADING MATERIAL (Naruto Storm Style)
  // ============================================
  const createCellShadingMaterial = useCallback((baseColor: number, outlineColor: number = 0x000000) => {
    // Create a custom shader material for cell-shading effect
    const material = new THREE.MeshPhongMaterial({
      color: baseColor,
      shininess: 30,
      specular: 0x333333,
    });
    
    // For better anime-style rendering, we'll use a custom approach
    // with multiple light sources and rim lighting
    return material;
  }, []);

  // ============================================
  // 🏡 CREATE HOUSE
  // ============================================
  const createHouse = useCallback((position: { x: number; y: number; z: number }, 
                                  rotation: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 },
                                  scale: { x: number; y: number; z: number } = { x: 1, y: 1, z: 1 },
                                  color: number = 0x8b4513) => {
    const group = new THREE.Group();
    group.position.set(position.x, position.y, position.z);
    group.rotation.set(rotation.x, rotation.y, rotation.z);
    group.scale.set(scale.x, scale.y, scale.z);

    // Main house body (cube)
    const bodyGeometry = new THREE.BoxGeometry(1, 1, 1);
    const bodyMaterial = createCellShadingMaterial(color);
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    body.receiveShadow = true;
    body.position.y = 0.5; // Center on bottom
    group.add(body);

    // Roof (pyramid on top)
    const roofGeometry = new THREE.ConeGeometry(0.7, 0.5, 4);
    const roofMaterial = createCellShadingMaterial(0x5d4037); // Darker brown for roof
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 1.25;
    roof.rotation.y = Math.PI / 4; // Rotate to match house
    roof.castShadow = true;
    group.add(roof);

    // Door
    const doorGeometry = new THREE.BoxGeometry(0.3, 0.4, 0.05);
    const doorMaterial = createCellShadingMaterial(0x3e2723); // Dark brown
    const door = new THREE.Mesh(doorGeometry, doorMaterial);
    door.position.set(0, 0.2, 0.51); // Slightly in front of house
    group.add(door);

    // Windows
    const windowGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.05);
    const windowMaterial = createCellShadingMaterial(0x87ceeb); // Light blue
    
    const window1 = new THREE.Mesh(windowGeometry, windowMaterial);
    window1.position.set(0.4, 0.6, 0.51);
    group.add(window1);
    
    const window2 = new THREE.Mesh(windowGeometry, windowMaterial);
    window2.position.set(-0.4, 0.6, 0.51);
    group.add(window2);

    return group;
  }, [createCellShadingMaterial]);

  // ============================================
  // 🌳 CREATE TREE
  // ============================================
  const createTree = useCallback((position: { x: number; y: number; z: number }, size: number = 1) => {
    const group = new THREE.Group();
    group.position.set(position.x, position.y, position.z);

    // Trunk (brown cylinder)
    const trunkGeometry = new THREE.CylinderGeometry(0.2 * size, 0.15 * size, 2 * size, 8);
    const trunkMaterial = createCellShadingMaterial(0x8b4513);
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.castShadow = true;
    trunk.position.y = 1 * size; // Center trunk
    group.add(trunk);

    // Leaves (green cone/sphere)
    const leavesGeometry = new THREE.ConeGeometry(0.8 * size, 2 * size, 16, 8, false, Math.PI / 4);
    // Rotate cone to be upright
    leavesGeometry.rotateX(Math.PI / 2);
    const leavesMaterial = createCellShadingMaterial(0x228b22); // Forest green
    const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
    leaves.position.y = 2.5 * size;
    leaves.castShadow = true;
    group.add(leaves);

    // Additional foliage for better tree shape
    const leaves2Geometry = new THREE.SphereGeometry(0.6 * size, 8, 8);
    const leaves2Material = createCellShadingMaterial(0x228b22);
    const leaves2 = new THREE.Mesh(leaves2Geometry, leaves2Material);
    leaves2.position.y = 2.2 * size;
    leaves2.castShadow = true;
    group.add(leaves2);

    return group;
  }, [createCellShadingMaterial]);

  // ============================================
  // 🛣️ CREATE PATH
  // ============================================
  const createPath = useCallback((position: { x: number; y: number; z: number }, 
                                rotation: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 },
                                scale: { x: number; y: number; z: number } = { x: 1, y: 1, z: 1 },
                                color: number = 0xd2b48c) => {
    const group = new THREE.Group();
    group.position.set(position.x, position.y, position.z);
    group.rotation.set(rotation.x, rotation.y, rotation.z);
    group.scale.set(scale.x, scale.y, scale.z);

    const pathGeometry = new THREE.BoxGeometry(1, 0.1, 1);
    const pathMaterial = createCellShadingMaterial(color);
    const path = new THREE.Mesh(pathGeometry, pathMaterial);
    path.receiveShadow = true;
    group.add(path);

    return group;
  }, [createCellShadingMaterial]);

  // ============================================
  // 💧 CREATE WELL
  // ============================================
  const createWell = useCallback((position: { x: number; y: number; z: number }, 
                               scale: { x: number; y: number; z: number } = { x: 1, y: 1, z: 1 },
                               color: number = 0x808080) => {
    const group = new THREE.Group();
    group.position.set(position.x, position.y, position.z);
    group.scale.set(scale.x, scale.y, scale.z);

    // Well base (cylinder)
    const baseGeometry = new THREE.CylinderGeometry(1, 1, 0.5, 16);
    const baseMaterial = createCellShadingMaterial(0x696969); // Dark gray
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.castShadow = true;
    base.receiveShadow = true;
    group.add(base);

    // Well wall (cylinder with hole)
    const wallGeometry = new THREE.CylinderGeometry(0.8, 0.8, 1.5, 16, 1, true);
    const wallMaterial = createCellShadingMaterial(0x808080);
    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
    wall.position.y = 0.75;
    wall.castShadow = true;
    group.add(wall);

    // Roof
    const roofGeometry = new THREE.ConeGeometry(1.2, 0.3, 16);
    const roofMaterial = createCellShadingMaterial(0x5d4037); // Brown
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 1.75;
    roof.rotation.x = Math.PI;
    roof.castShadow = true;
    group.add(roof);

    // Bucket rope
    const ropeGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1.2, 8);
    const ropeMaterial = createCellShadingMaterial(0x8b4513); // Brown
    const rope = new THREE.Mesh(ropeGeometry, ropeMaterial);
    rope.position.set(0, 0.6, 0);
    group.add(rope);

    return group;
  }, [createCellShadingMaterial]);

  // ============================================
  // 🪵 CREATE FENCE
  // ============================================
  const createFence = useCallback((position: { x: number; y: number; z: number }, 
                                rotation: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 },
                                scale: { x: number; y: number; z: number } = { x: 1, y: 1, z: 1 },
                                color: number = 0x8b4513) => {
    const group = new THREE.Group();
    group.position.set(position.x, position.y, position.z);
    group.rotation.set(rotation.x, rotation.y, rotation.z);

    // Fence segment length
    const segmentCount = Math.floor(scale.x / 2);
    
    for (let i = 0; i < segmentCount; i++) {
      const postGeometry = new THREE.BoxGeometry(0.1, scale.y, 0.1);
      const postMaterial = createCellShadingMaterial(color);
      const post = new THREE.Mesh(postGeometry, postMaterial);
      post.position.x = (i - segmentCount / 2 + 0.5) * 2;
      post.position.y = scale.y / 2;
      post.castShadow = true;
      group.add(post);

      // Horizontal rails
      const railGeometry = new THREE.BoxGeometry(1.8, 0.05, 0.05);
      const railMaterial = createCellShadingMaterial(color);
      
      const rail1 = new THREE.Mesh(railGeometry, railMaterial);
      rail1.position.set((i - segmentCount / 2 + 0.5) * 2, scale.y * 0.7, 0);
      group.add(rail1);

      const rail2 = new THREE.Mesh(railGeometry, railMaterial);
      rail2.position.set((i - segmentCount / 2 + 0.5) * 2, scale.y * 0.3, 0);
      group.add(rail2);
    }

    return group;
  }, [createCellShadingMaterial]);

  // ============================================
  // 🪨 CREATE ROCK
  // ============================================
  const createRock = useCallback((position: { x: number; y: number; z: number }, size: number = 1) => {
    const group = new THREE.Group();
    group.position.set(position.x, position.y, position.z);

    // Create irregular rock shape using multiple spheres
    const rockCount = 3 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < rockCount; i++) {
      const radius = 0.3 * size + Math.random() * 0.2 * size;
      const geometry = new THREE.SphereGeometry(radius, 8, 8);
      const material = createCellShadingMaterial(0x808080);
      const rock = new THREE.Mesh(geometry, material);
      rock.position.set(
        (Math.random() - 0.5) * size,
        radius,
        (Math.random() - 0.5) * size
      );
      rock.castShadow = true;
      group.add(rock);
    }

    return group;
  }, [createCellShadingMaterial]);

  // ============================================
  // 🌿 CREATE BUSH
  // ============================================
  const createBush = useCallback((position: { x: number; y: number; z: number }, size: number = 1) => {
    const group = new THREE.Group();
    group.position.set(position.x, position.y, position.z);

    // Multiple green spheres for bush
    const bushCount = 5 + Math.floor(Math.random() * 5);
    
    for (let i = 0; i < bushCount; i++) {
      const radius = 0.2 * size + Math.random() * 0.15 * size;
      const geometry = new THREE.SphereGeometry(radius, 6, 6);
      const greenShade = 0x228b22 + Math.floor(Math.random() * 0x202020);
      const material = createCellShadingMaterial(greenShade);
      const bush = new THREE.Mesh(geometry, material);
      bush.position.set(
        (Math.random() - 0.5) * size * 1.5,
        radius,
        (Math.random() - 0.5) * size * 1.5
      );
      bush.castShadow = true;
      group.add(bush);
    }

    return group;
  }, [createCellShadingMaterial]);

  // ============================================
  // 🏷️ CREATE SIGN
  // ============================================
  const createSign = useCallback((position: { x: number; y: number; z: number }, 
                               rotation: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 },
                               scale: { x: number; y: number; z: number } = { x: 1, y: 1, z: 1 }) => {
    const group = new THREE.Group();
    group.position.set(position.x, position.y, position.z);
    group.rotation.set(rotation.x, rotation.y, rotation.z);

    // Sign post
    const postGeometry = new THREE.CylinderGeometry(0.05, 0.05, scale.y, 8);
    const postMaterial = createCellShadingMaterial(0x8b4513);
    const post = new THREE.Mesh(postGeometry, postMaterial);
    post.position.y = scale.y / 2;
    post.castShadow = true;
    group.add(post);

    // Sign board
    const boardGeometry = new THREE.BoxGeometry(scale.x * 0.8, scale.y * 0.4, scale.z * 0.1);
    const boardMaterial = createCellShadingMaterial(0x8b4513);
    const board = new THREE.Mesh(boardGeometry, boardMaterial);
    board.position.y = scale.y * 0.8;
    board.castShadow = true;
    group.add(board);

    return group;
  }, [createCellShadingMaterial]);

  // ============================================
  // 👤 CREATE CHARACTER MESH (Rudeus Style)
  // ============================================
  const createCharacterMesh = useCallback((player: Player) => {
    const group = new THREE.Group();
    group.position.set(player.position.x, player.position.y, player.position.z);

    const preset = CHARACTER_PRESETS[player.character];
    
    // ========== BODY ==========
    // Torso (capsule shape for better proportions)
    const torsoGeometry = new THREE.CapsuleGeometry(0.25, 0.6, 4, 8);
    const torsoMaterial = createCellShadingMaterial(preset.color);
    const torso = new THREE.Mesh(torsoGeometry, torsoMaterial);
    torso.position.y = 0.3; // Center on capsule
    torso.castShadow = true;
    torso.receiveShadow = true;
    group.add(torso);

    // ========== HEAD ==========
    const headGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const headMaterial = createCellShadingMaterial(player.hairColor || preset.hairColor || 0xffccaa);
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 0.75;
    head.castShadow = true;
    group.add(head);

    // Face (slightly smaller sphere)
    const faceGeometry = new THREE.SphereGeometry(0.18, 16, 16);
    const faceMaterial = createCellShadingMaterial(0xffccaa); // Skin tone
    const face = new THREE.Mesh(faceGeometry, faceMaterial);
    face.position.y = 0.75;
    face.castShadow = true;
    group.add(face);

    // Hair (for Rudeus - short blue hair)
    if (player.character === 'rudeus' || player.hairColor === 0x4a90e2) {
      const hairGeometry = new THREE.SphereGeometry(0.22, 16, 16, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2);
      const hairMaterial = createCellShadingMaterial(0x4a90e2); // Rudeus blue hair
      const hair = new THREE.Mesh(hairGeometry, hairMaterial);
      hair.position.set(0, 0.85, -0.05);
      hair.rotation.x = -0.3;
      hair.castShadow = true;
      group.add(hair);
    }

    // ========== ARMS ==========
    // Left arm
    const armGeometry = new THREE.CapsuleGeometry(0.08, 0.4, 4, 8);
    const armMaterial = createCellShadingMaterial(preset.color);
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-0.3, 0.5, 0);
    leftArm.rotation.z = 0.3;
    leftArm.castShadow = true;
    group.add(leftArm);

    // Right arm
    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0.3, 0.5, 0);
    rightArm.rotation.z = -0.3;
    rightArm.castShadow = true;
    group.add(rightArm);

    // ========== LEGS ==========
    // Left leg
    const legGeometry = new THREE.CapsuleGeometry(0.1, 0.5, 4, 8);
    const legMaterial = createCellShadingMaterial(0x000000); // Dark pants
    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-0.15, 0, 0);
    leftLeg.castShadow = true;
    group.add(leftLeg);

    // Right leg
    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.15, 0, 0);
    rightLeg.castShadow = true;
    group.add(rightLeg);

    // ========== ROBE (For Rudeus/Mage) ==========
    if (player.character === 'rudeus' || player.character === 'mage') {
      const robeGeometry = new THREE.ConeGeometry(0.4, 0.8, 16, 1, false, Math.PI * 0.8);
      robeGeometry.rotateX(Math.PI / 2);
      const robeMaterial = createCellShadingMaterial(0xffffff); // White robe
      const robe = new THREE.Mesh(robeGeometry, robeMaterial);
      robe.position.set(0, 0.4, -0.1);
      robe.castShadow = true;
      group.add(robe);
    }

    // ========== STAFF (For Rudeus) ==========
    if (player.character === 'rudeus') {
      const staffGroup = new THREE.Group();
      
      // Staff pole
      const staffPoleGeometry = new THREE.CylinderGeometry(0.03, 0.03, 1.2, 8);
      const staffPoleMaterial = createCellShadingMaterial(0x8b4513); // Wooden staff
      const staffPole = new THREE.Mesh(staffPoleGeometry, staffPoleMaterial);
      staffPole.position.y = 0.6;
      staffPole.castShadow = true;
      staffGroup.add(staffPole);

      // Staff orb (blue for Rudeus)
      const staffOrbGeometry = new THREE.SphereGeometry(0.1, 16, 16);
      const staffOrbMaterial = createCellShadingMaterial(0x00bfff); // Bright blue
      const staffOrb = new THREE.Mesh(staffOrbGeometry, staffOrbMaterial);
      staffOrb.position.y = 1.45;
      staffOrb.castShadow = true;
      staffGroup.add(staffOrb);

      // Position staff in right hand
      staffGroup.position.set(0.4, 0, 0.1);
      staffGroup.rotation.z = -0.4;
      group.add(staffGroup);
    }

    // ========== NAME TAG ==========
    // Create a simple name tag above the character
    const nameTag = createNameTag(player.name, player.character === 'rudeus' ? 0x4a90e2 : 0xffffff);
    nameTag.position.y = 1.2;
    group.add(nameTag);

    // ========== HEALTH BAR ==========
    const healthBar = createHealthBar(player.health, player.maxHealth);
    healthBar.position.y = 1.1;
    group.add(healthBar);

    return group;
  }, [createCellShadingMaterial]);

  // ============================================
  // 🏷️ CREATE NAME TAG
  // ============================================
  const createNameTag = useCallback((text: string, color: number) => {
    const group = new THREE.Group();

    // Create canvas texture for text
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const context = canvas.getContext('2d')!;
    
    // Semi-transparent background
    context.fillStyle = 'rgba(0, 0, 0, 0.7)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Text
    context.font = 'Bold 20px Arial';
    context.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);
    
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(0.5, 0.125, 1);
    
    group.add(sprite);
    return group;
  }, []);

  // ============================================
  // ❤️ CREATE HEALTH BAR
  // ============================================
  const createHealthBar = useCallback((current: number, max: number) => {
    const group = new THREE.Group();
    const width = 0.8;
    const height = 0.05;
    const percentage = current / max;

    // Background
    const bgGeometry = new THREE.PlaneGeometry(width, height);
    const bgMaterial = new THREE.MeshBasicMaterial({ color: 0x333333, transparent: true, opacity: 0.8 });
    const bg = new THREE.Mesh(bgGeometry, bgMaterial);
    group.add(bg);

    // Foreground (health)
    const fgGeometry = new THREE.PlaneGeometry(width * percentage, height);
    const fgMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const fg = new THREE.Mesh(fgGeometry, fgMaterial);
    fg.position.x = (width * (percentage - 0.5));
    group.add(fg);

    return group;
  }, []);

  // ============================================
  // 🗺️ LOAD MAP
  // ============================================
  const loadMap = useCallback((map: GameMap) => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;

    // Clear existing map objects
    mapObjects.forEach((obj, id) => {
      scene.remove(obj);
    });
    mapObjects.clear();

    // Set scene background and fog
    scene.background = new THREE.Color(map.skyColor);
    scene.fog = new THREE.Fog(map.fogColor, 1, map.size.width * 0.5);

    // Create ground
    const groundGeometry = new THREE.PlaneGeometry(map.size.width, map.size.height);
    const groundMaterial = createCellShadingMaterial(map.groundColor);
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    mapObjects.set('ground', ground);

    // Create map objects
    map.objects.forEach((obj, index) => {
      let mesh: THREE.Object3D;

      switch (obj.type) {
        case 'house':
          mesh = createHouse(obj.position, obj.rotation, obj.scale, obj.color);
          break;
        case 'tree':
          mesh = createTree(obj.position, obj.size || 1);
          break;
        case 'path':
          mesh = createPath(obj.position, obj.rotation, obj.scale, obj.color);
          break;
        case 'well':
          mesh = createWell(obj.position, obj.scale, obj.color);
          break;
        case 'fence':
          mesh = createFence(obj.position, obj.rotation, obj.scale, obj.color);
          break;
        case 'sign':
          mesh = createSign(obj.position, obj.rotation, obj.scale);
          break;
        case 'rock':
          mesh = createRock(obj.position, obj.size || 1);
          break;
        case 'bush':
          mesh = createBush(obj.position, obj.size || 1);
          break;
        default:
          mesh = new THREE.Group();
      }

      mesh.name = `map-object-${index}`;
      scene.add(mesh);
      mapObjects.set(`obj-${index}`, mesh);
    });

    // Add ambient particles for anime effect
    addAnimeParticles(scene, map.size);

    setCurrentMap(map);
  }, [createHouse, createTree, createPath, createWell, createFence, createSign, createRock, createBush, createCellShadingMaterial]);

  // ============================================
  // ✨ ADD ANIME-STYLE PARTICLES
  // ============================================
  const addAnimeParticles = useCallback((scene: THREE.Scene, size: { width: number; height: number }) => {
    const particleCount = 50;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * size.width;
      positions[i * 3 + 1] = Math.random() * 10 + 5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * size.height;

      colors[i * 3] = Math.random();
      colors[i * 3 + 1] = Math.random();
      colors[i * 3 + 2] = Math.random();

      sizes[i] = Math.random() * 0.5 + 0.1;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    particleSystem.name = 'anime-particles';
    scene.add(particleSystem);
    mapObjects.set('particles', particleSystem);

    // Animate particles
    const animateParticles = () => {
      const pos = particles.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3 + 1] = (Math.sin(Date.now() * 0.001 + i) * 2) + 5;
      }
      particles.attributes.position.needsUpdate = true;
    };

    // Add to animation loop
    const animationLoop = setInterval(animateParticles, 50);

    return () => clearInterval(animationLoop);
  }, []);

  // ============================================
  // 🎮 INITIALIZE GAME
  // ============================================
  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize clock for animations
    clockRef.current = new THREE.Clock();

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Initialize camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 10);
    cameraRef.current = camera;

    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    rendererRef.current = renderer;

    // Set initial background
    scene.background = new THREE.Color(WORLD_SETTINGS.villageSkyColor);
    scene.fog = new THREE.Fog(WORLD_SETTINGS.villageFogColor, 1, BUENA_VILLAGE.size.width * 0.5);

    // Lighting - Anime style with multiple lights
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    // Main directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 100, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.left = -200;
    directionalLight.shadow.camera.right = 200;
    directionalLight.shadow.camera.top = 200;
    directionalLight.shadow.camera.bottom = -200;
    scene.add(directionalLight);

    // Rim light for anime effect
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.3);
    rimLight.position.set(-50, 20, -50);
    scene.add(rimLight);

    // Fill light
    const fillLight = new THREE.PointLight(0xffaa77, 0.5, 100);
    fillLight.position.set(0, 20, 0);
    scene.add(fillLight);

    // Load Buena Village map
    loadMap(BUENA_VILLAGE);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      const delta = clockRef.current?.getDelta() || 0;
      
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
      // Cleanup map objects
      mapObjects.forEach((obj) => {
        scene.remove(obj);
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          (obj.material as any)?.dispose();
        }
      });
      mapObjects.clear();
      // Cleanup character meshes
      characterMeshes.forEach((mesh) => {
        scene.remove(mesh);
      });
      characterMeshes.clear();
    };
  }, [loadMap]);

  // ============================================
  // 👥 UPDATE CHARACTERS
  // ============================================
  useEffect(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;

    // Remove old characters
    characterMeshes.forEach((mesh, id) => {
      if (!players[id]) {
        scene.remove(mesh);
        characterMeshes.delete(id);
      }
    });

    // Add/update characters
    Object.entries(players).forEach(([id, player]) => {
      if (!characterMeshes.has(id)) {
        const mesh = createCharacterMesh(player);
        mesh.name = `character-${id}`;
        scene.add(mesh);
        characterMeshes.set(id, mesh);
      }

      // Update position
      const mesh = characterMeshes.get(id);
      if (mesh) {
        const target = players[id];
        if (id === currentPlayerId) {
          // Local player - immediate
          mesh.position.set(target.position.x, target.position.y, target.position.z);
        } else {
          // Remote player - smooth
          mesh.position.lerp(
            new THREE.Vector3(target.position.x, target.position.y, target.position.z),
            0.2
          );
        }
      }
    });
  }, [players, currentPlayerId, createCharacterMesh]);

  // ============================================
  // 🔌 SOCKET.IO CONNECTION
  // ============================================
  useEffect(() => {
    const socket = io(serverUrl, {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ['websocket', 'polling'],
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ Connected to game server');
      socket.emit('join', { name: playerName, characterType });
    });

    socket.on('init', (initialState: GameState) => {
      console.log('🎮 Game initialized', initialState);
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

    socket.on('player-joined', (player: Player) => {
      console.log('👤 Player joined:', player.name);
      setPlayers(prev => ({ ...prev, [player.id]: player }));
    });

    socket.on('player-left', (playerId: string) => {
      console.log('👋 Player left:', playerId);
      setPlayers(prev => {
        const newPlayers = { ...prev };
        delete newPlayers[playerId];
        return newPlayers;
      });
      // Remove character mesh
      const mesh = characterMeshes.get(playerId);
      if (mesh && sceneRef.current) {
        sceneRef.current.remove(mesh);
        characterMeshes.delete(playerId);
      }
    });

    socket.on('player-moved', (data: any) => {
      if (data.player && players[data.player.id]) {
        setPlayers(prev => ({
          ...prev,
          [data.player.id]: data.player
        }));
      }
    });

    socket.on('disconnect', () => {
      console.log('❌ Disconnected from game server');
    });

    socket.on('error', (error: string) => {
      console.error('⚠️ Server error:', error);
    });

    return () => {
      socket.disconnect();
    };
  }, [playerName, characterType, serverUrl]);

  // ============================================
  // ⌨️ KEYBOARD CONTROLS
  // ============================================
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

  // ============================================
  // 🏃 MOVEMENT LOOP
  // ============================================
  useEffect(() => {
    if (!socketRef.current || !players[currentPlayerId] || !pointerLockRef.current) return;
    
    const socket = socketRef.current;
    const player = players[currentPlayerId];
    const moveSpeed = 0.2;

    const moveLoop = setInterval(() => {
      const moveVector = { x: 0, y: 0, z: 0 };
      let isMoving = false;

      // Movement keys
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
      
      // Jump
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
    }, 16); // ~60fps

    return () => clearInterval(moveLoop);
  }, [currentPlayerId, players]);

  // ============================================
  // 🖱️ MOUSE LOOK (First-Person)
  // ============================================
  useEffect(() => {
    if (!pointerLockRef.current || !cameraRef.current) return;
    
    const camera = cameraRef.current;
    const handleMouseMove = (e: MouseEvent) => {
      camera.rotation.order = 'YXZ';
      camera.rotation.y -= e.movementX * 0.002;
      camera.rotation.x -= e.movementY * 0.002;
      // Clamp vertical rotation to prevent over-rotation
      camera.rotation.x = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, camera.rotation.x));
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [pointerLockRef.current, cameraRef.current]);

  // ============================================
  // 🎯 POINTER LOCK (For First-Person Controls)
  // ============================================
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

    const handlePointerLockError = () => {
      console.error('Pointer lock error');
    };

    canvas.addEventListener('click', handleClick);
    document.addEventListener('pointerlockchange', handlePointerLockChange);
    document.addEventListener('pointerlockerror', handlePointerLockError);

    return () => {
      canvas.removeEventListener('click', handleClick);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      document.removeEventListener('pointerlockerror', handlePointerLockError);
      document.exitPointerLock();
    };
  }, []);

  // ============================================
  // ⌨️ ESCAPE KEY HANDLING
  // ============================================
  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (pointerLockRef.current) {
        document.exitPointerLock();
      }
      setShowMenu(!showMenu);
    }
  }, [showMenu]);

  useEffect(() => {
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [handleEscape]);

  // ============================================
  // 🎯 RENDER
  // ============================================
  if (showMenu) {
    return (
      <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
        <canvas ref={canvasRef} style={{ display: 'block' }} />
        <MainMenu onResume={() => setShowMenu(false)} />
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <canvas ref={canvasRef} style={{ display: 'block' }} />
      
      {/* HUD - Only show when game is active */}
      {gameState && currentPlayerId && players[currentPlayerId] && (
        <GameHUD player={players[currentPlayerId]} onMenuClick={() => setShowMenu(true)} />
      )}
      
      {/* Back to Menu Button */}
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
          fontFamily: 'Arial, sans-serif',
          fontSize: '14px',
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLButtonElement).style.background = 'rgba(0, 255, 255, 0.3)';
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLButtonElement).style.background = 'rgba(0, 0, 0, 0.7)';
        }}
      >
        Back to Menu
      </button>
      
      {/* Map Name Display */}
      {currentMap && (
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#00ffff',
            fontSize: '24px',
            fontWeight: 'bold',
            textShadow: '0 0 10px #00ffff, 0 0 20px #00ffff',
            zIndex: 100,
            background: 'rgba(0, 0, 0, 0.5)',
            padding: '5px 20px',
            borderRadius: '5px',
          }}
        >
          {currentMap.name}
        </div>
      )}
      
      {/* Loading indicator */}
      {!gameState && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#fff',
            fontSize: '24px',
            background: 'rgba(0, 0, 0, 0.8)',
            padding: '20px 40px',
            borderRadius: '10px',
            border: '2px solid #00ffff',
            zIndex: 1000,
          }}
        >
          Connecting to server...
        </div>
      )}
    </div>
  );
}