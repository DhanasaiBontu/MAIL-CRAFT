// src/pages/SentEmails.js
import React, { useEffect, useState } from 'react';
import axios from '../axios';
import '../styles/SentEmails.css';

function SentEmails() {
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
        setEmails(res.data.reverse()); // latest first
        setLoading(false);
      } catch (err) {
        console.error('Error fetching sent emails:', err);
        setLoading(false);
      }
    };

    fetchEmails();
  }, [token]);

  return (
    <div className="sent-container">
      <h2>📤 Sent & Scheduled Emails</h2>
      {loading ? (
        <p>Loading...</p>
      ) : emails.length === 0 ? (
        <p>No emails found.</p>
      ) : (
        <table className="email-table">
          <thead>
            <tr>
              <th>To</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Scheduled Time</th>
              <th>Opened</th>
            </tr>
          </thead>
          <tbody>
            {emails.map((email) => (
              <tr key={email._id}>
                <td>{email.email_address}</td>
                <td>{email.subject}</td>
                <td className={`status ${email.status.toLowerCase()}`}>
                  {email.status}
                </td>
                <td>
                  {email.send_time
                    ? new Date(email.send_time).toLocaleString()
                    : '-'}
                </td>
                <td>{email.opened ? '✔️' : '❌'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default SentEmails;
