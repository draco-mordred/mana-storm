import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import type { Player } from '../../types';
import { CHARACTER_PRESETS, CHARACTER_VISUALS, ANIME_COLORS } from '../../utils/constants';

interface CharacterProps {
  player: Player;
  scene: THREE.Scene;
  isLocalPlayer?: boolean;
}

// Character model cache
const characterModels = new Map<string, THREE.Group>();

export default function Character({ player, scene, isLocalPlayer = false }: CharacterProps) {
  const modelRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    if (!scene) return;

    // Remove old model if exists
    if (modelRef.current) {
      scene.remove(modelRef.current);
    }

    // Create character model based on type
    const model = createCharacterModel(player);
    model.position.set(player.position.x, player.position.y, player.position.z);
    
    scene.add(model);
    modelRef.current = model;

    return () => {
      if (modelRef.current) {
        scene.remove(modelRef.current);
      }
    };
  }, [player, scene]);

  // Update position and rotation
  useEffect(() => {
    if (!modelRef.current) return;

    const target = player.position;
    const model = modelRef.current;
    
    if (isLocalPlayer) {
      // Local player - immediate update
      model.position.set(target.x, target.y, target.z);
      if (player.rotation) {
        model.rotation.set(player.rotation.x, player.rotation.y, player.rotation.z);
      }
    } else {
      // Remote player - smooth interpolation
      model.position.lerp(new THREE.Vector3(target.x, target.y, target.z), 0.2);
      if (player.rotation) {
        const targetQuat = new THREE.Quaternion().setFromEuler(
          new THREE.Euler(player.rotation.x, player.rotation.y, player.rotation.z)
        );
        model.quaternion.slerp(targetQuat, 0.2);
      }
    }

    // Update animation based on player state
    updateAnimation(model, player.animation);
  }, [player, isLocalPlayer]);

  return null;
}

function createCharacterModel(player: Player): THREE.Group {
  const group = new THREE.Group();
  group.name = `character-${player.id}`;

  const visual = CHARACTER_VISUALS[player.character];
  const preset = CHARACTER_PRESETS[player.character];

  // Character is a special case - use Rudeus-specific model
  if (player.character === 'rudeus') {
    return createRudeusModel(group, visual, preset);
  }

  // Generic character model for other classes
  return createGenericCharacterModel(group, visual, preset);
}

