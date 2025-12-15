# Quick Start Guide - Support Desk MERN Application

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Dependencies

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd ../client
npm install
```

### Step 2: Setup MongoDB

Choose one option:

**Option A: Local MongoDB**
- Install MongoDB Community Edition
- Start MongoDB service
- Connection string: `mongodb://localhost:27017/supportdesk`

**Option B: MongoDB Atlas (Cloud)**
- Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create free cluster
- Get connection string
- Add connection string to `.env`

### Step 3: Configure Environment Variables

**Backend (.env file):**
```
MONGODB_URI=mongodb://localhost:27017/supportdesk
JWT_SECRET=my_super_secret_key_123
PORT=5000
NODE_ENV=development
```

### Step 4: Start the Application

**Terminal 1 - Backend (from project root):**
```bash
cd server
npm run dev
```
Backend will run on: `http://localhost:5000`

**Terminal 2 - Frontend (from project root):**
```bash
cd client
npm start
```
Frontend will run on: `http://localhost:3000`

---

## 📝 Testing the Application

### 1. User Registration
- Navigate to `http://localhost:3000/register`
- Create an account with:
  - Name: "John Doe"
  - Email: "john@example.com"
  - Password: "password123"

### 2. User Login
- Go to `http://localhost:3000/login`
- Login with your credentials
- You'll be redirected to User Dashboard

### 3. Create a Ticket (User)
- Click "Create New Ticket" button
- Fill in:
  - Title: "Cannot reset password"
  - Description: "I'm unable to reset my password"
  - Category: "Account"
  - Priority: "High"
- Click "Create Ticket"

### 4. View Tickets
- See your created ticket in the dashboard
- Click on any ticket to view details
- Add comments to interact with support team

### 5. Admin Features (Testing)

To test admin features, create an admin account directly in MongoDB:

```javascript
// In MongoDB Compass or terminal
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

Or modify `authController.js` temporarily to allow admin registration:
```javascript
role: req.body.role || 'admin', // Change to 'admin' for testing
```

### Admin Dashboard Features:
- View all tickets from all users
- Filter by Status, Priority, Category
- See dashboard statistics
- Assign tickets to support staff
- Update ticket status
- Add resolutions
- Admin comments appear with "Admin" badge

---

## 🛠️ Postman API Testing

### 1. Register User
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "password456"
}
```

### 2. Login
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "jane@example.com",
  "password": "password456"
}
```
*Copy the token from response*

### 3. Create Ticket (Use token from login)
```
POST http://localhost:5000/api/tickets/create
Content-Type: application/json
Authorization: Bearer <your_token_here>

{
  "title": "Network connectivity issue",
  "description": "Unable to connect to office WiFi",
  "category": "Network",
  "priority": "High"
}
```

### 4. Get My Tickets
```
GET http://localhost:5000/api/tickets/my-tickets
Authorization: Bearer <your_token_here>
```

### 5. Get All Tickets (Admin only)
```
GET http://localhost:5000/api/tickets?status=Open&priority=High
Authorization: Bearer <admin_token_here>
```

### 6. Update Ticket (Admin)
```
PUT http://localhost:5000/api/tickets/<ticket_id>
Authorization: Bearer <admin_token_here>
Content-Type: application/json

{
  "status": "In Progress",
  "priority": "Medium",
  "assignedTo": "<admin_user_id>"
}
```

### 7. Add Comment
```
POST http://localhost:5000/api/comments/create
Authorization: Bearer <your_token_here>
Content-Type: application/json

{
  "ticketId": "<ticket_id>",
  "text": "We are investigating this issue. Please wait for updates."
}
```

### 8. Get Comments
```
GET http://localhost:5000/api/comments/<ticket_id>
Authorization: Bearer <your_token_here>
```

---

## 📊 Database Structure

### Collections in MongoDB

**Users:**
- Registration credentials
- Roles (user/admin)
- Profile information

**Tickets:**
- Created by users
- Managed by admins
- Status tracking
- Priority and category

**Comments:**
- Communication between users and admins
- Marked as admin/user comments
- Timestamps for tracking

---

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| MongoDB connection error | Ensure MongoDB is running, check connection string |
| Port 5000 in use | Change PORT in .env or kill process using port |
| Node modules not found | Run `npm install` in both server and client |
| CORS error | Ensure backend is running, check browser console |
| Cannot login | Verify credentials, check MongoDB database |
| JWT token invalid | Clear browser localStorage, re-login |

---

## 📚 Project Features Checklist

- ✅ User authentication (JWT)
- ✅ Registration & Login
- ✅ Ticket creation
- ✅ Ticket status tracking
- ✅ Category and priority system
- ✅ Comment system
- ✅ Admin dashboard
- ✅ Ticket filtering
- ✅ Dashboard statistics
- ✅ Protected routes
- ✅ Role-based access
- ✅ Responsive UI with Tailwind CSS

---

## 🚀 Next Steps

1. **Deploy Backend**: Use Heroku, Railway, or Render
2. **Deploy Frontend**: Use Vercel or Netlify
3. **Use MongoDB Atlas**: Cloud database
4. **Add Email Notifications**: Nodemailer integration
5. **Real-time Updates**: Socket.io implementation
6. **File Uploads**: Multer + Cloud storage (AWS S3)

---

## 📞 Support

For help:
1. Check the main README.md
2. Review console logs in terminal
3. Check browser console (F12)
4. Verify MongoDB connection
5. Ensure both servers are running

Happy coding! 🎉
