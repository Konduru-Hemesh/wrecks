# Quick Deployment Checklist

Follow these steps to deploy your FlowCast application:

## ✅ Pre-Deployment Checklist

### 1. Email Validation ✅
- ✅ Added email format validation in backend
- ✅ Email is normalized (lowercase, trimmed)
- ✅ Invalid emails are rejected

### 2. Text Fixes ✅
- ✅ Changed "Sign in" to "Login" on signup page

### 3. Database Setup (MongoDB Atlas)

**Step 1: Create MongoDB Atlas Account**
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a free cluster (M0 Sandbox)

**Step 2: Get Connection String**
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database password
5. Replace `<dbname>` with `flowcast`

**Example:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/flowcast?retryWrites=true&w=majority
```

**Step 3: Configure Network Access**
1. Go to "Network Access"
2. Click "Add IP Address"
3. For production: Click "Allow Access from Anywhere" (0.0.0.0/0)

### 4. Environment Variables

**Backend (`backend/.env`):**
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/flowcast?retryWrites=true&w=majority
JWT_SECRET=your-strong-random-secret-here
JWT_EXPIRE=7d
FRONTEND_URL=https://your-frontend.vercel.app
BACKEND_URL=https://your-backend.railway.app
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**Frontend (`.env.local` in root):**
```env
NEXT_PUBLIC_BACKEND_URL=https://your-backend.railway.app/api
```

### 5. Generate JWT Secret

**Linux/Mac:**
```bash
openssl rand -base64 32
```

**Windows PowerShell:**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

## 🚀 Deployment Steps

### Frontend (Vercel)
1. Push code to GitHub
2. Go to https://vercel.com
3. Import repository
4. Add environment variable: `NEXT_PUBLIC_BACKEND_URL`
5. Deploy!

### Backend (Railway - Easiest)
1. Go to https://railway.app
2. Sign up with GitHub
3. New Project → Deploy from GitHub
4. Select your repository
5. Add all environment variables from `backend/.env`
6. Set root directory to `backend` (if needed)
7. Deploy!

## 🔍 Testing After Deployment

1. ✅ Try creating account with invalid email (should fail)
2. ✅ Try creating account with valid email (should work)
3. ✅ Try logging in
4. ✅ Check MongoDB Atlas dashboard - data should appear
5. ✅ Test all features

## 📝 Important Notes

- **Never commit `.env` files to Git**
- **Use strong passwords for database**
- **JWT_SECRET should be random and secure**
- **Update Google OAuth redirect URIs for production**

For detailed instructions, see `DEPLOYMENT_GUIDE.md`
