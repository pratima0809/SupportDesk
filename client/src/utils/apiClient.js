import axios from 'axios';

// Compute base: REACT_APP_API_URL (no trailing slash) + '/api' or fallback to '/api'
const BASE = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace(/\/$/, '') + '/api' : '/api';

const apiClient = axios.create({
  baseURL: BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  // 10s timeout
  timeout: 10000,
});

// Warn if REACT_APP_API_URL equals the frontend origin (common misconfiguration)
if (typeof window !== 'undefined' && process.env.REACT_APP_API_URL) {
  try {
    const normalized = process.env.REACT_APP_API_URL.replace(/\/$/, '');
    if (normalized === window.location.origin) {
      // eslint-disable-next-line no-console
      console.error('REACT_APP_API_URL is set to the frontend origin. This will route API requests to the static site and cause 405 errors. Set REACT_APP_API_URL to your backend URL and rebuild the app.');
    }
  } catch (e) {
    // ignore
  }
}

// Request interceptor: attach token if present
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: optional global handling (e.g., 401)
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    // You can add global error handling here (logout on 401, etc.)
    return Promise.reject(err);
  }
);

export default apiClient;
