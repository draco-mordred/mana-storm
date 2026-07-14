import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import type { Player } from '../../types';
import { CHARACTER_PRESETS } from '../../utils/constants';

interface CharacterProps {
  player: Player;
  scene: THREE.Scene;
  isLocalPlayer?: boolean;
}

export default function Character({ player, scene, isLocalPlayer = false }: CharacterProps) {
  const meshRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    if (!scene) return;

    const group = new THREE.Group();
    group.position.set(player.position.x, player.position.y, player.position.z);
    group.rotation.set(player.rotation.x, player.rotation.y, player.rotation.z);

    const bodyGeometry = new THREE.CapsuleGeometry(0.3, 0.8, 4, 8);
    const preset = CHARACTER_PRESETS[player.character];
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: preset.color, roughness: 0.7, metalness: 0.1 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    body.receiveShadow = true;
    body.position.y = 0.4;
    group.add(body);

    const headGeometry = new THREE.SphereGeometry(0.25, 16, 16);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0xffccaa, roughness: 0.8 });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 0.8 + 0.25;
    head.castShadow = true;
    group.add(head);

    meshRef.current = group;
    scene.add(group);

    return () => { scene.remove(group); bodyMaterial.dispose(); headMaterial.dispose(); };
  }, [player, scene]);

  useEffect(() => {
    if (!meshRef.current) return;
    const group = meshRef.current;
    const target = player.position;
    if (isLocalPlayer) {
      group.position.set(target.x, target.y, target.z);
      group.rotation.set(target.x, target.y, target.z);
    } else {
      group.position.lerp(new THREE.Vector3(target.x, target.y, target.z), 0.2);
      group.rotation.slerp(new THREE.Quaternion().setFromEuler(new THREE.Euler(target.x, target.y, target.z)), 0.2);
    }
  }, [player, isLocalPlayer]);

  return null;
}