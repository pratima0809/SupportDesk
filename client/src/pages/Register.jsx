import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register, loading } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await register(formData.name, formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="page-center">
      <div className="auth-card card">
        <div>
          <h2 className="brand-title">Support Desk</h2>
          <p className="subtitle">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} style={{ marginTop: '18px' }}>
          {error && (
            <div className="alert error">
              <p className="small">{error}</p>
            </div>
          )}

          <div style={{ display: 'grid', gap: 12 }}>
            <div className="form-row">
              <label htmlFor="name" className="label">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="input"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <label htmlFor="email" className="label">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="input"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <label htmlFor="password" className="label">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="input"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <label htmlFor="confirmPassword" className="label">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="input"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <button
              type="submit"
              disabled={loading}
              className={`btn btn-primary ${loading ? 'disabled' : ''}`}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>

          <p className="text-center small" style={{ marginTop: 12 }}>
            Already have an account?{' '}
            <Link to="/login" className="small" style={{ color: '#2563eb', fontWeight: 600 }}>
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
