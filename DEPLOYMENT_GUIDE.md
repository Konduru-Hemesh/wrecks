# Deployment Guide for FlowCast

This guide will help you deploy FlowCast to production with MongoDB Atlas (cloud database) so it works after hosting.

## Table of Contents
1. [MongoDB Atlas Setup](#mongodb-atlas-setup)
2. [Environment Variables](#environment-variables)
3. [Frontend Deployment](#frontend-deployment)
4. [Backend Deployment](#backend-deployment)
5. [Testing After Deployment](#testing-after-deployment)

---

## 1. MongoDB Atlas Setup (Cloud Database)

### Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Try Free" and sign up for a free account
3. Verify your email

### Step 2: Create a Cluster
1. After logging in, click "Build a Database"
2. Choose **FREE** tier (M0 Sandbox)
3. Select a cloud provider (AWS, Google Cloud, or Azure)
4. Choose a region closest to your users
5. Click "Create Cluster"
6. Wait 3-5 minutes for cluster to be created

### Step 3: Create Database User
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Enter username and password (save these securely!)
5. Set user privileges to "Atlas admin" or "Read and write to any database"
6. Click "Add User"

### Step 4: Whitelist IP Address
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. For development: Click "Add Current IP Address"
4. For production: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - ⚠️ **Security Note**: Only do this if you have proper authentication (which you do!)
5. Click "Confirm"

### Step 5: Get Connection String
1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" and version "5.5 or later"
5. Copy the connection string (looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`)
6. Replace `<password>` with your database user password
7. Replace `<dbname>` with your database name (e.g., `flowcast`)

**Example Connection String:**
```
mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/flowcast?retryWrites=true&w=majority
```

---

## 2. Environment Variables

### Backend Environment Variables

Create/update `backend/.env`:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# MongoDB Atlas Connection (Replace with your connection string)
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/flowcast?retryWrites=true&w=majority

# JWT Secret (Generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-to-random-string
JWT_EXPIRE=7d

# Frontend URL (Your deployed frontend URL)
FRONTEND_URL=https://your-frontend-domain.com

# Backend URL (Your deployed backend URL)
BACKEND_URL=https://your-backend-domain.com

# Google OAuth (If using Google login)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Frontend Environment Variables

Create/update `.env.local` in the root directory:

```env
# Backend API URL (Your deployed backend URL)
NEXT_PUBLIC_BACKEND_URL=https://your-backend-domain.com/api
```

### Generate Secure JWT Secret

Run this command to generate a secure JWT secret:

```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

---

## 3. Frontend Deployment (Vercel - Recommended)

### Step 1: Prepare for Deployment
1. Make sure all your code is committed to Git
2. Push to GitHub/GitLab/Bitbucket

### Step 2: Deploy to Vercel
1. Go to [Vercel](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "Add New Project"
4. Import your repository
5. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./Wreck-It-Ralph` (or your project root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
6. Add Environment Variables:
   - `NEXT_PUBLIC_BACKEND_URL` = Your backend URL
7. Click "Deploy"

### Step 3: Update Backend CORS
After getting your Vercel URL, update `backend/.env`:
```env
FRONTEND_URL=https://your-app.vercel.app
```

And update your backend CORS settings in `backend/server.js` to allow your Vercel domain.

---

## 4. Backend Deployment (Railway, Render, or Heroku)

### Option A: Railway (Recommended - Easy)

1. Go to [Railway](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub"
4. Select your repository
5. Railway will auto-detect Node.js
6. Add Environment Variables:
   - Copy all variables from `backend/.env`
7. Set Root Directory to `backend` (if needed)
8. Deploy!

**Railway will give you a URL like:** `https://your-app.railway.app`

### Option B: Render

1. Go to [Render](https://render.com)
2. Sign up with GitHub
3. Click "New" → "Web Service"
4. Connect your repository
5. Configure:
   - **Name**: flowcast-backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend`
6. Add Environment Variables (from your `.env`)
7. Deploy!

### Option C: Heroku

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Set environment variables:
   ```bash
   heroku config:set MONGODB_URI=your-connection-string
   heroku config:set JWT_SECRET=your-secret
   heroku config:set FRONTEND_URL=your-frontend-url
   heroku config:set BACKEND_URL=https://your-app-name.herokuapp.com
   ```
5. Deploy: `git push heroku main`

---

## 5. Update CORS in Backend

Update `backend/server.js` to allow your frontend domain:

```javascript
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
```

---

## 6. Update Google OAuth (If Using)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Update OAuth credentials:
   - Add your production frontend URL to "Authorized JavaScript origins"
   - Add your production callback URL to "Authorized redirect URIs"
   - Example: `https://your-backend.com/api/auth/google/callback`

---

## 7. Testing After Deployment

### Test Checklist:
- [ ] Frontend loads correctly
- [ ] Can create account with valid email
- [ ] Cannot create account with invalid email
- [ ] Can login with created account
- [ ] Google login works (if enabled)
- [ ] Dashboard loads after login
- [ ] Data persists (check MongoDB Atlas dashboard)
- [ ] Logout works
- [ ] Settings page works
- [ ] Account deletion works

### Check MongoDB Atlas:
1. Go to MongoDB Atlas dashboard
2. Click "Browse Collections"
3. You should see your `users` and `expenses` collections
4. Verify data is being saved

---

## 8. Security Checklist

- [ ] JWT_SECRET is strong and random
- [ ] MongoDB password is strong
- [ ] Environment variables are not in Git
- [ ] CORS is configured correctly
- [ ] HTTPS is enabled (Vercel/Railway provide this automatically)
- [ ] Database user has appropriate permissions

---

## 9. Troubleshooting

### Database Connection Issues
- Check MongoDB Atlas IP whitelist includes your server IP
- Verify connection string has correct password
- Check database user has correct permissions

### CORS Errors
- Verify `FRONTEND_URL` in backend matches your actual frontend URL
- Check `NEXT_PUBLIC_BACKEND_URL` in frontend matches your backend URL
- Ensure credentials are included in fetch requests

### Authentication Issues
- Verify JWT_SECRET is the same (if using multiple servers)
- Check cookies are being set (browser DevTools → Application → Cookies)
- Ensure backend URL is accessible

---

## 10. Quick Reference

### Local Development URLs:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`
- MongoDB: `mongodb://localhost:27017/flowcast` (local) or MongoDB Atlas (cloud)

### Production URLs:
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-backend.railway.app`
- MongoDB: MongoDB Atlas connection string

---

## Need Help?

If you encounter issues:
1. Check server logs (Railway/Render/Heroku dashboard)
2. Check browser console for errors
3. Verify all environment variables are set correctly
4. Test database connection separately

---

**Important Notes:**
- MongoDB Atlas free tier is perfect for small to medium applications
- Vercel free tier is excellent for Next.js apps
- Railway/Render free tiers are good for backend hosting
- Always use environment variables for sensitive data
- Never commit `.env` files to Git
