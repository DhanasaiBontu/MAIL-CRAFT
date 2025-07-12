// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // remove JWT
    navigate('/login', { replace: true });
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">📬 MailCraft</div>
      <ul className="navbar-links">
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/compose">Compose</Link></li>
        <li><Link to="/sent">Sent Emails</Link></li>
        <li><Link to="/scheduled">Scheduled Emails</Link></li>

        {/* 🔒 Logout button */}
        <li className="logout-btn" onClick={handleLogout}>
          Logout
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
