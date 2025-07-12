// src/pages/Login.js
import React, { useState, useEffect } from 'react';
import axios from '../axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  /* lock body scroll while this page is mounted */
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => (document.body.style.overflow = original);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const body = new URLSearchParams();
      body.append('username', username);
      body.append('password', password);

      const { data } = await axios.post('/auth/login', body, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      localStorage.setItem('token', data.access_token);
      navigate('/', { replace: true });
    } catch {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="login-hero">
      {/* ---------- Brand ---------- */}
      <header className="brand-block">
        {/* paper-plane logo (inline SVG) */}
        <svg
          width="72"
          height="72"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 2 11 13" />
          <path d="m22 2-7 20-4-9-9-4Z" />
          <path d="M9.5 12.5 22 2" />
        </svg>

        <h1 className="brand-title">MAIL&nbsp;CRAFT</h1>
        <p className="brand-sub">CUSTOM EMAIL GENERATOR</p>
      </header>

      {/* ---------- Glass Panel ---------- */}
      <form className="glass-panel" onSubmit={handleLogin}>
        <label>
          <span>Username</span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>

        <label>
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button type="submit">LOG&nbsp;IN</button>
      </form>
    </div>
  );
}

export default Login;
