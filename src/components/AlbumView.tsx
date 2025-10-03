import React from 'react';
import type { Entry } from '../types';

interface AlbumViewProps {
  albumName: string;
  entries: Entry[];
  onBack: () => void;
  onImageClick: (entry: Entry) => void;
}

const AlbumView: React.FC<AlbumViewProps> = ({ albumName, entries, onBack, onImageClick }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const dateRange = entries.length > 0
    ? `${formatDate(entries[0].createdAt)} - ${formatDate(entries[entries.length - 1].createdAt)}`
    : '';

  return (
    <div style={styles.container} className="slide-up">
      <div style={styles.header}>
        <button onClick={onBack} style={styles.backButton}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <div style={styles.headerInfo}>
          <h1 style={styles.albumTitle}>{albumName}</h1>
          <p style={styles.albumMeta}>{dateRange} • {entries.length} photos</p>
        </div>
        <button style={styles.moreButton}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="2"/>
            <circle cx="12" cy="12" r="2"/>
            <circle cx="12" cy="19" r="2"/>
          </svg>
        </button>
      </div>

      <div style={styles.filterTabs}>
        <button style={{...styles.filterTab, ...styles.activeFilter}}>All</button>
        {Array.from(new Set(entries.flatMap(e => e.tags.map(t => t.name)))).slice(0, 4).map(tag => (
          <button key={tag} style={styles.filterTab}>{tag}</button>
        ))}
      </div>

      <div style={styles.grid}>
        {entries.map((entry, index) => (
          <div
            key={entry.id}
            onClick={() => onImageClick(entry)}
            style={{
              ...styles.gridItem,
              ...(index % 7 === 0 ? styles.largeItem : {}),
              animationDelay: `${index * 0.05}s`,
            }}
            className="scale-in"
          >
            {entry.mediaUrl ? (
              <img src={entry.mediaUrl} alt={entry.title} style={styles.gridImage} />
            ) : (
              <div style={styles.placeholderImage}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 20px',
    gap: '12px',
    borderBottom: '1px solid #f1f5f9',
  },
  backButton: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'transparent',
    color: '#1e293b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
    textAlign: 'center',
  },
  albumTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '2px',
  },
  albumMeta: {
    fontSize: '13px',
    color: '#64748b',
  },
  moreButton: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'transparent',
    color: '#1e293b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterTabs: {
    display: 'flex',
    gap: '12px',
    padding: '16px 20px',
    overflowX: 'auto',
    borderBottom: '1px solid #f1f5f9',
  },
  filterTab: {
    padding: '8px 16px',
    borderRadius: '20px',
    backgroundColor: '#f8fafc',
    color: '#64748b',
    fontSize: '14px',
    fontWeight: '500',
    whiteSpace: 'nowrap',
  },
  activeFilter: {
    backgroundColor: '#1e293b',
    color: '#ffffff',
  },
  grid: {
    flex: 1,
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '4px',
    padding: '4px',
    overflowY: 'auto',
  },
  gridItem: {
    position: 'relative',
    aspectRatio: '1',
    borderRadius: '12px',
    overflow: 'hidden',
    cursor: 'pointer',
    backgroundColor: '#f8fafc',
    transition: 'all 0.2s ease',
  },
  largeItem: {
    gridColumn: 'span 2',
    gridRow: 'span 2',
  },
  gridImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#cbd5e1',
  },
};

export default AlbumView;
