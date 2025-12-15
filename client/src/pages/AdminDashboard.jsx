import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
import { ticketAPI, staffAPI } from '../utils/api';
import TicketCard from '../components/TicketCard';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [staffCounts, setStaffCounts] = useState({});
  const navigate = useNavigate();

  const fetchAdminData = useCallback(async () => {
    try {
      setLoading(true);
      const filters = {};
      if (filterStatus) filters.status = filterStatus;
      if (filterPriority) filters.priority = filterPriority;
      if (filterCategory) filters.category = filterCategory;

      const [ticketsRes, statsRes, staffCountsRes] = await Promise.all([
        ticketAPI.getAllTickets(filters),
        ticketAPI.getDashboardStats(),
        // new endpoint returning staff counts map
        staffAPI.getPools(),
      ]);

      setTickets(ticketsRes.data.tickets);
      setStats(statsRes.data.stats);
      setStaffCounts(staffCountsRes.data.pools || {});
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterPriority, filterCategory]);

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchAdminData();
  }, [user?.role, navigate, fetchAdminData]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="container page-wrap">
      <nav className="nav" style={{ marginBottom: 12 }}>
        <div className="nav-inner">
          <h1 className="brand">Support Desk - Admin</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <ThemeToggle />
            <span className="small text-muted">{user?.name}</span>
            <button onClick={handleLogout} className="btn btn-danger">Logout</button>
          </div>
        </div>
      </nav>

      <div className="dashboard">
        <aside className="sidebar">
          {stats && (
            <div className="stat-card">
              <p className="small text-muted">Total Tickets</p>
              <p style={{ fontSize: 26, fontWeight: 800 }}>{stats.totalTickets}</p>
              <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                <div style={{ flex: 1 }}>
                  <p className="small text-muted">Open</p>
                  <p style={{ fontSize: 18, fontWeight: 800, color: '#2563eb' }}>{stats.openTickets}</p>
                </div>
                <div style={{ flex: 1 }}>
                  <p className="small text-muted">In Progress</p>
                  <p style={{ fontSize: 18, fontWeight: 800, color: '#b45309' }}>{stats.inProgressTickets}</p>
                </div>
                <div style={{ flex: 1 }}>
                  <p className="small text-muted">Resolved</p>
                  <p style={{ fontSize: 18, fontWeight: 800, color: '#16a34a' }}>{stats.resolvedTickets}</p>
                </div>
              </div>
            </div>
          )}

          <div className="stat-card">
            <h4 style={{ marginBottom: 10, fontSize: 15, fontWeight: 700 }}>Available Staff</h4>
            <div className="staff-pool">
              {['Technical', 'Network', 'Account', 'Academic', 'Other'].map((cat) => (
                <div key={cat} className="pool-item">
                  <div className="label">{cat}</div>
                  <div className="count">{staffCounts[cat] || 0}</div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="main">
          <div className="topbar">
            <h2 style={{ fontSize: 22, fontWeight: 800 }}>All Tickets</h2>
            <div style={{ display: 'flex', gap: 8 }}>
              <span className="small text-muted">{user?.email}</span>
            </div>
          </div>

          <div className="filters-card card">
            <div style={{ minWidth: 180 }}>
              <label className="label">Status</label>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="select">
                <option value="">All Status</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div style={{ minWidth: 160 }}>
              <label className="label">Priority</label>
              <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="select">
                <option value="">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div style={{ minWidth: 160 }}>
              <label className="label">Category</label>
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="select">
                <option value="">All Categories</option>
                <option value="Technical">Technical</option>
                <option value="Network">Network</option>
                <option value="Account">Account</option>
                <option value="Academic">Academic</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center">Loading tickets...</div>
          ) : tickets.length === 0 ? (
            <div className="text-center text-muted">No tickets found</div>
          ) : (
            <div className="tickets-grid">
              {tickets.map((ticket) => (
                <TicketCard key={ticket._id} ticket={ticket} onRefresh={fetchAdminData} isAdmin={true} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
