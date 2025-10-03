import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import HomeScreen from './screens/HomeScreen'; // Import the new screen

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // Check localStorage for an existing token when the app loads
  const [token, setToken] = useState(localStorage.getItem('jwt_token'));
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

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
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    setToken(null);
  };

  // If we have a token, show the HomeScreen
  if (token) {
    return (
      <div className="App">
        <HomeScreen onLogout={handleLogout} />
      </div>
    );
  }

  // Otherwise, show the Login form
  return (
    <div className="App">
      <h1>Login to Your Vault</h1>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px', margin: 'auto', gap: '10px' }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ padding: '10px' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: '10px' }}
        />
        <button type="submit" style={{ padding: '10px' }}>Login</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}

export default App;