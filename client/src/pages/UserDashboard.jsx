import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
import { ticketAPI } from '../utils/api';
import CreateTicketModal from '../components/CreateTicketModal';
import TicketCard from '../components/TicketCard';

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserTickets();
  }, []);

  const fetchUserTickets = async () => {
    try {
      setLoading(true);
      const response = await ticketAPI.getUserTickets();
      setTickets(response.data.tickets);
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredTickets = filter === 'All' ? tickets : tickets.filter((t) => t.status === filter);

  return (
    <div className="container page-wrap">
      <nav className="nav" style={{ marginBottom: 12 }}>
        <div className="nav-inner">
          <h1 className="brand">Support Desk</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <ThemeToggle />
            <span className="small text-muted">{user?.name}</span>
            <button onClick={handleLogout} className="btn btn-danger">Logout</button>
          </div>
        </div>
      </nav>

      <div className="main">
        <div className="topbar">
          <h2 style={{ fontSize: 22, fontWeight: 800 }}>My Tickets</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">Create New Ticket</button>
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['All', 'Open', 'In Progress', 'Resolved', 'Closed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`filter-btn ${filter === status ? 'active' : ''}`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center">Loading tickets...</div>
        ) : filteredTickets.length === 0 ? (
          <div className="text-center text-muted">No tickets found</div>
        ) : (
          <div className="tickets-grid">
            {filteredTickets.map((ticket) => (
              <TicketCard key={ticket._id} ticket={ticket} onRefresh={fetchUserTickets} isAdmin={false} />
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateTicketModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchUserTickets();
          }}
        />
      )}
    </div>
  );
}
