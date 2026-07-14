import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { io, Socket } from 'socket.io-client';
import MainMenu from './MainMenu';
import GameHUD from './ui/GameHUD';
import type { CharacterType, Player, GameState, NPC, Monster, QuestMarker } from '../types';
import { CHARACTER_PRESETS, BUENA_VILLAGE, ASURA_KINGDOM, MAGIC_CITY_SHARIA, DEFAULT_CHARACTER, NPCS, MONSTERS, QUEST_MARKERS } from '../utils/constants';

interface GameSceneProps {
  playerName: string;
  characterType: CharacterType;
  serverUrl: string;
  onBackToMenu: () => void;
}

// Store characters and world objects in maps for cleanup
const characterMeshes = new Map<string, THREE.Group>();
const worldObjects: THREE.Object3D[] = [];
const npcMeshes = new Map<string, THREE.Group>();
const monsterMeshes = new Map<string, THREE.Group>();
const questMarkerMeshes: THREE.Object3D[] = [];

// Animation clock
const clock = new THREE.Clock();

export default function GameScene({ playerName, characterType, serverUrl, onBackToMenu }: GameSceneProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [currentPlayerId, setCurrentPlayerId] = useState<string>('');
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [players, setPlayers] = useState<Record<string, Player>>({});
  const [currentArea, setCurrentArea] = useState<string>('buena-village');
  const [cameraMode, setCameraMode] = useState<'third-person' | 'first-person'>('third-person');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const keysRef = useRef<Record<string, boolean>>({});
  const playerMeshRef = useRef<THREE.Group | null>(null);
  const cameraOffsetRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 2.5, -5));
  const cameraTargetRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 1, 0));

  // Get current area data
  const getCurrentArea = () => {
    switch (currentArea) {
      case 'asura-kingdom': return ASURA_KINGDOM;
      case 'magic-city-sharia': return MAGIC_CITY_SHARIA;
      default: return BUENA_VILLAGE;
    }
  };

  // Initialize Three.js scene and renderer
  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);
    scene.fog = new THREE.Fog(0x87ceeb, 50, 200);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      60,
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

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 100, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 200;
    scene.add(directionalLight);

    const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.6);
    scene.add(hemisphereLight);

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(1000, 1000);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x3a5f0b,
      roughness: 0.9,
      metalness: 0.1,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    worldObjects.push(ground);

    // Load current area
    loadArea(scene, currentArea);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const scene = sceneRef.current;
      const camera = cameraRef.current;
      const playerMesh = playerMeshRef.current;
      
      if (scene && camera) {
        // Update third-person camera
        if (playerMesh && cameraMode === 'third-person') {
          const playerPos = playerMesh.position.clone();
          const offset = cameraOffsetRef.current.clone();
          const cameraPos = playerPos.clone().add(offset);
          camera.position.lerp(cameraPos, 0.1);
          camera.lookAt(playerPos.clone().add(cameraTargetRef.current));
        }
        
        // Update animations
        updateAnimations(delta);
        
        rendererRef.current?.render(scene, camera);
      }
    };
    animate();

    const handleResize = () => {
      if (cameraRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
      }
      rendererRef.current?.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      rendererRef.current?.dispose();
      cleanupScene();
    };
  }, []);

  // Load area content
  const loadArea = (scene: THREE.Scene, areaId: string) => {
    cleanupWorldObjects();
    const area = getCurrentArea();
    
    // Buildings
    area.buildings?.forEach((building: any) => {
      if (building.size) {
        createBuilding(building, scene);
      } else if (building.id === 'well') {
        createWell(building, scene);
      }
    });

    // Trees
    area.trees?.forEach((tree: any) => createTree(tree, scene));
    
    // Paths
    area.paths?.forEach((path: any) => createPath(path, scene));
    
    // Fences
    area.fences?.forEach((fence: any) => createFence(fence, scene));
    
    // Gates
    area.gates?.forEach((gate: any) => createGate(gate, scene));
    
    // Well
    const wellBuilding = area.buildings?.find((b: any) => b.id === 'well');
    if (wellBuilding) createWell(wellBuilding, scene);
    
    // Decorations
    addVillageDecorations(scene);
    
    // NPCs
    NPCS.forEach((npc: NPC) => {
      if (npc.area === areaId) createNPC(npc, scene);
    });
    
    // Monsters
    MONSTERS.forEach((monster: Monster) => {
      if (monster.area === areaId) createMonster(monster, scene);
    });
    
    // Quest markers
    QUEST_MARKERS.forEach((marker: QuestMarker) => {
      if (marker.area === areaId) createQuestMarker(marker, scene);
    });
    
    // Skybox
    createSkybox(scene);
  };

  // Cleanup scene objects
  const cleanupScene = () => {
    characterMeshes.forEach((mesh) => sceneRef.current?.remove(mesh));
    characterMeshes.clear();
    cleanupWorldObjects();
    npcMeshes.forEach((mesh) => sceneRef.current?.remove(mesh));
    npcMeshes.clear();
    monsterMeshes.forEach((mesh) => sceneRef.current?.remove(mesh));
    monsterMeshes.clear();
    questMarkerMeshes.forEach(obj => sceneRef.current?.remove(obj));
    questMarkerMeshes.length = 0;
  };

  const cleanupWorldObjects = () => {
    worldObjects.forEach(obj => sceneRef.current?.remove(obj));
    worldObjects.length = 0;
  };

  // Animation state
  const animationStates = useRef<Record<string, { type: string; time: number; speed: number }>>({});

  const updateAnimations = (delta: number) => {
    characterMeshes.forEach((mesh, id) => {
      const state = animationStates.current[id];
      if (!state) return;
      state.time += delta * state.speed;
      const player = players[id];
      if (!player) return;
      
      const characterGroup = mesh;
      const body = characterGroup.getObjectByName('body') as THREE.Mesh;
      const arms = characterGroup.getObjectByName('arms') as THREE.Group;
      const legs = characterGroup.getObjectByName('legs') as THREE.Group;
      
      if (state.type === 'running') {
        if (legs) legs.rotation.x = Math.sin(state.time * 10) * 0.3;
        if (arms) arms.rotation.x = -Math.sin(state.time * 10) * 0.2;
        if (body) body.position.y = 0.4 + Math.sin(state.time * 15) * 0.05;
      } else if (state.type === 'attacking') {
        if (arms) arms.rotation.x = Math.sin(state.time * 20) * 1.5;
      } else {
        if (body) body.position.y = 0.4 + Math.sin(state.time * 2) * 0.02;
        if (arms) arms.rotation.x = Math.sin(state.time * 1.5) * 0.05;
      }
    });
  };

  // Create detailed character
  const createDetailedCharacter = (characterType: CharacterType, isLocalPlayer: boolean = false): THREE.Group => {
    const preset = CHARACTER_PRESETS[characterType] || CHARACTER_PRESETS[DEFAULT_CHARACTER];
    const group = new THREE.Group();
    group.name = characterType;
    
    // Body
    const bodyGroup = new THREE.Group();
    bodyGroup.name = 'body';
    const torsoGeometry = new THREE.CapsuleGeometry(0.3, 0.6, 4, 8);
    const torso = new THREE.Mesh(
      torsoGeometry,
      new THREE.MeshStandardMaterial({ color: preset.color, roughness: 0.7, metalness: 0.1 })
    );
    torso.position.y = 0.6;
    torso.castShadow = true;
    torso.receiveShadow = true;
    bodyGroup.add(torso);
    
    // Chest plate for warriors
    if (characterType === 'warrior') {
      const chest = new THREE.Mesh(
        new THREE.BoxGeometry(0.45, 0.3, 0.25),
        new THREE.MeshStandardMaterial({ color: 0x696969, roughness: 0.5, metalness: 0.8 })
      );
      chest.position.set(0, 0.75, 0.15);
      bodyGroup.add(chest);
    }
    
    // Robe for mages and Rudeus
    if (characterType === 'mage' || characterType === 'rudeus' || characterType === 'healer') {
      const robe = new THREE.Mesh(
        new THREE.ConeGeometry(0.45, 0.7, 16, 8),
        new THREE.MeshStandardMaterial({
          color: characterType === 'healer' ? 0xffffff : preset.color,
          roughness: 0.8, metalness: 0.1, side: THREE.DoubleSide
        })
      );
      robe.position.set(0, 0.35, 0);
      robe.rotation.x = Math.PI;
      bodyGroup.add(robe);
    }
    group.add(bodyGroup);
    
    // Legs
    const legsGroup = new THREE.Group();
    legsGroup.name = 'legs';
    legsGroup.position.y = 0.3;
    const leftLeg = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.12, 0.5, 4, 8),
      new THREE.MeshStandardMaterial({
        color: characterType === 'warrior' ? 0x808080 : 
               characterType === 'rogue' ? 0x222222 : preset.color,
        roughness: 0.7
      })
    );
    leftLeg.position.set(-0.12, 0, 0);
    leftLeg.castShadow = true;
    legsGroup.add(leftLeg);
    const rightLeg = leftLeg.clone();
    rightLeg.position.set(0.12, 0, 0);
    legsGroup.add(rightLeg);
    
    // Skirt for robe characters
    if (characterType === 'mage' || characterType === 'rudeus' || characterType === 'healer') {
      const skirt = new THREE.Mesh(
        new THREE.ConeGeometry(0.25, 0.3, 16, 8),
        new THREE.MeshStandardMaterial({ color: preset.color, roughness: 0.8, metalness: 0.1, side: THREE.DoubleSide })
      );
      skirt.position.set(0, 0.2, 0);
      skirt.rotation.x = Math.PI;
      legsGroup.add(skirt);
    }
    group.add(legsGroup);
    
    // Arms
    const armsGroup = new THREE.Group();
    armsGroup.name = 'arms';
    armsGroup.position.y = 0.85;
    const leftArm = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.1, 0.4, 4, 8),
      new THREE.MeshStandardMaterial({ color: 0xffccaa, roughness: 0.8 })
    );
    leftArm.position.set(-0.3, 0, 0);
    leftArm.rotation.z = Math.PI / 4;
    leftArm.castShadow = true;
    armsGroup.add(leftArm);
    const rightArm = leftArm.clone();
    rightArm.position.set(0.3, 0, 0);
    rightArm.rotation.z = -Math.PI / 4;
    armsGroup.add(rightArm);
    
    // Sleeves
    if (characterType === 'mage' || characterType === 'rudeus' || characterType === 'healer') {
      const leftSleeve = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.12, 0.45, 4, 8),
        new THREE.MeshStandardMaterial({ color: preset.color, roughness: 0.8 })
      );
      leftSleeve.position.set(-0.3, 0, 0);
      leftSleeve.rotation.z = Math.PI / 4;
      armsGroup.add(leftSleeve);
      const rightSleeve = leftSleeve.clone();
      rightSleeve.position.set(0.3, 0, 0);
      rightSleeve.rotation.z = -Math.PI / 4;
      armsGroup.add(rightSleeve);
    }
    group.add(armsGroup);
    
    // Head
    const headGroup = new THREE.Group();
    headGroup.position.y = 1.15;
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xffccaa, roughness: 0.8 })
    );
    head.castShadow = true;
    headGroup.add(head);
    
    const face = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xffddbb, roughness: 0.8 })
    );
    face.position.z = 0.03;
    headGroup.add(face);
    
    // Hair
    createHair(characterType, headGroup);
    
    // Eyes
    const leftEye = new THREE.Mesh(
      new THREE.SphereGeometry(0.03, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0x000000 })
    );
    leftEye.position.set(-0.07, 0.02, 0.18);
    headGroup.add(leftEye);
    const rightEye = leftEye.clone();
    rightEye.position.set(0.07, 0.02, 0.18);
    headGroup.add(rightEye);
    
    // Nose
    const nose = new THREE.Mesh(
      new THREE.ConeGeometry(0.02, 0.06, 8),
      new THREE.MeshStandardMaterial({ color: 0xffccaa })
    );
    nose.position.set(0, -0.02, 0.18);
    nose.rotation.x = Math.PI / 2;
    headGroup.add(nose);
    group.add(headGroup);
    
    // Hats & Accessories
    if (characterType === 'mage') {
      const hat = new THREE.Mesh(
        new THREE.ConeGeometry(0.25, 0.35, 16, 8),
        new THREE.MeshStandardMaterial({ color: 0x000080, roughness: 0.8 })
      );
      hat.position.set(0, 0.35, 0);
      hat.rotation.x = Math.PI;
      headGroup.add(hat);
      const brim = new THREE.Mesh(
        new THREE.TorusGeometry(0.28, 0.03, 16, 32),
        new THREE.MeshStandardMaterial({ color: 0x000080 })
      );
      brim.position.set(0, 0.25, 0);
      brim.rotation.x = Math.PI / 2;
      headGroup.add(brim);
    } else if (characterType === 'healer') {
      const circlet = new THREE.Mesh(
        new THREE.TorusGeometry(0.24, 0.02, 16, 32),
        new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9 })
      );
      circlet.position.set(0, 0.1, 0);
      circlet.rotation.x = Math.PI / 2;
      headGroup.add(circlet);
    }
    
    // Weapons
    createWeapons(characterType, group);
    
    // Footwear
    const leftFoot = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 0.08, 0.25),
      new THREE.MeshStandardMaterial({ color: 0x8b4513 })
    );
    leftFoot.position.set(-0.12, 0.05, 0);
    legsGroup.add(leftFoot);
    const rightFoot = leftFoot.clone();
    rightFoot.position.set(0.12, 0.05, 0);
    legsGroup.add(rightFoot);
    
    // Outline for local player
    if (isLocalPlayer) {
      const outline = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.35, 0.85, 4, 8),
        new THREE.MeshBasicMaterial({
          color: 0x00ffff,
          wireframe: true,
          transparent: true,
          opacity: 0.3,
        })
      );
      outline.position.y = 0.425;
      outline.scale.set(1.05, 1.05, 1.05);
      group.add(outline);
    }
    
    return group;
  };

  const createHair = (characterType: CharacterType, parent: THREE.Group) => {
    const preset = CHARACTER_PRESETS[characterType];
    const hairColor = preset.hairColor || 0x000000;
    
    if (characterType === 'rudeus') {
      const mainHair = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 0.25, 0.35),
        new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.8 })
      );
      mainHair.position.set(0, 0.12, 0.05);
      parent.add(mainHair);
      const bangs = new THREE.Mesh(
        new THREE.BoxGeometry(0.25, 0.15, 0.1),
        new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.8 })
      );
      bangs.position.set(0, 0.05, 0.18);
      parent.add(bangs);
      const sideHairL = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.2, 0.1),
        new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.8 })
      );
      sideHairL.position.set(-0.18, 0, 0);
      parent.add(sideHairL);
      const sideHairR = sideHairL.clone();
      sideHairR.position.set(0.18, 0, 0);
      parent.add(sideHairR);
    } else if (characterType === 'warrior') {
      const hair = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.12, 0.3),
        new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.8 })
      );
      hair.position.set(0, 0.1, 0);
      parent.add(hair);
    } else if (characterType === 'mage') {
      const hair = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.25, 0.4, 4, 8),
        new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.8 })
      );
      hair.position.set(0, -0.15, 0);
      hair.rotation.x = 0.2;
      parent.add(hair);
    } else if (characterType === 'rogue') {
      const hair = new THREE.Mesh(
        new THREE.ConeGeometry(0.2, 0.15, 16, 8),
        new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.8 })
      );
      hair.position.set(0, 0.15, 0);
      hair.rotation.x = Math.PI;
      parent.add(hair);
    } else if (characterType === 'archer') {
      const hair = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 0.3, 16),
        new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.8 })
      );
      hair.position.set(0, 0.1, -0.15);
      parent.add(hair);
      const tie = new THREE.Mesh(
        new THREE.TorusGeometry(0.11, 0.01, 8, 16),
        new THREE.MeshStandardMaterial({ color: 0x000000 })
      );
      tie.position.set(0, 0, -0.15);
      parent.add(tie);
    } else if (characterType === 'healer') {
      const hair = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.22, 0.45, 4, 8),
        new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.8 })
      );
      hair.position.set(0, -0.18, 0);
      hair.rotation.x = 0.15;
      parent.add(hair);
    }
  };

  const createWeapons = (characterType: CharacterType, parent: THREE.Group) => {
    if (characterType === 'warrior') {
      const swordGroup = new THREE.Group();
      swordGroup.position.set(0.2, 0.3, 0);
      swordGroup.rotation.set(0, 0, -Math.PI / 4);
      const blade = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 0.8, 0.5),
        new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 0.9 })
      );
      blade.position.y = 0.4;
      swordGroup.add(blade);
      const hilt = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.15, 0.1),
        new THREE.MeshStandardMaterial({ color: 0x8b4513 })
      );
      hilt.position.y = 0;
      swordGroup.add(hilt);
      const shield = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 0.5, 0.1),
        new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 0.8 })
      );
      shield.position.set(-0.3, 0.3, 0.2);
      shield.rotation.y = Math.PI / 4;
      parent.add(shield);
      parent.add(swordGroup);
    } else if (characterType === 'mage' || characterType === 'rudeus') {
      const staffGroup = new THREE.Group();
      staffGroup.position.set(0.15, -0.1, 0);
      staffGroup.rotation.set(0.2, 0, 0);
      const shaft = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.03, 1.8, 8),
        new THREE.MeshStandardMaterial({ color: 0x8b4513 })
      );
      staffGroup.add(shaft);
      const gem = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 0.5 })
      );
      gem.position.y = 0.9;
      staffGroup.add(gem);
      parent.add(staffGroup);
    } else if (characterType === 'rogue') {
      const daggerL = new THREE.Group();
      daggerL.position.set(-0.2, 0.2, 0);
      daggerL.rotation.set(0, 0, Math.PI / 4);
      const bladeL = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 0.2, 0.3),
        new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 0.9 })
      );
      daggerL.add(bladeL);
      const hiltL = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.05, 0.1),
        new THREE.MeshStandardMaterial({ color: 0x8b4513 })
      );
      hiltL.position.y = -0.1;
      daggerL.add(hiltL);
      const daggerR = daggerL.clone();
      daggerR.position.set(0.2, 0.2, 0);
      daggerR.rotation.z = -Math.PI / 4;
      parent.add(daggerL);
      parent.add(daggerR);
    } else if (characterType === 'archer') {
      const bowGroup = new THREE.Group();
      bowGroup.position.set(0.25, 0.35, 0);
      bowGroup.rotation.set(0, Math.PI / 2, 0);
      const bow = new THREE.Mesh(
        new THREE.BoxGeometry(0.7, 0.05, 0.1),
        new THREE.MeshStandardMaterial({ color: 0x8b4513 })
      );
      bowGroup.add(bow);
      const string = new THREE.Mesh(
        new THREE.BoxGeometry(0.65, 0.01, 0.01),
        new THREE.MeshStandardMaterial({ color: 0x000000 })
      );
      string.position.z = 0.06;
      bowGroup.add(string);
      parent.add(bowGroup);
      
      const quiverGroup = new THREE.Group();
      quiverGroup.position.set(-0.2, 0.4, 0);
      quiverGroup.rotation.set(0, 0, Math.PI / 2);
      const quiver = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 0.3, 16),
        new THREE.MeshStandardMaterial({ color: 0x8b4513 })
      );
      quiverGroup.add(quiver);
      for (let i = 0; i < 3; i++) {
        const arrow = new THREE.Mesh(
          new THREE.BoxGeometry(0.2, 0.02, 0.02),
          new THREE.MeshStandardMaterial({ color: 0x8b4513 })
        );
        arrow.position.set(0, 0, i * 0.1 - 0.1);
        quiverGroup.add(arrow);
      }
      parent.add(quiverGroup);
    } else if (characterType === 'healer') {
      const staffGroup = new THREE.Group();
      staffGroup.position.set(0.1, -0.1, 0);
      staffGroup.rotation.set(0.15, 0, 0);
      const shaft = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.025, 1.6, 8),
        new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.8 })
      );
      staffGroup.add(shaft);
      const orb = new THREE.Mesh(
        new THREE.SphereGeometry(0.06, 16, 16),
        new THREE.MeshStandardMaterial({
          color: 0x00ffff,
          emissive: 0x00ffff,
          emissiveIntensity: 0.5,
          transparent: true,
          opacity: 0.9
        })
      );
      orb.position.y = 0.8;
      staffGroup.add(orb);
      parent.add(staffGroup);
    }
  };

  const createBuilding = (building: any, scene: THREE.Scene) => {
    const { position, size, color, roofColor } = building;
    if (!size || !size.width || !size.height || !size.depth) {
      console.warn('Building missing size:', building.id);
      return null;
    }
    
    const group = new THREE.Group();
    group.position.set(position.x, 0, position.z);
    
    const wallGeometry = new THREE.BoxGeometry(size.width, size.height, size.depth);
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: color || 0x8b4513,
      roughness: 0.7,
      metalness: 0.2,
    });
    const walls = new THREE.Mesh(wallGeometry, wallMaterial);
    walls.castShadow = true;
    walls.receiveShadow = true;
    group.add(walls);
    
    const roofGeometry = new THREE.ConeGeometry(size.width * 0.7, size.height * 0.5, 4);
    const roofMaterial = new THREE.MeshStandardMaterial({
      color: roofColor || 0x654321,
      roughness: 0.8,
      metalness: 0.1,
    });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = size.height + size.height * 0.25;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    group.add(roof);
    
    const door = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1.8, 0.2),
      new THREE.MeshStandardMaterial({ color: 0x8b4513 })
    );
    door.position.set(0, 0.9, size.depth / 2 + 0.1);
    group.add(door);
    
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

  const createNPC = (npc: NPC, scene: THREE.Scene) => {
    const group = new THREE.Group();
    group.position.set(npc.position.x, 0, npc.position.z);
    group.name = `npc-${npc.id}`;
    
    const characterGroup = createDetailedCharacter(npc.characterType as CharacterType);
    characterGroup.scale.set(0.9, 0.9, 0.9);
    group.add(characterGroup);
    
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 64;
    const context = canvas.getContext('2d')!;
    context.fillStyle = 'rgba(0, 0, 0, 0.7)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = '14px Arial';
    context.fillStyle = '#00ffff';
    context.textAlign = 'center';
    context.fillText(npc.name, canvas.width / 2, canvas.height / 2);
    
    const texture = new THREE.CanvasTexture(canvas);
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture }));
    sprite.position.y = 1.8; sprite.scale.set(0.5, 0.25, 1);
    group.add(sprite);
    
    scene.add(group);
    npcMeshes.set(npc.id, group);
    return group;
  };

  const createMonster = (monster: Monster, scene: THREE.Scene) => {
    const group = new THREE.Group();
    group.position.set(monster.position.x, 0, monster.position.z);
    group.name = `monster-${monster.id}`;
    
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 1.2, 0.6),
      new THREE.MeshStandardMaterial({
        color: monster.color || 0xff0000,
        roughness: 0.7,
        metalness: 0.1,
      })
    );
    body.position.y = 0.6; body.castShadow = true;
    group.add(body);
    
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.35, 16, 16),
      new THREE.MeshStandardMaterial({ color: monster.color || 0xff0000, roughness: 0.8 })
    );
    head.position.y = 1.45; head.castShadow = true;
    group.add(head);
    
    const leftEye = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 8, 8),
      new THREE.MeshStandardMaterial({
        color: 0xffff00,
        emissive: 0xffff00,
        emissiveIntensity: 0.5,
      })
    );
    leftEye.position.set(-0.12, 1.48, 0.25);
    group.add(leftEye);
    const rightEye = leftEye.clone();
    rightEye.position.set(0.12, 1.48, 0.25);
    group.add(rightEye);
    
    for (let i = 0; i < 2; i++) {
      const leg = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 0.6, 0.2),
        new THREE.MeshStandardMaterial({ color: monster.color || 0xff0000 })
      );
      leg.position.set(i === 0 ? -0.2 : 0.2, 0.3, 0);
      leg.castShadow = true;
      group.add(leg);
    }
    
    for (let i = 0; i < 2; i++) {
      const arm = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 0.5, 0.15),
        new THREE.MeshStandardMaterial({ color: monster.color || 0xff0000 })
      );
      arm.position.set(i === 0 ? -0.4 : 0.4, 0.85, 0);
      arm.castShadow = true;
      group.add(arm);
    }
    
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 64;
    const context = canvas.getContext('2d')!;
    context.fillStyle = 'rgba(255, 0, 0, 0.7)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = '14px Arial';
    context.fillStyle = '#ffffff';
    context.textAlign = 'center';
    context.fillText(monster.name, canvas.width / 2, canvas.height / 2);
    const texture = new THREE.CanvasTexture(canvas);
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture }));
    sprite.position.y = 1.8; sprite.scale.set(0.5, 0.25, 1);
    group.add(sprite);
    
    scene.add(group);
    monsterMeshes.set(monster.id, group);
    return group;
  };

  const createQuestMarker = (marker: QuestMarker, scene: THREE.Scene) => {
    const group = new THREE.Group();
    group.position.set(marker.position.x, 0, marker.position.z);
    
    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 3, 8),
      new THREE.MeshStandardMaterial({ color: 0xffd700 })
    );
    pole.position.y = 1.5;
    group.add(pole);
    
    const flag = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.2, 0.01),
      new THREE.MeshStandardMaterial({ color: marker.completed ? 0x00ff00 : 0xff0000 })
    );
    flag.position.y = 2.8;
    flag.rotation.y = Math.sin(Date.now() * 0.001) * 0.2;
    group.add(flag);
    
    const icon = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.2, 0.01),
      new THREE.MeshStandardMaterial({ color: 0xffffff })
    );
    icon.position.set(0, 2.8, 0.02);
    group.add(icon);
    
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 128;
    const context = canvas.getContext('2d')!;
    context.fillStyle = 'rgba(0, 0, 0, 0.8)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = 'bold 14px Arial';
    context.fillStyle = marker.completed ? '#00ff00' : '#ff0000';
    context.textAlign = 'center';
    context.fillText(marker.type === 'main' ? 'MAIN QUEST' : 'SIDE QUEST', canvas.width / 2, 20);
    context.font = '12px Arial';
    context.fillStyle = '#ffffff';
    context.fillText(marker.name, canvas.width / 2, 45);
    const texture = new THREE.CanvasTexture(canvas);
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture }));
    sprite.position.y = 3.2; sprite.scale.set(0.75, 0.5, 1);
    group.add(sprite);
    
    scene.add(group);
    questMarkerMeshes.push(group);
    return group;
  };

  const createTree = (tree: any, scene: THREE.Scene) => {
    const { position, type, height, radius } = tree;
    const group = new THREE.Group();
    group.position.set(position.x, 0, position.z);
    
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(radius * 0.4, radius * 0.3, height * 0.4, 8),
      new THREE.MeshStandardMaterial({ color: 0x8b4513 })
    );
    trunk.castShadow = true;
    group.add(trunk);
    
    const leavesGeometry = type === 'pine' 
      ? new THREE.ConeGeometry(radius * 1.5, height * 0.6, 16, 8)
      : new THREE.ConeGeometry(radius * 1.2, height * 0.5, 16, 8);
    const leaves = new THREE.Mesh(
      leavesGeometry,
      new THREE.MeshStandardMaterial({
        color: type === 'pine' ? 0x013220 : 0x228b22,
        roughness: 0.9,
        metalness: 0.1,
      })
    );
    leaves.position.y = height * 0.4 + height * 0.3;
    leaves.castShadow = true;
    group.add(leaves);
    
    if (type === 'oak') {
      const leaves2 = new THREE.Mesh(
        new THREE.ConeGeometry(radius * 1.5, height * 0.4, 16, 8),
        leaves.material as THREE.MeshStandardMaterial
      );
      leaves2.position.y = height * 0.4 + height * 0.6;
      leaves2.scale.set(0.8, 0.8, 0.8);
      group.add(leaves2);
    }
    
    scene.add(group);
    worldObjects.push(group);
    return group;
  };

  const createPath = (path: any, scene: THREE.Scene) => {
    const { start, end, width, color } = path;
    const direction = new THREE.Vector3(end.x - start.x, 0, end.z - start.z);
    const length = direction.length();
    const center = new THREE.Vector3(
      (start.x + end.x) / 2, 0.01, (start.z + end.z) / 2
    );
    const pathMesh = new THREE.Mesh(
      new THREE.BoxGeometry(length, 0.05, width),
      new THREE.MeshStandardMaterial({
        color: color || 0xd2b48c,
        roughness: 0.9,
        metalness: 0.1,
      })
    );
    pathMesh.position.copy(center);
    pathMesh.rotation.y = Math.atan2(end.x - start.x, end.z - start.z);
    pathMesh.receiveShadow = true;
    scene.add(pathMesh);
    worldObjects.push(pathMesh);
  };

  const createFence = (fence: any, scene: THREE.Scene) => {
    const { start, end, height, color } = fence;
    const direction = new THREE.Vector3(end.x - start.x, 0, end.z - start.z);
    const length = direction.length();
    const center = new THREE.Vector3(
      (start.x + end.x) / 2, height / 2, (start.z + end.z) / 2
    );
    const fenceMesh = new THREE.Mesh(
      new THREE.BoxGeometry(length, height, 0.1),
      new THREE.MeshStandardMaterial({
        color: color || 0x8b4513,
        roughness: 0.7,
        metalness: 0.2,
      })
    );
    fenceMesh.position.copy(center);
    fenceMesh.rotation.y = Math.atan2(end.x - start.x, end.z - start.z);
    fenceMesh.castShadow = true;
    scene.add(fenceMesh);
    worldObjects.push(fenceMesh);
  };

  const createGate = (gate: any, scene: THREE.Scene) => {
    const { position, width, height, color } = gate;
    const postMaterial = new THREE.MeshStandardMaterial({ color: color || 0x8b4513 });
    
    const leftPost = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, height, 0.3),
      postMaterial
    );
    leftPost.position.set(position.x - width / 2, height / 2, position.z);
    leftPost.castShadow = true;
    scene.add(leftPost);
    worldObjects.push(leftPost);
    
    const rightPost = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, height, 0.3),
      postMaterial
    );
    rightPost.position.set(position.x + width / 2, height / 2, position.z);
    rightPost.castShadow = true;
    scene.add(rightPost);
    worldObjects.push(rightPost);
    
    const crossbar = new THREE.Mesh(
      new THREE.BoxGeometry(width, 0.2, 0.2),
      postMaterial
    );
    crossbar.position.set(position.x, height - 0.1, position.z);
    crossbar.castShadow = true;
    scene.add(crossbar);
    worldObjects.push(crossbar);
  };

  const createWell = (building: any, scene: THREE.Scene) => {
    if (!building) return;
    const group = new THREE.Group();
    group.position.set(building.position.x, 0, building.position.z);
    
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(1.5, 1.5, 0.5, 16),
      new THREE.MeshStandardMaterial({ color: building.color || 0x808080 })
    );
    base.castShadow = true;
    group.add(base);
    
    const wall = new THREE.Mesh(
      new THREE.CylinderGeometry(1.2, 1.2, 2, 16),
      new THREE.MeshStandardMaterial({ color: 0x696969 })
    );
    wall.position.y = 1.25; wall.castShadow = true;
    group.add(wall);
    
    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(1.5, 0.5, 16),
      new THREE.MeshStandardMaterial({ color: building.roofColor || 0x8b4513 })
    );
    roof.position.y = 2.5; roof.rotation.y = Math.PI / 4; roof.castShadow = true;
    group.add(roof);
    
    const rope = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 1.5, 8),
      new THREE.MeshStandardMaterial({ color: 0x8b4513 })
    );
    rope.position.set(0, 1.25, 0);
    group.add(rope);
    
    const bucket = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 0.2, 8),
      new THREE.MeshStandardMaterial({ color: 0x8b4513 })
    );
    bucket.position.set(0, 0.5, 0);
    group.add(bucket);
    
    scene.add(group);
    worldObjects.push(group);
  };

  const addVillageDecorations = (scene: THREE.Scene) => {
    const barrelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.5, 16);
    const barrelMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const barrelPositions = [{ x: 8, z: -3 }, { x: -8, z: -3 }, { x: 0, z: -12 }, { x: 12, z: 8 }, { x: -12, z: 8 }];
    barrelPositions.forEach(pos => {
      const barrel = new THREE.Mesh(barrelGeometry, barrelMaterial);
      barrel.position.set(pos.x, 0.25, pos.z);
      barrel.castShadow = true;
      scene.add(barrel);
      worldObjects.push(barrel);
    });
    
    const crateGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const crateMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const cratePositions = [{ x: 6, z: -4 }, { x: -6, z: -4 }, { x: 2, z: -10 }, { x: 10, z: 7 }];
    cratePositions.forEach(pos => {
      const crate = new THREE.Mesh(crateGeometry, crateMaterial);
      crate.position.set(pos.x, 0.25, pos.z);
      crate.castShadow = true;
      scene.add(crate);
      worldObjects.push(crate);
    });
    
    const hayGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 8);
    const hayMaterial = new THREE.MeshStandardMaterial({ color: 0xdaa520 });
    const hayPositions = [{ x: 14, z: -2 }, { x: -14, z: -2 }, { x: 4, z: -14 }];
    hayPositions.forEach(pos => {
      const hay = new THREE.Mesh(hayGeometry, hayMaterial);
      hay.position.set(pos.x, 0.15, pos.z);
      hay.castShadow = true;
      scene.add(hay);
      worldObjects.push(hay);
    });
    
    const torchGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 8);
    const torchMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const torchPositions = [{ x: 10, z: -7, side: 'left' }, { x: -10, z: -7, side: 'right' }, { x: 0, z: -17, side: 'front' }];
    torchPositions.forEach(({ x, z, side }) => {
      const torch = new THREE.Mesh(torchGeometry, torchMaterial);
      const offset = side === 'left' ? -0.5 : side === 'right' ? 0.5 : 0;
      torch.position.set(x + offset, 1, z);
      torch.castShadow = true;
      scene.add(torch);
      worldObjects.push(torch);
      const flame = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 8, 8),
        new THREE.MeshStandardMaterial({
          color: 0xff4500,
          emissive: 0xff4500,
          emissiveIntensity: 0.5,
        })
      );
      flame.position.set(x + offset, 1.2, z);
      scene.add(flame);
      worldObjects.push(flame);
    });
  };

  const createSkybox = (scene: THREE.Scene) => {
    const skyGeometry = new THREE.SphereGeometry(500, 32, 32);
    const skyMaterial = new THREE.MeshBasicMaterial({
      color: 0x87ceeb,
      side: THREE.BackSide,
    });
    const sky = new THREE.Mesh(skyGeometry, skyMaterial);
    scene.add(sky);
    worldObjects.push(sky);
  };

  // Update character meshes
  useEffect(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;
    
    characterMeshes.forEach((mesh, id) => {
      if (!players[id]) {
        scene.remove(mesh);
        characterMeshes.delete(id);
        delete animationStates.current[id];
      }
    });
    
    Object.entries(players).forEach(([id, player]) => {
      if (!characterMeshes.has(id)) {
        const group = createDetailedCharacter(player.character as CharacterType, id === currentPlayerId);
        group.position.set(player.position.x, player.position.y, player.position.z);
        group.name = `player-${id}`;
        if (id === currentPlayerId) playerMeshRef.current = group;
        scene.add(group);
        characterMeshes.set(id, group);
        animationStates.current[id] = { type: 'idle', time: 0, speed: 1 };
      }
      
      const mesh = characterMeshes.get(id);
      if (mesh) {
        const target = players[id];
        if (target.animation) {
          animationStates.current[id] = {
            type: target.animation,
            time: 0,
            speed: target.animation === 'running' ? 1.5 : 1
          };
        }
        if (target.direction) mesh.rotation.y = target.direction;
        
        if (id === currentPlayerId) {
          mesh.position.set(target.position.x, target.position.y, target.position.z);
        } else {
          mesh.position.lerp(
            new THREE.Vector3(target.position.x, target.position.y, target.position.z),
            0.2
          );
        }
      }
    });
  }, [players, currentPlayerId, currentArea]);

  // Socket connection
  useEffect(() => {
    const socket = io(serverUrl, {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to game server');
      socket.emit('join', { name: playerName, characterType, area: currentArea });
    });

    socket.on('init', (initialState: GameState) => {
      setGameState(initialState);
      setPlayers(initialState.players);
      setCurrentPlayerId(initialState.currentPlayerId);
      if (initialState.area) setCurrentArea(initialState.area);
    });

    socket.on('update', (update: Partial<GameState>) => {
      setGameState(prev => prev ? { ...prev, ...update } : null);
      if (update.players) setPlayers(update.players);
      if (update.area) setCurrentArea(update.area);
    });

    socket.on('player-moved', (data: any) => {
      if (players[data.playerId]) {
        setPlayers(prev => ({ ...prev, [data.playerId]: data.player }));
      }
    });

    socket.on('area-changed', (data: { area: string }) => {
      setCurrentArea(data.area);
    });

    socket.on('disconnect', () => console.log('Disconnected'));
    socket.on('error', (error: string) => console.error('Server error:', error));

    return () => socket.disconnect();
  }, [playerName, characterType, serverUrl, currentArea]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => keysRef.current[e.code] = true;
    const handleKeyUp = (e: KeyboardEvent) => keysRef.current[e.code] = false;
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Mouse controls for camera
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !cameraRef.current) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;
      const camera = cameraRef.current;
      
      if (cameraMode === 'third-person') {
        cameraTargetRef.current.applyAxisAngle(
          new THREE.Vector3(0, 1, 0),
          deltaX * 0.01
        );
        const newOffset = cameraOffsetRef.current.clone();
        newOffset.applyAxisAngle(new THREE.Vector3(1, 0, 0), deltaY * 0.01);
        const minPitch = -Math.PI / 6;
        const maxPitch = Math.PI / 3;
        const currentPitch = Math.atan2(newOffset.y, newOffset.length());
        if (currentPitch > minPitch && currentPitch < maxPitch) {
          cameraOffsetRef.current.copy(newOffset);
        }
      }
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => isDragging = false;
    const handleMouseWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.5 : 0.5;
      const newLength = cameraOffsetRef.current.length() + delta;
      if (newLength > 2 && newLength < 15) {
        cameraOffsetRef.current.setLength(newLength);
      }
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('wheel', handleMouseWheel, { passive: false });

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('wheel', handleMouseWheel);
    };
  }, [cameraMode]);

  // Movement loop
  useEffect(() => {
    if (!socketRef.current || !players[currentPlayerId]) return;
    const socket = socketRef.current;
    const player = players[currentPlayerId];
    const moveSpeed = 0.2;

    const moveLoop = setInterval(() => {
      const moveVector = { x: 0, y: 0, z: 0 };
      let isMoving = false;
      let direction = player.direction || 0;

      const camera = cameraRef.current;
      if (camera && cameraMode === 'third-person') {
        const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
        forward.y = 0; forward.normalize();
        const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
        right.y = 0; right.normalize();
        
        if (keysRef.current['KeyW'] || keysRef.current['ArrowUp']) {
          moveVector.x = forward.x * moveSpeed;
          moveVector.z = forward.z * moveSpeed;
          direction = Math.atan2(forward.x, forward.z);
          isMoving = true;
        }
        if (keysRef.current['KeyS'] || keysRef.current['ArrowDown']) {
          moveVector.x = -forward.x * moveSpeed;
          moveVector.z = -forward.z * moveSpeed;
          direction = Math.atan2(-forward.x, -forward.z);
          isMoving = true;
        }
        if (keysRef.current['KeyA'] || keysRef.current['ArrowLeft']) {
          moveVector.x -= right.x * moveSpeed;
          moveVector.z -= right.z * moveSpeed;
          isMoving = true;
        }
        if (keysRef.current['KeyD'] || keysRef.current['ArrowRight']) {
          moveVector.x += right.x * moveSpeed;
          moveVector.z += right.z * moveSpeed;
          isMoving = true;
        }
      }
      
      if (keysRef.current['Space'] && player.position.y <= 0.1) {
        moveVector.y += 0.5;
        socket.emit('action', { type: 'jump' });
      }
      if (keysRef.current['KeyF']) {
        socket.emit('action', { type: 'attack' });
      }

      if (isMoving) {
        socket.emit('move', {
          position: {
            x: player.position.x + moveVector.x,
            y: player.position.y + moveVector.y,
            z: player.position.z + moveVector.z,
          },
          animation: 'running',
          direction
        });
      } else {
        socket.emit('move', { animation: 'idle', direction });
      }
    }, 16);

    return () => clearInterval(moveLoop);
  }, [currentPlayerId, players, cameraMode]);

  // Camera mode toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab' || e.key === 'v' || e.key === 'V') {
        e.preventDefault();
        setCameraMode(prev => prev === 'third-person' ? 'first-person' : 'third-person');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Area change handler
  const changeArea = (areaId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('change-area', { area: areaId });
    }
    setCurrentArea(areaId);
    if (sceneRef.current) {
      loadArea(sceneRef.current, areaId);
    }
  };

  const handleResumeGame = () => setShowMenu(false);
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') setShowMenu(!showMenu);
  };
  useEffect(() => {
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showMenu]);

  const toggleCameraMode = () => {
    setCameraMode(prev => prev === 'third-person' ? 'first-person' : 'third-person');
  };

  if (showMenu) {
    return (
      <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
        <canvas ref={canvasRef} style={{ display: 'block' }} />
        <MainMenu onResume={handleResumeGame} />
      </div>
    );
  }

  const area = getCurrentArea();

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <canvas 
        ref={canvasRef} 
        style={{ display: 'block', cursor: cameraMode === 'third-person' ? 'grab' : 'pointer' }}
      />
      
      {gameState && currentPlayerId && players[currentPlayerId] && (
        <GameHUD 
          player={players[currentPlayerId]} 
          onMenuClick={() => setShowMenu(true)} 
          cameraMode={cameraMode}
          onToggleCamera={toggleCameraMode}
        />
      )}
      
      <button onClick={() => onBackToMenu()} style={{
        position: 'absolute', top: '20px', right: '20px',
        padding: '10px 20px', background: 'rgba(0, 0, 0, 0.7)',
        color: '#fff', border: '1px solid #00ffff', borderRadius: '5px',
        cursor: 'pointer', zIndex: 100,
      }}>Back to Menu</button>
      
      <div style={{
        position: 'absolute', top: '60px', left: '50%', transform: 'translateX(-50%)',
        background: 'rgba(0, 0, 0, 0.7)', padding: '10px 20px',
        borderRadius: '5px', border: '1px solid #00ffff', zIndex: 100,
      }}>
        <h2 style={{ margin: 0, color: '#00ffff', fontSize: '1.2rem' }}>{area.name}</h2>
        <p style={{ margin: '5px 0 0 0', color: '#aaaaaa', fontSize: '0.8rem' }}>{area.description}</p>
      </div>
      
      <div style={{
        position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: '10px', zIndex: 100,
      }}>
        <button onClick={() => changeArea('buena-village')} style={{
          padding: '8px 16px',
          background: currentArea === 'buena-village' ? 'rgba(0, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.7)',
          color: '#fff', border: '1px solid #00ffff', borderRadius: '5px', cursor: 'pointer',
        }}>Buena Village</button>
        <button onClick={() => changeArea('asura-kingdom')} style={{
          padding: '8px 16px',
          background: currentArea === 'asura-kingdom' ? 'rgba(0, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.7)',
          color: '#fff', border: '1px solid #00ffff', borderRadius: '5px', cursor: 'pointer',
        }}>Asura Kingdom</button>
        <button onClick={() => changeArea('magic-city-sharia')} style={{
          padding: '8px 16px',
          background: currentArea === 'magic-city-sharia' ? 'rgba(0, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.7)',
          color: '#fff', border: '1px solid #00ffff', borderRadius: '5px', cursor: 'pointer',
        }}>Magic City Sharia</button>
      </div>
      
      <div style={{
        position: 'absolute', bottom: '20px', right: '20px',
        background: 'rgba(0, 0, 0, 0.7)', padding: '8px 16px',
        borderRadius: '5px', border: '1px solid #00ffff', zIndex: 100,
      }}>
        <span style={{ color: '#00ffff' }}>
          {cameraMode === 'third-person' ? '3rd Person' : '1st Person'}
        </span>
      </div>
      
      <div style={{
        position: 'absolute', bottom: '80px', left: '20px',
        background: 'rgba(0, 0, 0, 0.7)', padding: '8px 12px',
        borderRadius: '5px', border: '1px solid #00ffff', zIndex: 100, fontSize: '0.75rem',
      }}>
        <div style={{ color: '#aaaaaa' }}>WASD: Move</div>
        <div style={{ color: '#aaaaaa' }}>Mouse: Look</div>
        <div style={{ color: '#aaaaaa' }}>Tab/V: Toggle Camera</div>
        <div style={{ color: '#aaaaaa' }}>F: Attack</div>
      </div>
    </div>
  );
}