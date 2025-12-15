import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ticketAPI, staffAPI } from '../utils/api';
import CommentSection from '../components/CommentSection';

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [staffPoolCount, setStaffPoolCount] = useState(0);
  const [acceptCount, setAcceptCount] = useState(1);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  const fetchTicket = useCallback(async () => {
    try {
      setLoading(true);
      const response = await ticketAPI.getTicketById(id);
      setTicket(response.data.ticket);
      setFormData(response.data.ticket);
    } catch (error) {
      console.error('Failed to fetch ticket:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTicket();
  }, [fetchTicket]);

  // Fetch staff pool count for this ticket's category
  useEffect(() => {
    const fetchPools = async () => {
      try {
        const res = await staffAPI.getPools();
        const pools = res.data.pools || {};
        setStaffPoolCount(pools[ticket?.category] || 0);
      } catch (err) {
        console.error('Failed to fetch staff pools', err);
      }
    };
    fetchPools();
  }, [ticket]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      await ticketAPI.updateTicket(id, { status: newStatus });
      setFormData({ ...formData, status: newStatus });
      setTicket({ ...ticket, status: newStatus });
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handlePriorityChange = async (e) => {
    const newPriority = e.target.value;
    try {
      await ticketAPI.updateTicket(id, { priority: newPriority });
      setFormData({ ...formData, priority: newPriority });
      setTicket({ ...ticket, priority: newPriority });
    } catch (error) {
      console.error('Failed to update priority:', error);
    }
  };

  const handleSaveResolution = async () => {
    try {
      await ticketAPI.updateTicket(id, { resolution: formData.resolution });
      setTicket({ ...ticket, resolution: formData.resolution });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save resolution:', error);
    }
  };

  const handleAction = async (action) => {
    setActionMessage('');
    if (!['reject', 'wait', 'accept'].includes(action)) return;

    try {
      setActionLoading(true);

      if (action === 'reject') {
        await ticketAPI.updateTicket(id, { status: 'Rejected' });
        setTicket({ ...ticket, status: 'Rejected' });
        setActionMessage('Ticket rejected');
      } else if (action === 'wait') {
        await ticketAPI.updateTicket(id, { status: 'In Progress' });
        setTicket({ ...ticket, status: 'In Progress' });
        setActionMessage('Ticket moved to In Progress');
      } else if (action === 'accept') {
        // Accept flow: check available staff
        if (staffPoolCount <= 0) {
          setActionMessage('No staff available in this category');
          return;
        }

        const num = Number(acceptCount) || 1;
        if (num <= 0) {
          setActionMessage('Select at least 1 staff');
          return;
        }
        if (num > staffPoolCount) {
          setActionMessage('Not enough staff available');
          return;
        }

        // Deduct staff from pool
        await staffAPI.adjustPool(ticket.category, -num);

        // Update ticket status and assignedStaffCount
        await ticketAPI.updateTicket(id, { status: 'Accepted', assignedStaffCount: num });
        setTicket({ ...ticket, status: 'Accepted', assignedStaffCount: num });
        setStaffPoolCount((s) => s - num);
        setActionMessage(`Accepted and assigned ${num} staff`);
      }
    } catch (err) {
      console.error('Action failed', err);
      setActionMessage(err.response?.data?.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!ticket) {
    return <div className="flex justify-center items-center min-h-screen">Ticket not found</div>;
  }

  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          ← Back
        </button>

        <div className="bg-white rounded shadow-md p-6 mb-6" style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 320 }}>
            <div style={{ marginBottom: 6 }}>
              <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>{ticket.title}</h1>
              <p className="small text-muted" style={{ marginTop: 6 }}>#{ticket._id.slice(-6)} • {new Date(ticket.createdAt).toLocaleString()}</p>
            </div>

            <div style={{ marginTop: 16, marginBottom: 20 }}>
              <p className="small text-muted" style={{ marginBottom: 8 }}>Description</p>
              <div style={{ lineHeight: 1.5, color: '#111827' }}>{ticket.description}</div>
            </div>

            <div style={{ marginTop: 8 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Discussion</h3>
              <CommentSection ticketId={id} />
            </div>
          </div>

          <aside style={{ width: 320, minWidth: 260 }}>
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p className="small text-muted" style={{ marginBottom: 6 }}>Status</p>
                  <p className={`text-sm font-semibold px-3 py-1 rounded ${
                    ticket.status === 'Open' ? 'bg-blue-100 text-blue-800' :
                    ticket.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                    ticket.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                    ticket.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                    ticket.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>{ticket.status}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p className="small text-muted">Created by</p>
                  <p style={{ fontWeight: 700 }}>{ticket.userId.name}</p>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: 12, marginBottom: 12 }}>
              <p className="small text-muted">Category</p>
              <p style={{ fontWeight: 700 }}>{ticket.category}</p>
              <p className="small text-muted" style={{ marginTop: 8 }}>Priority</p>
              <p style={{ fontWeight: 700 }}>{ticket.priority}</p>
              <p className="small text-muted" style={{ marginTop: 8 }}>Assigned Staff</p>
              <p style={{ fontWeight: 700 }}>{ticket.assignedStaffCount || 0}</p>
            </div>

            {isAdmin && (
              <div className="card" style={{ padding: 12 }}>
                <h4 style={{ marginTop: 0, marginBottom: 8 }}>Admin Actions</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <select value={ticket.status} onChange={handleStatusChange} className="select">
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>

                  <select value={ticket.priority} onChange={handlePriorityChange} className="select">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>

                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <button onClick={() => handleAction('reject')} disabled={actionLoading} className="btn btn-outline">Reject</button>
                    <button onClick={() => handleAction('wait')} disabled={actionLoading} className="btn btn-outline">Wait</button>
                  </div>

                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input type="number" min={1} max={staffPoolCount} value={acceptCount} onChange={(e) => setAcceptCount(e.target.value)} style={{ width: 80, padding: '6px 8px', borderRadius: 6 }} />
                    <button onClick={() => handleAction('accept')} disabled={actionLoading || staffPoolCount <= 0} className="btn btn-primary">Accept</button>
                  </div>

                  <div className="small text-muted">Available staff in category: {staffPoolCount}</div>
                  {actionMessage && <div className="small" style={{ marginTop: 8 }}>{actionMessage}</div>}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
