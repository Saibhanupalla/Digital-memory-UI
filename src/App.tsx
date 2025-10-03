import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import HomeScreen from './screens/HomeScreen';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem('jwt_token'));
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        username: username,
        password: password
      });
      const jwtToken = response.data.jwt;
      localStorage.setItem('jwt_token', jwtToken);
      setToken(jwtToken);
    } catch (err) {
      setError('Invalid username or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    setToken(null);
  };

  if (token) {
    return (
      <div className="App">
        <HomeScreen onLogout={handleLogout} />
      </div>
    );
  }

  return (
    <div className="App" style={styles.loginContainer}>
      <div style={styles.loginCard} className="fade-in">
        <div style={styles.logoContainer}>
          <div style={styles.logo}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h1 style={styles.title}>Memory Vault</h1>
          <p style={styles.subtitle}>Sign in to access your memories</p>
        </div>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          {error && (
            <div style={styles.errorMessage}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              <span>{error}</span>
            </div>
          )}

          <button type="submit" disabled={isLoading} style={styles.submitButton}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  loginContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    padding: '20px',
  },
  loginCard: {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    padding: '40px',
  },
  logoContainer: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  logo: {
    width: '72px',
    height: '72px',
    margin: '0 auto 16px',
    borderRadius: '16px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748b',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
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
  errorMessage: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    backgroundColor: '#fef2f2',
    color: '#ef4444',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '500',
  },
  submitButton: {
    padding: '14px 24px',
    borderRadius: '12px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '600',
    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
    marginTop: '8px',
  },
};

export default App;
