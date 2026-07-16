import { useState, useEffect } from 'react';
import type { CharacterType } from '../types';
import { CHARACTER_PRESETS, DEFAULT_CHARACTER } from '../utils/constants';

interface MainMenuProps {
  onStartGame?: (name: string, characterType: CharacterType, server: string) => void;
  onResume?: () => void;
}

type MenuState = 'main' | 'login' | 'register' | 'character-select' | 'load-game';

export default function MainMenu({ onStartGame, onResume }: MainMenuProps) {
  const [menuState, setMenuState] = useState<MenuState>('main');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [characterName, setCharacterName] = useState('');
  const [selectedChar, setSelectedChar] = useState<CharacterType>(DEFAULT_CHARACTER);
  const [serverUrl, setServerUrl] = useState('http://localhost:3001');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [savedGames, setSavedGames] = useState<any[]>([]);

  // Check for saved games on mount
  useEffect(() => {
    const saved = localStorage.getItem('manaStormSavedGames');
    if (saved) {
      try {
        setSavedGames(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load saved games', e);
      }
    }
  }, []);

  const isStartMode = !!onStartGame;
  const characterTypes: CharacterType[] = ['rudeus', 'dracoAbie', 'warrior', 'mage', 'rogue', 'archer', 'healer'];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    await new Promise(resolve => setTimeout(resolve, 1000));
    localStorage.setItem('manaStormUsername', username);
    localStorage.setItem('manaStormLoggedIn', 'true');
    setSuccess('Login successful!');
    setIsLoading(false);
    const saved = localStorage.getItem('manaStormSavedGames');
    if (saved && JSON.parse(saved).length > 0) {
      setMenuS
tate('load-game');
    } else {
      setMenuState('character-select');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    await new Promise(resolve => setTimeout(resolve, 1000));
    localStorage.setItem('manaStormUsername', username);
    localStorage.setItem('manaStormEmail', email);
    localStorage.setItem('manaStormLoggedIn', 'true');
    setSuccess('Registration successful! Please login.');
    setIsLoading(false);
    setMenuState('login');
  };

  const handleStartNewGame = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!characterName.trim()) {
      setError('Please enter a character name');
      return;
    }
    if (characterName.length > 20) {
      setError('Character name must be 20 characters or less');
      return;
    }
    const newGame = {
      id: Date.now().toString(),
      characterType: selectedChar,
      characterName,
      position: { x: 0, y: 0, z: 0 },
      level: 1,
      xp: 0,
      health: CHARACTER_PRESETS[selectedChar].baseHealth,
      mana: CHARACTER_PRESETS[selectedChar].baseMana,
      skills: CHARACTER_PRESETS[selectedChar].skills,
      equipment: {},
      activeQuests: [],
      timestamp: Date.now(),
    };
    localStorage.setItem('manaStormCurrentGame', JSON.stringify(newGame));
    localStorage.setItem('manaStormUsername', username || 'Player');
    if (onStartGame) {
      onStartGame(characterName, selectedChar, serverUrl);
    }
  };

  const handleLoadGame = (game: any) => {
    localStorage.setItem('manaStormCurrentGame', JSON.stringify(game));
    if (onStartGame) {
      onStartGame(game.characterName, game.characterType, serverUrl);
    }
  };

  const handleDeleteGame = (id: string) => {
    const updatedGames = savedGames.filter(g => g.id !== id);
    setSavedGames(updatedGames);
    localStorage.setItem('manaStormSavedGames', JSON.stringify(updatedGames));
  };

  const getCharacterIcon =
 (type: CharacterType): string => {
    const icons: Record<CharacterType, string> = {
      dracoAbie: '🏹',
      rudeus: '👦',
      warrior: '⚔️',
      mage: '🔮',
      rogue: '🗡️',
      archer: '🏹',
      healer: '💚',
    };
    return icons[type] || '❓';
  };

  const getCharacterDisplayName = (type: CharacterType) => {
    return CHARACTER_PRESETS[type]?.name || type;
  };

  const getCharacterDescription = (type: CharacterType) => {
    return CHARACTER_PRESETS[type]?.description || 'A mysterious adventurer';
  };

  // Styles object
  const styles = {
    container: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a0e27 0%, #1a1a3e 50%, #0a0e27 100%)',
      padding: '2rem',
      zIndex: 100,
      overflowY: 'auto' as const,
    },
    panel: {
      width: '100%',
      maxWidth: '1000px',
      background: 'rgba(0, 0, 0, 0.8)',
      border: '1px solid rgba(0, 255, 255, 0.5)',
      borderRadius: '16px',
      padding: '2rem',
      boxShadow: '0 0 40px rgba(0, 255, 255, 0.2)',
    },
    title: {
      fontSize: '4.5rem',
      fontWeight: 'bold' as const,
      color: '#00ffff',
      textShadow: '0 0 30px rgba(255, 255, 255, 0.5)',
      letterSpacing: '0.5rem',
      margin: '0 0 0.5rem 0',
      textAlign: 'center' as const,
    },
    subtitle: {
      fontSize: '1.2rem',
      color: '#aaaaaa',
      margin: '0 0 2rem 0',
      textAlign: 'center' as const,
      letterSpacing: '0.3rem',
    },
    button: {
      padding: '1rem',
      background: 'linear-gradient(135deg, #00ffff, #0080ff)',
      border: 'none',
      borderRadius: '8px',
      color: '#000',
      fontSize: '1.1rem',
      fontWeight: 'bold' as const,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      margin: '0.5rem',
      width: '100%',
    },
    buttonS
