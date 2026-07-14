import { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import type { CharacterType, UserAccount, SaveSlot } from '../types';
import { CHARACTER_PRESETS, HAIR_COLORS, HAIR_STYLES, GAME_CONSTANTS } from '../utils/constants';

interface MainMenuProps {
  onStartGame?: (name: string, characterType: CharacterType, server: string) => void;
  onResume?: () => void;
}

// Store for user accounts (in a real app, this would be a backend service)
const userAccounts: UserAccount[] = [];
const saveSlots: SaveSlot[] = [];

export default function MainMenu({ onStartGame, onResume }: MainMenuProps) {
  const [currentScreen, setCurrentScreen] = useState<'main' | 'register' | 'login' | 'character' | 'load'>('main');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [selectedChar, setSelectedChar] = useState<CharacterType>(GAME_CONSTANTS.DEFAULT_CHARACTER as CharacterType);
  const [serverUrl, setServerUrl] = useState('http://localhost:3001');
  const [error, setError] = useState('');
  const [selectedSaveSlot, setSelectedSaveSlot] = useState<string | null>(null);
  const [showCharacterPreview, setShowCharacterPreview] = useState(false);
  const [hoveredChar, setHoveredChar] = useState<CharacterType | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const characterPreviewRef = useRef<THREE.Scene | null>(null);
  const previewCharacterRef = useRef<THREE.Group | null>(null);

  // Determine if we're in start mode or resume mode
  const isStartMode = !!onStartGame;
  const isResumeMode = !!onResume;

  // ============================================
  // 🎨 ANIME RPG STYLES
  // ============================================
  const styles = {
    // Main container
    container: {
      position: 'relative' as const,
      width: '100%',
      height: '100vh',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #0a0e27 0%, #1a1a3e 50%, #0a0e27 100%)',
    },
    
    // Background with anime particles
    background: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 0,
    },
    
    // Title styles
    titleContainer: {
      position: 'absolute' as const,
      top: '15%',
      left: '50%',
      transform: 'translateX(-50%)',
      textAlign: 'center' as const,
      zIndex: 2,
    },
    
    title: {
      fontSize: '6rem',
      fontWeight: 'bold' as const,
      color: '#fff',
      textShadow: '0 0 20px #00ffff, 0 0 40px #00ffff, 0 0 60px #00ffff',
      letterSpacing: '0.5rem',
      margin: 0,
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    },
    
    subtitle: {
      fontSize: '1.5rem',
      color: '#aaa',
      marginTop: '10px',
      fontStyle: 'italic' as const,
      letterSpacing: '0.3rem',
    },
    
    // Main content area
    contentArea: {
      position: 'absolute' as const,
      top: '40%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '90%',
      maxWidth: '1000px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      zIndex: 2,
    },
    
    // Left panel (Start Game)
    leftPanel: {
      flex: 1,
      maxWidth: '45%',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      gap: '20px',
    },
    
    // Right panel (Register/Login)
    rightPanel: {
      flex: 1,
      maxWidth: '45%',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      gap: '15px',
    },
    
    // Panel container
    panel: {
      background: 'rgba(0, 0, 0, 0.6)',
      border: '2px solid rgba(0, 255, 255, 0.3)',
      borderRadius: '15px',
      padding: '30px',
      width: '100%',
      boxShadow: '0 0 30px rgba(0, 255, 255, 0.2)',
    },
    
    // Panel title
    panelTitle: {
      fontSize: '1.8rem',
      color: '#00ffff',
      marginBottom: '20px',
      textAlign: 'center' as const,
      fontWeight: 'bold' as const,
      letterSpacing: '0.2rem',
    },
    
    // Form group
    formGroup: {
      marginBottom: '15px',
      width: '100%',
    },
    
    // Label
    label: {
      display: 'block',
      color: '#aaa',
      marginBottom: '8px',
      fontSize: '0.95rem',
      textAlign: 'left' as const,
    },
    
    // Input
    input: {
      width: '100%',
      padding: '12px 15px',
      background: 'rgba(0, 0, 0, 0.4)',
      border: '1px solid rgba(0, 255, 255, 0.5)',
      borderRadius: '8px',
      color: '#fff',
      fontSize: '1rem',
      outline: 'none',
      transition: 'border-color 0.3s, box-shadow 0.3s',
    },
    
    // Input focus
    inputFocus: {
      borderColor: '#00ffff',
      boxShadow: '0 0 15px rgba(0, 255, 255, 0.5)',
    },
    
    // Button styles
    button: {
      padding: '12px 30px',
      fontSize: '1.1rem',
      fontWeight: 'bold' as const,
      cursor: 'pointer',
      border: 'none',
      borderRadius: '8px',
      transition: 'all 0.3s',
      margin: '5px 0',
    },
    
    buttonPrimary: {
      background: 'linear-gradient(135deg, #00ffff, #0080ff)',
      color: '#000',
      boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)',
    },
    
    buttonSecondary: {
      background: 'rgba(255, 255, 255, 0.1)',
      color: '#00ffff',
      border: '1px solid rgba(0, 255, 255, 0.5)',
    },
    
    buttonDanger: {
      background: 'linear-gradient(135deg, #ff4444, #cc0000)',
      color: '#fff',
      boxShadow: '0 0 20px rgba(255, 0, 0, 0.5)',
    },
    
    // Button hover
    buttonHover: {
      transform: 'scale(1.05)',
      boxShadow: '0 0 30px rgba(0, 255, 255, 0.8)',
    },
    
    // Character selection grid
    characterGrid: {
      display: 'grid' as const,
      gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
      gap: '15px',
      margin: '20px 0',
    },
    
    // Character card
    characterCard: {
      background: 'rgba(0, 0, 0, 0.4)',
      border: '2px solid transparent',
      borderRadius: '12px',
      padding: '15px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      textAlign: 'center' as const,
      position: 'relative' as const,
    },
    
    characterCardSelected: {
      borderColor: '#00ffff',
      background: 'rgba(0, 255, 255, 0.1)',
      transform: 'scale(1.05)',
      boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)',
    },
    
    characterCardHover: {
      transform: 'scale(1.02)',
      borderColor: 'rgba(0, 255, 255, 0.5)',
    },
    
    // Character icon
    characterIcon: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      margin: '0 auto 10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '2.5rem',
      position: 'relative' as const,
    },
    
    // Character name
    characterName: {
      fontSize: '0.9rem',
      color: '#fff',
      fontWeight: 'bold' as const,
      marginBottom: '5px',
    },
    
    // Character description
    characterDescription: {
      fontSize: '0.75rem',
      color: '#aaa',
      lineHeight: '1.4',
    },
    
    // Save slot
    saveSlot: {
      background: 'rgba(0, 0, 0, 0.4)',
      border: '1px solid rgba(0, 255, 255, 0.3)',
      borderRadius: '10px',
      padding: '15px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    
    saveSlotSelected: {
      background: 'rgba(0, 255, 255, 0.1)',
      borderColor: '#00ffff',
    },
    
    saveSlotInfo: {
      flex: 1,
    },
    
    saveSlotName: {
      fontSize: '1rem',
      color: '#fff',
      fontWeight: 'bold' as const,
    },
    
    saveSlotDetails: {
      fontSize: '0.8rem',
      color: '#aaa',
    },
    
    // Error message
    error: {
      color: '#ff4444',
      margin: '10px 0',
      fontSize: '0.9rem',
      textAlign: 'center' as const,
    },
    
    // Back button
    backButton: {
      position: 'absolute' as const,
      bottom: '20px',
      left: '20px',
      padding: '10px 20px',
      background: 'rgba(255, 0, 0, 0.2)',
      border: '1px solid #ff4444',
      borderRadius: '8px',
      color: '#ff4444',
      cursor: 'pointer',
      fontSize: '0.9rem',
      transition: 'all 0.3s',
    },
    
    // Character preview canvas
    characterPreview: {
      position: 'absolute' as const,
      right: '20px',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '300px',
      height: '400px',
      background: 'rgba(0, 0, 0, 0.6)',
      border: '2px solid #00ffff',
      borderRadius: '15px',
      zIndex: 10,
    },
    
    // Loading
    loading: {
      color: '#00ffff',
      fontSize: '1.2rem',
      textAlign: 'center' as const,
      padding: '20px',
    },
  };

  // ============================================
  // 🎭 CHARACTER PREVIEW (3D Model)
  // ============================================
  useEffect(() => {
    if (!canvasRef.current || !showCharacterPreview) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    characterPreviewRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      60,
      canvasRef.current.width / canvasRef.current.height,
      0.1,
      1000
    );
    camera.position.set(0, 1.5, 3);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(canvasRef.current.width, canvasRef.current.height);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.4);
    rimLight.position.set(-5, 2, -5);
    scene.add(rimLight);

    // Create character
    const createPreviewCharacter = (charType: CharacterType) => {
      // Clear existing character
      if (previewCharacterRef.current) {
        scene.remove(previewCharacterRef.current);
      }

      const group = new THREE.Group();
      const preset = CHARACTER_PRESETS[charType];

      // Body
      const bodyGeometry = new THREE.CapsuleGeometry(0.3, 0.8, 4, 8);
      const bodyMaterial = new THREE.MeshPhongMaterial({
        color: preset.color,
        shininess: 30,
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.position.y = 0.4;
      body.castShadow = true;
      group.add(body);

      // Head
      const headGeometry = new THREE.SphereGeometry(0.25, 16, 16);
      const headMaterial = new THREE.MeshPhongMaterial({
        color: 0xffccaa,
        shininess: 30,
      });
      const head = new THREE.Mesh(headGeometry, headMaterial);
      head.position.y = 0.85;
      head.castShadow = true;
      group.add(head);

      // Hair (for Rudeus)
      if (charType === 'rudeus') {
        const hairGeometry = new THREE.SphereGeometry(0.28, 16, 16, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2);
        const hairMaterial = new THREE.MeshPhongMaterial({
          color: 0x4a90e2,
          shininess: 30,
        });
        const hair = new THREE.Mesh(hairGeometry, hairMaterial);
        hair.position.set(0, 0.95, -0.05);
        hair.rotation.x = -0.3;
        group.add(hair);
      }

      // Arms
      const armGeometry = new THREE.CapsuleGeometry(0.08, 0.4, 4, 8);
      const armMaterial = new THREE.MeshPhongMaterial({
        color: preset.color,
        shininess: 30,
      });
      const leftArm = new THREE.Mesh(armGeometry, armMaterial);
      leftArm.position.set(-0.35, 0.5, 0);
      leftArm.rotation.z = 0.3;
      group.add(leftArm);

      const rightArm = new THREE.Mesh(armGeometry, armMaterial);
      rightArm.position.set(0.35, 0.5, 0);
      rightArm.rotation.z = -0.3;
      group.add(rightArm);

      // Legs
      const legGeometry = new THREE.CapsuleGeometry(0.12, 0.5, 4, 8);
      const legMaterial = new THREE.MeshPhongMaterial({
        color: 0x000000,
        shininess: 30,
      });
      const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
      leftLeg.position.set(-0.15, 0, 0);
      group.add(leftLeg);

      const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
      rightLeg.position.set(0.15, 0, 0);
      group.add(rightLeg);

      // Robe for Rudeus
      if (charType === 'rudeus') {
        const robeGeometry = new THREE.ConeGeometry(0.5, 0.9, 16, 1, false, Math.PI * 0.8);
        robeGeometry.rotateX(Math.PI / 2);
        const robeMaterial = new THREE.MeshPhongMaterial({
          color: 0xffffff,
          shininess: 30,
        });
        const robe = new THREE.Mesh(robeGeometry, robeMaterial);
        robe.position.set(0, 0.45, -0.1);
        group.add(robe);
      }

      // Staff for Rudeus
      if (charType === 'rudeus') {
        const staffGroup = new THREE.Group();
        const staffPoleGeometry = new THREE.CylinderGeometry(0.03, 0.03, 1.3, 8);
        const staffPoleMaterial = new THREE.MeshPhongMaterial({
          color: 0x8b4513,
          shininess: 30,
        });
        const staffPole = new THREE.Mesh(staffPoleGeometry, staffPoleMaterial);
        staffPole.position.y = 0.65;
        staffGroup.add(staffPole);

        const staffOrbGeometry = new THREE.SphereGeometry(0.12, 16, 16);
        const staffOrbMaterial = new THREE.MeshPhongMaterial({
          color: 0x00bfff,
          shininess: 30,
          emissive: 0x00bfff,
          emissiveIntensity: 0.3,
        });
        const staffOrb = new THREE.Mesh(staffOrbGeometry, staffOrbMaterial);
        staffOrb.position.y = 1.55;
        staffGroup.add(staffOrb);

        staffGroup.position.set(0.45, 0, 0.1);
        staffGroup.rotation.z = -0.4;
        group.add(staffGroup);
      }

      // Rotate character for better view
      group.rotation.y = Math.PI / 4;

      scene.add(group);
      previewCharacterRef.current = group;

      // Animate character
      let rotationDirection = 1;
      const animate = () => {
        requestAnimationFrame(animate);
        if (group) {
          group.rotation.y += 0.005 * rotationDirection;
          if (group.rotation.y > Math.PI / 4 + 0.5 || group.rotation.y < Math.PI / 4 - 0.5) {
            rotationDirection *= -1;
          }
        }
        renderer.render(scene, camera);
      };
      animate();

      // Handle resize
      const handleResize = () => {
        if (canvasRef.current) {
          camera.aspect = canvasRef.current.width / canvasRef.current.height;
          camera.updateProjectionMatrix();
          renderer.setSize(canvasRef.current.width, canvasRef.current.height);
        }
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        scene.remove(group);
      };
    };

    createPreviewCharacter(selectedChar);

    return () => {
      if (previewCharacterRef.current) {
        scene.remove(previewCharacterRef.current);
      }
    };
  }, [showCharacterPreview, selectedChar]);

  // ============================================
  // 🎯 HANDLERS
  // ============================================
  const handleStartGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (name.length > 20) {
      setError('Name must be 20 characters or less');
      return;
    }
    setError('');
    onStartGame?.(name, selectedChar, serverUrl);
  };

  const handleResume = () => {
    setError('');
    onResume?.();
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a username');
      return;
    }
    if (!password.trim()) {
      setError('Please enter a password');
      return;
    }
    
    // Check if user already exists
    if (userAccounts.some(u => u.username === name)) {
      setError('Username already exists');
      return;
    }
    
    // Create new account
    const newAccount: UserAccount = {
      id: Date.now().toString(),
      username: name,
      password: password, // In a real app, this would be hashed
      character: selectedChar,
      hairColor: CHARACTER_PRESETS[selectedChar].hairColor,
      hairStyle: 'short',
      eyeColor: 0x4a90e2,
      createdAt: Date.now(),
      lastLogin: Date.now(),
      playtime: 0,
      achievements: [],
    };
    
    userAccounts.push(newAccount);
    setError('');
    setCurrentScreen('character');
    
    // Auto-login
    localStorage.setItem('manaStormUser', JSON.stringify({
      username: name,
      character: selectedChar,
    }));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const account = userAccounts.find(u => u.username === name && u.password === password);
    if (!account) {
      setError('Invalid username or password');
      return;
    }
    
    setError('');
    localStorage.setItem('manaStormUser', JSON.stringify({
      username: account.username,
      character: account.character,
    }));
    
    // Load saved game or start new
    setCurrentScreen('main');
  };

  const handleNewGame = () => {
    // Start a new game with the selected character
    localStorage.removeItem('manaStormSave');
    onStartGame?.(name || 'Player', selectedChar, serverUrl);
  };

  const handleLoadGame = () => {
    if (!selectedSaveSlot) {
      setError('Please select a save slot');
      return;
    }
    // In a real app, load the save data
    onStartGame?.(name || 'Player', selectedChar, serverUrl);
  };

  // ============================================
  // 📱 RENDER MAIN MENU
  // ============================================
  if (currentScreen === 'register') {
    return (
      <div style={styles.container}>
        <div style={styles.background} />
        
        <div style={styles.titleContainer}>
          <h1 style={styles.title}>Mana Storm</h1>
          <p style={styles.subtitle}>Create Your Account</p>
        </div>

        <div style={{ ...styles.contentArea, top: '35%' }}>
          <div style={styles.leftPanel}>
            <div style={styles.panel}>
              <h2 style={styles.panelTitle}>Register</h2>
              
              {error && <p style={styles.error}>{error}</p>}
              
              <form onSubmit={handleRegister}>
                <div style={styles.formGroup}>
                  <label htmlFor="register-name" style={styles.label}>Username</label>
                  <input
                    id="register-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your username"
                    maxLength={20}
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="register-password" style={styles.label}>Password</label>
                  <input
                    id="register-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Character Class</label>
                  <div style={styles.characterGrid}>
                    {Object.entries(CHARACTER_PRESETS).map(([key, preset]) => (
                      <div
                        key={key}
                        style={{
                          ...styles.characterCard,
                          ...(selectedChar === key ? styles.characterCardSelected : {}),
                          ...(hoveredChar === key ? styles.characterCardHover : {}),
                        }}
                        onClick={() => setSelectedChar(key as CharacterType)}
                        onMouseEnter={() => setHoveredChar(key as CharacterType)}
                        onMouseLeave={() => setHoveredChar(null)}
                      >
                        <div
                          style={{
                            ...styles.characterIcon,
                            backgroundColor: `rgba(${(preset.color >> 16) & 0xff}, ${(preset.color >> 8) & 0xff}, ${preset.color & 0xff}, 0.8)`,
                          }}
                        >
                          {getCharacterIcon(key as CharacterType)}
                        </div>
                        <div style={styles.characterName}>{preset.name}</div>
                        <div style={styles.characterDescription}>{preset.description}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  style={{ ...styles.button, ...styles.buttonPrimary }}
                >
                  Create Account
                </button>
              </form>

              <p style={{ color: '#aaa', fontSize: '0.9rem', textAlign: 'center', marginTop: '15px' }}>
                Already have an account?
              </p>
              <button
                onClick={() => setCurrentScreen('login')}
                style={{ ...styles.button, ...styles.buttonSecondary }}
              >
                Login
              </button>
            </div>
          </div>
        </div>

        <button onClick={() => setCurrentScreen('main')} style={styles.backButton}>
          ← Back
        </button>
      </div>
    );
  }

  if (currentScreen === 'login') {
    return (
      <div style={styles.container}>
        <div style={styles.background} />
        
        <div style={styles.titleContainer}>
          <h1 style={styles.title}>Mana Storm</h1>
          <p style={styles.subtitle}>Welcome Back</p>
        </div>

        <div style={{ ...styles.contentArea, top: '35%' }}>
          <div style={styles.leftPanel}>
            <div style={styles.panel}>
              <h2 style={styles.panelTitle}>Login</h2>
              
              {error && <p style={styles.error}>{error}</p>}
              
              <form onSubmit={handleLogin}>
                <div style={styles.formGroup}>
                  <label htmlFor="login-name" style={styles.label}>Username</label>
                  <input
                    id="login-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your username"
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="login-password" style={styles.label}>Password</label>
                  <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    style={styles.input}
                  />
                </div>

                <button
                  type="submit"
                  style={{ ...styles.button, ...styles.buttonPrimary }}
                >
                  Login
                </button>
              </form>

              <p style={{ color: '#aaa', fontSize: '0.9rem', textAlign: 'center', marginTop: '15px' }}>
                Don't have an account?
              </p>
              <button
                onClick={() => setCurrentScreen('register')}
                style={{ ...styles.button, ...styles.buttonSecondary }}
              >
                Register
              </button>
            </div>
          </div>
        </div>

        <button onClick={() => setCurrentScreen('main')} style={styles.backButton}>
          ← Back
        </button>
      </div>
    );
  }

  if (currentScreen === 'character') {
    return (
      <div style={styles.container}>
        <div style={styles.background} />
        
        <div style={styles.titleContainer}>
          <h1 style={styles.title}>Mana Storm</h1>
          <p style={styles.subtitle}>Select Your Character</p>
        </div>

        <div style={{ ...styles.contentArea, top: '30%' }}>
          <div style={styles.leftPanel}>
            <div style={styles.panel}>
              <h2 style={styles.panelTitle}>Character Selection</h2>
              
              {error && <p style={styles.error}>{error}</p>}
              
              <form onSubmit={(e) => { e.preventDefault(); handleNewGame(); }}>
                <div style={styles.formGroup}>
                  <label htmlFor="char-name" style={styles.label}>Character Name</label>
                  <input
                    id="char-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your character name"
                    maxLength={20}
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Character Class</label>
                  <div style={styles.characterGrid}>
                    {Object.entries(CHARACTER_PRESETS).map(([key, preset]) => (
                      <div
                        key={key}
                        style={{
                          ...styles.characterCard,
                          ...(selectedChar === key ? styles.characterCardSelected : {}),
                          ...(hoveredChar === key ? styles.characterCardHover : {}),
                        }}
                        onClick={() => {
                          setSelectedChar(key as CharacterType);
                          setShowCharacterPreview(true);
                        }}
                        onMouseEnter={() => setHoveredChar(key as CharacterType)}
                        onMouseLeave={() => setHoveredChar(null)}
                      >
                        <div
                          style={{
                            ...styles.characterIcon,
                            backgroundColor: `rgba(${(preset.color >> 16) & 0xff}, ${(preset.color >> 8) & 0xff}, ${preset.color & 0xff}, 0.8)`,
                          }}
                        >
                          {getCharacterIcon(key as CharacterType)}
                        </div>
                        <div style={styles.characterName}>{preset.name}</div>
                        <div style={styles.characterDescription}>{preset.description}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="server-url" style={styles.label}>Server URL</label>
                  <input
                    id="server-url"
                    type="text"
                    value={serverUrl}
                    onChange={(e) => setServerUrl(e.target.value)}
                    placeholder="http://localhost:3001"
                    style={styles.input}
                  />
                </div>

                <button
                  type="submit"
                  style={{ ...styles.button, ...styles.buttonPrimary }}
                >
                  Start New Game
                </button>
              </form>

              <button
                onClick={() => setCurrentScreen('load')}
                style={{ ...styles.button, ...styles.buttonSecondary, marginTop: '10px' }}
              >
                Load Game
              </button>
            </div>
          </div>

          {/* Character Preview */}
          {showCharacterPreview && (
            <canvas
              ref={canvasRef}
              style={styles.characterPreview}
            />
          )}
        </div>

        <button onClick={() => setCurrentScreen('main')} style={styles.backButton}>
          ← Back
        </button>
      </div>
    );
  }

  if (currentScreen === 'load') {
    return (
      <div style={styles.container}>
        <div style={styles.background} />
        
        <div style={styles.titleContainer}>
          <h1 style={styles.title}>Mana Storm</h1>
          <p style={styles.subtitle}>Load Game</p>
        </div>

        <div style={{ ...styles.contentArea, top: '35%' }}>
          <div style={styles.leftPanel}>
            <div style={styles.panel}>
              <h2 style={styles.panelTitle}>Save Slots</h2>
              
              {error && <p style={styles.error}>{error}</p>}
              
              {saveSlots.length === 0 ? (
                <p style={{ color: '#aaa', textAlign: 'center' }}>
                  No save slots found
                </p>
              ) : (
                saveSlots.map((slot, index) => (
                  <div
                    key={slot.id}
                    style={{
                      ...styles.saveSlot,
                      ...(selectedSaveSlot === slot.id ? styles.saveSlotSelected : {}),
                    }}
                    onClick={() => setSelectedSaveSlot(slot.id)}
                  >
                    <div style={styles.saveSlotInfo}>
                      <div style={styles.saveSlotName}>{slot.name}</div>
                      <div style={styles.saveSlotDetails}>
                        Level {slot.level} • {slot.characterType}
                      </div>
                    </div>
                    <span style={{ color: '#aaa', fontSize: '0.8rem' }}>
                      {new Date(slot.lastPlayed).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}

              <button
                onClick={handleLoadGame}
                style={{ ...styles.button, ...styles.buttonPrimary, marginTop: '20px' }}
                disabled={!selectedSaveSlot}
              >
                Load Game
              </button>
            </div>
          </div>
        </div>

        <button onClick={() => setCurrentScreen('character')} style={styles.backButton}>
          ← Back
        </button>
      </div>
    );
  }

  // ============================================
  // 🏠 MAIN MENU
  // ============================================
  return (
    <div style={styles.container}>
      {/* Background */}
      <div style={styles.background} />

      {/* Title */}
      <div style={styles.titleContainer}>
        <h1 style={styles.title}>Mana Storm</h1>
        <p style={styles.subtitle}>A Journey Through Magic and Adventure</p>
      </div>

      {/* Content Area */}
      <div style={styles.contentArea}>
        {/* Left Panel - Start Game */}
        <div style={styles.leftPanel}>
          <div style={styles.panel}>
            <button
              onClick={isStartMode ? () => setCurrentScreen('character') : handleResume}
              style={{ ...styles.button, ...styles.buttonPrimary }}
            >
              {isStartMode ? 'Start Game' : 'Resume Game'}
            </button>
          </div>
        </div>

        {/* Right Panel - Account Options */}
        <div style={styles.rightPanel}>
          <div style={styles.panel}>
            <h2 style={styles.panelTitle}>Account</h2>
            
            <button
              onClick={() => setCurrentScreen('register')}
              style={{ ...styles.button, ...styles.buttonSecondary }}
            >
              Register
            </button>
            
            <button
              onClick={() => setCurrentScreen('login')}
              style={{ ...styles.button, ...styles.buttonSecondary }}
            >
              Login
            </button>

            <p style={{ color: '#aaa', fontSize: '0.85rem', textAlign: 'center', marginTop: '15px' }}>
              Or continue as guest
            </p>
            
            {isStartMode && (
              <button
                onClick={() => onStartGame?.('Guest', 'rudeus', serverUrl)}
                style={{ ...styles.button, ...styles.buttonSecondary }}
              >
                Play as Guest
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Settings button */}
      <button
        style={{
          position: 'absolute' as const,
          bottom: '20px',
          right: '20px',
          padding: '10px 20px',
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(0, 255, 255, 0.3)',
          borderRadius: '8px',
          color: '#00ffff',
          cursor: 'pointer',
          fontSize: '0.9rem',
        }}
      >
        Settings
      </button>
    </div>
  );
}

// ============================================
// 🎭 CHARACTER ICONS
// ============================================
function getCharacterIcon(type: CharacterType): string {
  const icons: Record<CharacterType, string> = {
    rudeus: '🔮', // Magic staff for Rudeus
    warrior: '⚔️',
    mage: '🔮',
    rogue: '🗡️',
    archer: '🏹',
    healer: '💚',
  };
  return icons[type] || '❓';
}
