// src/pages/ComposeEmail.js
import React, { useState } from 'react';
import axios from '../axios';
import '../styles/ComposeEmail.css';

function ComposeEmail() {
  const [formData, setFormData] = useState({
    company_name: '',
    contact_name: '',
    email_address: '',
    subject: '',
    content: '',
    send_time: ''
  });

  const [message, setMessage] = useState('');
  const [aiSubject, setAiSubject] = useState('');
  const [aiContext, setAiContext] = useState('');
  const [generating, setGenerating] = useState(false);

  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.send_time) {
      const selectedTime = new Date(formData.send_time);
      const now = new Date();
      if (selectedTime < now) {
        return setMessage('❌ Scheduled time must be in the future!');
      }
    }

    try {
      const payload = { ...formData };
      if (!payload.send_time) {
        delete payload.send_time; // ✅ Remove send_time if empty
      }

      const res = await axios.post('/emails/send', payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setMessage(`✅ ${res.data.message}`);
      setFormData({
        company_name: '',
        contact_name: '',
        email_address: '',
        subject: '',
        content: '',
        send_time: ''
      });
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to send or schedule email.');
    }
  };

  const generateWithAI = async () => {
    if (!aiSubject || !aiContext) return alert('Please fill in subject and context.');
    setGenerating(true);

    try {
      const res = await axios.post('/emails/ai-generate', null, {
        params: {
          subject: aiSubject,
          recipient_name: formData.contact_name,
          context: aiContext
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setFormData((prev) => ({
        ...prev,
        subject: res.data.subject,
        content: res.data.body
      }));
      setMessage('✅ AI-generated draft inserted.');
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to generate AI email.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="compose-container">
      <h2>📬 Compose Email</h2>

      {/* AI Generator Section */}
      <div className="ai-generator">
        <h3>🤖 Generate Email with AI</h3>
        <input
          type="text"
          placeholder="AI Subject"
          value={aiSubject}
          onChange={(e) => setAiSubject(e.target.value)}
        />
        <textarea
          placeholder="Context (e.g., Welcome email for new client)"
          value={aiContext}
          onChange={(e) => setAiContext(e.target.value)}
          rows="3"
        />
        <button onClick={generateWithAI} disabled={generating}>
          {generating ? 'Generating...' : 'Generate with AI'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="compose-form">
        <input
          type="text"
          name="company_name"
          placeholder="Company Name"
          value={formData.company_name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="contact_name"
          placeholder="Contact Name"
          value={formData.contact_name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email_address"
          placeholder="Recipient Email Address"
          value={formData.email_address}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleChange}
          required
        />
        <textarea
          name="content"
          placeholder="Email Content"
          value={formData.content}
          onChange={handleChange}
          required
        />
        <label>📅 Schedule (optional)</label>
        <input
          type="datetime-local"
          name="send_time"
          value={formData.send_time}
          onChange={handleChange}
        />
        <button type="submit">Send Email</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default ComposeEmail;
