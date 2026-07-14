import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { GameMap, MapObject } from '../../utils/constants';
import { BUena_VILLAGE } from '../../utils/constants';

interface BuenaVillageProps {
  scene: THREE.Scene;
}

// Cache for loaded models
const modelCache = new Map<string, THREE.Group>();

export default function BuenaVillage({ scene }: BuenaVillageProps) {
  const villageRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    if (!scene) return;

    // Create village group
    const villageGroup = new THREE.Group();
    villageGroup.name = 'buena-village';
    scene.add(villageGroup);
    villageRef.current = villageGroup;

    // Set up village environment
    setupEnvironment(scene);
    
    // Create all village objects
    createVillageObjects(villageGroup);

    return () => {
      // Cleanup
      scene.remove(villageGroup);
      modelCache.clear();
    };
  }, [scene]);

  return null;
}

function setupEnvironment(scene: THREE.Scene) {
  // Ground with texture-like appearance
  const groundGeometry = new THREE.PlaneGeometry(
    BUena_VILLAGE.size.width,
    BUena_VILLAGE.size.height
  );
  
  // Create grass texture effect using vertex colors
  const groundMaterial = new THREE.MeshStandardMaterial({
    color: BUena_VILLAGE.groundColor,
    roughness: 0.9,
    metalness: 0.1,
  });
  
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // Sky dome
  const skyGeometry = new THREE.SphereGeometry(500, 32, 32);
  const skyMaterial = new THREE.MeshBasicMaterial({
    color: BUena_VILLAGE.skyColor,
    side: THREE.BackSide,
  });
  const skyDome = new THREE.Mesh(skyGeometry, skyMaterial);
  scene.add(skyDome);

  // Fog
  scene.fog = new THREE.Fog(
    BUena_VILLAGE.fogColor,
    1,
    BUena_VILLAGE.size.width / 2
  );
  scene.background = new THREE.Color(BUena_VILLAGE.skyColor);

  // Ambient light
  const ambientLight = new THREE.AmbientLight(
    BUena_VILLAGE.ambientLight,
    0.5
  );
  scene.add(ambientLight);

  // Directional light (sun)
  const directionalLight = new THREE.DirectionalLight(
    BUena_VILLAGE.directionalLight,
    0.8
  );
  directionalLight.position.set(50, 100, 50);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 500;
  directionalLight.shadow.camera.left = -100;
  directionalLight.shadow.camera.right = 100;
  directionalLight.shadow.camera.top = 100;
  directionalLight.shadow.camera.bottom = -100;
  scene.add(directionalLight);

  // Hemisphere light for natural outdoor lighting
  const hemiLight = new THREE.HemisphereLight(
    0xffffbb,
    0x080820,
    0.3
  );
  scene.add(hemiLight);
}

function createVillageObjects(parent: THREE.Group) {
  const objects = BUena_VILLAGE.objects;

  objects.forEach((obj: MapObject) => {
    const mesh = createMapObject(obj);
    if (mesh) {
      mesh.position.set(obj.position.x, obj.position.y, obj.position.z);
      
      if (obj.rotation) {
        mesh.rotation.set(obj.rotation.x, obj.rotation.y, obj.rotation.z);
      }
      
      if (obj.scale) {
        mesh.scale.set(obj.scale.x, obj.scale.y, obj.scale.z);
      }
      
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      parent.add(mesh);
    }
  });
}

function createMapObject(obj: MapObject): THREE.Mesh | THREE.Group | null {
  const color = obj.color || 0xffffff;

  switch (obj.type) {
    case 'house':
      return createHouse(color);
    
    case 'tree':
      return createTree(color);
    
    case 'rock':
      return createRock(color);
    
    case 'well':
      return createWell(color);
    
    case 'fence':
      return createFence(color);
    
    case 'path':
      return createPath(color);
    
    case 'sign':
      return createSign(color);
    
    default:
      return createPlaceholder(obj);
  }
}

function createHouse(color: number): THREE.Group {
  const group = new THREE.Group();

  // Main house body
  const bodyGeometry = new THREE.BoxGeometry(4, 3, 3);
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: color,
    roughness: 0.7,
    metalness: 0.1,
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.position.y = 1.5;
  group.add(body);

  // Roof
  const roofGeometry = new THREE.ConeGeometry(2.5, 2, 4);
  const roofMaterial = new THREE.MeshStandardMaterial({
    color: 0x502e15,
    roughness: 0.8,
    metalness: 0.2,
  });
  const roof = new THREE.Mesh(roofGeometry, roofMaterial);
  roof.position.y = 3.5;
  roof.rotation.y = Math.PI / 4;
  group.add(roof);

  // Door
  const doorGeometry = new THREE.BoxGeometry(0.8, 1.2, 0.1);
  const doorMaterial = new THREE.MeshStandardMaterial({
    color: 0x3a2212,
    roughness: 0.6,
    metalness: 0.1,
  });
  const door = new THREE.Mesh(doorGeometry, doorMaterial);
  door.position.set(0, 1, 1.51);
  group.add(door);

  // Windows
  const windowGeometry = new THREE.BoxGeometry(0.6, 0.6, 0.1);
  const windowMaterial = new THREE.MeshStandardMaterial({
    color: 0x87ceeb,
    roughness: 0.3,
    metalness: 0.3,
    transparent: true,
    opacity: 0.7,
  });
  
  const window1 = new THREE.Mesh(windowGeometry, windowMaterial);
  window1.position.set(1, 2, 1.51);
  group.add(window1);
  
  const window2 = new THREE.Mesh(windowGeometry, windowMaterial);
  window2.position.set(-1, 2, 1.51);
  group.add(window2);

  return group;
}

