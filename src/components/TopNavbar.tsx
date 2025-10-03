import React from 'react';

interface TopNavbarProps {
  onSearchClick: () => void;
  onSettingsClick: () => void;
}

const TopNavbar: React.FC<TopNavbarProps> = ({ onSearchClick, onSettingsClick }) => {
  return (
    <nav style={styles.navbar}>
      <button onClick={onSearchClick} style={styles.iconButton}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
      </button>

      <div style={styles.avatarContainer}>
        <div style={styles.avatar}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
          </svg>
        </div>
      </div>

      <button onClick={onSettingsClick} style={styles.iconButton}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 1v6m0 6v6m-6-6h6m6 0h-6m-3.5-7.5 4.5 4.5m0 6 4.5 4.5m-13-4.5 4.5-4.5m0-6L8.5 4.5"/>
        </svg>
      </button>
    </nav>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  iconButton: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    color: '#1e293b',
    transition: 'all 0.2s ease',
  },
  avatarContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
  },
  avatar: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
  },
};

export default TopNavbar;
