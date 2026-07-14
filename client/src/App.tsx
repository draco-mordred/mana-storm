import { useState, useEffect } from 'react';
import MainMenu from './components/MainMenu';
import GameScene from './components/GameScene';
import type { CharacterType, UserAccount, SaveSlot } from './types';
import { GAME_CONSTANTS } from './utils/constants';

// Local storage keys
const USER_KEY = 'manaStormUser';
const SAVE_KEY = 'manaStormSave';

interface UserData {
  username: string;
  character: CharacterType;
}

export default function App() {
  const [inGame, setInGame] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [characterType, setCharacterType] = useState<CharacterType>(GAME_CONSTANTS.DEFAULT_CHARACTER as CharacterType);
  const [serverUrl, setServerUrl] = useState('http://localhost:3001');
  const [user, setUser] = useState<UserData | null>(null);
  const [saveSlots, setSaveSlots] = useState<SaveSlot[]>([]);

  // Load user data from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem(USER_KEY);
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser) as UserData;
        setUser(userData);
        setPlayerName(userData.username);
        setCharacterType(userData.character);
      } catch (e) {
        console.error('Error loading user data:', e);
      }
    }

    // Load save slots
    const savedSlots = localStorage.getItem(SAVE_KEY);
    if (savedSlots) {
      try {
        const slots = JSON.parse(savedSlots) as SaveSlot[];
        setSaveSlots(slots);
      } catch (e) {
        console.error('Error loading save slots:', e);
      }
    }
  }, []);

  // Save user data to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  }, [user]);

  // Save save slots to localStorage
  useEffect(() => {
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveSlots));
  }, [saveSlots]);

  const handleStartGame = (name: string, charType: CharacterType, server: string) => {
    setPlayerName(name);
    setCharacterType(charType);
    setServerUrl(server);
    setUser({ username: name, character: charType });
    setInGame(true);
  };

  const handleBackToMenu = () => {
    setInGame(false);
  };

  const handleResumeGame = () => {
    // Resume from pause menu
    setInGame(true);
  };

  // Create a new save slot
  const createSaveSlot = (name: string, charType: CharacterType, level: number = 1) => {
    const newSlot: SaveSlot = {
      id: Date.now().toString(),
      name: name || `Save ${saveSlots.length + 1}`,
      characterType: charType,
      level: level,
      lastPlayed: Date.now(),
    };
    setSaveSlots([...saveSlots, newSlot]);
    return newSlot;
  };

  // Update save slot
  const updateSaveSlot = (id: string, updates: Partial<SaveSlot>) => {
    setSaveSlots(saveSlots.map(slot =>
      slot.id === id ? { ...slot, ...updates, lastPlayed: Date.now() } : slot
    ));
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
        <MainMenu
          onStartGame={handleStartGame}
          onResume={user ? handleResumeGame : undefined}
        />
      )}
    </div>
  );
}