function createRudeusModel(group: THREE.Group, visual: any, preset: any): THREE.Group {
  // Rudeus Greyrat model
  // Blue hair, white robe with blue accents, staff

  // Head
  const headGeometry = new THREE.SphereGeometry(0.35, 16, 16);
  const skinMaterial = new THREE.MeshStandardMaterial({
    color: 0xffdab9, // Light peach skin
    roughness: 0.8,
    metalness: 0.1,
  });
  const head = new THREE.Mesh(headGeometry, skinMaterial);
  head.position.y = 1.6;
  group.add(head);

  // Hair (blue, slightly messy)
  const hairGeometry = new THREE.SphereGeometry(0.4, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const hairMaterial = new THREE.MeshStandardMaterial({
    color: visual.hairColor || ANIME_COLORS.rudeusBlue,
    roughness: 0.7,
    metalness: 0.15,
  });
  const hair = new THREE.Mesh(hairGeometry, hairMaterial);
  hair.position.y = 1.75;
  hair.position.z = -0.1;
  group.add(hair);

  // Body (white robe)
  const bodyGeometry = new THREE.CapsuleGeometry(0.3, 0.8, 4, 8);
  const robeMaterial = new THREE.MeshStandardMaterial({
    color: preset.color || 0xffffff,
    roughness: 0.6,
    metalness: 0.1,
  });
  const body = new THREE.Mesh(bodyGeometry, robeMaterial);
  body.position.y = 1.0;
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  // Robe sleeves
  const sleeveGeometry = new THREE.CylinderGeometry(0.12, 0.1, 0.6, 8);
  const sleeveMaterial = new THREE.MeshStandardMaterial({
    color: preset.color || 0xffffff,
    roughness: 0.6,
    metalness: 0.1,
  });
  
  const leftSleeve = new THREE.Mesh(sleeveGeometry, sleeveMaterial);
  leftSleeve.position.set(-0.4, 1.3, 0);
  leftSleeve.rotation.z = Math.PI / 4;
  group.add(leftSleeve);
  
  const rightSleeve = new THREE.Mesh(sleeveGeometry, sleeveMaterial);
  rightSleeve.position.set(0.4, 1.3, 0);
  rightSleeve.rotation.z = -Math.PI / 4;
  group.add(rightSleeve);

  // Blue robe accents
  const accentGeometry = new THREE.TorusGeometry(0.35, 0.05, 8, 16);
  const accentMaterial = new THREE.MeshStandardMaterial({
    color: visual.hairColor || ANIME_COLORS.rudeusBlue,
    roughness: 0.5,
    metalness: 0.2,
  });
  const accent = new THREE.Mesh(accentGeometry, accentMaterial);
  accent.position.y = 1.0;
  accent.rotation.x = Math.PI / 2;
  group.add(accent);

  // Staff (magic staff)
  const staffGroup = new THREE.Group();
  
  // Staff shaft
  const shaftGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 8);
  const shaftMaterial = new THREE.MeshStandardMaterial({
    color: 0x3a2212, // Dark wood
    roughness: 0.7,
    metalness: 0.2,
  });
  const shaft = new THREE.Mesh(shaftGeometry, shaftMaterial);
  staffGroup.add(shaft);

  // Staff orb (blue mana crystal)
  const orbGeometry = new THREE.SphereGeometry(0.15, 16, 16);
  const orbMaterial = new THREE.MeshStandardMaterial({
    color: ANIME_COLORS.rudeusBlue,
    roughness: 0.3,
    metalness: 0.5,
    emissive: ANIME_COLORS.rudeusBlue,
    emissiveIntensity: 0.3,
  });
  const orb = new THREE.Mesh(orbGeometry, orbMaterial);
  orb.position.y = 0.8;
  staffGroup.add(orb);

  // Position staff
  staffGroup.position.set(0.3, 0.8, -0.1);
  staffGroup.rotation.z = Math.PI / 6;
  group.add(staffGroup);

  // Name tag (floating above head)
  const nameTag = createNameTag(player.name);
  nameTag.position.y = 2.1;
  group.add(nameTag);

  return group;
}

function createGenericCharacterModel(group: THREE.Group, visual: any, preset: any): THREE.Group {
  // Generic character model for other classes
  
  // Head
  const headGeometry = new THREE.SphereGeometry(0.3, 16, 16);
  const headMaterial = new THREE.MeshStandardMaterial({
    color: 0xffdab9,
    roughness: 0.8,
    metalness: 0.1,
  });
  const head = new THREE.Mesh(headGeometry, headMaterial);
  head.position.y = 1.5;
  group.add(head);

  // Hair
  const hairGeometry = new THREE.SphereGeometry(0.35, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const hairMaterial = new THREE.MeshStandardMaterial({
    color: visual.hairColor || 0x000000,
    roughness: 0.7,
    metalness: 0.15,
  });
  const hair = new THREE.Mesh(hairGeometry, hairMaterial);
  hair.position.y = 1.65;
  hair.position.z = -0.05;
  group.add(hair);

  // Body
  const bodyGeometry = new THREE.CapsuleGeometry(0.25, 0.7, 4, 8);
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: preset.color || 0xffffff,
    roughness: 0.6,
    metalness: 0.1,
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.position.y = 0.9;
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  // Name tag
  const nameTag = createNameTag(player.name);
  nameTag.position.y = 1.9;
  group.add(nameTag);

  return group;
}

function createNameTag(name: string): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const context = canvas.getContext('2d')!;
  
  context.fillStyle = 'rgba(0, 0, 0, 0.7)';
  context.fillRect(0, 0, canvas.width, canvas.height);
  
  context.font = 'Bold 16px Arial';
  context.fillStyle = '#00ffff';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(name, canvas.width / 2, canvas.height / 2);
  
  const texture = new THREE.CanvasTexture(canvas);
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(0.5, 0.125, 1);
  
  return sprite;
}

function updateAnimation(model: THREE.Group, animation?: string) {
  // In a real implementation, this would switch between different animations
  // For now, we just store the animation state on the model
  (model as any).currentAnimation = animation;
}

export { characterModels };
