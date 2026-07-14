import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { Player } from '../../types';

interface LocalPlayerControllerProps {
  playerId: string;
  players: Record<string, Player>;
  socket: any;
  camera: THREE.PerspectiveCamera | null;
}

export default function LocalPlayerController({ playerId, players, socket, camera }: LocalPlayerControllerProps) {
  const keysRef = useRef<Record<string, boolean>>({});
  const pointerLockRef = useRef(false);

  useEffect(() => {
    if (!socket || !players[playerId]) return;

    const handleClick = () => {
      const canvas = document.querySelector('canvas');
      if (canvas && !pointerLockRef.current) canvas.requestPointerLock();
    };

    const handlePointerLockChange = () => {
      pointerLockRef.current = document.pointerLockElement !== null;
    };

    document.addEventListener('pointerlockchange', handlePointerLockChange);
    const canvas = document.querySelector('canvas');
    if (canvas) canvas.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      if (canvas) canvas.removeEventListener('click', handleClick);
      document.exitPointerLock();
    };
  }, [socket, players, playerId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => keysRef.current[e.code] = true;
    const handleKeyUp = (e: KeyboardEvent) => keysRef.current[e.code] = false;
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => { window.removeEventListener('keydown', handleKeyDown); window.removeEventListener('keyup', handleKeyUp); };
  }, []);

  useEffect(() => {
    if (!socket || !players[playerId] || !pointerLockRef.current) return;
    const player = players[playerId];
    const moveSpeed = 0.2;

    const moveLoop = setInterval(() => {
      const moveVector = { x: 0, y: 0, z: 0 };
      let isMoving = false;

      if (keysRef.current['KeyW'] || keysRef.current['ArrowUp']) { moveVector.z -= moveSpeed; isMoving = true; }
      if (keysRef.current['KeyS'] || keysRef.current['ArrowDown']) { moveVector.z += moveSpeed; isMoving = true; }
      if (keysRef.current['KeyA'] || keysRef.current['ArrowLeft']) { moveVector.x -= moveSpeed; isMoving = true; }
      if (keysRef.current['KeyD'] || keysRef.current['ArrowRight']) { moveVector.x += moveSpeed; isMoving = true; }
      if (keysRef.current['Space'] && player.position.y <= 0.1) { moveVector.y += 0.5; socket.emit('action', { type: 'jump' }); }

      if (isMoving) {
        const newPosition = { x: player.position.x + moveVector.x, y: player.position.y + moveVector.y, z: player.position.z + moveVector.z };
        socket.emit('move', { position: newPosition, animation: 'running' });
      } else {
        socket.emit('move', { animation: 'idle' });
      }
    }, 16);

    return () => clearInterval(moveLoop);
  }, [socket, players, playerId]);

  useEffect(() => {
    if (!pointerLockRef.current || !camera) return;
    const handleMouseMove = (e: MouseEvent) => {
      camera.rotation.order = 'YXZ';
      camera.rotation.y -= e.movementX * 0.002;
      camera.rotation.x -= e.movementY * 0.002;
      camera.rotation.x = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, camera.rotation.x));
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [camera]);

  return null;
}