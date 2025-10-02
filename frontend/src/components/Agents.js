import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { user } = useAuth();

  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (isAdmin) {
      fetchAgents();
    }
  }, [isAdmin]);

  const fetchAgents = async () => {
    try {
      const response = await axios.get('/api/agents');
      setAgents(response.data);
    } catch (error) {
      console.error('Error fetching agents:', error);
      setMessage('Error fetching agents');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      setMessage('Only admin can create agents');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await axios.post('/api/agents', formData);
      setMessage('Agent created successfully!');
      setFormData({ name: '', email: '', mobile: '', password: '' });
      fetchAgents();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error creating agent');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="container">
        <div className="card">
          <h2>Access Denied</h2>
          <p>You need admin privileges to access this page.</p>
          <p>Current role: <strong>{user?.role}</strong></p>
          <p>Please contact an administrator or log in with an admin account.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Manage Agents</h1>
      
      <div className="card">
        <h2>Add New Agent</h2>
        {message && (
          <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'}`}>
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter agent name"
              required
            />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter agent email"
              required
            />
          </div>

          <div className="form-group">
            <label>Mobile Number with Country Code *</label>
            <input
              type="text"
              name="mobile"
              className="form-control"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="+1234567890"
              required
            />
            <small style={{ color: '#666', marginTop: '0.25rem', display: 'block' }}>
              Format: +[country code][number] e.g., +919876543210
            </small>
          </div>

          {/* FIX: Completed the password input field */}
          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter a strong password"
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating Agent...' : 'Create Agent'}
          </button>
        </form>
      </div>
      
      {/* (Optional) You can add the agent list display here */}

    </div>
  );
};

export default Agents;