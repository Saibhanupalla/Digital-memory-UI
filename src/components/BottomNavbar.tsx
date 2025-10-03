import React from 'react';

interface BottomNavbarProps {
  activeTab: 'albums' | 'starred' | 'dashboard';
  onTabChange: (tab: 'albums' | 'starred' | 'dashboard') => void;
  onAddClick: () => void;
}

const BottomNavbar: React.FC<BottomNavbarProps> = ({ activeTab, onTabChange, onAddClick }) => {
  return (
    <nav style={styles.navbar}>
      <button
        onClick={() => onTabChange('albums')}
        style={{...styles.navButton, ...(activeTab === 'albums' ? styles.activeButton : {})}}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill={activeTab === 'albums' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1"/>
          <rect x="14" y="3" width="7" height="7" rx="1"/>
          <rect x="3" y="14" width="7" height="7" rx="1"/>
          <rect x="14" y="14" width="7" height="7" rx="1"/>
        </svg>
        <span style={styles.navLabel}>Albums</span>
      </button>

      <button
        onClick={() => onTabChange('starred')}
        style={{...styles.navButton, ...(activeTab === 'starred' ? styles.activeButton : {})}}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill={activeTab === 'starred' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        <span style={styles.navLabel}>Starred</span>
      </button>

      <button onClick={onAddClick} style={styles.addButton}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </button>

      <button
        onClick={() => onTabChange('dashboard')}
        style={{...styles.navButton, ...(activeTab === 'dashboard' ? styles.activeButton : {})}}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill={activeTab === 'dashboard' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
        <span style={styles.navLabel}>Insights</span>
      </button>

      <div style={styles.placeholder}></div>
    </nav>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '12px 20px 20px',
    backgroundColor: '#ffffff',
    boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)',
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  navButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: 'transparent',
    color: '#94a3b8',
    padding: '8px 16px',
    transition: 'all 0.2s ease',
  },
  activeButton: {
    color: '#2563eb',
  },
  navLabel: {
    fontSize: '12px',
    fontWeight: '500',
  },
  addButton: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    backgroundColor: '#1e293b',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(30, 41, 59, 0.4)',
    marginTop: '-20px',
  },
  placeholder: {
    width: '80px',
  },
};

export default BottomNavbar;
