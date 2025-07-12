// src/pages/ScheduledEmails.js
import React, { useEffect, useState } from 'react';
import axios from '../axios';
import '../styles/ScheduledEmails.css';

function ScheduledEmails() {
  const [scheduled, setScheduled] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchScheduled = async () => {
      try {
        const res = await axios.get('/emails/sent', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const filtered = res.data.filter(email => email.status === 'Pending');
        setScheduled(filtered.reverse()); // latest first
        setLoading(false);
      } catch (err) {
        console.error('Error fetching scheduled emails:', err);
        setLoading(false);
      }
    };

    fetchScheduled();
  }, [token]);

  return (
    <div className="scheduled-container">
      <h2>⏳ Scheduled Emails</h2>
      {loading ? (
        <p>Loading...</p>
      ) : scheduled.length === 0 ? (
        <p>No emails scheduled.</p>
      ) : (
        <table className="scheduled-table">
          <thead>
            <tr>
              <th>To</th>
              <th>Subject</th>
              <th>Scheduled Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {scheduled.map((email) => (
              <tr key={email._id}>
                <td>{email.email_address}</td>
                <td>{email.subject}</td>
                <td>{new Date(email.send_time).toLocaleString()}</td>
                <td className="pending">Pending</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ScheduledEmails;
