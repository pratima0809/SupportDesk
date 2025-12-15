# Support Desk - MERN Helpdesk Ticketing System

A comprehensive helpdesk ticketing system built with the MERN stack (MongoDB, Express, React, Node.js) for managing user support tickets with real-time tracking and admin management.

## Features

### Core Features
- **User Management**
  - Registration & Login (JWT-based authentication)
  - Profile management
  - Two roles: User and Admin/Support

- **Ticket Creation & Management**
  - Users can create support tickets
  - Fields: Title, Description, Category, Priority, Attachments
  - Status tracking: Open, In Progress, Resolved, Closed
  - Timestamp tracking (created/updated dates)

- **Ticket Tracking**
  - Users can view their tickets
  - Track ticket status in real-time
  - Filter and search capabilities

- **Admin Dashboard**
  - View all tickets
  - Filter by status, priority, category
  - Assign tickets to support staff
  - Update ticket status and add resolution
  - Dashboard statistics

- **Communication**
  - Comment system for user-admin interaction
  - In-app notifications for updates
  - Admin and user comments with timestamps

## Project Structure

```
SupportDesk/
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── ticketController.js
│   │   └── commentController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Ticket.js
│   │   └── Comment.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── ticketRoutes.js
│   │   └── commentRoutes.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── CreateTicketModal.jsx
    │   │   ├── TicketCard.jsx
    │   │   ├── CommentSection.jsx
    │   │   └── PrivateRoute.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── UserDashboard.jsx
    │   │   ├── AdminDashboard.jsx
    │   │   └── TicketDetail.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── utils/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── index.jsx
    │   └── index.css
    ├── public/
    │   └── index.html
    ├── package.json
    ├── tailwind.config.js
    └── postcss.config.js
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud - MongoDB Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Edit `.env` file with your settings:
   ```
   MONGODB_URI=mongodb://localhost:27017/supportdesk
   JWT_SECRET=your_jwt_secret_key_change_in_production
   PORT=5000
   NODE_ENV=development
   ```

4. **Start the backend server:**
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the React development server:**
   ```bash
   npm start
   ```
   Application will open at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Tickets
- `POST /api/tickets/create` - Create new ticket (protected)
- `GET /api/tickets/my-tickets` - Get user's tickets (protected)
- `GET /api/tickets/:id` - Get ticket details (protected)
- `PUT /api/tickets/:id` - Update ticket (protected)
- `DELETE /api/tickets/:id` - Delete ticket (protected)
- `GET /api/tickets` - Get all tickets (admin only)
- `GET /api/tickets/dashboard/stats` - Get dashboard statistics (admin only)

### Comments
- `POST /api/comments/create` - Add comment to ticket (protected)
- `GET /api/comments/:ticketId` - Get ticket comments (protected)
- `PUT /api/comments/:id` - Update comment (protected)
- `DELETE /api/comments/:id` - Delete comment (protected)

## User Roles

### User Role
- Create and manage personal tickets
- View personal tickets
- Add comments to their tickets
- Update ticket status (limited)

### Admin Role
- View all tickets
- Filter and search tickets
- Assign tickets to support staff
- Update ticket status and priority
- Add admin comments
- View dashboard statistics

## Testing with Postman

1. Import the API endpoints into Postman
2. Test user registration: `POST /api/auth/register`
   ```json
   {
     "name": "John Doe",
     "email": "john@example.com",
     "password": "password123"
   }
   ```

3. Test login: `POST /api/auth/login`
   ```json
   {
     "email": "john@example.com",
     "password": "password123"
   }
   ```

4. Use the JWT token in Authorization header for protected routes:
   ```
   Authorization: Bearer <your_jwt_token>
   ```

## MongoDB Collections

### Users
```json
{
  "_id": ObjectId,
  "name": "John Doe",
  "email": "john@example.com",
  "password": "hashed_password",
  "role": "user",
  "profile": {
    "phone": "1234567890",
    "department": "Engineering",
    "avatar": "url"
  },
  "isActive": true,
  "createdAt": Date,
  "updatedAt": Date
}
```

### Tickets
```json
{
  "_id": ObjectId,
  "title": "Cannot login",
  "description": "I cannot login to my account",
  "category": "Account",
  "priority": "High",
  "status": "Open",
  "userId": ObjectId,
  "assignedTo": ObjectId,
  "attachments": [],
  "resolution": "Password reset sent",
  "createdAt": Date,
  "updatedAt": Date
}
```

### Comments
```json
{
  "_id": ObjectId,
  "ticketId": ObjectId,
  "userId": ObjectId,
  "text": "We are investigating this issue",
  "isAdminComment": true,
  "createdAt": Date,
  "updatedAt": Date
}
```

## Environment Variables

### Server (.env)
```
MONGODB_URI=mongodb://localhost:27017/supportdesk
JWT_SECRET=your_secret_key_here
PORT=5000
NODE_ENV=development
```

## Technologies Used

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-Origin Resource Sharing

### Frontend
- **React 18** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Context API** - State management

## Future Enhancements

1. **Real-time Updates**
   - Socket.io for live notifications
   - Real-time ticket status updates

2. **Email Notifications**
   - Nodemailer integration
   - Email alerts for ticket updates

3. **File Upload**
   - Multer for file handling
   - Cloud storage integration (AWS S3)

4. **Advanced Features**
   - Analytics dashboard
   - Role-based access control (RBAC)
   - Dark/Light theme toggle
   - Ticket templates
   - SLA management

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running locally or check Atlas connection string
- Verify `MONGODB_URI` in `.env` file

### JWT Token Errors
- Clear localStorage in browser
- Re-login to get a new token
- Check JWT_SECRET consistency

### CORS Errors
- Ensure backend is running on port 5000
- Check CORS middleware configuration

## License
MIT

## Support
For issues or questions, please create an issue in the repository.
