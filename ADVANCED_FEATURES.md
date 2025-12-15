# Advanced Features & Extensions Guide

This document provides guidance on implementing advanced features for the Support Desk system.

---

## 🔔 Email Notifications

### Implementation with Nodemailer

#### Step 1: Install Nodemailer
```bash
npm install nodemailer
```

#### Step 2: Create email service (`server/utils/emailService.js`)
```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendTicketCreatedEmail = async (userEmail, ticketId) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: `Ticket Created - #${ticketId}`,
    html: `
      <h2>Your Support Ticket has been created</h2>
      <p>Ticket ID: #${ticketId}</p>
      <p>Our support team will review your ticket soon.</p>
    `
  };
  
  await transporter.sendMail(mailOptions);
};

module.exports = { sendTicketCreatedEmail };
```

#### Step 3: Update .env
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

#### Step 4: Use in controller
```javascript
const { sendTicketCreatedEmail } = require('../utils/emailService');

// In createTicket function
await sendTicketCreatedEmail(user.email, ticket._id);
```

---

## 🔄 Real-time Updates with Socket.io

### Implementation

#### Step 1: Install Socket.io
```bash
npm install socket.io socket.io-client
```

#### Step 2: Update server.js
```javascript
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: { origin: process.env.CLIENT_URL || 'http://localhost:3000' }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join-ticket', (ticketId) => {
    socket.join(`ticket-${ticketId}`);
  });
  
  socket.on('leave-ticket', (ticketId) => {
    socket.leave(`ticket-${ticketId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

module.exports = { io };
```

#### Step 3: Emit events from controllers
```javascript
// In ticketController.js
const { io } = require('../server');

exports.updateTicket = async (req, res) => {
  // ... update logic
  
  // Emit update to all connected clients
  io.to(`ticket-${ticketId}`).emit('ticket-updated', updatedTicket);
};
```

#### Step 4: Listen on frontend
```javascript
// In TicketDetail.jsx
import io from 'socket.io-client';

useEffect(() => {
  const socket = io(process.env.REACT_APP_API_URL);
  
  socket.emit('join-ticket', ticketId);
  
  socket.on('ticket-updated', (updatedTicket) => {
    setTicket(updatedTicket);
  });
  
  return () => socket.disconnect();
}, [ticketId]);
```

---

## 📁 File Upload with Multer

### Implementation

#### Step 1: Install Multer
```bash
npm install multer
```

#### Step 2: Create upload middleware (`server/middleware/upload.js`)
```javascript
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|jpg|jpeg|png/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Invalid file type');
    }
  }
});

module.exports = upload;
```

#### Step 3: Update routes
```javascript
const upload = require('../middleware/upload');
const { createTicketWithFile } = require('../controllers/ticketController');

router.post('/create-with-file', upload.single('attachment'), 
  protect, createTicketWithFile);
```

#### Step 4: Update controller
```javascript
exports.createTicketWithFile = async (req, res) => {
  const { title, description, category, priority } = req.body;
  
  const ticket = await Ticket.create({
    title,
    description,
    category,
    priority,
    userId: req.user.id,
    attachments: req.file ? [{
      filename: req.file.filename,
      filepath: `/uploads/${req.file.filename}`
    }] : []
  });
  
  res.status(201).json({ success: true, ticket });
};
```

---

## 📊 Analytics Dashboard

### Implementation

#### Step 1: Create analytics controller
```javascript
// server/controllers/analyticsController.js
exports.getAnalytics = async (req, res) => {
  const { startDate, endDate } = req.query;
  
  const dateFilter = {
    createdAt: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  };
  
  const ticketsByCategory = await Ticket.aggregate([
    { $match: dateFilter },
    { $group: { _id: '$category', count: { $sum: 1 } } }
  ]);
  
  const ticketsByStatus = await Ticket.aggregate([
    { $match: dateFilter },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);
  
  const averageResolutionTime = await Ticket.aggregate([
    { $match: { status: 'Resolved', ...dateFilter } },
    {
      $group: {
        _id: null,
        avgTime: {
          $avg: {
            $subtract: ['$updatedAt', '$createdAt']
          }
        }
      }
    }
  ]);
  
  res.json({
    success: true,
    analytics: {
      ticketsByCategory,
      ticketsByStatus,
      averageResolutionTime: averageResolutionTime[0]?.avgTime || 0
    }
  });
};
```

#### Step 2: Create React analytics component
```javascript
// client/src/pages/Analytics.jsx
import { LineChart, Line, XAxis, YAxis } from 'recharts';

export default function Analytics() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetchAnalytics();
  }, []);
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Analytics</h1>
      {data && (
        <LineChart width={600} height={400} data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Line type="monotone" dataKey="tickets" stroke="#8884d8" />
        </LineChart>
      )}
    </div>
  );
}
```

---

## 🎨 Dark Mode Implementation

### Step 1: Create theme context
```javascript
// client/src/context/ThemeContext.jsx
import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(
    localStorage.getItem('theme') === 'dark'
  );
  
  const toggleTheme = () => {
    setIsDark(!isDark);
    localStorage.setItem('theme', !isDark ? 'dark' : 'light');
  };
  
  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
```

### Step 2: Apply theme to components
```javascript
// In any component
import { useTheme } from '../context/ThemeContext';

const { isDark } = useTheme();

return (
  <div className={isDark ? 'bg-gray-900 text-white' : 'bg-white text-black'}>
    {/* Content */}
  </div>
);
```

---

## 🔐 Two-Factor Authentication

### Implementation with OTP

#### Step 1: Install speakeasy
```bash
npm install speakeasy qrcode
```

#### Step 2: Update User model
```javascript
const userSchema = new mongoose.Schema({
  // ... existing fields
  twoFactorSecret: String,
  twoFactorEnabled: { type: Boolean, default: false }
});
```

#### Step 3: Create 2FA controller
```javascript
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

exports.setup2FA = async (req, res) => {
  const secret = speakeasy.generateSecret({
    name: `Support Desk (${req.user.email})`
  });
  
  const qrCode = await QRCode.toDataURL(secret.otpauth_url);
  
  res.json({ secret: secret.base32, qrCode });
};

exports.verify2FA = async (req, res) => {
  const { token, secret } = req.body;
  
  const verified = speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: token
  });
  
  if (verified) {
    await User.updateOne(
      { _id: req.user.id },
      { twoFactorSecret: secret, twoFactorEnabled: true }
    );
    res.json({ success: true, message: '2FA enabled' });
  } else {
    res.status(400).json({ success: false, message: 'Invalid token' });
  }
};
```

---

## 🤖 AI-Powered Ticket Categorization

### Using OpenAI API

#### Step 1: Install OpenAI
```bash
npm install openai
```

#### Step 2: Create AI helper
```javascript
// server/utils/aiHelper.js
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const categorizeTicket = async (title, description) => {
  const message = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{
      role: 'user',
      content: `Categorize this ticket into one of: Technical, Network, Account, Academic, Other. 
                Title: ${title}
                Description: ${description}`
    }]
  });
  
  return message.choices[0].message.content;
};

module.exports = { categorizeTicket };
```

---

## 📱 Mobile App Integration

### Create React Native version:

```bash
npx react-native init SupportDeskMobile
cd SupportDeskMobile
npm install axios @react-navigation/native
```

Use same API endpoints as web application.

---

## 🔄 Automated Ticket Assignment

### Step 1: Create assignment logic
```javascript
// server/utils/assignmentLogic.js
const assignTicketAuto = async (ticket) => {
  const agents = await User.find({ role: 'admin' });
  
  // Find agent with least assigned tickets
  const agentLoads = await Promise.all(
    agents.map(agent => 
      Ticket.countDocuments({ assignedTo: agent._id, status: { $ne: 'Closed' } })
    )
  );
  
  const leastBusyAgent = agents[agentLoads.indexOf(Math.min(...agentLoads))];
  
  await Ticket.updateOne(
    { _id: ticket._id },
    { assignedTo: leastBusyAgent._id }
  );
};
```

---

## 📞 Live Chat Integration

Add support chat using services like:
- **Tawk.to**: Easiest integration
- **Crisp**: Full-featured
- **Zendesk**: Enterprise solution

---

## 🧪 Testing Setup

### Unit Tests with Jest
```bash
npm install --save-dev jest supertest
```

### Example test:
```javascript
// server/__tests__/auth.test.js
const request = require('supertest');
const app = require('../server');

describe('Auth API', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });
});
```

---

## 📈 Performance Monitoring

### Add APM tools:
- **New Relic**: $100+/month
- **DataDog**: $10-50/month
- **Sentry**: Free-29/month for errors

---

## Conclusion

These advanced features can significantly enhance your application. Implement them based on your requirements and user feedback. Start with the most valuable features first!

---

For more information, refer to:
- [Socket.io Documentation](https://socket.io/)
- [Nodemailer Guide](https://nodemailer.com/)
- [Multer Upload](https://github.com/expressjs/multer)
- [OpenAI API](https://platform.openai.com/)
