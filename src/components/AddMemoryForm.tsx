import React, { useState } from 'react';
import axios from 'axios';

interface AddMemoryFormProps {
  onMemoryCreated: (newMemory: any) => void;
  onCancel: () => void;
}

const AddMemoryForm: React.FC<AddMemoryFormProps> = ({ onMemoryCreated, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState(''); // New state for tags
  const [imageFile, setImageFile] = useState<File | null>(null); // New state for the image file

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('jwt_token');
      if (!token) throw new Error('No auth token found');

      const headers = { 'Authorization': `Bearer ${token}` };
      const userId = 1; // IMPORTANT: Replace with the actual user ID

      // --- Step 1: Create the main entry record ---
      const entryResponse = await axios.post(
        `http://localhost:8080/api/v1/entries/${userId}`,
        { title, content },
        { headers }
      );
      const newEntry = entryResponse.data;

      // --- Step 2: Upload the image if one was selected ---
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('mediaType', 'IMAGE');
        
        await axios.post(
          `http://localhost:8080/api/v1/entries/${newEntry.id}/media`,
          formData,
          { headers: { ...headers, 'Content-Type': 'multipart/form-data' } }
        );
      }

      // --- Step 3: Add the tags ---
      const tagArray = tags.split(/[\s,]+/).filter(Boolean); // Splits by space or comma
      for (const tagName of tagArray) {
        await axios.post(
          `http://localhost:8080/api/v1/entries/${newEntry.id}/tags`,
          { name: tagName },
          { headers }
        );
      }
      
      onMemoryCreated(newEntry); // Pass the new memory back to the parent
    } catch (err) {
      setError('Failed to create memory. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', margin: '20px 0' }}>
      <h2>Create a New Memory</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ padding: '10px' }}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={5}
          style={{ padding: '10px' }}
        />
        {/* --- NEW FIELDS FOR TAGS AND IMAGE --- */}
        <input
          type="text"
          placeholder="Tags (e.g., family, work, vacation)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          style={{ padding: '10px' }}
        />
        <div>
            <label htmlFor="imageUpload">Add a Photo:</label>
            <input
                id="imageUpload"
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files && setImageFile(e.target.files[0])}
                style={{ marginTop: '5px' }}
            />
        </div>
        {/* ------------------------------------ */}

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" disabled={isSubmitting} style={{ padding: '10px', flex: 1 }}>
            {isSubmitting ? 'Saving...' : 'Save Memory'}
          </button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default AddMemoryForm;