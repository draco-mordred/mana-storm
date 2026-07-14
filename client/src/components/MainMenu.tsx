import { useState, useEffect } from 'react';
import type { CharacterType } from '../types';
import { CHARACTER_PRESETS, CHARACTER_VISUALS } from '../utils/constants';

interface MainMenuProps {
  onStartGame?: (name: string, characterType: CharacterType, server: string) => void;
  onResume?: () => void;
}

function CharacterPreview({ charType, isSelected, onClick }: {
  charType: CharacterType;
  isSelected: boolean;
  onClick: () => void;
}) {
  const visual = CHARACTER_VISUALS[charType];
  const preset = CHARACTER_PRESETS[charType];
  const colorStr = preset.color.toString(16).padStart(6, '0');
  const hairColorStr = visual.hairColor.toString(16).padStart(6, '0');

  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '15px',
        borderRadius: '15px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        background: isSelected 
          ? 'linear-gradient(135deg, rgba(0, 255, 255, 0.3), rgba(0, 200, 255, 0.2))'
          : 'rgba(0, 0, 0, 0.3)',
        border: isSelected ? '2px solid #00ffff' : '2px solid transparent',
        transform: isSelected ? 'scale(1.05)' : 'scale(1)',
        boxShadow: isSelected ? '0 0 20px rgba(0, 255, 255, 0.5)' : 'none',
        width: '140px',
        margin: '10px',
      }}
    >
      <div style={{
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        background: `linear-gradient(135deg, #${colorStr}, #${hairColorStr})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '10px',
        border: '3px solid #fff',
        boxShadow: '0 0 15px rgba(0, 0, 0, 0.5)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <span style={{
          fontSize: '3rem',
          color: '#fff',
          textShadow: '0 0 10px rgba(0, 0, 0, 0.8)',
        }}>
          {getCharacterEmoji(charType)}
        </span>
        {isSelected && (
          <div style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            border: '2px solid #00ffff',
            borderRadius: '50%',
          }} />
        )}
      </div>
      
      <div style={{
        fontSize: '0.9rem',
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        textShadow: '0 0 5px rgba(0, 0, 0, 0.8)',
      }}>
        {visual.name}
      </div>
      
      <div style={{
        fontSize: '0.75rem',
        color: '#00ffff',
        textAlign: 'center',
        marginTop: '5px',
      }}>
        {preset.description?.split('.')[0] || preset.name}
      </div>
    </div>
  );
}

function LoginForm({ onLogin, onSwitchToRegister, error }: {
  onLogin: (username: string, password: string) => void;
  onSwitchToRegister: () => void;
  error?: string;
}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div style={formStyles.container}>
      <h2 style={formStyles.title}>Login</h2>
      {error && <p style={formStyles.error}>{error}</p>}
      <form onSubmit={handleSubmit} style={formStyles.form}>
        <div style={formStyles.inputGroup}>
          <label style={formStyles.label}>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            style={formStyles.input}
            required
          />
        </div>
        <div style={formStyles.inputGroup}>
          <label style={formStyles.label}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            style={formStyles.input}
            required
          />
        </div>
        <button type="submit" style={formStyles.button}>
          Login
        </button>
      </form>
      <p style={formStyles.switchText}>
        Don't have an account?{' '}
        <span onClick={onSwitchToRegister} style={formStyles.switchLink}>
          Register
        </span>
      </p>
    </div>
  );
}

function RegisterForm({ onRegister, onSwitchToLogin, error }: {
  onRegister: (form: { username: string; password: string; email: string; characterName: string; characterType: CharacterType }) => void;
  onSwitchToLogin: () => void;
  error?: string;
}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [characterName, setCharacterName] = useState('');
  const [characterType, setCharacterType] = useState<CharacterType>('rudeus');
  const characterTypes: CharacterType[] = ['rudeus', 'warrior', 'mage', 'rogue', 'archer', 'healer'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister({ username, password, email, characterName, characterType });
  };

  return (
    <div style={formStyles.container}>
      <h2 style={formStyles.title}>Create Account</h2>
      {error && <p style={formStyles.error}>{error}</p>}
      <form onSubmit={handleSubmit} style={formStyles.form}>
        <div style={formStyles.inputGroup}>
          <label style={formStyles.label}>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            style={formStyles.input}
            required
          />
        </div>
        <div style={formStyles.inputGroup}>
          <label style={formStyles.label}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            style={formStyles.input}
          />
        </div>
        <div style={formStyles.inputGroup}>
          <label style={formStyles.label}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            style={formStyles.input}
            required
          />
        </div>
        <div style={formStyles.inputGroup}>
          <label style={formStyles.label}>Character Name</label>
          <input
            type="text"
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
            placeholder="Enter character name"
            style={formStyles.input}
            required
          />
        </div>
        <label style={formStyles.label}>Select Character</label>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          maxWidth: '600px',
          margin: '0 auto',
        }}>
          {characterTypes.map((charType) => (
            <CharacterPreview
              key={charType}
              charType={charType}
              isSelected={characterType === charType}
              onClick={() => setCharacterType(charType)}
            />
          ))}
        </div>
        <button type="submit" style={formStyles.button}>
          Create Account
        </button>
      </form>
      <p style={formStyles.switchText}>
        Already have an account?{' '}
        <span onClick={onSwitchToLogin} style={formStyles.switchLink}>
          Login
        </span>
      </p>
    </div>
  );
}

export default function MainMenu({ onStartGame, onResume }: MainMenuProps) {
  const [screen, setScreen] = useState<'main' | 'login' | 'register'>('main');
  const [error, setError] = useState('');
  const [users, setUsers] = useState<Record<string, any>>({});

  const isStartMode = !!onStartGame;

  useEffect(() => {
    const savedUsers = localStorage.getItem('manaStormUsers');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
  }, []);

  const handleLogin = (username: string, password: string) => {
    const user = users[username];
    if (user && user.password === password) {
      localStorage.setItem('manaStormLoggedInUser', username);
      localStorage.setItem('manaStormCharacterName', user.characterName);
      localStorage.setItem('manaStormCharacterType', user.characterType);
      if (onStartGame) {
        onStartGame(user.characterName, user.characterType, 'http://localhost:3001');
      }
    } else {
      setError('Invalid username or password');
    }
  };

  const handleRegister = (form: { username: string; password: string; email: string; characterName: string; characterType: CharacterType }) => {
    if (users[form.username]) {
      setError('Username already exists');
      return;
    }
    const newUser = {
      username: form.username,
      password: form.password,
      email: form.email,
      characterName: form.characterName,
      characterType: form.characterType,
      createdAt: Date.now(),
    };
    const updatedUsers = { ...users, [form.username]: newUser };
    setUsers(updatedUsers);
    localStorage.setItem('manaStormUsers', JSON.stringify(updatedUsers));
    setError('');
    setScreen('main');
    localStorage.setItem('manaStormLoggedInUser', form.username);
    localStorage.setItem('manaStormCharacterName', form.characterName);
    localStorage.setItem('manaStormCharacterType', form.characterType);
    if (onStartGame) {
      onStartGame(form.characterName, form.characterType, 'http://localhost:3001');
    }
  };

  const handleResume = () => {
    onResume?.();
  };

  const savedCharacterName = localStorage.getItem('manaStormCharacterName');
  const savedCharacterType = localStorage.getItem('manaStormCharacterType') as CharacterType | null;

  const handleContinue = () => {
    if (savedCharacterName && savedCharacterType && onStartGame) {
      onStartGame(savedCharacterName, savedCharacterType, 'http://localhost:3001');
    }
  };

  const styles = {
    container: {
      position: 'relative' as const,
      width: '100%',
      height: '100vh',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #0a0e27 0%, #1a1a3e 50%, #0a0e27 100%)',
    },
    background: {
      position: 'absolute' as const,
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      background: 'radial-gradient(ellipse at center, rgba(0, 255, 255, 0.1) 0%, transparent 70%)',
    },
    content: {
      position: 'relative' as const,
      zIndex: 10,
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    titleContainer: {
      textAlign: 'center' as const,
      marginBottom: '3rem',
    },
    title: {
      fontSize: '5rem',
      fontWeight: 'bold' as const,
      color: '#fff',
      textShadow: '0 0 30px #00ffff, 0 0 60px #00ffff, 0 0 90px #00ffff',
      letterSpacing: '0.8rem',
      margin: '0',
      fontFamily: "'Arial Black', sans-serif",
      textTransform: 'uppercase' as const,
    },
    subtitle: {
      fontSize: '1.2rem',
      color: '#00ffff',
      marginTop: '0.5rem',
      letterSpacing: '0.3rem',
      fontFamily: "'Courier New', monospace",
    },
    characterSelectContainer: {
      background: 'rgba(0, 0, 0, 0.6)',
      borderRadius: '20px',
      padding: '2rem',
      marginBottom: '2rem',
      border: '1px solid rgba(0, 255, 255, 0.3)',
      width: '100%',
      maxWidth: '800px',
    },
    sectionTitle: {
      fontSize: '1.5rem',
      color: '#00ffff',
      textAlign: 'center' as const,
      marginBottom: '1.5rem',
      fontFamily: "'Courier New', monospace",
    },
    characterGrid: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      justifyContent: 'center',
      gap: '15px',
      marginBottom: '1.5rem',
    },
    nameInputGroup: {
      marginBottom: '1rem',
    },
    label: {
      display: 'block',
      color: '#00ffff',
      marginBottom: '0.5rem',
      fontSize: '1rem',
      fontFamily: "'Courier New', monospace",
    },
    input: {
      width: '100%',
      maxWidth: '400px',
      padding: '0.8rem',
      background: 'rgba(0, 0, 0, 0.5)',
      border: '1px solid #00ffff',
      borderRadius: '8px',
      color: '#fff',
      fontSize: '1rem',
      outline: 'none',
      fontFamily: "'Courier New', monospace",
    },
    startButton: {
      padding: '1rem 3rem',
      background: 'linear-gradient(135deg, #00ffff, #0080ff)',
      border: 'none',
      borderRadius: '10px',
      color: '#000',
      fontSize: '1.5rem',
      fontWeight: 'bold' as const,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontFamily: "'Arial Black', sans-serif",
      textTransform: 'uppercase' as const,
      letterSpacing: '0.2rem',
      boxShadow: '0 0 30px rgba(0, 255, 255, 0.5)',
      marginBottom: '1rem',
    },
    authLinks: {
      display: 'flex',
      gap: '1rem',
      marginTop: '1rem',
    },
    authText: {
      color: '#aaa',
      fontSize: '0.9rem',
      alignSelf: 'center' as const,
    },
    authButton: {
      padding: '0.5rem 1.5rem',
      background: 'rgba(0, 255, 255, 0.2)',
      border: '1px solid #00ffff',
      borderRadius: '5px',
      color: '#00ffff',
      fontSize: '0.9rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontFamily: "'Courier New', monospace",
    },
  };

  const formStyles = {
    container: {
      background: 'rgba(0, 0, 0, 0.8)',
      borderRadius: '15px',
      padding: '2rem',
      maxWidth: '450px',
      margin: '0 auto',
      border: '1px solid rgba(0, 255, 255, 0.3)',
    },
    title: {
      fontSize: '1.8rem',
      color: '#00ffff',
      textAlign: 'center' as const,
      marginBottom: '1.5rem',
      fontFamily: "'Arial Black', sans-serif",
    },
    form: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '1rem',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
    },
    label: {
      color: '#00ffff',
      marginBottom: '0.5rem',
      fontSize: '0.9rem',
      fontFamily: "'Courier New', monospace",
    },
    input: {
      padding: '0.8rem',
      background: 'rgba(0, 0, 0, 0.5)',
      border: '1px solid #00ffff',
      borderRadius: '8px',
      color: '#fff',
      fontSize: '1rem',
      outline: 'none',
      fontFamily: "'Courier New', monospace",
    },
    button: {
      padding: '1rem',
      background: 'linear-gradient(135deg, #00ffff, #0080ff)',
      border: 'none',
      borderRadius: '8px',
      color: '#000',
      fontSize: '1rem',
      fontWeight: 'bold' as const,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontFamily: "'Arial Black', sans-serif",
      textTransform: 'uppercase' as const,
    },
    error: {
      color: '#ff4444',
      textAlign: 'center' as const,
      marginBottom: '1rem',
      fontSize: '0.9rem',
    },
    switchText: {
      textAlign: 'center' as const,
      color: '#aaa',
      marginTop: '1rem',
      fontSize: '0.9rem',
    },
    switchLink: {
      color: '#00ffff',
      cursor: 'pointer',
      fontWeight: 'bold' as const,
    },
  };

  function getCharacterEmoji(charType: CharacterType): string {
    const emojis: Record<CharacterType, string> = {
      rudeus: '👦',
      warrior: '💪',
      mage: '🔮',
      rogue: '🗡️',
      archer: '🏹',
      healer: '💚',
    };
    return emojis[charType] || '❓';
  }

  switch (screen) {
    case 'login':
      return (
        <div style={styles.container}>
          <div style={styles.background} />
          <div style={{ ...styles.content, justifyContent: 'center' }}>
            <LoginForm
              onLogin={handleLogin}
              onSwitchToRegister={() => setScreen('register')}
              error={error}
            />
            <button
              onClick={() => setScreen('main')}
              style={{ ...styles.authButton, marginTop: '1rem' }}
            >
              Back
            </button>
          </div>
        </div>
      );

    case 'register':
      return (
        <div style={styles.container}>
          <div style={styles.background} />
          <div style={{ ...styles.content, justifyContent: 'center' }}>
            <RegisterForm
              onRegister={handleRegister}
              onSwitchToLogin={() => setScreen('login')}
              error={error}
            />
            <button
              onClick={() => setScreen('main')}
              style={{ ...styles.authButton, marginTop: '1rem' }}
            >
              Back
            </button>
          </div>
        </div>
      );

    default:
      if (isStartMode) {
        return (
          <div style={styles.container}>
            <div style={styles.background} />
            <div style={styles.content}>
              <div style={styles.titleContainer}>
                <h1 style={styles.title}>MANA STORM</h1>
                <p style={styles.subtitle}>A Jobless Reincarnation RPG</p>
              </div>
              <div style={styles.characterSelectContainer}>
                <h2 style={styles.sectionTitle}>Select Your Character</h2>
                <div style={styles.characterGrid}>
                  {['rudeus', 'warrior', 'mage', 'rogue', 'archer', 'healer'].map((charType) => (
                    <CharacterPreview
                      key={charType}
                      charType={charType as CharacterType}
                      isSelected={false}
                      onClick={() => {}}
                    />
                  ))}
                </div>
                <div style={styles.nameInputGroup}>
                  <label style={styles.label}>Character Name</label>
                  <input
                    type="text"
                    placeholder="Enter your character name"
                    maxLength={20}
                    style={styles.input}
                  />
                </div>
                <div style={styles.nameInputGroup}>
                  <label style={styles.label}>Server URL</label>
                  <input
                    type="text"
                    placeholder="http://localhost:3001"
                    style={styles.input}
                  />
                </div>
              </div>
              <button style={styles.startButton}>
                Start Game
              </button>
              <div style={styles.authLinks}>
                <button onClick={() => setScreen('login')} style={styles.authButton}>
                  Login
                </button>
                <button onClick={() => setScreen('register')} style={styles.authButton}>
                  Register
                </button>
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div style={styles.container}>
            <div style={styles.background} />
            <div style={{ ...styles.content, justifyContent: 'center' }}>
              <div style={styles.titleContainer}>
                <h1 style={styles.title}>PAUSED</h1>
              </div>
              <div style={{ textAlign: 'center' as const, marginBottom: '2rem' }}>
                {savedCharacterName && (
                  <p style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1rem' }}>
                    {savedCharacterName}
                  </p>
                )}
                {savedCharacterName && savedCharacterType && (
                  <button onClick={handleContinue} style={styles.startButton}>
                    Continue Game
                  </button>
                )}
                <button onClick={handleResume} style={{ ...styles.startButton, marginTop: '1rem' }}>
                  Resume
                </button>
                <button onClick={onResume} style={{ ...styles.authButton, marginTop: '1rem' }}>
                  Back to Menu
                </button>
              </div>
            </div>
          </div>
        );
      }
  }
}
