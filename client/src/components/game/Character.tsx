import { useRef, useEffect } from 'react';
import type { Player } from '../../types';
import { CHARACTER_PRESETS } from '../../utils/constants';

interface CharacterProps {
  player: Player;
  isLocalPlayer?: boolean;
}

export default function Character({ player, isLocalPlayer = false }: CharacterProps) {
  const meshRef = useRef<any>(null);

  useEffect(() => {
    if (!window.THREE) return;
    const scene = (window as any).scene;
    if (!scene) return;

    const group = new window.THREE.Group();
    group.position.set(player.position.x, player.position.y, player.position.z);
    group.rotation.set(player.rotation.x, player.rotation.y, player.rotation.z);

    const bodyGeometry = new window.THREE.CapsuleGeometry(0.3, 0.8, 4, 8);
    const preset = CHARACTER_PRESETS[player.character];
    const bodyMaterial = new window.THREE.MeshStandardMaterial({ color: preset.color, roughness: 0.7, metalness: 0.1 });
    const body = new window.THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    body.receiveShadow = true;
    body.position.y = 0.4;
    group.add(body);

    const headGeometry = new window.THREE.SphereGeometry(0.25, 16, 16);
    const headMaterial = new window.THREE.MeshStandardMaterial({ color: 0xffccaa, roughness: 0.8 });
    const head = new window.THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.05;
    head.castShadow = true;
    group.add(head);

    meshRef.current = group;
    scene.add(group);

    return () => { scene.remove(group); bodyMaterial.dispose(); headMaterial.dispose(); };
  }, [player]);

  useEffect(() => {
    if (!meshRef.current) return;
    const group = meshRef.current;
    const target = player.position;
    if (isLocalPlayer) {
      group.position.set(target.x, target.y, target.z);
      group.rotation.set(target.x, target.y, target.z);
    } else {
      group.position.lerp(new window.THREE.Vector3(target.x, target.y, target.z), 0.2);
      group.rotation.slerp(new window.THREE.Quaternion().setFromEuler(new window.THREE.Euler(target.x, target.y, target.z)), 0.2);
    }
  }, [player, isLocalPlayer]);

  return null;
}