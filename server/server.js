require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

// Connect to MongoDB (uses process.env.MONGODB_URI)
connectDB();

const app = express();

// Trust proxy (needed on many PaaS like Render)
app.set('trust proxy', true);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS: support multiple allowed origins from CLIENT_URL env (comma-separated)
// and include common local origins. This function allows precise control in production.
const rawClientUrls = process.env.CLIENT_URL || '';
// include the Render backend URL and the Vercel frontend URL (so preflight from the frontend is allowed)
const extraAllowed = [
  'https://supportdesk-tgio.onrender.com',
  'https://support-desk-green.vercel.app',
];
let allowedOrigins = rawClientUrls.split(',').map(s => s.trim()).filter(Boolean).concat(extraAllowed);

// Always allow common local dev origins when not in production
if (process.env.NODE_ENV !== 'production') {
  allowedOrigins = allowedOrigins.concat(['http://localhost:3000', 'http://localhost:5173']);
}

// Deduplicate
allowedOrigins = Array.from(new Set(allowedOrigins));

// Log allowed origins at startup (helps debugging)
console.info('Allowed CORS origins:', allowedOrigins);

app.use((req, res, next) => {
  // For debug: attach origin to req
  req.requestOrigin = req.headers.origin;
  return next();
});

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (server-to-server, curl)
    if (!origin) return callback(null, true);
    // if origin is allowed, accept it
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    // origin not allowed — return an explicit error object so CORS will not set header
    // but respond gracefully with 403 for preflight OPTIONS to include no CORS header
    return callback(new Error('CORS policy: origin not allowed'), false);
  },
  optionsSuccessStatus: 200,
}));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));
app.use('/api/staff', require('./routes/staffRoutes'));

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
const graceful = () => {
  console.info('Shutting down gracefully...');
  server.close(() => {
    mongoose.connection.close(false)
      .then(() => {
        console.info('Mongo connection closed. Exiting process.');
        process.exit(0);
      })
      .catch((err) => {
        console.error('Error closing Mongo connection:', err);
        process.exit(1);
      });
  });
};

process.on('SIGTERM', graceful);
process.on('SIGINT', graceful);
