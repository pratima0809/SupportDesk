import React from 'react';
import { useNavigate } from 'react-router-dom';


export default function TicketCard({ ticket, onRefresh, isAdmin }) {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open':
        return 'status-open';
      case 'In Progress':
        return 'status-inprogress';
      case 'Accepted':
        return 'status-accepted';
      case 'Rejected':
        return 'status-rejected';
      case 'Resolved':
        return 'status-resolved';
      case 'Closed':
        return 'status-closed';
      default:
        return 'status-closed';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'priority-high';
      case 'Medium':
        return 'priority-medium';
      case 'Low':
        return 'priority-low';
      default:
        return '';
    }
  };

  return (
    <div onClick={() => navigate(`/ticket/${ticket._id}`)} className="ticket-card card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <h3 className="ticket-title">{ticket.title}</h3>
          <p className="ticket-desc">{ticket.description.substring(0, 100)}...</p>

          <div className="ticket-meta">
            <span className={`badge ${getStatusColor(ticket.status)}`}>{ticket.status}</span>
            <span className={`badge ${getPriorityColor(ticket.priority)}`}>{ticket.priority} Priority</span>
            <span className="badge" style={{ background: '#f5e9ff', color: '#6b21a8' }}>{ticket.category}</span>
          </div>
        </div>
        <div style={{ textAlign: 'right', fontSize: 13, color: '#6b7280' }}>
          <p>{new Date(ticket.createdAt).toLocaleDateString()}</p>
          {isAdmin && (
            <>
              <p style={{ marginTop: 8, fontWeight: 700 }}>{ticket.userId.name}</p>
              <div style={{ marginTop: 8 }}>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(`/ticket/${ticket._id}`); }}
                  className="btn btn-outline"
                  style={{ fontSize: 12 }}
                >
                  View
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
