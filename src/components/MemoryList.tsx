import React from 'react';
import type { Entry } from '../types';
import EditMemoryForm from './EditMemoryForm';

interface MemoryListProps {
  entries: Entry[];
  isLoading: boolean;
  error: string | null;
  onDelete: (entryId: number) => void;
  onEdit: (entry: Entry) => void;
  editingEntry: Entry | null;
  onUpdateSuccess: (updatedEntry: Entry) => void;
  onCancelEdit: () => void;
}

const MemoryList: React.FC<MemoryListProps> = ({ 
  entries, 
  isLoading, 
  error, 
  onDelete, 
  onEdit, 
  editingEntry, 
  onUpdateSuccess, 
  onCancelEdit 
}) => {

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  // If an entry is being edited, show the EditMemoryForm
  if (editingEntry) {
    return (
      <EditMemoryForm 
        entryToEdit={editingEntry}
        onUpdateSuccess={onUpdateSuccess}
        onCancel={onCancelEdit}
      />
    );
  }

  return (
    <div>
      <h2>Memories</h2>
      {entries.length === 0 ? (
        <p>No memories found.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {entries.map(entry => (
            <li key={entry.id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', marginBottom: '10px' }}>
              {entry.mediaUrl && <img src={entry.mediaUrl} alt={entry.title} style={{ maxWidth: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px', marginBottom: '10px' }} />}
              <h3>{entry.title}</h3>
              <p>{entry.content}</p>
              <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {entry.tags.map(tag => <span key={tag.id} style={{ backgroundColor: '#e0f7fa', color: '#00796b', padding: '2px 8px', borderRadius: '12px', fontSize: '12px' }}>{tag.name}</span>)}
              </div>
              <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                <button onClick={() => onEdit(entry)}>Edit</button>
                <button onClick={() => onDelete(entry.id)} style={{ backgroundColor: '#ffdddd', color: '#d9534f' }}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MemoryList;