econdary: {
      padding: '1rem',
      background: 'rgba(255, 0, 255, 0.3)',
      border: '1px solid #ff00ff',
      borderRadius: '8px',
      color: '#fff',
      fontSize: '1.1rem',
      fontWeight: 'bold' as const,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      margin: '0.5rem',
      width: '100%',
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      background: 'rgba(0, 0, 0, 0.5)',
      border: '1px solid #00ffff',
      borderRadius: '8px',
      color: '#fff',
      fontSize: '1rem',
      outline: 'none',
      marginBottom: '1rem',
    },
    characterGrid: {
      display: 'grid' as const,
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '1rem',
      margin: '1.5rem 0',
    },
    characterCard: {
      background: 'rgba(0, 0, 0, 0.7)',
      border: '2px solid transparent',
      borderRadius: '12px',
      padding: '1rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textAlign: 'center' as const,
    },
    characterCardSelected: {
      border: '2px solid #00ffff',
      background: 'rgba(0, 255, 255, 0.1)',
      transform: 'scale(1.05)',
      boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)',
    },
    characterIcon: {
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      margin: '0 auto 0.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '2rem',
    },
    characterName: {
      fontSize: '1rem',
      color: '#fff',
      fontWeight: 'bold' as const,
      margin: '0 0 0.25rem 0',
    },
    characterDesc: {
      fontSize: '0.8rem',
      color: '#aaaaaa',
      margin: 0,
    },
    error: {
      color: '#ff4444',
      margin: '1rem 0',
      fontSize: '0.9rem',
      textAlign: 'center' as const,
    },
    success: {
      color: '#00ff00',
      margin: '1rem 0',
      fontSize: '0.9rem',
      textAlign: 'center' as const,
    },
    savedGameCard: {
      background: 'rgb
a(0, 0, 0, 0.7)',
      border: '1px solid rgba(0, 255, 255, 0.3)',
      borderRadius: '8px',
      padding: '1rem',
      marginBottom: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center' as const,
    },
    buttonGroup: {
      display: 'flex',
      gap: '0.5rem',
    },
    buttonSmall: {
      padding: '0.5rem 1rem',
      background: 'linear-gradient(135deg, #00ffff, #0080ff)',
      border: 'none',
      borderRadius: '6px',
      color: '#000',
      fontSize: '0.9rem',
      fontWeight: 'bold' as const,
      cursor: 'pointer',
    },
    buttonDanger: {
      padding: '0.5rem 1rem',
      background: 'rgba(255, 68, 68, 0.5)',
      border: '1px solid #ff4444',
      borderRadius: '6px',
      color: '#fff',
      fontSize: '0.9rem',
      fontWeight: 'bold' as const,
      cursor: 'pointer',
    },
  };

  // Render different menu states
  const renderMainMenu = () => (
    <div style={styles.panel}>
      <h1 style={styles.title}>Mana Storm</h1>
      <p style={styles.subtitle}>An Anime RPG Adventure</p>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '2rem' }}>
        <button style={styles.button} onClick={() => {
          const loggedIn = localStorage.getItem('manaStormLoggedIn');
          if (loggedIn) {
            const saved = localStorage.getItem('manaStormSavedGames');
            if (saved && JSON.parse(saved).length > 0) {
              setMenuState('load-game');
            } else {
              setMenuState('character-select');
            }
          } else {
            setMenuState('login');
          }
        }}>
          Start Game
        </button>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button style={styles.buttonSecondary} onClick={() => setMenuState('login')}>
            Login
          </button>
          <button style={styles.buttonSecondary} onClick={() => setMenuState('re
gister')}>
            Register
          </button>
        </div>
      </div>
    </div>
  );

  const renderLoginMenu = () => (
    <div style={styles.panel}>
      <h1 style={styles.title}>Login</h1>
      
      {error && <p style={styles.error}>{error}</p>}
      {success && <p style={styles.success}>{success}</p>}
      
      <form onSubmit={handleLogin}>
        <input
          style={styles.input}
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          style={styles.input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button style={styles.button} type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <p style={{ color: '#aaaaaa', textAlign: 'center', margin: '1rem 0' }}>
        Don't have an account?{' '}
        <span
          onClick={() => setMenuState('register')}
          style={{ color: '#00ffff', cursor: 'pointer', textDecoration: 'underline' }}
        >
          Register
        </span>
      </p>
      
      <button style={styles.buttonSecondary} onClick={() => setMenuState('main')}>
        Back
      </button>
    </div>
  );

  const renderRegisterMenu = () => (
    <div style={styles.panel}>
      <h1 style={styles.title}>Create Account</h1>
      
      {error && <p style={styles.error}>{error}</p>}
      {success && <p style={styles.success}>{success}</p>}
      
      <form onSubmit={handleRegister}>
        <input
          style={styles.input}
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          style={styles.input}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.va
lue)}
          placeholder="Email (Optional)"
        />
        <input
          style={styles.input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button style={styles.button} type="submit" disabled={isLoading}>
          {isLoading ? 'Registering...' : 'Create Account'}
        </button>
      </form>
      
      <p style={{ color: '#aaaaaa', textAlign: 'center', margin: '1rem 0' }}>
        Already have an account?{' '}
        <span
          onClick={() => setMenuState('login')}
          style={{ color: '#00ffff', cursor: 'pointer', textDecoration: 'underline' }}
        >
          Login
        </span>
      </p>
      
      <button style={styles.buttonSecondary} onClick={() => setMenuState('main')}>
        Back
      </button>
    </div>
  );

  const renderCharacterSelectMenu = () => (
    <div style={styles.panel}>
      <h1 style={styles.title}>Select Your Character</h1>
      <p style={styles.subtitle}>Choose your destiny</p>
      
      <div style={styles.characterGrid}>
        {characterTypes.map((type) => {
          const preset = CHARACTER_PRESETS[type];
          const isSelected = selectedChar === type;
          const r = (preset.color >> 16) & 0xff;
          const g = (preset.color >> 8) & 0xff;
          const b = preset.color & 0xff;
          
          return (
            <div
              key={type}
              onClick={() => setSelectedChar(type)}
              style={{
                ...styles.characterCard,
                ...(isSelected ? styles.characterCardSelected : {}),
              }}
            >
              <div
                style={{
                  ...styles.characterIcon,
                  backgroundColor: `rgba(${r}, ${g}, ${b}, 0.8)`,
                }}
              >
                {getCharacterIcon(type)}
              </div>
              <div style={styles.characterName}>{preset.name
}</div>
              <p style={styles.characterDesc}>{getCharacterDescription(type)}</p>
            </div>
          );
        })}
      </div>
      
      <form onSubmit={handleStartNewGame}>
        <input
          style={styles.input}
          type="text"
          value={characterName}
          onChange={(e) => setCharacterName(e.target.value)}
          placeholder="Character Name"
          maxLength={20}
        />
        <input
          style={styles.input}
          type="text"
          value={serverUrl}
          onChange={(e) => setServerUrl(e.target.value)}
          placeholder="Server URL (http://localhost:3001)"
        />
        {error && <p style={styles.error}>{error}</p>}
        <button style={styles.button} type="submit" disabled={isLoading}>
          {isLoading ? 'Starting Game...' : 'Start New Game'}
        </button>
      </form>
      
      {savedGames.length > 0 && (
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p style={{ color: '#aaaaaa', marginBottom: '1rem' }}>
            Or continue from a saved game:
          </p>
          <button style={styles.buttonSecondary} onClick={() => setMenuState('load-game')}>
            Load Saved Game
          </button>
        </div>
      )}
      
      <button style={styles.buttonSecondary} onClick={() => setMenuState('main')}>
        Back
      </button>
    </div>
  );

  const renderLoadGameMenu = () => (
    <div style={styles.panel}>
      <h1 style={styles.title}>Load Game</h1>
      <p style={styles.subtitle}>Continue your adventure</p>
      
      {savedGames.length === 0 ? (
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#aaaaaa', margin: '2rem 0' }}>No saved games found.</p>
          <button style={styles.button} onClick={() => setMenuState('character-select')}>
            Start New Game
          </button>
        </div>
      ) : (
        <div>
          {savedGames.map((game) => (
            <div key={game.
id} style={styles.savedGameCard}>
              <div>
                <h4 style={{ color: '#fff', margin: '0 0 0.25rem 0' }}>
                  {game.characterName}
                </h4>
                <p style={{ color: '#aaaaaa', fontSize: '0.85rem', margin: '0 0 0.25rem 0' }}>
                  Level {game.level} {getCharacterDisplayName(game.characterType)}
                </p>
                <p style={{ color: '#aaaaaa', fontSize: '0.75rem', margin: 0 }}>
                  {new Date(game.timestamp).toLocaleDateString()}
                </p>
              </div>
              <div style={styles.buttonGroup}>
                <button style={styles.buttonSmall} onClick={() => handleLoadGame(game)}>
                  Continue
                </button>
                <button style={styles.buttonDanger} onClick={() => handleDeleteGame(game.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
          
          <button style={styles.button} onClick={() => setMenuState('character-select')}>
            Start New Game
          </button>
        </div>
      )}
      
      <button style={styles.buttonSecondary} onClick={() => setMenuState('main')}>
        Back
      </button>
    </div>
  );

  // Render the appropriate menu based on state
  const renderMenu = () => {
    switch (menuState) {
      case 'login': return renderLoginMenu();
      case 'register': return renderRegisterMenu();
      case 'character-select': return renderCharacterSelectMenu();
      case 'load-game': return renderLoadGameMenu();
      default: return renderMainMenu();
    }
  };

  return (
    <div style={styles.container}>
      {renderMenu()}
    </div>
  );
}