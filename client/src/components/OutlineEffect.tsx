import React, { useRef, useEffect, useMemo } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Outline, EffectComposer } from '@react-three/postprocessing';
import * as THREE from 'three';

// Outline effect for Genshin/Honkai style character edges
// This creates a clean black or colored outline around characters

interface OutlineEffectProps {
  /**
   * Objects to outline. If not provided, outlines all meshes in the scene.
   * Pass an array of mesh refs or a selector function.
   */
  selection?: THREE.Object3D[] | ((obj: THREE.Object3D) => boolean);
  
  /**
   * Outline color in hex (default: black #000000)
   */
  color?: number;
  
  /**
   * Outline thickness/strength (default: 0.002)
   * Higher values = thicker outline
   */
  edgeStrength?: number;
  
  /**
   * Outline visibility threshold (default: 0.1)
   * Lower values = more edges detected
   */
  pulseSpeed?: number;
  
  /**
   * Whether to enable pulsing animation (default: false)
   */
  pulsing?: boolean;
  
  /**
   * Whether to use X-ray mode (see through objects) (default: false)
   */
  xRay?: boolean;
  
  /**
   * Pattern texture for more stylized outlines
   */
  patternTexture?: THREE.Texture;
  
  /**
   * Resolution of the outline pass (default: 512)
   */
  resolutionScale?: number;
}

/**
 * CharacterOutline - Optimized outline effect for individual characters
 * Wraps a character group and adds an outline effect
 */
export function CharacterOutline({
  children,
  color = 0x000000,
  edgeStrength = 0.002,
  pulsing = false,
  xRay = false,
}: {
  children: React.ReactNode;
} & Omit<OutlineEffectProps, 'selection'>) {
  const groupRef = useRef<THREE.Group>(null);
  const outlineRef = useRef<THREE.Mesh>(null);
  
  // Create a slightly scaled-up version of the character for outline
  useFrame(() => {
    if (groupRef.current && outlineRef.current) {
      // Copy position and rotation from the group
      outlineRef.current.position.copy(groupRef.current.position);
      outlineRef.current.rotation.copy(groupRef.current.rotation);
      outlineRef.current.scale.copy(groupRef.current.scale);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Outline mesh - rendered first with slightly larger scale */}
      <mesh ref={outlineRef} scale={1.02}>
        <primitive object={children} />
        <meshBasicMaterial 
          color={color} 
          side={THREE.BackSide} 
          transparent 
          opacity={0.8}
        />
      </mesh>
      
      {/* Main character - rendered normally */}
      <>{children}</>
    </group>
  );
}

/**
 * SceneOutline - Global outline effect for the entire scene
 * Use this in your Canvas component for a post-processing outline effect
 */
export function SceneOutline({
  selection,
  color = 0x000000,
  edgeStrength = 2.0,
  pulseSpeed = 0,
  pulsing = false,
  xRay = false,
  resolutionScale = 0.5,
}: OutlineEffectProps) {
  const { gl, scene, camera, size } = useThree();
  const composerRef = useRef<EffectComposer>(null);
  const timeRef = useRef(0);

  // Handle pulsing animation
  useFrame((state) => {
    timeRef.current += state.clock.getDelta();
  });

  // Calculate edge strength with pulsing
  const currentEdgeStrength = useMemo(() => {
    if (!pulsing) return edgeStrength;
    return edgeStrength * (0.8 + 0.2 * Math.sin(timeRef.current * pulseSpeed));
  }, [edgeStrength, pulsing, pulseSpeed, timeRef.current]);

  return (
    <EffectComposer ref={composerRef} args={[gl]}>
      <Outline
        selection={selection}
        selectionLayer={10}
        patternTexture={undefined}
        patternScale={1}
        edgeStrength={currentEdgeStrength}
        edgeThickness={1.0}
        edgeColor={color}
        pulseSpeed={pulseSpeed}
        visibleEdgeColor={color}
        hiddenEdgeColor={color}
        xRay={xRay}
        usePattern={false}
        resolutionScale={resolutionScale}
      />
    </EffectComposer>
  );
}

/**
 * CharacterOutlineGroup - Group component that automatically applies outline to all children
 * This is the recommended approach for character outlines
 */
export function CharacterOutlineGroup({
  children,
  color = 0x000000,
  edgeStrength = 0.002,
  pulsing = false,
  xRay = false,
}: {
  children: React.ReactNode;
} & Omit<OutlineEffectProps, 'selection'>) {
  const groupRef = useRef<THREE.Group>(null);
  
  return (
    <group ref={groupRef}>
      {/* Create outline meshes for all children */}
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;
        
        // Clone the child for outline
        const outlineChild = React.cloneElement(child as React.ReactElement, {
          scale: (child.props.scale || 1) * 1.02,
        });
        
        return (
          <group key={`outline-${index}`}>
            {/* Outline version - back side, slightly larger */}
            <mesh>
              {outlineChild}
              <meshBasicMaterial 
                color={color} 
                side={THREE.BackSide} 
                transparent 
                opacity={0.7}
              />
            </mesh>
            
            {/* Original child */}
            {child}
          </group>
        );
      })}
    </group>
  );
}

/**
 * HonkaiOutline - Specific outline style matching Honkai Impact aesthetic
 * Uses a blue-purple outline color
 */
export function HonkaiOutline({ children }: { children: React.ReactNode }) {
  return (
    <CharacterOutlineGroup color={0x4400aa} edgeStrength={0.0025}>
      {children}
    </CharacterOutlineGroup>
  );
}

/**
 * GenshinOutline - Specific outline style matching Genshin Impact aesthetic
 * Uses a dark blue outline color
 */
export function GenshinOutline({ children }: { children: React.ReactNode }) {
  return (
    <CharacterOutlineGroup color={0x1a1a2e} edgeStrength={0.002}>
      {children}
    </CharacterOutlineGroup>
  );
}

/**
 * ElementalOutline - Outline that changes color based on element/affinity
 * Perfect for Genshin/Honkai style elemental characters
 */
export function ElementalOutline({
  children,
  element = 'anemo',
}: {
  children: React.ReactNode;
  element?: 'anemo' | 'geo' | 'electro' | 'dendro' | 'hydro' | 'pyro' | 'cryo' | 'wind' | 'lightning' | 'water';
}) {
  const elementColors = {
    anemo: 0x68c87b,
    geo: 0xe6c86e,
    electro: 0x9b59b6,
    dendro: 0xf3d364,
    hydro: 0x1e90ff,
    pyro: 0xff6b35,
    cryo: 0x7fb3d3,
    wind: 0x40e0d0,
    lightning: 0x9b59b6,
    water: 0x1e90ff,
  };
  
  const color = elementColors[element as keyof typeof elementColors] || 0xffffff;
  
  return (
    <CharacterOutlineGroup color={color} edgeStrength={0.002} pulsing={true}>
      {children}
    </CharacterOutlineGroup>
  );
}

// Export all components
export default {
  CharacterOutline,
  SceneOutline,
  CharacterOutlineGroup,
  HonkaiOutline,
  GenshinOutline,
  ElementalOutline,
};
