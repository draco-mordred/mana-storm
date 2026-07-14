import type { Player } from '../../types';
import { CHARACTER_PRESETS } from '../../utils/constants';

interface GameHUDProps {
  player: Player | undefined;
  onMenuClick: () => void;
}

export default function GameHUD({ player, onMenuClick }: GameHUDProps) {
  if (!player) {
    return null;
  }

  const healthPercent = (player.health / player.maxHealth) * 100;
  const manaPercent = (player.mana / player.maxMana) * 100;
  const xpPercent = (player.xp / (player.level * 1000)) * 100;
  
  const preset = CHARACTER_PRESETS[player.character];

  const styles = {
    // Main HUD container
    hud: {
      position: 'absolute' as const,
      top: '20px',
      left: '20px',
      color: '#fff',
      background: 'rgba(0, 0, 0, 0.7)',
      padding: '20px',
      borderRadius: '15px',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
      zIndex: 100,
      width: '280px',
      border: '2px solid rgba(0, 255, 255, 0.3)',
      boxShadow: '0 0 20px rgba(0, 255, 255, 0.2)',
    },
    
    // Header with character info
    header: {
      display: 'flex' as const,
      alignItems: 'center',
      marginBottom: '15px',
      paddingBottom: '15px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
    },
    
    // Character icon
    characterIcon: {
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      marginRight: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.8rem',
      background: `rgba(${(preset.color >> 16) & 0xff}, ${(preset.color >> 8) & 0xff}, ${preset.color & 0xff}, 0.8)`,
      border: '2px solid #fff',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
    },
    
    // Character info
    characterInfo: {
      flex: 1,
    },
    
    // Character name
    name: {
      fontSize: '1.3rem',
      fontWeight: 'bold' as const,
      color: '#00ffff',
      margin: '0 0 5px 0',
      textShadow: '0 0 5px rgba(0, 255, 255, 0.5)',
    },
    
    // Character class
    characterClass: {
      fontSize: '0.9rem',
      color: '#aaa',
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
    },
    
    // Level display
    level: {
      fontSize: '0.9rem',
      color: '#ffaa00',
      fontWeight: 'bold' as const,
    },
    
    // Stats section
    stats: {
      marginTop: '10px',
    },
    
    // Stat row
    statRow: {
      display: 'flex' as const,
      justifyContent: 'space-between',
      alignItems: 'center',
      margin: '8px 0',
    },
    
    // Stat label
    statLabel: {
      fontSize: '0.85rem',
      color: '#aaa',
    },
    
    // Stat value
    statValue: {
      fontSize: '0.85rem',
      color: '#fff',
      fontWeight: 'bold' as const,
    },
    
    // Bar container
    barContainer: {
      width: '100%',
      margin: '5px 0',
    },
    
    // Bar background
    barBg: {
      height: '18px',
      background: '#333',
      borderRadius: '9px',
      overflow: 'hidden' as const,
      border: '1px solid #555',
      position: 'relative' as const,
    },
    
    // Bar fill
    barFill: {
      height: '100%',
      borderRadius: '9px',
      transition: 'width 0.3s ease',
      position: 'relative' as const,
    },
    
    // Health bar
    healthBar: {
      background: 'linear-gradient(90deg, #ff0000, #ff4444, #ff0000)',
    },
    
    // Mana bar
    manaBar: {
      background: 'linear-gradient(90deg, #0088ff, #44aaff, #0088ff)',
    },
    
    // XP bar
    xpBar: {
      background: 'linear-gradient(90deg, #ffd700, #ffcc00, #ffd700)',
    },
    
    // Bar text
    barText: {
      position: 'absolute' as const,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      fontSize: '0.7rem',
      color: '#fff',
      fontWeight: 'bold' as const,
      textShadow: '0 0 5px rgba(0, 0, 0, 0.8)',
    },
    
    // Skills section
    skills: {
      display: 'flex' as const,
      gap: '8px',
      marginTop: '15px',
      flexWrap: 'wrap' as const,
    },
    
    // Skill button
    skill: {
      padding: '6px 12px',
      background: 'rgba(0, 255, 255, 0.15)',
      border: '1px solid rgba(0, 255, 255, 0.5)',
      borderRadius: '6px',
      fontSize: '0.75rem',
      color: '#00ffff',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '3px',
    },
    
    // Menu button
    menuButton: {
      position: 'absolute' as const,
      top: '10px',
      right: '10px',
      padding: '8px 16px',
      background: 'rgba(255, 0, 0, 0.2)',
      border: '1px solid #ff4444',
      borderRadius: '6px',
      color: '#ff4444',
      cursor: 'pointer',
      fontSize: '0.8rem',
      fontWeight: 'bold' as const,
      transition: 'all 0.2s',
    },
    
    // Mini map placeholder
    miniMap: {
      position: 'absolute' as const,
      bottom: '20px',
      right: '20px',
      width: '150px',
      height: '150px',
      background: 'rgba(0, 0, 0, 0.6)',
      border: '2px solid #00ffff',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#00ffff',
      fontSize: '0.8rem',
      zIndex: 99,
    },
    
    // Coordinates display
    coordinates: {
      position: 'absolute' as const,
      bottom: '20px',
      left: '20px',
      fontSize: '0.8rem',
      color: 'rgba(255, 255, 255, 0.7)',
      background: 'rgba(0, 0, 0, 0.5)',
      padding: '5px 10px',
      borderRadius: '5px',
      zIndex: 99,
    },
  };

  return (
    <div style={styles.hud}>
      {/* Menu Button */}
      <button
        style={styles.menuButton}
        onClick={onMenuClick}
        onMouseEnter={(e) => {
          (e.target as HTMLButtonElement).style.background = 'rgba(255, 0, 0, 0.4)';
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLButtonElement).style.background = 'rgba(255, 0, 0, 0.2)';
        }}
      >
        Menu
      </button>

      {/* Header */}
      <div style={styles.header}>
        <div
          style={styles.characterIcon}
        >
          {getCharacterIcon(player.character)}
        </div>
        <div style={styles.characterInfo}>
          <div style={styles.name}>{player.name}</div>
          <div style={styles.characterClass}>
            <span>{preset.name}</span>
            <span style={styles.level}>Lv. {player.level}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={styles.stats}>
        {/* Health */}
        <div style={styles.statRow}>
          <span style={styles.statLabel}>HP:</span>
          <span style={styles.statValue}>{Math.floor(player.health)}/{player.maxHealth}</span>
        </div>
        <div style={styles.barContainer}>
          <div style={styles.barBg}>
            <div
              style={{
                ...styles.barFill,
                ...styles.healthBar,
                width: `${healthPercent}%`,
              }}
            />
            <span style={styles.barText}>{Math.floor(healthPercent)}%</span>
          </div>
        </div>

        {/* Mana */}
        <div style={styles.statRow}>
          <span style={styles.statLabel}>MP:</span>
          <span style={styles.statValue}>{Math.floor(player.mana)}/{player.maxMana}</span>
        </div>
        <div style={styles.barContainer}>
          <div style={styles.barBg}>
            <div
              style={{
                ...styles.barFill,
                ...styles.manaBar,
                width: `${manaPercent}%`,
              }}
            />
            <span style={styles.barText}>{Math.floor(manaPercent)}%</span>
          </div>
        </div>

        {/* XP */}
        <div style={styles.statRow}>
          <span style={styles.statLabel}>XP:</span>
          <span style={styles.statValue}>{player.xp}/{player.level * 1000}</span>
        </div>
        <div style={styles.barContainer}>
          <div style={styles.barBg}>
            <div
              style={{
                ...styles.barFill,
                ...styles.xpBar,
                width: `${xpPercent}%`,
              }}
            />
            <span style={styles.barText}>{Math.floor(xpPercent)}%</span>
          </div>
        </div>

        {/* Stats */}
        <div style={styles.statRow}>
          <span style={styles.statLabel}>ATK:</span>
          <span style={styles.statValue}>{player.stats.attack}</span>
        </div>
        <div style={styles.statRow}>
          <span style={styles.statLabel}>DEF:</span>
          <span style={styles.statValue}>{player.stats.defense}</span>
        </div>
        <div style={styles.statRow}>
          <span style={styles.statLabel}>SPD:</span>
          <span style={styles.statValue}>{player.stats.speed}</span>
        </div>
      </div>

      {/* Skills */}
      <div style={styles.skills}>
        {player.skills.slice(0, 4).map((skill) => (
          <div
            key={skill.id}
            style={styles.skill}
            onMouseEnter={(e) => {
              (e.target as HTMLDivElement).style.background = 'rgba(0, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLDivElement).style.background = 'rgba(0, 255, 255, 0.15)';
            }}
          >
            {getSkillIcon(skill.type)}
            <span>{skill.name}</span>
          </div>
        ))}
      </div>

      {/* Mini Map Placeholder */}
      <div style={styles.miniMap}>
        Mini Map
      </div>

      {/* Coordinates */}
      <div style={styles.coordinates}>
        X: {player.position.x.toFixed(1)} | Z: {player.position.z.toFixed(1)}
      </div>
    </div>
  );
}

// ============================================
// 🎭 ICON HELPERS
// ============================================
function getCharacterIcon(type: string): string {
  const icons: Record<string, string> = {
    rudeus: '🔮',
    warrior: '⚔️',
    mage: '🔮',
    rogue: '🗡️',
    archer: '🏹',
    healer: '💚',
  };
  return icons[type] || '❓';
}

function getSkillIcon(type: string): string {
  const icons: Record<string, string> = {
    attack: '⚔️',
    defense: '🛡️',
    heal: '💚',
    utility: '✨',
  };
  return icons[type] || '❓';
}
