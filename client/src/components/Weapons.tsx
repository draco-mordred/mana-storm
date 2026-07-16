import React from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Weapon model paths
const STORMCALLER_BOW_PATH = '/models/weapons/stormcaller_bow.glb';
const ZEPHYR_BLADE_PATH = '/models/weapons/zephyr_blade.glb';
const TEMPLEST_BLADE_PATH = '/models/weapons/tempest_blade.glb';

interface WeaponProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  castShadow?: boolean;
  receiveShadow?: boolean;
}

// Stormcaller Bow - Primary weapon for Draco Abielle
// A futuristic/sci-fi bow with Wind mana affinity
const StormcallerBowComponent = React.memo(function StormcallerBow({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  castShadow = true,
  receiveShadow = true
}: WeaponProps) {
  const { scene } = useGLTF(STORMCALLER_BOW_PATH);
  
  return (
    <primitive
      object={scene}
      position={position}
      rotation={rotation}
      scale={scale}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
    />
  );
});

// Zephyr Blade - Left dual blade with Wind affinity
const ZephyrBladeComponent = React.memo(function ZephyrBlade({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  castShadow = true,
  receiveShadow = true
}: WeaponProps) {
  const { scene } = useGLTF(ZEPHYR_BLADE_PATH);
  
  return (
    <primitive
      object={scene}
      position={position}
      rotation={rotation}
      scale={scale}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
    />
  );
});

// Tempest Blade - Right dual blade with Lightning affinity
const TempestBladeComponent = React.memo(function TempestBlade({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  castShadow = true,
  receiveShadow = true
}: WeaponProps) {
  const { scene } = useGLTF(TEMPLEST_BLADE_PATH);
  
  return (
    <primitive
      object={scene}
      position={position}
      rotation={rotation}
      scale={scale}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
    />
  );
});

// Combined dual blades component for easier positioning
interface DualBladesProps extends WeaponProps {
  bladeSpacing?: number;
}

export function DualBlades({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  bladeSpacing = 0.3,
  castShadow = true,
  receiveShadow = true
}: DualBladesProps) {
  const leftPosition: [number, number, number] = [
    position[0] - bladeSpacing / 2,
    position[1],
    position[2]
  ];
  const rightPosition: [number, number, number] = [
    position[0] + bladeSpacing / 2,
    position[1],
    position[2]
  ];
  
  return (
    <group position={position} rotation={rotation}>
      <ZephyrBladeComponent
        position={leftPosition}
        rotation={[rotation[0], rotation[1], rotation[2] + Math.PI]}
        scale={scale}
        castShadow={castShadow}
        receiveShadow={receiveShadow}
      />
      <TempestBladeComponent
        position={rightPosition}
        rotation={rotation}
        scale={scale}
        castShadow={castShadow}
        receiveShadow={receiveShadow}
      />
    </group>
  );
}

// Export individual weapons
export const StormcallerBow = StormcallerBowComponent;
export const ZephyrBlade = ZephyrBladeComponent;
export const TempestBlade = TempestBladeComponent;

// Preload all weapon models for better performance
useGLTF.preload(STORMCALLER_BOW_PATH);
useGLTF.preload(ZEPHYR_BLADE_PATH);
useGLTF.preload(TEMPLEST_BLADE_PATH);

export default {
  StormcallerBow,
  ZephyrBlade,
  TempestBlade,
  DualBlades
};