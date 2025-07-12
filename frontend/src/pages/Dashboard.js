// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from '../axios';
import '../styles/Dashboard.css';

function Dashboard() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const res = await axios.get('/emails/sent', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEmails(res.data);
      } catch (err) {
        console.error('Failed to fetch emails', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, [token]);

  const getCountByStatus = (status) =>
    emails.filter((email) => email.status === status).length;

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className="dashboard-container">
      <h2>📊 Email Dashboard</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Emails</h3>
          <p>{emails.length}</p>
        </div>
        <div className="stat-card">
          <h3>✅ Sent</h3>
          <p>{getCountByStatus('Sent')}</p>
        </div>
        <div className="stat-card">
          <h3>📅 Scheduled</h3>
          <p>{getCountByStatus('Pending')}</p>
        </div>
        <div className="stat-card">
          <h3>❌ Failed</h3>
          <p>{getCountByStatus('Failed')}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
