import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import type { ServerMessage, ClientMessage, Player, GameState } from '../types';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

export function useGameSocket(playerName: string, characterType: string) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [players, setPlayers] = useState<Record<string, Player>>({});
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(SERVER_URL, { reconnectionAttempts: 5, reconnectionDelay: 1000 });
    socketRef.current = newSocket;
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
      newSocket.emit('join', { name: playerName, characterType });
    });

    newSocket.on('disconnect', () => setIsConnected(false));

    newSocket.on('init', (initialState: GameState) => {
      setGameState(initialState);
      setPlayers(initialState.players);
    });

    newSocket.on('update', (update: Partial<GameState>) => {
      setGameState(prev => prev ? { ...prev, ...update } : null);
      if (update.players) setPlayers(update.players);
    });

    newSocket.on('player-joined', (player: Player) => {
      setPlayers(prev => ({ ...prev, [player.id]: player }));
    });

    newSocket.on('player-left', (playerId: string) => {
      setPlayers(prev => { const newPlayers = { ...prev }; delete newPlayers[playerId]; return newPlayers; });
    });

    return () => newSocket.disconnect();
  }, [playerName, characterType]);

  const sendMessage = (message: ClientMessage) => {
    if (socketRef.current && isConnected) socketRef.current.emit(message.type, message.data);
  };

  return { socket, isConnected, gameState, players, sendMessage };
}