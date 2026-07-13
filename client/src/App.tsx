import { useState, useEffect } from 'react';
import MainMenu from './components/MainMenu';
import GameScene from './components/GameScene';
import type { CharacterType } from './types';

export default function App() {
  const [inGame, setInGame] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [characterType, setCharacterType] = useState<CharacterType>('warrior');
  const [serverUrl, setServerUrl] = useState('http://localhost:3001');

  useEffect(() => {
    const savedName = localStorage.getItem('manaStormPlayerName');
    const savedChar = localStorage.getItem('manaStormCharacterType') as CharacterType | null;
    if (savedName) setPlayerName(savedName);
    if (savedChar) setCharacterType(savedChar);
  }, []);

  const handleStartGame = (name: string, charType: CharacterType, server: string) => {
    setPlayerName(name);
    setCharacterType(charType);
    setServerUrl(server);
    localStorage.setItem('manaStormPlayerName', name);
    localStorage.setItem('manaStormCharacterType', charType);
    setInGame(true);
  };

  const handleBackToMenu = () => setInGame(false);

  return (
    <div className="game-container">
      {inGame ? (
        <GameScene playerName={playerName} characterType={characterType} serverUrl={serverUrl} onBackToMenu={handleBackToMenu} />
      ) : (
        <MainMenu onStartGame={handleStartGame} />
      )}
    </div>
  );
}