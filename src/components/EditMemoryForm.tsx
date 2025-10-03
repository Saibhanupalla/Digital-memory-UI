import React, { useState, useEffect } from 'react';
import axios from 'axios';
import type { Entry } from '../types';

interface EditMemoryFormProps {
  entryToEdit: Entry;
  onUpdateSuccess: (updatedEntry: Entry) => void;
  onCancel: () => void;
}

const EditMemoryForm: React.FC<EditMemoryFormProps> = ({ entryToEdit, onUpdateSuccess, onCancel }) => {
  // State for form fields, initialized with the entry being edited
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // State for loading and errors
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // This hook populates the form when an entry is selected
  useEffect(() => {
    setTitle(entryToEdit.title);
    setContent(entryToEdit.content);
    setTags(entryToEdit.tags.map(tag => tag.name).join(', '));
    setImagePreview(entryToEdit.mediaUrl || null);
    setImageFile(null); // Reset file input
  }, [entryToEdit]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('jwt_token');
      if (!token) throw new Error('No auth token found');
      const headers = { 'Authorization': `Bearer ${token}` };
      const entryId = entryToEdit.id;

      // Step 1: Update title and content
      await axios.put(`http://localhost:8080/api/v1/entries/${entryId}`, { title, content }, { headers });

      // Step 2: Upload new image if selected
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('mediaType', 'IMAGE');
        await axios.post(`http://localhost:8080/api/v1/entries/${entryId}/media`, formData, {
          headers: { ...headers, 'Content-Type': 'multipart/form-data' }
        });
      }

      // Step 3: Synchronize tags
      const oldTags = new Set(entryToEdit.tags.map(t => t.name));
      const newTags = new Set(tags.split(/[\s,]+/).filter(Boolean));

      for (const oldTag of Array.from(oldTags)) {
        if (!newTags.has(oldTag)) {
          await axios.delete(`http://localhost:8080/api/v1/entries/${entryId}/tags/${oldTag}`, { headers });
        }
      }
      for (const newTag of Array.from(newTags)) {
        if (!oldTags.has(newTag)) {
          await axios.post(`http://localhost:8080/api/v1/entries/${entryId}/tags`, { name: newTag }, { headers });
        }
      }

      // Fetch the fully updated entry to pass back to the parent
      const updatedEntryResponse = await axios.get(`http://localhost:8080/api/v1/entries/${entryId}`, { headers });
      onUpdateSuccess(updatedEntryResponse.data);

    } catch (err) {
      setError('Failed to update memory. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', margin: '20px 0' }}>
      <h2>Edit Memory</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label>Photo</label>
          {imagePreview && <img src={imagePreview} alt="Memory preview" style={{ maxWidth: '100%', height: '200px', objectFit: 'contain', marginTop: '10px' }} />}
          <input type="file" accept="image/*" onChange={handleFileChange} style={{ marginTop: '5px' }} />
        </div>
        
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ padding: '10px' }} />
        <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} required rows={5} style={{ padding: '10px' }} />
        <input type="text" placeholder="Tags (e.g., family, work, vacation)" value={tags} onChange={(e) => setTags(e.target.value)} style={{ padding: '10px' }} />

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" disabled={isSubmitting} style={{ padding: '10px', flex: 1 }}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
          <button type="button" onClick={onCancel} style={{ padding: '10px' }}>Cancel</button>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default EditMemoryForm;