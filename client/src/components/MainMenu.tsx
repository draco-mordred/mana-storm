import { useState } from 'react';
import type { CharacterType } from '../types';
import { CHARACTER_PRESETS } from '../utils/constants';

interface MainMenuProps {
  onStartGame?: (name: string, characterType: CharacterType, server: string) => void;
  onResume?: () => void;
}

export default function MainMenu({ onStartGame, onResume }: MainMenuProps) {
  const [name, setName] = useState('');
  const [selectedChar, setSelectedChar] = useState<CharacterType>('warrior');
  const [serverUrl, setServerUrl] = useState('http://localhost:3001');
  const [error, setError] = useState('');

  const isStartMode = !!onStartGame;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isStartMode) {
      if (!name.trim()) { setError('Please enter your name'); return; }
      if (name.length > 20) { setError('Name must be 20 characters or less'); return; }
      setError('');
      onStartGame?.(name, selectedChar, serverUrl);
    } else {
      onResume?.();
    }
  };

  const styles = {
    container: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem', background: 'linear-gradient(135deg, #0a0e27 0%, #1a1a3e 50%, #0a0e27 100%)' },
    title: { fontSize: '4rem', fontWeight: 'bold', color: '#fff', textShadow: '0 0 20px #00ffff, 0 0 40px #00ffff', marginBottom: '2rem', letterSpacing: '0.5rem' },
    subtitle: { fontSize: '1.2rem', color: '#aaa', marginBottom: '3rem', textAlign: 'center' },
    form: { background: 'rgba(0, 0, 0, 0.7)', padding: '2rem', borderRadius: '15px', width: '100%', maxWidth: '500px', border: '1px solid rgba(0, 255, 255, 0.3)' },
    inputGroup: { marginBottom: '1.5rem' },
    label: { display: 'block', color: '#00ffff', marginBottom: '0.5rem', fontSize: '1.1rem' },
    input: { width: '100%', padding: '0.8rem', background: 'rgba(0, 0, 0, 0.5)', border: '1px solid #00ffff', borderRadius: '8px', color: '#fff', fontSize: '1rem', outline: 'none' },
    characterGrid: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', margin: '1.5rem 0' },
    characterCard: { background: 'rgba(0, 0, 0, 0.5)', border: '2px solid transparent', borderRadius: '10px', padding: '1rem', cursor: 'pointer', transition: 'all 0.3s', textAlign: 'center' },
    characterCardSelected: { borderColor: '#00ffff', background: 'rgba(0, 255, 255, 0.1)', transform: 'scale(1.05)' },
    characterIcon: { width: '60px', height: '60px', borderRadius: '50%', margin: '0 auto 0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' },
    characterName: { fontSize: '0.9rem', color: '#fff', fontWeight: 'bold' },
    button: { width: '100%', padding: '1rem', background: 'linear-gradient(135deg, #00ffff, #0080ff)', border: 'none', borderRadius: '8px', color: '#000', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s', marginTop: '1rem' },
    error: { color: '#ff4444', marginTop: '-1rem', marginBottom: '1rem', fontSize: '0.9rem' },
  };

  const characterTypes: CharacterType[] = ['warrior', 'mage', 'rogue', 'archer', 'healer'];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Mana Storm</h1>
      <p style={styles.subtitle}>
        {isStartMode ? 'A Multiplayer Adventure Game' : 'Game Paused'}
      </p>

      <form onSubmit={handleSubmit} style={styles.form}>
        {isStartMode && (
          <>
            <div style={styles.inputGroup}>
              <label htmlFor="name" style={styles.label}>Your Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your character name"
                maxLength={20}
                style={styles.input}
              />
            </div>

            <label style={styles.label}>Select Character</label>
            <div style={styles.characterGrid}>
              {characterTypes.map((charType) => {
                const preset = CHARACTER_PRESETS[charType];
                const isSelected = selectedChar === charType;
                const r = (preset.color >> 16) & 0xff;
                const g = (preset.color >> 8) & 0xff;
                const b = preset.color & 0xff;
                return (
                  <div
                    key={charType}
                    style={{
                      ...styles.characterCard,
                      ...(isSelected ? styles.characterCardSelected : {}),
                    }}
                    onClick={() => setSelectedChar(charType)}
                  >
                    <div
                      style={{
                        ...styles.characterIcon,
                        backgroundColor: `rgba(${r}, ${g}, ${b}, 0.8)`,
                      }}
                    >
                      {getCharacterIcon(charType)}
                    </div>
                    <div style={styles.characterName}>{preset.name}</div>
                  </div>
                );
              })}
            </div>

            <div style={styles.inputGroup}>
              <label htmlFor="server" style={styles.label}>Server URL</label>
              <input
                id="server"
                type="text"
                value={serverUrl}
                onChange={(e) => setServerUrl(e.target.value)}
                placeholder="http://localhost:3001"
                style={styles.input}
              />
            </div>
          </>
        )}

        {error && <p style={styles.error}>{error}</p>}

        <button type="submit" style={styles.button}>
          {isStartMode ? 'Start Game' : 'Resume Game'}
        </button>
      </form>
    </div>
  );
}

function getCharacterIcon(type: CharacterType): string {
  const icons: Record<CharacterType, string> = {
    warrior: '⚔️',
    mage: '🔮',
    rogue: '🗡️',
    archer: '🏹',
    healer: '💚',
  };
  return icons[type] || '❓';
}