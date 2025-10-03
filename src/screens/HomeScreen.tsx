import React, { useState, useEffect } from 'react';
import axios from 'axios';

import MemoryList from '../components/MemoryList';
import AddMemoryForm from '../components/AddMemoryForm';
import DashboardScreen from './DashboardScreen';
import type { Entry } from '../types';

interface HomeScreenProps {
  onLogout: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onLogout }) => {
  // --- State Management ---
  // Data state
  const [allEntries, setAllEntries] = useState<Entry[]>([]);
  const [searchResults, setSearchResults] = useState<Entry[] | null>(null);
  
  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDashboard, setShowDashboard] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);

  // --- Data Fetching ---
  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    setIsLoading(true);
    setError(null);
    setSearchResults(null); // Clear search results on a full refresh
    setSearchQuery('');
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

  // --- Event Handlers (Search, CRUD) ---
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
        const token = localStorage.getItem('jwt_token');
        const userId = 1; // IMPORTANT: Replace with actual user ID from your auth context/token
        const response = await axios.get('http://localhost:8080/api/v1/search', {
            headers: { 'Authorization': `Bearer ${token}` },
            params: { userId, query: searchQuery }
        });
        setSearchResults(response.data || []);
    } catch (err: any) {
        setError(err.message || 'Search failed.');
    } finally {
        setIsLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchResults(null);
    setSearchQuery('');
  };
  
  const handleDelete = (entryId: number) => {
    setAllEntries(prev => prev.filter(entry => entry.id !== entryId));
    if (searchResults) {
      setSearchResults(prev => prev!.filter(entry => entry.id !== entryId));
    }
  };

  const handleUpdateSuccess = (updatedEntry: Entry) => {
    setAllEntries(prev => prev.map(entry => entry.id === updatedEntry.id ? updatedEntry : entry));
    if (searchResults) {
      setSearchResults(prev => prev!.map(entry => entry.id === updatedEntry.id ? updatedEntry : entry));
    }
    setEditingEntry(null);
  };
  
  const handleMemoryCreated = () => {
    setIsCreating(false);
    fetchEntries(); // Re-fetch all entries to get the latest list
  };

  // --- Render Logic ---
  const entriesToShow = searchResults !== null ? searchResults : allEntries;

  if (showDashboard) {
    return (
      <div style={{ padding: '20px' }}>
        <button onClick={() => setShowDashboard(false)} style={{ marginBottom: '20px' }}>&larr; Back to Memories</button>
        <DashboardScreen />
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Welcome to Your Memory Vault!</h1>
        <div>
          <button onClick={() => setShowDashboard(true)} style={{ marginRight: '10px' }}>View Dashboard</button>
          <button onClick={onLogout}>Logout</button>
        </div>
      </div>
      <hr />

      <form onSubmit={handleSearch} style={{ margin: '20px 0', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="Search your memories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: '10px', flex: 1, borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button type="submit">Search</button>
        {searchResults !== null && <button type="button" onClick={clearSearch}>Clear</button>}
      </form>

      {!isCreating && (
        <button onClick={() => setIsCreating(true)} style={{ padding: '10px 20px', marginBottom: '20px' }}>
          + Create New Memory
        </button>
      )}

      {isCreating && (
        <AddMemoryForm 
          onMemoryCreated={handleMemoryCreated}
          onCancel={() => setIsCreating(false)}
        />
      )}

      <MemoryList
        entries={entriesToShow}
        isLoading={isLoading}
        error={error}
        onDelete={handleDelete}
        onEdit={setEditingEntry}
        editingEntry={editingEntry}
        onUpdateSuccess={handleUpdateSuccess}
        onCancelEdit={() => setEditingEntry(null)}
      />
    </div>
  );
};

export default HomeScreen;