import type { Player } from '../../types';

interface GameHUDProps {
  player: Player | undefined;
  onMenuClick: () => void;
}

export default function GameHUD({ player, onMenuClick }: GameHUDProps) {
  if (!player) return null;

  const healthPercent = (player.health / player.maxHealth) * 100;
  const manaPercent = (player.mana / player.maxMana) * 100;

  const styles = {
    hud: { position: 'absolute' as const, top: '20px', left: '20px', color: '#fff', background: 'rgba(0, 0, 0, 0.7)', padding: '15px', borderRadius: '10px', fontFamily: 'Courier New, monospace', zIndex: 100 },
    playerInfo: { marginBottom: '15px' },
    name: { fontSize: '1.2rem', fontWeight: 'bold' as const, color: '#00ffff', margin: '0 0 5px 0' },
    level: { fontSize: '0.9rem', color: '#ffaa00' },
    stats: { marginTop: '10px' },
    statRow: { display: 'flex' as const, justifyContent: 'space-between', margin: '3px 0', fontSize: '0.85rem' },
    barContainer: { width: '200px', marginTop: '10px' },
    bar: { height: '20px', background: '#333', borderRadius: '10px', overflow: 'hidden' as const, marginBottom: '5px', border: '1px solid #555' },
    barFill: { height: '100%', borderRadius: '10px', transition: 'width 0.3s ease' },
    healthBar: { background: 'linear-gradient(90deg, #ff0000, #ff8888)' },
    manaBar: { background: 'linear-gradient(90deg, #0088ff, #88ccff)' },
    skills: { display: 'flex' as const, gap: '10px', marginTop: '15px', flexWrap: 'wrap' as const },
    skill: { padding: '5px 10px', background: 'rgba(0, 255, 255, 0.2)', border: '1px solid #00ffff', borderRadius: '5px', fontSize: '0.75rem', cursor: 'pointer' },
    menuButton: { position: 'absolute' as const, top: '10px', right: '10px', padding: '5px 10px', background: 'rgba(255, 0, 0, 0.3)', border: '1px solid #ff4444', borderRadius: '5px', color: '#ff4444', cursor: 'pointer', fontSize: '0.8rem' },
  };

  return (
    <div style={styles.hud}>
      <button style={styles.menuButton} onClick={onMenuClick}>Menu</button>
      <div style={styles.playerInfo}>
        <div style={styles.name}>{player.name}</div>
        <div style={styles.level}>Level {player.level}</div>
      </div>
      <div style={styles.stats}>
        <div style={styles.statRow}><span>HP:</span><span>{Math.floor(player.health)}/{player.maxHealth}</span></div>
        <div style={styles.barContainer}>
          <div style={styles.bar}><div style={{ ...styles.barFill, ...styles.healthBar, width: `${healthPercent}%` }} /></div>
        </div>
        <div style={styles.statRow}><span>MP:</span><span>{Math.floor(player.mana)}/{player.maxMana}</span></div>
        <div style={styles.barContainer}>
          <div style={styles.bar}><div style={{ ...styles.barFill, ...styles.manaBar, width: `${manaPercent}%` }} /></div>
        </div>
      </div>
      <div style={styles.skills}>
        {player.skills.map((skill) => <div key={skill.id} style={styles.skill}>{skill.name}</div>)}
      </div>
    </div>
  );
}