# 🚀 Setup Instructions

## Prerequisites
- Node.js 18+ installed
- MongoDB installed locally OR MongoDB Atlas account
- Git installed

## Step-by-Step Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/vistanoop/genAi_receipt.git
cd genAi_receipt

# Checkout the implementation branch
git checkout copilot/add-user-authentication-system

# Install dependencies
npm install
```

### 2. MongoDB Setup

**Option A - Local MongoDB:**
```bash
# Install MongoDB (if not installed)
# macOS
brew install mongodb-community

# Ubuntu/Debian
sudo apt-get install mongodb

# Start MongoDB
mongod

# Verify it's running
mongo --eval "db.version()"
```

**Option B - MongoDB Atlas (Cloud - Recommended):**
1. Go to https://cloud.mongodb.com
2. Create a free account
3. Create a new cluster (free tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password

### 3. Get Gemini API Key

1. Visit https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the generated key

### 4. Configure Environment

Create `.env.local` in the project root:

```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local with your values
```

Your `.env.local` should look like:

```bash
# Gemini AI API Key (from step 3)
GEMINI_API_KEY=AIzaSy...your_actual_key_here

# MongoDB Connection String
# Local:
MONGODB_URI=mongodb://localhost:27017/expense_tracker
# OR Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/expense_tracker

# JWT Secret (use a strong random string)
JWT_SECRET=your-very-secure-random-secret-key-min-32-chars

# Environment
NODE_ENV=development
```

**Generate a secure JWT secret:**
```bash
# Option 1: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 2: OpenSSL
openssl rand -hex 32

# Option 3: Online
# Visit: https://generate-secret.vercel.app/32
```

### 5. Verify Setup

```bash
# Check environment variables are loaded
node -e "console.log(process.env.GEMINI_API_KEY ? '✓ Gemini API Key set' : '✗ Missing')"

# Test MongoDB connection
node -e "const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test').then(() => {console.log('✓ MongoDB connected'); process.exit(0)}).catch(err => {console.error('✗ MongoDB error:', err.message); process.exit(1)})"
```

### 6. Run Development Server

```bash
npm run dev
```

You should see:
```
▲ Next.js 15.5.9
- Local: http://localhost:3000
```

### 7. Test the Application

1. **Open browser:** http://localhost:3000
2. **Click "Sign Up"**
3. **Create account:**
   - Name: Your Name
   - Email: test@example.com
   - Password: Test123 (must have uppercase, lowercase, number)
   - Confirm Password: Test123
4. **You should be redirected to dashboard**
5. **Test logout** (button in top right)
6. **Test login** with the same credentials

### 8. Complete Dashboard Integration

The dashboard UI is ready but needs backend connection. Follow the guide:

```bash
# Open the implementation guide
cat DASHBOARD_IMPLEMENTATION.md
```

Key tasks:
1. Update dashboard to fetch user data
2. Connect to expense APIs
3. Add delete functionality
4. Implement smart warnings
5. Update charts with real data

Estimated time: 2-3 hours with the guide.

## Troubleshooting

### MongoDB Connection Error

**Error:** `MongoServerError: connect ECONNREFUSED`

**Solution:**
- Check MongoDB is running: `mongod --version`
- Start MongoDB: `mongod` or `brew services start mongodb-community`
- Or use MongoDB Atlas instead

### JWT Secret Warning

**Warning:** `WARNING: JWT_SECRET is not set`

**Solution:**
- Make sure `.env.local` exists
- Check JWT_SECRET is set in `.env.local`
- Restart the dev server after creating `.env.local`

### Gemini API Error

**Error:** `Failed to scan receipt`

**Solution:**
- Verify GEMINI_API_KEY in `.env.local`
- Check API key is valid at https://makersuite.google.com
- Ensure you haven't exceeded free tier limits

### Port Already in Use

**Error:** `Port 3000 is already in use`

**Solution:**
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or run on different port
npm run dev -- -p 3001
```

### Build Errors

**Error:** Module not found or syntax errors

**Solution:**
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try building
npm run build
```

## Testing Checklist

Once setup is complete, test:

- [ ] Signup creates new user
- [ ] Login works with correct credentials
- [ ] Login fails with wrong credentials
- [ ] Dashboard loads after login
- [ ] Logout clears session
- [ ] Cannot access dashboard without login
- [ ] Receipt scanner API works (upload image)

## Production Deployment

### Environment Variables for Production

```bash
GEMINI_API_KEY=your_production_key
MONGODB_URI=mongodb+srv://...your_atlas_connection
JWT_SECRET=very_long_secure_random_string_at_least_32_chars
NODE_ENV=production
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# vercel.com → Your Project → Settings → Environment Variables
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod

# Set environment variables in Netlify dashboard
```

## Next Steps

1. **Complete setup** using this guide
2. **Test authentication** flows
3. **Follow dashboard integration guide** (`DASHBOARD_IMPLEMENTATION.md`)
4. **Test complete application**
5. **Deploy to production**

## Need Help?

- **Setup issues:** Check troubleshooting section above
- **Implementation questions:** See `DASHBOARD_IMPLEMENTATION.md`
- **Project overview:** Read `PROJECT_SUMMARY.md`
- **Status check:** Review `IMPLEMENTATION_STATUS.md`

## Quick Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run linter

# Database
mongod               # Start local MongoDB
mongo                # Open MongoDB shell

# Useful
npm list             # List installed packages
node --version       # Check Node version
npm --version        # Check npm version
```

## File Structure

```
genAi_receipt/
├── app/
│   ├── api/
│   │   ├── auth/          # Authentication endpoints
│   │   ├── expenses/      # Expense management
│   │   └── scan-receipt/  # Receipt scanner
│   ├── dashboard/         # Dashboard page
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   └── layout.js          # Root layout
├── models/
│   ├── User.js            # User data model
│   └── Expense.js         # Expense data model
├── lib/
│   ├── db.js              # Database connection
│   ├── jwt.js             # JWT utilities
│   └── auth.js            # Auth middleware
├── components/            # Reusable UI components
├── .env.local             # Environment variables (create this)
├── .env.example           # Environment template
└── package.json           # Dependencies

Documentation/
├── README.md              # Main docs
├── PROJECT_SUMMARY.md     # Complete summary
├── IMPLEMENTATION_STATUS.md  # Status report
├── DASHBOARD_IMPLEMENTATION.md  # Integration guide
└── SETUP_INSTRUCTIONS.md  # This file
```

## Success Indicators

✅ Server starts without errors  
✅ Can access http://localhost:3000  
✅ Signup creates new account  
✅ Login redirects to dashboard  
✅ Logout works correctly  
✅ MongoDB connection successful  
✅ No console errors  

Once all indicators are green, you're ready to complete the dashboard integration!

---

**Estimated Setup Time: 15-30 minutes**  
**Next: Dashboard Integration (2-3 hours)**  
**Total to Production: ~4 hours**
