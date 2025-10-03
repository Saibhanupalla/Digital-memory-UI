import React from 'react';
import type { Entry } from '../types';

interface AlbumCardProps {
  album: {
    name: string;
    date: string;
    photoCount: number;
    coverImage: string | null;
    entries: Entry[];
  };
  onClick: () => void;
}

const AlbumCard: React.FC<AlbumCardProps> = ({ album, onClick }) => {
  return (
    <div onClick={onClick} style={styles.card} className="fade-in">
      <div style={styles.imageContainer}>
        {album.coverImage ? (
          <img src={album.coverImage} alt={album.name} style={styles.image} />
        ) : (
          <div style={styles.placeholderImage}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
        )}
        <div style={styles.overlay}>
          <h2 style={styles.albumName}>{album.name}</h2>
          <div style={styles.albumInfo}>
            <span style={styles.date}>{album.date}</span>
            <span style={styles.separator}>•</span>
            <span style={styles.photoCount}>{album.photoCount} photos</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  card: {
    marginBottom: '20px',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backgroundColor: '#ffffff',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '400px',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f1f5f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#cbd5e1',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
    padding: '40px 24px 24px',
    color: '#ffffff',
  },
  albumName: {
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '8px',
    textShadow: '0 2px 4px rgba(0,0,0,0.2)',
  },
  albumInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    opacity: 0.95,
  },
  date: {
    fontWeight: '500',
  },
  separator: {
    opacity: 0.6,
  },
  photoCount: {
    fontWeight: '400',
  },
};

export default AlbumCard;
