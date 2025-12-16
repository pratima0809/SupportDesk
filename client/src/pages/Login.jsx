import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-page">
      <video className="auth-bg-video" autoPlay loop muted playsInline>
        <source src="https://cdn.pixabay.com/video/2023/10/10/184489-873483996_large.mp4" type="video/mp4" />
      </video>

      <div className="auth-container">
        <aside className="auth-visual">
          <div className="auth-visual-inner">
            <h1 className="auth-visual-title">SupportDesk</h1>
            <p className="auth-visual-sub">Ticketing made simple — collaborate, track, resolve.</p>
          </div>
        </aside>

        <main className="auth-card">
          <div className="auth-card-header">
            <h2 className="brand-title">Welcome back</h2>
            <p className="subtitle">Sign in to continue to your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="alert error"><p className="small">{error}</p></div>}

            <label className="label">Email address</label>
            <input
              name="email"
              type="email"
              required
              className="input"
              placeholder="you@company.com"
              value={formData.email}
              onChange={handleChange}
            />

            <label className="label">Password</label>
            <input
              name="password"
              type="password"
              required
              className="input"
              placeholder="Your password"
              value={formData.password}
              onChange={handleChange}
            />

            <div className="form-row form-row-between">
              <label className="checkbox">
                <input type="checkbox" /> Remember me
              </label>
              <Link to="/forgot" className="small link">Forgot?</Link>
            </div>

            <button type="submit" className={`btn btn-primary ${loading ? 'disabled' : ''}`} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

            <div className="divider"><span>or</span></div>

            <button type="button" className="btn btn-outline">Sign in with Google</button>

            <p className="signup-note">Don't have an account? <Link to="/register" className="link">Create one</Link></p>
          </form>
        </main>
      </div>
    </div>
  );
}
