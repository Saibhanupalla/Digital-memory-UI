import React from 'react';
import type { Entry } from '../types';

interface ImageDetailViewProps {
  entry: Entry;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const ImageDetailView: React.FC<ImageDetailViewProps> = ({ entry, onBack, onEdit, onDelete }) => {
  return (
    <div style={styles.container} className="fade-in">
      <div style={styles.header}>
        <button onClick={onBack} style={styles.backButton}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <div style={styles.spacer}></div>
        <button style={styles.iconButton}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>

      <div style={styles.imageContainer}>
        {entry.mediaUrl ? (
          <img src={entry.mediaUrl} alt={entry.title} style={styles.image} />
        ) : (
          <div style={styles.placeholderImage}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
        )}
      </div>

      <div style={styles.content}>
        <h1 style={styles.title}>{entry.title}</h1>

        {entry.content && (
          <p style={styles.description}>{entry.content}</p>
        )}

        {entry.tags.length > 0 && (
          <div style={styles.tagsContainer}>
            {entry.tags.map(tag => (
              <span key={tag.id} style={styles.tag}>
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        {entry.aiDetectedMood && (
          <div style={styles.moodBadge}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
              <line x1="9" y1="9" x2="9.01" y2="9"/>
              <line x1="15" y1="9" x2="15.01" y2="9"/>
            </svg>
            <span>{entry.aiDetectedMood}</span>
          </div>
        )}

        <div style={styles.metadata}>
          <span style={styles.date}>
            {new Date(entry.createdAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
        </div>
      </div>

      <div style={styles.actions}>
        <button onClick={onEdit} style={styles.editButton}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          Edit Memory
        </button>
        <button onClick={onDelete} style={styles.deleteButton}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
          Delete Memory
        </button>
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
    justifyContent: 'space-between',
    padding: '16px 20px',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 100%)',
  },
  backButton: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    color: '#1e293b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  spacer: {
    flex: 1,
  },
  iconButton: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    color: '#ef4444',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  imageContainer: {
    width: '100%',
    height: '50vh',
    backgroundColor: '#f8fafc',
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#cbd5e1',
  },
  content: {
    flex: 1,
    padding: '24px 20px',
    overflowY: 'auto',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '12px',
    lineHeight: '1.3',
  },
  description: {
    fontSize: '16px',
    color: '#475569',
    lineHeight: '1.6',
    marginBottom: '16px',
  },
  tagsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '16px',
  },
  tag: {
    padding: '6px 12px',
    borderRadius: '16px',
    backgroundColor: '#f1f5f9',
    color: '#2563eb',
    fontSize: '14px',
    fontWeight: '500',
  },
  moodBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    borderRadius: '20px',
    backgroundColor: '#fef3c7',
    color: '#92400e',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '16px',
  },
  metadata: {
    paddingTop: '12px',
    borderTop: '1px solid #f1f5f9',
  },
  date: {
    fontSize: '14px',
    color: '#94a3b8',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    padding: '16px 20px 24px',
    borderTop: '1px solid #f1f5f9',
  },
  editButton: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '14px 24px',
    borderRadius: '12px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '600',
    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
  },
  deleteButton: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '14px 24px',
    borderRadius: '12px',
    backgroundColor: '#fef2f2',
    color: '#ef4444',
    fontSize: '16px',
    fontWeight: '600',
  },
};

export default ImageDetailView;
