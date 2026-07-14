import { useState, useEffect } from 'react';
import MainMenu from './components/MainMenu';
import GameScene from './components/GameScene';
import type { CharacterType } from './types';
import { DEFAULT_CHARACTER } from './utils/constants';

export default function App() {
  const [inGame, setInGame] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [characterType, setCharacterType] = useState<CharacterType>(DEFAULT_CHARACTER);
  const [serverUrl, setServerUrl] = useState('http://localhost:3001');

  useEffect(() => {
    const savedName = localStorage.getItem('manaStormCharacterName');
    const savedChar = localStorage.getItem('manaStormCharacterType') as CharacterType | null;
    const savedServer = localStorage.getItem('manaStormServerUrl');
    
    if (savedName) setPlayerName(savedName);
    if (savedChar) setCharacterType(savedChar);
    if (savedServer) setServerUrl(savedServer);
  }, []);

  const handleStartGame = (name: string, charType: CharacterType, server: string) => {
    setPlayerName(name);
    setCharacterType(charType);
    setServerUrl(server);
    localStorage.setItem('manaStormCharacterName', name);
    localStorage.setItem('manaStormCharacterType', charType);
    localStorage.setItem('manaStormServerUrl', server);
    setInGame(true);
  };

  const handleBackToMenu = () => {
    setInGame(false);
  };

  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
      {inGame ? (
        <GameScene
          playerName={playerName}
          characterType={characterType}
          serverUrl={serverUrl}
          onBackToMenu={handleBackToMenu}
        />
      ) : (
        <MainMenu onStartGame={handleStartGame} />
      )}
    </div>
  );
}