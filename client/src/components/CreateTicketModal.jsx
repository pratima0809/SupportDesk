import React, { useState } from 'react';
import { ticketAPI } from '../utils/api';

export default function CreateTicketModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Other',
    priority: 'Medium',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.description) {
      setError('Title and description are required');
      return;
    }

    try {
      setLoading(true);
      await ticketAPI.createTicket(formData);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2 className="card-title">Create New Ticket</h2>

        {error && (
          <div className="alert error">{error}</div>
        )}

        <form onSubmit={handleSubmit} style={{ marginTop: 8 }}>
          <div className="form-row">
            <label className="label">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input"
              placeholder="Enter ticket title"
              required
            />
          </div>

          <div className="form-row">
            <label className="label">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="textarea"
              placeholder="Describe your issue"
              required
            />
          </div>

          <div className="form-row">
            <label className="label">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="select"
            >
              <option value="Technical">Technical</option>
              <option value="Network">Network</option>
              <option value="Account">Account</option>
              <option value="Academic">Academic</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-row">
            <label className="label">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="select"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            <button
              type="submit"
              disabled={loading}
              className={`btn btn-primary ${loading ? 'disabled' : ''}`}
              style={{ flex: 1 }}
            >
              {loading ? 'Creating...' : 'Create Ticket'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              style={{ flex: 1 }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
