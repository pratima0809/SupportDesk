import axios from 'axios';

const API_BASE_URL = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  };
};

// Ticket API calls
export const ticketAPI = {
  createTicket: async (ticketData) => {
    return axios.post(`${API_BASE_URL}/tickets/create`, ticketData, {
      headers: getHeaders(),
    });
  },

  getUserTickets: async () => {
    return axios.get(`${API_BASE_URL}/tickets/my-tickets`, {
      headers: getHeaders(),
    });
  },

  getAllTickets: async (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    return axios.get(`${API_BASE_URL}/tickets?${query}`, {
      headers: getHeaders(),
    });
  },

  getTicketById: async (ticketId) => {
    return axios.get(`${API_BASE_URL}/tickets/${ticketId}`, {
      headers: getHeaders(),
    });
  },

  updateTicket: async (ticketId, updateData) => {
    return axios.put(`${API_BASE_URL}/tickets/${ticketId}`, updateData, {
      headers: getHeaders(),
    });
  },

  deleteTicket: async (ticketId) => {
    return axios.delete(`${API_BASE_URL}/tickets/${ticketId}`, {
      headers: getHeaders(),
    });
  },

  getDashboardStats: async () => {
    return axios.get(`${API_BASE_URL}/tickets/dashboard/stats`, {
      headers: getHeaders(),
    });
  },
};

// Comment API calls
export const commentAPI = {
  createComment: async (commentData) => {
    return axios.post(`${API_BASE_URL}/comments/create`, commentData, {
      headers: getHeaders(),
    });
  },

  getComments: async (ticketId) => {
    return axios.get(`${API_BASE_URL}/comments/${ticketId}`, {
      headers: getHeaders(),
    });
  },

  updateComment: async (commentId, text) => {
    return axios.put(`${API_BASE_URL}/comments/${commentId}`, { text }, {
      headers: getHeaders(),
    });
  },

  deleteComment: async (commentId) => {
    return axios.delete(`${API_BASE_URL}/comments/${commentId}`, {
      headers: getHeaders(),
    });
  },
};

// Auth/admin related API calls
export const authAPI = {
  getStaffCounts: async () => {
    return axios.get(`${API_BASE_URL}/staff/pools`, {
      headers: getHeaders(),
    });
  },
};

export const staffAPI = {
  getPools: async () => {
    return axios.get(`${API_BASE_URL}/staff/pools`, { headers: getHeaders() });
  },
  adjustPool: async (category, delta) => {
    return axios.post(`${API_BASE_URL}/staff/pools/adjust`, { category, delta }, { headers: getHeaders() });
  },
};
