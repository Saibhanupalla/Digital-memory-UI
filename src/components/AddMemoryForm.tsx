import React, { useState } from 'react';
import axios from 'axios';

interface AddMemoryFormProps {
  onMemoryCreated: (newMemory: any) => void;
  onCancel: () => void;
}

const AddMemoryForm: React.FC<AddMemoryFormProps> = ({ onMemoryCreated, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const userId = 1;

      const entryResponse = await axios.post(
        `http://localhost:8080/api/v1/entries/${userId}`,
        { title, content },
        { headers }
      );
      const newEntry = entryResponse.data;

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

      const tagArray = tags.split(/[\s,]+/).filter(Boolean);
      for (const tagName of tagArray) {
        await axios.post(
          `http://localhost:8080/api/v1/entries/${newEntry.id}/tags`,
          { name: tagName },
          { headers }
        );
      }

      onMemoryCreated(newEntry);
    } catch (err) {
      setError('Failed to create memory. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        {imagePreview ? (
          <div style={styles.imagePreview}>
            <img src={imagePreview} alt="Preview" style={styles.previewImage} />
            <button
              type="button"
              onClick={() => {
                setImageFile(null);
                setImagePreview(null);
              }}
              style={styles.removeImageButton}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        ) : (
          <label style={styles.uploadArea}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={styles.fileInput}
            />
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <p style={styles.uploadText}>Tap to add a photo</p>
          </label>
        )}

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Title</label>
          <input
            type="text"
            placeholder="Give your memory a title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Description</label>
          <textarea
            placeholder="What makes this memory special?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={5}
            style={styles.textarea}
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Tags</label>
          <input
            type="text"
            placeholder="family, vacation, birthday"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            style={styles.input}
          />
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.actions}>
          <button type="button" onClick={onCancel} style={styles.cancelButton}>
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} style={styles.submitButton}>
            {isSubmitting ? 'Saving...' : 'Save Memory'}
          </button>
        </div>
      </form>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  imagePreview: {
    position: 'relative',
    width: '100%',
    height: '300px',
    borderRadius: '16px',
    overflow: 'hidden',
    backgroundColor: '#f8fafc',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    color: '#ef4444',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  uploadArea: {
    width: '100%',
    height: '300px',
    borderRadius: '16px',
    border: '2px dashed #cbd5e1',
    backgroundColor: '#f8fafc',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#94a3b8',
    transition: 'all 0.2s ease',
  },
  fileInput: {
    display: 'none',
  },
  uploadText: {
    marginTop: '12px',
    fontSize: '16px',
    fontWeight: '500',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#475569',
  },
  input: {
    padding: '14px 16px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    fontSize: '16px',
    backgroundColor: '#ffffff',
  },
  textarea: {
    padding: '14px 16px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    fontSize: '16px',
    backgroundColor: '#ffffff',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  error: {
    color: '#ef4444',
    fontSize: '14px',
    padding: '12px',
    backgroundColor: '#fef2f2',
    borderRadius: '8px',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px',
  },
  cancelButton: {
    flex: 1,
    padding: '14px 24px',
    borderRadius: '12px',
    backgroundColor: '#f1f5f9',
    color: '#475569',
    fontSize: '16px',
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    padding: '14px 24px',
    borderRadius: '12px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '600',
    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
  },
};

export default AddMemoryForm;
