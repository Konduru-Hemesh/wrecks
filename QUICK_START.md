# Quick Start Guide

## 🚀 Get Your Backend Running in 5 Minutes

### Step 1: Setup Backend

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file (copy from ENV_SETUP.md or use the template below)
```

### Step 2: Create `.env` file in `backend/` folder

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/spendahead
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

**For MongoDB Atlas (Cloud):**
Replace `MONGODB_URI` with:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/spendahead?retryWrites=true&w=majority
```

### Step 3: Start Backend Server

```bash
# In backend folder
npm run dev
```

You should see:
```
✅ MongoDB Connected: ...
🚀 Server running on port 5000
```

### Step 4: Start Frontend (in a new terminal)

```bash
# In project root (Wreck-It-Ralph)
npm run dev
```

### Step 5: Test It!

1. Open `http://localhost:3000`
2. Click "Sign Up" or "Login"
3. Create an account or login
4. You should be redirected to the dashboard!

## 📝 MongoDB Setup

### Option A: Local MongoDB
1. Install MongoDB from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service
3. Use: `MONGODB_URI=mongodb://localhost:27017/spendahead`

### Option B: MongoDB Atlas (Free Cloud)
1. Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Create database user
4. Whitelist your IP (or 0.0.0.0/0 for development)
5. Get connection string and update `.env`

## ✅ Verification

**Backend Health Check:**
```bash
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Backend API is running"
}
```

## 🐛 Troubleshooting

**Backend won't start:**
- Check if MongoDB is running
- Verify `.env` file exists and has correct values
- Check if port 5000 is available

**Can't connect to MongoDB:**
- Verify MongoDB connection string
- Check MongoDB service is running
- For Atlas: Check IP whitelist

**Frontend can't reach backend:**
- Make sure backend is running on port 5000
- Check CORS settings in backend `.env`
- Verify `API_BASE_URL` in `lib/apiConfig.js`

## 📚 More Info

- Detailed setup: See `BACKEND_SETUP.md`
- Backend docs: See `backend/README.md`
