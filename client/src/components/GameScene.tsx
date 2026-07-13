import { useEffect, useRef, useState } from 'react';
import MainMenu from './MainMenu';
import GameHUD from './ui/GameHUD';
import type { CharacterType, Player, GameState } from '../types';

interface GameSceneProps {
  playerName: string;
  characterType: CharacterType;
  serverUrl: string;
  onBackToMenu: () => void;
}

export default function GameScene({ playerName, characterType, serverUrl, onBackToMenu }: GameSceneProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [currentPlayerId, setCurrentPlayerId] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [players, setPlayers] = useState<Record<string, Player>>({});
  const socketRef = useRef<any>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const initThreeJS = async () => {
      const THREE = (window as any).THREE;
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x87ceeb);
      scene.fog = new THREE.Fog(0x87ceeb, 1, 1000);
      (window as any).scene = scene;

      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(0, 5, 10);
      (window as any).camera = camera;

      const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.shadowMap.enabled = true;

      const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(10, 20, 10);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 2048;
      directionalLight.shadow.mapSize.height = 2048;
      scene.add(directionalLight);

      const groundGeometry = new THREE.PlaneGeometry(1000, 1000);
      const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x1a5fb4, roughness: 0.8, metalness: 0.2 });
      const ground = new THREE.Mesh(groundGeometry, groundMaterial);
      ground.rotation.x = -Math.PI / 2;
      ground.receiveShadow = true;
      scene.add(ground);

      const gridHelper = new THREE.GridHelper(100, 100, 0x333333, 0x333333);
      scene.add(gridHelper);

      const axesHelper = new THREE.AxesHelper(5);
      scene.add(axesHelper);

      const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };
      animate();

      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', handleResize);

      return () => window.removeEventListener('resize', handleResize);
    };

    initThreeJS();

    const socket = (window as any).io(serverUrl, { reconnectionAttempts: 5, reconnectionDelay: 1000 });
    socketRef.current = socket;

    socket.on('connect', () => socket.emit('join', { name: playerName, characterType }));
    socket.on('init', (initialState: GameState) => { setGameState(initialState); setPlayers(initialState.players); setCurrentPlayerId(initialState.currentPlayerId); });
    socket.on('update', (update: Partial<GameState>) => { setGameState(prev => prev ? { ...prev, ...update } : null); if (update.players) setPlayers(update.players); });
    socket.on('disconnect', () => console.log('Disconnected'));

    return () => socket.disconnect();
  }, [playerName, characterType, serverUrl]);

  const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowMenu(!showMenu); };
  useEffect(() => { window.addEventListener('keydown', handleEscape); return () => window.removeEventListener('keydown', handleEscape); }, [showMenu]);

  if (showMenu) return <div style={{ position: 'relative', width: '100%', height: '100vh' }}><canvas ref={canvasRef} style={{ display: 'block' }} /><MainMenu onStartGame={() => setShowMenu(false)} /></div>;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <canvas ref={canvasRef} style={{ display: 'block' }} />
      {gameState && currentPlayerId && <><GameHUD player={players[currentPlayerId]} onMenuClick={() => setShowMenu(true)} /></>}
      <button onClick={() => onBackToMenu()} style={{ position: 'absolute', top: '20px', right: '20px', padding: '10px 20px', background: 'rgba(0, 0, 0, 0.7)', color: '#fff', border: '1px solid #00ffff', borderRadius: '5px', cursor: 'pointer', zIndex: 100 }}>Back to Menu</button>
    </div>
  );
}