function createTree(color: number): THREE.Group {
  const group = new THREE.Group();

  // Trunk
  const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.2, 3, 8);
  const trunkMaterial = new THREE.MeshStandardMaterial({
    color: 0x3a2212,
    roughness: 0.8,
    metalness: 0.1,
  });
  const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
  trunk.position.y = 1.5;
  group.add(trunk);

  // Leaves (using cone for simplicity)
  const leavesGeometry = new THREE.ConeGeometry(1.5, 3, 8);
  const leavesMaterial = new THREE.MeshStandardMaterial({
    color: color,
    roughness: 0.8,
    metalness: 0.1,
  });
  const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
  leaves.position.y = 4;
  leaves.rotation.y = Math.PI / 4;
  group.add(leaves);

  // Additional leaf layers for better appearance
  const leaves2 = new THREE.Mesh(leavesGeometry, leavesMaterial);
  leaves2.position.y = 5;
  leaves2.scale.set(0.8, 0.8, 0.8);
  leaves2.rotation.y = Math.PI / 3;
  group.add(leaves2);

  return group;
}

function createRock(color: number): THREE.Mesh {
  const geometry = new THREE.DodecahedronGeometry(0.8, 0);
  const material = new THREE.MeshStandardMaterial({
    color: color,
    roughness: 0.95,
    metalness: 0.05,
  });
  return new THREE.Mesh(geometry, material);
}

function createWell(color: number): THREE.Group {
  const group = new THREE.Group();

  // Well base
  const baseGeometry = new THREE.CylinderGeometry(1.2, 1.2, 0.5, 16);
  const baseMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b4513,
    roughness: 0.7,
    metalness: 0.2,
  });
  const base = new THREE.Mesh(baseGeometry, baseMaterial);
  group.add(base);

  // Well walls
  const wallGeometry = new THREE.CylinderGeometry(1, 1, 1.5, 16, 1, true);
  const wallMaterial = new THREE.MeshStandardMaterial({
    color: 0x654321,
    roughness: 0.6,
    metalness: 0.15,
  });
  const wall = new THREE.Mesh(wallGeometry, wallMaterial);
  wall.position.y = 0.75;
  group.add(wall);

  // Well roof
  const roofGeometry = new THREE.ConeGeometry(1.3, 0.3, 16);
  const roofMaterial = new THREE.MeshStandardMaterial({
    color: 0x502e15,
    roughness: 0.8,
    metalness: 0.1,
  });
  const roof = new THREE.Mesh(roofGeometry, roofMaterial);
  roof.position.y = 2;
  roof.rotation.y = Math.PI / 2;
  group.add(roof);

  // Rope
  const ropeGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 8);
  const ropeMaterial = new THREE.MeshStandardMaterial({
    color: 0x4a3c2a,
    roughness: 0.9,
    metalness: 0.05,
  });
  const rope = new THREE.Mesh(ropeGeometry, ropeMaterial);
  rope.position.set(0, 1, 0);
  group.add(rope);

  // Bucket
  const bucketGeometry = new THREE.CylinderGeometry(0.2, 0.25, 0.2, 8);
  const bucketMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b4513,
    roughness: 0.7,
    metalness: 0.2,
  });
  const bucket = new THREE.Mesh(bucketGeometry, bucketMaterial);
  bucket.position.set(0, 0.3, 0);
  group.add(bucket);

  return group;
}

function createFence(color: number): THREE.Mesh {
  const geometry = new THREE.BoxGeometry(1, 0.8, 0.1);
  const material = new THREE.MeshStandardMaterial({
    color: color,
    roughness: 0.7,
    metalness: 0.1,
  });
  return new THREE.Mesh(geometry, material);
}

function createPath(color: number): THREE.Mesh {
  const geometry = new THREE.BoxGeometry(1, 0.1, 1);
  const material = new THREE.MeshStandardMaterial({
    color: color,
    roughness: 0.9,
    metalness: 0.05,
  });
  return new THREE.Mesh(geometry, material);
}

function createSign(color: number): THREE.Group {
  const group = new THREE.Group();

  // Sign post
  const postGeometry = new THREE.CylinderGeometry(0.08, 0.08, 2, 8);
  const postMaterial = new THREE.MeshStandardMaterial({
    color: 0x3a2212,
    roughness: 0.8,
    metalness: 0.1,
  });
  const post = new THREE.Mesh(postGeometry, postMaterial);
  group.add(post);

  // Sign board
  const boardGeometry = new THREE.BoxGeometry(0.8, 0.5, 0.05);
  const boardMaterial = new THREE.MeshStandardMaterial({
    color: color,
    roughness: 0.6,
    metalness: 0.15,
  });
  const board = new THREE.Mesh(boardGeometry, boardMaterial);
  board.position.y = 1.2;
  group.add(board);

  return group;
}

function createPlaceholder(obj: MapObject): THREE.Mesh {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({
    color: obj.color || 0xff00ff,
    roughness: 0.7,
    metalness: 0.1,
  });
  return new THREE.Mesh(geometry, material);
}

export { BUena_VILLAGE, createMapObject };
