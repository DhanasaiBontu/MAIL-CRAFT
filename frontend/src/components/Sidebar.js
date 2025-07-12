import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul>
        <li><Link to="/">📊 Dashboard</Link></li>
        <li><Link to="/compose">✉️ Compose Email</Link></li>
        <li><Link to="/sent">📤 Sent Emails</Link></li>
        <li><Link to="/scheduled">⏰ Scheduled Emails</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
