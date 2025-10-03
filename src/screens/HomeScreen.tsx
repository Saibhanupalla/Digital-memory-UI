import React, { useState, useEffect } from 'react';
import axios from 'axios';

import TopNavbar from '../components/TopNavbar';
import BottomNavbar from '../components/BottomNavbar';
import AlbumCard from '../components/AlbumCard';
import AlbumView from '../components/AlbumView';
import ImageDetailView from '../components/ImageDetailView';
import AddMemoryForm from '../components/AddMemoryForm';
import EditMemoryForm from '../components/EditMemoryForm';
import DashboardScreen from './DashboardScreen';
import type { Entry } from '../types';

interface HomeScreenProps {
  onLogout: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onLogout }) => {
  const [allEntries, setAllEntries] = useState<Entry[]>([]);
  const [starredEntries, setStarredEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'albums' | 'starred' | 'dashboard'>('albums');
  const [currentView, setCurrentView] = useState<'feed' | 'album' | 'detail' | 'add' | 'edit'>('feed');
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('jwt_token');
      if (!token) throw new Error('Authentication token not found.');

      const response = await axios.get('http://localhost:8080/api/v1/entries', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = Array.isArray(response.data) ? response.data : response.data.content;
      setAllEntries(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch memories.');
    } finally {
      setIsLoading(false);
    }
  };

  const groupEntriesByMonth = (entries: Entry[]) => {
    const grouped = entries.reduce((acc, entry) => {
      const date = new Date(entry.createdAt);
      const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      acc[monthYear].push(entry);
      return acc;
    }, {} as Record<string, Entry[]>);

    return Object.entries(grouped).map(([name, entries]) => ({
      name,
      date: new Date(entries[0].createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      photoCount: entries.length,
      coverImage: entries[0]?.mediaUrl || null,
      entries
    }));
  };

  const handleDelete = async (entryId: number) => {
    try {
      const token = localStorage.getItem('jwt_token');
      await axios.delete(`http://localhost:8080/api/v1/entries/${entryId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setAllEntries(prev => prev.filter(entry => entry.id !== entryId));
      setStarredEntries(prev => prev.filter(entry => entry.id !== entryId));
      setCurrentView('feed');
      setSelectedEntry(null);
    } catch (err) {
      alert('Failed to delete memory');
    }
  };

  const handleUpdateSuccess = (updatedEntry: Entry) => {
    setAllEntries(prev => prev.map(entry => entry.id === updatedEntry.id ? updatedEntry : entry));
    setStarredEntries(prev => prev.map(entry => entry.id === updatedEntry.id ? updatedEntry : entry));
    setSelectedEntry(null);
    setCurrentView('feed');
  };

  const handleMemoryCreated = () => {
    setCurrentView('feed');
    fetchEntries();
  };

  const renderContent = () => {
    if (activeTab === 'dashboard') {
      return <DashboardScreen />;
    }

    if (currentView === 'add') {
      return (
        <div style={styles.fullScreen}>
          <div style={styles.header}>
            <button onClick={() => setCurrentView('feed')} style={styles.backButton}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <h2 style={styles.headerTitle}>Create Memory</h2>
            <div style={styles.spacer}></div>
          </div>
          <div style={styles.scrollContent}>
            <AddMemoryForm
              onMemoryCreated={handleMemoryCreated}
              onCancel={() => setCurrentView('feed')}
            />
          </div>
        </div>
      );
    }

    if (currentView === 'edit' && selectedEntry) {
      return (
        <div style={styles.fullScreen}>
          <div style={styles.header}>
            <button onClick={() => setCurrentView('detail')} style={styles.backButton}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <h2 style={styles.headerTitle}>Edit Memory</h2>
            <div style={styles.spacer}></div>
          </div>
          <div style={styles.scrollContent}>
            <EditMemoryForm
              entryToEdit={selectedEntry}
              onUpdateSuccess={handleUpdateSuccess}
              onCancel={() => setCurrentView('detail')}
            />
          </div>
        </div>
      );
    }

    if (currentView === 'detail' && selectedEntry) {
      return (
        <ImageDetailView
          entry={selectedEntry}
          onBack={() => {
            setCurrentView(selectedAlbum ? 'album' : 'feed');
            setSelectedEntry(null);
          }}
          onEdit={() => setCurrentView('edit')}
          onDelete={() => handleDelete(selectedEntry.id)}
        />
      );
    }

    if (currentView === 'album' && selectedAlbum) {
      const albums = groupEntriesByMonth(activeTab === 'starred' ? starredEntries : allEntries);
      const album = albums.find(a => a.name === selectedAlbum);

      if (!album) {
        setCurrentView('feed');
        return null;
      }

      return (
        <AlbumView
          albumName={album.name}
          entries={album.entries}
          onBack={() => {
            setCurrentView('feed');
            setSelectedAlbum(null);
          }}
          onImageClick={(entry) => {
            setSelectedEntry(entry);
            setCurrentView('detail');
          }}
        />
      );
    }

    const albums = groupEntriesByMonth(activeTab === 'starred' ? starredEntries : allEntries);

    return (
      <>
        <TopNavbar
          onSearchClick={() => setShowSearch(!showSearch)}
          onSettingsClick={onLogout}
        />

        {showSearch && (
          <div style={styles.searchBar} className="slide-up">
            <input
              type="text"
              placeholder="Search your memories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
              autoFocus
            />
          </div>
        )}

        <div style={styles.feedContainer}>
          {isLoading ? (
            <div style={styles.loadingContainer}>
              <p style={styles.loadingText}>Loading memories...</p>
            </div>
          ) : error ? (
            <div style={styles.errorContainer}>
              <p style={styles.errorText}>{error}</p>
            </div>
          ) : albums.length === 0 ? (
            <div style={styles.emptyContainer}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <p style={styles.emptyText}>No memories yet</p>
              <p style={styles.emptySubtext}>Tap the + button to add your first memory</p>
            </div>
          ) : (
            <div style={styles.albumList}>
              {albums.map((album) => (
                <AlbumCard
                  key={album.name}
                  album={album}
                  onClick={() => {
                    setSelectedAlbum(album.name);
                    setCurrentView('album');
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="app-container">
      {renderContent()}

      {currentView !== 'add' && currentView !== 'edit' && activeTab !== 'dashboard' && (
        <BottomNavbar
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setCurrentView('feed');
            setSelectedAlbum(null);
            setSelectedEntry(null);
          }}
          onAddClick={() => setCurrentView('add')}
        />
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  fullScreen: {
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
    borderBottom: '1px solid #f1f5f9',
    backgroundColor: '#ffffff',
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
  headerTitle: {
    flex: 1,
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'center',
  },
  spacer: {
    width: '40px',
  },
  scrollContent: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
  },
  searchBar: {
    padding: '12px 20px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #f1f5f9',
  },
  searchInput: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    fontSize: '16px',
    backgroundColor: '#f8fafc',
  },
  feedContainer: {
    flex: 1,
    overflowY: 'auto',
    backgroundColor: '#f8fafc',
    paddingBottom: '100px',
  },
  albumList: {
    padding: '20px',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  loadingText: {
    fontSize: '16px',
    color: '#94a3b8',
  },
  errorContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    padding: '20px',
  },
  errorText: {
    fontSize: '16px',
    color: '#ef4444',
    textAlign: 'center',
  },
  emptyContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: '40px',
    color: '#cbd5e1',
  },
  emptyText: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#64748b',
    marginTop: '16px',
  },
  emptySubtext: {
    fontSize: '14px',
    color: '#94a3b8',
    marginTop: '8px',
    textAlign: 'center',
  },
};

export default HomeScreen;
