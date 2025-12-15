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
const extraAllowed = ['https://supportdesk-tgio.onrender.com']; // include the Render backend URL as requested
let allowedOrigins = rawClientUrls.split(',').map(s => s.trim()).filter(Boolean).concat(extraAllowed);

// Always allow common local dev origins when not in production
if (process.env.NODE_ENV !== 'production') {
  allowedOrigins = allowedOrigins.concat(['http://localhost:3000', 'http://localhost:5173']);
}

// Deduplicate
allowedOrigins = Array.from(new Set(allowedOrigins));

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
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
    mongoose.connection.close(false, () => {
      console.info('Mongo connection closed. Exiting process.');
      process.exit(0);
    });
  });
};

process.on('SIGTERM', graceful);
process.on('SIGINT', graceful);
