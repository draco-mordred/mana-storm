import React, { useRef, useEffect } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

// Model paths - loaded from public folder
const MODEL_PATH = '/models/characters/abie/model.glb';

type AnimationName = 'Idle' | 'Run' | 'Attack_Bow' | 'Attack_Blades' | 'Skill_Cast';

interface GLTFResult {
  nodes: Record<string, THREE.Object3D>;
  materials: Record<string, THREE.Material>;
  animations: THREE.AnimationClip[];
  scene: THREE.Group;
}

interface AbieModelProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  animation?: AnimationName;
  weapon?: 'bow' | 'blades' | 'none';
  castShadow?: boolean;
  receiveShadow?: boolean;
}

export function AbieModel({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  animation = 'Idle',
  weapon = 'bow',
  castShadow = true,
  receiveShadow = true
}: AbieModelProps) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations, materials } = useGLTF(MODEL_PATH) as GLTFResult;
  const { actions } = useAnimations(animations, group);

  // Play the selected animation
  useEffect(() => {
    if (actions && actions[animation]) {
      // Stop all animations first
      Object.values(actions).forEach((action) => action?.stop());
      // Play the selected one
      actions[animation]?.reset().fadeIn(0.2).play();
    }
  }, [actions, animation]);

  // Customize materials to match Draco Abielle's colors
  useEffect(() => {
    if (materials) {
      // Leather corset - brown leather color
      if (materials.Leather || materials.leather || materials.Corset) {
        const leatherMaterial = materials.Leather || materials.leather || materials.Corset;
        if (leatherMaterial) {
          leatherMaterial.color = new THREE.Color(0xA0522D); // abieLeather
        }
      }
      // Hair - chestnut brown
      if (materials.Hair || materials.hair) {
        const hairMaterial = materials.Hair || materials.hair;
        if (hairMaterial) {
          hairMaterial.color = new THREE.Color(0x8B4513); // abieBrown
        }
      }
      // Skin
      if (materials.Skin || materials.skin) {
        const skinMaterial = materials.Skin || materials.skin;
        if (skinMaterial) {
          skinMaterial.color = new THREE.Color(0xffccaa);
        }
      }
      // Outfit accents
      if (materials.Accent || materials.accent) {
        const accentMaterial = materials.Accent || materials.accent;
        if (accentMaterial) {
          accentMaterial.color = new THREE.Color(0x00aaff);
        }
      }
    }
  }, [materials]);

  return (
    <group
      ref={group}
      position={position}
      rotation={rotation}
      scale={scale}
      dispose={null}
    >
      <primitive
        object={scene}
        castShadow={castShadow}
        receiveShadow={receiveShadow}
      />
    </group>
  );
}

// Preload the model for better performance
useGLTF.preload(MODEL_PATH);

export default AbieModel;