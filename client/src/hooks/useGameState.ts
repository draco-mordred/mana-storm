import { useState, useCallback } from 'react';
import type { Player, PositionUpdate, GameState } from '../types';

export function useGameState(currentPlayerId: string) {
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 });
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
  const [animation, setAnimation] = useState<string>('idle');
  const [targetPosition, setTargetPosition] = useState<PositionUpdate | null>(null);

  const updatePosition = useCallback((newPosition: PositionUpdate) => {
    setTargetPosition(prev => {
      const current = prev || position;
      const distance = Math.sqrt(Math.pow(newPosition.x - current.x, 2) + Math.pow(newPosition.z - current.z, 2));
      if (distance > 0.1) setAnimation('running'); else setAnimation('idle');
      return newPosition;
    });
  }, [position]);

  const stopMoving = useCallback(() => { setAnimation('idle'); setTargetPosition(null); }, []);
  const jump = useCallback(() => { setAnimation('jump'); setTimeout(() => setAnimation('idle'), 1000); }, []);
  const attack = useCallback((skillId: string) => { setAnimation('attack'); setTimeout(() => setAnimation('idle'), 500); return { type: 'attack', skillId, timestamp: Date.now() }; }, []);

  return { position, rotation, animation, targetPosition, updatePosition, setPosition, setRotation, stopMoving, jump, attack };
}