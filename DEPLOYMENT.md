# Deployment Guide - Support Desk MERN Application

## 🌐 Deployment Options

This guide covers deploying your Support Desk application to production using popular platforms.

---

## Backend Deployment

### Option 1: Deploy to Heroku (Free tier available)

#### Prerequisites
- Heroku account (sign up at https://heroku.com)
- Heroku CLI installed

#### Steps

1. **Login to Heroku:**
   ```bash
   heroku login
   ```

2. **Create Heroku app:**
   ```bash
   cd server
   heroku create your-app-name
   ```

3. **Set environment variables:**
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_atlas_uri
   heroku config:set JWT_SECRET=your_secure_jwt_secret
   heroku config:set NODE_ENV=production
   ```

4. **Deploy:**
   ```bash
   git push heroku main
   ```

5. **View logs:**
   ```bash
   heroku logs --tail
   ```

### Option 2: Deploy to Railway

#### Steps

1. **Sign up at railway.app**

2. **Connect your GitHub repository**

3. **Add MongoDB plugin from Railway**

4. **Set environment variables in Railway dashboard**

5. **Deploy - automatic on push**

### Option 3: Deploy to Render

#### Steps

1. **Go to render.com and sign up**

2. **Create new Web Service**

3. **Connect GitHub repository**

4. **Set build and start commands:**
   - Build: `npm install`
   - Start: `npm start`

   > Note: When deploying to Render, set `CLIENT_URL` to your Vercel frontend URL (e.g. `https://your-app.vercel.app`) so the backend only allows requests from your frontend.

5. **Set environment variables**

6. **Deploy**

---

## Frontend Deployment

### Option 1: Deploy to Vercel (Recommended)

#### Steps

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy from client directory:**
   ```bash
   cd client
   vercel
   ```

3. **Configure environment variables:**
   - Create `.env.production.local` in client directory:
   ```
   REACT_APP_API_URL=https://your-backend-url.com
   ```

  - On Vercel: set `REACT_APP_API_URL` to your backend URL (e.g. `https://your-backend.onrender.com`) in the Vercel project settings under Environment Variables.

4. **Redeploy:**
   ```bash
   vercel --prod
   ```

### Option 2: Deploy to Netlify

#### Steps

1. **Build the React app:**
   ```bash
   cd client
   npm run build
   ```

2. **Drag and drop `build` folder to netlify.com**

3. **Set environment variables in Netlify dashboard:**
   - `REACT_APP_API_URL=https://your-backend-url.com`

4. **Configure redirects:**
   - Create `public/_redirects` file:
   ```
   /* /index.html 200
   ```

### Option 3: Deploy to GitHub Pages

```bash
cd client
npm run build
npm install gh-pages --save-dev
```

Update `package.json`:
```json
{
  "homepage": "https://yourusername.github.io/repository-name",
  "scripts": {
    "deploy": "npm run build && gh-pages -d build"
  }
}
```

Deploy:
```bash
npm run deploy
```

---

## Database Deployment

### MongoDB Atlas Setup (Free Tier)

1. **Go to mongodb.com/cloud/atlas**

2. **Create free account**

3. **Create a new cluster:**
   - Select Free tier
   - Choose region closest to your users
   - Click "Create Cluster"

4. **Create database user:**
   - Go to Database Access
   - Create new user with password
   - Save credentials

5. **Whitelist IP:**
   - Go to Network Access
   - Add your IP or allow all (0.0.0.0/0)

6. **Get connection string:**
   - Click "Connect" on cluster
   - Copy connection string
   - Replace `<username>` and `<password>`

7. **Use in `.env`:**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/supportdesk
   ```

---

## Environment Variables Setup

### Backend Production Variables

```env
# Production Server
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/supportdesk
JWT_SECRET=use-a-strong-random-string-here
PORT=5000
NODE_ENV=production
```

Add these for Render (in Render dashboard environment variables):

```
MONGODB_URI=...        # MongoDB Atlas connection string
JWT_SECRET=...         # strong secret
NODE_ENV=production
CLIENT_URL=https://your-frontend.vercel.app
```

### Frontend Production Variables

In `client/.env.production.local`:
```env
REACT_APP_API_URL=https://your-backend-domain.com
```

On Vercel set the same `REACT_APP_API_URL` env variable (Vercel exposes these at build time). Also set `NODE_ENV=production` on Vercel if needed.

---

## Continuous Deployment (CI/CD)

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Install dependencies
      run: |
        cd server && npm install
        cd ../client && npm install
    
    - name: Build frontend
      run: cd client && npm run build
    
    - name: Deploy to Vercel
      run: cd client && npx vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
    
    - name: Deploy to Heroku
      run: |
        cd server
        git push https://heroku:${{ secrets.HEROKU_API_KEY }}@git.heroku.com/${{ secrets.HEROKU_APP_NAME }}.git main
```

---

## Security Checklist

- [ ] Change JWT_SECRET to a strong, unique value
- [ ] Use HTTPS for all connections
- [ ] Set secure MongoDB connection string
- [ ] Enable CORS only for your frontend domain
- [ ] Use environment variables for all sensitive data
- [ ] Enable MongoDB IP whitelist
- [ ] Set NODE_ENV=production
- [ ] Use strong passwords for admin accounts
- [ ] Enable HTTPS/SSL certificates
- [ ] Setup regular database backups

---

## Performance Optimization

### Backend
- Enable gzip compression in Express
- Add caching headers
- Optimize database queries
- Use connection pooling

### Frontend
- Code splitting with React.lazy()
- Optimize images
- Minify CSS and JS
- Use CDN for static files

---

## Troubleshooting Deployment

### Backend won't start
```bash
# Check logs
heroku logs --tail

# Check environment variables
heroku config
```

### Database connection error
- Verify MongoDB URI is correct
- Check IP is whitelisted in MongoDB Atlas
- Ensure database user has correct permissions

### CORS errors
- Update backend CORS configuration
- Ensure frontend URL matches backend whitelist

### Frontend not loading
- Check API endpoint environment variables
- Verify backend is accessible from frontend
- Clear browser cache

---

## Monitoring & Logging

### Backend Monitoring
- Use services like Sentry for error tracking
- Setup email alerts for critical errors
- Monitor server logs regularly

### Frontend Monitoring
- Use Sentry for frontend errors
- Google Analytics for user behavior
- Performance monitoring tools

---

## Scaling Considerations

1. **Database**: Start with MongoDB Atlas free tier, upgrade as needed
2. **Backend**: Use load balancing (Heroku/Railway handles this)
3. **Frontend**: CDN automatically handles distribution
4. **Caching**: Implement Redis for session management
5. **Queue**: Use Bull/RabbitMQ for async tasks

---

## Cost Estimation

**Monthly costs (approximate):**
- Backend (Heroku): $7-25/month
- Frontend (Vercel): Free-20/month
- Database (MongoDB Atlas): Free-50/month
- Domain: $10-15/year

**Total: $15-50/month for small-medium deployments**

---

## Final Checklist Before Going Live

- [ ] Test all features in production environment
- [ ] Verify email notifications (if implemented)
- [ ] Test user registration and login
- [ ] Test ticket creation and management
- [ ] Test admin features
- [ ] Verify comment system
- [ ] Check responsive design on mobile
- [ ] Test error handling
- [ ] Monitor performance metrics
- [ ] Setup backups
- [ ] Create runbook for common issues
- [ ] Document deployment process

---

## Rollback Procedure

If something goes wrong:

**Heroku:**
```bash
heroku releases
heroku rollback v4
```

**Vercel:**
- Go to Vercel dashboard
- Select previous deployment
- Promote to production

**Render:**
- Go to deployment history
- Redeploy previous version

---

## Getting Help

- Backend issues: Check Heroku/Railway logs
- Frontend issues: Check browser console (F12)
- Database issues: Check MongoDB Atlas dashboard
- General: Review README.md and QUICK_START.md

Happy deploying! 🚀
