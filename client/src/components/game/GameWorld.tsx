import { useEffect } from 'react';
import type { Player } from '../../types';

interface GameWorldProps {
  players: Record<string, Player>;
}

export default function GameWorld({ players }: GameWorldProps) {
  useEffect(() => {
    if (!window.THREE) return;
    const scene = (window as any).scene;
    if (!scene) return;
    return () => {
      Object.values(players).forEach(player => {
        const obj = scene.getObjectByName(player.id);
        if (obj) scene.remove(obj);
      });
    };
  }, [players]);
  return null;
}