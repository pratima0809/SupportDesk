import apiClient from './apiClient';

// Ticket API calls
export const ticketAPI = {
  createTicket: async (ticketData) => apiClient.post('/tickets/create', ticketData),
  getUserTickets: async () => apiClient.get('/tickets/my-tickets'),
  getAllTickets: async (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    return apiClient.get(`/tickets?${query}`);
  },
  getTicketById: async (ticketId) => apiClient.get(`/tickets/${ticketId}`),
  updateTicket: async (ticketId, updateData) => apiClient.put(`/tickets/${ticketId}`, updateData),
  deleteTicket: async (ticketId) => apiClient.delete(`/tickets/${ticketId}`),
  getDashboardStats: async () => apiClient.get('/tickets/dashboard/stats'),
};

// Comment API calls
export const commentAPI = {
  createComment: async (commentData) => apiClient.post('/comments/create', commentData),
  getComments: async (ticketId) => apiClient.get(`/comments/${ticketId}`),
  updateComment: async (commentId, text) => apiClient.put(`/comments/${commentId}`, { text }),
  deleteComment: async (commentId) => apiClient.delete(`/comments/${commentId}`),
};

// Auth/admin related API calls
export const authAPI = {
  getStaffCounts: async () => apiClient.get('/staff/pools'),
};

export const staffAPI = {
  getPools: async () => apiClient.get('/staff/pools'),
  adjustPool: async (category, delta) => apiClient.post('/staff/pools/adjust', { category, delta }),
};
